import { createHmac } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { z } from "zod";

export const runtime = "nodejs";

const MAX_BODY_BYTES = 12_000;
const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW_SECONDS = 10 * 60;
const GENERIC_ERROR = "ناردنی پەیام سەرکەوتوو نەبوو؛ تکایە دواتر هەوڵ بدەوە.";
const TURNSTILE_EXPECTED_ACTION = "portfolio_contact";
const TURNSTILE_ALWAYS_PASS_TEST_SITE_KEY = "1x00000000000000000000AA";
const TURNSTILE_ALWAYS_PASS_TEST_SECRET =
  "1x0000000000000000000000000000000AA";

const contactSchema = z.strictObject({
  name: z.string().trim().min(2).max(80),
  email: z.string().trim().toLowerCase().email().max(254),
  subject: z
    .string()
    .trim()
    .min(2)
    .max(120)
    .refine((value) => !/[\r\n]/.test(value)),
  message: z.string().trim().min(10).max(4000),
  company: z.string().max(200),
  turnstileToken: z.string().max(2048),
  startedAt: z.number().int().positive(),
  submissionId: z.string().uuid(),
});

const smtpConfigSchema = z
  .strictObject({
    host: z.string().trim().min(1).max(253),
    port: z.number().int().min(1).max(65_535),
    secure: z.boolean(),
    user: z.string().trim().toLowerCase().email().max(254),
    appPassword: z.string().min(16).max(256),
    from: z.string().trim().toLowerCase().email().max(254),
    to: z.string().trim().toLowerCase().email().max(254),
  })
  .refine((config) => config.from === config.user);

type SmtpConfig = z.infer<typeof smtpConfigSchema>;

type TurnstileResult = {
  success?: boolean;
  hostname?: unknown;
  action?: unknown;
  "error-codes"?: unknown;
};

type TurnstileFailureStage =
  | "missing-secret"
  | "missing-token"
  | "request"
  | "http"
  | "invalid-response"
  | "siteverify"
  | "action"
  | "hostname";

type RateEntry = { count: number; resetAt: number };
const localRateStore = new Map<string, RateEntry>();

function json(message: string, status: number, extraHeaders?: HeadersInit) {
  return NextResponse.json(
    { message },
    {
      status,
      headers: {
        "Cache-Control": "no-store, max-age=0",
        ...extraHeaders,
      },
    },
  );
}

