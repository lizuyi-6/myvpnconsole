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

`401` on invalid credentials.

## Plans (public)

| Method | Path | Returns |
|---|---|---|
| GET | `/plans` | `Plan[]` |
| GET | `/plans/:id` | `Plan` (404 if missing) |

```json
{ "id": "90d", "durationDays": 90, "label": "90 Days", "price": 18.9 }
```

One service (Network Access), three durations. The only variable is time.

## Network (public)

| Method | Path | Returns |
|---|---|---|
| GET | `/network/status` | `NetworkStatus` |
| GET | `/network/regions` | `Region[]` |

```json
// NetworkStatus
{ "status": "operational", "activeRegions": 9, "totalRegions": 10, "updatedAt": "…" }
// Region
{ "id": "jp", "name": "Japan", "status": "available | degraded | offline", "latencyMs": 61 }
```

`latencyMs` may be `null` when no measurement exists — the UI renders `—`.

## Billing

| Method | Path | Body | Returns |
|---|---|---|---|
| GET | `/billing/payments` | — | `Payment[]` (current user, newest first) |
| POST | `/billing/payments` | `CreatePaymentInput` | `Payment` |

```json
// CreatePaymentInput
{
  "planId": "90d",
  "contact": { "name": "Alex Chen", "email": "alex@example.com" },
  "paymentMethod": "card | crypto | balance",
  "cardLast4": "4242"
}
```

A successful payment **activates or extends the subscription**: if the
subscription is active, the duration is added to the current expiry; if
expired, from the purchase time. Payment `status`:
`completed | processing | refunded`. Payment `number` format:
`NOVA-YYMMDD-NNNN`.

## Subscription

| Method | Path | Returns |
|---|---|---|
| GET | `/subscription` | `Subscription` |
| POST | `/subscription/regenerate-link` | `{ subscriptionToken }` |

```json
// Subscription
{
  "id": "sub_01",
  "name": "Network Access",
  "status": "active | expired",
  "planLabel": "90 Days",
  "expiresAt": "2026-12-02T14:05:00Z",
  "deviceLimit": 5,
  "subscriptionToken": "9f2c7a1e4b6d4e8f"
}
```

The subscription URL is assembled client-side as
`https://sub.<domain>/s/<token>`. `regenerate-link` **must invalidate the
previous token** — the UI warns and confirms before calling it.

## Devices

| Method | Path | Body | Returns |
|---|---|---|---|
| GET | `/devices` | — | `Device[]` |
| PATCH | `/devices/:id` | `{ name }` | `Device` |
| DELETE | `/devices/:id` | — | `204` |

```json
{ "id": "dev_01", "name": "Windows Laptop", "platform": "windows | macos | ios | android | linux", "lastActiveAt": "…" }
```

## Support

| Method | Path | Body | Returns |
|---|---|---|---|
| GET | `/tickets` | — | `Ticket[]` |
| POST | `/tickets` | `{ subject, category, paymentNumber?, message }` | `Ticket` |

`category`: `account | connection | payment | subscription | other`.
`status`: `open | answered | closed`.

## Server-side notes

- Never expose supplier, upstream, node-ID, or cost fields in any response —
  the frontend is the customer-facing boundary.
- Prices are authoritative server-side; the client only displays them.
