import { existsSync } from "node:fs";

import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

if (existsSync(".env")) {
  process.loadEnvFile?.(".env");
}

if (existsSync(".env.local")) {
  process.loadEnvFile?.(".env.local");
}

const databaseUrl = process.env.DATABASE_URL?.trim();

if (!databaseUrl) {
  console.error("DATABASE_URL is required.");
  process.exit(1);
}

// One-time migration of the original static articles into the database.
// Keyed by slug; each article carries an `en` and `th` translation.
const articles = [
  {
    slug: "shipping-frontend-systems",
    category: "Frontend systems",
    publishedAt: "2026-06-27",
    translations: {
      en: {
        readingTime: "6 min",
        title: "Shipping frontend systems that stay understandable after launch",
        summary:
          "A practical look at breaking complex product flows into reusable UI systems, typed data boundaries, and reviewable states.",
        lead: "The hardest frontend work is rarely the first screen. The real challenge shows up when a product grows, multiple teammates touch the same flow, and every release has to keep working on desktop and mobile. In that environment, clarity matters as much as speed.",
        sections: [
          {
            heading: "Start from user states, not components",
            paragraphs: [
              "I prefer listing the user states before building the component tree: loading, empty, success, validation error, authorization mismatch, and interrupted sessions. That makes the UI system reflect the real product behavior instead of only the happy path.",
              "Once those states are visible, shared patterns become easier to spot. We can reuse structure intentionally instead of forcing several unrelated flows into the same generic component.",
            ],
          },
          {
            heading: "Keep data boundaries typed and boring",
            paragraphs: [
              "A maintainable frontend is usually built on predictable data contracts. I like to normalize API access behind small typed helpers or hooks so screens can focus on rendering and interaction.",
              "That approach also makes reviews easier. When a bug appears, the team can inspect whether the issue belongs to a request boundary, transformation layer, or the page itself.",
            ],
          },
          {
            heading: "Polish comes after structure, not before it",
            paragraphs: [
              "Animation, spacing, and visual tone matter, but they hold up better when the information architecture is already stable. Good polish should make the product feel calmer, not hide unclear logic.",
            ],
          },
        ],
      },
      th: {
        readingTime: "6 นาที",
        title: "สร้าง frontend systems ที่ยังอ่านง่ายและดูแลง่ายหลังขึ้นใช้งานจริง",
        summary:
          "มุมมองเชิงปฏิบัติในการแยก flow ที่ซับซ้อนให้กลายเป็น UI system ที่ใช้ซ้ำได้ พร้อม data boundary ที่ typed ชัดเจน",
        lead: "งาน frontend ที่ยากจริงไม่ใช่แค่หน้าจอแรก แต่คือช่วงที่โปรดักต์เริ่มโต มีหลายคนแตะ flow เดียวกัน และทุก release ต้องยังทำงานได้ทั้งบน desktop และ mobile ในจุดนั้น ความชัดเจนสำคัญพอๆ กับความเร็ว",
        sections: [
          {
            heading: "เริ่มจาก user states ก่อนเริ่มแตกเป็น components",
            paragraphs: [
              "ผมมักลิสต์สถานะของผู้ใช้ก่อน เช่น loading, empty, success, validation error, authorization mismatch และ interrupted sessions เพื่อให้ UI system สะท้อนพฤติกรรมจริงของโปรดักต์ ไม่ใช่แค่ happy path",
              "เมื่อมองเห็น states ชัดขึ้น เราจะเห็น pattern ที่ควร reuse ได้ง่ายขึ้น และไม่ต้องฝืนใช้ generic component เดียวกับทุก flow ที่จริงแล้วมีบริบทต่างกัน",
            ],
          },
          {
            heading: "ทำ data boundaries ให้ typed และเรียบง่าย",
            paragraphs: [
              "frontend ที่ดูแลง่ายมักยืนอยู่บนสัญญาของข้อมูลที่คาดเดาได้ ผมชอบซ่อนการเรียก API ไว้หลัง helper หรือ hooks เล็กๆ ที่มี type ชัดเจน เพื่อให้หน้าจอรับหน้าที่ render และ interaction เป็นหลัก",
              "แนวทางนี้ช่วยให้ review ง่ายขึ้นด้วย เพราะเวลาเกิดบั๊ก ทีมจะไล่ได้ชัดว่าเป็นปัญหาที่ request boundary, transformation layer หรือ page component กันแน่",
            ],
          },
          {
            heading: "ความ polished ควรมาหลัง structure",
            paragraphs: [
              "animation, spacing และ visual tone สำคัญ แต่จะยืนระยะได้ดีกว่าเมื่อ information architecture ลงตัวแล้ว งาน polish ที่ดีควรทำให้โปรดักต์รู้สึกนิ่งและชัด ไม่ใช่ปกปิด logic ที่ยังไม่ลงตัว",
            ],
          },
        ],
      },
    },
  },
  {
    slug: "designing-ai-workflows",
    category: "AI integration",
    publishedAt: "2026-06-20",
    translations: {
      en: {
        readingTime: "5 min",
        title: "Designing AI workflows that help the product instead of decorating it",
        summary:
          "How I think about embedding LLM features into real workflows with clear inputs, safe outputs, and handoff points that teams can support.",
        lead: "AI features become useful when they reduce friction in a workflow people already care about. The goal is not to add a chatbot everywhere. The goal is to remove repeated manual work, speed up decisions, or improve the quality of a task someone already performs.",
        sections: [
          {
            heading: "Define the job before choosing the model",
            paragraphs: [
              "I usually start by asking what the feature should reliably produce: a summary, a classification, a draft, a structured extraction, or a next-step recommendation. That answer shapes the interface more than model branding does.",
              "When the product team is clear on the job, prompt design, evaluation, and fallback behavior become much easier to reason about.",
            ],
          },
          {
            heading: "Make the boundaries visible to users",
            paragraphs: [
              "Users should know when they are looking at generated text, when a result may be incomplete, and what action comes next. Clear labels, editable drafts, and human review steps do more for trust than abstract claims about intelligence.",
            ],
          },
          {
            heading: "Operational simplicity wins",
            paragraphs: [
              "The best AI feature is often the one that the team can monitor, debug, and evolve without heroics. Logging, prompt versioning, and straightforward downstream actions matter just as much as the model response itself.",
            ],
          },
        ],
      },
      th: {
        readingTime: "5 นาที",
        title: "ออกแบบ AI workflows ให้ช่วยงานจริง แทนที่จะเป็นแค่ของตกแต่งโปรดักต์",
        summary:
          "วิธีคิดในการฝัง LLM features เข้าไปใน workflow จริง โดยมี input ที่ชัด output ที่ปลอดภัย และจุด handoff ที่ทีมดูแลต่อได้",
        lead: "ฟีเจอร์ AI จะมีประโยชน์เมื่อมันลด friction ใน workflow ที่คนใช้อยู่แล้ว เป้าหมายไม่ใช่การยัด chatbot ไปทุกจุด แต่คือการลดงานซ้ำ เร่งการตัดสินใจ หรือยกระดับคุณภาพของงานที่ผู้ใช้ทำอยู่แล้ว",
        sections: [
          {
            heading: "นิยามงานให้ชัดก่อนเลือกโมเดล",
            paragraphs: [
              "ผมมักเริ่มจากคำถามว่าฟีเจอร์นี้ต้องส่งมอบอะไรให้ได้อย่างสม่ำเสมอ เช่น summary, classification, draft, structured extraction หรือ next-step recommendation คำตอบนี้จะกำหนดหน้าตา UI มากกว่าชื่อรุ่นของโมเดล",
              "เมื่อทีมชัดเรื่องงานที่ต้องการให้ AI ทำ prompt design, evaluation และ fallback behavior จะถูกออกแบบได้ง่ายขึ้นมาก",
            ],
          },
          {
            heading: "ทำให้ขอบเขตของ AI มองเห็นได้สำหรับผู้ใช้",
            paragraphs: [
              "ผู้ใช้ควรรู้ว่าเมื่อไรคือข้อความที่ generate มา เมื่อไรผลลัพธ์อาจยังไม่สมบูรณ์ และขั้นถัดไปคืออะไร label ที่ชัด draft ที่แก้ไขได้ และ human review step ช่วยสร้างความเชื่อใจได้มากกว่าคำโฆษณากว้างๆ",
            ],
          },
          {
            heading: "ความเรียบง่ายเชิงปฏิบัติการชนะเสมอ",
            paragraphs: [
              "ฟีเจอร์ AI ที่ดีที่สุดมักเป็นตัวที่ทีม monitor, debug และพัฒนาต่อได้โดยไม่ต้องพึ่งฮีโร่ Logging, prompt versioning และ downstream actions ที่ตรงไปตรงมาสำคัญพอๆ กับคำตอบจากโมเดล",
            ],
          },
        ],
      },
    },
  },
  {
    slug: "nextjs-localization-patterns",
    category: "Next.js",
    publishedAt: "2026-06-12",
    translations: {
      en: {
        readingTime: "7 min",
        title: "A clean localization pattern for Next.js portfolio and product routes",
        summary:
          "Notes on organizing locale-aware routes, metadata, and content files in a way that scales from a portfolio to a larger product surface.",
        lead: "Localized routing gets messy when content, metadata, and navigation all evolve separately. A cleaner pattern is to keep locale-aware pages thin, load dictionaries close to the route, and centralize structured content where it can be reused safely.",
        sections: [
          {
            heading: "Keep route files focused",
            paragraphs: [
              "I like route pages that do only a few things: validate the locale, load the dictionary or content, and hand the result to a presentational component. That keeps metadata generation and page rendering aligned.",
            ],
          },
          {
            heading: "Use structured content for repeatable sections",
            paragraphs: [
              "When content has repeated fields like title, summary, tags, and body sections, moving it into a typed data file reduces duplication and makes translation less fragile. It also gives us a single source for pages, cards, and sitemap generation.",
            ],
          },
          {
            heading: "Treat metadata as part of the feature",
            paragraphs: [
              "Localized pages should not stop at translated copy. Canonical URLs, alternate language links, and Open Graph content all deserve the same attention if the route is meant to be shared publicly.",
            ],
          },
        ],
      },
      th: {
        readingTime: "7 นาที",
        title: "รูปแบบ localization ที่สะอาดสำหรับ route แบบ Next.js",
        summary:
          "บันทึกการจัดโครง route, metadata และ content files สำหรับหน้าแบบหลายภาษาให้ขยายจาก portfolio ไปสู่ product surface ที่ใหญ่ขึ้นได้",
        lead: "route หลายภาษาจะเริ่มยุ่งเมื่อ content, metadata และ navigation โตแยกกัน วิธีที่สะอาดกว่าคือทำให้ route files บาง โหลด dictionary ใกล้ route และรวม structured content ไว้ในจุดที่นำกลับมาใช้ซ้ำได้อย่างปลอดภัย",
        sections: [
          {
            heading: "ทำให้ route files รับผิดชอบเท่าที่จำเป็น",
            paragraphs: [
              "ผมชอบให้ route page ทำไม่กี่อย่าง: validate locale, โหลด dictionary หรือ content และส่งต่อให้ presentational component วิธีนี้ช่วยให้ metadata generation กับ page rendering เดินไปด้วยกัน",
            ],
          },
          {
            heading: "ใช้ structured content กับส่วนที่มีรูปแบบซ้ำ",
            paragraphs: [
              "ถ้า content มี field ซ้ำๆ อย่าง title, summary, tags และ body sections การย้ายไปเป็น typed data file จะลด duplication และลดความเสี่ยงเวลาแปลภาษา อีกทั้งยังกลายเป็น source เดียวสำหรับหน้า cards และ sitemap ได้ด้วย",
            ],
          },
          {
            heading: "มอง metadata ว่าเป็นส่วนหนึ่งของฟีเจอร์",
            paragraphs: [
              "หน้า localized ไม่ควรจบแค่ข้อความที่แปลแล้ว canonical URLs, alternate language links และ Open Graph content ก็ควรถูกดูแลด้วยระดับความตั้งใจเดียวกันถ้าหน้านั้นถูกออกแบบมาให้แชร์สู่สาธารณะ",
            ],
          },
        ],
      },
    },
  },
];

const prisma = new PrismaClient({
  adapter: new PrismaPg(databaseUrl),
});

try {
  for (const article of articles) {
    const translations = Object.entries(article.translations).map(
      ([locale, value]) => ({
        locale,
        title: value.title,
        summary: value.summary,
        lead: value.lead,
        readingTime: value.readingTime,
        sections: value.sections,
      }),
    );

    await prisma.article.upsert({
      where: {
        slug: article.slug,
      },
      update: {
        category: article.category,
        status: "published",
        publishedAt: new Date(article.publishedAt),
        translations: {
          deleteMany: {},
          create: translations,
        },
      },
      create: {
        slug: article.slug,
        category: article.category,
        status: "published",
        publishedAt: new Date(article.publishedAt),
        translations: {
          create: translations,
        },
      },
    });

    console.log(`Seeded article: ${article.slug}`);
  }

  console.log(`Done. ${articles.length} articles ready.`);
} finally {
  await prisma.$disconnect();
}