function envList(value: string | undefined) {
  return (value ?? "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function diagnosticText(value: unknown, maxLength: number) {
  return typeof value === "string"
    ? value.replace(/[\r\n\t]/g, " ").slice(0, maxLength)
    : null;
}

function logTurnstileFailure(
  stage: TurnstileFailureStage,
  result?: TurnstileResult,
) {
  if (process.env.NODE_ENV !== "development") return;

  const errorCodes = Array.isArray(result?.["error-codes"])
    ? result["error-codes"]
        .filter((value): value is string => typeof value === "string")
        .slice(0, 10)
        .map((value) => diagnosticText(value, 80))
        .filter((value): value is string => value !== null)
    : [];

  console.warn({
    stage,
    "error-codes": errorCodes,
    hostname: diagnosticText(result?.hostname, 253),
    action: diagnosticText(result?.action, 32),
  });
}

function getSmtpConfig(): SmtpConfig | null {
  const secureValue = process.env.SMTP_SECURE?.trim().toLowerCase();
  const portValue = process.env.SMTP_PORT?.trim() ?? "";
  const port = /^\d{1,5}$/.test(portValue) ? Number(portValue) : Number.NaN;

  const parsed = smtpConfigSchema.safeParse({
    host: process.env.SMTP_HOST,
    port,
    secure:
      secureValue === "true" ? true : secureValue === "false" ? false : undefined,
    user: process.env.SMTP_USER,
    appPassword: process.env.SMTP_APP_PASSWORD?.replace(/\s+/g, ""),
    from: process.env.CONTACT_FROM_EMAIL,
    to: process.env.CONTACT_TO_EMAIL,
  });

  return parsed.success ? parsed.data : null;
}

function getClientIp(request: NextRequest) {
  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return (
    request.headers.get("cf-connecting-ip") ||
    request.headers.get("x-real-ip") ||
    forwarded ||
    "unknown"
  );
}

function hashIp(ip: string) {
  const salt = process.env.CONTACT_RATE_LIMIT_SALT || "local-rate-limit-salt";
  return createHmac("sha256", salt).update(ip).digest("hex").slice(0, 32);
}

function checkLocalRateLimit(key: string) {
  const now = Date.now();
  const current = localRateStore.get(key);

  if (!current || current.resetAt <= now) {
    localRateStore.set(key, {
      count: 1,
      resetAt: now + RATE_LIMIT_WINDOW_SECONDS * 1000,
    });
    return { allowed: true, retryAfter: 0 };
  }

  current.count += 1;
  localRateStore.set(key, current);

  if (localRateStore.size > 2_000) {
    for (const [storedKey, entry] of localRateStore) {
      if (entry.resetAt <= now) localRateStore.delete(storedKey);
    }
  }

  return {
    allowed: current.count <= RATE_LIMIT_MAX,
    retryAfter: Math.max(1, Math.ceil((current.resetAt - now) / 1000)),
  };
}

async function checkDistributedRateLimit(key: string) {
  const endpoint = process.env.UPSTASH_REDIS_REST_URL?.replace(/\/$/, "");
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!endpoint || !token) return null;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5_000);

  try {
    const response = await fetch(`${endpoint}/multi-exec`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify([
        ["INCR", `portfolio-contact:${key}`],
        ["EXPIRE", `portfolio-contact:${key}`, RATE_LIMIT_WINDOW_SECONDS, "NX"],
      ]),
      signal: controller.signal,
      cache: "no-store",
    });

    if (!response.ok) throw new Error("Rate limit provider rejected the request");

    const result = (await response.json()) as Array<{ result?: number; error?: string }>;
    const count = Number(result[0]?.result ?? RATE_LIMIT_MAX + 1);
    return {
      allowed: count <= RATE_LIMIT_MAX,
      retryAfter: RATE_LIMIT_WINDOW_SECONDS,
    };
  } finally {
    clearTimeout(timeout);
  }
}

async function verifyTurnstile(token: string, ip: string) {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) {
    logTurnstileFailure("missing-secret");
    return false;
  }
  if (!token) {
    logTurnstileFailure("missing-token");
    return false;
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8_000);

  let response: Response;
  try {
    const body = new FormData();
    body.set("secret", secret);
    body.set("response", token);
    if (ip !== "unknown") body.set("remoteip", ip);

    response = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        body,
        signal: controller.signal,
        cache: "no-store",
      },
    );
  } catch {
    logTurnstileFailure("request");
    return false;
  } finally {
    clearTimeout(timeout);
  }

  if (!response.ok) {
    logTurnstileFailure("http");
    return false;
  }

  let result: TurnstileResult;
  try {
    result = (await response.json()) as TurnstileResult;
  } catch {
    logTurnstileFailure("invalid-response");
    return false;
  }

  if (result.success !== true) {
    logTurnstileFailure("siteverify", result);
    return false;
  }

  const isOfficialDevelopmentTestPair =
    process.env.NODE_ENV === "development" &&
    process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY?.trim() ===
      TURNSTILE_ALWAYS_PASS_TEST_SITE_KEY &&
    secret === TURNSTILE_ALWAYS_PASS_TEST_SECRET;

  // Cloudflare's official test response uses dummy metadata. Verification
  // success is still mandatory; only metadata checks are skipped for this
  // exact public test pair in local development.
  if (isOfficialDevelopmentTestPair) return true;

  if (result.action !== TURNSTILE_EXPECTED_ACTION) {
    logTurnstileFailure("action", result);
    return false;
  }

  const allowedHosts = envList(process.env.TURNSTILE_ALLOWED_HOSTNAMES);
  const hostname = typeof result.hostname === "string" ? result.hostname : "";
  const hostnameIsAllowed =
    allowedHosts.length > 0
      ? allowedHosts.includes(hostname)
      : process.env.NODE_ENV !== "production";

  if (!hostnameIsAllowed) {
    logTurnstileFailure("hostname", result);
    return false;
  }

  return true;
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

