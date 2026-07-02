export type Locale = "en" | "th";

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
    legalLabel: string;
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
      chat: string;
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
    ecosystemEyebrow: string;
    ecosystemTitle: string;
    ecosystemText: string;
    ecosystemRepositories: Array<{
      eyebrow: string;
      title: string;
      description: string;
      bullets: string[];
      stack: string[];
      href: string;
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
    chatEyebrow: string;
    chatTitle: string;
    chatText: string;
    contactEyebrow: string;
    contactTitle: string;
    contactText: string;
    nextTitle: string;
    roadmap: string[];
  };
  legal: {
    shared: {
      effectiveLabel: string;
      updatedLabel: string;
      contactLabel: string;
      intro: string;
      backToHome: string;
    };
    directory: {
      eyebrow: string;
      title: string;
      text: string;
      termsLabel: string;
      termsHelp: string;
      privacyLabel: string;
      privacyHelp: string;
      validationMessage: string;
    };
    terms: {
      title: string;
      description: string;
      intro: string;
      sections: Array<{
        heading: string;
        body: string[];
      }>;
    };
    privacy: {
      title: string;
      description: string;
      intro: string;
      sections: Array<{
        heading: string;
        body: string[];
      }>;
    };
  };
  chat: {
    launcherLabel: string;
    openLabel: string;
    closeLabel: string;
    windowTitle: string;
    quickPrompts: string[];
    inputPlaceholder: string;
    sendLabel: string;
    assistantName: string;
    userName: string;
    emptyState: string;
    streamError: string;
    starterConversation: Array<{
      role: "assistant" | "user";
      text: string;
    }>;
  };
  contactLabels: {
    email: string;
    github: string;
    linkedin: string;
    line: string;
    resume: string;
  };
  contactForm: {
    panelLabel: string;
    title: string;
    description: string;
    nameLabel: string;
    namePlaceholder: string;
    emailLabel: string;
    emailPlaceholder: string;
    companyLabel: string;
    companyPlaceholder: string;
    subjectLabel: string;
    subjectPlaceholder: string;
    messageLabel: string;
    messagePlaceholder: string;
    storageNote: string;
    submitLabel: string;
    submittingLabel: string;
    submitSuccess: string;
    submitError: string;
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
