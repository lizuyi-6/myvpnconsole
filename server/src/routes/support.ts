import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { newId, nowIso } from "../db.js";
import { authenticate } from "../guard.js";
import { serializeTicket, type TicketRow } from "../serialize.js";
import { parse } from "../validate.js";

/**
 * Validation mirrors the support form (subject ≥ 3, message ≥ 20) so a
 * failing submit is always a 4xx — the client keeps the user's draft.
 */
const createTicketSchema = z.object({
  subject: z.string().trim().min(3).max(120),
  category: z.enum(["account", "connection", "payment", "subscription", "other"]),
  paymentNumber: z.string().trim().max(40).optional(),
  message: z.string().trim().min(20).max(4000),
});

export async function supportRoutes(app: FastifyInstance): Promise<void> {
  app.get("/api/tickets", { preHandler: [authenticate] }, async (req) => {
    const rows = app.db
      .prepare("SELECT * FROM tickets WHERE user_id = ? ORDER BY updated_at DESC, id")
      .all(req.user.id) as TicketRow[];
    return rows.map(serializeTicket);
  });

  app.post("/api/tickets", { preHandler: [authenticate] }, async (req, reply) => {
    const body = parse(createTicketSchema, req.body);
    const now = nowIso();
    const id = newId("tkt");
    app.db
      .prepare(
        `INSERT INTO tickets (id, user_id, subject, category, status, payment_number, message, created_at, updated_at)
         VALUES (?, ?, ?, ?, 'open', ?, ?, ?, ?)`,
      )
      .run(
        id,
        req.user.id,
        body.subject,
        body.category,
        body.paymentNumber ?? null,
        body.message,
        now,
        now,
      );
    reply.status(201);
    const row = app.db
      .prepare("SELECT * FROM tickets WHERE id = ?")
      .get(id) as TicketRow;
    return serializeTicket(row);
  });
}
