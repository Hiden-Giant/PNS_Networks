import "server-only";

import type { LocationType, RecordStatus } from "@/generated/prisma/enums";
import { getDb } from "@/server/db";

export type LocationFilters = {
  countryId?: string;
  type?: LocationType;
  status?: RecordStatus;
  query?: string;
  limit?: number;
};

export async function listLocations(filters: LocationFilters = {}) {
  const limit = Math.min(Math.max(filters.limit ?? 50, 1), 100);

  return getDb().location.findMany({
    where: {
      countryId: filters.countryId,
      type: filters.type,
      status: filters.status ?? "ACTIVE",
      ...(filters.query
        ? {
            OR: [
              { code: { contains: filters.query, mode: "insensitive" } },
              { nameKo: { contains: filters.query, mode: "insensitive" } },
              { nameEn: { contains: filters.query, mode: "insensitive" } },
              { unLocode: { contains: filters.query, mode: "insensitive" } },
              { iataCode: { contains: filters.query, mode: "insensitive" } },
            ],
          }
        : {}),
    },
    select: {
      id: true,
      code: true,
      type: true,
      nameKo: true,
      nameEn: true,
      unLocode: true,
      iataCode: true,
      timezone: true,
      status: true,
      country: {
        select: {
          id: true,
          iso2: true,
          nameKo: true,
          nameEn: true,
          region: { select: { id: true, code: true, nameKo: true } },
        },
      },
    },
    orderBy: [{ country: { iso2: "asc" } }, { nameEn: "asc" }],
    take: limit,
  });
}

export async function listCountries() {
  return getDb().country.findMany({
    where: { status: "ACTIVE" },
    select: {
      id: true,
      iso2: true,
      nameKo: true,
      nameEn: true,
      region: { select: { nameKo: true } },
    },
    orderBy: [{ region: { nameKo: "asc" } }, { nameEn: "asc" }],
  });
}

export async function listLocationsForManagement() {
  return getDb().location.findMany({
    select: {
      id: true,
      code: true,
      type: true,
      nameKo: true,
      nameEn: true,
      unLocode: true,
      iataCode: true,
      timezone: true,
      status: true,
      country: {
        select: {
          id: true,
          iso2: true,
          nameKo: true,
          region: { select: { nameKo: true } },
        },
      },
    },
    orderBy: [{ country: { iso2: "asc" } }, { type: "asc" }, { nameEn: "asc" }],
  });
}

export async function listRouteLocationOptions() {
  return getDb().location.findMany({
    where: { status: "ACTIVE", type: { in: ["PORT", "AIRPORT"] } },
    select: {
      id: true,
      code: true,
      type: true,
      nameKo: true,
      nameEn: true,
      unLocode: true,
      iataCode: true,
      country: { select: { iso2: true, nameKo: true } },
    },
    orderBy: [{ country: { iso2: "asc" } }, { type: "asc" }, { nameEn: "asc" }],
  });
}

export async function listRoutesForManagement() {
  return getDb().route.findMany({
    select: {
      id: true,
      code: true,
      transportMode: true,
      transshipmentAllowed: true,
      status: true,
      origin: {
        select: { id: true, code: true, type: true, nameKo: true, unLocode: true, iataCode: true, country: { select: { iso2: true } } },
      },
      destination: {
        select: { id: true, code: true, type: true, nameKo: true, unLocode: true, iataCode: true, country: { select: { iso2: true } } },
      },
      _count: { select: { schedules: true, rates: true, quoteRequests: true } },
    },
    orderBy: [{ transportMode: "asc" }, { code: "asc" }],
  });
}

export async function listCarriers(status: RecordStatus = "ACTIVE") {
  return getDb().carrier.findMany({
    where: { status },
    select: {
      id: true,
      code: true,
      scac: true,
      iataCode: true,
      type: true,
      nameKo: true,
      nameEn: true,
      status: true,
    },
    orderBy: { nameEn: "asc" },
  });
}

export async function listCarriersForManagement() {
  return getDb().carrier.findMany({
    select: {
      id: true,
      code: true,
      scac: true,
      iataCode: true,
      type: true,
      nameKo: true,
      nameEn: true,
      status: true,
      _count: { select: { schedules: true, rates: true } },
    },
    orderBy: [{ type: "asc" }, { nameEn: "asc" }],
  });
}

export async function listServiceCodes(status: RecordStatus = "ACTIVE") {
  return getDb().serviceCode.findMany({
    where: { status },
    select: {
      id: true,
      code: true,
      nameKo: true,
      nameEn: true,
      defaultUnit: true,
      taxable: true,
      status: true,
    },
    orderBy: { code: "asc" },
  });
}

export async function listServiceCodesForManagement() {
  return getDb().serviceCode.findMany({
    select: {
      id: true,
      code: true,
      nameKo: true,
      nameEn: true,
      defaultUnit: true,
      taxable: true,
      status: true,
      _count: { select: { surcharges: true } },
    },
    orderBy: { code: "asc" },
  });
}
