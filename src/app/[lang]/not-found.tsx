import Link from "next/link";
import {
  errorLinkClass,
  fontDisplayClass,
  formLabel,
  glassCardClass,
  pageShellClass,
} from "@/components/ui/typography";

const panelClass = `mx-auto max-w-2xl ${glassCardClass}`;
const bodyClass = "text-[0.9rem] leading-[1.85] text-[var(--color-muted)]";

export default function NotFound() {
  return (
    <main className={pageShellClass}>
      <div className={panelClass}>
        <p className={formLabel}>404 · not found</p>
        <h1
          className={`${fontDisplayClass} mt-4 text-[clamp(1.8rem,4vw,3rem)] font-semibold leading-[1.05] tracking-[-0.04em] text-balance`}
        >
          This page could not be found.
        </h1>
        <p className={`${bodyClass} mt-3`}>ไม่พบหน้าที่คุณกำลังมองหา</p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/en" className={errorLinkClass}>
            Home
          </Link>
          <Link href="/th" className={errorLinkClass}>
            หน้าแรก
          </Link>
        </div>
      </div>
    </main>
  );
}
