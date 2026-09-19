import { existsSync, statSync } from "node:fs";
import cookie from "@fastify/cookie";
import rateLimit from "@fastify/rate-limit";
import fastifyStatic from "@fastify/static";
import Fastify, { type FastifyInstance, type FastifyReply } from "fastify";
import type { SessionUser } from "./auth.js";
import { loadConfig, type Config } from "./config.js";
import { openDatabase, type Db } from "./db.js";
import { AppError } from "./errors.js";
import { authRoutes } from "./routes/auth.js";
import { billingRoutes } from "./routes/billing.js";
import { catalogRoutes } from "./routes/catalog.js";
import { deviceRoutes } from "./routes/devices.js";
import { subscriptionRoutes } from "./routes/subscription.js";
import { supportRoutes } from "./routes/support.js";
import { seed } from "./seed.js";
import { ZodError } from "zod";

export interface BuildOptions {
  configOverrides?: Partial<Config>;
  /** Skip seeding (tests that seed their own fixtures). */
  seed?: boolean;
  logger?: boolean;
}

function errorHandler(
  err: unknown,
  req: { log: { error: (err: unknown) => void } },
  reply: {
    status: (code: number) => { send: (body: unknown) => void };
  },
): void {
  if (err instanceof AppError) {
    reply.status(err.status).send({ error: { code: err.code, message: err.message } });
    return;
  }
  if (err instanceof ZodError) {
    reply.status(400).send({
      error: { code: "VALIDATION", message: "Invalid request body." },
    });
    return;
  }
  // Rate limits, body-parser errors and other fastify 4xx keep their status.
  const anyErr = err as { statusCode?: number; code?: string; message?: string };
  if (
    typeof anyErr.statusCode === "number" &&
    anyErr.statusCode >= 400 &&
    anyErr.statusCode < 500
  ) {
    reply.status(anyErr.statusCode).send({
      error: {
        code: anyErr.statusCode === 429 ? "RATE_LIMITED" : "BAD_REQUEST",
        message: anyErr.message ?? "Bad request.",
      },
    });
    return;
  }
  req.log.error(err);
  reply.status(500).send({
    error: { code: "INTERNAL", message: "Internal server error." },
  });
}

export async function buildApp(opts: BuildOptions = {}): Promise<FastifyInstance> {
  const config = loadConfig(opts.configOverrides);
  const db: Db = openDatabase(config.dbPath);
  if (opts.seed !== false) await seed(db);

  const app = Fastify({ logger: opts.logger ?? true });
  app.decorate("db", db);
  app.decorate("config", config);
  app.decorateRequest("user", null as unknown as SessionUser);
  app.decorateRequest("sessionToken", null as unknown as string);

  await app.register(cookie);
  await app.register(rateLimit, { global: false });

  app.setErrorHandler(errorHandler);

  const apiNotFound = (reply: FastifyReply): void => {
    reply.status(404).send({ error: { code: "NOT_FOUND", message: "Route not found." } });
  };

  // Production: serve the built SPA from the same process. In development
  // Vite proxies /api here instead, so no CORS is ever involved.
  if (config.webRoot && existsSync(config.webRoot) && statSync(config.webRoot).isDirectory()) {
    await app.register(fastifyStatic, { root: config.webRoot });
    app.setNotFoundHandler((req, reply) => {
      if (req.raw.url?.startsWith("/api/")) {
        apiNotFound(reply);
        return;
      }
      return reply.sendFile("index.html");
    });
  } else {
    app.setNotFoundHandler((_req, reply) => apiNotFound(reply));
  }

  await app.register(authRoutes);
  await app.register(catalogRoutes);
  await app.register(subscriptionRoutes);
  await app.register(deviceRoutes);
  await app.register(billingRoutes);
  await app.register(supportRoutes);

  app.addHook("onClose", async () => {
    db.close();
  });

  return app;
}
