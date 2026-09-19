import assert from "node:assert/strict";
import { test } from "node:test";
import { json, makeApp } from "./helpers.js";

test("GET /api/plans returns the three durations in order, exact shape", async () => {
  const app = await makeApp();
  const res = await json<
    { id: string; durationDays: number; label: string; price: number }[]
  >(app, "GET", "/api/plans");

  assert.equal(res.status, 200);
  assert.deepEqual(
    res.body.map((p) => [p.id, p.durationDays, p.label, p.price]),
    [
      ["30d", 30, "30 Days", 6.9],
      ["90d", 90, "90 Days", 18.9],
      ["365d", 365, "365 Days", 59.9],
    ],
  );
  for (const plan of res.body) {
    assert.deepEqual(Object.keys(plan).sort(), ["durationDays", "id", "label", "price"]);
  }
  await app.close();
});

test("GET /api/plans/:id works and 404s for unknown ids", async () => {
  const app = await makeApp();
  const ok = await json(app, "GET", "/api/plans/90d");
  assert.equal(ok.status, 200);

  const missing = await json<{ error: { code: string } }>(app, "GET", "/api/plans/nope");
  assert.equal(missing.status, 404);
  assert.equal(missing.body.error.code, "NOT_FOUND");
  await app.close();
});

test("GET /api/network/regions returns all regions, name-sorted, valid statuses", async () => {
  const app = await makeApp();
  const res = await json<
    {
      id: string;
      name: string;
      area: string;
      status: string;
      latencyMs: number | null;
    }[]
  >(app, "GET", "/api/network/regions");

  assert.equal(res.status, 200);
  assert.equal(res.body.length, 10);
  const names = res.body.map((r) => r.name);
  const sorted = [...names].sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));
  assert.deepEqual(names, sorted);
  for (const region of res.body) {
    assert.deepEqual(Object.keys(region).sort(), [
      "area",
      "id",
      "latencyMs",
      "name",
      "status",
    ]);
    assert.ok(["available", "degraded", "offline"].includes(region.status));
    assert.ok(region.latencyMs === null || typeof region.latencyMs === "number");
  }
  await app.close();
});

test("GET /api/network/status aggregates honestly from region data", async () => {
  const app = await makeApp();
  const res = await json<{
    status: string;
    activeRegions: number;
    totalRegions: number;
    updatedAt: string;
  }>(app, "GET", "/api/network/status");

  assert.equal(res.status, 200);
  assert.equal(res.body.status, "degraded"); // South Korea is seeded degraded
  assert.equal(res.body.activeRegions, 9);
  assert.equal(res.body.totalRegions, 10);
  assert.ok(!Number.isNaN(Date.parse(res.body.updatedAt)));
  await app.close();
});

test("health and unknown API routes", async () => {
  const app = await makeApp();
  const health = await json(app, "GET", "/api/health");
  assert.deepEqual(health.body, { status: "ok" });

  const missing = await json<{ error: { code: string } }>(app, "GET", "/api/nope");
  assert.equal(missing.status, 404);
  assert.equal(missing.body.error.code, "NOT_FOUND");
  await app.close();
});
