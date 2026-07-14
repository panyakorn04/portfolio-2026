import { redirect } from "next/navigation";

import { defaultLocale } from "../../lib/portfolio";

export default function Home() {
  redirect(`/${defaultLocale}`);
}