async function sendEmail(
  input: z.infer<typeof contactSchema>,
  smtpConfig: SmtpConfig,
) {
  const safeName = escapeHtml(input.name);
  const safeEmail = escapeHtml(input.email);
  const safeSubject = escapeHtml(input.subject);
  const safeMessage = escapeHtml(input.message).replace(/\n/g, "<br />");

  const currentYear = new Date().getFullYear();

  const text = [
    "پەیامێکی نوێ لە پۆرتفۆلیۆ",
    "",
    `ناو: ${input.name}`,
    `ئیمەیڵ: ${input.email}`,
    `بابەت: ${input.subject}`,
    "",
    "پەیام:",
    input.message,
    "",
    "Rahand M. JAFF",
  ].join("\n");

  const html = `
<!doctype html>
<html lang="ckb" dir="rtl">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="color-scheme" content="light" />
    <meta name="supported-color-schemes" content="light" />
    <title>پەیامێکی نوێ لە پۆرتفۆلیۆ</title>
  </head>

  <body
    style="
      margin: 0;
      padding: 0;
      background-color: #f3f4f6;
      font-family: Arial, Tahoma, sans-serif;
      direction: rtl;
    "
  >
    <table
      role="presentation"
      width="100%"
      cellspacing="0"
      cellpadding="0"
      border="0"
      style="
        width: 100%;
        background-color: #f3f4f6;
        margin: 0;
        padding: 0;
      "
    >
      <tr>
        <td align="center" style="padding: 32px 12px;">
          <table
            role="presentation"
            width="100%"
            cellspacing="0"
            cellpadding="0"
            border="0"
            style="
              width: 100%;
              max-width: 620px;
              background-color: #ffffff;
              border: 1px solid #e5e7eb;
              border-radius: 16px;
              overflow: hidden;
            "
          >

            <!-- Header -->
            <tr>
              <td
                style="
                  background-color: #271b11;
                  padding: 28px 28px 26px 28px;
                  text-align: center;
                "
              >
                <div
                  style="
                    display: inline-block;
                    width: 48px;
                    height: 48px;
                    line-height: 48px;
                    background-color: #fd8700;
                    color: #271b11;
                    font-size: 18px;
                    font-weight: 800;
                    border-radius: 10px;
                    margin-bottom: 14px;
                    text-align: center;
                  "
                >
                  RJ
                </div>

                <div
                  style="
                    color: #ffffff;
                    font-size: 20px;
                    font-weight: 700;
                    letter-spacing: 1px;
                    direction: ltr;
                  "
                >
                  RAHAND M. JAFF
                </div>

                <div
                  style="
                    color: #9ca3af;
                    font-size: 12px;
                    margin-top: 6px;
                    letter-spacing: 2px;
                    direction: ltr;
                  "
                >
                  PORTFOLIO CONTACT
                </div>
              </td>
            </tr>

            <!-- Intro -->
            <tr>
              <td style="padding: 32px 30px 12px 30px;">
                <div
                  style="
                    font-size: 23px;
                    font-weight: 700;
                    color: #271b11;
                    margin-bottom: 8px;
                  "
                >
                  پەیامێکی نوێت هەیە لە پۆرتفۆلیۆکەتەوە!
                </div>

                <div
                  style="
                    color: #807b6b;
                    font-size: 14px;
                    line-height: 1.9;
                  "
                >
                  کەسێک لە ڕێگەی فۆرمی پەیوەندی پۆرتفۆلیۆکەتەوە
                  پەیامێکی بۆ ناردوویت.
                </div>
              </td>
            </tr>

            <!-- Information -->
            <tr>
              <td style="padding: 18px 30px 8px 30px;">
                <table
                  role="presentation"
                  width="100%"
                  cellspacing="0"
                  cellpadding="0"
                  border="0"
                  style="
                    width: 100%;
                    background-color: #f9fafb;
                    border: 1px solid #e5e7eb;
                    border-radius: 12px;
                  "
                >

                  <tr>
                    <td
                      style="
                        padding: 17px 18px;
                        border-bottom: 1px solid #e5e7eb;
                      "
                    >
                      <div
                        style="
                          color: #9ca3af;
                          font-size: 11px;
                          margin-bottom: 6px;
                        "
                      >
                        ناو
                      </div>

                      <div
                        style="
                          color: #271b11;
                          font-size: 15px;
                          font-weight: 700;
                        "
                      >
                        ${safeName}
                      </div>
                    </td>
                  </tr>

                  <tr>
                    <td
                      style="
                        padding: 17px 18px;
                        border-bottom: 1px solid #e5e7eb;
                      "
                    >
                      <div
                        style="
                          color: #9ca3af;
                          font-size: 11px;
                          margin-bottom: 6px;
                        "
                      >
                        ئیمەیڵ
                      </div>

                      <div
                        style="
                          color: #271b11;
                          font-size: 14px;
                          font-weight: 600;
                          direction: ltr;
                          text-align: right;
                        "
                      >
                        ${safeEmail}
                      </div>
                    </td>
                  </tr>

                  <tr>
                    <td style="padding: 17px 18px;">
                      <div
                        style="
                          color: #9ca3af;
                          font-size: 11px;
                          margin-bottom: 6px;
                        "
                      >
                        بابەت
                      </div>

                      <div
                        style="
                          color: #271b11;
                          font-size: 15px;
                          font-weight: 700;
                        "
                      >
                        ${safeSubject}
                      </div>
                    </td>
                  </tr>

                </table>
              </td>
            </tr>

            <!-- Message -->
            <tr>
              <td style="padding: 22px 30px 8px 30px;">
                <div
                  style="
                    color: #271b11;
                    font-size: 13px;
                    font-weight: 700;
                    margin-bottom: 10px;
                  "
                >
                  پەیام
                </div>

                <div
                  style="
                    background-color: #ffffff;
                    border: 1px solid #d1d5db;
                    border-right: 4px solid #fd8700;
                    border-radius: 10px;
                    padding: 18px;
                    color: #514a37;
                    font-size: 14px;
                    line-height: 2;
                    word-break: break-word;
                  "
                >
                  ${safeMessage}
                </div>
              </td>
            </tr>

            <!-- Reply button -->
            <tr>
              <td
                align="center"
                style="
                  padding: 28px 30px 32px 30px;
                "
              >
                <a
                  href="mailto:${encodeURIComponent(input.email)}?subject=${encodeURIComponent(
                    `Re: ${input.subject}`,
                  )}"
                  style="
                    display: inline-block;
                    background-color: #271b11;
                    color: #ffffff;
                    text-decoration: none;
                    padding: 14px 28px;
                    border-radius: 8px;
                    font-size: 14px;
                    font-weight: 700;
                  "
                >
                  وەڵامدانەوە بە پەیام
                </a>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td
                style="
                  background-color: #f9fafb;
                  border-top: 1px solid #e5e7eb;
                  padding: 20px 30px;
                  text-align: center;
                "
              >
                <div
                  style="
                    color: #807a6b;
                    font-size: 11px;
                    line-height: 1.8;
                  "
                >
                  ئەم ئیمەیڵە بە شێوەی خۆکار لە فۆرمی پەیوەندی
                  پۆرتفۆلیۆکەتەوە نێردراوە.
                </div>

                <div
                  style="
                    color: #9ca3af;
                    font-size: 10px;
                    margin-top: 6px;
                    direction: ltr;
                  "
                >
                  © ${currentYear} Rahand M. Jaff
                </div>
              </td>
            </tr>

          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
  `.trim();

  const transporter = nodemailer.createTransport({
    host: smtpConfig.host,
    port: smtpConfig.port,
    secure: smtpConfig.secure,
    requireTLS: !smtpConfig.secure,

    auth: {
      user: smtpConfig.user,
      pass: smtpConfig.appPassword,
    },

    connectionTimeout: 10_000,
    greetingTimeout: 10_000,
    socketTimeout: 15_000,

    tls: {
      minVersion: "TLSv1.2",
    },

    disableFileAccess: true,
    disableUrlAccess: true,
    logger: false,
    debug: false,
  });

  try {
    await transporter.sendMail({
      from: {
        name: "Rahand Portfolio",
        address: smtpConfig.from,
      },

      to: smtpConfig.to,

      replyTo: {
        name: input.name,
        address: input.email,
      },

      subject: `پەیامی نوێ لە پۆرتفۆلیۆ — ${input.subject}`,

      text,
      html,
    });

    return true;
  } catch {
    return false;
  } finally {
    try {
      transporter.close();
    } catch {
      // Closing failures must not expose SMTP details
      // or alter the API response.
    }
  }
}

