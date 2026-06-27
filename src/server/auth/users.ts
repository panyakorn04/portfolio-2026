import type { Prisma } from "@prisma/client";

import { getPrismaClient } from "../db/client";
import { getSessionExpiryDate, hashSessionToken } from "./session";

export const staffRoles = ["admin", "editor", "viewer"] as const;

export type StaffRole = (typeof staffRoles)[number];

const userSelect = {
  id: true,
  email: true,
  name: true,
  role: true,
  passwordHash: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.UserSelect;

const publicUserSelect = {
  id: true,
  email: true,
  name: true,
  role: true,
} satisfies Prisma.UserSelect;

export type UserRecord = Prisma.UserGetPayload<{
  select: typeof userSelect;
}>;

export type PublicUserRecord = Prisma.UserGetPayload<{
  select: typeof publicUserSelect;
}>;

const authSessionSelect = {
  id: true,
  expiresAt: true,
  createdAt: true,
  lastSeenAt: true,
} satisfies Prisma.AuthSessionSelect;

export type AuthSessionRecord = Prisma.AuthSessionGetPayload<{
  select: typeof authSessionSelect;
}>;

export async function getUserByEmail(email: string) {
  const prisma = getPrismaClient();

  return prisma.user.findUnique({
    where: {
      email,
    },
    select: userSelect,
  });
}

export async function getUserById(id: string) {
  const prisma = getPrismaClient();

  return prisma.user.findUnique({
    where: {
      id,
    },
    select: publicUserSelect,
  });
}

export async function createAuthSession(input: {
  userId: string;
  rawSessionToken: string;
}) {
  const prisma = getPrismaClient();

  return prisma.authSession.create({
    data: {
      userId: input.userId,
      sessionTokenHash: hashSessionToken(input.rawSessionToken),
      expiresAt: getSessionExpiryDate(),
    },
    select: authSessionSelect,
  });
}

export async function getAuthSessionByRawToken(rawSessionToken: string) {
  const prisma = getPrismaClient();

  return prisma.authSession.findUnique({
    where: {
      sessionTokenHash: hashSessionToken(rawSessionToken),
    },
    select: {
      id: true,
      expiresAt: true,
      user: {
        select: publicUserSelect,
      },
    },
  });
}

export async function touchAuthSession(rawSessionToken: string) {
  const prisma = getPrismaClient();

  return prisma.authSession.updateMany({
    where: {
      sessionTokenHash: hashSessionToken(rawSessionToken),
    },
    data: {
      lastSeenAt: new Date(),
    },
  });
}

export async function deleteAuthSessionByRawToken(rawSessionToken: string) {
  const prisma = getPrismaClient();

  return prisma.authSession.deleteMany({
    where: {
      sessionTokenHash: hashSessionToken(rawSessionToken),
    },
  });
}

export async function listAuthSessionsForUser(userId: string) {
  const prisma = getPrismaClient();

  return prisma.authSession.findMany({
    where: {
      userId,
    },
    orderBy: {
      createdAt: "desc",
    },
    select: authSessionSelect,
  });
}

export async function deleteAuthSessionById(input: {
  sessionId: string;
  userId?: string;
}) {
  const prisma = getPrismaClient();

  return prisma.authSession.deleteMany({
    where: {
      id: input.sessionId,
      ...(input.userId ? { userId: input.userId } : {}),
    },
  });
}

export async function deleteAllAuthSessionsForUser(userId: string) {
  const prisma = getPrismaClient();

  return prisma.authSession.deleteMany({
    where: {
      userId,
    },
  });
}

export async function listUsers() {
  const prisma = getPrismaClient();

  return prisma.user.findMany({
    orderBy: {
      createdAt: "asc",
    },
    select: publicUserSelect,
  });
}

export async function updateUserRole(input: { userId: string; role: StaffRole }) {
  const prisma = getPrismaClient();

  return prisma.user.update({
    where: {
      id: input.userId,
    },
    data: {
      role: input.role,
    },
    select: publicUserSelect,
  });
}
