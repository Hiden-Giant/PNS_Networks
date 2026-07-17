import "server-only";

import { getDb } from "@/server/db";

export type LocationMutationInput = {
  countryId: string;
  type: "PORT" | "AIRPORT";
  code: string;
  unLocode: string | null;
  iataCode: string | null;
  nameKo: string;
  nameEn: string;
  timezone: string;
};

const auditSelect = {
  id: true,
  countryId: true,
  type: true,
  code: true,
  unLocode: true,
  iataCode: true,
  nameKo: true,
  nameEn: true,
  timezone: true,
  status: true,
} as const;

export async function createLocation(input: LocationMutationInput, actorId: string) {
  return getDb().$transaction(async (tx) => {
    const created = await tx.location.create({
      data: { ...input, status: "ACTIVE" },
      select: auditSelect,
    });
    await tx.auditLog.create({
      data: {
        actorId,
        action: "CREATE",
        resource: "location",
        resourceId: created.id,
        after: created,
      },
    });
    return created;
  });
}

export async function updateLocation(id: string, input: LocationMutationInput, actorId: string) {
  return getDb().$transaction(async (tx) => {
    const before = await tx.location.findUniqueOrThrow({ where: { id }, select: auditSelect });
    const updated = await tx.location.update({ where: { id }, data: input, select: auditSelect });
    await tx.auditLog.create({
      data: { actorId, action: "UPDATE", resource: "location", resourceId: id, before, after: updated },
    });
    return updated;
  });
}

export async function deactivateLocation(id: string, actorId: string) {
  return getDb().$transaction(async (tx) => {
    const before = await tx.location.findUniqueOrThrow({ where: { id }, select: auditSelect });
    const updated = await tx.location.update({ where: { id }, data: { status: "INACTIVE" }, select: auditSelect });
    await tx.auditLog.create({
      data: { actorId, action: "DEACTIVATE", resource: "location", resourceId: id, before, after: updated },
    });
    return updated;
  });
}
