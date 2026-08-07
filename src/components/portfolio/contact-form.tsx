"use client";

import Script from "next/script";
import { FormEvent, useCallback, useEffect, useRef, useState } from "react";
import { ArrowIcon } from "./icons";

type FormState =
  | { kind: "idle"; message: string }
  | { kind: "sending"; message: string }
  | { kind: "success"; message: string }
  | { kind: "error"; message: string };

type TurnstileApi = {
  render: (
    element: HTMLElement,
    options: {
      sitekey: string;
      action: string;
      theme: "light";
      size: "flexible";
      callback: (token: string) => void;
      "expired-callback": () => void;
      "error-callback": () => void;
    },
  ) => string;
  reset: (widgetId?: string) => void;
  remove: (widgetId: string) => void;
};

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

const turnstileSiteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
const isProduction = process.env.NODE_ENV === "production";

export function ContactForm() {
  const [state, setState] = useState<FormState>({ kind: "idle", message: "" });
  const [captchaToken, setCaptchaToken] = useState("");
  const formRef = useRef<HTMLFormElement>(null);
  const captchaRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);
  const startedAtRef = useRef(0);

  useEffect(() => {
    startedAtRef.current = Date.now();
  }, []);

  const renderCaptcha = useCallback(() => {
    if (
      !turnstileSiteKey ||
      !captchaRef.current ||
      !window.turnstile ||
      widgetIdRef.current
    ) {
      return;
    }

    widgetIdRef.current = window.turnstile.render(captchaRef.current, {
      sitekey: turnstileSiteKey,
      action: "portfolio_contact",
      theme: "light",
      size: "flexible",
      callback: (token) => setCaptchaToken(token),
      "expired-callback": () => setCaptchaToken(""),
      "error-callback": () => {
        setCaptchaToken("");
        setState({
          kind: "error",
          message: "پشکنینی پاراستن سەرکەوتوو نەبوو؛ تکایە دووبارە هەوڵ بدەوە.",
        });
      },
    });
  }, []);

  useEffect(() => {
    return () => {
      if (widgetIdRef.current && window.turnstile) {
        window.turnstile.remove(widgetIdRef.current);
        widgetIdRef.current = null;
      }
    };
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (state.kind === "sending") return;

    if (turnstileSiteKey && !captchaToken) {
      setState({
        kind: "error",
        message: "تکایە پشکنینی «من ڕۆبۆت نیم» تەواو بکە.",
      });
      return;
    }

    const form = new FormData(event.currentTarget);
    const payload = {
      name: String(form.get("name") ?? ""),
      email: String(form.get("email") ?? ""),
      subject: String(form.get("subject") ?? ""),
      message: String(form.get("message") ?? ""),
      company: String(form.get("company") ?? ""),
      turnstileToken: captchaToken,
      startedAt: startedAtRef.current,
      submissionId: crypto.randomUUID(),
    };

    setState({ kind: "sending", message: "پەیامەکەت دەنێردرێت…" });

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = (await response.json().catch(() => null)) as
        | { message?: string }
        | null;

      if (!response.ok) {
        throw new Error(result?.message || "ناردنی پەیام سەرکەوتوو نەبوو.");
      }

      formRef.current?.reset();
      startedAtRef.current = Date.now();
      setCaptchaToken("");
      if (widgetIdRef.current && window.turnstile) {
        window.turnstile.reset(widgetIdRef.current);
      }
      setState({
        kind: "success",
        message: result?.message || "پەیامەکەت گەیشت؛ زوو وەڵامت دەدرێتەوە.",
      });
    } catch (error) {
      setState({
        kind: "error",
        message:
          error instanceof Error
            ? error.message
            : "هەڵەیەک ڕوویدا؛ تکایە دووبارە هەوڵ بدەوە.",
      });
      if (widgetIdRef.current && window.turnstile) {
        window.turnstile.reset(widgetIdRef.current);
        setCaptchaToken("");
      }
    }
  }

  const configurationMissing = isProduction && !turnstileSiteKey;

  return (
    <>
      {turnstileSiteKey ? (
        <Script
          src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
          strategy="afterInteractive"
          onReady={renderCaptcha}
        />
      ) : null}

      <form ref={formRef} className="contact-form" onSubmit={handleSubmit}>
        <div className="form-grid">
          <label className="form-field">
            <span>ناوی تەواو</span>
            <input
              name="name"
              type="text"
              minLength={2}
              maxLength={80}
              autoComplete="name"
              placeholder="ناوت بنووسە"
              required
            />
          </label>

          <label className="form-field">
            <span>ئیمەیڵ</span>
            <input
              name="email"
              type="email"
              maxLength={254}
              autoComplete="email"
              inputMode="email"
              dir="ltr"
              placeholder="name@example.com"
              required
            />
          </label>
        </div>

        <label className="form-field">
          <span>بابەت</span>
          <input
            name="subject"
            type="text"
            minLength={2}
            maxLength={120}
            placeholder="دەربارەی چی قسە دەکەین؟"
            required
          />
        </label>

        <label className="form-field">
          <span>پەیام</span>
          <textarea
            name="message"
            minLength={10}
            maxLength={4000}
            rows={6}
            placeholder="کورتەیەک لە بیرۆکە یان پرۆژەکەت بۆم بنووسە…"
            required
          />
        </label>

        <label className="form-trap" aria-hidden="true">
          Company
          <input name="company" type="text" tabIndex={-1} autoComplete="off" />
        </label>

        {turnstileSiteKey ? (
          <div className="captcha-wrap" ref={captchaRef} />
        ) : (
          <p className="captcha-note">
            {configurationMissing
              ? "کلیلی پاراستنی فۆرم دانەنراوە؛ پێش بڵاوکردنەوە ڕێکی بخە."
              : "Turnstile لە development ناچالاکە؛ بە env key چالاک دەبێت."}
          </p>
        )}

        <div className="form-actions">
          <button
            className="button button-dark submit-button"
            type="submit"
            disabled={state.kind === "sending" || configurationMissing}
          >
            <span>{state.kind === "sending" ? "دەنێردرێت…" : "ناردنی پەیام"}</span>
            <ArrowIcon className="button-icon" />
          </button>
          <p className="privacy-note">
            زانیارییەکانت تەنها بۆ وەڵامدانەوەی ئەم پەیامە بەکاردێن.
          </p>
        </div>

        <p
          className={`form-status form-status-${state.kind}`}
          role="status"
          aria-live="polite"
        >
          {state.message}
        </p>
      </form>
    </>
  );
}
