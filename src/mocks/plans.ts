import type { Plan } from "@/types";

/**
 * One service — Network Access — offered at three durations.
 * The only difference between options is time; everything else is included.
 */
export const SERVICE_NAME = "Network Access";
export const DEVICE_LIMIT = 5;

export const mockPlans: Plan[] = [
  { id: "30d", durationDays: 30, label: "30 Days", price: 6.9 },
  { id: "90d", durationDays: 90, label: "90 Days", price: 18.9 },
  { id: "365d", durationDays: 365, label: "365 Days", price: 59.9 },
];

export const INCLUDED = [
  "All available regions",
  `Up to ${DEVICE_LIMIT} devices`,
  "No traffic cap — fair-use policy",
  "Subscription link management",
  "Support on every plan",
];
