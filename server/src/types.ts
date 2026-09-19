/**
 * API response shapes.
 *
 * These must mirror the frontend's `src/types/index.ts` — the service layer
 * casts JSON responses to those interfaces. Customer-facing fields only:
 * supplier, cost and infrastructure identifiers never appear here.
 */

export interface PlanDto {
  id: string;
  durationDays: number;
  label: string;
  price: number;
}

export interface RegionDto {
  id: string;
  name: string;
  area: string;
  status: "available" | "degraded" | "offline";
  latencyMs: number | null;
}

export interface NetworkStatusDto {
  status: "operational" | "degraded" | "outage";
  activeRegions: number;
  totalRegions: number;
  updatedAt: string;
}

export interface SubscriptionDto {
  id: string;
  name: string;
  status: "active" | "expired";
  planLabel: string;
  expiresAt: string;
  deviceLimit: number;
  subscriptionToken: string;
}

export interface DeviceDto {
  id: string;
  name: string;
  platform: "windows" | "macos" | "ios" | "android" | "linux";
  lastActiveAt: string;
}

export interface PaymentDto {
  id: string;
  number: string;
  createdAt: string;
  description: string;
  amount: number;
  status: "completed" | "processing" | "refunded";
  method: "card" | "crypto" | "balance";
}

export interface TicketDto {
  id: string;
  subject: string;
  category: "account" | "connection" | "payment" | "subscription" | "other";
  status: "open" | "answered" | "closed";
  paymentNumber?: string;
  message: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserDto {
  name: string;
  email: string;
}
