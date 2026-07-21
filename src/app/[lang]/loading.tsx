import { barClass, glassCardClass, pageShellClass } from "@/components/ui/typography";

const panelClass = `mx-auto max-w-6xl ${glassCardClass}`;

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