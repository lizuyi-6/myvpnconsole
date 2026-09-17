import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useAuthStore } from "@/store/auth";

export function SettingsPage() {
  const user = useAuthStore((s) => s.user);
  const [name, setName] = useState(user?.name ?? "");
  const [saved, setSaved] = useState(false);
  const [emailUpdates, setEmailUpdates] = useState(true);
  const [expiryReminders, setExpiryReminders] = useState(true);

  return (
    <div className="max-w-xl">
      <h1 className="text-2xl font-semibold tracking-tight text-foreground">
        Settings
      </h1>
      <p className="mt-1 text-sm text-muted">Your account preferences.</p>

      <section className="mt-8 rounded-xl border border-border bg-surface p-6">
        <h2 className="text-[15px] font-semibold text-foreground">Profile</h2>
        <div className="mt-5 space-y-4">
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

      <section className="mt-6 rounded-xl border border-border bg-surface p-6">
        <h2 className="text-[15px] font-semibold text-foreground">
          Notifications
        </h2>
        <div className="mt-4 divide-y divide-border">
          <div className="flex items-center justify-between gap-4 py-3">
            <div>
              <p className="text-sm text-foreground">Order updates</p>
              <p className="text-xs text-subtle">
                Delivery confirmations and receipts.
              </p>
            </div>
            <Switch
              checked={emailUpdates}
              onCheckedChange={setEmailUpdates}
              aria-label="Toggle order update emails"
            />
          </div>
          <div className="flex items-center justify-between gap-4 py-3">
            <div>
              <p className="text-sm text-foreground">Expiry reminders</p>
              <p className="text-xs text-subtle">
                Notified 3 days before a product or subscription expires.
              </p>
            </div>
            <Switch
              checked={expiryReminders}
              onCheckedChange={setExpiryReminders}
              aria-label="Toggle expiry reminder emails"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
