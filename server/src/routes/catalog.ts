import type { FastifyInstance } from "fastify";
import { Errors } from "../errors.js";
import { serializePlan, serializeRegion, type PlanRow, type RegionRow } from "../serialize.js";

export async function catalogRoutes(app: FastifyInstance): Promise<void> {
  app.get("/api/health", async () => ({ status: "ok" }));

  app.get("/api/plans", async () => {
    const rows = app.db
      .prepare("SELECT * FROM plans ORDER BY sort")
      .all() as PlanRow[];
    return rows.map(serializePlan);
  });

  app.get("/api/plans/:id", async (req) => {
    const { id } = req.params as { id: string };
    const row = app.db
      .prepare("SELECT * FROM plans WHERE id = ?")
      .get(id) as PlanRow | undefined;
    if (!row) throw Errors.notFound("Plan");
    return serializePlan(row);
  });

  app.get("/api/network/regions", async () => {
    const rows = app.db
      .prepare("SELECT * FROM regions ORDER BY name COLLATE NOCASE")
      .all() as RegionRow[];
    return rows.map(serializeRegion);
  });

  app.get("/api/network/status", async () => {
    const rows = app.db
      .prepare("SELECT status, updated_at FROM regions")
      .all() as { status: string; updated_at: string }[];
    const statuses = rows.map((r) => r.status);
    const aggregate = statuses.includes("offline")
      ? "outage"
      : statuses.includes("degraded")
        ? "degraded"
        : "operational";
    return {
      status: aggregate,
      activeRegions: statuses.filter((s) => s === "available").length,
      totalRegions: rows.length,
      // Honest value: the moment the region snapshot was last written.
      updatedAt: rows.reduce(
        (latest, r) => (r.updated_at > latest ? r.updated_at : latest),
        rows[0]?.updated_at ?? new Date().toISOString(),
      ),
    };
  });
}
