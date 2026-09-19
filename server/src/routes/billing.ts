import { randomBytes } from "node:crypto";
import type { FastifyInstance } from "fastify";
import type { Db } from "../db.js";
import { newId, nowIso } from "../db.js";
import { Errors } from "../errors.js";
import { authenticate } from "../guard.js";
import { getSubscription } from "./subscription.js";
import { serializePayment, type PaymentRow, type PlanRow } from "../serialize.js";
import { emailSchema, parse } from "../validate.js";
import { z } from "zod";

/**
 * Payments are SIMULATED — no gateway is contacted. A "completed" payment
 * activates or extends the subscription, mirroring the storefront mock.
 */
const createPaymentSchema = z.object({
  planId: z.string().min(1).max(20),
  contact: z.object({
    name: z.string().trim().min(2).max(80),
    email: emailSchema,
  }),
  paymentMethod: z.enum(["card", "crypto", "balance"]),
  cardLast4: z
    .string()
    .regex(/^\d{4}$/)
    .optional(),
});

/** NOVA-YYMMDD-#### with a per-day sequence — unique via the UNIQUE index. */
function nextPaymentNumber(db: Db): string {
  const d = new Date();
  const stamp = [
    String(d.getUTCFullYear()).slice(2),
    String(d.getUTCMonth() + 1).padStart(2, "0"),
    String(d.getUTCDate()).padStart(2, "0"),
  ].join("");
  const prefix = `NOVA-${stamp}-`;
  const row = db
    .prepare(
      `SELECT COALESCE(MAX(CAST(SUBSTR(number, -4) AS INTEGER)), 1000) AS max
       FROM payments WHERE number LIKE ?`,
    )
    .get(`${prefix}%`) as { max: number };
  return `${prefix}${String(row.max + 1).padStart(4, "0")}`;
}

export async function billingRoutes(app: FastifyInstance): Promise<void> {
  app.get("/api/billing/payments", { preHandler: [authenticate] }, async (req) => {
    const rows = app.db
      .prepare(
        "SELECT * FROM payments WHERE user_id = ? ORDER BY created_at DESC, id",
      )
      .all(req.user.id) as PaymentRow[];
    return rows.map(serializePayment);
  });

  app.post(
    "/api/billing/payments",
    { preHandler: [authenticate] },
    async (req, reply) => {
      const body = parse(createPaymentSchema, req.body);
      const plan = app.db
        .prepare("SELECT * FROM plans WHERE id = ?")
        .get(body.planId) as PlanRow | undefined;
      if (!plan) throw Errors.badPlan();

      const paymentId = app.db.transaction((): string => {
        const id = newId("pay");
        app.db
          .prepare(
            `INSERT INTO payments (id, user_id, number, description, amount_cents, status, method, created_at)
             VALUES (?, ?, ?, ?, ?, 'completed', ?, ?)`,
          )
          .run(
            id,
            req.user.id,
            nextPaymentNumber(app.db),
            `Network Access — ${plan.label}`,
            plan.price_cents,
            body.paymentMethod,
            nowIso(),
          );

        // Extend from the current expiry while still active, else from now.
        const now = Date.now();
        const existing = getSubscription(app.db, req.user.id);
        const base =
          existing && Date.parse(existing.row.expires_at) > now
            ? Date.parse(existing.row.expires_at)
            : now;
        const expiresAt = new Date(
          base + plan.duration_days * 86_400_000,
        ).toISOString();

        if (existing) {
          app.db
            .prepare(
              `UPDATE subscriptions
               SET plan_id = ?, expires_at = ?, updated_at = ? WHERE id = ?`,
            )
            .run(plan.id, expiresAt, nowIso(), existing.row.id);
        } else {
          app.db
            .prepare(
              `INSERT INTO subscriptions (id, user_id, plan_id, expires_at, subscription_token, created_at, updated_at)
               VALUES (?, ?, ?, ?, ?, ?, ?)`,
            )
            .run(
              newId("sub"),
              req.user.id,
              plan.id,
              expiresAt,
              randomBytes(16).toString("hex"),
              nowIso(),
              nowIso(),
            );
        }
        return id;
      })();

      reply.status(201);
      const row = app.db
        .prepare("SELECT * FROM payments WHERE id = ?")
        .get(paymentId) as PaymentRow;
      return serializePayment(row);
    },
  );
}
