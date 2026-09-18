import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

/**
 * Public site container — the desktop workspace.
 * 1360px cap with desktop gutters; pages fill 1440px screens edge to edge
 * and stop stretching on very wide monitors.
 */
export function Container({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "mx-auto w-full max-w-content px-5 sm:px-8 lg:px-10",
        className,
      )}
    >
      {children}
    </div>
  );
}
