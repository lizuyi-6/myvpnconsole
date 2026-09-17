# NOVA — Digital Services Storefront

A high-fidelity, production-structured frontend for a digital subscription /
account wholesale platform. **Frontend only** — all data comes from a mock
service layer designed to be swapped for a real REST API without touching any
page component.

## Run

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # type-check + production build
```

## Stack

React 18 · TypeScript (strict) · Vite · Tailwind CSS · shadcn-style UI
primitives (Radix + CVA) · Zustand (persisted cart/auth) · React Router ·
React Hook Form + Zod · Framer Motion · Lucide icons

## Demo notes

- **Sign in**: any email + password of 8+ characters.
  `fail@nova.dev` simulates a network error; shorter passwords are rejected as
  invalid credentials (email is preserved).
- **Checkout**: mock payment, ~1s processing, always succeeds. Card fields are
  validated (any 12–19 digit number, MM/YY, 3–4 digit CVC).
- Created orders and tickets persist in `localStorage`, so refreshes are safe.
- Regenerating a subscription link also persists its new token.

## Architecture

```
src/
  config/brand.ts        ← rename / recolor / reword the entire product here
  types/                 ← domain types (mirror the future REST API shapes)
  mocks/                 ← seed data (products, orders, library, tickets)
  services/              ← API boundary. Pages never call fetch() directly.
    products.ts            ProductService   (GET /products, /products/:slug)
    orders.ts              OrderService     (GET/POST /orders, GET /orders/:id)
    library.ts             LibraryService + SubscriptionService
    support.ts             SupportService   (GET/POST /tickets)
    auth.ts                AuthService      (POST /auth/login, /auth/register)
    mock-transport.ts      latency simulation + localStorage persistence
  store/                 ← Zustand: cart (persisted), auth (persisted)
  lib/                   ← pricing engine (volume tiers), cart math, utils
  hooks/                 ← useAsync (loading/error/retry), useCopy
  components/
    ui/                  ← design system primitives
    layout/              ← site header/footer, dashboard shell + mobile drawer
    product/             ← cards, tier table, stock badge, icon tiles
    feedback/            ← empty / error / status badges
    motion/reveal.tsx    ← restrained scroll-reveal (reduced-motion aware)
  pages/
    home, products, product-detail, pricing, help, cart, checkout,
    order-success, login, register, not-found
    dashboard/ overview, orders(+detail), my-products(+credentials),
               subscriptions(+manage), support, settings
```

## Design tokens

Defined in `src/index.css` as CSS variables and mapped in
`tailwind.config.ts`:

| Token | Value |
|---|---|
| background | `#080A0F` deep black-blue |
| surface / elevated | `#0D1118` / `#131821` |
| primary | from `brand.colors.primary` (default `#5E6AD2`) |
| foreground | `#E5E8F0` (high contrast, not pure white) |

Buttons/inputs are 40–44px, radius 8–10px, motion 150–250ms, and
`prefers-reduced-motion` disables animation globally.

## Backend integration

Replace the bodies of the service functions in `src/services/*` with HTTP
calls. Signatures are the contract — see
[docs/api-contract.md](docs/api-contract.md).
