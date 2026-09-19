import { resolveSession, SESSION_COOKIE } from "./auth.js";
import { Errors } from "./errors.js";
import type { FastifyReply, FastifyRequest } from "fastify";

/**
 * Auth guard. Accepts either an Authorization: Bearer token (SPA) or the
 * httpOnly session cookie. Unknown, expired or revoked tokens → 401.
 */
export async function authenticate(
  req: FastifyRequest,
  _reply: FastifyReply,
): Promise<void> {
  const header = req.headers.authorization;
  const bearer = header?.startsWith("Bearer ") ? header.slice(7).trim() : null;
  const token = bearer ?? req.cookies[SESSION_COOKIE] ?? null;
  if (!token) throw Errors.unauthorized();

  const user = resolveSession(req.server.db, token);
  if (!user) throw Errors.unauthorized();

  req.user = user;
  req.sessionToken = token;
}
