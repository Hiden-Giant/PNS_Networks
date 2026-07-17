import { PrismaPg } from "@prisma/adapter-pg";
import { config } from "dotenv";
import { PrismaClient } from "../src/generated/prisma/client";
import {
  ROLE_CODES,
  ROLE_PERMISSIONS,
  type PermissionKey,
} from "../src/domain/permissions";
import { ROLE_DEFINITIONS } from "../src/domain/access-control";
import { hashPassword } from "../src/server/password";
import {
  COUNTRY_SEEDS,
  LOCATION_SEEDS,
  REGION_SEEDS,
} from "./seed-data/locations";
import { CARRIER_SEEDS } from "./seed-data/carriers";
import { ROUTE_SEEDS } from "./seed-data/routes";

config({ path: ".env.local" });

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is required to seed the database.");
}

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString }),
});

function splitPermission(permission: PermissionKey) {
  const separator = permission.lastIndexOf(".");
  return {
    resource: permission.slice(0, separator),
    action: permission.slice(separator + 1),
  };
}

async function seedAccessControl() {
  const allPermissions = [...new Set(Object.values(ROLE_PERMISSIONS).flat())];

  for (const permissionKey of allPermissions) {
    const { resource, action } = splitPermission(permissionKey);
    await prisma.permission.upsert({
      where: { resource_action: { resource, action } },
      update: {},
      create: { resource, action },
    });
  }

  for (const roleCode of ROLE_CODES) {
    const definition = ROLE_DEFINITIONS.find((role) => role.id === roleCode);
    if (!definition) throw new Error(`Missing role definition: ${roleCode}`);

    const role = await prisma.role.upsert({
      where: { code: roleCode },
      update: {
        name: definition.name,
        description: definition.description,
        system: true,
      },
      create: {
        code: roleCode,
        name: definition.name,
        description: definition.description,
        system: true,
      },
    });

    const permissions = await prisma.permission.findMany({
      where: {
        OR: ROLE_PERMISSIONS[roleCode].map(splitPermission),
      },
      select: { id: true },
    });

    await prisma.rolePermission.deleteMany({ where: { roleId: role.id } });
    await prisma.rolePermission.createMany({
      data: permissions.map((permission) => ({
        roleId: role.id,
        permissionId: permission.id,
      })),
      skipDuplicates: true,
    });
  }
}

async function seedCodebook() {
  for (const currency of [
    { code: "KRW", nameKo: "대한민국 원", nameEn: "Korean Won", decimalPlaces: 0 },
    { code: "USD", nameKo: "미국 달러", nameEn: "US Dollar", decimalPlaces: 2 },
    { code: "EUR", nameKo: "유로", nameEn: "Euro", decimalPlaces: 2 },
    { code: "JPY", nameKo: "일본 엔", nameEn: "Japanese Yen", decimalPlaces: 0 },
  ]) {
    await prisma.currency.upsert({
      where: { code: currency.code },
      update: currency,
      create: currency,
    });
  }

  for (const incoterm of ["EXW", "FCA", "FOB", "CFR", "CIF", "DAP", "DPU", "DDP"]) {
    await prisma.incoterm.upsert({
      where: { code_version: { code: incoterm, version: "2020" } },
      update: {},
      create: {
        code: incoterm,
        version: "2020",
        description: `Incoterms 2020 ${incoterm}`,
      },
    });
  }

  for (const service of [
    { code: "PICKUP", nameKo: "픽업", nameEn: "Pickup", defaultUnit: "SHIPMENT" as const },
    { code: "INSURANCE", nameKo: "보험", nameEn: "Insurance", defaultUnit: "SHIPMENT" as const },
    { code: "CUSTOMS", nameKo: "통관", nameEn: "Customs Clearance", defaultUnit: "SHIPMENT" as const },
    { code: "COLD_CHAIN", nameKo: "냉장·냉동", nameEn: "Cold Chain", defaultUnit: "CONTAINER_40_HC" as const },
    { code: "DANGEROUS_GOODS", nameKo: "위험물", nameEn: "Dangerous Goods", defaultUnit: "SHIPMENT" as const },
    { code: "DOCUMENTATION", nameKo: "서류 지원", nameEn: "Documentation", defaultUnit: "SHIPMENT" as const },
  ]) {
    await prisma.serviceCode.upsert({
      where: { code: service.code },
      update: service,
      create: service,
    });
  }

  assertUnique(CARRIER_SEEDS.map((carrier) => carrier.code), "carrier code");
  assertUnique(CARRIER_SEEDS.map((carrier) => carrier.scac ?? undefined), "carrier SCAC");
  assertUnique(CARRIER_SEEDS.map((carrier) => carrier.iataCode ?? undefined), "carrier IATA code");
  for (const carrier of CARRIER_SEEDS) {
    await prisma.carrier.upsert({
      where: { code: carrier.code },
      update: { ...carrier, status: "ACTIVE" },
      create: { ...carrier, status: "ACTIVE" },
    });
  }
}

function assertUnique(values: readonly (string | undefined)[], label: string) {
  const normalized = values.filter((value): value is string => Boolean(value));
  const duplicates = normalized.filter(
    (value, index) => normalized.indexOf(value) !== index,
  );
  if (duplicates.length > 0) {
    throw new Error(`Duplicate ${label}: ${[...new Set(duplicates)].join(", ")}`);
  }
}

