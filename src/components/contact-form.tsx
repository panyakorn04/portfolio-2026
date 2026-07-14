"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";

import type { Locale, PortfolioDictionary } from "../lib/portfolio";
import { submitContact } from "./contact-actions";
import { initialContactState } from "./contact-form-state";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { formLabel } from "./ui/typography";

type ContactFormCopy = PortfolioDictionary["contactForm"];

type ContactFormProps = {
  locale: Locale;
  copy: ContactFormCopy;
};

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
    <div className="border-t border-[var(--color-line)] py-6 sm:py-8">
      <div className="flex items-center justify-between gap-3">
        <p className={formLabel}>{copy.panelLabel}</p>
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
            <Label htmlFor="contact-name">{copy.nameLabel}</Label>
            <Input
              id="contact-name"
              name="name"
              autoComplete="name"
              required
              minLength={2}
              aria-invalid={fieldErrors.name ? "true" : "false"}
              placeholder={copy.namePlaceholder}
            />
            {fieldErrors.name ? (
              <p className="mt-2 text-sm text-[#ff9a9a]">{fieldErrors.name}</p>
            ) : null}
          </div>

          <div>
            <Label htmlFor="contact-email">{copy.emailLabel}</Label>
            <Input
              id="contact-email"
              name="email"
              type="email"
              autoComplete="email"
              required
              aria-invalid={fieldErrors.email ? "true" : "false"}
              placeholder={copy.emailPlaceholder}
            />
            {fieldErrors.email ? (
              <p className="mt-2 text-sm text-[#ff9a9a]">{fieldErrors.email}</p>
            ) : null}
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="contact-company">{copy.companyLabel}</Label>
            <Input
              id="contact-company"
              name="company"
              autoComplete="organization"
              placeholder={copy.companyPlaceholder}
            />
          </div>

          <div>
            <Label htmlFor="contact-subject">{copy.subjectLabel}</Label>
            <Input
              id="contact-subject"
              name="subject"
              required
              minLength={3}
              aria-invalid={fieldErrors.subject ? "true" : "false"}
              placeholder={copy.subjectPlaceholder}
            />
            {fieldErrors.subject ? (
              <p className="mt-2 text-sm text-[#ff9a9a]">{fieldErrors.subject}</p>
            ) : null}
          </div>
        </div>

        <div>
          <Label htmlFor="contact-message">{copy.messageLabel}</Label>
          <Textarea
            id="contact-message"
            name="message"
            rows={7}
            required
            minLength={20}
            aria-invalid={fieldErrors.message ? "true" : "false"}
            placeholder={copy.messagePlaceholder}
            className="min-h-[10.5rem]"
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
