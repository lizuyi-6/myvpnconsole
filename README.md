# NOVA — Network Access

A network access service console. Users learn about the service, pick a plan
duration, activate access, and manage their subscription, devices and setup —
that is the entire product. There is deliberately **no shopping cart, no
product catalog, no stock, no volume pricing**: this is a connectivity
service, not a store.

Frontend only. All data comes from a mock service layer designed to be swapped
for a real REST API without touching page components.

## Run

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # type-check + production build
```

## Stack

React 18 · TypeScript (strict) · Vite · Tailwind CSS · shadcn-style UI
primitives (Radix + CVA) · Zustand (persisted auth) · React Router ·
React Hook Form + Zod · Lucide icons

## Demo notes

- **Sign in**: any email + password of 8+ characters.
  `fail@nova.dev` simulates a network error; shorter passwords are rejected
  (email is preserved on failure).
- **Checkout**: `/checkout?plan=30d|90d|365d`, mock payment (~1s), always
  succeeds. Card fields are validated.
- A successful payment **extends the subscription** from the current expiry
  (or from now if expired) — visible immediately in the console.
- Payments, regenerated subscription tokens, device renames/removals persist
  in `localStorage`.

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
  types/                 ← Plan, Region, Subscription, Device, Payment, Ticket
  mocks/                 ← seed data
  services/              ← API boundary; pages never call fetch()
    plans.ts               GET /plans, /plans/:id
    network.ts             GET /network/status, /network/regions
    subscription.ts        GET /subscription, POST /subscription/regenerate-link
    devices.ts             GET/PATCH/DELETE /devices
    billing.ts             GET/POST /billing/payments (extends subscription)
    support.ts             GET/POST /tickets
    auth.ts                POST /auth/login, /auth/register
  store/auth.ts          ← Zustand persisted session
  hooks/                 ← useAsync (loading/error/retry), useCopy
  components/
    ui/                  ← primitives (small radius, weak borders)
    layout/              ← site header/footer, console shell + mobile drawer
    subscription/        ← SubscriptionUrlField (masked, reveal, copy)
    setup/               ← SetupGuide (shared by public + console)
    feedback/            ← status dots, empty / error states
```

## Visual language

Dark neutral (not pure black) background, weak borders, hierarchy built from
spacing/typography/dividers rather than cards and shadows. A single cold-blue
primary used sparingly (actions, links, active nav). Status is a small dot,
not a badge. No gradients, glows, glassmorphism or scroll-reveal animation;
animation is limited to dialogs and drawers (~150–250ms) and respects
`prefers-reduced-motion`.

## Backend integration

Replace the service bodies in `src/services/*` with HTTP calls. Signatures are
the contract — see [docs/api-contract.md](docs/api-contract.md).
