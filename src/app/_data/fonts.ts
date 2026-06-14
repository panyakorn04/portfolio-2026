import { Kanit } from "next/font/google";

export const kanit = Kanit({
  subsets: ["latin", "thai"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
  variable: "--font-kanit",
});
