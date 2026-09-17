import { mockPlans, SERVICE_NAME } from "@/mocks/plans";
import { mockPayments } from "@/mocks/payments";
import {
  applyPurchaseOverride,
  getEffectiveExpiry,
} from "@/services/subscription";
import {
  delay,
  readStorage,
  ServiceError,
  writeStorage,
} from "@/services/mock-transport";
import type { CreatePaymentInput, Payment } from "@/types";

/**
 * Billing: payments and renewals.
 * Backend contract: GET /billing/payments, POST /billing/payments
 *
 * A successful payment activates or extends the subscription.
 * Mock-created payments persist in localStorage.
 */
export interface BillingService {
  listPayments(): Promise<Payment[]>;
  createPayment(input: CreatePaymentInput): Promise<Payment>;
}

const CREATED_KEY = "nova.created-payments";

function generatePaymentNumber(): string {
  const now = new Date();
  const yy = String(now.getFullYear()).slice(2);
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const dd = String(now.getDate()).padStart(2, "0");
  const seq = String(Math.floor(1000 + Math.random() * 9000));
  return `NOVA-${yy}${mm}${dd}-${seq}`;
}

function allPayments(): Payment[] {
  const created = readStorage<Payment[]>(CREATED_KEY, []);
  return [...created, ...mockPayments].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
}

export const billingService: BillingService = {
  async listPayments() {
    await delay();
    return allPayments();
  },

  async createPayment(input) {
    // Simulates payment processing
    await delay(1000, 1300);

    const plan = mockPlans.find((p) => p.id === input.planId);
    if (!plan) throw new ServiceError("Plan not found.", 400);

    // Extend from current expiry when still active, otherwise from now.
    const now = Date.now();
    const currentExpiry = new Date(getEffectiveExpiry()).getTime();
    const base = currentExpiry > now ? currentExpiry : now;
    const newExpiry = new Date(
      base + plan.durationDays * 86_400_000,
    ).toISOString();
    applyPurchaseOverride(newExpiry, plan.label);

    const payment: Payment = {
      id: `pay_${Date.now().toString(36)}`,
      number: generatePaymentNumber(),
      createdAt: new Date().toISOString(),
      description: `${SERVICE_NAME} — ${plan.label}`,
      amount: plan.price,
      status: "completed",
      method: input.paymentMethod,
    };

    const created = readStorage<Payment[]>(CREATED_KEY, []);
    writeStorage(CREATED_KEY, [payment, ...created]);
    return payment;
  },
};