function validateGeographySeeds() {
  if (REGION_SEEDS.length !== 7 || COUNTRY_SEEDS.length !== 24 || LOCATION_SEEDS.length !== 80) {
    throw new Error(
      `Unexpected geography seed counts: ${REGION_SEEDS.length} regions, ${COUNTRY_SEEDS.length} countries, ${LOCATION_SEEDS.length} locations`,
    );
  }

  assertUnique(REGION_SEEDS.map((region) => region.code), "region code");
  assertUnique(COUNTRY_SEEDS.map((country) => country.iso2), "country ISO2");
  assertUnique(COUNTRY_SEEDS.map((country) => country.iso3), "country ISO3");
  assertUnique(LOCATION_SEEDS.map((location) => location.code), "location code");
  assertUnique(LOCATION_SEEDS.map((location) => location.unLocode), "UN/LOCODE");
  assertUnique(LOCATION_SEEDS.map((location) => location.iataCode), "IATA code");

  const regionCodes = new Set(REGION_SEEDS.map((region) => region.code));
  const countryCodes = new Set(COUNTRY_SEEDS.map((country) => country.iso2));

  for (const country of COUNTRY_SEEDS) {
    if (!regionCodes.has(country.regionCode)) {
      throw new Error(`Unknown region ${country.regionCode} for ${country.iso2}`);
    }
  }

  for (const location of LOCATION_SEEDS) {
    if (!countryCodes.has(location.countryIso2 as (typeof COUNTRY_SEEDS)[number]["iso2"])) {
      throw new Error(`Unknown country ${location.countryIso2} for ${location.code}`);
    }
    if (location.type === "PORT" && !location.unLocode) {
      throw new Error(`PORT requires UN/LOCODE: ${location.code}`);
    }
    if (location.type === "AIRPORT" && !location.iataCode) {
      throw new Error(`AIRPORT requires IATA code: ${location.code}`);
    }
    try {
      new Intl.DateTimeFormat("en-US", { timeZone: location.timezone }).format();
    } catch {
      throw new Error(`Invalid IANA timezone ${location.timezone}: ${location.code}`);
    }
  }
}

async function seedGeography() {
  validateGeographySeeds();

  const regionIds = new Map<string, string>();
  for (const regionSeed of REGION_SEEDS) {
    const region = await prisma.region.upsert({
      where: { code: regionSeed.code },
      update: { ...regionSeed, status: "ACTIVE" },
      create: { ...regionSeed, status: "ACTIVE" },
      select: { id: true },
    });
    regionIds.set(regionSeed.code, region.id);
  }

  const countryIds = new Map<string, string>();
  for (const countrySeed of COUNTRY_SEEDS) {
    const regionId = regionIds.get(countrySeed.regionCode);
    if (!regionId) throw new Error(`Region was not seeded: ${countrySeed.regionCode}`);
    const { regionCode: _regionCode, ...countryData } = countrySeed;
    void _regionCode;
    const country = await prisma.country.upsert({
      where: { iso2: countrySeed.iso2 },
      update: { ...countryData, regionId, status: "ACTIVE" },
      create: { ...countryData, regionId, status: "ACTIVE" },
      select: { id: true },
    });
    countryIds.set(countrySeed.iso2, country.id);
  }

  for (const locationSeed of LOCATION_SEEDS) {
    const countryId = countryIds.get(locationSeed.countryIso2);
    if (!countryId) throw new Error(`Country was not seeded: ${locationSeed.countryIso2}`);
    const { countryIso2: _countryIso2, ...locationData } = locationSeed;
    void _countryIso2;
    await prisma.location.upsert({
      where: { code: locationSeed.code },
      update: { ...locationData, countryId, status: "ACTIVE" },
      create: { ...locationData, countryId, status: "ACTIVE" },
    });
  }

  assertUnique(ROUTE_SEEDS.map((route) => route.code), "route code");
  for (const routeSeed of ROUTE_SEEDS) {
    const [origin, destination] = await Promise.all([
      prisma.location.findUniqueOrThrow({ where: { code: routeSeed.originCode }, select: { id: true } }),
      prisma.location.findUniqueOrThrow({ where: { code: routeSeed.destinationCode }, select: { id: true } }),
    ]);
    const { originCode: _originCode, destinationCode: _destinationCode, ...routeData } = routeSeed;
    void _originCode;
    void _destinationCode;
    await prisma.route.upsert({
      where: { code: routeSeed.code },
      update: { ...routeData, originId: origin.id, destinationId: destination.id, status: "ACTIVE" },
      create: { ...routeData, originId: origin.id, destinationId: destination.id, status: "ACTIVE" },
    });
  }
}

async function seedBootstrapAdmin() {
  const email = process.env.SEED_ADMIN_EMAIL?.trim().toLowerCase();
  const name = process.env.SEED_ADMIN_NAME?.trim();
  const password = process.env.SEED_ADMIN_PASSWORD;

  if (!email && !name && !password) return;

  if (!email || !name || !password || password.length < 12) {
    throw new Error(
      "SEED_ADMIN_EMAIL, SEED_ADMIN_NAME and a SEED_ADMIN_PASSWORD of at least 12 characters are required together.",
    );
  }

  const role = await prisma.role.findUniqueOrThrow({
    where: { code: "system-admin" },
    select: { id: true },
  });
  const passwordHash = await hashPassword(password);

  const user = await prisma.user.upsert({
    where: { email },
    update: {
      name,
      passwordHash,
      status: "ACTIVE",
    },
    create: {
      email,
      name,
      passwordHash,
      status: "ACTIVE",
    },
  });

  await prisma.userRole.upsert({
    where: { userId_roleId: { userId: user.id, roleId: role.id } },
    update: {},
    create: { userId: user.id, roleId: role.id },
  });
}

async function main() {
  await seedAccessControl();
  await seedCodebook();
  await seedGeography();
  await seedBootstrapAdmin();
}

main()
  .then(async () => prisma.$disconnect())
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exitCode = 1;
  });
