import type { Locale } from "./portfolio";

export const articleDirectoryCopy = {
  en: {
    navLabel: "Articles",
    eyebrow: "Writing",
    title: "Notes on frontend architecture, AI product work, and practical delivery.",
    description:
      "A small library of portfolio-safe articles about building production interfaces, integrating AI into products, and keeping web systems maintainable.",
    featuredLabel: "Featured article",
    listLabel: "Latest articles",
    readArticleLabel: "Read article",
    backToArticlesLabel: "Back to articles",
    backToPortfolioLabel: "Back to portfolio",
    publishedLabel: "Published",
    readingTimeLabel: "Read time",
    emptyLabel: "More writing is on the way.",
  },
  th: {
    navLabel: "บทความ",
    eyebrow: "งานเขียน",
    title: "บันทึกเรื่อง frontend architecture, งาน AI product และการส่งมอบงานแบบใช้งานได้จริง",
    description:
      "รวมบทความที่เล่ามุมคิดในการสร้าง production interface, เชื่อม AI เข้ากับโปรดักต์ และดูแลระบบเว็บให้ขยายต่อได้ง่าย",
    featuredLabel: "บทความเด่น",
    listLabel: "บทความล่าสุด",
    readArticleLabel: "อ่านบทความ",
    backToArticlesLabel: "กลับหน้าบทความ",
    backToPortfolioLabel: "กลับพอร์ตโฟลิโอ",
    publishedLabel: "เผยแพร่",
    readingTimeLabel: "เวลาอ่าน",
    emptyLabel: "กำลังทยอยเพิ่มบทความเพิ่มเติม",
  },
} as const satisfies Record<
  Locale,
  {
    navLabel: string;
    eyebrow: string;
    title: string;
    description: string;
    featuredLabel: string;
    listLabel: string;
    readArticleLabel: string;
    backToArticlesLabel: string;
    backToPortfolioLabel: string;
    publishedLabel: string;
    readingTimeLabel: string;
    emptyLabel: string;
  }
>;
