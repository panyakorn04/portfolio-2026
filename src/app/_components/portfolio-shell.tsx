import Image from "next/image";
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
    "flex flex-wrap gap-[0.45rem] font-mono text-[0.74rem] leading-[1.7] tabular-nums sm:gap-[0.5rem] sm:text-[0.78rem] sm:leading-[1.6]";
const terminalLabelClass =
    "font-mono text-[0.58rem] uppercase tracking-[0.08em] tabular-nums text-[var(--color-soft)] sm:text-[0.62rem]";
const terminalCopyClass =
    "text-[0.8rem] leading-[1.75] text-[var(--color-muted)] sm:text-[0.83rem] sm:leading-[1.7]";
const sectionCopyClass =
    "text-[0.83rem] leading-[1.8] text-[var(--color-muted)] sm:text-[0.87rem] sm:leading-[1.75]";
const terminalPanelClass =
    "rounded-2xl border border-[rgba(111,247,166,0.12)] bg-[rgba(8,16,12,0.7)] p-4 shadow-[inset_0_1px_0_rgba(111,247,166,0.05),0_4px_24px_rgba(0,0,0,0.25)] backdrop-blur-[2px] sm:p-5";
const terminalWindowClass =
    "overflow-clip rounded-2xl border border-[rgba(111,247,166,0.18)] bg-[rgba(7,14,10,0.9)]";
const terminalWindowBarClass =
    "flex items-center gap-1.5 border-b border-[rgba(111,247,166,0.08)] bg-[rgba(5,10,7,0.6)] px-4 py-3 font-mono text-[0.6rem] uppercase tracking-[0.05em] tabular-nums sm:text-[0.64rem]";
const terminalDotClass = "inline-block h-[0.65rem] w-[0.65rem] rounded-full";
const terminalChipClass =
    "inline-flex items-center justify-center rounded-full border border-[rgba(111,247,166,0.15)] bg-[rgba(111,247,166,0.06)] px-3 py-1.5 font-mono text-[0.67rem] uppercase tracking-[0.04em] tabular-nums text-[var(--color-text)] transition-all duration-200 hover:border-[rgba(111,247,166,0.35)] hover:text-[var(--color-accent)] sm:text-[0.7rem]";
const ctaPrimaryClass =
    "inline-flex items-center justify-center gap-1.5 rounded-full bg-[var(--color-accent)] px-5 py-2.5 font-mono text-[0.7rem] uppercase tracking-[0.05em] tabular-nums text-[#041009] transition-all duration-200 hover:brightness-105 hover:shadow-[0_0_20px_rgba(111,247,166,0.28)] active:scale-[0.98] sm:text-[0.72rem]";
const ctaSecondaryClass =
    "inline-flex items-center justify-center gap-1.5 rounded-full border border-[rgba(111,247,166,0.22)] bg-transparent px-5 py-2.5 font-mono text-[0.7rem] uppercase tracking-[0.05em] tabular-nums text-[var(--color-text)] transition-all duration-200 hover:border-[rgba(111,247,166,0.4)] hover:bg-[rgba(111,247,166,0.07)] active:scale-[0.98] sm:text-[0.72rem]";
const terminalContactClass =
    "flex min-h-[5.5rem] flex-col justify-between rounded-xl border border-[rgba(111,247,166,0.1)] bg-[rgba(8,16,12,0.6)] px-4 py-3.5 backdrop-blur-[2px] transition-all duration-200 hover:border-[rgba(111,247,166,0.25)] hover:bg-[rgba(111,247,166,0.03)] sm:px-4 sm:py-3.5";
const sectionTitleClass =
    '[font-family:var(--font-display),"Segoe_UI",sans-serif] text-[clamp(1.65rem,3.8vw,3.1rem)] font-semibold leading-[1.0] tracking-[-0.04em]';
