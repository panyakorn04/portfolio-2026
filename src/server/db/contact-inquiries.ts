import type { Prisma } from "@prisma/client";

import { getPrismaClient } from "./client";

export const contactInquiryStatuses = ["new", "in_progress", "handled"] as const;

export type ContactInquiryStatus = (typeof contactInquiryStatuses)[number];

const contactInquirySelect = {
  id: true,
  name: true,
  email: true,
  company: true,
  subject: true,
  message: true,
  locale: true,
  deliveryMode: true,
  status: true,
  internalNote: true,
  handledAt: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.ContactInquirySelect;

const contactInquiryActivitySelect = {
  id: true,
  actorType: true,
  actorLabel: true,
  eventType: true,
  statusFrom: true,
  statusTo: true,
  internalNoteFrom: true,
  internalNoteTo: true,
  createdAt: true,
} satisfies Prisma.ContactInquiryActivitySelect;

export type ContactInquiryRecord = Prisma.ContactInquiryGetPayload<{
  select: typeof contactInquirySelect;
}>;

export type ContactInquiryActivityRecord = Prisma.ContactInquiryActivityGetPayload<{
  select: typeof contactInquiryActivitySelect;
}>;

export type ContactInquiryDetailRecord = ContactInquiryRecord & {
  activities: ContactInquiryActivityRecord[];
};

function buildInquiryWhere(input: {
  status?: ContactInquiryStatus | "all";
  query?: string;
}): Prisma.ContactInquiryWhereInput {
  const filters: Prisma.ContactInquiryWhereInput[] = [];

  if (input.status && input.status !== "all") {
    filters.push({
      status: input.status,
    });
  }

  if (input.query) {
    filters.push({
      OR: [
        {
          name: {
            contains: input.query,
            mode: "insensitive",
          },
        },
        {
          email: {
            contains: input.query,
            mode: "insensitive",
          },
        },
        {
          company: {
            contains: input.query,
            mode: "insensitive",
          },
        },
        {
          subject: {
            contains: input.query,
            mode: "insensitive",
          },
        },
        {
          message: {
            contains: input.query,
            mode: "insensitive",
          },
        },
      ],
    });
  }

  return filters.length > 0 ? { AND: filters } : {};
}

export async function createContactInquiry(input: {
  name: string;
  email: string;
  company: string;
  subject: string;
  message: string;
  locale: string;
}) {
  const prisma = getPrismaClient();

  return prisma.contactInquiry.create({
    data: {
      name: input.name,
      email: input.email,
      company: input.company || null,
      subject: input.subject,
      message: input.message,
      locale: input.locale,
      activities: {
        create: {
          actorType: "system",
          actorLabel: "contact_form",
          eventType: "created",
          statusTo: "new",
          internalNoteTo: null,
        },
      },
    },
  });
}

export async function updateContactInquiryDeliveryMode(
  id: string,
  deliveryMode: "database" | "database+webhook",
) {
  const prisma = getPrismaClient();

  return prisma.contactInquiry.update({
    where: { id },
    data: { deliveryMode },
  });
}

export async function listRecentContactInquiries(limit = 20) {
  return listContactInquiries({
    limit,
  });
}

export async function listContactInquiries(input: {
  limit?: number;
  page?: number;
  status?: ContactInquiryStatus | "all";
  query?: string;
}) {
  const prisma = getPrismaClient();
  const limit = input.limit ?? 20;
  const page = input.page ?? 1;
  const where = buildInquiryWhere({
    status: input.status,
    query: input.query?.trim() || undefined,
  });

  const [items, total] = await Promise.all([
    prisma.contactInquiry.findMany({
      where,
      orderBy: {
        createdAt: "desc",
      },
      skip: (page - 1) * limit,
      take: limit,
      select: contactInquirySelect,
    }),
    prisma.contactInquiry.count({ where }),
  ]);

  return {
    items,
    total,
    page,
    limit,
    totalPages: Math.max(1, Math.ceil(total / limit)),
  };
}

export async function getContactInquiryById(id: string) {
  const prisma = getPrismaClient();

  return prisma.contactInquiry.findUnique({
    where: { id },
    select: contactInquirySelect,
  });
}

export async function getContactInquiryDetailById(id: string) {
  const prisma = getPrismaClient();

  return prisma.contactInquiry.findUnique({
    where: { id },
    select: {
      ...contactInquirySelect,
      activities: {
        orderBy: {
          createdAt: "desc",
        },
        select: contactInquiryActivitySelect,
      },
    },
  });
}

export async function updateContactInquiry(
  id: string,
  input: {
    status: ContactInquiryStatus;
    internalNote: string | null;
    actorType: "admin_session" | "admin_token";
    actorLabel: string;
  },
) {
  const prisma = getPrismaClient();

  const current = await prisma.contactInquiry.findUnique({
    where: { id },
    select: {
      status: true,
      internalNote: true,
    },
  });

  if (!current) {
    const error = new Error("Contact inquiry not found.");
    (error as Error & { code?: string }).code = "P2025";
    throw error;
  }

  const statusChanged = current.status !== input.status;
  const noteChanged = (current.internalNote ?? null) !== input.internalNote;

  return prisma.contactInquiry.update({
    where: { id },
    data: {
      status: input.status,
      internalNote: input.internalNote,
      handledAt: input.status === "handled" ? new Date() : null,
      activities:
        statusChanged || noteChanged
          ? {
              create: {
                actorType: input.actorType,
                actorLabel: input.actorLabel,
                eventType:
                  statusChanged && noteChanged
                    ? "status_and_note_updated"
                    : statusChanged
                      ? "status_updated"
                      : "note_updated",
                statusFrom: current.status,
                statusTo: input.status,
                internalNoteFrom: current.internalNote,
                internalNoteTo: input.internalNote,
              },
            }
          : undefined,
    },
    select: contactInquirySelect,
  });
}
