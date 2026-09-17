import type { Device, Subscription } from "@/types";

export const mockSubscription: Subscription = {
  id: "sub_01",
  name: "Network Access",
  status: "active",
  planLabel: "90 Days",
  expiresAt: "2026-12-02T14:05:00Z",
  deviceLimit: 5,
  subscriptionToken: "9f2c7a1e4b6d4e8f",
};

export const mockDevices: Device[] = [
  {
    id: "dev_01",
    name: "Windows Laptop",
    platform: "windows",
    lastActiveAt: new Date(Date.now() - 3 * 60_000).toISOString(),
  },
  {
    id: "dev_02",
    name: "iPhone 15",
    platform: "ios",
    lastActiveAt: new Date(Date.now() - 26 * 3_600_000).toISOString(),
  },
];
