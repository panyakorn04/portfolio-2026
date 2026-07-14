import { redirect } from "next/navigation";

import { defaultLocale } from "../../../lib/portfolio";

export default function TermsRedirectPage() {
  redirect(`/${defaultLocale}/terms`);
}
