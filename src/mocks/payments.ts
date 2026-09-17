import type { Payment } from "@/types";

export const mockPayments: Payment[] = [
  {
    id: "pay_1031",
    number: "NOVA-260902-1031",
    createdAt: "2026-09-02T14:05:00Z",
    description: "Network Access — 90 Days",
    amount: 18.9,
    status: "completed",
    method: "crypto",
  },
  {
    id: "pay_1004",
    number: "NOVA-260721-1004",
    createdAt: "2026-07-21T11:12:00Z",
    description: "Network Access — 30 Days",
    amount: 6.9,
    status: "completed",
    method: "card",
  },
  {
    id: "pay_0988",
    number: "NOVA-260620-0988",
    createdAt: "2026-06-20T08:44:00Z",
    description: "Network Access — 30 Days",
    amount: 6.9,
    status: "refunded",
    method: "card",
  },
];
