import {
  ROLE_DEFINITIONS,
  type MenuResourceId,
  type RoleId,
} from "@/domain/access-control";

const RESOURCE_GROUPS: Record<MenuResourceId, readonly string[]> = {
  dashboard: ["dashboard"],
  masterData: ["master-data"],
  schedule: ["schedule"],
  quotes: ["quotes"],
  integrations: ["integrations"],
  settings: ["settings"],
};

export function getAllowedNavigationGroups(roleIds: readonly RoleId[]) {
  const resources = new Set<MenuResourceId>();

  for (const roleId of roleIds) {
    const role = ROLE_DEFINITIONS.find((definition) => definition.id === roleId);
    role?.menuAccess.forEach((resource) => resources.add(resource));
  }

  return [...resources].flatMap((resource) => RESOURCE_GROUPS[resource]);
}
