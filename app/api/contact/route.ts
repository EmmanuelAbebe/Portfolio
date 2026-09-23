import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { Redis } from "@upstash/redis";
import { Ratelimit } from "@upstash/ratelimit";

export const runtime = "nodejs";

function getIP(req: NextRequest) {
  const xff = req.headers.get("x-forwarded-for");
  return (xff?.split(",")[0] ?? "unknown").trim();
}

function isLikelyEmail(s: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
}

function getEnv() {
  const RESEND_API_KEY = process.env.RESEND_API_KEY;
  const TO = process.env.CONTACT_TO_EMAIL;
  const FROM = process.env.CONTACT_FROM_EMAIL;
  const TURNSTILE_SECRET = process.env.TURNSTILE_SECRET_KEY;

  if (!RESEND_API_KEY || !TO || !FROM || !TURNSTILE_SECRET) {
    return null;
  }

  return { RESEND_API_KEY, TO, FROM, TURNSTILE_SECRET };
}

function getRatelimiter() {
  // Rate limiting is optional: only enabled when Upstash is configured.
  if (
    !process.env.UPSTASH_REDIS_REST_URL ||
    !process.env.UPSTASH_REDIS_REST_TOKEN
  ) {
    return null;
  }
  return new Ratelimit({
    redis: Redis.fromEnv(),
    limiter: Ratelimit.slidingWindow(5, "60 s"),
    analytics: true,
  });
}

async function verifyTurnstile(secret: string, token: string, ip?: string) {
  const form = new FormData();
  form.append("secret", secret);
  form.append("response", token);
  if (ip) form.append("remoteip", ip);

  const res = await fetch(
    "https://challenges.cloudflare.com/turnstile/v0/siteverify",
    {
      method: "POST",
      body: form,
    }
  );

  if (!res.ok) return { ok: false as const };
  const data = (await res.json()) as { success: boolean };
  return { ok: Boolean(data.success) as boolean };
}

export async function POST(req: NextRequest) {
  try {
    const env = getEnv();
    if (!env) {
      console.error("[contact] missing env vars for Resend/Turnstile");
      return NextResponse.json(
        { ok: false, error: "server_misconfigured" },
        { status: 500 }
      );
    }

    const ip = getIP(req);

    const ratelimit = getRatelimiter();
    if (ratelimit) {
      // Fail open: a Redis outage shouldn't block real messages
      // (Turnstile still stops bots).
      const success = await ratelimit
        .limit(`contact:${ip}`)
        .then((r) => r.success)
        .catch((err) => {
          console.error("[contact] rate limiter unavailable", err);
          return true;
        });
      if (!success) {
        return NextResponse.json(
          { ok: false, error: "rate_limited" },
          { status: 429 }
        );
      }
    }

    const body: unknown = await req.json().catch(() => null);
    if (!body || typeof body !== "object") {
      return NextResponse.json(
        { ok: false, error: "invalid_json" },
        { status: 400 }
      );
    }
    const fields = body as Record<string, unknown>;
    const field = (key: string) => String(fields[key] ?? "").trim();

    // Honeypot
    if (field("company").length > 0) {
      return NextResponse.json({ ok: true });
    }

    const name = field("name");
    const contactRaw = field("contact");
    const message = field("message");
    const token = field("turnstileToken");

    if (!name || !contactRaw || !message || !token) {
      return NextResponse.json(
        { ok: false, error: "missing_fields" },
        { status: 400 }
      );
    }
    if (message.length > 5000) {
      return NextResponse.json(
        { ok: false, error: "too_long" },
        { status: 400 }
      );
    }

    const ts = await verifyTurnstile(env.TURNSTILE_SECRET, token, ip);
    if (!ts.ok) {
      return NextResponse.json(
        { ok: false, error: "turnstile_failed" },
        { status: 403 }
      );
    }

    const resend = new Resend(env.RESEND_API_KEY);
    const contact = contactRaw.trim();

    // Resend reports failures in the result instead of throwing.
    const { error } = await resend.emails.send({
      from: env.FROM,
      to: env.TO,
      subject: `Portfolio contact from ${name}`,
      text: `Name: ${name}\nContact: ${contact}\nIP: ${ip}\n\n${message}`,
      ...(isLikelyEmail(contact) ? { replyTo: contact } : {}),
    });
    if (error) {
      console.error("[contact] resend failed", error);
      return NextResponse.json(
        { ok: false, error: "send_failed" },
        { status: 502 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[contact] unexpected error", err);
    return NextResponse.json(
      { ok: false, error: "server_error" },
      { status: 500 }
    );
  }
}
