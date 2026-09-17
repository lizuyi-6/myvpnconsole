import { Badge } from "@/components/ui/badge";
import type { Product } from "@/types";

export function StockBadge({ stock }: { stock: Product["stock"] }) {
  if (stock.status === "in_stock") {
    return (
      <Badge variant="success" dot>
        In stock
      </Badge>
    );
  }
  if (stock.status === "low_stock") {
    return (
      <Badge variant="warning" dot>
        Low stock · {stock.quantity} left
      </Badge>
    );
  }
  return (
    <Badge variant="neutral" dot>
      Out of stock
    </Badge>
  );
}
