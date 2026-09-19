import assert from "node:assert/strict";
import { test } from "node:test";
import { checkoutBody, json, makeApp, registerUser } from "./helpers.js";

test("fresh account has no payments", async () => {
  const app = await makeApp();
  const user = await registerUser(app);
  const res = await json<unknown[]>(app, "GET", "/api/billing/payments", {
    token: user.token,
  });
  assert.equal(res.status, 200);
  assert.deepEqual(res.body, []);
  await app.close();
});

test("created payments are listed newest-first with sequential numbers", async () => {
  const app = await makeApp();
  const user = await registerUser(app);

  await json(app, "POST", "/api/billing/payments", {
    token: user.token,
    body: checkoutBody("30d", user.email),
  });
  await json(app, "POST", "/api/billing/payments", {
    token: user.token,
    body: checkoutBody("90d", user.email),
  });

  const list = await json<{ number: string; createdAt: string }[]>(
    app,
    "GET",
    "/api/billing/payments",
    { token: user.token },
  );
  assert.equal(list.body.length, 2);
  const [newer, older] = list.body;
  assert.ok(Date.parse(newer.createdAt) >= Date.parse(older.createdAt));

  const seqA = Number(older.number.slice(-4));
  const seqB = Number(newer.number.slice(-4));
  assert.equal(seqB, seqA + 1);
  await app.close();
});

test("payments are isolated per account", async () => {
  const app = await makeApp();
  const alice = await registerUser(app);
  const bob = await registerUser(app);

  await json(app, "POST", "/api/billing/payments", {
    token: alice.token,
    body: checkoutBody("30d", alice.email),
  });

  const bobList = await json<unknown[]>(app, "GET", "/api/billing/payments", {
    token: bob.token,
  });
  assert.deepEqual(bobList.body, []);
  await app.close();
});

test("checkout validation: bad method / malformed contact are 400s", async () => {
  const app = await makeApp();
  const user = await registerUser(app);

  const badMethod = await json(app, "POST", "/api/billing/payments", {
    token: user.token,
    body: { ...checkoutBody("30d", user.email), paymentMethod: "seashells" },
  });
  assert.equal(badMethod.status, 400);

  const badContact = await json(app, "POST", "/api/billing/payments", {
    token: user.token,
    body: { ...checkoutBody("30d", "not-an-email") },
  });
  assert.equal(badContact.status, 400);
  await app.close();
});
