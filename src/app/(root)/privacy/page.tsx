import { redirect } from "next/navigation";

import { defaultLocale } from "../../_data/portfolio";

export default function PrivacyRedirectPage() {
  redirect(`/${defaultLocale}/privacy`);
}
