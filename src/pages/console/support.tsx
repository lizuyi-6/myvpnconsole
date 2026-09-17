import { zodResolver } from "@hookform/resolvers/zod";
import { LifeBuoy, Loader2, Plus } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { EmptyState } from "@/components/feedback/empty-state";
import { ErrorState } from "@/components/feedback/error-state";
import { StatusDot } from "@/components/feedback/status-dot";
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
import { billingService } from "@/services/billing";
import { supportService } from "@/services/support";
import {
  TICKET_CATEGORY_LABELS,
  type TicketCategory,
  type TicketStatus,
} from "@/types";

const TICKET_STATUS: Record<
  TicketStatus,
  { label: string; tone: "success" | "warning" | "neutral" }
> = {
  open: { label: "Open", tone: "warning" },
  answered: { label: "Answered", tone: "success" },
  closed: { label: "Closed", tone: "neutral" },
};

const ticketSchema = z.object({
  subject: z.string().min(4, "Give your ticket a short subject"),
  category: z.enum([
    "account",
    "connection",
    "payment",
    "subscription",
    "other",
  ]),
  paymentNumber: z.string().optional(),
  message: z.string().min(20, "Describe the issue in at least 20 characters"),
});

type TicketForm = z.infer<typeof ticketSchema>;

function CreateTicketDialog({ onCreated }: { onCreated: () => void }) {
  const [open, setOpen] = useState(false);
  const payments = useAsync(
    () => (open ? billingService.listPayments() : Promise.resolve([])),
    [open],
  );

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<TicketForm>({
    resolver: zodResolver(ticketSchema),
    defaultValues: {
      subject: "",
      category: "connection",
      paymentNumber: "",
      message: "",
    },
  });

  const onSubmit = handleSubmit(async (values) => {
    await supportService.createTicket({
      ...values,
      paymentNumber: values.paymentNumber || undefined,
    });
    // Only reset after a successful submit — failures keep the user's text.
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
          Describe the issue and we'll get back to you. Your draft stays put
          if submission fails.
        </DialogDescription>

        <form onSubmit={onSubmit} className="mt-5 space-y-4" noValidate>
          <div className="space-y-1.5">
            <Label htmlFor="subject">Subject</Label>
            <Input
              id="subject"
              placeholder="e.g. Slow speeds on Japan in the evening"
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
              <Label htmlFor="paymentNumber">Related payment</Label>
              <Select id="paymentNumber" {...register("paymentNumber")}>
                <option value="">None</option>
                {(payments.data ?? []).map((payment) => (
                  <option key={payment.id} value={payment.number}>
                    {payment.number}
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

export function ConsoleSupportPage() {
  const tickets = useAsync(() => supportService.listTickets(), []);

  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">Support</h1>
          <p className="mt-1 text-sm text-muted">
            Track existing tickets or open a new one.
          </p>
        </div>
        <CreateTicketDialog onCreated={tickets.retry} />
      </div>

      <div className="mt-8">
        {tickets.loading ? (
          <div className="space-y-3">
            {[0, 1].map((i) => (
              <Skeleton key={i} className="h-20 w-full" />
            ))}
          </div>
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
          <ul className="divide-y divide-border overflow-hidden rounded-xl border border-border bg-surface px-5 shadow-card">
            {tickets.data.map((ticket) => (
              <li key={ticket.id} className="py-5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex min-w-0 flex-wrap items-center gap-x-3 gap-y-1">
                    <h2 className="text-sm font-medium text-foreground">
                      {ticket.subject}
                    </h2>
                    <span className="inline-flex items-center gap-1.5 text-xs text-muted">
                      <StatusDot tone={TICKET_STATUS[ticket.status].tone} />
                      {TICKET_STATUS[ticket.status].label}
                    </span>
                    <span className="text-xs text-subtle">
                      {TICKET_CATEGORY_LABELS[ticket.category]}
                    </span>
                  </div>
                  <p className="text-xs text-subtle">
                    Updated {formatDate(ticket.updatedAt)}
                  </p>
                </div>
                <p className="mt-1.5 line-clamp-2 text-[13px] leading-relaxed text-muted">
                  {ticket.message}
                </p>
                {ticket.paymentNumber && (
                  <p className="mt-1.5 font-mono text-xs text-subtle">
                    Payment {ticket.paymentNumber}
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
