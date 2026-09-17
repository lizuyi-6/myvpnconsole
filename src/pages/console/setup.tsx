import { useSearchParams } from "react-router-dom";
import { SetupGuide } from "@/components/setup/setup-guide";

export function ConsoleSetupPage() {
  const [searchParams] = useSearchParams();
  const platform = searchParams.get("platform");

  return (
    <div>
      <h1 className="text-lg font-semibold text-foreground">Setup</h1>
      <p className="mt-1 text-sm text-muted">
        Get a new device connected in a few minutes.
      </p>

      <div className="mt-8">
        {/* key remounts the guide when arriving via a platform shortcut */}
        <SetupGuide key={platform ?? "default"} initialPlatform={platform} />
      </div>
    </div>
  );
}
