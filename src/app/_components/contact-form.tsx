"use client";

import { useState, useTransition } from "react";

import type { Locale, PortfolioDictionary } from "../_data/portfolio";

type ContactFormCopy = PortfolioDictionary["contactForm"];

type ContactFormProps = {
  locale: Locale;
  copy: ContactFormCopy;
};

type FormState = {
  name: string;
  email: string;
  company: string;
  subject: string;
  message: string;
};

type FieldErrors = Partial<Record<keyof FormState, string>>;

const initialFormState: FormState = {
  name: "",
  email: "",
  company: "",
  subject: "",
  message: "",
};

type ApiErrorResponse = {
  ok: false;
  error: {
    message: string;
    details?: Array<{
      field: string;
      message: string;
    }>;
  };
};

type ApiSuccessResponse = {
  ok: true;
  data: {
    message: string;
    deliveryMode: string;
    submittedAt: string;
  };
};

const apiBaseUrl = (
  process.env.NEXT_PUBLIC_API_URL ?? "https://api.panyakorn.com"
).replace(/\/+$/, "");

export default function ContactForm({ locale, copy }: ContactFormProps) {
  const [form, setForm] = useState<FormState>(initialFormState);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [serverMessage, setServerMessage] = useState<string | null>(null);
  const [serverTone, setServerTone] = useState<"success" | "error">("success");
  const [isPending, startTransition] = useTransition();

  function updateField<K extends keyof FormState>(field: K, value: FormState[K]) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));

    setFieldErrors((current) => {
      if (!current[field]) {
        return current;
      }

      return {
        ...current,
        [field]: undefined,
      };
    });
  }

  async function submitForm(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setServerMessage(null);

    startTransition(async () => {
      try {
        const response = await fetch(`${apiBaseUrl}/api/contact`, {
          method: "POST",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify({
            ...form,
            locale,
          }),
        });

        const data = (await response.json()) as ApiSuccessResponse | ApiErrorResponse;

        if (!response.ok || !data.ok) {
          const nextFieldErrors =
            (data as ApiErrorResponse).error.details?.reduce<FieldErrors>(
              (result, detail) => {
                if (
                  detail.field === "name" ||
                  detail.field === "email" ||
                  detail.field === "company" ||
                  detail.field === "subject" ||
                  detail.field === "message"
                ) {
                  result[detail.field] = detail.message;
                }

                return result;
              },
              {},
            ) ?? {};

          setFieldErrors(nextFieldErrors);
          setServerTone("error");
          setServerMessage((data as ApiErrorResponse).error.message ?? copy.submitError);
          return;
        }

        setFieldErrors({});
        setForm(initialFormState);
        setServerTone("success");
        setServerMessage(copy.submitSuccess);
      } catch {
        setServerTone("error");
        setServerMessage(copy.submitError);
      }
    });
  }

  const inputClass =
    "mt-2 w-full rounded-[1rem] border border-[var(--color-line)] bg-[rgba(6,12,9,0.82)] px-3.5 py-3 text-sm text-[var(--color-text)] outline-none transition-colors placeholder:text-[var(--color-soft)] focus:border-[var(--color-line-strong)]";
  const labelClass =
    "font-mono text-[0.62rem] uppercase tracking-[0.06em] tabular-nums text-[var(--color-soft)]";

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

      <form className="mt-6 space-y-4" onSubmit={submitForm}>
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
              disabled={isPending}
              aria-invalid={fieldErrors.name ? "true" : "false"}
              value={form.name}
              onChange={(event) => updateField("name", event.target.value)}
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
              disabled={isPending}
              aria-invalid={fieldErrors.email ? "true" : "false"}
              value={form.email}
              onChange={(event) => updateField("email", event.target.value)}
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
              disabled={isPending}
              value={form.company}
              onChange={(event) => updateField("company", event.target.value)}
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
              disabled={isPending}
              aria-invalid={fieldErrors.subject ? "true" : "false"}
              value={form.subject}
              onChange={(event) => updateField("subject", event.target.value)}
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
            disabled={isPending}
            aria-invalid={fieldErrors.message ? "true" : "false"}
            value={form.message}
            onChange={(event) => updateField("message", event.target.value)}
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
                  serverTone === "success"
                    ? "text-[var(--color-accent)]"
                    : "text-[#ff9a9a]"
                }`}
              >
                {serverMessage}
              </p>
            ) : null}
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="inline-flex items-center justify-center rounded-full border border-[var(--color-line-strong)] bg-[var(--color-accent)] px-4 py-3 font-mono text-[0.7rem] uppercase tracking-[0.04em] text-[#041009] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isPending ? copy.submittingLabel : copy.submitLabel}
          </button>
        </div>
      </form>
    </div>
  );
}
