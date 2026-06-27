import { existsSync } from "node:fs";
import { randomBytes, scryptSync } from "node:crypto";

import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

if (existsSync(".env")) {
  process.loadEnvFile?.(".env");
}

if (existsSync(".env.local")) {
  process.loadEnvFile?.(".env.local");
}

function readArg(name) {
  const index = process.argv.indexOf(`--${name}`);
  return index >= 0 ? process.argv[index + 1] : null;
}

function hashPassword(password) {
  const salt = randomBytes(16).toString("hex");
  const derivedKey = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${derivedKey}`;
}

const email = readArg("email")?.trim().toLowerCase();
const password = readArg("password")?.trim();
const name = readArg("name")?.trim() || null;
const role = readArg("role")?.trim() || "admin";
const databaseUrl = process.env.DATABASE_URL?.trim();

if (!databaseUrl) {
  console.error("DATABASE_URL is required.");
  process.exit(1);
}

if (!email || !password) {
  console.error("Usage: pnpm auth:create-user --email admin@example.com --password <password> [--name \"Admin\"] [--role admin|editor|viewer]");
  process.exit(1);
}

if (!["admin", "editor", "viewer"].includes(role)) {
  console.error("role must be one of: admin, editor, viewer");
  process.exit(1);
}

const prisma = new PrismaClient({
  adapter: new PrismaPg(databaseUrl),
});

try {
  const user = await prisma.user.upsert({
    where: {
      email,
    },
    update: {
      name,
      passwordHash: hashPassword(password),
      role,
    },
    create: {
      email,
      name,
      passwordHash: hashPassword(password),
      role,
    },
    select: {
      id: true,
      email: true,
      role: true,
    },
  });

  console.log(`Admin user ready: ${user.email} (${user.role})`);
} finally {
  await prisma.$disconnect();
}
