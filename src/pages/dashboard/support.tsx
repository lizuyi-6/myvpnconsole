import { zodResolver } from "@hookform/resolvers/zod";
import { LifeBuoy, Loader2, Plus } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useSearchParams } from "react-router-dom";
import { z } from "zod";
import { EmptyState } from "@/components/feedback/empty-state";
import { ErrorState } from "@/components/feedback/error-state";
import { TicketStatusBadge } from "@/components/feedback/status-badges";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { useAsync } from "@/hooks/use-async";
import { formatDate } from "@/lib/utils";
import { orderService } from "@/services/orders";
import { supportService } from "@/services/support";
import { TICKET_CATEGORY_LABELS, type TicketCategory } from "@/types";

const ticketSchema = z.object({
  subject: z.string().min(4, "Give your ticket a short subject"),
  category: z.enum(["account", "subscription", "payment", "replacement", "other"]),
  orderNumber: z.string().optional(),
  message: z.string().min(20, "Describe the issue in at least 20 characters"),
});

type TicketForm = z.infer<typeof ticketSchema>;

function CreateTicketDialog({ onCreated }: { onCreated: () => void }) {
  const [open, setOpen] = useState(false);
  const [searchParams] = useSearchParams();
  const prefillOrder = searchParams.get("order") ?? "";

  const orders = useAsync(() => orderService.listOrders(), [open]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<TicketForm>({
    resolver: zodResolver(ticketSchema),
    defaultValues: {
      subject: "",
      category: "account",
      orderNumber: prefillOrder,
      message: "",
    },
  });

  const onSubmit = handleSubmit(async (values) => {
    await supportService.createTicket({
      ...values,
      orderNumber: values.orderNumber || undefined,
    });
    // Success: close and refresh the list; only reset after success
    reset();
    setOpen(false);
    onCreated();
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <Plus className="size-4" />
          Create ticket
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>Create a ticket</DialogTitle>
        <DialogDescription>
          Describe the issue and we'll get back to you. Fields stay filled if
          submission fails.
        </DialogDescription>

        <form onSubmit={onSubmit} className="mt-5 space-y-4" noValidate>
          <div className="space-y-1.5">
            <Label htmlFor="subject">Subject</Label>
            <Input
              id="subject"
              placeholder="e.g. Replacement for Gemini Pro"
              aria-invalid={!!errors.subject}
              {...register("subject")}
            />
            {errors.subject && (
              <p className="text-xs text-danger">{errors.subject.message}</p>
            )}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="category">Category</Label>
              <Select id="category" {...register("category")}>
                {(
                  Object.entries(TICKET_CATEGORY_LABELS) as [
                    TicketCategory,
                    string,
                  ][]
                ).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="orderNumber">Related order</Label>
              <Select id="orderNumber" {...register("orderNumber")}>
                <option value="">None</option>
                {(orders.data ?? []).map((order) => (
                  <option key={order.id} value={order.number}>
                    {order.number}
                  </option>
                ))}
              </Select>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="message">Message</Label>
            <Textarea
              id="message"
              rows={4}
              placeholder="What happened, and what did you expect?"
              aria-invalid={!!errors.message}
              {...register("message")}
            />
            {errors.message && (
              <p className="text-xs text-danger">{errors.message.message}</p>
            )}
          </div>

          <div className="flex justify-end gap-2 pt-1">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Submitting…
                </>
              ) : (
                "Submit ticket"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export function SupportPage() {
  const tickets = useAsync(() => supportService.listTickets(), []);

  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Support
          </h1>
          <p className="mt-1 text-sm text-muted">
            Track existing tickets or open a new one.
          </p>
        </div>
        <CreateTicketDialog onCreated={tickets.retry} />
      </div>

      <div className="mt-8">
        {tickets.loading ? (
          <ul className="space-y-3">
            {[0, 1].map((i) => (
              <Skeleton key={i} className="h-20 rounded-xl" />
            ))}
          </ul>
        ) : tickets.error ? (
          <ErrorState
            message="We couldn't load your tickets."
            onRetry={tickets.retry}
          />
        ) : !tickets.data || tickets.data.length === 0 ? (
          <EmptyState
            icon={LifeBuoy}
            title="No tickets"
            message="You haven't opened any support tickets yet."
          />
        ) : (
          <ul className="space-y-3">
            {tickets.data.map((ticket) => (
              <li
                key={ticket.id}
                className="rounded-xl border border-border bg-surface p-5"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex min-w-0 flex-wrap items-center gap-2">
                    <h2 className="text-sm font-medium text-foreground">
                      {ticket.subject}
                    </h2>
                    <TicketStatusBadge status={ticket.status} />
                    <Badge variant="neutral">
                      {TICKET_CATEGORY_LABELS[ticket.category]}
                    </Badge>
                  </div>
                  <p className="text-xs text-subtle">
                    Updated {formatDate(ticket.updatedAt)}
                  </p>
                </div>
                <p className="mt-2 line-clamp-2 text-[13px] leading-relaxed text-muted">
                  {ticket.message}
                </p>
                {ticket.orderNumber && (
                  <p className="mt-2 font-mono text-xs text-subtle">
                    Order #{ticket.orderNumber}
                  </p>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
