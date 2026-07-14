import { barClass, glassCardClass, pageShellClassWide } from "@/components/ui/typography";

const panelClass = `mx-auto max-w-6xl ${glassCardClass}`;

export default function ArticlesLoading() {
  return (
    <main className={pageShellClassWide} aria-busy="true" aria-live="polite">
      <div className={`${panelClass} animate-pulse space-y-5`}>
        <div className={`${barClass} h-3 w-20`} />
        <div className={`${barClass} h-8 w-1/2`} />
        <div className={`${barClass} h-4 w-2/3`} />
        <div className="space-y-4 pt-4">
          <div className="space-y-3 border-t border-[var(--color-line)] pt-4">
            <div className={`${barClass} h-3 w-32`} />
            <div className={`${barClass} h-5 w-3/4`} />
            <div className={`${barClass} h-4 w-full`} />
            <div className={`${barClass} h-4 w-5/6`} />
          </div>
          <div className="space-y-3 border-t border-[var(--color-line)] pt-4">
            <div className={`${barClass} h-3 w-32`} />
            <div className={`${barClass} h-5 w-3/4`} />
            <div className={`${barClass} h-4 w-full`} />
            <div className={`${barClass} h-4 w-5/6`} />
          </div>
          <div className="space-y-3 border-t border-[var(--color-line)] pt-4">
            <div className={`${barClass} h-3 w-32`} />
            <div className={`${barClass} h-5 w-3/4`} />
            <div className={`${barClass} h-4 w-full`} />
            <div className={`${barClass} h-4 w-5/6`} />
          </div>
        </div>
      </div>
    </main>
  );
}
