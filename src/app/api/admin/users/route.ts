import { assertStaffRole, requireAdminAccess } from "@/server/auth/access";
import { listUsers } from "@/server/auth/users";
import { jsonError, jsonOk } from "@/server/http/response";

export async function GET(request: Request) {
  let access: Awaited<ReturnType<typeof requireAdminAccess>>;

  try {
    access = await requireAdminAccess(request);
    assertStaffRole(access, ["admin"]);
  } catch (error) {
    const accessError = error as { status: number; message: string };

    return jsonError(accessError.message, {
      status: accessError.status,
    });
  }

  const items = await listUsers();

  return jsonOk({
    items,
  });
}
