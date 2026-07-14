import "../globals.css";

import { jetbrainsMono, kanit, spaceGrotesk } from "../../lib/fonts";
import { defaultLocale } from "../../lib/portfolio";

export default function RedirectRootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang={defaultLocale}
      className={`${kanit.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable} h-full scroll-smooth antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
