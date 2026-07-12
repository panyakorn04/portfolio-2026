import type { PortfolioDictionary } from "../_data/portfolio";
import { buttonBase, buttonSizes } from "./button";

type CaseStudy = PortfolioDictionary["sections"]["flagshipCaseStudy"];
const surface =
  "rounded-[var(--radius)] border border-[var(--color-line)] bg-[rgba(0,0,0,0.18)]";
const label =
  "font-mono text-[0.6rem] uppercase tracking-[0.11em] text-[var(--color-accent)]";
const copy = "text-[0.84rem] leading-[1.72] text-[var(--color-muted)]";
const cta = `${buttonBase} ${buttonSizes.lg} justify-center border border-[var(--color-line-strong)] font-semibold tracking-[0.05em] hover:-translate-y-0.5 hover:border-[var(--color-accent)]`;

function DetailList({ items }: { items: string[] }) {
  return (
    <ul className="mt-4 grid gap-3">
      {items.map((item) => (
        <li key={item} className={`${copy} flex gap-3 text-pretty`}>
          <span
            aria-hidden="true"
            className="mt-2.5 size-1.5 shrink-0 rounded-full bg-[var(--color-accent)] shadow-[0_0_14px_var(--accent-glow)]"
          />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export function FlagshipCaseStudy({ study }: { study: CaseStudy }) {
  const detailGroups = [
    { heading: study.capabilitiesLabel, items: study.capabilities },
    { heading: study.securityLabel, items: study.security },
    { heading: study.outcomesLabel, items: study.outcomes },
  ];

  return (
    <article className="relative mb-5 overflow-hidden rounded-[var(--radius-lg)] border border-[var(--accent-border)] bg-[linear-gradient(145deg,rgba(26,255,125,0.1),rgba(255,255,255,0.025)_38%,rgba(0,0,0,0.2))] p-5 shadow-[0_24px_80px_rgba(0,0,0,0.28)] sm:p-6">
      <div
        aria-hidden="true"
        className="absolute -right-20 -top-24 size-64 rounded-full bg-[var(--accent-glow)] opacity-20 blur-3xl"
      />
      <div className="relative">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className={label}>case_00 · {study.eyebrow}</p>
          <span className="rounded-full border border-[var(--accent-border)] bg-[var(--accent-dim)] px-3 py-1 font-mono text-[0.58rem] uppercase tracking-[0.08em] text-[var(--color-accent)]">
            {study.liveBadge}
          </span>
        </div>
        <h3 className="mt-4 max-w-4xl text-balance [font-family:var(--font-display),sans-serif] text-[clamp(1.55rem,4vw,3rem)] font-semibold leading-[1.02] tracking-[-0.06em]">
          {study.title}
        </h3>
        <p className={`${copy} mt-4 max-w-3xl text-pretty text-[0.94rem] sm:text-base`}>
          {study.summary}
        </p>

        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          <section className={`${surface} p-4 sm:p-5`}>
            <p className={label}>{study.problemLabel}</p>
            <p className={`${copy} mt-3 text-pretty`}>{study.problem}</p>
          </section>
          <section className={`${surface} p-4 sm:p-5`}>
            <p className={label}>{study.solutionLabel}</p>
            <p className={`${copy} mt-3 text-pretty`}>{study.solution}</p>
          </section>
        </div>

        <section className={`${surface} mt-4 p-4 sm:p-5`}>
          <p className={label}>{study.architectureLabel}</p>
          <ol className="mt-4 grid gap-3 md:grid-cols-4">
            {study.architecture.map((node, index) => (
              <li
                key={node.label}
                className="relative rounded-[var(--radius-sm)] border border-[var(--color-line)] bg-[var(--surface)] p-4"
              >
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[0.62rem] text-[var(--color-soft)]">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <strong className="text-sm text-[var(--color-text)]">
                    {node.label}
                  </strong>
                </div>
                <p className={`${copy} mt-2 text-[0.76rem]`}>{node.detail}</p>
                {index < study.architecture.length - 1 ? (
                  <span
                    aria-hidden="true"
                    className="absolute -right-3 top-1/2 z-10 hidden text-[var(--color-accent)] md:block"
                  >
                    →
                  </span>
                ) : null}
              </li>
            ))}
          </ol>
        </section>

        <div className="mt-4 grid gap-4 lg:grid-cols-3">
          {detailGroups.map((group) => (
            <section key={group.heading} className={`${surface} p-4 sm:p-5`}>
              <p className={label}>{group.heading}</p>
              <DetailList items={group.items} />
            </section>
          ))}
        </div>

        <div className="mt-5 flex flex-wrap gap-2 border-t border-[var(--color-line)] pt-5">
          {study.stack.map((item) => (
            <span
              key={item}
              className="rounded-full border border-[var(--color-line)] bg-[var(--surface)] px-3 py-1.5 font-mono text-[0.62rem] text-[var(--color-soft)]"
            >
              {item}
            </span>
          ))}
        </div>
        <p className={`${copy} mt-4 text-pretty text-[0.76rem]`}>{study.note}</p>
        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          <a
            href={study.liveHref}
            target="_blank"
            rel="noreferrer"
            className={`${cta} bg-[var(--color-accent)] text-[#05070a] shadow-[var(--shadow-btn)]`}
          >
            {study.liveLabel} ↗
          </a>
          <a
            href={study.sourceHref}
            target="_blank"
            rel="noreferrer"
            className={`${cta} bg-[var(--surface)] text-[var(--color-text)] hover:text-[var(--color-accent)]`}
          >
            {study.sourceLabel} ↗
          </a>
          <a
            href={study.backendHref}
            target="_blank"
            rel="noreferrer"
            className={`${cta} bg-[var(--surface)] text-[var(--color-text)] hover:text-[var(--color-accent)]`}
          >
            {study.backendLabel} ↗
          </a>
        </div>
      </div>
    </article>
  );
}
