import { Kanit, Space_Grotesk } from "next/font/google";

export const kanit = Kanit({
    subsets: ["latin", "thai"],
    weight: ["400", "600"],
    display: "swap",
    variable: "--font-kanit",
});

export const spaceGrotesk = Space_Grotesk({
    subsets: ["latin"],
    weight: ["300", "400", "500", "600", "700"],
    display: "swap",
    variable: "--font-space",
});
