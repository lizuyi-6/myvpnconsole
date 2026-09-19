import path from "node:path";

function intEnv(name: string, fallback: number): number {
  const raw = process.env[name];
  if (!raw) return fallback;
  const value = Number.parseInt(raw, 10);
  return Number.isFinite(value) ? value : fallback;
}

export interface Config {
  port: number;
  host: string;
  /** SQLite file path. Use ":memory:" for tests. */
  dbPath: string;
  /** Directory of the built SPA to serve, or null for API-only mode. */
  webRoot: string | null;
  sessionTtlDays: number;
  isProd: boolean;
}

export function loadConfig(overrides: Partial<Config> = {}): Config {
  return {
    port: overrides.port ?? intEnv("PORT", 8787),
    host: overrides.host ?? process.env.HOST ?? "127.0.0.1",
    dbPath:
      overrides.dbPath ?? process.env.DB_PATH ?? path.resolve("data/nova.db"),
    webRoot:
      overrides.webRoot !== undefined
        ? overrides.webRoot
        : process.env.WEB_ROOT
          ? path.resolve(process.env.WEB_ROOT)
          : null,
    sessionTtlDays: overrides.sessionTtlDays ?? intEnv("SESSION_TTL_DAYS", 30),
    isProd: overrides.isProd ?? process.env.NODE_ENV === "production",
  };
}
