# پۆرتفۆلیۆی ڕەهەند

پۆرتفۆلیۆیەکی RTL و وەڵامدەرەوە بە Next.js 16، React 19 و فۆنتی لۆکاڵی `NRT-Reg.ttf`. دیزاینەکە بەبێ shadow دروست کراوە و هەموو دەق، لینک، وێنە و پرۆژەکان لە یەک فایلدا دەستکاری دەکرێن.

## دەستپێکردن

```bash
npm install
npm run dev
```

پاشان [http://localhost:3000](http://localhost:3000) بکەرەوە.

بۆ پشکنین پێش بڵاوکردنەوە:

```bash
npm run lint
npx tsc --noEmit --incremental false
npm run build
```

## گۆڕینی ناوەڕۆک

هەموو ناو، بایۆ، مێنوو، تواناکان، پرۆژەکان، تێبینییەکان و لینکە کۆمەڵایەتییەکان لەم فایلەدان:

```text
src/content/portfolio.ts
```

هەر پرۆژەیەک `cover`، `gallery`، کورتە، وردەکاری، کێشە، چارەسەر، خزمەتگوزاری و تەکنەلۆژیای تایبەتی خۆی هەیە. بە کرتەکردن لەسەر کارتی پرۆژەکە هەمووی لە dialog ـێکی تەواودا دەردەکەوێت.

وێنە نموونەییەکان لێرەن:

```text
public/images/hero-placeholder.svg
public/images/about-placeholder.svg
public/images/projects/
```

وێنەی خۆت بە `.webp`، `.jpg`، `.png` یان `.svg` لە `public/images` دابنێ و تەنها path ـەکە لە `portfolio.ts` بگۆڕە. بۆ خێرایی، `.webp` و قەبارەی کەمتر لە 500KB باشترە.

فۆنت لەم شوێنەیە:

```text
public/fonts/NRT-Reg.ttf
```

لە `src/app/globals.css` بە `@font-face` بارکراوە. سەرچاوەی فۆنت: [Kurd Fonts — NRT Regular](https://www.kurdfonts.com/font-info/509).

## چالاککردنی فۆرمی ئیمەیڵ

فۆرمەکە بە Gmail SMTP و [Nodemailer](https://nodemailer.com/smtp) پەیام بۆ `CONTACT_TO_EMAIL` دەنێرێت. بۆ ناردنی ڕاستەقینە:

1. `.env.example` کۆپی بکە بۆ `.env.local`.
2. لە Google Account ـەکەت [2-Step Verification](https://support.google.com/accounts/answer/185839) چالاک بکە.
3. [Google App Password](https://support.google.com/accounts/answer/185833) ـێکی 16 پیت بۆ Mail دروست بکە. پاسوۆردی ئاسایی Gmail بەکارمەهێنە.
4. `SMTP_USER` و `CONTACT_FROM_EMAIL` بە هەمان ناونیشانی Gmail پڕ بکەرەوە؛ API هیچ sender ـێکی جیاواز قبووڵ ناکات.
5. App Password ـەکە لە `SMTP_APP_PASSWORD` دابنێ و ئیمەیڵی وەرگر لە `CONTACT_TO_EMAIL` دیاری بکە.
6. بۆ TLS ـی ڕاستەوخۆ `SMTP_PORT=465` و `SMTP_SECURE=true` بەکاربهێنە. بۆ STARTTLS دەتوانیت `SMTP_PORT=587` و `SMTP_SECURE=false` دابنێیت.
7. لە [Cloudflare Turnstile](https://developers.cloudflare.com/turnstile/get-started/) widget ـێک بۆ domain ـەکەت دروست بکە و site key، secret key، hostname و origin ـە ڕێگەپێدراوەکان دابنێ.
8. هەمان environment variables لە hosting ـەکەت زیاد بکە و دووبارە deploy بکە.

`CONTACT_FROM_EMAIL` دەبێت بە تەواوی هەمان `SMTP_USER` بێت. ئیمەیڵی سەردانکەر تەنها لە `replyTo` دادەنرێت؛ sender و recipient لە server ـەوە جێگیرن. بەبێ SMTP و Turnstile config ـی دروست، endpoint ـەکە لە production بە `503` دادەخرێت.

بۆ تاقیکردنەوەی localhost تەنها، Cloudflare ئەم test key ـانەی هەیە:

```env
NEXT_PUBLIC_TURNSTILE_SITE_KEY=1x00000000000000000000AA
TURNSTILE_SECRET_KEY=1x0000000000000000000000000000000AA
```

ئەم test key ـانە هەرگیز لە production بەکارمەهێنە.

## پاراستن

Contact API ئەمانە جێبەجێ دەکات:

- validation ـی server-side بە Zod و سنووری قەبارەی پەیام؛
- Cloudflare Turnstile بە پشتڕاستکردنەوەی server-side، action و hostname؛
- honeypot، minimum-submit-time و same-origin checking؛
- rate limit ـی ناوخۆیی؛ و rate limit ـی هاوبەش بە Upstash لە serverless کاتێک env ـەکانی دابنرێن؛
- Gmail SMTP بە TLS، sender ـی هەمان هەژماری authenticated، recipient ـی جێگیر و ئیمەیڵی سەردانکەر تەنها لە `replyTo`؛
- timeout ـی SMTP و قەدەغەکردنی file/URL access، بەبێ log کردنی credential یان هەڵەی نهێنی؛
- CSP، HSTS، frame blocking، MIME sniffing blocking و Permissions Policy.

بۆ production ـی serverless، `UPSTASH_REDIS_REST_URL` و `UPSTASH_REDIS_REST_TOKEN` دابنێ تا rate limit لە نێوان هەموو instance ـەکان هاوبەش بێت.

## تێبینی WhatsApp

لینکی QR ـی نێردراو لە `portfolio.ts` بە شێوەی `https://wa.me/qr/EF7VQ7NYMDKYC1` دانراوە. ئەگەر لینکی گفتوگۆی ڕاستەوخۆت دەوێت، بیگۆڕە بۆ:

```text
https://wa.me/9647501173185
```
