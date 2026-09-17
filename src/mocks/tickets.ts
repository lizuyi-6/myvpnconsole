import type { Ticket } from "@/types";

export const mockTickets: Ticket[] = [
  {
    id: "t_02",
    subject: "Replacement request for Claude Pro",
    category: "replacement",
    status: "answered",
    orderNumber: "NOVA-260825-0991",
    message:
      "The account credentials stopped working this morning. Could you check and replace if needed?",
    createdAt: "2026-09-12T07:24:00Z",
    updatedAt: "2026-09-12T09:10:00Z",
  },
  {
    id: "t_01",
    subject: "Invoice for August order",
    category: "payment",
    status: "closed",
    orderNumber: "NOVA-260818-1018",
    message: "Could I get a PDF invoice for my August purchase?",
    createdAt: "2026-08-19T13:02:00Z",
    updatedAt: "2026-08-20T10:45:00Z",
  },
];
