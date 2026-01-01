import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { Redis } from "@upstash/redis";
import { Ratelimit } from "@upstash/ratelimit";

export const runtime = "nodejs";

const resend = new Resend(process.env.RESEND_API_KEY);

const redis = Redis.fromEnv();
const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, "60 s"), // 5 req / minute / IP
  analytics: true,
});

const TO = process.env.CONTACT_TO_EMAIL!;
const FROM = process.env.CONTACT_FROM_EMAIL!;
const TURNSTILE_SECRET = process.env.TURNSTILE_SECRET_KEY!;

function getIP(req: NextRequest) {
  const xff = req.headers.get("x-forwarded-for");
  return (xff?.split(",")[0] ?? "unknown").trim();
}

function isLikelyEmail(s: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
}

async function verifyTurnstile(token: string, ip?: string) {
  const form = new FormData();
  form.append("secret", TURNSTILE_SECRET);
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
  return { ok: data.success as boolean };
}

export async function POST(req: NextRequest) {
  try {
    const ip = getIP(req);

    const { success } = await ratelimit.limit(`contact:${ip}`);
    if (!success) {
      return NextResponse.json(
        { ok: false, error: "rate_limited" },
        { status: 429 }
      );
    }

    const body = await req.json();

    // Honeypot
    if (typeof body.company === "string" && body.company.trim().length > 0) {
      return NextResponse.json({ ok: true });
    }

    const name = String(body.name ?? "").trim();
    const contactRaw = String(body.contact ?? "").trim();
    const message = String(body.message ?? "").trim();
    const token = String(body.turnstileToken ?? "").trim();

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

    const ts = await verifyTurnstile(token, ip);
    if (!ts.ok) {
      return NextResponse.json(
        { ok: false, error: "turnstile_failed" },
        { status: 403 }
      );
    }

    const contact = contactRaw.trim();

    await resend.emails.send({
      from: FROM,
      to: TO,
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
