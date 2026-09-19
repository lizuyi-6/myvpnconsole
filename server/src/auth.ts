import {
  createHash,
  randomBytes,
  scrypt as scryptCb,
  timingSafeEqual,
} from "node:crypto";
import { promisify } from "node:util";
import type { Db } from "./db.js";
import { newId, nowIso } from "./db.js";

const scrypt = promisify(scryptCb) as (
  password: string,
  salt: Buffer,
  keylen: number,
  options: { N: number; r: number; p: number },
) => Promise<Buffer>;

const SCRYPT_N = 16384;
const SCRYPT_R = 8;
const SCRYPT_P = 1;
const KEY_LEN = 64;

/** Hash format: scrypt:N:r:p:<salt b64>:<key b64> — parameters travel with the hash. */
export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16);
  const key = await scrypt(password.normalize("NFKC"), salt, KEY_LEN, {
    N: SCRYPT_N,
    r: SCRYPT_R,
    p: SCRYPT_P,
  });
  return [
    "scrypt",
    SCRYPT_N,
    SCRYPT_R,
    SCRYPT_P,
    salt.toString("base64"),
    key.toString("base64"),
  ].join(":");
}

export async function verifyPassword(
  password: string,
  stored: string,
): Promise<boolean> {
  const parts = stored.split(":");
  if (parts.length !== 6 || parts[0] !== "scrypt") return false;
  const [, n, r, p, saltB64, hashB64] = parts;
  const salt = Buffer.from(saltB64, "base64");
  const expected = Buffer.from(hashB64, "base64");
  if (expected.length === 0) return false;
  const key = await scrypt(password.normalize("NFKC"), salt, expected.length, {
    N: Number(n),
    r: Number(r),
    p: Number(p),
  });
  return key.length === expected.length && timingSafeEqual(key, expected);
}

/* ---------------- Sessions ---------------- */

export const SESSION_COOKIE = "nova_session";

export function newSessionToken(): string {
  return randomBytes(32).toString("base64url");
}

function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

export interface SessionUser {
  id: string;
  email: string;
  name: string;
}

export function createSession(
  db: Db,
  userId: string,
  ttlDays: number,
): { token: string; expiresAt: Date } {
  const token = newSessionToken();
  const expiresAt = new Date(Date.now() + ttlDays * 86_400_000);
  db.prepare(
    `INSERT INTO sessions (id, user_id, token_hash, created_at, expires_at)
     VALUES (?, ?, ?, ?, ?)`,
  ).run(newId("ses"), userId, hashToken(token), nowIso(), expiresAt.toISOString());
  return { token, expiresAt };
}

/** Resolve a bearer/cookie token to its user, or null if unknown/expired/revoked. */
export function resolveSession(db: Db, token: string): SessionUser | null {
  const row = db
    .prepare(
      `SELECT s.expires_at, s.revoked_at, u.id, u.email, u.name
       FROM sessions s JOIN users u ON u.id = s.user_id
       WHERE s.token_hash = ?`,
    )
    .get(hashToken(token)) as
    | { id: string; email: string; name: string; expires_at: string; revoked_at: string | null }
    | undefined;
  if (!row || row.revoked_at) return null;
  if (Date.parse(row.expires_at) <= Date.now()) return null;
  return { id: row.id, email: row.email, name: row.name };
}

export function revokeSession(db: Db, token: string): void {
  db.prepare("UPDATE sessions SET revoked_at = ? WHERE token_hash = ?").run(
    nowIso(),
    hashToken(token),
  );
}
