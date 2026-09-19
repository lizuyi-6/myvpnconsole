import assert from "node:assert/strict";
import { test } from "node:test";
import { newId, nowIso } from "../src/db.js";
import { checkoutBody, json, makeApp, registerUser } from "./helpers.js";

const PROTECTED: [string, string][] = [
  ["GET", "/api/auth/me"],
  ["POST", "/api/auth/logout"],
  ["GET", "/api/subscription"],
  ["POST", "/api/subscription/regenerate-link"],
  ["GET", "/api/devices"],
  ["PATCH", "/api/devices/dev_x"],
  ["DELETE", "/api/devices/dev_x"],
  ["GET", "/api/billing/payments"],
  ["POST", "/api/billing/payments"],
  ["GET", "/api/tickets"],
  ["POST", "/api/tickets"],
];

test("every protected endpoint rejects anonymous calls with a 401 + code", async () => {
  const app = await makeApp();
  for (const [method, url] of PROTECTED) {
    const res = await json<{ error: { code: string; message: string } }>(
      app,
      method,
      url,
      { body: {} },
    );
    assert.equal(res.status, 401, `${method} ${url}`);
    assert.equal(res.body.error.code, "UNAUTHORIZED", `${method} ${url}`);
    assert.ok(typeof res.body.error.message === "string");
  }
  await app.close();
});

test("a revoked session is rejected everywhere, not just on /me", async () => {
  const app = await makeApp();
  const user = await registerUser(app);
  await json(app, "POST", "/api/auth/logout", { token: user.token });

  for (const [method, url] of PROTECTED.slice(2)) {
    const res = await json(app, method, url, { token: user.token, body: {} });
    assert.equal(res.status, 401, `${method} ${url} with revoked token`);
  }
  await app.close();
});

test("no response exposes internal or supply-chain fields", async () => {
  const app = await makeApp();
  const user = await registerUser(app);

  // Full customer journey — collect every JSON body the API can emit.
  const bodies: string[] = [];
  const collect = (body: unknown): void => {
    bodies.push(JSON.stringify(body));
  };

  collect(
    (
      await json(app, "POST", "/api/auth/register", {
        body: { name: "Eve", email: user.email, password: "password-123" },
      })
    ).body,
  );
  collect((await json(app, "POST", "/api/auth/login", {
    body: { email: user.email, password: "password-123" },
  })).body);
  collect((await json(app, "GET", "/api/auth/me", { token: user.token })).body);
  collect((await json(app, "GET", "/api/plans")).body);
  collect((await json(app, "GET", "/api/plans/30d")).body);
  collect((await json(app, "GET", "/api/network/regions")).body);
  collect((await json(app, "GET", "/api/network/status")).body);
  collect((await json(app, "GET", "/api/subscription", { token: user.token })).body);
  collect(
    (
      await json(app, "POST", "/api/billing/payments", {
        token: user.token,
        body: checkoutBody("30d", user.email),
      })
    ).body,
  );
  collect((await json(app, "GET", "/api/billing/payments", { token: user.token })).body);
  collect((await json(app, "GET", "/api/devices", { token: user.token })).body);
  collect((await json(app, "GET", "/api/tickets", { token: user.token })).body);
  collect(
    (
      await json(app, "POST", "/api/tickets", {
        token: user.token,
        body: {
          subject: "Anything at all",
          category: "other",
          message: "A message long enough to pass the twenty character rule.",
        },
      })
    ).body,
  );
  collect((await json(app, "GET", "/api/plans/nope")).body);
  collect((await json(app, "GET", "/api/nope")).body);

  // Session token hashes and password hashes must never leave the server;
  // supplier/cost vocabulary has no place in customer responses at all.
  const forbidden =
    /password_hash|token_hash|supplier|procurement|wholesale|cost_|margin|upstream|node_id/i;
  for (const body of bodies) {
    assert.ok(!forbidden.test(body), `leaked field in: ${body.slice(0, 120)}`);
  }
  await app.close();
});

test("error responses always use the { error: { code, message } } shape", async () => {
  const app = await makeApp();
  const user = await registerUser(app);

  const attempts: Promise<{ status: number; body: unknown }>[] = [
    json(app, "POST", "/api/auth/login", { body: { email: "x@y.dev", password: "no" } }),
    json(app, "POST", "/api/auth/register", { body: {} }),
    json(app, "GET", "/api/plans/nope"),
    json(app, "GET", "/api/subscription", { token: user.token }),
    json(app, "POST", "/api/tickets", { token: user.token, body: {} }),
    json(app, "PATCH", "/api/devices/dev_x", { token: user.token, body: { name: "x" } }),
  ];
  for (const attempt of await Promise.all(attempts)) {
    const err = (attempt.body as { error?: { code?: unknown; message?: unknown } }).error;
    assert.ok(err, `error envelope missing: ${JSON.stringify(attempt.body).slice(0, 80)}`);
    assert.equal(typeof err.code, "string");
    assert.equal(typeof err.message, "string");
  }
  await app.close();
});

test("device ids of one user cannot be enumerated by another", async () => {
  const app = await makeApp();
  const alice = await registerUser(app);
  const bob = await registerUser(app);

  const deviceId = newId("dev");
  app.db
    .prepare(
      `INSERT INTO devices (id, user_id, name, platform, last_active_at, created_at)
       VALUES (?, ?, 'Alice Phone', 'ios', ?, ?)`,
    )
    .run(deviceId, alice.userId, nowIso(), nowIso());

  const probe = await json(app, "GET", "/api/devices", { token: bob.token });
  assert.equal(JSON.stringify(probe.body).includes(deviceId), false);
  await app.close();
});
