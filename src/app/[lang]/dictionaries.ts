import "server-only";

import type { Locale, PortfolioDictionary } from "../_data/portfolio";

const dictionaries: Record<Locale, () => Promise<PortfolioDictionary>> = {
  en: () =>
    import("./dictionaries/en.json").then(
      (module) => module.default as PortfolioDictionary,
    ),
  th: () =>
    import("./dictionaries/th.json").then(
      (module) => module.default as PortfolioDictionary,
    ),
};

export async function getDictionary(locale: Locale) {
  return dictionaries[locale]();
}
