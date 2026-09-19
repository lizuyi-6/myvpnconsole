import type { FastifyInstance } from "fastify";
import { buildApp } from "../src/app.js";

/** Fresh app backed by a private in-memory database. */
export async function makeApp(): Promise<FastifyInstance> {
  return buildApp({ configOverrides: { dbPath: ":memory:" }, logger: false });
}

let counter = 0;
export function uniqueEmail(): string {
  counter += 1;
  return `user${counter}-${Date.now().toString(36)}@test.dev`;
}

export interface TestUser {
  token: string;
  name: string;
  email: string;
  userId: string;
}

export async function registerUser(
  app: FastifyInstance,
  email = uniqueEmail(),
  password = "password-123",
): Promise<TestUser> {
  const res = await app.inject({
    method: "POST",
    url: "/api/auth/register",
    payload: { name: "Test User", email, password },
  });
  if (res.statusCode !== 201) {
    throw new Error(`registerUser failed: ${res.statusCode} ${res.body}`);
  }
  const body = res.json() as { user: { name: string; email: string }; token: string };
  const row = app.db.prepare("SELECT id FROM users WHERE email = ?").get(email) as {
    id: string;
  };
  return {
    token: body.token,
    name: body.user.name,
    email: body.user.email,
    userId: row.id,
  };
}

export interface JsonOptions {
  token?: string;
  body?: unknown;
}

export async function json<T = unknown>(
  app: FastifyInstance,
  method: string,
  url: string,
  opts: JsonOptions = {},
): Promise<{ status: number; body: T; setCookie: string | undefined }> {
  const headers: Record<string, string> = {};
  if (opts.token) headers.authorization = `Bearer ${opts.token}`;
  const res = await app.inject({
    method,
    url,
    headers,
    payload: opts.body as string | object | undefined,
  });
  const parsed =
    res.body.length > 0 ? (res.json() as T) : (undefined as unknown as T);
  return { status: res.statusCode, body: parsed, setCookie: res.headers["set-cookie"] };
}

/** Standard checkout payload for a plan. */
export function checkoutBody(planId: string, email: string): {
  planId: string;
  contact: { name: string; email: string };
  paymentMethod: "card" | "crypto" | "balance";
  cardLast4?: string;
} {
  return {
    planId,
    contact: { name: "Test User", email },
    paymentMethod: "card",
    cardLast4: "4242",
  };
}
