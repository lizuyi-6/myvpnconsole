import { mockTickets } from "@/mocks/tickets";
import {
  delay,
  readStorage,
  writeStorage,
} from "@/services/mock-transport";
import type { CreateTicketInput, Ticket } from "@/types";

/**
 * Support tickets.
 * Backend contract: GET /tickets, POST /tickets
 *
 * Note: the create endpoint treats missing fields as a client error so the
 * UI keeps the user's input on failure instead of resetting the form.
 */
export interface SupportService {
  listTickets(): Promise<Ticket[]>;
  createTicket(input: CreateTicketInput): Promise<Ticket>;
}

const CREATED_TICKETS_KEY = "nova.created-tickets";

export const supportService: SupportService = {
  async listTickets() {
    await delay();
    const created = readStorage<Ticket[]>(CREATED_TICKETS_KEY, []);
    return [...created, ...mockTickets].sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
    );
  },

  async createTicket(input) {
    await delay(500, 800);
    const now = new Date().toISOString();
    const ticket: Ticket = {
      id: `t_${Date.now().toString(36)}`,
      status: "open",
      createdAt: now,
      updatedAt: now,
      ...input,
    };
    const created = readStorage<Ticket[]>(CREATED_TICKETS_KEY, []);
    writeStorage(CREATED_TICKETS_KEY, [ticket, ...created]);
    return ticket;
  },
};
