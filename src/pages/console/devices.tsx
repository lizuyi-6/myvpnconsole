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

function lastActiveLabel(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  const minutes = Math.floor(diffMs / 60_000);
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} h ago`;
  const days = Math.floor(hours / 24);
  if (days === 1) return "Yesterday";
  return `${days} days ago`;
}

export function ConsoleDevicesPage() {
  const devices = useAsync(() => deviceService.listDevices(), []);
  const subscription = useAsync(() => subscriptionService.getCurrent(), []);

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
      await deviceService.renameDevice(renaming.id, renameValue.trim());
      setRenaming(null);
      devices.retry();
    } finally {
      setRenameSaving(false);
    }
  };

  const submitRemove = async () => {
    if (!removing) return;
    setRemoveBusy(true);
    try {
      await deviceService.removeDevice(removing.id);
      setRemoving(null);
      devices.retry();
    } finally {
      setRemoveBusy(false);
    }
  };

  return (
    <div>
      <PageHeader
        title="Devices"
        description="Devices using your subscription. Rename for clarity, remove what you no longer use."
        actions={
          <>
            <span className="rounded-full border border-border bg-surface px-3 py-1.5 text-[13px] tabular-nums text-muted">
              {devices.data ? devices.data.length : "…"}
              {" / "}
              {subscription.data?.deviceLimit ?? "…"} used
            </span>
            <Button asChild size="sm">
              <Link to="/console/setup">
                <Plus className="size-4" />
                Set up a device
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
            message="We couldn't load your devices."
            onRetry={devices.retry}
          />
        ) : !devices.data || devices.data.length === 0 ? (
          <EmptyState
            icon={MonitorSmartphone}
            title="No devices connected"
            message="Set up a device to see it here."
            action={
              <Button asChild variant="secondary" size="sm">
                <Link to="/console/setup">Open setup</Link>
              </Button>
            }
          />
        ) : (
          <div className="overflow-hidden rounded-xl border border-border bg-surface px-3 shadow-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Device</TableHead>
                <TableHead className="hidden sm:table-cell">Platform</TableHead>
                <TableHead>Last active</TableHead>
                <TableHead className="text-right">Actions</TableHead>
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
                    {lastActiveLabel(device.lastActiveAt)}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="inline-flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => openRename(device)}
                        aria-label={`Rename ${device.name}`}
                      >
                        <Pencil className="size-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => setRemoving(device)}
                        aria-label={`Remove ${device.name}`}
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
          <DialogTitle>Rename device</DialogTitle>
          <DialogDescription>
            Give this device a name you'll recognize.
          </DialogDescription>
          <div className="mt-4 space-y-1.5">
            <Label htmlFor="device-name">Name</Label>
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
              Cancel
            </Button>
            <Button
              onClick={submitRename}
              disabled={renameSaving || !renameValue.trim()}
            >
              {renameSaving ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Saving…
                </>
              ) : (
                "Save"
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
          <DialogTitle>Remove {removing?.name}?</DialogTitle>
          <DialogDescription>
            This device will lose access. You can set it up again anytime —
            this only affects this device.
          </DialogDescription>
          <div className="mt-6 flex justify-end gap-2">
            <Button
              variant="secondary"
              onClick={() => setRemoving(null)}
              disabled={removeBusy}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={submitRemove}
              disabled={removeBusy}
            >
              {removeBusy ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Removing…
                </>
              ) : (
                "Remove device"
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
