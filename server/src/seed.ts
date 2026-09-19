import { hashPassword } from "./auth.js";
import type { Db } from "./db.js";
import { newId, nowIso } from "./db.js";

/**
 * Idempotent seed. Runs on every boot; every insert is guarded so restarts
 * never duplicate data. The demo account mirrors the data the storefront
 * prototype shipped with, so the console looks identical to the mock era.
 *
 * Demo login: alex.chen@example.com / nova-demo-2026
 */

export const DEMO_EMAIL = "alex.chen@example.com";
export const DEMO_PASSWORD = "nova-demo-2026";

const PLANS = [
  { id: "30d", duration_days: 30, label: "30 Days", price_cents: 690, device_limit: 5, sort: 1 },
  { id: "90d", duration_days: 90, label: "90 Days", price_cents: 1890, device_limit: 5, sort: 2 },
  { id: "365d", duration_days: 365, label: "365 Days", price_cents: 5990, device_limit: 5, sort: 3 },
];

const REGIONS: {
  id: string;
  name: string;
  area: string;
  status: "available" | "degraded" | "offline";
  latency_ms: number;
}[] = [
  { id: "us-west", name: "United States — West", area: "North America", status: "available", latency_ms: 128 },
  { id: "us-east", name: "United States — East", area: "North America", status: "available", latency_ms: 142 },
  { id: "jp", name: "Japan", area: "Asia Pacific", status: "available", latency_ms: 61 },
  { id: "sg", name: "Singapore", area: "Asia Pacific", status: "available", latency_ms: 74 },
  { id: "hk", name: "Hong Kong", area: "Asia Pacific", status: "available", latency_ms: 58 },
  { id: "kr", name: "South Korea", area: "Asia Pacific", status: "degraded", latency_ms: 96 },
  { id: "au", name: "Australia", area: "Oceania", status: "available", latency_ms: 187 },
  { id: "de", name: "Germany", area: "Europe", status: "available", latency_ms: 155 },
  { id: "uk", name: "United Kingdom", area: "Europe", status: "available", latency_ms: 149 },
  { id: "nl", name: "Netherlands", area: "Europe", status: "available", latency_ms: 151 },
];

export async function seed(db: Db): Promise<void> {
  const insertPlan = db.prepare(
    `INSERT OR IGNORE INTO plans (id, duration_days, label, price_cents, device_limit, sort)
     VALUES (@id, @duration_days, @label, @price_cents, @device_limit, @sort)`,
  );
  for (const plan of PLANS) insertPlan.run(plan);

  // `updated_at` is the moment this snapshot was written — the honest value
  // for "when was region status last refreshed".
  const seededAt = nowIso();
  const insertRegion = db.prepare(
    `INSERT OR IGNORE INTO regions (id, name, area, status, latency_ms, sort, updated_at)
     VALUES (@id, @name, @area, @status, @latency_ms, @sort, @updated_at)`,
  );
  REGIONS.forEach((region, index) =>
    insertRegion.run({ ...region, sort: index + 1, updated_at: seededAt }),
  );

  const demoExists = db
    .prepare("SELECT 1 FROM users WHERE email = ?")
    .get(DEMO_EMAIL);
  if (demoExists) return;

  const userId = newId("usr");
  db.prepare(
    `INSERT INTO users (id, email, name, password_hash, created_at)
     VALUES (?, ?, ?, ?, ?)`,
  ).run(userId, DEMO_EMAIL, "Alex Chen", await hashPassword(DEMO_PASSWORD), seededAt);

  db.prepare(
    `INSERT INTO subscriptions (id, user_id, plan_id, expires_at, subscription_token, created_at, updated_at)
     VALUES (?, ?, '90d', ?, ?, ?, ?)`,
  ).run(
    newId("sub"),
    userId,
    "2026-12-02T14:05:00Z",
    "9f2c7a1e4b6d4e8f",
    seededAt,
    seededAt,
  );

  const insertDevice = db.prepare(
    `INSERT INTO devices (id, user_id, name, platform, last_active_at, created_at)
     VALUES (?, ?, ?, ?, ?, ?)`,
  );
  insertDevice.run(newId("dev"), userId, "Windows Laptop", "windows", new Date(Date.now() - 3 * 60_000).toISOString(), seededAt);
  insertDevice.run(newId("dev"), userId, "iPhone 15", "ios", new Date(Date.now() - 26 * 3_600_000).toISOString(), seededAt);

  const insertPayment = db.prepare(
    `INSERT INTO payments (id, user_id, number, description, amount_cents, status, method, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
  );
  insertPayment.run(newId("pay"), userId, "NOVA-260902-1031", "Network Access — 90 Days", 1890, "completed", "crypto", "2026-09-02T14:05:00Z");
  insertPayment.run(newId("pay"), userId, "NOVA-260721-1004", "Network Access — 30 Days", 690, "completed", "card", "2026-07-21T11:12:00Z");
  insertPayment.run(newId("pay"), userId, "NOVA-260620-0988", "Network Access — 30 Days", 690, "refunded", "card", "2026-06-20T08:44:00Z");

  const insertTicket = db.prepare(
    `INSERT INTO tickets (id, user_id, subject, category, status, payment_number, message, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
  );
  insertTicket.run(
    newId("tkt"),
    userId,
    "Slow speeds on Japan region in the evening",
    "connection",
    "answered",
    null,
    "Throughput drops to a few Mbps between 8–11pm local time on Japan. Other regions are fine.",
    "2026-09-12T07:24:00Z",
    "2026-09-12T09:10:00Z",
  );
  insertTicket.run(
    newId("tkt"),
    userId,
    "Invoice for June payment",
    "payment",
    "closed",
    "NOVA-260620-0988",
    "Could I get a PDF invoice for my June payment?",
    "2026-08-19T13:02:00Z",
    "2026-08-20T10:45:00Z",
  );
}
