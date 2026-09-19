import type { FastifyInstance, FastifyReply } from "fastify";
import { z } from "zod";
import {
  createSession,
  hashPassword,
  revokeSession,
  SESSION_COOKIE,
  verifyPassword,
  type SessionUser,
} from "../auth.js";
import type { Config } from "../config.js";
import { newId, nowIso } from "../db.js";
import { Errors } from "../errors.js";
import { authenticate } from "../guard.js";
import { serializeUser } from "../serialize.js";
import { emailSchema, parse } from "../validate.js";

const AUTH_RATE_LIMIT = { max: 10, timeWindow: "1 minute" } as const;

const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1).max(128),
});

const registerSchema = z.object({
  name: z.string().trim().min(2).max(80),
  email: emailSchema,
  password: z.string().min(8).max(128),
});

/** Fixed-cost hash for unknown emails — keeps login timing uniform. */
let dummyHash: string | null = null;

function setSessionCookie(
  reply: FastifyReply,
  token: string,
  expiresAt: Date,
  config: Config,
): void {
  reply.setCookie(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: config.isProd,
    path: "/api",
    expires: expiresAt,
  });
}

export async function authRoutes(app: FastifyInstance): Promise<void> {
  app.post(
    "/api/auth/register",
    { config: { rateLimit: AUTH_RATE_LIMIT } },
    async (req, reply) => {
      const body = parse(registerSchema, req.body);
      const existing = app.db
        .prepare("SELECT 1 FROM users WHERE email = ?")
        .get(body.email);
      if (existing) throw Errors.emailTaken();

      const id = newId("usr");
      app.db
        .prepare(
          `INSERT INTO users (id, email, name, password_hash, created_at)
           VALUES (?, ?, ?, ?, ?)`,
        )
        .run(id, body.email, body.name, await hashPassword(body.password), nowIso());

      const { token, expiresAt } = createSession(app.db, id, app.config.sessionTtlDays);
      setSessionCookie(reply, token, expiresAt, app.config);
      reply.status(201);
      return { user: serializeUser({ name: body.name, email: body.email }), token };
    },
  );

  app.post(
    "/api/auth/login",
    { config: { rateLimit: AUTH_RATE_LIMIT } },
    async (req, reply) => {
      const body = parse(loginSchema, req.body);
      const row = app.db
        .prepare("SELECT id, email, name, password_hash FROM users WHERE email = ?")
        .get(body.email) as
        | { id: string; email: string; name: string; password_hash: string }
        | undefined;

      if (!row) {
        dummyHash ??= await hashPassword("timing-equalizer");
        await verifyPassword(body.password, dummyHash);
        throw Errors.invalidCredentials();
      }
      if (!(await verifyPassword(body.password, row.password_hash))) {
        throw Errors.invalidCredentials();
      }

      const { token, expiresAt } = createSession(app.db, row.id, app.config.sessionTtlDays);
      setSessionCookie(reply, token, expiresAt, app.config);
      return { user: serializeUser(row), token };
    },
  );

  app.post("/api/auth/logout", { preHandler: [authenticate] }, async (req, reply) => {
    revokeSession(app.db, req.sessionToken);
    reply.clearCookie(SESSION_COOKIE, { path: "/api" });
    reply.status(204);
  });

  app.get("/api/auth/me", { preHandler: [authenticate] }, async (req) => {
    const user = req.user as SessionUser;
    return { user: serializeUser(user) };
  });
}
