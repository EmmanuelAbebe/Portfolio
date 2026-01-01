"use client";

import { useMemo, useState } from "react";
import {
  FaCheckCircle,
  FaEnvelope,
  FaExclamationCircle,
  FaPhone,
} from "react-icons/fa";
import { RiSendPlaneFill } from "react-icons/ri";
import { Turnstile } from "@marsidev/react-turnstile";

import {
  validateContactForm,
  hasErrors,
  type ContactFormErrors,
} from "@/lib/contactValidation";

type Status = "idle" | "sending" | "sent" | "error";

export default function Contacts() {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  // honeypot
  const [company, setCompany] = useState("");

  // turnstile
  const [tsToken, setTsToken] = useState("");
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
        const data = (await res.json().catch(() => null)) as any;
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
      setTsToken("");
      setTouched({ name: false, contact: false, message: false });
    } catch {
      setStatus("error");
      setErrorMsg("network_error");
    }
  }

  return (
    <div className="flex flex-col xl:flex-row justify-center gap-16">
      {/* Static contact info */}
      <div className="flex-1 min-w-0 md:max-w-180">
        <p className="font-mono text-lg pb-6 mb-3">Contact Information</p>
        <ul className="font-medium ps-6 flex flex-col gap-2">
          <li className="flex items-center gap-4">
            <FaEnvelope size={16} />
            <a
              href="mailto:emmanuelmihret@gmail.com"
              className="font-mono text-sm hover:underline"
            >
              emmanuelmihret@gmail.com
            </a>
          </li>
          <li className="flex items-center gap-4">
            <FaPhone size={14} />
            <a
              href="tel:+13018935021"
              className="font-mono text-sm hover:underline"
            >
              +1 (301) 893-5021
            </a>
          </li>
        </ul>
      </div>

      {/* Form */}
      <div className="flex-1 min-w-0 md:max-w-180">
        <p className="font-mono text-lg pb-6 mb-3">Contact me here</p>

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
              siteKey={siteKey}
              onSuccess={setTsToken}
              onExpire={() => setTsToken("")}
              onError={() => setTsToken("")}
            />
            {errors.turnstile && (
              <p className="text-xs text-red-600 font-mono mt-1">
                {errors.turnstile}
              </p>
            )}
          </div>

          {/* Status */}
          {submitted && status === "sent" && (
            <p className="text-green-600 font-mono text-sm">
              <FaCheckCircle className="inline me-2" />
              Message sent
            </p>
          )}

          {submitted && status === "error" && (
            <p className="text-red-600 font-mono text-sm">
              <FaExclamationCircle className="inline me-2" />
              {errorMsg}
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
        className={`border p-3 text-sm w-full font-mono focus:outline-2 ${
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
        className={`border p-3 text-sm w-full font-mono focus:outline-2 resize-y ${
          error
            ? "border-red-500 focus:outline-red-500"
            : "border-gray-300 focus:outline-indigo-500"
        }`}
      />
      {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
    </div>
  );
}
