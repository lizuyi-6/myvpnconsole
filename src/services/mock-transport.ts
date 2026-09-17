/**
 * Mock transport utilities.
 *
 * Services simulate network latency so UI loading states are real.
 * When the backend is ready, these helpers are replaced by an HTTP client
 * and the service function signatures stay identical.
 */

export function delay(min = 350, max = 700): Promise<void> {
  const ms = Math.floor(min + Math.random() * (max - min));
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export class ServiceError extends Error {
  constructor(
    message: string,
    public readonly status = 500,
  ) {
    super(message);
    this.name = "ServiceError";
  }
}

/** Read a JSON value from localStorage, tolerating corruption. */
export function readStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function writeStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage unavailable (private mode, quota) — fail silently for mocks.
  }
}
