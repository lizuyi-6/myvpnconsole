import { mockSubscription } from "@/mocks/subscription";
import { DEVICE_LIMIT } from "@/mocks/plans";
import {
  delay,
  readStorage,
  writeStorage,
} from "@/services/mock-transport";
import type { Subscription } from "@/types";

/**
 * The user's network access subscription.
 * Backend contract:
 *   GET  /subscription
 *   POST /subscription/regenerate-link
 *   POST /subscription/renew   (initiated through billing.createPayment)
 */
export interface SubscriptionService {
  getCurrent(): Promise<Subscription>;
  regenerateLink(): Promise<{ subscriptionToken: string }>;
}

/** Local overrides so mock mutations survive refreshes. */
const OVERRIDE_KEY = "nova.subscription-override";

interface SubscriptionOverride {
  subscriptionToken?: string;
  expiresAt?: string;
  planLabel?: string;
}

function current(): Subscription {
  const override = readStorage<SubscriptionOverride>(OVERRIDE_KEY, {});
  return {
    ...mockSubscription,
    ...override,
    deviceLimit: DEVICE_LIMIT,
  };
}

/** Synchronous read of the effective expiry — used when applying renewals. */
export function getEffectiveExpiry(): string {
  return current().expiresAt;
}

export function applyPurchaseOverride(expiresAt: string, planLabel: string) {
  const override = readStorage<SubscriptionOverride>(OVERRIDE_KEY, {});
  writeStorage(OVERRIDE_KEY, { ...override, expiresAt, planLabel });
}

export const subscriptionService: SubscriptionService = {
  async getCurrent() {
    await delay(250, 450);
    return current();
  },

  async regenerateLink() {
    await delay(600, 900);
    const subscriptionToken = crypto
      .getRandomValues(new Uint8Array(8))
      .reduce((acc, byte) => acc + byte.toString(16).padStart(2, "0"), "");
    const override = readStorage<SubscriptionOverride>(OVERRIDE_KEY, {});
    writeStorage(OVERRIDE_KEY, { ...override, subscriptionToken });
    return { subscriptionToken };
  },
};
