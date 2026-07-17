import "server-only";

import { cache } from "react";
import { redirect } from "next/navigation";
import { isRoleCode } from "@/domain/permissions";
import type { AuthenticatedUser } from "@/server/authorization";
import { getDb } from "@/server/db";
import { getSessionPayload } from "@/server/session";

export const verifySession = cache(async (): Promise<AuthenticatedUser | null> => {
  const payload = await getSessionPayload();
  if (!payload) return null;

  const user = await getDb().user.findFirst({
    where: {
      id: payload.userId,
      status: "ACTIVE",
    },
    select: {
      id: true,
      email: true,
      userRoles: {
        select: {
          role: { select: { code: true } },
        },
      },
    },
  });

  if (!user) return null;

  return {
    id: user.id,
    email: user.email,
    roleCodes: user.userRoles
      .map(({ role }) => role.code)
      .filter(isRoleCode),
  };
});

export async function requireSession() {
  const user = await verifySession();
  if (!user) redirect("/login");
  return user;
}
