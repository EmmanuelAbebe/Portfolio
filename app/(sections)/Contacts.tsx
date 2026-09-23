"use client";

import { useMemo, useRef, useState } from "react";
import { FaCheckCircle, FaExclamationCircle } from "react-icons/fa";
import { RiSendPlaneFill } from "react-icons/ri";
import { Turnstile, type TurnstileInstance } from "@marsidev/react-turnstile";

import {
  validateContactForm,
  hasErrors,
  type ContactFormErrors,
} from "@/lib/contactValidation";

type Status = "idle" | "sending" | "sent" | "error";

const ERROR_MESSAGES: Record<string, string> = {
  fix_form_errors: "Please fix the highlighted fields.",
  rate_limited: "Too many messages. Please wait a minute and try again.",
  turnstile_failed: "Captcha check failed. Please retry it.",
  missing_fields: "Please fill in every field.",
  send_failed: "Your message couldn't be delivered. Please try again later.",
  server_misconfigured: "The contact form isn't set up yet. Please reach me on LinkedIn.",
  too_long: "Message is too long (5000 characters max).",
  network_error: "Network error. Check your connection and try again.",
};
const FALLBACK_ERROR =
  "Something went wrong. Please try again, or reach me on LinkedIn.";

export default function Contacts() {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  // honeypot
  const [company, setCompany] = useState("");

  // turnstile
  const [tsToken, setTsToken] = useState("");
  const turnstileRef = useRef<TurnstileInstance>(undefined);
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? "";

  // controlled inputs
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [message, setMessage] = useState("");

  // touched tracking
  const [touched, setTouched] = useState({
    name: false,
    contact: false,
    message: false,
  });

  const [submitted, setSubmitted] = useState(false);

  // validation
  const errors: ContactFormErrors = useMemo(
    () =>
      validateContactForm({
        name,
        contact,
        message,
        turnstileToken: tsToken,
      }),
    [name, contact, message, tsToken]
  );

  const canSubmit =
    status !== "sending" && status !== "sent" && !hasErrors(errors);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitted(true);

    setTouched({ name: true, contact: true, message: true });

    if (hasErrors(errors)) {
      setStatus("error");
      setErrorMsg("fix_form_errors");
      return;
    }

    setStatus("sending");
    setErrorMsg("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          contact: contact.trim(),
          message: message.trim(),
          company, // honeypot
          turnstileToken: tsToken,
        }),
      });

      if (!res.ok) {
        const data = (await res.json().catch(() => null)) as {
          error?: string;
        } | null;
        setStatus("error");
        setErrorMsg(data?.error ?? "send_failed");
        return;
      }

      // success
      setStatus("sent");
      setName("");
      setContact("");
      setMessage("");
      setCompany("");
      // Tokens are single-use: get a fresh one in case they send another.
      setTsToken("");
      turnstileRef.current?.reset();
      setTouched({ name: false, contact: false, message: false });
    } catch {
      setStatus("error");
      setErrorMsg("network_error");
    }
  }

  return (
    <div className="flex flex-col">
      {/* Form */}
      <div className="flex-1 min-w-0 md:max-w-180">
        <p className="text-base text-slate-700 mb-6">
          Send me a message and I&apos;ll get back to you.
        </p>

        <form className="flex flex-col gap-2" onSubmit={onSubmit} noValidate>
          {/* honeypot */}
          <div className="hidden">
            <input
              name="company"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              tabIndex={-1}
              autoComplete="off"
            />
          </div>

          {/* Name */}
          <Field
            label="Your Name"
            value={name}
            onChange={setName}
            placeholder="What's your name?"
            onBlur={() => setTouched((t) => ({ ...t, name: true }))}
            error={submitted && touched.name ? errors.name : undefined}
            disabled={status === "sending"}
          />

          {/* Contact */}
          <Field
            label="Your Contact Information"
            value={contact}
            onChange={setContact}
            onBlur={() => setTouched((t) => ({ ...t, contact: true }))}
            error={submitted && touched.contact ? errors.contact : undefined}
            disabled={status === "sending"}
            placeholder="How can I contact you back? Email or phone"
          />

          {/* Message */}
          <TextArea
            label="Message"
            value={message}
            onChange={setMessage}
            placeholder="Let me know what you'd like to discuss!"
            onBlur={() => setTouched((t) => ({ ...t, message: true }))}
            error={submitted && touched.message ? errors.message : undefined}
            disabled={status === "sending"}
          />

          {/* Turnstile */}
          <div className="pt-2">
            <Turnstile
              ref={turnstileRef}
              siteKey={siteKey}
              onSuccess={setTsToken}
              onExpire={() => setTsToken("")}
              onError={() => setTsToken("")}
            />
            {submitted && status !== "sent" && errors.turnstile && (
              <p className="text-xs text-red-600 mt-1">
                {errors.turnstile}
              </p>
            )}
          </div>

          {/* Status */}
          {submitted && status === "sent" && (
            <p className="text-green-600 text-sm">
              <FaCheckCircle className="inline me-2" />
              Message sent
            </p>
          )}

          {submitted && status === "error" && (
            <p className="text-red-600 text-sm">
              <FaExclamationCircle className="inline me-2" />
              {ERROR_MESSAGES[errorMsg] ?? FALLBACK_ERROR}
            </p>
          )}

          {/* Submit */}
          <div className="flex justify-end mt-6">
            <button
              type="submit"
              disabled={!canSubmit}
              className="bg-indigo-500 hover:bg-indigo-600 disabled:opacity-60 flex items-center gap-2 px-5 py-3"
            >
              <RiSendPlaneFill className="text-white" />
              <span className="font-mono font-bold text-white">
                {status === "sending"
                  ? "Sending…"
                  : status === "sent"
                  ? "Sent"
                  : "Send"}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ---------- small field helpers ---------- */

function Field({
  label,
  value,
  onChange,
  onBlur,
  error,
  disabled,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  onBlur: () => void;
  error?: string;
  disabled?: boolean;
  placeholder?: string;
}) {
  return (
    <div className="relative p-1.5">
      <label className="absolute left-5 top-0 bg-white px-1 text-xs font-mono text-gray-600">
        {label}
      </label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        disabled={disabled}
        placeholder={placeholder}
        aria-invalid={!!error}
        className={`border p-3 text-sm w-full focus:outline-2 ${
          error
            ? "border-red-500 focus:outline-red-500"
            : "border-gray-300 focus:outline-indigo-500"
        }`}
      />
      {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
    </div>
  );
}

function TextArea({
  label,
  value,
  onChange,
  onBlur,
  error,
  disabled,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  onBlur: () => void;
  error?: string;
  placeholder?: string;
  disabled?: boolean;
}) {
  return (
    <div className="relative p-1.5">
      <label className="absolute left-5 top-0 bg-white px-1 text-xs font-mono text-gray-600">
        {label}
      </label>
      <textarea
        rows={6}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        disabled={disabled}
        placeholder={placeholder}
        aria-invalid={!!error}
        className={`border p-3 text-sm w-full focus:outline-2 resize-y ${
          error
            ? "border-red-500 focus:outline-red-500"
            : "border-gray-300 focus:outline-indigo-500"
        }`}
      />
      {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
    </div>
  );
}
