import { Link } from "react-router-dom";
import { SubscriptionUrlField } from "@/components/subscription/subscription-url-field";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { Skeleton } from "@/components/ui/skeleton";
import { useAsync } from "@/hooks/use-async";
import { subscriptionService } from "@/services/subscription";
import { useAuthStore } from "@/store/auth";
import type { DevicePlatform } from "@/types";
import { useState } from "react";

interface PlatformGuide {
  id: DevicePlatform;
  label: string;
  client: string;
  clientNote: string;
}

export const PLATFORM_GUIDES: PlatformGuide[] = [
  {
    id: "windows",
    label: "Windows",
    client: "Clash Verge",
    clientNote: "Free, open-source client with system proxy support.",
  },
  {
    id: "macos",
    label: "macOS",
    client: "ClashX Meta",
    clientNote: "Lightweight menu-bar client for macOS.",
  },
  {
    id: "ios",
    label: "iOS",
    client: "Shadowrocket",
    clientNote: "Available on the App Store.",
  },
  {
    id: "android",
    label: "Android",
    client: "Clash Meta for Android",
    clientNote: "Open-source client for Android 7+.",
  },
  {
    id: "linux",
    label: "Linux",
    client: "Clash Verge",
    clientNote: "AppImage and package builds for major distros.",
  },
];

/**
 * The setup guide body. Shared by the public /setup page and the console.
 * Steps are all visible — this is documentation, not a wizard.
 */
export function SetupGuide({
  initialPlatform,
}: {
  initialPlatform?: string | null;
}) {
  const user = useAuthStore((s) => s.user);
  const validInitial = PLATFORM_GUIDES.some((g) => g.id === initialPlatform)
    ? (initialPlatform as DevicePlatform)
    : "windows";
  const [platform, setPlatform] = useState<DevicePlatform>(validInitial);
  const guide = PLATFORM_GUIDES.find((g) => g.id === platform)!;

  // Only fetch the subscription for signed-in users
  const subscription = useAsync(
    () =>
      user
        ? subscriptionService.getCurrent()
        : Promise.resolve(null),
    [user?.email],
  );

  return (
    <div>
      <SegmentedControl
        aria-label="Platform"
        options={PLATFORM_GUIDES.map((g) => ({ value: g.id, label: g.label }))}
        value={platform}
        onChange={setPlatform}
        className="flex-wrap"
      />

      <div className="mt-8">
        <p className="text-sm font-medium text-foreground">
          Recommended client — {guide.client}
        </p>
        <p className="mt-0.5 text-[13px] text-subtle">{guide.clientNote}</p>
      </div>

      <ol className="mt-8 space-y-7">
        <li>
          <p className="text-sm font-medium text-foreground">
            <span className="mr-2 tabular-nums text-primary">1.</span>
            Install {guide.client}
          </p>
          <p className="mt-1 pl-6 text-sm leading-relaxed text-muted">
            Download {guide.client} for {guide.label} from its official release
            page and install it like any other application.
          </p>
        </li>
        <li>
          <p className="text-sm font-medium text-foreground">
            <span className="mr-2 tabular-nums text-primary">2.</span>
            Copy your subscription URL
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
                  Couldn't load your subscription.{" "}
                  <button
                    onClick={subscription.retry}
                    className="text-primary hover:underline focus-ring rounded-sm"
                  >
                    Retry
                  </button>
                </p>
              )
            ) : (
              <p className="text-sm text-muted">
                <Link
                  to="/login?next=/setup"
                  className="text-primary hover:underline focus-ring rounded-sm"
                >
                  Sign in
                </Link>{" "}
                to view your subscription URL. You can finish the rest of the
                guide first.
              </p>
            )}
          </div>
        </li>
        <li>
          <p className="text-sm font-medium text-foreground">
            <span className="mr-2 tabular-nums text-primary">3.</span>
            Import the subscription
          </p>
          <p className="mt-1 pl-6 text-sm leading-relaxed text-muted">
            In {guide.client}, find the profiles or subscriptions section, add
            a new profile from URL, and paste your subscription link. The region
            list downloads automatically.
          </p>
        </li>
        <li>
          <p className="text-sm font-medium text-foreground">
            <span className="mr-2 tabular-nums text-primary">4.</span>
            Connect
          </p>
          <p className="mt-1 pl-6 text-sm leading-relaxed text-muted">
            Pick a region and enable the connection. If a region feels slow,
            switch to another — check the{" "}
            <Link
              to="/network"
              className="text-primary hover:underline focus-ring rounded-sm"
            >
              network page
            </Link>{" "}
            for current status.
          </p>
        </li>
      </ol>
    </div>
  );
}
