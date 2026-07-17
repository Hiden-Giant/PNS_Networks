import "server-only";

import type { TransportMode } from "@/generated/prisma/enums";
import { getDb } from "@/server/db";

export type RouteMutationInput = {
  code: string;
  originId: string;
  destinationId: string;
  transportMode: TransportMode;
  transshipmentAllowed: boolean;
};

const auditSelect = {
  id: true,
  code: true,
  originId: true,
  destinationId: true,
  transportMode: true,
  transshipmentAllowed: true,
  status: true,
} as const;

async function validateLocations(
  tx: Parameters<Parameters<ReturnType<typeof getDb>["$transaction"]>[0]>[0],
  input: RouteMutationInput,
) {
  if (input.originId === input.destinationId) throw new Error("출발지와 도착지는 달라야 합니다.");
  const locations = await tx.location.findMany({
    where: { id: { in: [input.originId, input.destinationId] }, status: "ACTIVE" },
    select: { id: true, type: true },
  });
  if (locations.length !== 2) throw new Error("활성 상태의 출발지와 도착지를 선택하세요.");
  if (input.transportMode === "SEA" && locations.some((location) => location.type !== "PORT")) throw new Error("해상 라우트는 항구끼리만 연결할 수 있습니다.");
  if (input.transportMode === "AIR" && locations.some((location) => location.type !== "AIRPORT")) throw new Error("항공 라우트는 공항끼리만 연결할 수 있습니다.");
}

export async function createRoute(input: RouteMutationInput, actorId: string) {
  return getDb().$transaction(async (tx) => {
    await validateLocations(tx, input);
    const created = await tx.route.create({ data: { ...input, status: "ACTIVE" }, select: auditSelect });
    await tx.auditLog.create({ data: { actorId, action: "CREATE", resource: "route", resourceId: created.id, after: created } });
    return created;
  });
}

export async function updateRoute(id: string, input: RouteMutationInput, actorId: string) {
  return getDb().$transaction(async (tx) => {
    await validateLocations(tx, input);
    const before = await tx.route.findUniqueOrThrow({ where: { id }, select: auditSelect });
    const updated = await tx.route.update({ where: { id }, data: input, select: auditSelect });
    await tx.auditLog.create({ data: { actorId, action: "UPDATE", resource: "route", resourceId: id, before, after: updated } });
    return updated;
  });
}

export async function deactivateRoute(id: string, actorId: string) {
  return getDb().$transaction(async (tx) => {
    const before = await tx.route.findUniqueOrThrow({ where: { id }, select: auditSelect });
    const updated = await tx.route.update({ where: { id }, data: { status: "INACTIVE" }, select: auditSelect });
    await tx.auditLog.create({ data: { actorId, action: "DEACTIVATE", resource: "route", resourceId: id, before, after: updated } });
    return updated;
  });
}
