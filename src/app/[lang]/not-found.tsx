import Link from "next/link";

const pageShellClass =
  "min-h-screen bg-[var(--color-bg)] px-5 py-8 text-[var(--color-text)] sm:px-8 sm:py-10";
const panelClass =
  "mx-auto max-w-2xl rounded-[1.45rem] border border-[var(--color-line-strong)] bg-[linear-gradient(180deg,rgba(10,20,16,0.96),rgba(6,12,9,0.96))] p-6 shadow-[inset_0_0_0_1px_rgba(111,247,166,0.04)] sm:p-8";
const labelClass =
  "font-mono text-[0.62rem] uppercase tracking-[0.06em] tabular-nums text-[var(--color-soft)]";
const titleClass =
  '[font-family:var(--font-display),"Segoe_UI",sans-serif] text-[clamp(1.8rem,4vw,3rem)] font-semibold leading-[1.05] tracking-[-0.04em] text-balance';
const bodyClass = "text-[0.9rem] leading-[1.85] text-[var(--color-muted)]";
const linkClass =
  "inline-flex items-center gap-2 rounded-full border border-[var(--color-line-strong)] px-4 py-2 font-mono text-[0.7rem] uppercase tracking-[0.06em] text-[var(--color-accent)] transition-colors hover:bg-[rgba(111,247,166,0.06)]";

export default function NotFound() {
  return (
    <main className={pageShellClass}>
      <div className={panelClass}>
        <p className={labelClass}>404 · not found</p>
        <h1 className={`${titleClass} mt-4`}>This page could not be found.</h1>
        <p className={`${bodyClass} mt-3`}>ไม่พบหน้าที่คุณกำลังมองหา</p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/en" className={linkClass}>
            Home
          </Link>
          <Link href="/th" className={linkClass}>
            หน้าแรก
          </Link>
        </div>
      </div>
    </main>
  );
}
