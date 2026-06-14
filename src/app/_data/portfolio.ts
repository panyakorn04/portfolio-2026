export type Locale = "en" | "th";

export type LocalizedText = Record<Locale, string>;
export type PortfolioDictionary = {
  meta: {
    metaTitle: string;
    metaDescription: string;
    openGraphTitle: string;
    openGraphDescription: string;
  };
  ui: {
    brandRole: string;
    languageLabel: string;
    menuLabel: string;
    closeMenuLabel: string;
    contactCta: string;
    sessionLabel: string;
    profilePreviewLabel: string;
    statsLabel: string;
    linksLabel: string;
    stackLabel: string;
    currentRoleLabel: string;
    channelsLabel: string;
    availabilityLabel: string;
    profileImageAlt: string;
    commands: {
      boot: string;
      whoami: string;
      role: string;
      focus: string;
      status: string;
      about: string;
      work: string;
      skills: string;
      experience: string;
      contact: string;
    };
  };
  hero: {
    badge: string;
    heroTitle: string;
    heroText: string;
    heroKicker: string;
    heroNote: string;
    viewWork: string;
    downloadResume: string;
    contactMe: string;
    focusedTitle: string;
    focusedText: string;
  };
  sections: {
    aboutEyebrow: string;
    aboutTitle: string;
    aboutText: string;
    principles: string[];
    workEyebrow: string;
    workTitle: string;
    workText: string;
    featuredWork: Array<{
      eyebrow: string;
      title: string;
      description: string;
      bullets: string[];
      stack: string[];
    }>;
    skillsEyebrow: string;
    skillsTitle: string;
    skillsText: string;
    skills: Array<{ group: string; list: string }>;
    experienceEyebrow: string;
    roleTitle: string;
    company: string;
    timeline: string;
    experienceBullets: string[];
    contactEyebrow: string;
    contactTitle: string;
    contactText: string;
    nextTitle: string;
    roadmap: string[];
  };
  contactLabels: {
    email: string;
    github: string;
    linkedin: string;
    line: string;
    resume: string;
  };
  socialLinks: {
    github: string;
    linkedin: string;
  };
  navItems: Array<{ id: string; label: string }>;
  stats: Array<{ value: string; label: string }>;
};

export const locales = ["en", "th"] as const satisfies readonly Locale[];
export const defaultLocale: Locale = "en";

export function hasLocale(value: string): value is Locale {
  return locales.includes(value as Locale);
}
