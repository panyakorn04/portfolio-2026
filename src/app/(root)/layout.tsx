import "../globals.css";

import { connection } from "next/server";

import { jetbrainsMono, kanit, spaceGrotesk } from "../../lib/fonts";
import { defaultLocale } from "../../lib/portfolio";

export default async function RedirectRootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  await connection();
  return (
    <html
      lang={defaultLocale}
      className={`${kanit.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable} h-full scroll-smooth antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
