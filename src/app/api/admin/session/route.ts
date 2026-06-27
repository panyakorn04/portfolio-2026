import { cookies } from "next/headers";

import { requireAdminAccess } from "@/server/auth/access";
import { verifyPassword } from "@/server/auth/password";
import {
  adminSessionCookieName,
  adminSessionMaxAgeSeconds,
  createRawSessionToken,
  getCookieValue,
} from "@/server/auth/session";
import {
  createAuthSession,
  deleteAuthSessionByRawToken,
  getUserByEmail,
  staffRoles,
} from "@/server/auth/users";
import { getEnvironment } from "@/server/env";
import { jsonError, jsonOk } from "@/server/http/response";

type LoginPayload = {
  email?: string;
  password?: string;
};

function shouldUseSecureCookie(siteUrl: string | null) {
  return siteUrl ? siteUrl.startsWith("https://") : process.env.NODE_ENV === "production";
}

export async function GET(request: Request) {
  try {
    const access = await requireAdminAccess(request);

    return jsonOk({
      authenticated: true,
      via: access.via,
      user: access.user,
    });
  } catch (error) {
    const accessError = error as { status: number; message: string };

    return jsonError(accessError.message, {
      status: accessError.status,
    });
  }
}

export async function POST(request: Request) {
  const env = getEnvironment();
  const payload = (await request.json().catch(() => null)) as LoginPayload | null;
  const email = payload?.email?.trim().toLowerCase();
  const password = payload?.password?.trim();

  if (!email || !password) {
    return jsonError("email and password are required.", {
      status: 400,
      details: [
        {
          field: !email ? "email" : "password",
          message: "Provide valid login credentials.",
        },
      ],
    });
  }

  let user: Awaited<ReturnType<typeof getUserByEmail>>;

  try {
    user = await getUserByEmail(email);
  } catch (error) {
    console.error("[admin-session] failed to load user", error);

    return jsonError("Unable to sign in right now.", {
      status: 503,
    });
  }

  if (!user || !staffRoles.includes(user.role as (typeof staffRoles)[number])) {
    return jsonError("Admin credentials are invalid.", {
      status: 401,
    });
  }

  if (!verifyPassword(password, user.passwordHash)) {
    return jsonError("Admin credentials are invalid.", {
      status: 401,
    });
  }

  const cookieStore = await cookies();
  const rawSessionToken = createRawSessionToken();

  try {
    await createAuthSession({
      userId: user.id,
      rawSessionToken,
    });
  } catch (error) {
    console.error("[admin-session] failed to create session", error);

    return jsonError("Unable to sign in right now.", {
      status: 503,
    });
  }

  cookieStore.set(adminSessionCookieName, rawSessionToken, {
    httpOnly: true,
    sameSite: "lax",
    secure: shouldUseSecureCookie(env.siteUrl),
    path: "/",
    maxAge: adminSessionMaxAgeSeconds,
  });

  return jsonOk({
    authenticated: true,
    via: "session",
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    },
  });
}

export async function DELETE(request: Request) {
  const cookieStore = await cookies();
  const rawSessionToken = getCookieValue(
    request.headers.get("cookie"),
    adminSessionCookieName,
  );

  if (rawSessionToken) {
    await deleteAuthSessionByRawToken(rawSessionToken);
  }

  cookieStore.delete(adminSessionCookieName);

  return jsonOk({
    authenticated: false,
  });
}
