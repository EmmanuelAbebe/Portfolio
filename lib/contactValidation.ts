// lib/contactValidation.ts

export type ContactFormValues = {
  name: string;
  contact: string; // email or phone
  message: string;
  turnstileToken: string;
};

export type ContactFormErrors = Partial<{
  name: string;
  contact: string;
  message: string;
  turnstile: string;
}>;

function isEmail(s: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s.trim());
}

function normalizePhone(s: string) {
  return s.replace(/[^\d+]/g, "");
}

function isLikelyPhone(s: string) {
  const p = normalizePhone(s);
  const digits = p.replace(/[^\d]/g, "");
  return digits.length >= 10 && digits.length <= 15;
}

export function validateContactForm(
  values: ContactFormValues
): ContactFormErrors {
  const errs: ContactFormErrors = {};

  const name = values.name.trim();
  const contact = values.contact.trim();
  const message = values.message.trim();

  if (name.length < 1) errs.name = "Name is too short";
  if (name.length > 60) errs.name = "Name is too long";

  if (!contact) errs.contact = "Contact is required";
  else {
    const ok = isEmail(contact) || isLikelyPhone(contact);
    if (!ok) errs.contact = "Enter a valid email or phone number";
    if (contact.length > 120) errs.contact = "Contact is too long";
  }

  if (message.length < 10) errs.message = "Message is too short";
  if (message.length > 5000) errs.message = "Message is too long";

  if (!values.turnstileToken) errs.turnstile = "Complete the captcha";

  return errs;
}

export function hasErrors(errs: ContactFormErrors) {
  return Object.keys(errs).length > 0;
}
