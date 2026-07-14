import Image from "next/image";
import Link from "next/link";
import ContactForm from "@/components/contact-form";
import Navbar from "@/components/navbar";
import Bullets from "@/components/ui/bullets";
import Section from "@/components/ui/section";
import {
  body,
  eyebrow,
  linkButtonPrimary,
  linkButtonSecondary,
} from "@/components/ui/typography";
import type { Locale, PortfolioDictionary } from "@/lib/portfolio";
import { contacts, socialLinks } from "@/lib/site";
import { getLocalizedSitePath } from "@/lib/site-url";
import profileImage from "../../../../public/assets/profile.jpg";
import ChatDemo from "./chat-demo-loader";
import { FlagshipCaseStudy } from "./flagship-case-study";

export type PortfolioArticleSummary = {
  slug: string;
  category: string;
  title: string;
  summary: string;
  publishedAt: string;
  readingTime: string;
};

export function PortfolioShell({
  locale,
  dictionary,
  articles,
  appVersion,
}: {
  locale: Locale;
  dictionary: PortfolioDictionary;
  articles: PortfolioArticleSummary[];
  appVersion: string;
}) {
  const { hero, sections, ui, articleDirectory: articleCopy } = dictionary;
  return (
    <main lang={locale} className="min-h-screen overflow-x-clip text-[var(--color-text)]">
      <Navbar locale={locale} dictionary={dictionary} />
      <div className="mx-auto max-w-[88rem] px-5 sm:px-8 lg:px-12">
        <section
          id="top"
          className="grid min-h-[calc(100svh-4.5rem)] items-center gap-12 py-16 lg:grid-cols-[minmax(0,1.15fr)_minmax(20rem,.65fr)] lg:py-24"
        >
          <div>
            <p className={`${eyebrow} text-[var(--color-accent)]`}>{hero.heroKicker}</p>
            <h1 className="mt-7 max-w-5xl text-balance text-[clamp(3rem,4.8vw,4.4rem)] font-semibold leading-[1.1]">
              {hero.heroTitle}
            </h1>
            <div className="mt-9 grid gap-7 border-t border-[var(--color-line)] pt-7 md:grid-cols-[minmax(0,1fr)_15rem]">
              <p className={`${body} max-w-2xl text-pretty`}>{hero.heroText}</p>
              <div>
                <p className={eyebrow}>{hero.badge}</p>
                <p className="mt-3 text-sm leading-6 text-[var(--color-accent)]">
                  {hero.heroNote}
                </p>
              </div>
            </div>
            <div className="mt-9 flex flex-wrap gap-3">
              <a href="#work" className={linkButtonPrimary}>
                {hero.viewWork} ↓
              </a>
              <Link href="/Panyakorn_Boonyong_Resume.pdf" className={linkButtonSecondary}>
                {hero.downloadResume}
              </Link>
              <a href="#contact" className={linkButtonSecondary}>
                {hero.contactMe}
              </a>
            </div>
          </div>
          <div className="editorial-reveal relative lg:justify-self-end">
            <div className="relative mx-auto aspect-[4/5] w-full max-w-md overflow-hidden bg-[var(--color-panel)]">
              <Image
                src={profileImage}
                fill
                sizes="(max-width:1024px) 90vw, 420px"
                priority
                placeholder="blur"
                alt={ui.profileImageAlt}
                className="object-cover grayscale-[.15]"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#0b0d0c] to-transparent p-6 pt-24">
                <p className={eyebrow}>Panyakorn Boonyong</p>
                <p className="mt-2 text-sm text-[var(--color-muted)]">
                  {hero.focusedText}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-3 border-x border-b border-[var(--color-line)]">
              {dictionary.stats.map((s) => (
                <div
                  key={s.value}
                  className="border-r border-[var(--color-line)] p-4 last:border-r-0"
                >
                  <strong className="block text-xl text-[var(--color-accent)]">
                    {s.value}
                  </strong>
                  <span className="mt-1 block text-[.68rem] leading-4 text-[var(--color-soft)]">
                    {s.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <Section
          id="work"
          index="01"
          kicker={sections.workEyebrow}
          title={sections.workTitle}
          text={sections.workText}
        >
          <FlagshipCaseStudy
            study={sections.flagshipCaseStudy}
            ui={dictionary.flagshipCaseStudyUi}
          />
          <div className="mt-20 border-t border-[var(--color-line)]">
            {sections.featuredWork.map((project, i) => (
              <article
                key={project.title}
                className="group grid gap-5 border-b border-[var(--color-line)] py-10 md:grid-cols-[5rem_minmax(14rem,.7fr)_minmax(0,1fr)]"
              >
                <p className={`${eyebrow} text-[var(--color-accent)]`}>
                  {String(i + 2).padStart(2, "0")}
                </p>
                <div>
                  <p className={eyebrow}>{project.eyebrow}</p>
                  <h3 className="mt-3 text-2xl font-semibold tracking-[-.04em] sm:text-xl">
                    {project.title}
                  </h3>
                </div>
                <div>
                  <Bullets items={project.bullets} />
                  <p className="mt-6 font-mono text-[.68rem] leading-6 text-[var(--color-soft)]">
                    {project.stack.join(" · ")}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </Section>

        <Section
          id="about"
          index="02"
          kicker={sections.aboutEyebrow}
          title={sections.aboutTitle}
          text={sections.aboutText}
        >
          <div className="grid border-t border-[var(--color-line)] md:grid-cols-2">
            {sections.principles.map((item, i) => (
              <div
                key={item}
                className="border-b border-[var(--color-line)] py-8 md:odd:pr-10 md:even:border-l md:even:pl-10"
              >
                <p className={`${eyebrow} text-[var(--color-accent)]`}>0{i + 1}</p>
                <p className="mt-5 max-w-xl text-xl leading-snug tracking-[-.025em]">
                  {item}
                </p>
              </div>
            ))}
          </div>
        </Section>

        <Section
          id="ecosystem"
          index="03"
          kicker={sections.ecosystemEyebrow}
          title={sections.ecosystemTitle}
          text={sections.ecosystemText}
        >
          <div className="grid gap-px bg-[var(--color-line)] border border-[var(--color-line)] lg:grid-cols-2">
            {sections.ecosystemRepositories.map((repo, i) => (
              <a
                key={repo.href}
                href={repo.href}
                target="_blank"
                rel="noreferrer"
                className="group bg-[var(--color-bg)] p-7 transition-colors hover:bg-[var(--color-panel)] sm:p-9"
              >
                <div className="flex justify-between">
                  <p className={eyebrow}>{repo.eyebrow}</p>
                  <span className="text-[var(--color-accent)]">↗</span>
                </div>
                <h3 className="mt-5 text-2xl font-semibold tracking-[-.04em]">
                  {repo.title}
                </h3>
                <p className={`${body} mt-4`}>{repo.description}</p>
                <p className="mt-7 font-mono text-[.65rem] text-[var(--color-soft)]">
                  0{i + 1} / {repo.stack.join(" · ")}
                </p>
              </a>
            ))}
          </div>
        </Section>

        <Section
          id="experience"
          index="04"
          kicker={sections.experienceEyebrow}
          title={sections.experienceRoles[0]?.roleTitle ?? ""}
        >
          <div className="border-t border-[var(--color-line)]">
            {sections.experienceRoles.map((role) => (
              <article
                key={role.company}
                className="grid gap-7 border-b border-[var(--color-line)] py-10 lg:grid-cols-[minmax(16rem,.65fr)_minmax(0,1fr)]"
              >
                <div>
                  <h3 className="text-xl font-semibold">{role.company}</h3>
                  <p className={`${eyebrow} mt-3`}>
                    {role.roleTitle}
                    <br />
                    {role.timeline}
                  </p>
                </div>
                <Bullets items={role.bullets} />
              </article>
            ))}
          </div>
        </Section>

        <Section
          id="skills"
          index="05"
          kicker={sections.skillsEyebrow}
          title={sections.skillsTitle}
          text={sections.skillsText}
        >
          <dl className="border-t border-[var(--color-line)]">
            {sections.skills.map((item) => (
              <div
                key={item.group}
                className="grid gap-3 border-b border-[var(--color-line)] py-6 sm:grid-cols-[12rem_1fr]"
              >
                <dt className={`${eyebrow} text-[var(--color-accent)]`}>{item.group}</dt>
                <dd className="text-lg leading-relaxed text-[var(--color-muted)]">
                  {item.list}
                </dd>
              </div>
            ))}
          </dl>
        </Section>

        {articles.length ? (
          <Section
            id="articles"
            index="06"
            kicker={articleCopy.eyebrow}
            title={articleCopy.title}
            text={articleCopy.description}
          >
            <div className="border-t border-[var(--color-line)]">
              {articles.map((article, i) => (
                <Link
                  key={article.slug}
                  href={getLocalizedSitePath(locale, `/articles/${article.slug}`)}
                  className="group grid gap-4 border-b border-[var(--color-line)] py-8 md:grid-cols-[4rem_1fr_auto] md:items-center"
                >
                  <span className={eyebrow}>{String(i + 1).padStart(2, "0")}</span>
                  <div>
                    <p className={`${eyebrow} text-[var(--color-accent)]`}>
                      {article.category} · {article.readingTime}
                    </p>
                    <h3 className="mt-2 text-2xl font-semibold tracking-[-.04em] group-hover:text-[var(--color-accent)]">
                      {article.title}
                    </h3>
                    <p className={`${body} mt-2 max-w-3xl`}>{article.summary}</p>
                  </div>
                  <span className="text-2xl">↗</span>
                </Link>
              ))}
            </div>
            <Link
              href={getLocalizedSitePath(locale, "/articles")}
              className={`${linkButtonSecondary} mt-8`}
            >
              {articleCopy.listLabel}
            </Link>
          </Section>
        ) : null}

        <Section
          id="contact"
          index={articles.length ? "07" : "06"}
          kicker={sections.contactEyebrow}
          title={sections.contactTitle}
          text={sections.contactText}
        >
          <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_20rem]">
            <ContactForm locale={locale} copy={dictionary.contactForm} />
            <div className="border-t border-[var(--color-line)]">
              {contacts.map((c) => (
                <a
                  key={c.key}
                  href={c.href}
                  target={c.href.startsWith("http") ? "_blank" : undefined}
                  rel={c.href.startsWith("http") ? "noreferrer" : undefined}
                  className="block border-b border-[var(--color-line)] py-5"
                >
                  <span className={eyebrow}>{dictionary.contactLabels[c.key]}</span>
                  <span className="mt-2 block break-words text-sm">{c.value}</span>
                </a>
              ))}
            </div>
          </div>
        </Section>
        <footer className="flex flex-col justify-between gap-5 border-t border-[var(--color-line)] py-10 sm:flex-row">
          <p className={eyebrow}>
            {dictionary.footer.copyright.replace(
              "{year}",
              String(new Date().getFullYear()),
            )}{" "}
            · v{appVersion}
          </p>
          <div className="flex gap-5">
            {socialLinks.map((l) => (
              <a
                key={l.key}
                href={l.href}
                target="_blank"
                rel="noreferrer"
                className={`${eyebrow} min-h-11 py-3 hover:text-[var(--color-accent)]`}
              >
                {dictionary.socialLinks[l.key]}
              </a>
            ))}
          </div>
        </footer>
      </div>
      <ChatDemo copy={dictionary.chat} />
    </main>
  );
}
