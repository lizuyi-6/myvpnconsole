import { LogOut } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PageHeader } from "@/components/layout/page-header";
import { Panel } from "@/components/layout/panel";
import { SideRail } from "@/components/layout/side-rail";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useI18n } from "@/i18n";
import { initialsOf } from "@/lib/utils";
import { useAuthStore } from "@/store/auth";

export function ConsoleSettingsPage() {
  const navigate = useNavigate();
  const { user, signOut } = useAuthStore();
  const { t } = useI18n();
  const [name, setName] = useState(user?.name ?? "");
  const [saved, setSaved] = useState(false);
  const [expiryReminders, setExpiryReminders] = useState(true);
  const [statusAlerts, setStatusAlerts] = useState(true);

  return (
    <div>
      <PageHeader
        title={t("console.settings.title")}
        description={t("console.settings.description")}
      />

      <div className="mt-6 grid items-start gap-6 xl:grid-cols-12">
        <div className="space-y-6 xl:col-span-8">
          <Panel title={t("console.settings.profilePanel")}>
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="settings-name">
                  {t("console.settings.fullName")}
                </Label>
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
                <Label htmlFor="settings-email">
                  {t("console.settings.email")}
                </Label>
                <Input id="settings-email" value={user?.email ?? ""} disabled />
                <p className="text-xs text-subtle">
                  {t("console.settings.emailNote")}
                </p>
              </div>
            </div>
            <div className="mt-5 flex items-center gap-3">
              <Button
                size="sm"
                onClick={() => setSaved(true)}
                disabled={!name.trim()}
              >
                {t("console.settings.saveChanges")}
              </Button>
              {saved && (
                <span role="status" className="text-[13px] text-success">
                  {t("console.settings.saved")}
                </span>
              )}
            </div>
          </Panel>

          <Panel title={t("console.settings.notificationsPanel")}>
            <div className="divide-y divide-border/60">
              <div className="flex items-center justify-between gap-4 py-3.5 first:pt-0 last:pb-0">
                <div>
                  <p className="text-sm text-foreground">
                    {t("console.settings.expiryReminders")}
                  </p>
                  <p className="mt-0.5 text-xs text-subtle">
                    {t("console.settings.expiryRemindersBody")}
                  </p>
                </div>
                <Switch
                  checked={expiryReminders}
                  onCheckedChange={setExpiryReminders}
                  aria-label={t("console.settings.expiryAria")}
                />
              </div>
              <div className="flex items-center justify-between gap-4 py-3.5 first:pt-0 last:pb-0">
                <div>
                  <p className="text-sm text-foreground">
                    {t("console.settings.statusAlerts")}
                  </p>
                  <p className="mt-0.5 text-xs text-subtle">
                    {t("console.settings.statusAlertsBody")}
                  </p>
                </div>
                <Switch
                  checked={statusAlerts}
                  onCheckedChange={setStatusAlerts}
                  aria-label={t("console.settings.statusAria")}
                />
              </div>
            </div>
          </Panel>
        </div>

        <SideRail className="xl:col-span-4">
          <Panel title={t("console.settings.accountPanel")}>
            {user && (
              <div className="flex items-center gap-3">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-tint text-sm font-semibold text-primary">
                  {initialsOf(user.name)}
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-foreground">
                    {user.name}
                  </p>
                  <p className="truncate text-[13px] text-subtle">
                    {user.email}
                  </p>
                </div>
              </div>
            )}
            <Button
              variant="secondary"
              size="sm"
              className="mt-5 w-full"
              onClick={() => {
                signOut();
                navigate("/");
              }}
            >
              <LogOut className="size-4" />
              {t("console.signOut")}
            </Button>
          </Panel>
        </SideRail>
      </div>
    </div>
  );
}
