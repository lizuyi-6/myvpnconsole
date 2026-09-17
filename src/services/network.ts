import { mockNetworkStatus, mockRegions } from "@/mocks/regions";
import { delay } from "@/services/mock-transport";
import type { NetworkStatus, Region } from "@/types";

/**
 * Network information.
 * Backend contract: GET /network/status, GET /network/regions
 */
export interface NetworkService {
  getStatus(): Promise<NetworkStatus>;
  listRegions(): Promise<Region[]>;
}

export const networkService: NetworkService = {
  async getStatus() {
    await delay(200, 400);
    return mockNetworkStatus;
  },

  async listRegions() {
    await delay();
    return [...mockRegions].sort((a, b) => a.name.localeCompare(b.name));
  },
};
