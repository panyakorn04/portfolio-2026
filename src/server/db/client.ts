import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

import { requireEnvironmentValue } from "../env";

const globalForPrisma = globalThis as typeof globalThis & {
  prisma?: PrismaClient;
};

function createPrismaClient() {
  const connectionString = requireEnvironmentValue(
    "databaseUrl",
    "DATABASE_URL is not configured.",
  );

  return new PrismaClient({
    adapter: new PrismaPg(connectionString),
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });
}

export function getPrismaClient() {
  if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = createPrismaClient();
  }

  return globalForPrisma.prisma;
}
