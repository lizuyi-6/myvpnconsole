import { zodResolver } from "@hookform/resolvers/zod";
import { LifeBuoy, Loader2, Plus, Wifi, Wrench } from "lucide-react";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { EmptyState } from "@/components/feedback/empty-state";
import { ErrorState } from "@/components/feedback/error-state";
import { StatusDot } from "@/components/feedback/status-dot";
import { PageHeader } from "@/components/layout/page-header";
import { Panel, PanelLink } from "@/components/layout/panel";
import { SideRail } from "@/components/layout/side-rail";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { FieldError } from "@/components/ui/field-error";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/toast";
import { useAsync } from "@/hooks/use-async";
import { useI18n, type Dictionary } from "@/i18n";
import { billingService } from "@/services/billing";
import { networkService } from "@/services/network";
import { supportService } from "@/services/support";
import type { TicketCategory, TicketStatus } from "@/types";

const TICKET_STATUS_TONE: Record<TicketStatus, "success" | "warning" | "neutral"> = {
  open: "warning",
  answered: "success",
  closed: "neutral",
};

const TICKET_CATEGORIES: TicketCategory[] = [
  "account",
  "connection",
  "payment",
  "subscription",
  "other",
];

function buildTicketSchema(dict: Dictionary) {
  const errors = dict.console.support.dialog.errors;
  return z.object({
    subject: z.string().min(4, errors.subjectMin),
    category: z.enum([
      "account",
      "connection",
      "payment",
      "subscription",
      "other",
    ]),
    paymentNumber: z.string().optional(),
    message: z.string().min(20, errors.messageMin),
  });
}

type TicketForm = z.infer<ReturnType<typeof buildTicketSchema>>;

