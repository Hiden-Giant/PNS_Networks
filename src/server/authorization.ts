import "server-only";

import {
  hasPermission,
  type PermissionKey,
  type RoleCode,
} from "@/domain/permissions";

export type AuthenticatedUser = {
  id: string;
  email: string;
  roleCodes: readonly RoleCode[];
};

export class AuthenticationError extends Error {
  constructor() {
    super("로그인이 필요합니다.");
    this.name = "AuthenticationError";
  }
}

export class AuthorizationError extends Error {
  constructor(permission: PermissionKey) {
    super(`요청한 작업에 필요한 권한이 없습니다: ${permission}`);
    this.name = "AuthorizationError";
  }
}

export function requireAuthenticatedUser(
  user: AuthenticatedUser | null | undefined,
) {
  if (!user) {
    throw new AuthenticationError();
  }

  return user;
}

export function requirePermission(
  user: AuthenticatedUser | null | undefined,
  permission: PermissionKey,
) {
  const authenticatedUser = requireAuthenticatedUser(user);

  if (!hasPermission(authenticatedUser.roleCodes, permission)) {
    throw new AuthorizationError(permission);
  }

  return authenticatedUser;
}
