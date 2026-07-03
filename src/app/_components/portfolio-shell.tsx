import Image from "next/image";
import Link from "next/link";
import { articleDirectoryCopy } from "../_data/articles";
import type { Locale, PortfolioDictionary } from "../_data/portfolio";
import { contacts, socialLinks } from "../_data/site";
import { getAbsoluteSiteUrl, getLocalizedSitePath } from "../_data/site-url";
import { buttonBase, buttonSizes, buttonVariants } from "./button";
import ChatDemo from "./chat-demo";
import ContactForm from "./contact-form";
import MotionReveal from "./motion-reveal";
import Navbar from "./navbar";

const surfaceClass =
    "border border-[var(--color-line)] bg-[linear-gradient(158deg,rgba(255,255,255,0.065),rgba(255,255,255,0.025))] shadow-[var(--shadow-panel)] backdrop-blur-[24px] backdrop-saturate-[1.6]";
const panelClass = `${surfaceClass} rounded-[var(--radius-lg)]`;
const compactPanelClass = `${surfaceClass} rounded-[var(--radius)]`;
const eyebrowClass =
    "font-mono text-[0.58rem] uppercase tracking-[0.11em] tabular-nums text-[var(--color-soft)] sm:text-[0.62rem]";
const copyClass =
    "text-[0.88rem] leading-[1.78] text-[var(--color-muted)] sm:text-[0.92rem]";
const smallCopyClass =
    "text-[0.78rem] leading-[1.65] text-[var(--color-muted)]";
const chipClass = `${buttonBase} ${buttonVariants.chip} ${buttonSizes.sm}`;
const primaryButtonClass = `${buttonBase} ${buttonSizes.lg} bg-[linear-gradient(135deg,var(--color-accent),#16a34a)] text-[#05070a] shadow-[var(--shadow-btn)] font-semibold tracking-[0.06em] hover:-translate-y-0.5 active:translate-y-0`;
const secondaryButtonClass = `${buttonBase} ${buttonSizes.lg} border border-[var(--color-line-strong)] bg-[var(--surface)] text-[var(--color-text)] font-semibold tracking-[0.06em] hover:-translate-y-0.5 hover:border-[var(--color-accent)] hover:bg-[var(--surface-hover)] hover:text-[var(--color-accent)] active:translate-y-0`;

type SectionBlockProps = {
    id: string;
    kicker: string;
    title: string;
    text?: string;
    index: number;
    total: number;
    children: React.ReactNode;
};

function SectionBlock({
    id,
    kicker,
    title,
    text,
    index,
    total,
    children,
}: SectionBlockProps) {
    return (
        <section id={id} className="scroll-mt-28 py-8 sm:py-10">
            <MotionReveal className="rounded-[var(--radius-lg)]">
                <div className={`${panelClass} overflow-hidden`}>
                    <div className="border-b border-[var(--color-line)] bg-[rgba(255,255,255,0.025)] px-5 py-5 sm:px-6">
                        <div className="flex flex-wrap items-center justify-between gap-3">
                            <p className={eyebrowClass}>{kicker}</p>
                            <span className="rounded-full border border-[var(--accent-border)] bg-[var(--accent-dim)] px-3 py-1 font-mono text-[0.6rem] uppercase tabular-nums tracking-[0.08em] text-[var(--color-accent)]">
                                {String(index).padStart(2, "0")} /{" "}
                                {String(total).padStart(2, "0")}
                            </span>
                        </div>
                        <h2 className="mt-4 max-w-3xl text-balance [font-family:var(--font-display),sans-serif] text-[clamp(1.3rem,3.2vw,2.25rem)] font-semibold leading-[0.98] tracking-[-0.055em] text-[var(--color-text)]">
                            {title}
                        </h2>
                        {text ? (
                            <p
                                className={`${copyClass} mt-4 max-w-3xl text-pretty`}
                            >
                                {text}
                            </p>
                        ) : null}
                    </div>
                    <div className="p-5 sm:p-6">{children}</div>
                </div>
            </MotionReveal>
        </section>
    );
}

function MiniTerminalLine({ label, value }: { label: string; value: string }) {
    return (
        <div className="flex min-w-0 flex-wrap items-center gap-2 font-mono text-[0.72rem] leading-6">
            <span className="text-[var(--color-accent)]">$</span>
            <span className="text-[var(--color-soft)]">{label}</span>
            <span className="min-w-0 text-pretty text-[var(--color-text)]">
                {value}
            </span>
        </div>
    );
}

