import { ArrowLeft, Check, Copy, Eye, EyeOff, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ErrorState } from "@/components/feedback/error-state";
import { UserProductStatusBadge } from "@/components/feedback/status-badges";
import { ProductIconTile } from "@/components/product/product-icon-tile";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAsync } from "@/hooks/use-async";
import { useCopy } from "@/hooks/use-copy";
import { formatDate } from "@/lib/utils";
import { libraryService } from "@/services/library";

function CredentialRow({
  label,
  value,
  masked,
  onToggleMask,
  showToggle,
}: {
  label: string;
  value: string;
  masked: boolean;
  onToggleMask?: () => void;
  showToggle?: boolean;
}) {
  const { copied, copy } = useCopy();
  const shown = masked ? "••••••••••••" : value;

  return (
    <div className="flex flex-col gap-2 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0">
        <p className="text-xs text-subtle">{label}</p>
        <p className="mt-1 truncate font-mono text-sm text-foreground">
          {shown}
        </p>
      </div>
      <div className="flex items-center gap-1">
        {showToggle && (
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={onToggleMask}
            aria-label={masked ? `Show ${label.toLowerCase()}` : `Hide ${label.toLowerCase()}`}
          >
            {masked ? <Eye className="size-4" /> : <EyeOff className="size-4" />}
          </Button>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => copy(value)}
          aria-label={`Copy ${label.toLowerCase()}`}
        >
          {copied ? (
            <>
              <Check className="size-3.5 text-success" />
              Copied
            </>
          ) : (
            <>
              <Copy className="size-3.5" />
              Copy
            </>
          )}
        </Button>
      </div>
    </div>
  );
}

export function MyProductDetailPage() {
  const { id = "" } = useParams();
  const { data: product, loading, error, retry } = useAsync(
    () => libraryService.getUserProduct(id),
    [id],
  );
  // Sensitive fields stay hidden until the user explicitly reveals them.
  const [showPassword, setShowPassword] = useState(false);

  if (loading) {
    return (
      <div>
        <Skeleton className="h-5 w-32" />
        <Skeleton className="mt-6 h-24 rounded-xl" />
        <Skeleton className="mt-4 h-40 rounded-xl" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div>
        <ErrorState
          title="Couldn't load this product"
          message="It may have been removed, or the request failed."
          onRetry={retry}
        />
        <Button asChild variant="ghost" size="sm" className="mt-4">
          <Link to="/dashboard/products">
            <ArrowLeft className="size-4" />
            Back to My Products
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl">
      <Button asChild variant="ghost" size="sm" className="-ml-3">
        <Link to="/dashboard/products">
          <ArrowLeft className="size-4" />
          My Products
        </Link>
      </Button>

      <div className="mt-4 flex items-center gap-4 rounded-xl border border-border bg-surface p-5">
        <ProductIconTile icon={product.icon} accent={product.accent} />
        <div className="min-w-0 flex-1">
          <h1 className="text-lg font-semibold text-foreground">
            {product.name}
          </h1>
          <p className="mt-0.5 text-xs text-subtle">
            Order <span className="font-mono">#{product.orderNumber}</span>
          </p>
        </div>
        <UserProductStatusBadge status={product.status} />
      </div>

      <dl className="mt-4 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-border bg-border">
        <div className="bg-surface px-5 py-4">
          <dt className="text-xs text-subtle">Status</dt>
          <dd className="mt-1 text-sm font-medium capitalize text-foreground">
            {product.status}
          </dd>
        </div>
        <div className="bg-surface px-5 py-4">
          <dt className="text-xs text-subtle">Expires</dt>
          <dd className="mt-1 text-sm font-medium text-foreground">
            {formatDate(product.expiresAt)}
          </dd>
        </div>
      </dl>

      <section className="mt-6">
        <h2 className="text-[15px] font-semibold text-foreground">
          Credentials
        </h2>
        <div className="mt-3 divide-y divide-border rounded-xl border border-border bg-surface">
          <CredentialRow
            label="Email"
            value={product.credentials.email}
            masked={false}
          />
          <CredentialRow
            label="Password"
            value={product.credentials.password}
            masked={!showPassword}
            onToggleMask={() => setShowPassword((v) => !v)}
            showToggle
          />
        </div>
        <p className="mt-3 flex items-start gap-2 text-xs leading-relaxed text-subtle">
          <ShieldCheck className="mt-0.5 size-3.5 shrink-0" />
          Credentials are hidden by default and only revealed when you ask.
          Never share them publicly. If they stop working during your
          subscription period, open a replacement ticket.
        </p>
      </section>

      <div className="mt-6">
        <Button asChild variant="secondary">
          <Link to={`/dashboard/support`}>Request replacement</Link>
        </Button>
      </div>
    </div>
  );
}