function originIsAllowed(request: NextRequest) {
  const origin = request.headers.get("origin");
  if (!origin) return process.env.NODE_ENV !== "production";

  const configuredOrigins = envList(process.env.CONTACT_ALLOWED_ORIGINS);
  const allowedOrigins = configuredOrigins.length
    ? configuredOrigins
    : [request.nextUrl.origin];
  return allowedOrigins.includes(origin);
}

export async function POST(request: NextRequest) {
  const contentType = request.headers.get("content-type") ?? "";
  const contentLength = Number(request.headers.get("content-length") ?? "0");
  const fetchSite = request.headers.get("sec-fetch-site");
  const smtpConfig = getSmtpConfig();

  if (
    !contentType.toLowerCase().startsWith("application/json") ||
    (contentLength > 0 && contentLength > MAX_BODY_BYTES) ||
    fetchSite === "cross-site" ||
    !originIsAllowed(request)
  ) {
    return json(GENERIC_ERROR, 400);
  }

  if (
    process.env.NODE_ENV === "production" &&
    (!smtpConfig || !process.env.TURNSTILE_SECRET_KEY)
  ) {
    return json("فۆرمی پەیوەندی هێشتا لەلایەن خاوەن ماڵپەڕەوە ڕێکنەخراوە.", 503);
  }

  let rawBody: unknown;
  try {
    const rawText = await request.text();
    if (new TextEncoder().encode(rawText).byteLength > MAX_BODY_BYTES) {
      return json(GENERIC_ERROR, 413);
    }
    rawBody = JSON.parse(rawText);
  } catch {
    return json(GENERIC_ERROR, 400);
  }

  const parsed = contactSchema.safeParse(rawBody);
  if (!parsed.success) {
    return json("تکایە هەموو خانەکان بە زانیاریی دروست پڕ بکەرەوە.", 400);
  }

  if (parsed.data.company) {
    return json("پەیامەکەت گەیشت؛ سوپاس.", 200);
  }

  const elapsed = Date.now() - parsed.data.startedAt;
  if (elapsed < 2_500 || elapsed > 24 * 60 * 60 * 1000) {
    return json(GENERIC_ERROR, 400);
  }

  const ip = getClientIp(request);
  const rateKey = hashIp(ip);
  let rateResult: { allowed: boolean; retryAfter: number };
  try {
    rateResult =
      (await checkDistributedRateLimit(rateKey)) ?? checkLocalRateLimit(rateKey);
  } catch {
    return json(GENERIC_ERROR, 503);
  }

  if (!rateResult.allowed) {
    return json(
      "ژمارەی هەوڵەکان زۆر بوو؛ تکایە کەمێک دواتر دووبارە هەوڵ بدەوە.",
      429,
      { "Retry-After": String(rateResult.retryAfter) },
    );
  }

  const captchaIsValid = await verifyTurnstile(parsed.data.turnstileToken, ip);
  if (!captchaIsValid) {
    return json("پشکنینی پاراستن سەرکەوتوو نەبوو؛ تکایە دووبارە هەوڵ بدەوە.", 400);
  }

  const sent = smtpConfig ? await sendEmail(parsed.data, smtpConfig) : false;
  if (!sent) return json(GENERIC_ERROR, 502);

  return json("پەیامەکەت گەیشت؛ زوو وەڵامت دەدرێتەوە.", 200);
}
