import { mockDevices } from "@/mocks/subscription";
import {
  delay,
  readStorage,
  ServiceError,
  writeStorage,
} from "@/services/mock-transport";
import type { Device } from "@/types";

/**
 * Device management.
 * Backend contract:
 *   GET    /devices
 *   PATCH  /devices/:id   { name }
 *   DELETE /devices/:id
 */
export interface DeviceService {
  listDevices(): Promise<Device[]>;
  renameDevice(id: string, name: string): Promise<Device>;
  removeDevice(id: string): Promise<void>;
}

const RENAMES_KEY = "nova.device-renames";
const REMOVED_KEY = "nova.device-removed";

function effectiveDevices(): Device[] {
  const renames = readStorage<Record<string, string>>(RENAMES_KEY, {});
  const removed = new Set(readStorage<string[]>(REMOVED_KEY, []));
  return mockDevices
    .filter((d) => !removed.has(d.id))
    .map((d) => (renames[d.id] ? { ...d, name: renames[d.id] } : d));
}

export const deviceService: DeviceService = {
  async listDevices() {
    await delay(250, 450);
    return effectiveDevices();
  },

  async renameDevice(id, name) {
    await delay(300, 500);
    const device = effectiveDevices().find((d) => d.id === id);
    if (!device) throw new ServiceError("Device not found.", 404);
    const renames = readStorage<Record<string, string>>(RENAMES_KEY, {});
    writeStorage(RENAMES_KEY, { ...renames, [id]: name });
    return { ...device, name };
  },

  async removeDevice(id) {
    await delay(300, 500);
    const removed = readStorage<string[]>(REMOVED_KEY, []);
    writeStorage(REMOVED_KEY, [...removed, id]);
  },
};
