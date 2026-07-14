import type { PortfolioDictionary } from "../lib/portfolio";
import { copy, label } from "./ui/typography";

type CaseStudy = PortfolioDictionary["sections"]["flagshipCaseStudy"];

export function FlagshipCaseStudy({ study }: { study: CaseStudy }) {
  return (
    <article>
      <div className="grid gap-10 xl:grid-cols-[minmax(0,.8fr)_minmax(30rem,1.2fr)] xl:items-center">
        <div>
          <div className="flex items-center gap-3">
            <p className={label}>{study.eyebrow}</p>
            <span className="h-px flex-1 bg-[var(--color-line)]" />
            <span className={label}>{study.liveBadge}</span>
          </div>
          <h3 className="mt-7 text-balance text-[clamp(1.3rem,3vw,3rem)] font-semibold leading-[1.1]">
            {study.title}
          </h3>
          <p className={`${copy} mt-7 max-w-2xl text-pretty text-base`}>
            {study.summary}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href={study.liveHref}
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-11 items-center border border-[var(--color-accent)] bg-[var(--color-accent)] px-5 text-sm font-semibold text-[#07110d]"
            >
              {study.liveLabel} ↗
            </a>
            <a
              href={study.sourceHref}
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-11 items-center border border-[var(--color-line-strong)] px-5 text-sm font-semibold"
            >
              {study.sourceLabel} ↗
            </a>
          </div>
        </div>
        <section
          className="border border-[var(--color-line-strong)] bg-[#101311] p-3 sm:p-5"
          aria-label={study.architectureLabel}
        >
          <div className="flex items-center justify-between border-b border-[var(--color-line)] pb-4">
            <div>
              <p className={label}>AI Workflow Studio</p>
              <p className="mt-1 text-xs text-[var(--color-soft)]">
                Execution inspector / production
              </p>
            </div>
            <span className="flex items-center gap-2 text-xs text-[var(--color-accent)]">
              <i className="size-2 rounded-full bg-[var(--color-accent)]" />
              Live
            </span>
          </div>
          <div className="grid gap-3 py-4 sm:grid-cols-[10rem_1fr]">
            <aside className="border border-[var(--color-line)] p-3">
              <p className={label}>Workflows</p>
              {study.capabilities.slice(0, 3).map((item, i) => (
                <div
                  key={item}
                  className={`mt-3 border-l-2 ${i === 0 ? "border-[var(--color-accent)] bg-[var(--accent-dim)]" : "border-[var(--color-line)]"} p-2`}
                >
                  <p className="text-xs font-medium">
                    {i === 0
                      ? "Content intelligence"
                      : i === 1
                        ? "Competitive research"
                        : "Meeting action center"}
                  </p>
                  <p className="mt-1 font-mono text-[.55rem] text-[var(--color-soft)]">
                    {i === 0 ? "RUNNING" : "ACTIVE"}
                  </p>
                </div>
              ))}
            </aside>
            <div className="border border-[var(--color-line)] p-4">
              <div className="flex justify-between">
                <div>
                  <p className={label}>{study.architectureLabel}</p>
                  <p className="mt-2 text-sm font-semibold">Production system path</p>
                </div>
                <span className="font-mono text-[.6rem] text-[var(--color-soft)]">
                  LIVE
                </span>
              </div>
              <ol className="mt-6">
                {study.architecture.map((node, i) => (
                  <li
                    key={node.label}
                    className="relative grid grid-cols-[1.5rem_1fr] gap-3 pb-5 last:pb-0"
                  >
                    <span className="relative z-10 grid size-6 place-items-center rounded-full border border-[var(--color-accent)] bg-[#101311] font-mono text-[.55rem] text-[var(--color-accent)]">
                      {i + 1}
                    </span>
                    {i < study.architecture.length - 1 ? (
                      <span className="absolute left-[.72rem] top-6 h-full w-px bg-[var(--color-line-strong)]" />
                    ) : null}
                    <div>
                      <strong className="text-xs">{node.label}</strong>
                      <p className="mt-1 text-[.68rem] leading-5 text-[var(--color-soft)]">
                        {node.detail}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-px bg-[var(--color-line)]">
            {[study.capabilitiesLabel, study.securityLabel, study.outcomesLabel].map(
              (x, i) => (
                <div key={x} className="bg-[#101311] p-3">
                  <p className="font-mono text-[.55rem] text-[var(--color-soft)]">{x}</p>
                  <p className="mt-1 text-sm text-[var(--color-accent)]">
                    {i === 0 ? "SSE" : i === 1 ? "Session" : "Shipped"}
                  </p>
                </div>
              ),
            )}
          </div>
        </section>
      </div>
      <div className="mt-16 grid border-y border-[var(--color-line)] lg:grid-cols-2">
        <section className="py-8 lg:pr-10">
          <p className={label}>{study.problemLabel}</p>
          <p className={`${copy} mt-4 text-pretty`}>{study.problem}</p>
        </section>
        <section className="border-t border-[var(--color-line)] py-8 lg:border-l lg:border-t-0 lg:pl-10">
          <p className={label}>{study.solutionLabel}</p>
          <p className={`${copy} mt-4 text-pretty`}>{study.solution}</p>
        </section>
      </div>
      <div className="grid gap-10 py-10 lg:grid-cols-3">
        {[
          { h: study.capabilitiesLabel, x: study.capabilities },
          { h: study.securityLabel, x: study.security },
          { h: study.outcomesLabel, x: study.outcomes },
        ].map((g) => (
          <section key={g.h}>
            <p className={label}>{g.h}</p>
            <ul className="mt-5 grid gap-4">
              {g.x.map((x) => (
                <li
                  key={x}
                  className={`${copy} border-t border-[var(--color-line)] pt-4`}
                >
                  {x}
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
      <div className="flex flex-col gap-5 border-t border-[var(--color-line)] pt-6 md:flex-row md:items-center md:justify-between">
        <p className="font-mono text-[.65rem] leading-6 text-[var(--color-soft)]">
          {study.stack.join(" · ")}
        </p>
        <a
          href={study.backendHref}
          target="_blank"
          rel="noreferrer"
          className="text-sm text-[var(--color-accent)]"
        >
          {study.backendLabel} ↗
        </a>
      </div>
      <p className={`${copy} mt-5 text-xs`}>{study.note}</p>
    </article>
  );
}