const heroTitleClass =
    '[font-family:var(--font-display),"Segoe_UI",sans-serif] text-[clamp(2.2rem,5.2vw,4.8rem)] font-semibold leading-[0.92] tracking-[-0.05em]';

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
        <section id={id} className="scroll-mt-[6.5rem] py-12 lg:py-16">
            <div className="border-t border-[rgba(111,247,166,0.12)] pt-6 lg:pt-8">
                <div className="flex items-center gap-3">
                    <span className="block h-px w-8 shrink-0 bg-[var(--color-accent)] opacity-70" />
                    <PromptLine
                        command={command}
                        value={eyebrow}
                        tone="accent"
                    />
                </div>
                <h2
                    className={`${sectionTitleClass} mt-4 max-w-4xl text-balance`}
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
            <div className="mt-10">{children}</div>
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
                className="border-b border-[rgba(111,247,166,0.1)] px-5 py-8 sm:px-8 sm:py-10"
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
                                                className={`${heroTitleClass} max-w-3xl text-balance`}
                                                style={{
                                                    backgroundImage:
                                                        "linear-gradient(135deg, oklch(0.96 0.035 160) 30%, oklch(0.86 0.18 155))",
                                                    backgroundClip: "text",
                                                    WebkitBackgroundClip:
                                                        "text",
                                                    color: "transparent",
                                                }}
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

                    <aside className="space-y-4 self-start lg:sticky lg:top-[5rem]">
                        <MotionReveal className="rounded-2xl">
                            <div className={terminalPanelClass}>
                                <p className={terminalLabelClass}>
                                    {ui.profilePreviewLabel}
                                </p>
                                <div className="relative mt-3 aspect-[4/5] overflow-hidden rounded-xl border border-[rgba(111,247,166,0.1)] bg-[var(--color-panel)]">
                                    <Image
                                        src="/assets/profile.jpg?v=adb65e04"
                                        fill
                                        sizes="(max-width: 639px) 320px, (max-width: 1023px) 90vw, 384px"
                                        alt={ui.profileImageAlt}
                                        priority
                                        className="absolute inset-0 h-full w-full object-cover object-center transition-transform duration-500 hover:scale-[1.03]"
                                    />
                                    <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_40%,rgba(4,8,6,0.75))]" />
                                </div>
                            </div>
                        </MotionReveal>

                        <MotionReveal className="rounded-2xl">
                            <div className={terminalPanelClass}>
                                <p className={terminalLabelClass}>
                                    {ui.statsLabel}
                                </p>
                                <div className="mt-3 divide-y divide-[rgba(111,247,166,0.07)]">
                                    {dictionary.stats.map((stat) => (
                                        <div
                                            key={stat.value}
                                            className="py-3 first:pt-0 last:pb-0"
                                        >
                                            <p className="[font-family:var(--font-display),sans-serif] text-[1.6rem] font-semibold leading-none tabular-nums text-[var(--color-accent)] sm:text-[1.75rem]">
                                                {stat.value}
                                            </p>
                                            <p className="mt-1.5 max-w-[18rem] text-[0.72rem] leading-[1.5] text-[var(--color-soft)]">
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

            <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8 sm:py-12">
                <SectionBlock
                    id="about"
                    command={commands.about}
                    eyebrow={sections.aboutEyebrow}
                    title={sections.aboutTitle}
                    text={sections.aboutText}
                >
                    <div className="grid gap-4 lg:grid-cols-2">
                        {sections.principles.map((item, index) => (
                            <MotionReveal key={item} className="rounded-2xl">
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
                                className="rounded-2xl"
                            >
                                <article
                                    className={`${terminalPanelClass} transition-all duration-300 hover:border-[rgba(111,247,166,0.25)] hover:shadow-[inset_0_1px_0_rgba(111,247,166,0.08),0_8px_32px_rgba(0,0,0,0.3)]`}
                                >
                                    <div className="grid gap-5 lg:grid-cols-[11rem_minmax(0,1fr)_11rem] lg:gap-7">
                                        <div className="space-y-2 border-b border-[rgba(111,247,166,0.08)] pb-3 lg:border-b-0 lg:border-r lg:pb-0 lg:pr-5">
                                            <p className={terminalLabelClass}>
                                                case_0{index + 1}
                                            </p>
                                            <p className="text-[0.7rem] font-medium uppercase tracking-widest text-[var(--color-accent)]">
                                                {project.eyebrow}
                                            </p>
                                        </div>
                                        <div className="min-w-0">
                                            <h3 className="max-w-2xl text-[1.1rem] font-semibold leading-snug text-[var(--color-text)] sm:text-[1.22rem]">
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
                                        <div className="border-t border-[rgba(111,247,166,0.08)] pt-3 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-5">
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
                    <MotionReveal className="rounded-2xl">
                        <div
                            className={`${terminalPanelClass} overflow-hidden`}
                        >
                            <div className="divide-y divide-[rgba(111,247,166,0.07)]">
                                {sections.skills.map((item) => (
                                    <div
                                        key={item.group}
                                        className="py-4 first:pt-0 last:pb-0 lg:grid lg:grid-cols-[10rem_minmax(0,1fr)] lg:gap-6"
                                    >
                                        <p
                                            className={`${terminalLabelClass} mb-3 pt-0.5 lg:mb-0`}
                                        >
                                            {item.group}
                                        </p>
                                        <div className="flex flex-wrap gap-1.5">
                                            {item.list
                                                .split(", ")
                                                .map((skill) => (
                                                    <span
                                                        key={skill}
                                                        className={
                                                            terminalChipClass
                                                        }
                                                    >
                                                        {skill.trim()}
                                                    </span>
                                                ))}
                                        </div>
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
                        <MotionReveal className="rounded-2xl">
                            <div className={terminalPanelClass}>
                                <p className={terminalLabelClass}>
                                    {ui.currentRoleLabel}
                                </p>
                                <p className="mt-3 text-[0.9rem] font-medium leading-snug text-[var(--color-text)]">
                                    {sections.company}
                                </p>
                                <p className="mt-2 text-[0.74rem] leading-6 text-[var(--color-soft)] sm:text-xs">
                                    {sections.timeline}
                                </p>
                                <div className="mt-3 h-px w-full bg-[rgba(111,247,166,0.08)]" />
                                <div className="mt-3 flex items-center gap-2">
                                    <span className="h-2 w-2 rounded-full bg-[var(--color-accent)] shadow-[0_0_6px_rgba(111,247,166,0.6)]" />
                                    <span className="font-mono text-[0.62rem] uppercase tracking-widest text-[var(--color-accent)]">
                                        {ui.availabilityLabel}
                                    </span>
                                </div>
                            </div>
                        </MotionReveal>
                        <MotionReveal className="rounded-2xl">
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
                                        className="rounded-2xl"
                                    >
                                        <Link
                                            href={getLocalizedSitePath(
                                                locale,
                                                `/articles/${article.slug}`,
                                            )}
                                            className={`${terminalPanelClass} block transition-all duration-200 hover:border-[rgba(111,247,166,0.28)] hover:shadow-[inset_0_1px_0_rgba(111,247,166,0.08),0_8px_32px_rgba(0,0,0,0.3)]`}
                                        >
                                            <div className="flex flex-wrap gap-2">
                                                <span className="rounded-full border border-[rgba(111,247,166,0.15)] bg-[rgba(111,247,166,0.06)] px-3 py-1 font-mono text-[0.6rem] uppercase text-[var(--color-accent)]">
                                                    {article.category}
                                                </span>
                                                <span className="rounded-full border border-[rgba(255,255,255,0.08)] px-3 py-1 font-mono text-[0.6rem] uppercase text-[var(--color-soft)]">
                                                    {article.readingTime}
                                                </span>
                                            </div>
                                            <h3 className="mt-4 text-[1.05rem] font-semibold leading-snug text-[var(--color-text)] sm:text-[1.15rem]">
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
                        <MotionReveal className="rounded-2xl">
                            <ContactForm
                                locale={locale}
                                copy={dictionary.contactForm}
                            />
                        </MotionReveal>

                        <div className="space-y-5">
                            <MotionReveal className="rounded-2xl">
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

                            <MotionReveal className="rounded-2xl">
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
                                                    className="rounded-xl border border-[rgba(111,247,166,0.1)] bg-[rgba(8,16,12,0.6)] px-4 py-3.5 transition-all duration-200 hover:border-[rgba(111,247,166,0.22)]"
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

                            <MotionReveal className="rounded-2xl">
                                <div className={terminalPanelClass}>
                                    <p className={terminalLabelClass}>
                                        {sections.nextTitle}
                                    </p>
                                    <div className="mt-3">
                                        <LocalizedBullets
                                            items={sections.roadmap}
                                        />
                                    </div>
                                    <div className="mt-5 border-t border-[rgba(111,247,166,0.08)] pt-3">
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

                <footer className="mt-16 border-t border-[rgba(111,247,166,0.1)] pt-8 pb-6">
                    <div className="flex flex-col items-center gap-3 text-center">
                        <div className="flex items-center gap-4">
                            {socialLinks.map((link) => (
                                <a
                                    key={link.key}
                                    href={link.href}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="font-mono text-[0.68rem] uppercase tracking-[0.06em] text-[var(--color-soft)] transition-colors duration-150 hover:text-[var(--color-accent)]"
                                >
                                    {dictionary.socialLinks[link.key]}
                                </a>
                            ))}
                        </div>
                        <p className="font-mono text-[0.64rem] uppercase tracking-[0.06em] tabular-nums text-[var(--color-soft)]">
                            © {new Date().getFullYear()} Panyakorn Boonyong
                        </p>
                        <p className="font-mono text-[0.6rem] tabular-nums text-[var(--color-soft)] opacity-50">
                            v{appVersion}
                        </p>
                    </div>
                </footer>
            </div>

            <ChatDemo copy={dictionary.chat} />
        </main>
    );
}