function LocalizedBullets({ items }: { items: string[] }) {
    return (
        <ul className="grid gap-3">
            {items.map((item) => (
                <li
                    key={item}
                    className={`${smallCopyClass} flex gap-3 text-pretty`}
                >
                    <span className="mt-2.5 size-1.5 shrink-0 rounded-full bg-[var(--color-accent)] shadow-[0_0_16px_var(--accent-glow)]" />
                    <span>{item}</span>
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
    const hasArticles = articles.length > 0;
    const sectionTotal = hasArticles ? 7 : 6;
    const contactIndex = hasArticles ? 7 : 6;

    return (
        <main
            lang={locale}
            className="relative min-h-screen overflow-x-clip text-[var(--color-text)]"
        >
            <div className="ambient" aria-hidden="true" />
            <Navbar locale={locale} dictionary={dictionary} />

            <div className="mx-auto max-w-[92rem] px-4 py-4 sm:px-6 lg:py-6">
                <section id="top" className="scroll-mt-28">
                    <MotionReveal className="rounded-[var(--radius-lg)]">
                        <div className={`${panelClass} overflow-hidden`}>
                            <div className="flex items-center justify-between gap-4 border-b border-[var(--color-line)] bg-[rgba(255,255,255,0.025)] px-4 py-3 font-mono text-[0.62rem] uppercase tracking-[0.08em] text-[var(--color-soft)]">
                                <div className="flex items-center gap-2.5">
                                    <span className="size-2.5 rounded-full bg-[#ff5f56]" />
                                    <span className="size-2.5 rounded-full bg-[#ffbd2e]" />
                                    <span className="size-2.5 rounded-full bg-[#27c93f]" />
                                    <span className="ml-3">
                                        {ui.sessionLabel}/{locale}
                                    </span>
                                </div>
                                <span className="hidden sm:inline">
                                    v{appVersion}
                                </span>
                            </div>

                            <div className="grid gap-6 p-5 sm:p-6 xl:grid-cols-[minmax(0,1fr)_17rem]">
                                <div className="min-w-0 space-y-5">
                                    <div className="inline-flex items-center gap-2 rounded-full border border-[var(--accent-border)] bg-[var(--accent-dim)] px-3 py-1.5 font-mono text-[0.64rem] uppercase tracking-[0.08em] text-[var(--color-accent)]">
                                        <span className="size-1.5 rounded-full bg-[var(--color-accent)] shadow-[0_0_14px_var(--accent-glow)]" />
                                        {hero.heroKicker}
                                    </div>
                                    <h1 className="max-w-4xl text-balance [font-family:var(--font-display),sans-serif] text-[clamp(1.8rem,5.5vw,4.2rem)] font-semibold leading-[1] tracking-[-0.075em]">
                                        <span className="bg-[linear-gradient(135deg,#fff_18%,#d7ffe5_52%,var(--color-accent)_100%)] bg-clip-text text-transparent ">
                                            {hero.heroTitle}
                                        </span>
                                    </h1>
                                    <p
                                        className={`${copyClass} max-w-2xl text-pretty text-base sm:text-lg`}
                                    >
                                        {hero.heroText}
                                    </p>
                                    <div className="grid gap-2 rounded-[var(--radius)] border border-[var(--color-line)] bg-[rgba(0,0,0,0.18)] p-4">
                                        <MiniTerminalLine
                                            label={commands.whoami}
                                            value="Panyakorn Boonyong"
                                        />
                                        <MiniTerminalLine
                                            label={commands.role}
                                            value={hero.badge}
                                        />
                                        <MiniTerminalLine
                                            label={commands.focus}
                                            value={hero.focusedText}
                                        />
                                        <MiniTerminalLine
                                            label={commands.status}
                                            value={hero.heroNote}
                                        />
                                    </div>
                                    <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                                        <a
                                            href="#work"
                                            className={primaryButtonClass}
                                        >
                                            {hero.viewWork}
                                        </a>
                                        <Link
                                            href="/Panyakorn_Boonyong_Resume.pdf"
                                            className={secondaryButtonClass}
                                        >
                                            {hero.downloadResume}
                                        </Link>
                                        <a
                                            href="#contact"
                                            className={secondaryButtonClass}
                                        >
                                            {hero.contactMe}
                                        </a>
                                    </div>
                                </div>

                                <div className="grid content-start gap-4">
                                    <div className="relative aspect-[4/5] overflow-hidden rounded-[var(--radius)] border border-[var(--color-line)] bg-[var(--surface)]">
                                        <Image
                                            src="/assets/profile.jpg"
                                            fill
                                            sizes="(max-width: 767px) 92vw, 272px"
                                            alt={ui.profileImageAlt}
                                            priority
                                            className="object-cover object-center saturate-[0.95] transition-transform duration-500 hover:scale-[1.03]"
                                        />
                                        <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_42%,rgba(2,2,3,0.76))]" />
                                        <div className="absolute inset-x-3 bottom-3 rounded-[var(--radius-sm)] border border-[var(--color-line)] bg-[rgba(2,2,3,0.58)] p-3 backdrop-blur-xl">
                                            <p className={eyebrowClass}>
                                                {ui.profilePreviewLabel}
                                            </p>
                                            <p className="mt-1 text-sm font-semibold">
                                                Panyakorn Boonyong
                                            </p>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-3 gap-3 xl:grid-cols-1">
                                        {dictionary.stats.map((stat) => (
                                            <div
                                                key={stat.value}
                                                className={`${compactPanelClass} p-4`}
                                            >
                                                <p className="text-2xl font-semibold tracking-[-0.05em] text-[var(--color-accent)]">
                                                    {stat.value}
                                                </p>
                                                <p
                                                    className={`${smallCopyClass} mt-1`}
                                                >
                                                    {stat.label}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </MotionReveal>
                </section>

                <SectionBlock
                    id="about"
                    kicker={commands.about}
                    title={sections.aboutTitle}
                    text={sections.aboutText}
                    index={1}
                    total={sectionTotal}
                >
                    <div className="grid gap-3 md:grid-cols-2">
                        {sections.principles.map((item, index) => (
                            <article
                                key={item}
                                className={`${compactPanelClass} p-4`}
                            >
                                <p className={eyebrowClass}>
                                    principle_0{index + 1}
                                </p>
                                <p
                                    className={`${smallCopyClass} mt-3 text-pretty`}
                                >
                                    {item}
                                </p>
                            </article>
                        ))}
                    </div>
                </SectionBlock>

                <SectionBlock
                    id="work"
                    kicker={commands.work}
                    title={sections.workTitle}
                    text={sections.workText}
                    index={2}
                    total={sectionTotal}
                >
                    <div className="grid gap-4 md:grid-cols-2">
                        {sections.featuredWork.map((project, index) => (
                            <article
                                key={project.title}
                                className={`${compactPanelClass} flex h-full flex-col p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-[var(--color-line-strong)] hover:bg-[var(--surface-hover)]`}
                            >
                                <div className="flex items-center justify-between gap-3">
                                    <p className={eyebrowClass}>
                                        case_0{index + 1}
                                    </p>
                                    <p className="text-xs font-medium uppercase tracking-[0.08em] text-[var(--color-accent)]">
                                        {project.eyebrow}
                                    </p>
                                </div>
                                <h3 className="mt-3 text-balance text-xl font-semibold tracking-[-0.035em] sm:text-2xl">
                                    {project.title}
                                </h3>
                                <p className={`${copyClass} mt-3 text-pretty`}>
                                    {project.description}
                                </p>
                                <div className="mt-5">
                                    <LocalizedBullets items={project.bullets} />
                                </div>
                                <div className="mt-5 flex flex-wrap gap-2 border-t border-[var(--color-line)] pt-4">
                                    {project.stack.map((item) => (
                                        <span key={item} className={chipClass}>
                                            {item}
                                        </span>
                                    ))}
                                </div>
                            </article>
                        ))}
                    </div>
                </SectionBlock>

                <SectionBlock
                    id="ecosystem"
                    kicker={sections.ecosystemEyebrow}
                    title={sections.ecosystemTitle}
                    text={sections.ecosystemText}
                    index={3}
                    total={sectionTotal}
                >
                    <div className="grid gap-4 md:grid-cols-2">
                        {sections.ecosystemRepositories.map((repo, index) => (
                            <a
                                key={repo.href}
                                href={repo.href}
                                target="_blank"
                                rel="noreferrer"
                                className={`${compactPanelClass} flex h-full flex-col p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-[var(--color-line-strong)] hover:bg-[var(--surface-hover)]`}
                            >
                                <div className="flex items-center justify-between gap-3">
                                    <p className={eyebrowClass}>
                                        repo_0{index + 1}
                                    </p>
                                    <p className="text-xs font-medium uppercase tracking-[0.08em] text-[var(--color-accent)]">
                                        {repo.eyebrow}
                                    </p>
                                </div>
                                <h3 className="mt-3 text-balance text-xl font-semibold tracking-[-0.035em] sm:text-2xl">
                                    {repo.title}
                                </h3>
                                <p className={`${copyClass} mt-3 text-pretty`}>
                                    {repo.description}
                                </p>
                                <div className="mt-5">
                                    <LocalizedBullets items={repo.bullets} />
                                </div>
                                <div className="mt-5 flex flex-wrap gap-2 border-t border-[var(--color-line)] pt-4">
                                    {repo.stack.map((item) => (
                                        <span key={item} className={chipClass}>
                                            {item}
                                        </span>
                                    ))}
                                </div>
                                <p className="mt-4 break-all font-mono text-[0.68rem] text-[var(--color-accent)]">
                                    {repo.href.replace(
                                        "https://github.com/panyakorn04/",
                                        "github.com/panyakorn04/",
                                    )}
                                </p>
                            </a>
                        ))}
                    </div>
                </SectionBlock>

                <SectionBlock
                    id="skills"
                    kicker={commands.skills}
                    title={sections.skillsTitle}
                    text={sections.skillsText}
                    index={4}
                    total={sectionTotal}
                >
                    <div className="grid gap-3 md:grid-cols-2">
                        {sections.skills.map((item) => (
                            <article
                                key={item.group}
                                className={`${compactPanelClass} p-4`}
                            >
                                <p className={eyebrowClass}>{item.group}</p>
                                <div className="mt-3 flex flex-wrap gap-2">
                                    {item.list.split(", ").map((skill) => (
                                        <span key={skill} className={chipClass}>
                                            {skill.trim()}
                                        </span>
                                    ))}
                                </div>
                            </article>
                        ))}
                    </div>
                </SectionBlock>

                <SectionBlock
                    id="experience"
                    kicker={commands.experience}
                    title={sections.roleTitle}
                    text={`${sections.company} · ${sections.timeline}`}
                    index={5}
                    total={sectionTotal}
                >
                    <div className="grid gap-4 lg:grid-cols-[16rem_minmax(0,1fr)]">
                        <div className={`${compactPanelClass} p-4`}>
                            <p className={eyebrowClass}>
                                {ui.currentRoleLabel}
                            </p>
                            <p className="mt-3 text-lg font-semibold tracking-[-0.04em]">
                                {sections.company}
                            </p>
                            <p className={`${smallCopyClass} mt-2`}>
                                {sections.timeline}
                            </p>
                            <div className="mt-4 flex items-center gap-2 border-t border-[var(--color-line)] pt-4">
                                <span className="size-2 rounded-full bg-[var(--color-accent)] shadow-[0_0_14px_var(--accent-glow)]" />
                                <span className={eyebrowClass}>
                                    {ui.availabilityLabel}
                                </span>
                            </div>
                        </div>
                        <div className={`${compactPanelClass} p-4`}>
                            <LocalizedBullets
                                items={sections.experienceBullets}
                            />
                        </div>
                    </div>
                    <div className={`${compactPanelClass} mt-4 p-4`}>
                        <p className={eyebrowClass}>{sections.nextTitle}</p>
                        <div className="mt-3">
                            <LocalizedBullets items={sections.roadmap} />
                        </div>
                    </div>
                </SectionBlock>

                {hasArticles ? (
                    <SectionBlock
                        id="articles"
                        kicker="cat ./articles"
                        title={articleCopy.title}
                        text={articleCopy.description}
                        index={6}
                        total={sectionTotal}
                    >
                        <div className="grid gap-4 md:grid-cols-2">
                            {articles.map((article) => (
                                <Link
                                    key={article.slug}
                                    href={getLocalizedSitePath(
                                        locale,
                                        `/articles/${article.slug}`,
                                    )}
                                    className={`${compactPanelClass} block p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-[var(--color-line-strong)] hover:bg-[var(--surface-hover)]`}
                                >
                                    <div className="flex flex-wrap gap-2">
                                        <span className="rounded-full border border-[var(--accent-border)] bg-[var(--accent-dim)] px-3 py-1 font-mono text-[0.58rem] uppercase text-[var(--color-accent)]">
                                            {article.category}
                                        </span>
                                        <span className="rounded-full border border-[var(--color-line)] bg-[var(--surface)] px-3 py-1 font-mono text-[0.58rem] uppercase text-[var(--color-soft)]">
                                            {article.readingTime}
                                        </span>
                                    </div>
                                    <h3 className="mt-4 text-lg font-semibold leading-snug tracking-[-0.035em]">
                                        {article.title}
                                    </h3>
                                    <p
                                        className={`${smallCopyClass} mt-3 text-pretty`}
                                    >
                                        {article.summary}
                                    </p>
                                </Link>
                            ))}
                            <Link
                                href={getLocalizedSitePath(locale, "/articles")}
                                className={secondaryButtonClass}
                            >
                                {articleCopy.listLabel}
                            </Link>
                        </div>
                    </SectionBlock>
                ) : null}

                <SectionBlock
                    id="contact"
                    kicker={commands.contact}
                    title={sections.contactTitle}
                    text={sections.contactText}
                    index={contactIndex}
                    total={sectionTotal}
                >
                    <div className="grid gap-4 xl:grid-cols-[minmax(0,1.1fr)_minmax(18rem,0.9fr)]">
                        <ContactForm
                            locale={locale}
                            copy={dictionary.contactForm}
                        />
                        <div className="grid gap-4">
                            <div className={`${compactPanelClass} p-4`}>
                                <p className={eyebrowClass}>
                                    {ui.channelsLabel}
                                </p>
                                <div className="mt-3 grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
                                    {contacts.map((contact) => (
                                        <a
                                            key={contact.key}
                                            href={contact.href}
                                            target={
                                                contact.href.startsWith("http")
                                                    ? "_blank"
                                                    : undefined
                                            }
                                            rel={
                                                contact.href.startsWith("http")
                                                    ? "noreferrer"
                                                    : undefined
                                            }
                                            className="rounded-[var(--radius-sm)] border border-[var(--color-line)] bg-[var(--surface)] p-3 transition-colors hover:border-[var(--color-line-strong)] hover:bg-[var(--surface-hover)]"
                                        >
                                            <span className={eyebrowClass}>
                                                {
                                                    dictionary.contactLabels[
                                                        contact.key
                                                    ]
                                                }
                                            </span>
                                            <span className="mt-2 block break-words text-sm text-[var(--color-text)]">
                                                {contact.value}
                                            </span>
                                        </a>
                                    ))}
                                </div>
                            </div>
                            <div className={`${compactPanelClass} p-4`}>
                                <p className={eyebrowClass}>{ui.legalLabel}</p>
                                <p className="mt-3 text-sm font-semibold">
                                    {legal.title}
                                </p>
                                <p
                                    className={`${smallCopyClass} mt-2 text-pretty`}
                                >
                                    {legal.text}
                                </p>
                                <div className="mt-4 grid gap-3">
                                    {[
                                        {
                                            label: legal.termsLabel,
                                            help: legal.termsHelp,
                                            href: termsUrl,
                                            path: "/terms",
                                        },
                                        {
                                            label: legal.privacyLabel,
                                            help: legal.privacyHelp,
                                            href: privacyUrl,
                                            path: "/privacy",
                                        },
                                    ].map((item) => (
                                        <Link
                                            key={item.label}
                                            href={getLocalizedSitePath(
                                                locale,
                                                item.path,
                                            )}
                                            className="rounded-[var(--radius-sm)] border border-[var(--color-line)] bg-[var(--surface)] p-3 transition-colors hover:border-[var(--color-line-strong)] hover:bg-[var(--surface-hover)]"
                                        >
                                            <p className={eyebrowClass}>
                                                {item.label}
                                            </p>
                                            <p
                                                className={`${smallCopyClass} mt-2 text-pretty`}
                                            >
                                                {item.help}
                                            </p>
                                            <p className="mt-3 break-all font-mono text-[0.68rem] text-[var(--color-accent)]">
                                                {item.href}
                                            </p>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </SectionBlock>

                <footer className="py-10">
                    <div
                        className={`${panelClass} flex flex-col items-center justify-between gap-4 p-5 text-center sm:flex-row sm:text-left`}
                    >
                        <div>
                            <p className={eyebrowClass}>system status</p>
                            <p className="mt-1 text-sm text-[var(--color-muted)]">
                                © {new Date().getFullYear()} Panyakorn Boonyong
                                · v{appVersion}
                            </p>
                        </div>
                        <div className="flex flex-wrap justify-center gap-2">
                            {socialLinks.map((link) => (
                                <a
                                    key={link.key}
                                    href={link.href}
                                    target="_blank"
                                    rel="noreferrer"
                                    className={`${chipClass} min-h-11`}
                                >
                                    {dictionary.socialLinks[link.key]}
                                </a>
                            ))}
                        </div>
                    </div>
                </footer>
            </div>

            <ChatDemo copy={dictionary.chat} />
        </main>
    );
}
