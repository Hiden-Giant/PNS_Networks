import "server-only";

import { getDb } from "@/server/db";

export type CarrierMutationInput = {
  code: string;
  type: "OCEAN" | "AIRLINE" | "TRUCKING" | "RAIL";
  nameKo: string;
  nameEn: string;
  scac: string | null;
  iataCode: string | null;
};

const auditSelect = {
  id: true,
  code: true,
  type: true,
  nameKo: true,
  nameEn: true,
  scac: true,
  iataCode: true,
  status: true,
} as const;

export async function createCarrier(input: CarrierMutationInput, actorId: string) {
  return getDb().$transaction(async (tx) => {
    const created = await tx.carrier.create({ data: { ...input, status: "ACTIVE" }, select: auditSelect });
    await tx.auditLog.create({ data: { actorId, action: "CREATE", resource: "carrier", resourceId: created.id, after: created } });
    return created;
  });
}

export async function updateCarrier(id: string, input: CarrierMutationInput, actorId: string) {
  return getDb().$transaction(async (tx) => {
    const before = await tx.carrier.findUniqueOrThrow({ where: { id }, select: auditSelect });
    const updated = await tx.carrier.update({ where: { id }, data: input, select: auditSelect });
    await tx.auditLog.create({ data: { actorId, action: "UPDATE", resource: "carrier", resourceId: id, before, after: updated } });
    return updated;
  });
}

export async function deactivateCarrier(id: string, actorId: string) {
  return getDb().$transaction(async (tx) => {
    const before = await tx.carrier.findUniqueOrThrow({ where: { id }, select: auditSelect });
    const updated = await tx.carrier.update({ where: { id }, data: { status: "INACTIVE" }, select: auditSelect });
    await tx.auditLog.create({ data: { actorId, action: "DEACTIVATE", resource: "carrier", resourceId: id, before, after: updated } });
    return updated;
  });
}
