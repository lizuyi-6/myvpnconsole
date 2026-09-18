import {
  Laptop,
  LifeBuoy,
  Monitor,
  Smartphone,
  TabletSmartphone,
  Terminal,
} from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { StatusDot } from "@/components/feedback/status-dot";
import { Container } from "@/components/layout/container";
import { PageHeader } from "@/components/layout/page-header";
import { Panel, PanelLink } from "@/components/layout/panel";
import { SideRail } from "@/components/layout/side-rail";
import { PLATFORM_GUIDES, SetupGuide } from "@/components/setup/setup-guide";
import { SubscriptionUrlField } from "@/components/subscription/subscription-url-field";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAsync } from "@/hooks/use-async";
import { useI18n } from "@/i18n";
import { cn } from "@/lib/utils";
import { deviceService } from "@/services/devices";
import { networkService } from "@/services/network";
import { subscriptionService } from "@/services/subscription";
import { useAuthStore } from "@/store/auth";
import type { DevicePlatform } from "@/types";

const PLATFORM_ICONS: Record<DevicePlatform, typeof Monitor> = {
  windows: Monitor,
  macos: Laptop,
  ios: Smartphone,
  android: TabletSmartphone,
  linux: Terminal,
};

/** Left rail — desktop platform navigation for the guide. */
function PlatformNav({
  platform,
  onSelect,
}: {
  platform: DevicePlatform;
  onSelect: (platform: DevicePlatform) => void;
}) {
  const { t } = useI18n();
  return (
    <nav
      aria-label={t("setup.platformNavAria")}
      className="space-y-1 self-start lg:sticky lg:top-24"
    >
      <p className="px-3 pb-2 text-xs font-medium uppercase tracking-wide text-subtle">
        {t("setup.platformNavLabel")}
      </p>
      {PLATFORM_GUIDES.map((guide) => {
        const active = guide.id === platform;
        const Icon = PLATFORM_ICONS[guide.id];
        return (
          <button
            key={guide.id}
            type="button"
            onClick={() => onSelect(guide.id)}
            aria-current={active ? "true" : undefined}
            className={cn(
              "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors duration-150 focus-ring",
              active
                ? "bg-tint font-medium text-primary"
                : "text-muted hover:bg-foreground/[0.04] hover:text-foreground",
            )}
          >
            <Icon className="size-4 shrink-0" />
            {guide.label}
          </button>
        );
      })}
    </nav>
  );
}

/** Right rail — the signed-in user's subscription context. */
function SubscriptionRail() {
  const user = useAuthStore((s) => s.user);
  const { t } = useI18n();
  const subscription = useAsync(
    () => (user ? subscriptionService.getCurrent() : Promise.resolve(null)),
    [user?.email],
  );
  const devices = useAsync(
    () => (user ? deviceService.listDevices() : Promise.resolve(null)),
    [user?.email],
  );
  const status = useAsync(() => networkService.getStatus(), []);

  return (
    <SideRail>
      <Panel title={t("setup.subscriptionPanel")}>
        {!user ? (
          <>
            <p className="text-sm leading-relaxed text-muted">
              {t("setup.signedOutBody")}
            </p>
            <Button asChild variant="secondary" size="sm" className="mt-4">
              <Link to="/login?next=/setup">{t("setup.signIn")}</Link>
            </Button>
          </>
        ) : subscription.loading ? (
          <Skeleton className="h-[42px] w-full" />
        ) : subscription.data ? (
          <>
            <SubscriptionUrlField token={subscription.data.subscriptionToken} />
            <dl className="mt-4 space-y-2.5 border-t border-border pt-4 text-[13px]">
              <div className="flex items-center justify-between">
                <dt className="text-muted">{t("setup.devices")}</dt>
                <dd className="font-medium tabular-nums text-foreground">
                  {devices.data
                    ? `${devices.data.length} / ${subscription.data.deviceLimit}`
                    : "…"}
                </dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-muted">{t("setup.network")}</dt>
                <dd className="flex items-center gap-1.5 font-medium text-foreground">
                  <StatusDot
                    tone={
                      status.data?.status === "operational"
                        ? "success"
                        : "warning"
                    }
                  />
                  {status.data
                    ? status.data.status === "operational"
                      ? t("common.statusOperational")
                      : t("common.statusDegraded")
                    : "…"}
                </dd>
              </div>
            </dl>
          </>
        ) : (
          <p className="text-sm text-muted">
            {t("common.couldntLoadSubscription")}{" "}
            <button
              onClick={subscription.retry}
              className="rounded-sm text-primary hover:underline focus-ring"
            >
              {t("common.retry")}
            </button>
          </p>
        )}
      </Panel>

      <Panel title={t("setup.helpPanel")}>
        <p className="flex items-start gap-3 text-sm leading-relaxed text-muted">
          <LifeBuoy className="mt-0.5 size-4 shrink-0 text-subtle" />
          {t("setup.helpBody")}
        </p>
        <div className="mt-4 border-t border-border pt-4">
          <PanelLink to="/console/support">
            {t("setup.contactSupport")}
          </PanelLink>
        </div>
      </Panel>
    </SideRail>
  );
}

/**
 * Public setup — a documentation/product hybrid: platform navigation on
 * the left, the guide in the middle, subscription context on the right.
 */
export function SetupPage() {
  const [platform, setPlatform] = useState<DevicePlatform>("windows");
  const { t } = useI18n();

  return (
    <Container className="py-12 md:py-16 lg:py-20">
      <PageHeader
        size="lg"
        title={t("setup.title")}
        description={t("setup.description")}
      />

      <div className="mt-10 grid items-start gap-8 lg:grid-cols-12 lg:gap-10">
        <div className="hidden lg:col-span-2 lg:block">
          <PlatformNav platform={platform} onSelect={setPlatform} />
        </div>

        <Panel className="lg:col-span-7" bodyClassName="lg:py-7">
          <SetupGuide
            platform={platform}
            onPlatformChange={setPlatform}
            controlClassName="lg:hidden"
          />
        </Panel>

        <div className="lg:col-span-3">
          <SubscriptionRail />
        </div>
      </div>
    </Container>
  );
}
