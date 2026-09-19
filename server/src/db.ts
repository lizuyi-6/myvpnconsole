import { randomBytes } from "node:crypto";
import { mkdirSync } from "node:fs";
import path from "node:path";
import Database from "better-sqlite3";

const SCHEMA = `
CREATE TABLE IF NOT EXISTS users (
  id            TEXT PRIMARY KEY,
  email         TEXT NOT NULL UNIQUE,
  name          TEXT NOT NULL,
  password_hash TEXT NOT NULL,
  created_at    TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS sessions (
  id         TEXT PRIMARY KEY,
  user_id    TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token_hash TEXT NOT NULL UNIQUE,
  created_at TEXT NOT NULL,
  expires_at TEXT NOT NULL,
  revoked_at TEXT
);

CREATE TABLE IF NOT EXISTS plans (
  id            TEXT PRIMARY KEY,
  duration_days INTEGER NOT NULL,
  label         TEXT NOT NULL,
  price_cents   INTEGER NOT NULL,
  device_limit  INTEGER NOT NULL,
  sort          INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS regions (
  id          TEXT PRIMARY KEY,
  name        TEXT NOT NULL,
  area        TEXT NOT NULL,
  status      TEXT NOT NULL CHECK (status IN ('available','degraded','offline')),
  latency_ms  INTEGER,
  sort        INTEGER NOT NULL,
  updated_at  TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS subscriptions (
  id                  TEXT PRIMARY KEY,
  user_id             TEXT NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  plan_id             TEXT NOT NULL REFERENCES plans(id),
  expires_at          TEXT NOT NULL,
  subscription_token  TEXT NOT NULL UNIQUE,
  created_at          TEXT NOT NULL,
  updated_at          TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS devices (
  id            TEXT PRIMARY KEY,
  user_id       TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name          TEXT NOT NULL,
  platform      TEXT NOT NULL CHECK (platform IN ('windows','macos','ios','android','linux')),
  last_active_at TEXT NOT NULL,
  created_at    TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS payments (
  id           TEXT PRIMARY KEY,
  user_id      TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  number       TEXT NOT NULL UNIQUE,
  description  TEXT NOT NULL,
  amount_cents INTEGER NOT NULL,
  status       TEXT NOT NULL CHECK (status IN ('completed','processing','refunded')),
  method       TEXT NOT NULL CHECK (method IN ('card','crypto','balance')),
  created_at   TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS tickets (
  id            TEXT PRIMARY KEY,
  user_id       TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  subject       TEXT NOT NULL,
  category      TEXT NOT NULL CHECK (category IN ('account','connection','payment','subscription','other')),
  status        TEXT NOT NULL CHECK (status IN ('open','answered','closed')),
  payment_number TEXT,
  message       TEXT NOT NULL,
  created_at    TEXT NOT NULL,
  updated_at    TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_sessions_user ON sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_devices_user ON devices(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_user ON payments(user_id);
CREATE INDEX IF NOT EXISTS idx_tickets_user ON tickets(user_id);
`;

export type Db = Database.Database;

/** URL-safe prefixed id, e.g. "dev_a8Kx3..." */
export function newId(prefix: string): string {
  return `${prefix}_${randomBytes(9).toString("base64url")}`;
}

export function nowIso(): string {
  return new Date().toISOString();
}

export function openDatabase(dbPath: string): Db {
  if (dbPath !== ":memory:") {
    mkdirSync(path.dirname(path.resolve(dbPath)), { recursive: true });
  }
  const db = new Database(dbPath);
  db.pragma("journal_mode = WAL");
  db.pragma("foreign_keys = ON");
  db.exec(SCHEMA);
  return db;
}
