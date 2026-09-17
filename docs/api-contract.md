# Backend API Contract

The frontend talks to services defined in `src/services/*`. To go live,
implement these endpoints and swap the mock bodies for HTTP calls — no page
component changes required.

All endpoints are JSON. Auth endpoints return a session token; all other
endpoints expect `Authorization: Bearer <token>`. Error shape:

```json
{ "error": { "code": "string", "message": "Human readable message" } }
```

## Auth

| Method | Path | Body | Returns |
|---|---|---|---|
| POST | `/auth/register` | `{ name, email, password }` | `{ user, token }` |
| POST | `/auth/login` | `{ email, password }` | `{ user, token }` |
| GET | `/auth/me` | — | `{ user }` |

`401` on invalid credentials. Validation errors: `400` with field messages.

## Catalog (public)

| Method | Path | Query | Returns |
|---|---|---|---|
| GET | `/products` | `category?` `planDays?` `stock?` `search?` | `Product[]` |
| GET | `/products/:slug` | — | `Product` (404 if missing) |

`Product` shape: `src/types/index.ts` — includes `plans[]`, `tiers[]`
(volume pricing), `stock { status, quantity }`, `features[]`, `notes[]`,
`faq[]`. **Never expose supplier, cost, or internal inventory fields.**

## Cart & pricing

Pricing is computed client-side from `tiers` + `plans` (see
`src/lib/pricing.ts`). The backend **must recompute and verify** prices at
checkout — never trust client totals.

| Method | Path | Body | Returns |
|---|---|---|---|
| POST | `/orders` | `CreateOrderInput` | `Order` |
| GET | `/orders` | — | `Order[]` (current user, newest first) |
| GET | `/orders/:idOrNumber` | — | `Order` (404 if missing) |

`CreateOrderInput`:
```json
{
  "items": [
    {
      "productSlug": "gemini-pro",
      "name": "Gemini Pro",
      "category": "ai",
      "planLabel": "30 Days",
      "quantity": 25,
      "listUnitPrice": 19.9,
      "unitPrice": 15.9
    }
  ],
  "contact": { "name": "Alex Chen", "email": "alex@example.com" },
  "paymentMethod": "card | crypto | balance",
  "cardLast4": "4242"
}
```

`Order.status`: `paid | processing | delivered | refunded`.
`Order.number` format: `NOVA-YYMMDD-NNNN`.

## Library (purchased AI accounts)

| Method | Path | Returns |
|---|---|---|
| GET | `/library/products` | `UserProduct[]` |
| GET | `/library/products/:id` | `UserProduct` |

`UserProduct.credentials { email, password }` — should only be served over
authenticated TLS requests; the UI masks the password until the user reveals
it.

## Network subscriptions

| Method | Path | Returns |
|---|---|---|
| GET | `/subscriptions` | `Subscription[]` |
| GET | `/subscriptions/:id` | `Subscription` |
| POST | `/subscriptions/:id/regenerate-link` | `{ subscriptionToken }` |

`regenerate-link` **invalidates the previous token** (UI confirms first).
`Subscription.regions[]` contains display names only — upstream/provider
data stays server-side.

## Support

| Method | Path | Body | Returns |
|---|---|---|---|
| GET | `/tickets` | — | `Ticket[]` |
| POST | `/tickets` | `{ subject, category, orderNumber?, message }` | `Ticket` |

`category`: `account | subscription | payment | replacement | other`.
`status`: `open | answered | closed`.