function CreateTicketDialog({ onCreated }: { onCreated: () => void }) {
  const [open, setOpen] = useState(false);
  const { t, dict } = useI18n();
  const { toast } = useToast();
  const payments = useAsync(
    () => (open ? billingService.listPayments() : Promise.resolve([])),
    [open],
  );
  const schema = useMemo(() => buildTicketSchema(dict), [dict]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<TicketForm>({
    resolver: zodResolver(schema),
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
    toast(t("console.support.createdToast"));
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <Plus className="size-4" />
          {t("console.support.createTicket")}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>{t("console.support.dialog.title")}</DialogTitle>
        <DialogDescription>
          {t("console.support.dialog.body")}
        </DialogDescription>

        <form onSubmit={onSubmit} className="mt-5 space-y-4" noValidate>
          <div className="space-y-1.5">
            <Label htmlFor="subject">
              {t("console.support.dialog.subject")}
            </Label>
            <Input
              id="subject"
              placeholder={t("console.support.dialog.subjectPlaceholder")}
              aria-invalid={!!errors.subject}
              aria-describedby={
                errors.subject ? "ticket-subject-error" : undefined
              }
              {...register("subject")}
            />
            <FieldError
              id="ticket-subject-error"
              message={errors.subject?.message}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="category">
                {t("console.support.dialog.category")}
              </Label>
              <Select id="category" {...register("category")}>
                {TICKET_CATEGORIES.map((value) => (
                  <option key={value} value={value}>
                    {t(`common.ticketCategory.${value}`)}
                  </option>
                ))}
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="paymentNumber">
                {t("console.support.dialog.relatedPayment")}
              </Label>
              <Select id="paymentNumber" {...register("paymentNumber")}>
                <option value="">
                  {t("console.support.dialog.noPayment")}
                </option>
                {(payments.data ?? []).map((payment) => (
                  <option key={payment.id} value={payment.number}>
                    {payment.number}
                  </option>
                ))}
              </Select>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="message">
              {t("console.support.dialog.message")}
            </Label>
            <Textarea
              id="message"
              rows={4}
              placeholder={t("console.support.dialog.messagePlaceholder")}
              aria-invalid={!!errors.message}
              aria-describedby={
                errors.message ? "ticket-message-error" : undefined
              }
              {...register("message")}
            />
            <FieldError
              id="ticket-message-error"
              message={errors.message?.message}
            />
          </div>

          <div className="flex justify-end gap-2 pt-1">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setOpen(false)}
              disabled={isSubmitting}
            >
              {t("common.cancel")}
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  {t("console.support.dialog.submitting")}
                </>
              ) : (
                t("console.support.dialog.submit")
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
  const status = useAsync(() => networkService.getStatus(), []);
  const { t, formatDate } = useI18n();

  return (
    <div>
      <PageHeader
        title={t("console.support.title")}
        description={t("console.support.description")}
        actions={<CreateTicketDialog onCreated={tickets.retry} />}
      />

      <div className="mt-6 grid items-start gap-6 xl:grid-cols-12">
        {/* Tickets */}
        <div className="xl:col-span-7">
          <Panel
            title={t("console.support.ticketsPanel")}
            bodyClassName="px-6 pb-2 pt-0 lg:px-7 lg:pb-2 lg:pt-0"
          >
            {tickets.loading ? (
              <div className="space-y-3 py-4">
                {[0, 1].map((i) => (
                  <Skeleton key={i} className="h-20 w-full" />
                ))}
              </div>
            ) : tickets.error ? (
              <div className="py-4">
                <ErrorState
                  message={t("console.support.loadError")}
                  onRetry={tickets.retry}
                />
              </div>
            ) : !tickets.data || tickets.data.length === 0 ? (
              <div className="py-4">
                <EmptyState
                  icon={LifeBuoy}
                  title={t("console.support.emptyTitle")}
                  message={t("console.support.emptyBody")}
                />
              </div>
            ) : (
              <ul className="divide-y divide-border">
                {tickets.data.map((ticket) => (
                  <li key={ticket.id} className="py-4">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex min-w-0 flex-wrap items-center gap-x-3 gap-y-1">
                        <h2 className="text-sm font-medium text-foreground">
                          {ticket.subject}
                        </h2>
                        <span className="inline-flex items-center gap-1.5 text-xs text-muted">
                          <StatusDot tone={TICKET_STATUS_TONE[ticket.status]} />
                          {t(`common.ticketStatus.${ticket.status}`)}
                        </span>
                        <span className="text-xs text-subtle">
                          {t(`common.ticketCategory.${ticket.category}`)}
                        </span>
                      </div>
                      <p className="text-xs text-subtle">
                        {t("console.support.updatedAt", {
                          date: formatDate(ticket.updatedAt),
                        })}
                      </p>
                    </div>
                    <p className="mt-1.5 line-clamp-2 text-[13px] leading-relaxed text-muted">
                      {ticket.message}
                    </p>
                    {ticket.paymentNumber && (
                      <p className="mt-1.5 font-mono text-xs text-subtle">
                        {t("console.support.paymentRef", {
                          number: ticket.paymentNumber,
                        })}
                      </p>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </Panel>
        </div>

        {/* Before opening a ticket */}
        <SideRail className="xl:col-span-5">
          <Panel title={t("console.support.beforePanel")}>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <Wifi className="mt-0.5 size-4 shrink-0 text-subtle" />
                <div>
                  <p className="font-medium text-foreground">
                    {t("console.support.checkStatus")}
                  </p>
                  <p className="mt-0.5 flex items-center gap-2 text-[13px] text-muted">
                    <StatusDot
                      tone={
                        status.data?.status === "operational"
                          ? "success"
                          : "warning"
                      }
                      pulse={status.data?.status === "operational"}
                    />
                    {status.data
                      ? status.data.status === "operational"
                        ? t("common.allSystemsOperational")
                        : t("common.someRegionsDegraded")
                      : "…"}
                  </p>
                  <p className="mt-1">
                    <PanelLink to="/network">
                      {t("console.support.regionStatus")}
                    </PanelLink>
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Wrench className="mt-0.5 size-4 shrink-0 text-subtle" />
                <div>
                  <p className="font-medium text-foreground">
                    {t("console.support.rerunSetup")}
                  </p>
                  <p className="mt-0.5 text-[13px] leading-relaxed text-muted">
                    {t("console.support.rerunBody")}
                  </p>
                  <p className="mt-1">
                    <PanelLink to="/console/setup">
                      {t("console.support.openSetup")}
                    </PanelLink>
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <LifeBuoy className="mt-0.5 size-4 shrink-0 text-subtle" />
                <div>
                  <p className="font-medium text-foreground">
                    {t("console.support.browseAnswers")}
                  </p>
                  <p className="mt-0.5 text-[13px] leading-relaxed text-muted">
                    {t("console.support.browseBody")}
                  </p>
                  <p className="mt-1">
                    <PanelLink to="/help">
                      {t("console.support.helpCenter")}
                    </PanelLink>
                  </p>
                </div>
              </li>
            </ul>
            <p className="mt-5 border-t border-border pt-4 text-[13px] leading-relaxed text-muted">
              {t("console.support.ticketTip")}
            </p>
          </Panel>
        </SideRail>
      </div>
    </div>
  );
}
