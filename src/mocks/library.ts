import type { Subscription, UserProduct } from "@/types";

export const mockUserProducts: UserProduct[] = [
  {
    id: "up_01",
    productSlug: "gemini-pro",
    name: "Gemini Pro",
    category: "ai",
    icon: "sparkles",
    accent: { from: "#5E6AD2", to: "#8B5CF6" },
    status: "active",
    expiresAt: "2026-10-17T09:42:00Z",
    orderNumber: "NOVA-260917-1042",
    credentials: {
      email: "alex.gemini@nova-mail.example",
      password: "Gm#kR7!vQ2eLp9",
    },
  },
  {
    id: "up_02",
    productSlug: "claude-pro",
    name: "Claude Pro",
    category: "ai",
    icon: "bot",
    accent: { from: "#D97757", to: "#B4443C" },
    status: "expiring",
    expiresAt: "2026-09-24T18:31:00Z",
    orderNumber: "NOVA-260825-0991",
    credentials: {
      email: "alex.claude@nova-mail.example",
      password: "Cl@uD3-xW82nTz",
    },
  },
  {
    id: "up_03",
    productSlug: "ai-starter-bundle",
    name: "AI Starter Bundle",
    category: "bundle",
    icon: "layers",
    accent: { from: "#4C9AFF", to: "#5E6AD2" },
    status: "expired",
    expiresAt: "2026-08-21T11:12:00Z",
    orderNumber: "NOVA-260721-1004",
    credentials: {
      email: "alex.starter@nova-mail.example",
      password: "StArT#91qkMz",
    },
  },
];

export const mockSubscriptions: Subscription[] = [
  {
    id: "sub_01",
    productSlug: "global-network",
    name: "Global Network",
    icon: "globe",
    accent: { from: "#38BDF8", to: "#5E6AD2" },
    status: "active",
    expiresAt: "2026-12-02T14:05:00Z",
    devicesUsed: 2,
    deviceLimit: 3,
    subscriptionToken: "9f2c7a1e4b6d4e8f",
    regions: ["United States", "Japan", "Singapore", "Germany"],
  },
  {
    id: "sub_02",
    productSlug: "global-network-plus",
    name: "Global Network Plus",
    icon: "globe-2",
    accent: { from: "#8B5CF6", to: "#EC4899" },
    status: "expired",
    expiresAt: "2026-07-15T08:00:00Z",
    devicesUsed: 0,
    deviceLimit: 5,
    subscriptionToken: "c41dd09a8f2b47aa",
    regions: ["United States", "Japan", "Singapore", "Germany", "United Kingdom"],
  },
];
