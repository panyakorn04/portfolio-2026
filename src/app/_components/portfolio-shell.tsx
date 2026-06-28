import Link from "next/link";
import { articleDirectoryCopy } from "../_data/articles";
import type { Locale, PortfolioDictionary } from "../_data/portfolio";
import { contacts, socialLinks } from "../_data/site";
import { getAbsoluteSiteUrl, getLocalizedSitePath } from "../_data/site-url";
import ChatDemo from "./chat-demo";
import ContactForm from "./contact-form";
import HeroAmbientCanvas from "./hero-ambient-canvas-loader";
import MotionReveal from "./motion-reveal";
import Navbar from "./navbar";

const terminalLineClass =
    "flex flex-wrap gap-[0.42rem] font-mono text-[0.74rem] leading-[1.72] tabular-nums sm:gap-[0.5rem] sm:text-[0.78rem] sm:leading-[1.6]";
const terminalLabelClass =
    "font-mono text-[0.58rem] uppercase tracking-[0.06em] tabular-nums text-[var(--color-soft)] sm:text-[0.62rem]";
const terminalCopyClass =
    "text-[0.78rem] leading-[1.72] text-[var(--color-muted)] sm:text-[0.8rem] sm:leading-[1.68]";
const sectionCopyClass =
    "text-[0.8rem] leading-[1.8] text-[var(--color-muted)] sm:text-[0.84rem] sm:leading-[1.75]";
const terminalPanelClass =
    "rounded-[1.45rem] border border-[var(--color-line-strong)] bg-[linear-gradient(180deg,rgba(10,20,16,0.96),rgba(6,12,9,0.96))] p-4 shadow-[inset_0_0_0_1px_rgba(111,247,166,0.04)] sm:p-[0.95rem]";
const terminalWindowClass =
    "overflow-clip rounded-[1.45rem] border border-[var(--color-line-strong)] bg-[linear-gradient(180deg,rgba(10,20,16,0.96),rgba(6,12,9,0.96))] shadow-[inset_0_0_0_1px_rgba(111,247,166,0.04)]";
const terminalWindowBarClass =
    "flex items-center border-b border-[var(--color-line)] px-4 py-[0.82rem] font-mono text-[0.6rem] uppercase tracking-[0.04em] tabular-nums sm:text-[0.64rem]";
const terminalDotClass =
    "inline-block h-[0.65rem] w-[0.65rem] rounded-full opacity-[0.88]";
const terminalChipClass =
    "inline-flex items-center justify-center rounded-full border border-[var(--color-line-strong)] bg-[var(--color-panel)] px-[0.68rem] py-[0.42rem] font-mono text-[0.66rem] uppercase tracking-[0.04em] tabular-nums text-[var(--color-text)] sm:px-[0.62rem] sm:py-[0.38rem] sm:text-[0.7rem]";
const ctaPrimaryClass =
    "inline-flex items-center justify-center rounded-full border border-[var(--color-line-strong)] bg-[var(--color-accent)] px-[0.92rem] py-[0.68rem] font-mono text-[0.66rem] uppercase tracking-[0.04em] tabular-nums text-[#041009] sm:px-[0.9rem] sm:py-[0.68rem] sm:text-[0.7rem]";
const ctaSecondaryClass =
    "inline-flex items-center justify-center rounded-full border border-[var(--color-line-strong)] bg-transparent px-[0.92rem] py-[0.68rem] font-mono text-[0.66rem] uppercase tracking-[0.04em] tabular-nums text-[var(--color-text)] sm:px-[0.9rem] sm:py-[0.68rem] sm:text-[0.7rem]";
const terminalContactClass =
    "flex min-h-[6.25rem] flex-col justify-between rounded-[1.15rem] border border-[var(--color-line)] bg-[rgba(10,20,16,0.65)] px-[0.9rem] py-[0.85rem] font-mono tabular-nums sm:px-[0.9rem] sm:py-[0.8rem]";
const sectionTitleClass =
    '[font-family:var(--font-kanit),"Segoe_UI",sans-serif] text-[clamp(1.5rem,3.5vw,2.8rem)] font-semibold leading-[1.02] tracking-[-0.04em]';
const heroTitleClass =
    '[font-family:var(--font-kanit),"Segoe_UI",sans-serif] text-[clamp(1.95rem,4.4vw,4.2rem)] font-semibold leading-[0.98] tracking-[-0.04em]';

