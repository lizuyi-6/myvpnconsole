import assert from "node:assert/strict";
import { test } from "node:test";
import { newId, nowIso } from "../src/db.js";
import { json, makeApp, registerUser } from "./helpers.js";

async function addDevice(app: Awaited<ReturnType<typeof makeApp>>, userId: string, name = "Windows Laptop") {
  const id = newId("dev");
  app.db
    .prepare(
      `INSERT INTO devices (id, user_id, name, platform, last_active_at, created_at)
       VALUES (?, ?, ?, 'windows', ?, ?)`,
    )
    .run(id, userId, name, nowIso(), nowIso());
  return id;
}

test("fresh account sees an empty device list; demo devices are not leaked", async () => {
  const app = await makeApp();
  const user = await registerUser(app);
  const res = await json<unknown[]>(app, "GET", "/api/devices", { token: user.token });
  assert.equal(res.status, 200);
  assert.deepEqual(res.body, []);
  await app.close();
});

test("rename updates the device and returns it", async () => {
  const app = await makeApp();
  const user = await registerUser(app);
  const id = await addDevice(app, user.userId);

  const res = await json<{ id: string; name: string; platform: string }>(
    app,
    "PATCH",
    `/api/devices/${id}`,
    { token: user.token, body: { name: "Work Laptop" } },
  );
  assert.equal(res.status, 200);
  assert.equal(res.body.id, id);
  assert.equal(res.body.name, "Work Laptop");
  assert.equal(res.body.platform, "windows");
  await app.close();
});

test("rename validation: empty or oversized names are 400s", async () => {
  const app = await makeApp();
  const user = await registerUser(app);
  const id = await addDevice(app, user.userId);

  const empty = await json(app, "PATCH", `/api/devices/${id}`, {
    token: user.token,
    body: { name: "   " },
  });
  assert.equal(empty.status, 400);

  const long = await json(app, "PATCH", `/api/devices/${id}`, {
    token: user.token,
    body: { name: "x".repeat(41) },
  });
  assert.equal(long.status, 400);
  await app.close();
});

test("rename/remove of unknown or foreign device ids is a 404", async () => {
  const app = await makeApp();
  const alice = await registerUser(app);
  const bob = await registerUser(app);
  const aliceDevice = await addDevice(app, alice.userId);

  const foreign = await json(app, "PATCH", `/api/devices/${aliceDevice}`, {
    token: bob.token,
    body: { name: "Hijacked" },
  });
  assert.equal(foreign.status, 404);

  const unknown = await json(app, "DELETE", "/api/devices/dev_missing", {
    token: alice.token,
  });
  assert.equal(unknown.status, 404);
  await app.close();
});

test("remove deletes the device; a second remove is a 404", async () => {
  const app = await makeApp();
  const user = await registerUser(app);
  const id = await addDevice(app, user.userId);

  const del = await json(app, "DELETE", `/api/devices/${id}`, { token: user.token });
  assert.equal(del.status, 204);

  const list = await json<unknown[]>(app, "GET", "/api/devices", { token: user.token });
  assert.deepEqual(list.body, []);

  const again = await json(app, "DELETE", `/api/devices/${id}`, { token: user.token });
  assert.equal(again.status, 404);
  await app.close();
});
