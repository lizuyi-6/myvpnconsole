import type { FastifyInstance, FastifyRequest } from "fastify";
import type { SessionUser } from "./auth.js";
import type { Config } from "./config.js";
import type { Db } from "./db.js";

declare module "fastify" {
  interface FastifyInstance {
    db: Db;
    config: Config;
  }

  interface FastifyRequest {
    /** Set by the authenticate preHandler. */
    user: SessionUser;
    /** Raw session token — needed by logout to revoke server-side. */
    sessionToken: string;
  }
}
