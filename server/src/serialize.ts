import type {
  DeviceDto,
  PaymentDto,
  PlanDto,
  RegionDto,
  SubscriptionDto,
  TicketDto,
  UserDto,
} from "./types.js";

/**
 * Row → DTO serializers. Every response goes through these whitelists —
 * internal columns (password hashes, token hashes) can never leak, and
 * supplier/procurement data simply has no path into these shapes.
 */

export interface PlanRow {
  id: string;
  duration_days: number;
  label: string;
  price_cents: number;
  device_limit: number;
  sort: number;
}

export function serializePlan(row: PlanRow): PlanDto {
  return {
    id: row.id,
    durationDays: row.duration_days,
    label: row.label,
    price: row.price_cents / 100,
  };
}

export interface RegionRow {
  id: string;
  name: string;
  area: string;
  status: "available" | "degraded" | "offline";
  latency_ms: number | null;
  sort: number;
  updated_at: string;
}

export function serializeRegion(row: RegionRow): RegionDto {
  return {
    id: row.id,
    name: row.name,
    area: row.area,
    status: row.status,
    latencyMs: row.latency_ms,
  };
}

export interface SubscriptionRow {
  id: string;
  user_id: string;
  plan_id: string;
  expires_at: string;
  subscription_token: string;
  created_at: string;
  updated_at: string;
}

export function serializeSubscription(
  row: SubscriptionRow,
  plan: PlanRow,
): SubscriptionDto {
  return {
    id: row.id,
    name: "Network Access",
    status: Date.parse(row.expires_at) > Date.now() ? "active" : "expired",
    planLabel: plan.label,
    expiresAt: row.expires_at,
    deviceLimit: plan.device_limit,
    subscriptionToken: row.subscription_token,
  };
}

export interface DeviceRow {
  id: string;
  user_id: string;
  name: string;
  platform: "windows" | "macos" | "ios" | "android" | "linux";
  last_active_at: string;
  created_at: string;
}

export function serializeDevice(row: DeviceRow): DeviceDto {
  return {
    id: row.id,
    name: row.name,
    platform: row.platform,
    lastActiveAt: row.last_active_at,
  };
}

export interface PaymentRow {
  id: string;
  user_id: string;
  number: string;
  description: string;
  amount_cents: number;
  status: "completed" | "processing" | "refunded";
  method: "card" | "crypto" | "balance";
  created_at: string;
}

export function serializePayment(row: PaymentRow): PaymentDto {
  return {
    id: row.id,
    number: row.number,
    createdAt: row.created_at,
    description: row.description,
    amount: row.amount_cents / 100,
    status: row.status,
    method: row.method,
  };
}

export interface TicketRow {
  id: string;
  user_id: string;
  subject: string;
  category: "account" | "connection" | "payment" | "subscription" | "other";
  status: "open" | "answered" | "closed";
  payment_number: string | null;
  message: string;
  created_at: string;
  updated_at: string;
}

export function serializeTicket(row: TicketRow): TicketDto {
  return {
    id: row.id,
    subject: row.subject,
    category: row.category,
    status: row.status,
    paymentNumber: row.payment_number ?? undefined,
    message: row.message,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function serializeUser(row: {
  name: string;
  email: string;
}): UserDto {
  return { name: row.name, email: row.email };
}
