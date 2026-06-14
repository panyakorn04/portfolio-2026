import { type Locale, type PortfolioDictionary } from "../_data/portfolio";
import { contacts, socialLinks } from "../_data/site";
import Navbar from "./navbar";

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
        <div className="terminal-line">
            <span className="terminal-prompt">$</span>
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
        <section id={id} className="terminal-section">
            <div className="section-shell">
                <PromptLine command={command} value={eyebrow} tone="accent" />
                <h2 className="section-title mt-5 max-w-4xl text-balance">
                    {title}
                </h2>
                {text ? (
                    <p className="section-copy mt-4 max-w-3xl text-pretty">
                        {text}
                    </p>
                ) : null}
            </div>
            <div className="mt-8">{children}</div>
        </section>
    );
}

function LocalizedBullets({
    items,
}: {
    items: string[];
}) {
    return (
        <ul className="terminal-copy space-y-3">
            {items.map((item) => (
                <li key={item} className="flex gap-3">
                    <span className="mt-2 size-1.5 shrink-0 rounded-full bg-[var(--color-accent)]" />
                    <span className="text-pretty">{item}</span>
                </li>
            ))}
        </ul>
    );
}

export function PortfolioShell({
    locale,
    dictionary,
}: {
    locale: Locale;
    dictionary: PortfolioDictionary;
}) {
    const hero = dictionary.hero;
    const sections = dictionary.sections;
    const ui = dictionary.ui;
    const commands = ui.commands;

    return (
        <main
            lang={locale}
            className="terminal-page min-h-screen overflow-x-clip bg-[var(--color-bg)] text-[var(--color-text)]"
        >
            <div className="terminal-grid pointer-events-none fixed inset-0 -z-10" />
            <Navbar locale={locale} dictionary={dictionary} />
            <section
                id="top"
                className="border-b border-[var(--color-line)] px-5 py-8 sm:px-8 sm:py-10"
            >
                <div className="mx-auto grid max-w-7xl gap-7 lg:grid-cols-[minmax(0,1.15fr)_22rem] lg:gap-10">
                    <div className="terminal-window">
                        <div className="terminal-window-bar">
                            <span className="terminal-dot bg-[#ff5f56]" />
                            <span className="terminal-dot bg-[#ffbd2e]" />
                            <span className="terminal-dot bg-[#27c93f]" />
                            <span className="ml-4 text-[var(--color-soft)]">
                                {ui.sessionLabel}/{locale}
                            </span>
                        </div>

                        <div className="space-y-4 p-4 sm:p-5 lg:p-7">
                            <PromptLine
                                command={commands.boot}
                                value={hero.heroKicker}
                                tone="muted"
                            />
                            <PromptLine
                                command={commands.whoami}
                                value="Panyakorn Boonyong"
                                tone="accent"
                            />
                            <PromptLine
                                command={commands.role}
                                value={hero.badge}
                            />

                            <div className="pt-3">
                                <h1 className="hero-title max-w-3xl text-balance text-[clamp(1.95rem,4.4vw,4.2rem)] leading-[0.98] text-[var(--color-text)]">
                                    {hero.heroTitle}
                                </h1>
                                <p className="section-copy mt-5 max-w-2xl text-pretty">
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
                                    className="cta-primary w-full sm:w-auto"
                                >
                                    {hero.viewWork}
                                </a>
                                <a
                                    href="/Panyakorn_Boonyong_Resume.pdf"
                                    className="cta-secondary w-full sm:w-auto"
                                >
                                    {hero.downloadResume}
                                </a>
                            </div>
                        </div>
                    </div>

                    <aside className="space-y-4 self-start lg:sticky lg:top-6">
                        <div className="terminal-panel">
                            <p className="terminal-label">
                                {ui.profilePreviewLabel}
                            </p>
                            <div className="relative mt-3 aspect-[4/5] overflow-hidden rounded-sm border border-[var(--color-line)] bg-[var(--color-panel)]">
                                {/* Using a native img here avoids shipping next/image client runtime for this static hero asset. */}
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src="/assets/profile.png"
                                    alt={ui.profileImageAlt}
                                    loading="eager"
                                    fetchPriority="high"
                                    className="absolute inset-0 h-full w-full object-cover object-center"
                                />
                                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(4,8,6,0.08),rgba(4,8,6,0.64))]" />
                            </div>
                        </div>

                        <div className="terminal-panel">
                            <p className="terminal-label">{ui.statsLabel}</p>
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

                        <div className="terminal-panel">
                            <p className="terminal-label">{ui.linksLabel}</p>
                            <div className="mt-3 flex flex-wrap gap-2">
                                {socialLinks.map((link) => (
                                    <a
                                        key={link.key}
                                        href={link.href}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="terminal-chip"
                                    >
                                        {dictionary.socialLinks[link.key]}
                                    </a>
                                ))}
                            </div>
                        </div>
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
                            <article key={item} className="terminal-panel">
                                <p className="terminal-label">
                                    rule_0{index + 1}
                                </p>
                                <p className="terminal-copy mt-3 text-pretty">
                                    {item}
                                </p>
                            </article>
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
                            <article
                                key={project.title}
                                className="terminal-panel"
                            >
                                <div className="grid gap-5 lg:grid-cols-[11rem_minmax(0,1fr)_11rem] lg:gap-7">
                                    <div className="space-y-2 border-b border-[var(--color-line)] pb-3 lg:border-b-0 lg:border-r lg:pb-0 lg:pr-5">
                                        <p className="terminal-label">
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
                                        <p className="terminal-copy mt-3 max-w-2xl text-pretty">
                                            {project.description}
                                        </p>
                                        <ul className="terminal-copy mt-4 space-y-2.5">
                                            {project.bullets.map((bullet) => (
                                                <li
                                                    key={bullet}
                                                    className="flex gap-3"
                                                >
                                                    <span className="mt-2 size-1.5 shrink-0 rounded-full bg-[var(--color-accent)]" />
                                                    <span className="text-pretty">
                                                        {bullet}
                                                    </span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div className="border-t border-[var(--color-line)] pt-3 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-5">
                                        <p className="terminal-label">
                                            {ui.stackLabel}
                                        </p>
                                        <div className="mt-2.5 flex flex-wrap gap-2">
                                            {project.stack.map((item) => (
                                                <span
                                                    key={item}
                                                    className="terminal-chip"
                                                >
                                                    {item}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </article>
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
                    <div className="terminal-panel overflow-hidden">
                        <div className="grid gap-0 divide-y divide-[var(--color-line)]">
                            {sections.skills.map((item) => (
                                <div
                                    key={item.group}
                                    className="grid gap-2 py-3 lg:grid-cols-[12rem_minmax(0,1fr)] lg:gap-6 lg:py-4"
                                >
                                    <p className="terminal-label pt-0.5">
                                        {item.group}
                                    </p>
                                    <p className="terminal-copy max-w-3xl text-pretty">
                                        {item.list}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </SectionBlock>

                <SectionBlock
                    id="experience"
                    command={commands.experience}
                    eyebrow={sections.experienceEyebrow}
                    title={sections.roleTitle}
                    text={`${sections.company} · ${sections.timeline}`}
                >
                    <div className="grid gap-5 lg:grid-cols-[14rem_minmax(0,1fr)] lg:gap-6">
                        <div className="terminal-panel">
                            <p className="terminal-label">
                                {ui.currentRoleLabel}
                            </p>
                            <p className="mt-3 text-sm leading-6 text-[var(--color-text)]">
                                {sections.company}
                            </p>
                            <p className="mt-1.5 text-[0.74rem] leading-6 text-[var(--color-soft)] sm:text-xs">
                                {sections.timeline}
                            </p>
                        </div>
                        <div className="terminal-panel">
                            <LocalizedBullets
                                items={sections.experienceBullets}
                            />
                        </div>
                    </div>
                </SectionBlock>

                <SectionBlock
                    id="contact"
                    command={commands.contact}
                    eyebrow={sections.contactEyebrow}
                    title={sections.contactTitle}
                    text={sections.contactText}
                >
                    <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr] lg:gap-6">
                        <div className="terminal-panel">
                            <p className="terminal-label">
                                {ui.channelsLabel}
                            </p>
                            <div className="mt-3 grid gap-3 sm:grid-cols-2">
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
                                        className="terminal-contact min-h-[6.25rem] justify-between"
                                    >
                                        <span className="text-xs uppercase text-[var(--color-soft)]">
                                            {dictionary.contactLabels[contact.key]}
                                        </span>
                                        <span className="terminal-copy mt-2 text-[var(--color-text)]">
                                            {contact.value}
                                        </span>
                                    </a>
                                ))}
                            </div>
                        </div>

                        <div className="terminal-panel">
                            <p className="terminal-label">{sections.nextTitle}</p>
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
                    </div>
                </SectionBlock>
            </div>
        </main>
    );
}
