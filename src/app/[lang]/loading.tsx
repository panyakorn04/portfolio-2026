const pageShellClass =
  "min-h-screen bg-[var(--color-bg)] px-5 py-8 text-[var(--color-text)] sm:px-8 sm:py-10";
const panelClass =
  "mx-auto max-w-6xl rounded-[1.45rem] border border-[var(--color-line-strong)] bg-[linear-gradient(180deg,rgba(10,20,16,0.96),rgba(6,12,9,0.96))] p-6 shadow-[inset_0_0_0_1px_rgba(111,247,166,0.04)] sm:p-8";
const barClass = "rounded-full bg-[rgba(111,247,166,0.08)]";

export default function Loading() {
  return (
    <main className={pageShellClass} aria-busy="true" aria-live="polite">
      <div className={`${panelClass} animate-pulse space-y-5`}>
        <div className={`${barClass} h-3 w-24`} />
        <div className={`${barClass} h-10 w-3/4`} />
        <div className={`${barClass} h-4 w-full`} />
        <div className={`${barClass} h-4 w-5/6`} />
        <div className="grid gap-4 pt-4 sm:grid-cols-2">
          <div className={`${barClass} h-32`} />
          <div className={`${barClass} h-32`} />
        </div>
      </div>
    </main>
  );
}
