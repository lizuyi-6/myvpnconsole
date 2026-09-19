import assert from "node:assert/strict";
import { test } from "node:test";
import { json, makeApp, registerUser } from "./helpers.js";

const TICKET = {
  subject: "Slow speeds on Japan in the evening",
  category: "connection",
  message: "Throughput drops to a few Mbps between 8-11pm local time on Japan.",
};

test("fresh account has no tickets", async () => {
  const app = await makeApp();
  const user = await registerUser(app);
  const res = await json<unknown[]>(app, "GET", "/api/tickets", { token: user.token });
  assert.deepEqual(res.body, []);
  await app.close();
});

test("create ticket returns an open ticket and it leads the list", async () => {
  const app = await makeApp();
  const user = await registerUser(app);

  const created = await json<{
    id: string;
    status: string;
    subject: string;
    createdAt: string;
    updatedAt: string;
    paymentNumber?: string;
  }>(app, "POST", "/api/tickets", { token: user.token, body: TICKET });
  assert.equal(created.status, 201);
  assert.equal(created.body.status, "open");
  assert.equal(created.body.subject, TICKET.subject);
  assert.equal(created.body.createdAt, created.body.updatedAt);
  assert.equal(created.body.paymentNumber, undefined);

  const list = await json<{ id: string }[]>(app, "GET", "/api/tickets", {
    token: user.token,
  });
  assert.equal(list.body.length, 1);
  assert.equal(list.body[0].id, created.body.id);
  await app.close();
});

test("create ticket with a related payment keeps the reference", async () => {
  const app = await makeApp();
  const user = await registerUser(app);
  const res = await json<{ paymentNumber: string }>(app, "POST", "/api/tickets", {
    token: user.token,
    body: { ...TICKET, category: "payment", paymentNumber: "NOVA-260620-0988" },
  });
  assert.equal(res.status, 201);
  assert.equal(res.body.paymentNumber, "NOVA-260620-0988");
  await app.close();
});

test("ticket validation mirrors the form: short subject/message, bad category", async () => {
  const app = await makeApp();
  const user = await registerUser(app);

  const shortSubject = await json(app, "POST", "/api/tickets", {
    token: user.token,
    body: { ...TICKET, subject: "hi" },
  });
  assert.equal(shortSubject.status, 400);

  const shortMessage = await json(app, "POST", "/api/tickets", {
    token: user.token,
    body: { ...TICKET, message: "too short" },
  });
  assert.equal(shortMessage.status, 400);

  const badCategory = await json(app, "POST", "/api/tickets", {
    token: user.token,
    body: { ...TICKET, category: "spam" },
  });
  assert.equal(badCategory.status, 400);
  await app.close();
});

test("tickets are isolated per account", async () => {
  const app = await makeApp();
  const alice = await registerUser(app);
  const bob = await registerUser(app);

  await json(app, "POST", "/api/tickets", { token: alice.token, body: TICKET });
  const bobList = await json<unknown[]>(app, "GET", "/api/tickets", { token: bob.token });
  assert.deepEqual(bobList.body, []);
  await app.close();
});
