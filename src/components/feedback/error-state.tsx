import { AlertCircle, type LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/i18n";

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  icon?: LucideIcon;
}

/** Section-level error — never locks the whole page. */
export function ErrorState({
  title,
  message,
  onRetry,
  icon: Icon = AlertCircle,
}: ErrorStateProps) {
  const { t } = useI18n();
  return (
    <div
      role="alert"
      className="flex flex-col items-center justify-center gap-3 rounded-xl border border-border bg-surface px-6 py-14 text-center"
    >
      <div className="flex size-10 items-center justify-center rounded-lg border border-danger/25 bg-danger/10">
        <Icon className="size-5 text-danger" />
      </div>
      <div>
        <p className="text-sm font-medium text-foreground">
          {title ?? t("common.errorTitle")}
        </p>
        <p className="mt-1 text-sm text-muted">
          {message ?? t("common.errorMessage")}
        </p>
      </div>
      {onRetry && (
        <Button variant="secondary" size="sm" onClick={onRetry} className="mt-1">
          {t("common.retry")}
        </Button>
      )}
    </div>
  );
}
