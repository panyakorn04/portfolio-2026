import "../globals.css";

import { defaultLocale } from "../_data/portfolio";
import { kanit } from "../_data/fonts";

export default function RedirectRootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang={defaultLocale}
      className={`${kanit.variable} h-full scroll-smooth antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
