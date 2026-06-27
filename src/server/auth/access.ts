import { getEnvironment } from "../env";
import { adminSessionCookieName, getCookieValue } from "./session";
import {
  getAuthSessionByRawToken,
  type StaffRole,
  staffRoles,
  touchAuthSession,
} from "./users";

export type AccessContext = {
  kind: "admin" | "internal";
  token: string | null;
  via: "bearer" | "session";
  user: {
    id: string;
    email: string;
    name: string | null;
    role: string;
  } | null;
};

function getBearerToken(request: Request) {
  const authorization = request.headers.get("authorization")?.trim();

  if (!authorization?.startsWith("Bearer ")) {
    return null;
  }

  return authorization.slice("Bearer ".length).trim();
}

function unauthorizedError(message: string) {
  return {
    status: 401,
    message,
  };
}

export function assertStaffRole(access: AccessContext, allowedRoles: StaffRole[]) {
  if (access.via === "bearer") {
    return;
  }

  if (!access.user || !allowedRoles.includes(access.user.role as StaffRole)) {
    throw forbiddenError(
      `This action requires one of these roles: ${allowedRoles.join(", ")}.`,
    );
  }
}

function forbiddenError(message: string) {
  return {
    status: 403,
    message,
  };
}

export async function requireAdminAccess(request: Request): Promise<AccessContext> {
  const env = getEnvironment();
  const token = getBearerToken(request);
  const sessionToken = getCookieValue(
    request.headers.get("cookie"),
    adminSessionCookieName,
  );

  if (token) {
    if (!env.adminApiToken) {
      throw forbiddenError("ADMIN_API_TOKEN is not configured.");
    }

    if (token !== env.adminApiToken) {
      throw forbiddenError("Admin token is invalid.");
    }

    return {
      kind: "admin",
      token,
      via: "bearer",
      user: null,
    };
  }

  if (sessionToken) {
    const session = await getAuthSessionByRawToken(sessionToken);

    if (
      session &&
      session.expiresAt > new Date() &&
      staffRoles.includes(session.user.role as StaffRole)
    ) {
      await touchAuthSession(sessionToken);

      return {
        kind: "admin",
        token: null,
        via: "session",
        user: session.user,
      };
    }
  }

  if (!env.adminApiToken) {
    throw forbiddenError(
      "Admin access is not configured. Create an admin user or set ADMIN_API_TOKEN.",
    );
  }

  throw unauthorizedError("Admin access requires a valid session or bearer token.");
}

export function requireInternalAccess(request: Request): AccessContext {
  const env = getEnvironment();
  const token = getBearerToken(request);

  if (!token) {
    throw unauthorizedError("Internal access requires a bearer token.");
  }

  if (!env.internalApiToken) {
    throw forbiddenError("INTERNAL_API_TOKEN is not configured.");
  }

  if (token !== env.internalApiToken) {
    throw forbiddenError("Internal token is invalid.");
  }

  return {
    kind: "internal",
    token,
    via: "bearer",
    user: null,
  };
}
