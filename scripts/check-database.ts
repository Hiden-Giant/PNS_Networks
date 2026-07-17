import { PrismaPg } from "@prisma/adapter-pg";
import { config } from "dotenv";
import { PrismaClient } from "../src/generated/prisma/client";
import { verifyPassword } from "../src/server/password";

config({ path: ".env.local", quiet: true });

const connectionString = process.env.DATABASE_URL;
const adminEmail = process.env.SEED_ADMIN_EMAIL?.toLowerCase();
const adminPassword = process.env.SEED_ADMIN_PASSWORD;

if (!connectionString || !adminEmail || !adminPassword) {
  throw new Error("Database and bootstrap admin environment values are required.");
}

const verifiedAdminEmail = adminEmail;
const verifiedAdminPassword = adminPassword;

const db = new PrismaClient({
  adapter: new PrismaPg({ connectionString }),
});

async function main() {
  const [
    users,
    roles,
    permissions,
    currencies,
    incoterms,
    services,
    carriers,
    oceanCarriers,
    airlines,
    routes,
    seaRoutes,
    airRoutes,
    regions,
    countries,
    locations,
    ports,
    airports,
    geographySamples,
    migrations,
    admin,
  ] = await Promise.all([
    db.user.count(),
    db.role.count(),
    db.permission.count(),
    db.currency.count(),
    db.incoterm.count(),
    db.serviceCode.count(),
    db.carrier.count(),
    db.carrier.count({ where: { type: "OCEAN" } }),
    db.carrier.count({ where: { type: "AIRLINE" } }),
    db.route.count(),
    db.route.count({ where: { transportMode: "SEA" } }),
    db.route.count({ where: { transportMode: "AIR" } }),
    db.region.count(),
    db.country.count(),
    db.location.count(),
    db.location.count({ where: { type: "PORT" } }),
    db.location.count({ where: { type: "AIRPORT" } }),
    db.location.findMany({
      where: { code: { in: ["PORT-KRPUS", "AIR-ICN", "PORT-NLRTM", "AIR-LAX"] } },
      orderBy: { code: "asc" },
      select: {
        code: true,
        unLocode: true,
        iataCode: true,
        timezone: true,
        country: { select: { iso2: true } },
      },
    }),
    db.$queryRaw<Array<{ count: number }>>`
      SELECT COUNT(*)::int AS count FROM "_prisma_migrations"
    `,
    db.user.findUnique({
      where: { email: verifiedAdminEmail },
      select: {
        status: true,
        passwordHash: true,
        userRoles: {
          select: { role: { select: { code: true } } },
        },
      },
    }),
  ]);

  const passwordVerified = Boolean(
    admin?.passwordHash &&
      (await verifyPassword(verifiedAdminPassword, admin.passwordHash)),
  );

  console.log({
    connected: true,
    records: {
      users,
      roles,
      permissions,
      currencies,
      incoterms,
      services,
      carriers,
      oceanCarriers,
      airlines,
      routes,
      seaRoutes,
      airRoutes,
      regions,
      countries,
      locations,
      ports,
      airports,
      migrations: migrations[0]?.count ?? 0,
    },
    geographySamples,
    admin: {
      exists: Boolean(admin),
      active: admin?.status === "ACTIVE",
      systemAdmin: Boolean(
        admin?.userRoles.some(({ role }) => role.code === "system-admin"),
      ),
      passwordVerified,
    },
  });
}

main()
  .then(async () => db.$disconnect())
  .catch(async (error) => {
    console.error(error);
    await db.$disconnect();
    process.exitCode = 1;
  });
