import { randomBytes } from "node:crypto";
import type { FastifyInstance } from "fastify";
import type { Db } from "../db.js";
import { nowIso } from "../db.js";
import { Errors } from "../errors.js";
import { authenticate } from "../guard.js";
import {
  serializeSubscription,
  type PlanRow,
  type SubscriptionRow,
} from "../serialize.js";

export function getSubscription(
  db: Db,
  userId: string,
): { row: SubscriptionRow; plan: PlanRow } | null {
  const row = db
    .prepare(
      `SELECT s.*, p.duration_days, p.label, p.price_cents, p.device_limit, p.sort
       FROM subscriptions s JOIN plans p ON p.id = s.plan_id
       WHERE s.user_id = ?`,
    )
    .get(userId) as (SubscriptionRow & PlanRow) | undefined;
  if (!row) return null;
  const { duration_days, label, price_cents, device_limit, sort, ...sub } = row;
  return {
    row: sub as SubscriptionRow,
    plan: { duration_days, label, price_cents, device_limit, sort } as PlanRow,
  };
}

export async function subscriptionRoutes(app: FastifyInstance): Promise<void> {
  app.get("/api/subscription", { preHandler: [authenticate] }, async (req) => {
    const sub = getSubscription(app.db, req.user.id);
    if (!sub) throw Errors.noSubscription();
    return serializeSubscription(sub.row, sub.plan);
  });

  /**
   * Rotate the subscription token. The previous URL stops working for
   * clients — the UI requires explicit confirmation before calling this.
   */
  app.post(
    "/api/subscription/regenerate-link",
    { preHandler: [authenticate] },
    async (req) => {
      const sub = getSubscription(app.db, req.user.id);
      if (!sub) throw Errors.noSubscription();
      const token = randomBytes(16).toString("hex");
      app.db
        .prepare(
          "UPDATE subscriptions SET subscription_token = ?, updated_at = ? WHERE id = ?",
        )
        .run(token, nowIso(), sub.row.id);
      return { subscriptionToken: token };
    },
  );
}
