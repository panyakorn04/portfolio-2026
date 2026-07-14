import type { ReactNode } from "react";
import { body, eyebrow } from "./typography";

export default function Section({
  id,
  index,
  kicker,
  title,
  text,
  children,
}: {
  id: string;
  index: string;
  kicker: string;
  title: string;
  text?: string;
  children: ReactNode;
}) {
  return (
    <section
      id={id}
      className="scroll-mt-24 border-t border-[var(--color-line)] py-20 sm:py-28"
    >
      <div className="editorial-reveal">
        <header className="grid gap-5 lg:grid-cols-[8rem_minmax(0,1fr)_minmax(16rem,.55fr)] lg:items-start">
          <p className={`${eyebrow} text-[var(--color-accent)]`}>{index}</p>
          <div>
            <p className={eyebrow}>{kicker}</p>
            <h2 className="mt-4 max-w-3xl text-balance text-[clamp(1rem,4vw,3.4rem)] font-semibold leading-[1.1]">
              {title}
            </h2>
          </div>
          {text ? <p className={`${body} text-pretty lg:pt-7`}>{text}</p> : null}
        </header>
        <div className="mt-12 sm:mt-16">{children}</div>
      </div>
    </section>
  );
}
