import { ServiceError } from "@/services/errors";

/**
 * Thin fetch client for the NOVA API.
 *
 * Same-origin by design: in development Vite proxies /api to the API server,
 * in production the API serves the built SPA — CORS is never involved.
 * Auth travels as a Bearer token; the API also sets a backup session cookie.
 */

const BASE = "/api";

/** Fired when the API rejects our token (expired/revoked session). */
export const UNAUTHORIZED_EVENT = "nova:unauthorized";

let authToken: string | null = null;

export function setAuthToken(token: string | null): void {
  authToken = token;
}

interface ApiOptions {
  method?: string;
  body?: unknown;
}

interface ErrorEnvelope {
  error?: { code?: string; message?: string };
}

export async function api<T>(path: string, opts: ApiOptions = {}): Promise<T> {
  let res: Response;
  try {
    res = await fetch(BASE + path, {
      method: opts.method ?? "GET",
      headers: {
        ...(opts.body !== undefined ? { "content-type": "application/json" } : {}),
        ...(authToken ? { authorization: `Bearer ${authToken}` } : {}),
      },
      body: opts.body !== undefined ? JSON.stringify(opts.body) : undefined,
    });
  } catch {
    throw new ServiceError(
      "Network error. Please check your connection and try again.",
      0,
    );
  }

  if (res.status === 204) {
    return undefined as T;
  }

  let data: unknown = null;
  try {
    data = await res.json();
  } catch {
    // Empty or non-JSON body — handled by the status check below.
  }

  if (!res.ok) {
    if (res.status === 401) {
      window.dispatchEvent(new Event(UNAUTHORIZED_EVENT));
    }
    throw new ServiceError(
      (data as ErrorEnvelope | null)?.error?.message ?? `Request failed (${res.status}).`,
      res.status,
    );
  }

  return data as T;
}
