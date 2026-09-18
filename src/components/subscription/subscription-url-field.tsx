import { Check, Copy, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { useCopy } from "@/hooks/use-copy";
import { useI18n } from "@/i18n";
import { cn } from "@/lib/utils";

export function subscriptionUrl(token: string): string {
  return `https://sub.nova.example/s/${token}`;
}

interface SubscriptionUrlFieldProps {
  token: string;
  className?: string;
}

/**
 * Masked subscription URL with reveal + copy.
 * The token is never rendered until the user asks for it.
 */
export function SubscriptionUrlField({
  token,
  className,
}: SubscriptionUrlFieldProps) {
  const [revealed, setRevealed] = useState(false);
  const { copied, copy } = useCopy();
  const { toast } = useToast();
  const { t } = useI18n();
  const url = subscriptionUrl(token);

  return (
    <div className={cn("flex items-center gap-1", className)}>
      <p className="min-w-0 flex-1 truncate rounded-md border border-border bg-background px-3 py-2.5 font-mono text-[13px] text-foreground">
        {revealed ? url : subscriptionUrl("••••••••••••••••")}
      </p>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setRevealed((v) => !v)}
        aria-label={revealed ? t("common.hideUrl") : t("common.showUrl")}
        aria-pressed={revealed}
      >
        {revealed ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => {
          copy(url);
          toast(t("common.copied"));
        }}
        aria-label={t("common.copyUrl")}
      >
        {copied ? (
          <Check className="size-4 text-success" />
        ) : (
          <Copy className="size-4" />
        )}
      </Button>
    </div>
  );
}
