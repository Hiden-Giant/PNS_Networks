import "server-only";

import { getDb } from "@/server/db";
import { verifyPassword } from "@/server/password";

export async function authenticateUser(email: string, password: string) {
  const user = await getDb().user.findUnique({
    where: { email: email.toLowerCase() },
    select: {
      id: true,
      email: true,
      name: true,
      passwordHash: true,
      status: true,
    },
  });

  if (
    !user ||
    user.status !== "ACTIVE" ||
    !user.passwordHash ||
    !(await verifyPassword(password, user.passwordHash))
  ) {
    return null;
  }

  return {
    id: user.id,
    email: user.email,
    name: user.name,
  };
}

export async function getBypassLoginUser() {
  const user = await getDb().user.findFirst({
    where: {
      status: "ACTIVE",
      userRoles: { some: { role: { code: "system-admin" } } },
    },
    orderBy: { createdAt: "asc" },
    select: {
      id: true,
      email: true,
      name: true,
    },
  });

  return user;
}
