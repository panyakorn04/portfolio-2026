import "server-only";
import { cache } from "react";

import type { Locale, PortfolioDictionary } from "../../lib/portfolio";

const dictionaries: Record<Locale, () => Promise<PortfolioDictionary>> = {
  en: () =>
    import("../dictionaries/en.json").then(
      (module) => module.default as PortfolioDictionary,
    ),
  th: () =>
    import("../dictionaries/th.json").then(
      (module) => module.default as PortfolioDictionary,
    ),
};

export const getDictionary = cache(async (locale: Locale) => {
  return dictionaries[locale]();
});
