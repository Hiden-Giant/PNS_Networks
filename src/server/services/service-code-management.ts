import "server-only";

import type { ChargeUnit } from "@/generated/prisma/enums";
import { getDb } from "@/server/db";

export type ServiceCodeMutationInput = {
  code: string;
  nameKo: string;
  nameEn: string;
  defaultUnit: ChargeUnit;
  taxable: boolean;
};

const auditSelect = {
  id: true,
  code: true,
  nameKo: true,
  nameEn: true,
  defaultUnit: true,
  taxable: true,
  status: true,
} as const;

export async function createServiceCode(input: ServiceCodeMutationInput, actorId: string) {
  return getDb().$transaction(async (tx) => {
    const created = await tx.serviceCode.create({ data: { ...input, status: "ACTIVE" }, select: auditSelect });
    await tx.auditLog.create({ data: { actorId, action: "CREATE", resource: "service-code", resourceId: created.id, after: created } });
    return created;
  });
}

export async function updateServiceCode(id: string, input: ServiceCodeMutationInput, actorId: string) {
  return getDb().$transaction(async (tx) => {
    const before = await tx.serviceCode.findUniqueOrThrow({ where: { id }, select: auditSelect });
    const updated = await tx.serviceCode.update({ where: { id }, data: input, select: auditSelect });
    await tx.auditLog.create({ data: { actorId, action: "UPDATE", resource: "service-code", resourceId: id, before, after: updated } });
    return updated;
  });
}

export async function deactivateServiceCode(id: string, actorId: string) {
  return getDb().$transaction(async (tx) => {
    const before = await tx.serviceCode.findUniqueOrThrow({ where: { id }, select: auditSelect });
    const updated = await tx.serviceCode.update({ where: { id }, data: { status: "INACTIVE" }, select: auditSelect });
    await tx.auditLog.create({ data: { actorId, action: "DEACTIVATE", resource: "service-code", resourceId: id, before, after: updated } });
    return updated;
  });
}
