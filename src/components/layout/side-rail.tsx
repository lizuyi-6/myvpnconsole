import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Contextual side rail — sticks below the header on desktop so it stays
 * visible while the main column scrolls. Stacks inline on smaller screens.
 */
export function SideRail({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("space-y-6 self-start lg:sticky lg:top-24", className)}>
      {children}
    </div>
  );
}
