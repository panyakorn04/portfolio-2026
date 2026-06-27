import { Prisma } from "@prisma/client";

import { assertStaffRole, requireAdminAccess } from "@/server/auth/access";
import { staffRoles, updateUserRole } from "@/server/auth/users";
import { jsonError, jsonOk } from "@/server/http/response";

type PatchPayload = {
  role?: string;
};

function isStaffRole(value: string): value is (typeof staffRoles)[number] {
  return staffRoles.includes(value as (typeof staffRoles)[number]);
}

export async function PATCH(
  request: Request,
  context: RouteContext<"/api/admin/users/[id]">,
) {
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

  const { id } = await context.params;
  const payload = (await request.json().catch(() => null)) as PatchPayload | null;
  const role = payload?.role?.trim();

  if (!role || !isStaffRole(role)) {
    return jsonError("Role is invalid.", {
      status: 400,
      details: [
        {
          field: "role",
          message: `Use one of: ${staffRoles.join(", ")}.`,
        },
      ],
    });
  }

  if (access.user?.id === id && role !== "admin") {
    return jsonError("You cannot remove your own admin role.", {
      status: 400,
    });
  }

  try {
    const user = await updateUserRole({
      userId: id,
      role,
    });

    return jsonOk(user);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
      return jsonError("User not found.", {
        status: 404,
      });
    }

    throw error;
  }
}
