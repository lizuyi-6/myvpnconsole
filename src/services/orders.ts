import { mockOrders } from "@/mocks/orders";
import {
  delay,
  readStorage,
  ServiceError,
  writeStorage,
} from "@/services/mock-transport";
import type { CreateOrderInput, Order } from "@/types";

/**
 * Order service.
 * Backend contract: GET /orders, GET /orders/:id, POST /orders
 *
 * Orders created in this mock session are persisted to localStorage so
 * they survive page refreshes and appear alongside the seed orders.
 */
export interface OrderService {
  listOrders(): Promise<Order[]>;
  getOrder(idOrNumber: string): Promise<Order>;
  createOrder(input: CreateOrderInput): Promise<Order>;
}

const CREATED_ORDERS_KEY = "nova.created-orders";

function generateOrderNumber(): string {
  const now = new Date();
  const yy = String(now.getFullYear()).slice(2);
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const dd = String(now.getDate()).padStart(2, "0");
  const seq = String(Math.floor(1000 + Math.random() * 9000));
  return `NOVA-${yy}${mm}${dd}-${seq}`;
}

function allOrders(): Order[] {
  const created = readStorage<Order[]>(CREATED_ORDERS_KEY, []);
  return [...created, ...mockOrders].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
}

export const orderService: OrderService = {
  async listOrders() {
    await delay();
    return allOrders();
  },

  async getOrder(idOrNumber) {
    await delay(200, 400);
    const order = allOrders().find(
      (o) => o.id === idOrNumber || o.number === idOrNumber,
    );
    if (!order) {
      throw new ServiceError("Order not found.", 404);
    }
    return order;
  },

  async createOrder(input) {
    // Simulates payment processing
    await delay(1000, 1300);

    const subtotal = round2(
      input.items.reduce(
        (sum, item) => sum + item.listUnitPrice * item.quantity,
        0,
      ),
    );
    const total = round2(
      input.items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0),
    );

    const order: Order = {
      id: `o_${Date.now().toString(36)}`,
      number: generateOrderNumber(),
      createdAt: new Date().toISOString(),
      status: "delivered",
      items: input.items,
      subtotal,
      discount: round2(Math.max(0, subtotal - total)),
      total,
      paymentMethod: input.paymentMethod,
      contactEmail: input.contact.email,
    };

    const created = readStorage<Order[]>(CREATED_ORDERS_KEY, []);
    writeStorage(CREATED_ORDERS_KEY, [order, ...created]);
    return order;
  },
};

function round2(value: number): number {
  return Math.round(value * 100) / 100;
}
