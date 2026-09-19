import assert from "node:assert/strict";
import { test } from "node:test";
import { nowIso } from "../src/db.js";
import { checkoutBody, json, makeApp, registerUser } from "./helpers.js";

const DAY = 86_400_000;

test("fresh account has no subscription — 404 NO_SUBSCRIPTION", async () => {
  const app = await makeApp();
  const user = await registerUser(app);

  const res = await json<{ error: { code: string } }>(app, "GET", "/api/subscription", {
    token: user.token,
  });
  assert.equal(res.status, 404);
  assert.equal(res.body.error.code, "NO_SUBSCRIPTION");

  const regen = await json(app, "POST", "/api/subscription/regenerate-link", {
    token: user.token,
  });
  assert.equal(regen.status, 404);
  await app.close();
});

test("checkout creates an active 30-day subscription and a completed payment", async () => {
  const app = await makeApp();
  const user = await registerUser(app);

  const pay = await json<{
    id: string;
    number: string;
    description: string;
    amount: number;
    status: string;
    method: string;
  }>(app, "POST", "/api/billing/payments", {
    token: user.token,
    body: checkoutBody("30d", user.email),
  });
  assert.equal(pay.status, 201);
  assert.match(pay.body.number, /^NOVA-\d{6}-\d{4}$/);
  assert.equal(pay.body.description, "Network Access — 30 Days");
  assert.equal(pay.body.amount, 6.9);
  assert.equal(pay.body.status, "completed");
  assert.equal(pay.body.method, "card");

  const sub = await json<{
    status: string;
    planLabel: string;
    deviceLimit: number;
    subscriptionToken: string;
    expiresAt: string;
  }>(app, "GET", "/api/subscription", { token: user.token });
  assert.equal(sub.status, 200);
  assert.equal(sub.body.status, "active");
  assert.equal(sub.body.planLabel, "30 Days");
  assert.equal(sub.body.deviceLimit, 5);
  assert.match(sub.body.subscriptionToken, /^[0-9a-f]{32}$/);

  const expected = Date.now() + 30 * DAY;
  assert.ok(
    Math.abs(Date.parse(sub.body.expiresAt) - expected) < 5 * 60_000,
    "expiry ≈ now + 30d",
  );
  await app.close();
});

test("renewing while active stacks from the current expiry", async () => {
  const app = await makeApp();
  const user = await registerUser(app);

  await json(app, "POST", "/api/billing/payments", {
    token: user.token,
    body: checkoutBody("30d", user.email),
  });
  const first = (await json<{ expiresAt: string }>(app, "GET", "/api/subscription", {
    token: user.token,
  })).body.expiresAt;

  const second = await json<{ amount: number }>(app, "POST", "/api/billing/payments", {
    token: user.token,
    body: checkoutBody("90d", user.email),
  });
  assert.equal(second.status, 201);
  assert.equal(second.body.amount, 18.9);

  const sub = await json<{ expiresAt: string; planLabel: string }>(
    app,
    "GET",
    "/api/subscription",
    { token: user.token },
  );
  const expected = Date.parse(first) + 90 * DAY;
  assert.ok(
    Math.abs(Date.parse(sub.body.expiresAt) - expected) < 5 * 60_000,
    "renewal stacks from previous expiry",
  );
  assert.equal(sub.body.planLabel, "90 Days");
  await app.close();
});

test("renewing after expiry starts from now, not the old date", async () => {
  const app = await makeApp();
  const user = await registerUser(app);
  await json(app, "POST", "/api/billing/payments", {
    token: user.token,
    body: checkoutBody("30d", user.email),
  });

  // Force-expire the subscription directly in the database.
  app.db
    .prepare("UPDATE subscriptions SET expires_at = ? WHERE user_id = ?")
    .run(new Date(Date.now() - DAY).toISOString(), user.userId);

  const expired = await json<{ status: string }>(app, "GET", "/api/subscription", {
    token: user.token,
  });
  assert.equal(expired.body.status, "expired");

  await json(app, "POST", "/api/billing/payments", {
    token: user.token,
    body: checkoutBody("30d", user.email),
  });
  const renewed = await json<{ expiresAt: string }>(app, "GET", "/api/subscription", {
    token: user.token,
  });
  assert.ok(
    Math.abs(Date.parse(renewed.body.expiresAt) - (Date.now() + 30 * DAY)) < 5 * 60_000,
    "expired renewal starts from now",
  );
  await app.close();
});

test("regenerate-link rotates the token; old token never returns", async () => {
  const app = await makeApp();
  const user = await registerUser(app);
  await json(app, "POST", "/api/billing/payments", {
    token: user.token,
    body: checkoutBody("30d", user.email),
  });

  const before = (await json<{ subscriptionToken: string }>(
    app,
    "GET",
    "/api/subscription",
    { token: user.token },
  )).body.subscriptionToken;

  const regen = await json<{ subscriptionToken: string }>(
    app,
    "POST",
    "/api/subscription/regenerate-link",
    { token: user.token },
  );
  assert.equal(regen.status, 200);
  assert.match(regen.body.subscriptionToken, /^[0-9a-f]{32}$/);
  assert.notEqual(regen.body.subscriptionToken, before);

  const after = (await json<{ subscriptionToken: string }>(
    app,
    "GET",
    "/api/subscription",
    { token: user.token },
  )).body.subscriptionToken;
  assert.equal(after, regen.body.subscriptionToken);
  await app.close();
});

test("checkout with an unknown plan id fails with 400 BAD_PLAN", async () => {
  const app = await makeApp();
  const user = await registerUser(app);
  const res = await json<{ error: { code: string } }>(app, "POST", "/api/billing/payments", {
    token: user.token,
    body: checkoutBody("7d", user.email),
  });
  assert.equal(res.status, 400);
  assert.equal(res.body.error.code, "BAD_PLAN");
  await app.close();
});

test("demo account is seeded with the prototype dataset", async () => {
  const app = await makeApp();
  const login = await json<{ token: string }>(app, "POST", "/api/auth/login", {
    body: { email: "alex.chen@example.com", password: "nova-demo-2026" },
  });
  assert.equal(login.status, 200);

  const sub = await json<{ planLabel: string; expiresAt: string }>(
    app,
    "GET",
    "/api/subscription",
    { token: login.body.token },
  );
  assert.equal(sub.body.planLabel, "90 Days");
  assert.equal(sub.body.expiresAt, "2026-12-02T14:05:00Z");

  const payments = await json<{ length: number }[]>(
    app,
    "GET",
    "/api/billing/payments",
    { token: login.body.token },
  );
  assert.equal((payments.body as unknown[]).length, 3);

  const tickets = await json(app, "GET", "/api/tickets", { token: login.body.token });
  assert.equal((tickets.body as unknown[]).length, 2);

  const devices = await json(app, "GET", "/api/devices", { token: login.body.token });
  assert.equal((devices.body as unknown[]).length, 2);

  // Seeding twice (simulated restart) must not duplicate anything.
  const { seed } = await import("../src/seed.js");
  await seed(app.db);
  const paymentsAgain = await json(app, "GET", "/api/billing/payments", {
    token: login.body.token,
  });
  assert.equal((paymentsAgain.body as unknown[]).length, 3);
  assert.equal(nowIso().length > 0, true);
  await app.close();
});
