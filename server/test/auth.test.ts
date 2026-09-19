import assert from "node:assert/strict";
import { test } from "node:test";
import { json, makeApp, registerUser, uniqueEmail } from "./helpers.js";

test("register returns user + token and sets an httpOnly cookie", async () => {
  const app = await makeApp();
  const email = uniqueEmail();
  const res = await json<{
    user: { name: string; email: string };
    token: string;
  }>(app, "POST", "/api/auth/register", {
    body: { name: "Alice Doe", email, password: "password-123" },
  });

  assert.equal(res.status, 201);
  assert.deepEqual(res.body.user, { name: "Alice Doe", email });
  assert.match(res.body.token, /^[\w-]{40,}$/);
  assert.ok(res.setCookie?.includes("nova_session="));
  assert.ok(res.setCookie?.includes("HttpOnly"));
  await app.close();
});

test("register rejects duplicate email with 409 EMAIL_TAKEN", async () => {
  const app = await makeApp();
  const email = uniqueEmail();
  await registerUser(app, email);
  const res = await json(app, "POST", "/api/auth/register", {
    body: { name: "Second", email, password: "password-123" },
  });
  assert.equal(res.status, 409);
  assert.equal((res.body as { error: { code: string } }).error.code, "EMAIL_TAKEN");
  await app.close();
});

test("register validates password and email (400 VALIDATION)", async () => {
  const app = await makeApp();
  const weak = await json(app, "POST", "/api/auth/register", {
    body: { name: "Alice", email: uniqueEmail(), password: "short" },
  });
  assert.equal(weak.status, 400);
  assert.equal((weak.body as { error: { code: string } }).error.code, "VALIDATION");

  const badEmail = await json(app, "POST", "/api/auth/register", {
    body: { name: "Alice", email: "not-an-email", password: "password-123" },
  });
  assert.equal(badEmail.status, 400);
  await app.close();
});

test("login succeeds with correct credentials", async () => {
  const app = await makeApp();
  const email = uniqueEmail();
  await registerUser(app, email, "password-123");
  const res = await json<{ user: { email: string }; token: string }>(
    app,
    "POST",
    "/api/auth/login",
    { body: { email, password: "password-123" } },
  );
  assert.equal(res.status, 200);
  assert.equal(res.body.user.email, email);
  assert.match(res.body.token, /^[\w-]{40,}$/);
  await app.close();
});

test("login fails with wrong password / unknown email (401, same code)", async () => {
  const app = await makeApp();
  const email = uniqueEmail();
  await registerUser(app, email, "password-123");

  const wrong = await json(app, "POST", "/api/auth/login", {
    body: { email, password: "wrong-password" },
  });
  assert.equal(wrong.status, 401);
  assert.equal(
    (wrong.body as { error: { code: string } }).error.code,
    "INVALID_CREDENTIALS",
  );

  const unknown = await json(app, "POST", "/api/auth/login", {
    body: { email: "ghost@nowhere.dev", password: "password-123" },
  });
  assert.equal(unknown.status, 401);
  assert.equal(
    (unknown.body as { error: { code: string } }).error.code,
    "INVALID_CREDENTIALS",
  );
  await app.close();
});

test("me works with bearer token and with session cookie", async () => {
  const app = await makeApp();
  const user = await registerUser(app);

  const bearer = await json<{ user: { email: string } }>(app, "GET", "/api/auth/me", {
    token: user.token,
  });
  assert.equal(bearer.status, 200);
  assert.equal(bearer.body.user.email, user.email);

  const login = await app.inject({
    method: "POST",
    url: "/api/auth/login",
    payload: { email: user.email, password: "password-123" },
  });
  const setCookie = login.headers["set-cookie"];
  const firstCookie = (Array.isArray(setCookie) ? setCookie[0] : setCookie) as string;
  const cookie = firstCookie.split(";")[0];
  const viaCookie = await app.inject({
    method: "GET",
    url: "/api/auth/me",
    headers: { cookie },
  });
  assert.equal(viaCookie.statusCode, 200);
  await app.close();
});

test("me rejects missing, malformed and garbage tokens", async () => {
  const app = await makeApp();
  await registerUser(app);

  for (const token of [undefined, "garbage-token", "Bearer ".padEnd(40, "x")]) {
    const res = await json(app, "GET", "/api/auth/me", { token });
    assert.equal(res.status, 401, `token=${token}`);
  }
  await app.close();
});

test("logout revokes the session server-side", async () => {
  const app = await makeApp();
  const user = await registerUser(app);

  const out = await json(app, "POST", "/api/auth/logout", { token: user.token });
  assert.equal(out.status, 204);

  const me = await json(app, "GET", "/api/auth/me", { token: user.token });
  assert.equal(me.status, 401);
  await app.close();
});

test("login endpoint is rate limited", async () => {
  const app = await makeApp();
  const email = uniqueEmail();
  let lastStatus = 0;
  for (let i = 0; i < 11; i++) {
    const res = await json(app, "POST", "/api/auth/login", {
      body: { email, password: `wrong-attempt-${i}` },
    });
    lastStatus = res.status;
  }
  assert.equal(lastStatus, 429);
  assert.equal(
    (await json(app, "POST", "/api/auth/login", { body: { email, password: "x" } }))
      .status,
    429,
  );
  await app.close();
});
