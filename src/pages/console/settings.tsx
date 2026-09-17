import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useAuthStore } from "@/store/auth";

export function ConsoleSettingsPage() {
  const user = useAuthStore((s) => s.user);
  const [name, setName] = useState(user?.name ?? "");
  const [saved, setSaved] = useState(false);
  const [expiryReminders, setExpiryReminders] = useState(true);
  const [statusAlerts, setStatusAlerts] = useState(true);

  return (
    <div className="max-w-xl">
      <h1 className="text-lg font-semibold text-foreground">Settings</h1>

      <section className="mt-6 border-t border-border py-6">
        <h2 className="text-sm font-semibold text-foreground">Profile</h2>
        <div className="mt-4 space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="settings-name">Full name</Label>
            <Input
              id="settings-name"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setSaved(false);
              }}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="settings-email">Email</Label>
            <Input id="settings-email" value={user?.email ?? ""} disabled />
            <p className="text-xs text-subtle">
              Email changes are handled by support for account security.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              size="sm"
              onClick={() => setSaved(true)}
              disabled={!name.trim()}
            >
              Save changes
            </Button>
            {saved && (
              <span role="status" className="text-[13px] text-success">
                Saved.
              </span>
            )}
          </div>
        </div>
      </section>

      <section className="border-t border-border py-6">
        <h2 className="text-sm font-semibold text-foreground">Notifications</h2>
        <div className="mt-2 divide-y divide-border/60">
          <div className="flex items-center justify-between gap-4 py-3.5">
            <div>
              <p className="text-sm text-foreground">Expiry reminders</p>
              <p className="text-xs text-subtle">
                Email 3 days before your subscription expires.
              </p>
            </div>
            <Switch
              checked={expiryReminders}
              onCheckedChange={setExpiryReminders}
              aria-label="Toggle expiry reminder emails"
            />
          </div>
          <div className="flex items-center justify-between gap-4 py-3.5">
            <div>
              <p className="text-sm text-foreground">Network status alerts</p>
              <p className="text-xs text-subtle">
                Email when a region you use is degraded or restored.
              </p>
            </div>
            <Switch
              checked={statusAlerts}
              onCheckedChange={setStatusAlerts}
              aria-label="Toggle network status alerts"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
