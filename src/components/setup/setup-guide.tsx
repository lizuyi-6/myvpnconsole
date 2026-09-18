import { useState } from "react";
import { Link } from "react-router-dom";
import { SubscriptionUrlField } from "@/components/subscription/subscription-url-field";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { Skeleton } from "@/components/ui/skeleton";
import { useAsync } from "@/hooks/use-async";
import { useI18n } from "@/i18n";
import { subscriptionService } from "@/services/subscription";
import { useAuthStore } from "@/store/auth";
import type { DevicePlatform } from "@/types";

interface PlatformGuide {
  id: DevicePlatform;
  label: string;
  client: string;
}

/** Platform metadata — client names are proper nouns, notes are localized. */
export const PLATFORM_GUIDES: PlatformGuide[] = [
  { id: "windows", label: "Windows", client: "Clash Verge" },
  { id: "macos", label: "macOS", client: "ClashX Meta" },
  { id: "ios", label: "iOS", client: "Shadowrocket" },
  { id: "android", label: "Android", client: "Clash Meta for Android" },
  { id: "linux", label: "Linux", client: "Clash Verge" },
];

/**
 * The setup guide body. Shared by the public /setup page and the console.
 * Steps are all visible — this is documentation, not a wizard.
 *
 * Platform selection can be controlled by a parent (e.g. the public setup
 * page's desktop side navigation) or managed internally with the
 * segmented control.
 */
export function SetupGuide({
  initialPlatform,
  platform: controlledPlatform,
  onPlatformChange,
  controlClassName,
}: {
  initialPlatform?: string | null;
  platform?: DevicePlatform;
  onPlatformChange?: (platform: DevicePlatform) => void;
  /** Extra classes for the segmented control wrapper (e.g. "lg:hidden"). */
  controlClassName?: string;
}) {
  const user = useAuthStore((s) => s.user);
  const { t } = useI18n();
  const validInitial = PLATFORM_GUIDES.some((g) => g.id === initialPlatform)
    ? (initialPlatform as DevicePlatform)
    : "windows";
  const [internalPlatform, setInternalPlatform] =
    useState<DevicePlatform>(validInitial);
  const platform = controlledPlatform ?? internalPlatform;
  const setPlatform = onPlatformChange ?? setInternalPlatform;
  const guide = PLATFORM_GUIDES.find((g) => g.id === platform)!;

  // Only fetch the subscription for signed-in users
  const subscription = useAsync(
    () => (user ? subscriptionService.getCurrent() : Promise.resolve(null)),
    [user?.email],
  );

  return (
    <div>
      <div className={controlClassName}>
        <SegmentedControl
          aria-label={t("setup.guide.platformAria")}
          options={PLATFORM_GUIDES.map((g) => ({ value: g.id, label: g.label }))}
          value={platform}
          onChange={setPlatform}
          className="flex-wrap"
        />
      </div>

      <div className="mt-8">
        <p className="text-sm font-medium text-foreground">
          {t("setup.guide.recommendedClient", { client: guide.client })}
        </p>
        <p className="mt-0.5 text-[13px] text-subtle">
          {t(`setup.guide.clientNotes.${platform}`)}
        </p>
      </div>

      <ol className="mt-8 space-y-7">
        <li>
          <p className="text-sm font-medium text-foreground">
            <span className="mr-2 tabular-nums text-primary">1.</span>
            {t("setup.guide.step1Title", { client: guide.client })}
          </p>
          <p className="mt-1 pl-6 text-sm leading-relaxed text-muted">
            {t("setup.guide.step1Body", {
              client: guide.client,
              platform: guide.label,
            })}
          </p>
        </li>
        <li>
          <p className="text-sm font-medium text-foreground">
            <span className="mr-2 tabular-nums text-primary">2.</span>
            {t("setup.guide.step2Title")}
          </p>
          <div className="mt-2 pl-6">
            {user ? (
              subscription.loading ? (
                <Skeleton className="h-[42px] w-full max-w-lg" />
              ) : subscription.data ? (
                <div className="max-w-lg">
                  <SubscriptionUrlField
                    token={subscription.data.subscriptionToken}
                  />
                </div>
              ) : (
                <p className="text-sm text-muted">
                  {t("common.couldntLoadSubscription")}{" "}
                  <button
                    onClick={subscription.retry}
                    className="text-primary hover:underline focus-ring rounded-sm"
                  >
                    {t("common.retry")}
                  </button>
                </p>
              )
            ) : (
              <p className="text-sm text-muted">
                <Link
                  to="/login?next=/setup"
                  className="text-primary hover:underline focus-ring rounded-sm"
                >
                  {t("setup.guide.step2SignInLink")}
                </Link>
                {t("setup.guide.step2SignInPost")}
              </p>
            )}
          </div>
        </li>
        <li>
          <p className="text-sm font-medium text-foreground">
            <span className="mr-2 tabular-nums text-primary">3.</span>
            {t("setup.guide.step3Title")}
          </p>
          <p className="mt-1 pl-6 text-sm leading-relaxed text-muted">
            {t("setup.guide.step3Body", { client: guide.client })}
          </p>
        </li>
        <li>
          <p className="text-sm font-medium text-foreground">
            <span className="mr-2 tabular-nums text-primary">4.</span>
            {t("setup.guide.step4Title")}
          </p>
          <p className="mt-1 pl-6 text-sm leading-relaxed text-muted">
            {t("setup.guide.step4Pre")}
            <Link
              to="/network"
              className="text-primary hover:underline focus-ring rounded-sm"
            >
              {t("setup.guide.step4Link")}
            </Link>
            {t("setup.guide.step4Post")}
          </p>
        </li>
      </ol>
    </div>
  );
}
