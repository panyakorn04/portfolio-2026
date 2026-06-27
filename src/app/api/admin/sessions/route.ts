import { cookies } from "next/headers";

import { assertStaffRole, requireAdminAccess } from "@/server/auth/access";
import { adminSessionCookieName, getCookieValue } from "@/server/auth/session";
import {
  deleteAllAuthSessionsForUser,
  deleteAuthSessionByRawToken,
  getAuthSessionByRawToken,
  listAuthSessionsForUser,
} from "@/server/auth/users";
import { jsonError, jsonOk } from "@/server/http/response";

export async function GET(request: Request) {
  let access: Awaited<ReturnType<typeof requireAdminAccess>>;

  try {
    access = await requireAdminAccess(request);
    assertStaffRole(access, ["admin", "editor", "viewer"]);
  } catch (error) {
    const accessError = error as { status: number; message: string };

    return jsonError(accessError.message, {
      status: accessError.status,
    });
  }

  if (!access.user) {
    return jsonError("Session listing requires a user-backed session.", {
      status: 400,
    });
  }

  const currentRawToken = getCookieValue(
    request.headers.get("cookie"),
    adminSessionCookieName,
  );
  const currentSession = currentRawToken
    ? await getAuthSessionByRawToken(currentRawToken)
    : null;
  const sessions = await listAuthSessionsForUser(access.user.id);

  return jsonOk({
    items: sessions.map((session) => ({
      ...session,
      isCurrent: currentSession?.id === session.id,
    })),
  });
}

export async function DELETE(request: Request) {
  let access: Awaited<ReturnType<typeof requireAdminAccess>>;

  try {
    access = await requireAdminAccess(request);
    assertStaffRole(access, ["admin", "editor", "viewer"]);
  } catch (error) {
    const accessError = error as { status: number; message: string };

    return jsonError(accessError.message, {
      status: accessError.status,
    });
  }

  if (!access.user) {
    return jsonError("Logout everywhere requires a user-backed session.", {
      status: 400,
    });
  }

  const cookieStore = await cookies();
  const currentRawToken = getCookieValue(
    request.headers.get("cookie"),
    adminSessionCookieName,
  );

  await deleteAllAuthSessionsForUser(access.user.id);

  if (currentRawToken) {
    await deleteAuthSessionByRawToken(currentRawToken);
  }

  cookieStore.delete(adminSessionCookieName);

  return jsonOk({
    authenticated: false,
    loggedOutEverywhere: true,
  });
}
