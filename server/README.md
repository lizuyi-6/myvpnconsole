# NOVA API

Fastify + TypeScript + better-sqlite3 backend for the NOVA console. Serves the
JSON API under `/api/*` and, in production, the built SPA from the same
process.

## Why this stack

| Choice | Rationale |
| --- | --- |
| Fastify 5 | Mature, fast, first-class TypeScript, built-in `inject()` for real integration tests without sockets |
| better-sqlite3 (WAL) | Embedded, transactional, single-file backups; no external DB service to operate |
| zod | Same validation vocabulary as the frontend forms |
| Node `crypto.scrypt` | Password hashing with zero native deps (memory-hard, params stored with the hash) |
| Opaque session tokens | 256-bit random tokens stored SHA-256-hashed in the DB — revocable server-side (JWT would not be), delivered as Bearer + httpOnly cookie |
| `@fastify/rate-limit` | 10 req/min on `/auth/login` and `/auth/register` |

## Run

```bash
npm install
npm run dev        # tsx watch on :8787
npm test           # integration test suite (in-memory DB, fastify.inject)
npm run build      # tsc → dist/
npm start          # node dist/index.js
npm run test:e2e   # browser E2E (Playwright) against a throwaway prod server
```

`test:e2e` expects the frontend built at `../dist` and the API built at
`server/dist`. It boots a throwaway server (fresh DB, port 8791) and drives
the full user journey — register → empty state → checkout → console →
devices/tickets/billing → regenerate link → logout/re-login → demo account →
duplicate email → route guards — 26 checks in Chinese plus an English smoke.
If Playwright's bundled browser is missing, point `E2E_EXECUTABLE` at any
Chromium build.

### Environment

| Variable | Default | Meaning |
| --- | --- | --- |
| `PORT` | `8787` | Listen port |
| `HOST` | `127.0.0.1` | Bind address |
| `DB_PATH` | `data/nova.db` | SQLite file (created automatically) |
| `WEB_ROOT` | — | Directory of the built SPA to serve (production) |
| `SESSION_TTL_DAYS` | `30` | Session lifetime |
| `NODE_ENV` | — | `production` makes session cookies `Secure` |

## Demo account

Seeded on first boot (and re-seeded safely on restarts):

```
email:    alex.chen@example.com
password: nova-demo-2026
```

It carries the dataset the storefront prototype shipped with (subscription,
2 devices, 3 payments, 2 tickets) so the console looks alive out of the box.

## Development with the frontend

From the repo root:

```bash
npm run dev:all    # API on :8787 + Vite on :5173, /api proxied
```

Vite proxies `/api` to the API server (`API_PROXY_TARGET` overrides the
target), so the app is always same-origin — CORS is never configured.

## Production

```bash
npm run build           # frontend → dist/
cd server && npm run build
WEB_ROOT=../dist PORT=8787 npm start
```

One Node process serves the SPA (with SPA fallback for deep links) and the
API. `/api/*` unknown routes always return JSON, never `index.html`.

## API surface

All responses are JSON. Errors use `{ "error": { "code", "message" } }` with
a stable machine-readable `code` (`UNAUTHORIZED`, `INVALID_CREDENTIALS`,
`EMAIL_TAKEN`, `NO_SUBSCRIPTION`, `NOT_FOUND`, `BAD_PLAN`, `VALIDATION`,
`RATE_LIMITED`, `INTERNAL`).

Public: `GET /api/health`, `GET /api/plans`, `GET /api/plans/:id`,
`GET /api/network/regions`, `GET /api/network/status`,
`POST /api/auth/register`, `POST /api/auth/login`.

Authenticated (Bearer token or `nova_session` cookie):
`GET /api/auth/me`, `POST /api/auth/logout`, `GET /api/subscription`,
`POST /api/subscription/regenerate-link`, `GET|PATCH|DELETE /api/devices[/:id]`,
`GET|POST /api/billing/payments`, `GET|POST /api/tickets`.

Response shapes mirror `src/types.ts` ↔ the frontend's `src/types/index.ts`
(keep the two in sync). Every response passes through a serializer whitelist,
so internal columns (password/token hashes) and any supplier/procurement
vocabulary have no path into customer payloads.

## Behavioral rules worth knowing

- **Payments are simulated.** No gateway is contacted; a "completed" payment
  creates or extends the subscription. Renewal stacks from the current expiry
  while active, from now when expired.
- **Subscription URL regeneration rotates the token** and never returns the
  old one (the UI requires explicit confirmation before calling it).
- **No fabricated telemetry.** `network/status.updatedAt` is the last write
  time of the region snapshot — nothing is synthesized per request.
- **Isolation by construction.** Devices/payments/tickets queries are always
  scoped by `user_id`; foreign ids 404 instead of leaking existence.
