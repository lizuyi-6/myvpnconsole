/**
 * Domain types shared across the app.
 * These mirror the shapes the future REST API will return.
 *
 * The product is a network access service: users open and manage a
 * subscription — they do not shop for products.
 */

/* ---------------- Plans ---------------- */

export interface Plan {
  id: string;
  durationDays: number;
  label: string;
  price: number;
}

/* ---------------- Network ---------------- */

export type RegionStatus = "available" | "degraded" | "offline";

export type RegionArea =
  | "North America"
  | "Asia Pacific"
  | "Europe"
  | "Oceania";

export interface Region {
  id: string;
  name: string;
  area: RegionArea;
  status: RegionStatus;
  latencyMs: number | null;
}

export interface NetworkStatus {
  status: "operational" | "degraded" | "outage";
  activeRegions: number;
  totalRegions: number;
  updatedAt: string;
}

/* ---------------- Subscription ---------------- */

export type SubscriptionStatus = "active" | "expired";

export interface Subscription {
  id: string;
  name: string;
  status: SubscriptionStatus;
  planLabel: string;
  expiresAt: string;
  deviceLimit: number;
  subscriptionToken: string;
}

/* ---------------- Devices ---------------- */

export type DevicePlatform =
  | "windows"
  | "macos"
  | "ios"
  | "android"
  | "linux";

export interface Device {
  id: string;
  name: string;
  platform: DevicePlatform;
  lastActiveAt: string;
}

/* ---------------- Billing ---------------- */

export type PaymentMethod = "card" | "crypto" | "balance";

export const PAYMENT_METHOD_LABELS: Record<PaymentMethod, string> = {
  card: "Credit / Debit Card",
  crypto: "Crypto",
  balance: "Balance",
};

export type PaymentStatus = "completed" | "processing" | "refunded";

export interface Payment {
  id: string;
  number: string;
  createdAt: string;
  description: string;
  amount: number;
  status: PaymentStatus;
  method: PaymentMethod;
}

export interface CreatePaymentInput {
  planId: string;
  contact: { name: string; email: string };
  paymentMethod: PaymentMethod;
  cardLast4?: string;
}

/* ---------------- Support ---------------- */

export type TicketCategory =
  | "account"
  | "connection"
  | "payment"
  | "subscription"
  | "other";

export const TICKET_CATEGORY_LABELS: Record<TicketCategory, string> = {
  account: "Account",
  connection: "Connection",
  payment: "Payment",
  subscription: "Subscription",
  other: "Other",
};

export type TicketStatus = "open" | "answered" | "closed";

export interface Ticket {
  id: string;
  subject: string;
  category: TicketCategory;
  status: TicketStatus;
  paymentNumber?: string;
  message: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTicketInput {
  subject: string;
  category: TicketCategory;
  paymentNumber?: string;
  message: string;
}

/* ---------------- Auth ---------------- */

export interface User {
  name: string;
  email: string;
}
