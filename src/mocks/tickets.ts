import type { Ticket } from "@/types";

export const mockTickets: Ticket[] = [
  {
    id: "t_02",
    subject: "Slow speeds on Japan region in the evening",
    category: "connection",
    status: "answered",
    message:
      "Throughput drops to a few Mbps between 8–11pm local time on Japan. Other regions are fine.",
    createdAt: "2026-09-12T07:24:00Z",
    updatedAt: "2026-09-12T09:10:00Z",
  },
  {
    id: "t_01",
    subject: "Invoice for June payment",
    category: "payment",
    status: "closed",
    paymentNumber: "NOVA-260620-0988",
    message: "Could I get a PDF invoice for my June payment?",
    createdAt: "2026-08-19T13:02:00Z",
    updatedAt: "2026-08-20T10:45:00Z",
  },
];
