import {
  ArrowLeft,
  Check,
  Copy,
  Eye,
  EyeOff,
  Loader2,
  MapPin,
  RefreshCw,
} from "lucide-react";
import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ErrorState } from "@/components/feedback/error-state";
import { ProductIconTile } from "@/components/product/product-icon-tile";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { useAsync } from "@/hooks/use-async";
import { useCopy } from "@/hooks/use-copy";
import { formatDate } from "@/lib/utils";
import { subscriptionService } from "@/services/library";

function subscriptionUrl(token: string): string {
  return `https://sub.nova.example/s/${token}`;
}

export function SubscriptionManagePage() {
  const { id = "" } = useParams();
  const { data, loading, error, retry } = useAsync(
    () => subscriptionService.getSubscription(id),
    [id],
  );

  const [token, setToken] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [regenerating, setRegenerating] = useState(false);
  const [regenerated, setRegenerated] = useState(false);
  const { copied, copy } = useCopy();

  if (loading) {
    return (
      <div>
        <Skeleton className="h-5 w-32" />
        <Skeleton className="mt-6 h-24 rounded-xl" />
        <Skeleton className="mt-4 h-32 rounded-xl" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div>
        <ErrorState
          title="Couldn't load this subscription"
          onRetry={retry}
        />
        <Button asChild variant="ghost" size="sm" className="mt-4">
          <Link to="/dashboard/subscriptions">
            <ArrowLeft className="size-4" />
            Back to Subscriptions
          </Link>
        </Button>
      </div>
    );
  }

  const activeToken = token ?? data.subscriptionToken;
  const url = subscriptionUrl(activeToken);

  const handleRegenerate = async () => {
    setRegenerating(true);
    try {
      const result = await subscriptionService.regenerateLink(data.id);
      setToken(result.subscriptionToken);
      setRevealed(true);
      setRegenerated(true);
      setConfirmOpen(false);
    } finally {
      setRegenerating(false);
    }
  };

  return (
    <div className="max-w-2xl">
      <Button asChild variant="ghost" size="sm" className="-ml-3">
        <Link to="/dashboard/subscriptions">
          <ArrowLeft className="size-4" />
          Subscriptions
        </Link>
      </Button>

      <div className="mt-4 flex items-center gap-4 rounded-xl border border-border bg-surface p-5">
        <ProductIconTile icon={data.icon} accent={data.accent} />
        <div className="min-w-0 flex-1">
          <h1 className="text-lg font-semibold text-foreground">{data.name}</h1>
          <p className="mt-0.5 text-xs text-subtle">
            Expires {formatDate(data.expiresAt)} · Devices {data.devicesUsed} /{" "}
            {data.deviceLimit}
          </p>
        </div>
        {data.status === "active" ? (
          <Badge variant="success" dot>
            Active
          </Badge>
        ) : (
          <Badge variant="neutral" dot>
            Expired
          </Badge>
        )}
      </div>

      {/* Subscription URL */}
      <section className="mt-6">
        <h2 className="text-[15px] font-semibold text-foreground">
          Subscription URL
        </h2>
        <p className="mt-1 text-xs text-subtle">
          Paste this into any compatible client. Keep it private.
        </p>

        <div className="mt-3 flex flex-col gap-2 rounded-xl border border-border bg-surface p-4 sm:flex-row sm:items-center">
          <p className="min-w-0 flex-1 truncate rounded-lg border border-border bg-background px-3 py-2.5 font-mono text-[13px] text-foreground">
            {revealed ? url : subscriptionUrl("••••••••••••••••")}
          </p>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setRevealed((v) => !v)}
              aria-label={revealed ? "Hide subscription URL" : "Show subscription URL"}
            >
              {revealed ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => copy(url)}
              aria-label="Copy subscription URL"
            >
              {copied ? (
                <Check className="size-4 text-success" />
              ) : (
                <Copy className="size-4" />
              )}
            </Button>
          </div>
        </div>

        {regenerated && (
          <p className="mt-3 flex items-center gap-2 rounded-lg border border-success/25 bg-success/[0.08] px-4 py-2.5 text-[13px] text-success">
            <Check className="size-4" />
            New link generated. Your previous URL no longer works.
          </p>
        )}

        {/* Dangerous action — requires confirmation */}
        <Button
          variant="outline"
          size="sm"
          className="mt-4"
          onClick={() => setConfirmOpen(true)}
        >
          <RefreshCw className="size-3.5" />
          Regenerate link
        </Button>

        <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
          <DialogContent>
            <DialogTitle>Regenerate subscription link?</DialogTitle>
            <DialogDescription>
              Regenerating the link will invalidate your previous subscription
              URL. Any client using the old link will stop working until you
              update it.
            </DialogDescription>
            <div className="mt-6 flex justify-end gap-2">
              <Button
                variant="secondary"
                onClick={() => setConfirmOpen(false)}
                disabled={regenerating}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleRegenerate}
                disabled={regenerating}
              >
                {regenerating ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    Regenerating…
                  </>
                ) : (
                  "Regenerate"
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </section>

      {/* Regions */}
      <section className="mt-8">
        <h2 className="text-[15px] font-semibold text-foreground">
          Available regions
        </h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {data.regions.map((region) => (
            <span
              key={region}
              className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-surface px-3 py-1.5 text-[13px] text-muted"
            >
              <MapPin className="size-3.5 text-subtle" />
              {region}
            </span>
          ))}
        </div>
      </section>
    </div>
  );
}
