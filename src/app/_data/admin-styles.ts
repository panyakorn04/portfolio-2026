export const glassSurfaceClass =
  "border border-[var(--color-line)] bg-[linear-gradient(158deg,rgba(255,255,255,0.065),rgba(255,255,255,0.025))] shadow-[var(--shadow-panel)] backdrop-blur-[24px] backdrop-saturate-[1.6]";

export const glassPanelClass = `${glassSurfaceClass} rounded-[var(--radius-lg)]`;

export const glassCompactPanelClass = `${glassSurfaceClass} rounded-[var(--radius)]`;

export const innerPanelClass =
  "rounded-[var(--radius)] border border-[var(--color-line)] bg-[rgba(6,12,9,0.74)]";

export const eyeClass =
  "font-mono text-[0.58rem] uppercase tracking-[0.11em] tabular-nums text-[var(--color-soft)] sm:text-[0.62rem]";

export const labelClass =
  "font-mono text-[0.62rem] uppercase tracking-[0.06em] tabular-nums text-[var(--color-soft)]";

export const bodyClass =
  "text-[0.88rem] leading-[1.78] text-[var(--color-muted)] sm:text-[0.92rem]";

export const inputClass =
  "w-full rounded-[var(--radius-sm)] border border-[var(--color-line)] bg-[rgba(6,12,9,0.82)] px-3.5 py-3 text-sm text-[var(--color-text)] outline-none transition-colors placeholder:text-[var(--color-soft)] focus:border-[var(--color-line-strong)]";
