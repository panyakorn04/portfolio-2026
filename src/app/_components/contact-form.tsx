"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";

import type { Locale, PortfolioDictionary } from "../_data/portfolio";
import { Button } from "./button";
import { submitContact } from "./contact-actions";
import { initialContactState } from "./contact-form-state";

type ContactFormCopy = PortfolioDictionary["contactForm"];

type ContactFormProps = {
  locale: Locale;
  copy: ContactFormCopy;
};

const inputClass =
  "mt-2 w-full rounded-[1rem] border border-[var(--color-line)] bg-[rgba(6,12,9,0.82)] px-3.5 py-3 text-sm text-[var(--color-text)] outline-none transition-colors placeholder:text-[var(--color-soft)] focus:border-[var(--color-line-strong)]";
const labelClass =
  "font-mono text-[0.62rem] uppercase tracking-[0.06em] tabular-nums text-[var(--color-soft)]";

function SubmitButton({ copy }: { copy: ContactFormCopy }) {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending}>
      {pending ? copy.submittingLabel : copy.submitLabel}
    </Button>
  );
}

export default function ContactForm({ locale, copy }: ContactFormProps) {
  const [state, formAction] = useActionState(submitContact, initialContactState);
  const { fieldErrors } = state;

  const serverMessage =
    state.status === "success"
      ? copy.submitSuccess
      : state.status === "error"
        ? (state.message ?? copy.submitError)
        : null;

  return (
    <div className="rounded-[1.45rem] border border-[var(--color-line-strong)] bg-[linear-gradient(180deg,rgba(10,20,16,0.96),rgba(6,12,9,0.96))] p-5 shadow-[inset_0_0_0_1px_rgba(111,247,166,0.04)] sm:p-6">
      <div className="flex items-center justify-between gap-3">
        <p className={labelClass}>{copy.panelLabel}</p>
        <span className="rounded-full border border-[var(--color-line)] px-3 py-1 font-mono text-[0.62rem] uppercase text-[var(--color-accent)]">
          POST /api/contact
        </span>
      </div>

      <div className="mt-4 max-w-2xl">
        <h3 className='[font-family:var(--font-display),"Segoe_UI",sans-serif] text-[1.6rem] font-semibold leading-[1.05] tracking-[-0.03em] text-[var(--color-text)]'>
          {copy.title}
        </h3>
        <p className="mt-3 text-[0.88rem] leading-[1.85] text-[var(--color-muted)]">
          {copy.description}
        </p>
      </div>

      <form className="mt-6 space-y-4" action={formAction}>
        <input type="hidden" name="locale" value={locale} />
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="contact-name" className={labelClass}>
              {copy.nameLabel}
            </label>
            <input
              id="contact-name"
              name="name"
              autoComplete="name"
              required
              minLength={2}
              aria-invalid={fieldErrors.name ? "true" : "false"}
              placeholder={copy.namePlaceholder}
              className={inputClass}
            />
            {fieldErrors.name ? (
              <p className="mt-2 text-sm text-[#ff9a9a]">{fieldErrors.name}</p>
            ) : null}
          </div>

          <div>
            <label htmlFor="contact-email" className={labelClass}>
              {copy.emailLabel}
            </label>
            <input
              id="contact-email"
              name="email"
              type="email"
              autoComplete="email"
              required
              aria-invalid={fieldErrors.email ? "true" : "false"}
              placeholder={copy.emailPlaceholder}
              className={inputClass}
            />
            {fieldErrors.email ? (
              <p className="mt-2 text-sm text-[#ff9a9a]">{fieldErrors.email}</p>
            ) : null}
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="contact-company" className={labelClass}>
              {copy.companyLabel}
            </label>
            <input
              id="contact-company"
              name="company"
              autoComplete="organization"
              placeholder={copy.companyPlaceholder}
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="contact-subject" className={labelClass}>
              {copy.subjectLabel}
            </label>
            <input
              id="contact-subject"
              name="subject"
              required
              minLength={3}
              aria-invalid={fieldErrors.subject ? "true" : "false"}
              placeholder={copy.subjectPlaceholder}
              className={inputClass}
            />
            {fieldErrors.subject ? (
              <p className="mt-2 text-sm text-[#ff9a9a]">{fieldErrors.subject}</p>
            ) : null}
          </div>
        </div>

        <div>
          <label htmlFor="contact-message" className={labelClass}>
            {copy.messageLabel}
          </label>
          <textarea
            id="contact-message"
            name="message"
            rows={7}
            required
            minLength={20}
            aria-invalid={fieldErrors.message ? "true" : "false"}
            placeholder={copy.messagePlaceholder}
            className={`${inputClass} min-h-[10.5rem] resize-y`}
          />
          {fieldErrors.message ? (
            <p className="mt-2 text-sm text-[#ff9a9a]">{fieldErrors.message}</p>
          ) : null}
        </div>

        <div className="flex flex-col gap-3 border-t border-[var(--color-line)] pt-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-2">
            <p className="font-mono text-[0.66rem] uppercase tracking-[0.04em] text-[var(--color-soft)]">
              {copy.storageNote}
            </p>
            {serverMessage ? (
              <p
                role="status"
                aria-live="polite"
                className={`text-sm ${
                  state.status === "success"
                    ? "text-[var(--color-accent)]"
                    : "text-[#ff9a9a]"
                }`}
              >
                {serverMessage}
              </p>
            ) : null}
          </div>

          <SubmitButton copy={copy} />
        </div>
      </form>
    </div>
  );
}
