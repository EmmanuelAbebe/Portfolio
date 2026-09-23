# Portfolio: Emmanuel Abebe

My personal portfolio site: projects with architecture and tradeoff write-ups and a contact form.

**Stack:** Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS 4, deployed on Vercel.

## Contact form

The only server-side piece is `app/api/contact/route.ts`, a spam-resistant contact endpoint:

- **Cloudflare Turnstile** captcha, verified server-side before anything is sent
- **Honeypot field** that bots fill in and humans never see; those requests get a fake success
- **Rate limiting** with a sliding window of 5 requests/minute per IP (Upstash Redis). If Redis isn't configured, the route skips rate limiting instead of failing.
- **Resend** for delivery, with `replyTo` set when the sender left an email address
- **Validation** shared with the client (`lib/contactValidation.ts`) and re-checked on the server
- **Missing env vars** return `server_misconfigured` instead of crashing the build

## Project content

Project cards are data-driven from `lib/projectData.ts`. Each project records the problem, architecture, decisions/tradeoffs, stack, and repo/demo links (type in `types.ts`).

## Running locally

```bash
npm install
npm run dev        # http://localhost:3000
```

The contact form needs these environment variables (`.env.local`):

| Variable | Purpose |
| --- | --- |
| `RESEND_API_KEY` | Resend API key |
| `CONTACT_TO_EMAIL` | Inbox that receives messages |
| `CONTACT_FROM_EMAIL` | Verified sender address |
| `TURNSTILE_SECRET_KEY` | Turnstile server secret |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | Turnstile site key |
| `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN` | Optional: enables rate limiting |
