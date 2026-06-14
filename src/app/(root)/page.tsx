import { redirect } from "next/navigation";

import { defaultLocale } from "../_data/portfolio";

export default function Home() {
  redirect(`/${defaultLocale}`);
}
