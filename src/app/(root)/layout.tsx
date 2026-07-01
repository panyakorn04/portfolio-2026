import "../globals.css";

import { kanit, spaceGrotesk } from "../_data/fonts";
import { defaultLocale } from "../_data/portfolio";

export default function RedirectRootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html
            lang={defaultLocale}
            className={`${kanit.variable} ${spaceGrotesk.variable} h-full scroll-smooth antialiased`}
        >
            <body className="min-h-full flex flex-col">{children}</body>
        </html>
    );
}
