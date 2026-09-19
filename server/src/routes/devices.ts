import type { FastifyInstance } from "fastify";
import { Errors } from "../errors.js";
import { authenticate } from "../guard.js";
import { serializeDevice, type DeviceRow } from "../serialize.js";
import { parse } from "../validate.js";
import { z } from "zod";

const renameSchema = z.object({ name: z.string().trim().min(1).max(40) });

export async function deviceRoutes(app: FastifyInstance): Promise<void> {
  app.get("/api/devices", { preHandler: [authenticate] }, async (req) => {
    const rows = app.db
      .prepare("SELECT * FROM devices WHERE user_id = ? ORDER BY created_at, id")
      .all(req.user.id) as DeviceRow[];
    return rows.map(serializeDevice);
  });

  app.patch("/api/devices/:id", { preHandler: [authenticate] }, async (req) => {
    const { id } = req.params as { id: string };
    const body = parse(renameSchema, req.body);
    const result = app.db
      .prepare("UPDATE devices SET name = ? WHERE id = ? AND user_id = ?")
      .run(body.name, id, req.user.id);
    if (result.changes === 0) throw Errors.notFound("Device");
    const row = app.db
      .prepare("SELECT * FROM devices WHERE id = ?")
      .get(id) as DeviceRow;
    return serializeDevice(row);
  });

  app.delete("/api/devices/:id", { preHandler: [authenticate] }, async (req, reply) => {
    const { id } = req.params as { id: string };
    const result = app.db
      .prepare("DELETE FROM devices WHERE id = ? AND user_id = ?")
      .run(id, req.user.id);
    if (result.changes === 0) throw Errors.notFound("Device");
    reply.status(204);
  });
}
