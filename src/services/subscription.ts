import { api } from "@/lib/api-client";
import { ServiceError } from "@/services/errors";
import type { Subscription } from "@/types";

/**
 * The user's network access subscription.
 * API:
 *   GET  /subscription
 *   POST /subscription/regenerate-link
 *   POST /billing/payments (renewal — see billing service)
 *
 * `getCurrent` resolves to null while the account has no subscription yet
 * (fresh registration) — pages render an honest empty state for that.
 */
export interface SubscriptionService {
  getCurrent(): Promise<Subscription | null>;
  regenerateLink(): Promise<{ subscriptionToken: string }>;
}

export const subscriptionService: SubscriptionService = {
  async getCurrent() {
    try {
      return await api<Subscription>("/subscription");
    } catch (err) {
      if (err instanceof ServiceError && err.status === 404) return null;
      throw err;
    }
  },

  regenerateLink() {
    return api<{ subscriptionToken: string }>("/subscription/regenerate-link", {
      method: "POST",
    });
  },
};
