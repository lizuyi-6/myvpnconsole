import { mockSubscriptions, mockUserProducts } from "@/mocks/library";
import {
  delay,
  readStorage,
  ServiceError,
  writeStorage,
} from "@/services/mock-transport";
import type { Subscription, UserProduct } from "@/types";

/**
 * Purchased AI products (credentials library).
 * Backend contract: GET /library/products, GET /library/products/:id
 */
export interface LibraryService {
  listUserProducts(): Promise<UserProduct[]>;
  getUserProduct(id: string): Promise<UserProduct>;
}

export const libraryService: LibraryService = {
  async listUserProducts() {
    await delay();
    return mockUserProducts;
  },

  async getUserProduct(id) {
    await delay(200, 400);
    const item = mockUserProducts.find((p) => p.id === id);
    if (!item) throw new ServiceError("Product not found in your library.", 404);
    return item;
  },
};

/**
 * Network subscription management.
 * Backend contract:
 *   GET  /subscriptions
 *   GET  /subscriptions/:id
 *   POST /subscriptions/:id/regenerate-link
 */
export interface SubscriptionService {
  listSubscriptions(): Promise<Subscription[]>;
  getSubscription(id: string): Promise<Subscription>;
  regenerateLink(id: string): Promise<{ subscriptionToken: string }>;
}

/** Regenerated tokens persist across refreshes in the mock. */
const TOKEN_OVERRIDES_KEY = "nova.subscription-tokens";

function withTokenOverrides(sub: Subscription): Subscription {
  const overrides = readStorage<Record<string, string>>(TOKEN_OVERRIDES_KEY, {});
  const token = overrides[sub.id];
  return token ? { ...sub, subscriptionToken: token } : sub;
}

export const subscriptionService: SubscriptionService = {
  async listSubscriptions() {
    await delay();
    return mockSubscriptions.map(withTokenOverrides);
  },

  async getSubscription(id) {
    await delay(200, 400);
    const sub = mockSubscriptions.find((s) => s.id === id);
    if (!sub) throw new ServiceError("Subscription not found.", 404);
    return withTokenOverrides(sub);
  },

  async regenerateLink(id) {
    await delay(600, 900);
    const sub = mockSubscriptions.find((s) => s.id === id);
    if (!sub) throw new ServiceError("Subscription not found.", 404);
    const subscriptionToken = crypto
      .getRandomValues(new Uint8Array(8))
      .reduce((acc, byte) => acc + byte.toString(16).padStart(2, "0"), "");
    const overrides = readStorage<Record<string, string>>(TOKEN_OVERRIDES_KEY, {});
    writeStorage(TOKEN_OVERRIDES_KEY, { ...overrides, [id]: subscriptionToken });
    return { subscriptionToken };
  },
};
