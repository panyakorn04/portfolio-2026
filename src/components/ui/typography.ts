export const eyebrow =
  "font-mono text-[.68rem] uppercase tracking-[.14em] text-[var(--color-soft)]";

export const body = "text-[.95rem] leading-[1.8] text-[var(--color-muted)] sm:text-base";

export const label =
  "font-mono text-[.66rem] uppercase tracking-[.14em] text-[var(--color-accent)]";

export const formLabel =
  "font-mono text-[0.62rem] uppercase tracking-[0.06em] tabular-nums text-[var(--color-soft)]";

export const copy = "text-[.9rem] leading-[1.75] text-[var(--color-muted)]";

export const linkButton =
  "inline-flex min-h-11 items-center justify-center border px-5 py-2.5 text-sm font-semibold transition-colors";

export const linkButtonPrimary = `${linkButton} border-[var(--color-accent)] bg-[var(--color-accent)] text-[#07110d] hover:bg-[#75e4ae]`;

export const linkButtonSecondary = `${linkButton} border-[var(--color-line-strong)] text-[var(--color-text)] hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]`;

export const inputClass =
  "mt-2 w-full rounded-[1rem] border border-[var(--color-line)] bg-[rgba(6,12,9,0.82)] px-3.5 py-3 text-sm text-[var(--color-text)] outline-none transition-colors placeholder:text-[var(--color-soft)] focus:border-[var(--color-line-strong)]";

export const glassSurfaceClass =
  "border border-[var(--color-line)] bg-[#0d0f0e] shadow-[0_18px_60px_rgba(0,0,0,0.22)]";

export const glassPanelClass = `${glassSurfaceClass} rounded-[0.5rem] p-5 sm:p-7 lg:p-8`;

export const glassCompactPanelClass = `${glassSurfaceClass} rounded-[0.375rem]`;

export const innerPanelClass =
  "rounded-[0.25rem] border border-[var(--color-line)] bg-[#090b0a]";

export const adminEyeClass =
  "font-mono text-[0.64rem] font-medium uppercase tracking-[0.16em] tabular-nums text-[var(--color-accent)]";

export const adminLabelClass =
  "font-mono text-[0.66rem] font-medium uppercase tracking-[0.1em] tabular-nums text-[var(--color-soft)]";

export const adminBodyClass =
  "text-[0.9rem] leading-[1.7] text-[var(--color-muted)] sm:text-[0.94rem]";

export const adminInputClass =
  "min-h-11 w-full rounded-[0.25rem] border border-[var(--color-line-strong)] bg-[#070908] px-3.5 py-2.5 text-base text-[var(--color-text)] outline-none transition-[border-color,box-shadow,background-color] placeholder:text-[var(--color-soft)] focus:border-[var(--color-accent)] focus:bg-[#0a0d0b] focus:ring-2 focus:ring-[var(--accent-dim)] disabled:cursor-not-allowed disabled:opacity-50 sm:text-sm";
