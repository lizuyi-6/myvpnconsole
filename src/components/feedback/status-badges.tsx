import { Badge } from "@/components/ui/badge";
import type { OrderStatus, TicketStatus, UserProductStatus } from "@/types";

type Variant = "neutral" | "primary" | "success" | "warning" | "danger";

const ORDER_VARIANTS: Record<OrderStatus, Variant> = {
  paid: "primary",
  processing: "warning",
  delivered: "success",
  refunded: "neutral",
};

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  return (
    <Badge variant={ORDER_VARIANTS[status]} dot>
      {status === "paid"
        ? "Paid"
        : status === "processing"
          ? "Processing"
          : status === "delivered"
            ? "Delivered"
            : "Refunded"}
    </Badge>
  );
}

const PRODUCT_VARIANTS: Record<UserProductStatus, Variant> = {
  active: "success",
  expiring: "warning",
  expired: "neutral",
};

export function UserProductStatusBadge({ status }: { status: UserProductStatus }) {
  return (
    <Badge variant={PRODUCT_VARIANTS[status]} dot>
      {status === "active" ? "Active" : status === "expiring" ? "Expiring soon" : "Expired"}
    </Badge>
  );
}

const TICKET_VARIANTS: Record<TicketStatus, Variant> = {
  open: "primary",
  answered: "warning",
  closed: "neutral",
};

export function TicketStatusBadge({ status }: { status: TicketStatus }) {
  return (
    <Badge variant={TICKET_VARIANTS[status]} dot>
      {status === "open" ? "Open" : status === "answered" ? "Answered" : "Closed"}
    </Badge>
  );
}
