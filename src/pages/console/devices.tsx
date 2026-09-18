import {
  Laptop,
  Loader2,
  Monitor,
  MonitorSmartphone,
  Pencil,
  Plus,
  Smartphone,
  TabletSmartphone,
  Terminal,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { EmptyState } from "@/components/feedback/empty-state";
import { ErrorState } from "@/components/feedback/error-state";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAsync } from "@/hooks/use-async";
import { useI18n, type Dictionary } from "@/i18n";
import { useToast } from "@/components/ui/toast";
import { deviceService } from "@/services/devices";
import { subscriptionService } from "@/services/subscription";
import type { Device, DevicePlatform } from "@/types";

const PLATFORM_LABELS: Record<DevicePlatform, string> = {
  windows: "Windows",
  macos: "macOS",
  ios: "iOS",
  android: "Android",
  linux: "Linux",
};

const PLATFORM_ICONS: Record<DevicePlatform, typeof Monitor> = {
  windows: Monitor,
  macos: Laptop,
  ios: Smartphone,
  android: TabletSmartphone,
  linux: Terminal,
};

function lastActiveLabel(iso: string, dict: Dictionary): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  const minutes = Math.floor(diffMs / 60_000);
  const labels = dict.console.devices.lastActive;
  if (minutes < 1) return labels.justNow;
  if (minutes < 60)
    return labels.minAgo.replace("{count}", String(minutes));
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return labels.hoursAgo.replace("{count}", String(hours));
  const days = Math.floor(hours / 24);
  if (days === 1) return labels.yesterday;
  return labels.daysAgo.replace("{count}", String(days));
}

export function ConsoleDevicesPage() {
  const devices = useAsync(() => deviceService.listDevices(), []);
  const subscription = useAsync(() => subscriptionService.getCurrent(), []);
  const { t, dict } = useI18n();
  const { toast } = useToast();

  const [renaming, setRenaming] = useState<Device | null>(null);
  const [renameValue, setRenameValue] = useState("");
  const [renameSaving, setRenameSaving] = useState(false);
  const [removing, setRemoving] = useState<Device | null>(null);
  const [removeBusy, setRemoveBusy] = useState(false);

  const openRename = (device: Device) => {
    setRenaming(device);
    setRenameValue(device.name);
  };

  const submitRename = async () => {
    if (!renaming || !renameValue.trim()) return;
    setRenameSaving(true);
    try {
      const name = renameValue.trim();
      await deviceService.renameDevice(renaming.id, name);
      setRenaming(null);
      devices.retry();
      toast(t("console.devices.renamedToast", { name }));
    } finally {
      setRenameSaving(false);
    }
  };

  const submitRemove = async () => {
    if (!removing) return;
    setRemoveBusy(true);
    try {
      const { name } = removing;
      await deviceService.removeDevice(removing.id);
      setRemoving(null);
      devices.retry();
      toast(t("console.devices.removedToast", { name }), "info");
    } finally {
      setRemoveBusy(false);
    }
  };

  return (
    <div>
      <PageHeader
        title={t("console.devices.title")}
        description={t("console.devices.description")}
        actions={
          <>
            <span className="rounded-full border border-border bg-surface px-3 py-1.5 text-[13px] tabular-nums text-muted">
              {t("console.devices.usedCount", {
                used: devices.data ? devices.data.length : "…",
                limit: subscription.data?.deviceLimit ?? "…",
              })}
            </span>
            <Button asChild size="sm">
              <Link to="/console/setup">
                <Plus className="size-4" />
                {t("console.devices.setupDevice")}
              </Link>
            </Button>
          </>
        }
      />

      <div className="mt-8">
        {devices.loading ? (
          <Skeleton className="h-40 w-full" />
        ) : devices.error ? (
          <ErrorState
            message={t("console.devices.loadError")}
            onRetry={devices.retry}
          />
        ) : !devices.data || devices.data.length === 0 ? (
          <EmptyState
            icon={MonitorSmartphone}
            title={t("console.devices.emptyTitle")}
            message={t("console.devices.emptyBody")}
            action={
              <Button asChild variant="secondary" size="sm">
                <Link to="/console/setup">{t("console.devices.openSetup")}</Link>
              </Button>
            }
          />
        ) : (
          <div className="overflow-hidden rounded-xl border border-border bg-surface px-3 shadow-card">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("console.devices.colDevice")}</TableHead>
                  <TableHead className="hidden sm:table-cell">
                    {t("console.devices.colPlatform")}
                  </TableHead>
                  <TableHead>{t("console.devices.colLastActive")}</TableHead>
                  <TableHead className="text-right">
                    {t("console.devices.colActions")}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {devices.data.map((device) => {
                  const PlatformIcon = PLATFORM_ICONS[device.platform];
                  return (
                    <TableRow key={device.id}>
                      <TableCell className="font-medium text-foreground">
                        <span className="flex items-center gap-3">
                          <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-tint">
                            <PlatformIcon className="size-4 text-primary" />
                          </span>
                          {device.name}
                        </span>
                      </TableCell>
                      <TableCell className="hidden text-muted sm:table-cell">
                        {PLATFORM_LABELS[device.platform]}
                      </TableCell>
                      <TableCell className="text-muted">
                        {lastActiveLabel(device.lastActiveAt, dict)}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="inline-flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            onClick={() => openRename(device)}
                            aria-label={t("console.devices.renameAria", {
                              name: device.name,
                            })}
                          >
                            <Pencil className="size-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            onClick={() => setRemoving(device)}
                            aria-label={t("console.devices.removeAria", {
                              name: device.name,
                            })}
                            className="hover:text-danger"
                          >
                            <Trash2 className="size-3.5" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      {/* Rename dialog */}
      <Dialog
        open={renaming !== null}
        onOpenChange={(open) => !open && setRenaming(null)}
      >
        <DialogContent>
          <DialogTitle>{t("console.devices.renameDialog.title")}</DialogTitle>
          <DialogDescription>
            {t("console.devices.renameDialog.body")}
          </DialogDescription>
          <div className="mt-4 space-y-1.5">
            <Label htmlFor="device-name">
              {t("console.devices.renameDialog.nameLabel")}
            </Label>
            <Input
              id="device-name"
              value={renameValue}
              onChange={(e) => setRenameValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  submitRename();
                }
              }}
              autoFocus
            />
          </div>
          <div className="mt-6 flex justify-end gap-2">
            <Button
              variant="secondary"
              onClick={() => setRenaming(null)}
              disabled={renameSaving}
            >
              {t("common.cancel")}
            </Button>
            <Button
              onClick={submitRename}
              disabled={renameSaving || !renameValue.trim()}
            >
              {renameSaving ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  {t("console.devices.renameDialog.saving")}
                </>
              ) : (
                t("console.devices.renameDialog.save")
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Remove dialog */}
      <Dialog
        open={removing !== null}
        onOpenChange={(open) => !open && setRemoving(null)}
      >
        <DialogContent>
          <DialogTitle>
            {t("console.devices.removeDialog.title", {
              name: removing?.name ?? "",
            })}
          </DialogTitle>
          <DialogDescription>
            {t("console.devices.removeDialog.body")}
          </DialogDescription>
          <div className="mt-6 flex justify-end gap-2">
            <Button
              variant="secondary"
              onClick={() => setRemoving(null)}
              disabled={removeBusy}
            >
              {t("common.cancel")}
            </Button>
            <Button
              variant="destructive"
              onClick={submitRemove}
              disabled={removeBusy}
            >
              {removeBusy ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  {t("console.devices.removeDialog.removing")}
                </>
              ) : (
                t("console.devices.removeDialog.confirm")
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
