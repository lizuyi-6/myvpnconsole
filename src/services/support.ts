import { api } from "@/lib/api-client";
import type { CreateTicketInput, Ticket } from "@/types";

/**
 * Support tickets.
 * API: GET /tickets, POST /tickets
 *
 * The create endpoint treats invalid fields as a client error so the
 * UI keeps the user's input on failure instead of resetting the form.
 */
export interface SupportService {
  listTickets(): Promise<Ticket[]>;
  createTicket(input: CreateTicketInput): Promise<Ticket>;
}

export const supportService: SupportService = {
  listTickets() {
    return api<Ticket[]>("/tickets");
  },

  createTicket(input) {
    return api<Ticket>("/tickets", { method: "POST", body: input });
  },
};
