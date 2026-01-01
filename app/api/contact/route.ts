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
  // Upstash envs are also required; if missing, disable rate limiting safely.
  try {
    const redis = Redis.fromEnv();
    return new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(5, "60 s"),
      analytics: true,
    });
  } catch {
    return null;
  }
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
      return NextResponse.json(
        { ok: false, error: "server_misconfigured" },
        { status: 500 }
      );
    }

    const ip = getIP(req);

    const ratelimit = getRatelimiter();
    if (ratelimit) {
      const { success } = await ratelimit.limit(`contact:${ip}`);
      if (!success) {
        return NextResponse.json(
          { ok: false, error: "rate_limited" },
          { status: 429 }
        );
      }
    }

    const body = await req.json().catch(() => null);
    if (!body || typeof body !== "object") {
      return NextResponse.json(
        { ok: false, error: "invalid_json" },
        { status: 400 }
      );
    }

    // Honeypot
    if (
      typeof (body as any).company === "string" &&
      (body as any).company.trim().length > 0
    ) {
      return NextResponse.json({ ok: true });
    }

    const name = String((body as any).name ?? "").trim();
    const contactRaw = String((body as any).contact ?? "").trim();
    const message = String((body as any).message ?? "").trim();
    const token = String((body as any).turnstileToken ?? "").trim();

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

    await resend.emails.send({
      from: env.FROM,
      to: env.TO,
      subject: `Portfolio contact from ${name}`,
      text: `Name: ${name}\nContact: ${contact}\nIP: ${ip}\n\n${message}`,
      ...(isLikelyEmail(contact) ? { replyTo: contact } : {}),
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { ok: false, error: "server_error" },
      { status: 500 }
    );
  }
}
