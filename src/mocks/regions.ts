import type { NetworkStatus, Region } from "@/types";

export const mockRegions: Region[] = [
  { id: "us-west", name: "United States — West", area: "North America", status: "available", latencyMs: 128 },
  { id: "us-east", name: "United States — East", area: "North America", status: "available", latencyMs: 142 },
  { id: "jp", name: "Japan", area: "Asia Pacific", status: "available", latencyMs: 61 },
  { id: "sg", name: "Singapore", area: "Asia Pacific", status: "available", latencyMs: 74 },
  { id: "hk", name: "Hong Kong", area: "Asia Pacific", status: "available", latencyMs: 58 },
  { id: "kr", name: "South Korea", area: "Asia Pacific", status: "degraded", latencyMs: 96 },
  { id: "au", name: "Australia", area: "Oceania", status: "available", latencyMs: 187 },
  { id: "de", name: "Germany", area: "Europe", status: "available", latencyMs: 155 },
  { id: "uk", name: "United Kingdom", area: "Europe", status: "available", latencyMs: 149 },
  { id: "nl", name: "Netherlands", area: "Europe", status: "available", latencyMs: 151 },
];

export const mockNetworkStatus: NetworkStatus = {
  status: "operational",
  activeRegions: mockRegions.filter((r) => r.status === "available").length,
  totalRegions: mockRegions.length,
  updatedAt: new Date().toISOString(),
};
