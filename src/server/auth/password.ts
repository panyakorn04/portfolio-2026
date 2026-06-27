import { randomBytes, scryptSync, timingSafeEqual } from "node:crypto";

const keyLength = 64;

export function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const derivedKey = scryptSync(password, salt, keyLength).toString("hex");

  return `${salt}:${derivedKey}`;
}

export function verifyPassword(password: string, passwordHash: string) {
  const [salt, storedKey] = passwordHash.split(":");

  if (!salt || !storedKey) {
    return false;
  }

  const derivedKey = scryptSync(password, salt, keyLength).toString("hex");

  if (derivedKey.length !== storedKey.length) {
    return false;
  }

  return timingSafeEqual(Buffer.from(derivedKey, "hex"), Buffer.from(storedKey, "hex"));
}