function PromptLine({
    command,
    value,
    tone = "default",
}: {
    command: string;
    value: string;
    tone?: "default" | "muted" | "accent";
}) {
    const valueClass =
        tone === "accent"
            ? "text-[var(--color-accent)]"
            : tone === "muted"
              ? "text-[var(--color-soft)]"
              : "text-[var(--color-text)]";

    return (
        <div className={terminalLineClass}>
            <span className="text-[var(--color-accent)]">$</span>
            <span className="text-[var(--color-soft)]">{command}</span>
            <span className={valueClass}>{value}</span>
        </div>
    );
}

function SectionBlock({
    id,
    command,
    eyebrow,
    title,
    text,
    children,
}: {
    id: string;
    command: string;
    eyebrow: string;
    title: string;
    text?: string;
    children: React.ReactNode;
}) {
    return (
        <section id={id} className="scroll-mt-[6.5rem] py-8 lg:py-10">
            <div className="border-t border-[var(--color-line-strong)] pt-4 lg:pt-[1.15rem]">
                <PromptLine command={command} value={eyebrow} tone="accent" />
                <h2
                    className={`${sectionTitleClass} mt-5 max-w-4xl text-balance`}
                >
                    {title}
                </h2>
                {text ? (
                    <p
                        className={`${sectionCopyClass} mt-4 max-w-3xl text-pretty`}
                    >
                        {text}
                    </p>
                ) : null}
            </div>
            <div className="mt-8">{children}</div>
        </section>
    );
}

