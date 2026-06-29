import type { Prisma } from "@prisma/client";

import { getPrismaClient } from "./client";

export const articleStatuses = ["draft", "published"] as const;

export type ArticleStatus = (typeof articleStatuses)[number];

export const articleLocales = ["en", "th"] as const;

export type ArticleLocale = (typeof articleLocales)[number];

export type ArticleSection = {
  heading: string;
  paragraphs: string[];
};

export type ArticleTranslationInput = {
  locale: ArticleLocale;
  title: string;
  summary: string;
  lead: string;
  readingTime: string;
  sections: ArticleSection[];
};

export type ArticleInput = {
  slug: string;
  category: string;
  status: ArticleStatus;
  publishedAt: Date | null;
  translations: ArticleTranslationInput[];
};

const articleTranslationSelect = {
  id: true,
  locale: true,
  title: true,
  summary: true,
  lead: true,
  readingTime: true,
  sections: true,
} satisfies Prisma.ArticleTranslationSelect;

const articleSelect = {
  id: true,
  slug: true,
  category: true,
  status: true,
  publishedAt: true,
  createdAt: true,
  updatedAt: true,
  translations: {
    select: articleTranslationSelect,
  },
} satisfies Prisma.ArticleSelect;

export type ArticleRecord = Prisma.ArticleGetPayload<{
  select: typeof articleSelect;
}>;

export function buildArticleSlug(value: string) {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 80);
}

function buildArticleWhere(input: {
  status?: ArticleStatus | "all";
  query?: string;
}): Prisma.ArticleWhereInput {
  const filters: Prisma.ArticleWhereInput[] = [];

  if (input.status && input.status !== "all") {
    filters.push({ status: input.status });
  }

  if (input.query) {
    filters.push({
      OR: [
        {
          slug: {
            contains: input.query,
            mode: "insensitive",
          },
        },
        {
          category: {
            contains: input.query,
            mode: "insensitive",
          },
        },
        {
          translations: {
            some: {
              title: {
                contains: input.query,
                mode: "insensitive",
              },
            },
          },
        },
      ],
    });
  }

  return filters.length > 0 ? { AND: filters } : {};
}

export async function listArticles(input: {
  limit?: number;
  page?: number;
  status?: ArticleStatus | "all";
  query?: string;
}) {
  const prisma = getPrismaClient();
  const limit = input.limit ?? 20;
  const page = input.page ?? 1;
  const where = buildArticleWhere({
    status: input.status,
    query: input.query?.trim() || undefined,
  });

  const [items, total] = await Promise.all([
    prisma.article.findMany({
      where,
      orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
      skip: (page - 1) * limit,
      take: limit,
      select: articleSelect,
    }),
    prisma.article.count({ where }),
  ]);

  return {
    items,
    total,
    page,
    limit,
    totalPages: Math.max(1, Math.ceil(total / limit)),
  };
}

export async function listPublishedArticles(limit?: number | null) {
  const prisma = getPrismaClient();

  return prisma.article.findMany({
    where: { status: "published" },
    orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
    take: typeof limit === "number" ? limit : undefined,
    select: articleSelect,
  });
}

export async function getPublishedArticleSlugs() {
  const prisma = getPrismaClient();

  const items = await prisma.article.findMany({
    where: { status: "published" },
    select: { slug: true },
  });

  return items.map((item) => item.slug);
}

export async function getPublishedArticleBySlug(slug: string) {
  const prisma = getPrismaClient();

  return prisma.article.findFirst({
    where: { slug, status: "published" },
    select: articleSelect,
  });
}

export async function getArticleById(id: string) {
  const prisma = getPrismaClient();

  return prisma.article.findUnique({
    where: { id },
    select: articleSelect,
  });
}

export async function createArticle(input: ArticleInput) {
  const prisma = getPrismaClient();

  return prisma.article.create({
    data: {
      slug: input.slug,
      category: input.category,
      status: input.status,
      publishedAt: input.publishedAt,
      translations: {
        create: input.translations.map((translation) => ({
          locale: translation.locale,
          title: translation.title,
          summary: translation.summary,
          lead: translation.lead,
          readingTime: translation.readingTime,
          sections: translation.sections,
        })),
      },
    },
    select: articleSelect,
  });
}

export async function updateArticle(id: string, input: ArticleInput) {
  const prisma = getPrismaClient();

  return prisma.article.update({
    where: { id },
    data: {
      slug: input.slug,
      category: input.category,
      status: input.status,
      publishedAt: input.publishedAt,
      translations: {
        deleteMany: {},
        create: input.translations.map((translation) => ({
          locale: translation.locale,
          title: translation.title,
          summary: translation.summary,
          lead: translation.lead,
          readingTime: translation.readingTime,
          sections: translation.sections,
        })),
      },
    },
    select: articleSelect,
  });
}

export async function deleteArticle(id: string) {
  const prisma = getPrismaClient();

  return prisma.article.delete({
    where: { id },
    select: { id: true },
  });
}

export async function isSlugTaken(slug: string, excludeId?: string) {
  const prisma = getPrismaClient();

  const existing = await prisma.article.findUnique({
    where: { slug },
    select: { id: true },
  });

  if (!existing) {
    return false;
  }

  return existing.id !== excludeId;
}
