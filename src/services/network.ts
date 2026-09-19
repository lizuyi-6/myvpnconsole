import { api } from "@/lib/api-client";
import type { NetworkStatus, Region } from "@/types";

/**
 * Network information.
 * API: GET /network/status, GET /network/regions
 */
export interface NetworkService {
  getStatus(): Promise<NetworkStatus>;
  listRegions(): Promise<Region[]>;
}

export const networkService: NetworkService = {
  getStatus() {
    return api<NetworkStatus>("/network/status");
  },

  async listRegions() {
    const regions = await api<Region[]>("/network/regions");
    return [...regions].sort((a, b) => a.name.localeCompare(b.name));
  },
};