function LocalizedBullets({ items }: { items: string[] }) {
    return (
        <ul className={`${terminalCopyClass} space-y-3`}>
            {items.map((item) => (
                <li key={item} className="flex gap-3">
                    <span className="mt-2 size-1.5 shrink-0 rounded-full bg-[var(--color-accent)]" />
                    <span className="text-pretty">{item}</span>
                </li>
            ))}
        </ul>
    );
}

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
    const hero = dictionary.hero;
    const sections = dictionary.sections;
    const ui = dictionary.ui;
    const articleCopy = articleDirectoryCopy[locale];
    const commands = ui.commands;
    const legal = dictionary.legal.directory;
    const termsUrl = getAbsoluteSiteUrl(getLocalizedSitePath(locale, "/terms"));
    const privacyUrl = getAbsoluteSiteUrl(
        getLocalizedSitePath(locale, "/privacy"),
    );

    return (
        <main
            lang={locale}
            className="relative min-h-screen overflow-x-clip bg-[var(--color-bg)] text-[var(--color-text)]"
        >
            <div className="pointer-events-none fixed inset-0 -z-10 bg-[linear-gradient(to_right,rgba(111,247,166,0.045)_1px,transparent_1px),linear-gradient(to_bottom,rgba(111,247,166,0.045)_1px,transparent_1px)] [background-size:24px_24px] [mask-image:linear-gradient(180deg,rgba(0,0,0,0.7),transparent_92%)] max-sm:hidden" />
            <Navbar locale={locale} dictionary={dictionary} />
            <section
                id="top"
                className="border-b border-[var(--color-line)] px-5 py-8 sm:px-8 sm:py-10"
            >
                <div className="mx-auto grid max-w-7xl gap-7 lg:grid-cols-[minmax(0,1.15fr)_22rem] lg:gap-10">
                    <MotionReveal className="relative after:pointer-events-none after:absolute after:right-[1.4rem] after:top-[1.1rem] after:h-36 after:w-36 after:rounded-full after:bg-[radial-gradient(circle,rgba(111,247,166,0.16),rgba(111,247,166,0))] after:blur-[24px]">
                        <div className={terminalWindowClass}>
                            <div className="relative overflow-hidden">
                                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_84%_78%,rgba(111,247,166,0.18),transparent_23%),radial-gradient(circle_at_78%_74%,rgba(142,239,255,0.12),transparent_22%),radial-gradient(circle_at_74%_30%,rgba(111,247,166,0.12),transparent_32%),radial-gradient(circle_at_70%_65%,rgba(111,247,166,0.08),transparent_26%)]" />
                                <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(5,11,8,0.38),rgba(5,11,8,0.18),rgba(5,11,8,0.2)),linear-gradient(180deg,rgba(5,11,8,0.14),transparent_34%,rgba(5,11,8,0.24)),radial-gradient(circle_at_56%_88%,rgba(111,247,166,0.08),transparent_24%)]" />
                                <HeroAmbientCanvas />
                                <div className="relative z-10">
                                    <div className={terminalWindowBarClass}>
                                        <span
                                            className={`${terminalDotClass} bg-[#ff5f56]`}
                                        />
                                        <span
                                            className={`${terminalDotClass} bg-[#ffbd2e]`}
                                        />
                                        <span
                                            className={`${terminalDotClass} bg-[#27c93f]`}
                                        />
                                        <span className="ml-4 text-[var(--color-soft)]">
                                            {ui.sessionLabel}/{locale}
                                        </span>
                                    </div>

                                    <div className="space-y-4 p-4 sm:p-5 lg:p-7">
                                        <div>
                                            <PromptLine
                                                command={commands.boot}
                                                value={hero.heroKicker}
                                                tone="muted"
                                            />
                                        </div>
                                        <div>
                                            <PromptLine
                                                command={commands.whoami}
                                                value="Panyakorn Boonyong"
                                                tone="accent"
                                            />
                                        </div>
                                        <div>
                                            <PromptLine
                                                command={commands.role}
                                                value={hero.badge}
                                            />
                                        </div>

                                        <div className="pt-3">
                                            <h1
                                                className={`${heroTitleClass} max-w-3xl text-balance text-[var(--color-text)]`}
                                            >
                                                {hero.heroTitle}
                                            </h1>
                                            <p
                                                className={`${sectionCopyClass} mt-5 max-w-2xl text-pretty`}
                                            >
                                                {hero.heroText}
                                            </p>
                                        </div>

                                        <div className="grid gap-3 border-t border-[var(--color-line)] pt-4 sm:grid-cols-2">
                                            <PromptLine
                                                command={commands.focus}
                                                value={hero.focusedText}
                                            />
                                            <PromptLine
                                                command={commands.status}
                                                value={hero.heroNote}
                                                tone="muted"
                                            />
                                        </div>

                                        <div className="flex flex-col gap-2.5 border-t border-[var(--color-line)] pt-4 sm:flex-row sm:flex-wrap">
                                            <a
                                                href="#work"
                                                className={`${ctaPrimaryClass} w-full sm:w-auto`}
                                            >
                                                {hero.viewWork}
                                            </a>
                                            <Link
                                                href="/Panyakorn_Boonyong_Resume.pdf"
                                                className={`${ctaSecondaryClass} w-full sm:w-auto`}
                                            >
                                                {hero.downloadResume}
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </MotionReveal>

                    <aside className="space-y-4 self-start lg:sticky lg:top-6">
                        <MotionReveal className="rounded-[1.45rem]">
                            <div className={terminalPanelClass}>
                                <p className={terminalLabelClass}>
                                    {ui.profilePreviewLabel}
                                </p>
                                <div className="relative mt-3 aspect-[4/5] overflow-hidden rounded-[1.35rem] border border-[var(--color-line)] bg-[var(--color-panel)] shadow-[inset_0_1px_0_rgba(111,247,166,0.05)]">
                                    {/* Using a native img here avoids shipping next/image client runtime for this static hero asset. */}
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                        src="/assets/profile.jpg?v=adb65e04"
                                        srcSet="/assets/profile-320.jpg?v=995dd4de 320w, /assets/profile.jpg?v=adb65e04 600w"
                                        sizes="(max-width: 639px) 320px, (max-width: 1023px) 90vw, 384px"
                                        alt={ui.profileImageAlt}
                                        decoding="async"
                                        loading="lazy"
                                        className="absolute inset-0 h-full w-full object-cover object-center"
                                    />
                                    <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(4,8,6,0.08),rgba(4,8,6,0.64))]" />
                                </div>
                            </div>
                        </MotionReveal>

                        <MotionReveal className="rounded-[1.45rem]">
                            <div className={terminalPanelClass}>
                                <p className={terminalLabelClass}>
                                    {ui.statsLabel}
                                </p>
                                <div className="mt-3 space-y-3">
                                    {dictionary.stats.map((stat) => (
                                        <div
                                            key={stat.value}
                                            className="border-b border-[var(--color-line)] pb-2.5 last:border-b-0 last:pb-0"
                                        >
                                            <p className="text-lg font-semibold tabular-nums text-[var(--color-accent)] sm:text-[1.35rem]">
                                                {stat.value}
                                            </p>
                                            <p className="mt-1 max-w-[18rem] text-[0.72rem] leading-5 text-[var(--color-soft)]">
                                                {stat.label}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </MotionReveal>

                        <MotionReveal className="rounded-[1.45rem]">
                            <div className={terminalPanelClass}>
                                <p className={terminalLabelClass}>
                                    {ui.linksLabel}
                                </p>
                                <div className="mt-3 flex flex-wrap gap-2">
                                    {socialLinks.map((link) => (
                                        <a
                                            key={link.key}
                                            href={link.href}
                                            target="_blank"
                                            rel="noreferrer"
                                            className={terminalChipClass}
                                        >
                                            {dictionary.socialLinks[link.key]}
                                        </a>
                                    ))}
                                </div>
                            </div>
                        </MotionReveal>
                    </aside>
                </div>
            </section>

            <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8 sm:py-14">
                <SectionBlock
                    id="about"
                    command={commands.about}
                    eyebrow={sections.aboutEyebrow}
                    title={sections.aboutTitle}
                    text={sections.aboutText}
                >
                    <div className="grid gap-4 lg:grid-cols-2">
                        {sections.principles.map((item, index) => (
                            <MotionReveal
                                key={item}
                                className="rounded-[1.45rem]"
                            >
                                <article className={terminalPanelClass}>
                                    <p className={terminalLabelClass}>
                                        rule_0{index + 1}
                                    </p>
                                    <p
                                        className={`${terminalCopyClass} mt-3 text-pretty`}
                                    >
                                        {item}
                                    </p>
                                </article>
                            </MotionReveal>
                        ))}
                    </div>
                </SectionBlock>

                <SectionBlock
                    id="work"
                    command={commands.work}
                    eyebrow={sections.workEyebrow}
                    title={sections.workTitle}
                    text={sections.workText}
                >
                    <div className="space-y-5">
                        {sections.featuredWork.map((project, index) => (
                            <MotionReveal
                                key={project.title}
                                className="rounded-[1.45rem]"
                            >
                                <article className={terminalPanelClass}>
                                    <div className="grid gap-5 lg:grid-cols-[11rem_minmax(0,1fr)_11rem] lg:gap-7">
                                        <div className="space-y-2 border-b border-[var(--color-line)] pb-3 lg:border-b-0 lg:border-r lg:pb-0 lg:pr-5">
                                            <p className={terminalLabelClass}>
                                                case_0{index + 1}
                                            </p>
                                            <p className="text-xs uppercase text-[var(--color-accent)]">
                                                {project.eyebrow}
                                            </p>
                                        </div>
                                        <div className="min-w-0">
                                            <h3 className="max-w-2xl text-lg font-semibold text-[var(--color-text)] sm:text-[1.2rem]">
                                                {project.title}
                                            </h3>
                                            <p
                                                className={`${terminalCopyClass} mt-3 max-w-2xl text-pretty`}
                                            >
                                                {project.description}
                                            </p>
                                            <ul
                                                className={`${terminalCopyClass} mt-4 space-y-2.5`}
                                            >
                                                {project.bullets.map(
                                                    (bullet) => (
                                                        <li
                                                            key={bullet}
                                                            className="flex gap-3"
                                                        >
                                                            <span className="mt-2 size-1.5 shrink-0 rounded-full bg-[var(--color-accent)]" />
                                                            <span className="text-pretty">
                                                                {bullet}
                                                            </span>
                                                        </li>
                                                    ),
                                                )}
                                            </ul>
                                        </div>
                                        <div className="border-t border-[var(--color-line)] pt-3 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-5">
                                            <p className={terminalLabelClass}>
                                                {ui.stackLabel}
                                            </p>
                                            <div className="mt-2.5 flex flex-wrap gap-2">
                                                {project.stack.map((item) => (
                                                    <span
                                                        key={item}
                                                        className={
                                                            terminalChipClass
                                                        }
                                                    >
                                                        {item}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </article>
                            </MotionReveal>
                        ))}
                    </div>
                </SectionBlock>

                <SectionBlock
                    id="skills"
                    command={commands.skills}
                    eyebrow={sections.skillsEyebrow}
                    title={sections.skillsTitle}
                    text={sections.skillsText}
                >
                    <MotionReveal className="rounded-[1.45rem]">
                        <div
                            className={`${terminalPanelClass} overflow-hidden`}
                        >
                            <div className="grid gap-0 divide-y divide-[var(--color-line)]">
                                {sections.skills.map((item) => (
                                    <div
                                        key={item.group}
                                        className="grid gap-2 py-3 lg:grid-cols-[12rem_minmax(0,1fr)] lg:gap-6 lg:py-4"
                                    >
                                        <p
                                            className={`${terminalLabelClass} pt-0.5`}
                                        >
                                            {item.group}
                                        </p>
                                        <p
                                            className={`${terminalCopyClass} max-w-3xl text-pretty`}
                                        >
                                            {item.list}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </MotionReveal>
                </SectionBlock>

                <SectionBlock
                    id="experience"
                    command={commands.experience}
                    eyebrow={sections.experienceEyebrow}
                    title={sections.roleTitle}
                    text={`${sections.company} · ${sections.timeline}`}
                >
                    <div className="grid gap-5 lg:grid-cols-[14rem_minmax(0,1fr)] lg:gap-6">
                        <MotionReveal className="rounded-[1.45rem]">
                            <div className={terminalPanelClass}>
                                <p className={terminalLabelClass}>
                                    {ui.currentRoleLabel}
                                </p>
                                <p className="mt-3 text-sm leading-6 text-[var(--color-text)]">
                                    {sections.company}
                                </p>
                                <p className="mt-1.5 text-[0.74rem] leading-6 text-[var(--color-soft)] sm:text-xs">
                                    {sections.timeline}
                                </p>
                            </div>
                        </MotionReveal>
                        <MotionReveal className="rounded-[1.45rem]">
                            <div className={terminalPanelClass}>
                                <LocalizedBullets
                                    items={sections.experienceBullets}
                                />
                            </div>
                        </MotionReveal>
                    </div>
                </SectionBlock>

                {articles.length > 0 ? (
                    <SectionBlock
                        id="articles"
                        command="cat ./articles"
                        eyebrow={articleCopy.eyebrow}
                        title={articleCopy.title}
                        text={articleCopy.description}
                    >
                        <div className="space-y-5">
                            <div className="grid gap-4 lg:grid-cols-2">
                                {articles.map((article) => (
                                    <MotionReveal
                                        key={article.slug}
                                        className="rounded-[1.45rem]"
                                    >
                                        <Link
                                            href={getLocalizedSitePath(
                                                locale,
                                                `/articles/${article.slug}`,
                                            )}
                                            className={`${terminalPanelClass} block transition-colors duration-150 hover:border-[var(--color-line-strong)]`}
                                        >
                                            <div className="flex flex-wrap gap-2">
                                                <span className="rounded-full border border-[var(--color-line)] px-2.5 py-1 font-mono text-[0.6rem] uppercase text-[var(--color-accent)]">
                                                    {article.category}
                                                </span>
                                                <span className="rounded-full border border-[var(--color-line)] px-2.5 py-1 font-mono text-[0.6rem] uppercase text-[var(--color-soft)]">
                                                    {article.readingTime}
                                                </span>
                                            </div>
                                            <h3 className="mt-4 text-lg font-semibold leading-snug text-[var(--color-text)] sm:text-[1.18rem]">
                                                {article.title}
                                            </h3>
                                            <p
                                                className={`${terminalCopyClass} mt-3 text-pretty`}
                                            >
                                                {article.summary}
                                            </p>
                                        </Link>
                                    </MotionReveal>
                                ))}
                            </div>
                            <Link
                                href={getLocalizedSitePath(locale, "/articles")}
                                className={ctaSecondaryClass}
                            >
                                {articleCopy.listLabel}
                            </Link>
                        </div>
                    </SectionBlock>
                ) : null}

                <SectionBlock
                    id="contact"
                    command={commands.contact}
                    eyebrow={sections.contactEyebrow}
                    title={sections.contactTitle}
                    text={sections.contactText}
                >
                    <div className="grid gap-5 xl:grid-cols-[minmax(0,1.08fr)_minmax(18rem,0.92fr)] xl:gap-6">
                        <MotionReveal className="rounded-[1.45rem]">
                            <ContactForm
                                locale={locale}
                                copy={dictionary.contactForm}
                            />
                        </MotionReveal>

                        <div className="space-y-5">
                            <MotionReveal className="rounded-[1.45rem]">
                                <div className={terminalPanelClass}>
                                    <p className={terminalLabelClass}>
                                        {ui.channelsLabel}
                                    </p>
                                    <div className="mt-3 grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
                                        {contacts.map((contact) => (
                                            <a
                                                key={contact.key}
                                                href={contact.href}
                                                target={
                                                    contact.href.startsWith(
                                                        "http",
                                                    )
                                                        ? "_blank"
                                                        : undefined
                                                }
                                                rel={
                                                    contact.href.startsWith(
                                                        "http",
                                                    )
                                                        ? "noreferrer"
                                                        : undefined
                                                }
                                                className={terminalContactClass}
                                            >
                                                <span className="text-xs uppercase text-[var(--color-soft)]">
                                                    {
                                                        dictionary
                                                            .contactLabels[
                                                            contact.key
                                                        ]
                                                    }
                                                </span>
                                                <span
                                                    className={`${terminalCopyClass} mt-2 text-[var(--color-text)]`}
                                                >
                                                    {contact.value}
                                                </span>
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            </MotionReveal>

                            <MotionReveal className="rounded-[1.45rem]">
                                <div className={terminalPanelClass}>
                                    <p className={terminalLabelClass}>
                                        {ui.legalLabel}
                                    </p>
                                    <div className="mt-3 space-y-4">
                                        <div>
                                            <p className="text-sm font-semibold text-[var(--color-text)]">
                                                {legal.title}
                                            </p>
                                            <p
                                                className={`${terminalCopyClass} mt-2 text-pretty`}
                                            >
                                                {legal.text}
                                            </p>
                                        </div>

                                        <div className="grid gap-3">
                                            {[
                                                {
                                                    label: legal.termsLabel,
                                                    help: legal.termsHelp,
                                                    href: termsUrl,
                                                },
                                                {
                                                    label: legal.privacyLabel,
                                                    help: legal.privacyHelp,
                                                    href: privacyUrl,
                                                },
                                            ].map((item) => (
                                                <Link
                                                    key={item.label}
                                                    href={getLocalizedSitePath(
                                                        locale,
                                                        item.label ===
                                                            legal.termsLabel
                                                            ? "/terms"
                                                            : "/privacy",
                                                    )}
                                                    className="rounded-[1.15rem] border border-[var(--color-line)] bg-[rgba(10,20,16,0.65)] px-[0.9rem] py-[0.85rem]"
                                                >
                                                    <p className="text-xs uppercase text-[var(--color-soft)]">
                                                        {item.label}{" "}
                                                        <span className="text-[var(--color-accent)]">
                                                            *
                                                        </span>
                                                    </p>
                                                    <p
                                                        className={`${terminalCopyClass} mt-2 text-pretty`}
                                                    >
                                                        {item.help}
                                                    </p>
                                                    <p className="mt-3 break-all font-mono text-[0.72rem] leading-6 text-[var(--color-accent)]">
                                                        {item.href}
                                                    </p>
                                                </Link>
                                            ))}
                                        </div>

                                        <p className="font-mono text-[0.66rem] uppercase tabular-nums text-[var(--color-soft)]">
                                            {legal.validationMessage}
                                        </p>
                                    </div>
                                </div>
                            </MotionReveal>

                            <MotionReveal className="rounded-[1.45rem]">
                                <div className={terminalPanelClass}>
                                    <p className={terminalLabelClass}>
                                        {sections.nextTitle}
                                    </p>
                                    <div className="mt-3">
                                        <LocalizedBullets
                                            items={sections.roadmap}
                                        />
                                    </div>
                                    <div className="mt-5 border-t border-[var(--color-line)] pt-3">
                                        <PromptLine
                                            command={ui.availabilityLabel}
                                            value={hero.heroNote}
                                            tone="muted"
                                        />
                                    </div>
                                </div>
                            </MotionReveal>
                        </div>
                    </div>
                </SectionBlock>

                <footer className="mt-12 flex flex-col items-center gap-1 border-t border-[var(--color-line)] pt-6 pb-2 text-center">
                    <p className="font-mono text-[0.66rem] uppercase tracking-[0.06em] tabular-nums text-[var(--color-soft)]">
                        © {new Date().getFullYear()} Panyakorn Boonyong
                    </p>
                    <p className="font-mono text-[0.62rem] tabular-nums text-[var(--color-soft)] opacity-70">
                        v{appVersion}
                    </p>
                </footer>
            </div>

            <ChatDemo copy={dictionary.chat} />
        </main>
    );
}
