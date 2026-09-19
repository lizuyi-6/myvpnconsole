import { api } from "@/lib/api-client";
import type { Device } from "@/types";

/**
 * Device management.
 * API: GET /devices, PATCH /devices/:id { name }, DELETE /devices/:id
 */
export interface DeviceService {
  listDevices(): Promise<Device[]>;
  renameDevice(id: string, name: string): Promise<Device>;
  removeDevice(id: string): Promise<void>;
}

export const deviceService: DeviceService = {
  listDevices() {
    return api<Device[]>("/devices");
  },

  renameDevice(id, name) {
    return api<Device>(`/devices/${encodeURIComponent(id)}`, {
      method: "PATCH",
      body: { name },
    });
  },

  removeDevice(id) {
    return api<void>(`/devices/${encodeURIComponent(id)}`, { method: "DELETE" });
  },
};
