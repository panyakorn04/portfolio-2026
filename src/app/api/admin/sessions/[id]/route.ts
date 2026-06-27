import { cookies } from "next/headers";

import { assertStaffRole, requireAdminAccess } from "@/server/auth/access";
import { adminSessionCookieName, getCookieValue } from "@/server/auth/session";
import { deleteAuthSessionById, getAuthSessionByRawToken } from "@/server/auth/users";
import { jsonError, jsonOk } from "@/server/http/response";

export async function DELETE(
  request: Request,
  context: RouteContext<"/api/admin/sessions/[id]">,
) {
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
    return jsonError("Session revoke requires a user-backed session.", {
      status: 400,
    });
  }

  const { id } = await context.params;
  const currentRawToken = getCookieValue(
    request.headers.get("cookie"),
    adminSessionCookieName,
  );
  const currentSession = currentRawToken
    ? await getAuthSessionByRawToken(currentRawToken)
    : null;
  const cookieStore = await cookies();

  const result = await deleteAuthSessionById({
    sessionId: id,
    userId: access.user.id,
  });

  if (result.count === 0) {
    return jsonError("Session not found.", {
      status: 404,
    });
  }

  if (currentSession?.id === id) {
    cookieStore.delete(adminSessionCookieName);
  }

  return jsonOk({
    revoked: true,
    isCurrent: currentSession?.id === id,
  });
}
