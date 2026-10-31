const fs = require("node:fs");
const path = require("node:path");

const DEMO_NOTE = "[demo]";
const DEMO_USER_CLERK_ID = "demo-seed-user";
const DEMO_USER_EMAIL = "demo-seed@ignite.local";

const DEMO_CARS = [
  ["demo-car-01", "Porsche", "911 Carrera", 2023, 189000, 4200, "Black", "Petrol", "Automatic", "Coupe", "AVAILABLE", true],
  ["demo-car-02", "Lamborghini", "Urus", 2024, 248000, 1800, "Yellow", "Petrol", "Automatic", "SUV", "AVAILABLE", true],
  ["demo-car-03", "BMW", "M3", 2022, 82000, 12000, "Blue", "Petrol", "Automatic", "Sedan", "SOLD", false],
  ["demo-car-04", "Mercedes-Benz", "C-Class", 2021, 46000, 22000, "White", "Petrol", "Automatic", "Sedan", "UNAVAILABLE", false],
  ["demo-car-05", "Honda", "Civic", 2020, 24000, 31000, "Grey", "Petrol", "Manual", "Hatchback", "AVAILABLE", false],
  ["demo-car-06", "Toyota", "Supra", 2023, 58000, 6400, "Red", "Petrol", "Automatic", "Coupe", "AVAILABLE", true],
  ["demo-car-07", "Audi", "A5 Cabriolet", 2019, 39000, 28000, "Silver", "Petrol", "Automatic", "Convertible", "SOLD", false],
  ["demo-car-08", "Ford", "Ranger", 2022, 41000, 19000, "Green", "Diesel", "Automatic", "Pickup", "AVAILABLE", false],
];

function fail(message) {
  console.error(message);
  process.exit(1);
}

function loadEnvLocal() {
  const file = path.join(process.cwd(), ".env.local");
  if (!fs.existsSync(file)) {
    fail("Refusing to run: .env.local was not found. No database was touched.");
  }
  const text = fs.readFileSync(file, "utf8");
  for (const line of text.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq < 1) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (key === "DATABASE_URL" || key === "DIRECT_URL") process.env[key] = value;
  }
}

function assertLocalDatabase() {
  if (process.env.NODE_ENV === "production") {
    fail("Refusing to run: NODE_ENV is production.");
  }
  loadEnvLocal();
  const raw = process.env.DATABASE_URL;
  if (!raw) fail("Refusing to run: DATABASE_URL is missing from .env.local.");
  let host = "";
  try {
    host = new URL(raw).hostname;
  } catch {
    fail("Refusing to run: DATABASE_URL in .env.local is not a valid URL.");
  }
  console.log(`Database host: ${host}`);
  const local = host === "localhost" || host === "127.0.0.1" || host === "::1";
  if (!local) fail(`Refusing to run: ${host} is not a local dev database.`);
  if (!process.env.DIRECT_URL) process.env.DIRECT_URL = raw;
}

function dayOffset(daysAgo) {
  const date = new Date();
  date.setUTCHours(12, 0, 0, 0);
  date.setUTCDate(date.getUTCDate() - daysAgo);
  return date;
}

async function removeDemo(db) {
  const bookings = await db.testDriveBooking.deleteMany({
    where: { notes: { startsWith: DEMO_NOTE } },
  });
  const cars = await db.car.deleteMany({
    where: { id: { startsWith: "demo-car-" } },
  });
  const users = await db.user.deleteMany({
    where: { clerkUserId: DEMO_USER_CLERK_ID },
  });
  console.log(
    `Removed demo rows: ${bookings.count} bookings, ${cars.count} cars, ${users.count} users.`
  );
}

async function ensureInventory(db) {
  const existing = await db.car.findMany({
    select: { id: true, make: true, bodyType: true, status: true },
  });
  const makes = new Set(existing.map((car) => car.make));
  const bodies = new Set(existing.map((car) => car.bodyType));
  const statuses = new Set(existing.map((car) => car.status));
  const needsMore =
    makes.size < 4 || bodies.size < 4 || !statuses.has("SOLD") || !statuses.has("UNAVAILABLE");

  if (!needsMore) return existing;

  for (const row of DEMO_CARS) {
    const [id, make, model, year, price, mileage, color, fuelType, transmission, bodyType, status, featured] = row;
    await db.car.upsert({
      where: { id },
      update: {},
      create: {
        id,
        make,
        model,
        year,
        price,
        mileage,
        color,
        fuelType,
        transmission,
        bodyType,
        seats: 4,
        description: `${DEMO_NOTE} ${year} ${make} ${model}`,
        status,
        featured,
        images: [],
      },
    });
  }
  return db.car.findMany({ select: { id: true } });
}

async function seed(db) {
  await removeDemo(db);
  const cars = await ensureInventory(db);
  if (!cars.length) fail("No cars available to attach demo bookings.");

  let user = await db.user.findFirst({ orderBy: { createdAt: "asc" } });
  let createdUser = false;
  if (!user || user.clerkUserId === DEMO_USER_CLERK_ID) {
    user = await db.user.upsert({
      where: { clerkUserId: DEMO_USER_CLERK_ID },
      update: {},
      create: {
        clerkUserId: DEMO_USER_CLERK_ID,
        email: DEMO_USER_EMAIL,
        name: `${DEMO_NOTE} Seed User`,
        role: "USER",
      },
    });
    createdUser = true;
  }

  const statuses = ["PENDING", "CONFIRMED", "COMPLETED", "CANCELLED", "NO_SHOW"];
  const bookings = [];
  for (let i = 0; i < 48; i += 1) {
    const daysAgo = Math.round((i / 47) * 89);
    const when = dayOffset(daysAgo);
    const car = cars[i % cars.length];
    const status = statuses[i % statuses.length];
    bookings.push({
      carId: car.id,
      userId: user.id,
      bookingDate: when,
      startTime: "10:00",
      endTime: "11:00",
      status,
      notes: `${DEMO_NOTE} booking ${String(i + 1).padStart(2, "0")}`,
      createdAt: when,
    });
  }
  await db.testDriveBooking.createMany({ data: bookings });
  console.log(
    `Inserted ${bookings.length} demo bookings across ${cars.length} cars` +
      `${createdUser ? " and a demo user" : " on an existing user"}.`
  );
}

async function main() {
  assertLocalDatabase();
  const { PrismaClient } = require("../lib/generated/prisma");
  const db = new PrismaClient();
  try {
    if (process.argv.includes("--remove")) await removeDemo(db);
    else await seed(db);
  } finally {
    await db.$disconnect();
  }
}

main().catch((error) => {
  console.error(error.message || error);
  process.exit(1);
});
