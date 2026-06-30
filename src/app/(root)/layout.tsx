import "../globals.css";

import { geistMono, geistSans, notoSansThai } from "../_data/fonts";
import { defaultLocale } from "../_data/portfolio";

export default function RedirectRootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang={defaultLocale}
      className={`${geistSans.variable} ${geistMono.variable} ${notoSansThai.variable} h-full scroll-smooth antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
