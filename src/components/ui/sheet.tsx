import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import * as React from "react";
import { useI18n } from "@/i18n";
import { cn } from "@/lib/utils";

/**
 * Left-side drawer used for mobile navigation.
 */
const Sheet = DialogPrimitive.Root;
const SheetTrigger = DialogPrimitive.Trigger;
const SheetClose = DialogPrimitive.Close;

const SheetContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => {
  const { t } = useI18n();
  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-navy/40 backdrop-blur-[2px] animate-fade-in" />
      <DialogPrimitive.Content
        ref={ref}
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-border bg-surface shadow-panel animate-sheet-in focus:outline-none",
          className,
        )}
        {...props}
      >
        {children}
        <DialogPrimitive.Close
          aria-label={t("common.closeMenu")}
          className="absolute right-3 top-3 rounded-md p-1.5 text-subtle transition-colors hover:bg-foreground/[0.05] hover:text-foreground focus-ring"
        >
          <X className="size-4" />
        </DialogPrimitive.Close>
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  );
});
SheetContent.displayName = "SheetContent";

/** Radix requires a Title for accessibility; render visually hidden. */
const SheetTitle = DialogPrimitive.Title;

export { Sheet, SheetClose, SheetContent, SheetTitle, SheetTrigger };
