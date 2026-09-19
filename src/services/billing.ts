import { api } from "@/lib/api-client";
import type { CreatePaymentInput, Payment } from "@/types";

/**
 * Billing: payments and renewals.
 * API: GET /billing/payments, POST /billing/payments
 *
 * A successful payment activates or extends the subscription server-side.
 * Payments are simulated — no gateway is contacted.
 */
export interface BillingService {
  listPayments(): Promise<Payment[]>;
  createPayment(input: CreatePaymentInput): Promise<Payment>;
}

export const billingService: BillingService = {
  listPayments() {
    return api<Payment[]>("/billing/payments");
  },

  createPayment(input) {
    return api<Payment>("/billing/payments", { method: "POST", body: input });
  },
};
