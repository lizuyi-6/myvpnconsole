/**
 * Domain types shared across the app.
 * These mirror the shapes the future REST API will return.
 */

export type ProductCategory = "ai" | "network" | "bundle";

export type StockStatus = "in_stock" | "low_stock" | "out_of_stock";

export type ProductIcon =
  | "sparkles"
  | "bot"
  | "layers"
  | "code"
  | "globe"
  | "globe-2";

export interface PriceTier {
  min: number;
  /** null means "and above" */
  max: number | null;
  /** unit price in USD for the base plan */
  price: number;
}

export interface ProductPlan {
  id: string;
  label: string;
  days: number;
  /** Multiplier applied to the base (30-day) price */
  priceFactor: number;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  category: ProductCategory;
  tagline: string;
  description: string;
  icon: ProductIcon;
  /** Subtle gradient accent for the icon tile */
  accent: { from: string; to: string };
  /** Base price (USD) for the default plan */
  basePrice: number;
  plans: ProductPlan[];
  tiers: PriceTier[];
  stock: { status: StockStatus; quantity: number };
  popular?: boolean;
  /** "What you receive" bullets */
  features: string[];
  /** "Important notes" bullets */
  notes: string[];
  faq: { question: string; answer: string }[];
}

export const CATEGORY_LABELS: Record<ProductCategory, string> = {
  ai: "AI Subscription",
  network: "Network",
  bundle: "Bundle",
};

/* ---------------- Cart ---------------- */

export interface CartItem {
  productSlug: string;
  planId: string;
  quantity: number;
}

/* ---------------- Orders ---------------- */

export type PaymentMethod = "card" | "crypto" | "balance";

export type OrderStatus = "paid" | "processing" | "delivered" | "refunded";

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  paid: "Paid",
  processing: "Processing",
  delivered: "Delivered",
  refunded: "Refunded",
};

export const PAYMENT_METHOD_LABELS: Record<PaymentMethod, string> = {
  card: "Credit / Debit Card",
  crypto: "Crypto",
  balance: "Balance",
};

export interface OrderItem {
  productSlug: string;
  name: string;
  category: ProductCategory;
  planLabel: string;
  quantity: number;
  /** Price before volume discount (plan-adjusted tier-1 price) */
  listUnitPrice: number;
  /** Actual charged unit price after volume tier */
  unitPrice: number;
}

export interface Order {
  id: string;
  number: string;
  createdAt: string;
  status: OrderStatus;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  total: number;
  paymentMethod: PaymentMethod;
  contactEmail: string;
}

export interface CreateOrderInput {
  items: OrderItem[];
  contact: { name: string; email: string };
  paymentMethod: PaymentMethod;
  cardLast4?: string;
}

/* ---------------- Purchased products (user library) ---------------- */

export type UserProductStatus = "active" | "expiring" | "expired";

export const USER_PRODUCT_STATUS_LABELS: Record<UserProductStatus, string> = {
  active: "Active",
  expiring: "Expiring soon",
  expired: "Expired",
};

export interface UserProduct {
  id: string;
  productSlug: string;
  name: string;
  category: ProductCategory;
  icon: ProductIcon;
  accent: { from: string; to: string };
  status: UserProductStatus;
  expiresAt: string;
  orderNumber: string;
  credentials: { email: string; password: string };
}

/* ---------------- Network subscriptions ---------------- */

export type SubscriptionStatus = "active" | "expired";

export interface Subscription {
  id: string;
  productSlug: string;
  name: string;
  icon: ProductIcon;
  accent: { from: string; to: string };
  status: SubscriptionStatus;
  expiresAt: string;
  devicesUsed: number;
  deviceLimit: number;
  /** Token portion of the subscription URL (masked in UI) */
  subscriptionToken: string;
  regions: string[];
}

/* ---------------- Support ---------------- */

export type TicketCategory =
  | "account"
  | "subscription"
  | "payment"
  | "replacement"
  | "other";

export const TICKET_CATEGORY_LABELS: Record<TicketCategory, string> = {
  account: "Account",
  subscription: "Subscription",
  payment: "Payment",
  replacement: "Replacement",
  other: "Other",
};

export type TicketStatus = "open" | "answered" | "closed";

export const TICKET_STATUS_LABELS: Record<TicketStatus, string> = {
  open: "Open",
  answered: "Answered",
  closed: "Closed",
};

export interface Ticket {
  id: string;
  subject: string;
  category: TicketCategory;
  status: TicketStatus;
  orderNumber?: string;
  message: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTicketInput {
  subject: string;
  category: TicketCategory;
  orderNumber?: string;
  message: string;
}

/* ---------------- Auth ---------------- */

export interface User {
  name: string;
  email: string;
}

/* ---------------- Catalog filters ---------------- */

export interface ProductFilter {
  category?: ProductCategory | "all";
  planDays?: number;
  stock?: "available" | "low";
  search?: string;
}
