import { redirect } from "next/navigation";

import { defaultLocale } from "../../_data/portfolio";

export default function TermsRedirectPage() {
  redirect(`/${defaultLocale}/terms`);
}
