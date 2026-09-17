import type { NetworkStatus, Region } from "@/types";

export const mockRegions: Region[] = [
  { id: "us-west", name: "United States — West", status: "available", latencyMs: 128 },
  { id: "us-east", name: "United States — East", status: "available", latencyMs: 142 },
  { id: "jp", name: "Japan", status: "available", latencyMs: 61 },
  { id: "sg", name: "Singapore", status: "available", latencyMs: 74 },
  { id: "hk", name: "Hong Kong", status: "available", latencyMs: 58 },
  { id: "de", name: "Germany", status: "available", latencyMs: 155 },
  { id: "uk", name: "United Kingdom", status: "available", latencyMs: 149 },
  { id: "au", name: "Australia", status: "available", latencyMs: 187 },
  { id: "kr", name: "South Korea", status: "degraded", latencyMs: 96 },
  { id: "nl", name: "Netherlands", status: "available", latencyMs: 151 },
];

export const mockNetworkStatus: NetworkStatus = {
  status: "operational",
  activeRegions: mockRegions.filter((r) => r.status === "available").length,
  totalRegions: mockRegions.length,
  updatedAt: new Date().toISOString(),
};
