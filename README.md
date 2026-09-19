# NOVA — Network Access

A network access service console. Users learn about the service, pick a plan
duration, activate access, and manage their subscription, devices and setup —
that is the entire product. There is deliberately **no shopping cart, no
product catalog, no stock, no volume pricing**: this is a connectivity
service, not a store.

Full stack: a React SPA plus a Fastify + better-sqlite3 API
([server/](server/)) behind a typed service layer. Pages never call `fetch()`
directly — they consume services whose signatures are the API contract.

## Run

```bash
npm install
npm --prefix server install
npm run dev:all   # API on :8787 + Vite on :5173 (with /api proxy)
npm test:api      # API integration tests (in-memory DB, no network)
npm run build     # type-check + production build of the frontend
```

Demo account (seeded automatically): `alex.chen@example.com` /
`nova-demo-2026`. Or register your own — a fresh account starts with no
subscription and an honest empty state pointing at the plans.

Production: build both, then one Node process serves SPA + API —
see [server/README.md](server/README.md).

## Stack

- **Frontend**: React 18 · TypeScript (strict) · Vite · Tailwind CSS ·
  shadcn-style UI primitives (Radix + CVA) · Zustand (persisted session +
  token) · React Router · React Hook Form + Zod · Lucide icons
- **API**: Fastify 5 · better-sqlite3 (WAL) · zod · scrypt password hashing ·
  opaque revocable session tokens (Bearer + httpOnly cookie) · rate-limited
  auth endpoints

## Demo notes

- **Auth**: real accounts — register, login, logout (session revoked
  server-side). Wrong credentials get a localized error; duplicate emails are
  rejected with 409.
- **Checkout**: `/checkout?plan=30d|90d|365d`. Payments are **simulated** (no
  gateway is contacted); a completed payment creates/extends the subscription
  server-side and issues a fresh subscription token.
- A successful payment **extends the subscription** from the current expiry
  (or from now if expired) — persisted in SQLite, visible after re-login.
- Regenerating the subscription URL **invalidates the old token** and needs
  explicit confirmation in the UI.

## Information architecture

```
Public (SiteLayout)
  /                     Home — service intro, coverage, platforms, setup steps, plans
  /network              Regions table + service status
  /plans                One service, three durations
  /setup                Public setup guide (URL visible when signed in)
  /help                 FAQ + contact
  /login /register      Centered auth
  /checkout             Requires auth — activates access
  /access/activated     Post-purchase: subscription URL first

Console (standalone shell, no marketing chrome)
  /console              Overview — service summary, subscription URL, setup, status
  /console/subscription Expiry, renewal term, URL + regenerate (confirmed), regions
  /console/devices      Device list with rename / remove
  /console/setup        Same guide, subscription URL inline
  /console/billing      Current plan + payment history
  /console/support      Tickets
  /console/settings     Profile + notifications

Legacy redirects: /products* /pricing /cart → /plans · /dashboard/* → /console/*
```

## Architecture

```
src/
  config/brand.ts        ← name, copy, primary color in one place
  config/product.ts      ← service name, device limit
  types/                 ← Plan, Region, Subscription, Device, Payment, Ticket
  lib/api-client.ts      ← fetch wrapper (Bearer token, 401 event, ServiceError)
  services/              ← API boundary; pages never call fetch()
    auth.ts                POST /auth/login, /auth/register, /auth/logout
    plans.ts               GET /plans, /plans/:id
    network.ts             GET /network/status, /network/regions
    subscription.ts        GET /subscription, POST /subscription/regenerate-link
    devices.ts             GET/PATCH/DELETE /devices
    billing.ts             GET/POST /billing/payments (extends subscription)
    support.ts             GET/POST /tickets
  store/auth.ts          ← Zustand persisted session + token
  hooks/                 ← useAsync (loading/error/retry), useCopy
  components/
    ui/                  ← primitives (small radius, weak borders)
    layout/              ← site header/footer, console shell + mobile drawer
    subscription/        ← SubscriptionUrlField (masked, reveal, copy)
    setup/               ← SetupGuide (shared by public + console)
    feedback/            ← status dots, empty / error states

server/                  ← Fastify API (see server/README.md)
  src/routes/            ← auth, catalog, subscription, devices, billing, support
  src/{db,auth,seed}.ts  ← SQLite schema, scrypt + sessions, demo seed
  test/                  ← 40 integration tests via fastify.inject
```

## Visual language

Dark neutral (not pure black) background, weak borders, hierarchy built from
spacing/typography/dividers rather than cards and shadows. A single cold-blue
primary used sparingly (actions, links, active nav). Status is a small dot,
not a badge. No gradients, glows, glassmorphism or scroll-reveal animation;
animation is limited to dialogs and drawers (~150–250ms) and respects
`prefers-reduced-motion`.

## Backend

Implemented in [server/](server/) — the service bodies in `src/services/*`
now call it over HTTP. The human-readable contract lives in
[docs/api-contract.md](docs/api-contract.md); the executable one is the test
suite (`npm test:api`).
