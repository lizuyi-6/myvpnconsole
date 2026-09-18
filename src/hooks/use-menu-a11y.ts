import { useEffect, type RefObject } from "react";

/**
 * Keyboard support for button-triggered dropdown menus (HIG / WAI-ARIA menu):
 *  - opening moves focus to the first menu item
 *  - ArrowDown / ArrowUp / Home / End move between items
 *  - Escape closes and returns focus to the trigger
 *  - Tab closes without stealing the natural tab order
 *
 * Items are any focusable elements inside the container that have a
 * `role` starting with "menuitem" (menuitem, menuitemradio…).
 */
export function useMenuA11y({
  open,
  onClose,
  containerRef,
  triggerRef,
}: {
  open: boolean;
  onClose: () => void;
  containerRef: RefObject<HTMLElement>;
  triggerRef: RefObject<HTMLElement>;
}) {
  useEffect(() => {
    if (!open) return;
    const container = containerRef.current;
    if (!container) return;

    const items = () =>
      Array.from(
        container.querySelectorAll<HTMLElement>('[role^="menuitem"]'),
      ).filter((el) => !el.hasAttribute("disabled"));

    // The menu is already mounted when this effect runs — focus the
    // first item directly (rAF would never fire in a hidden tab).
    items()[0]?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      const list = items();
      if (list.length === 0) return;
      const index = list.indexOf(document.activeElement as HTMLElement);

      switch (event.key) {
        case "ArrowDown":
          event.preventDefault();
          list[(index + 1) % list.length]?.focus();
          break;
        case "ArrowUp":
          event.preventDefault();
          list[(index - 1 + list.length) % list.length]?.focus();
          break;
        case "Home":
          event.preventDefault();
          list[0]?.focus();
          break;
        case "End":
          event.preventDefault();
          list[list.length - 1]?.focus();
          break;
        case "Escape":
          event.preventDefault();
          onClose();
          triggerRef.current?.focus();
          break;
        case "Tab":
          onClose();
          break;
      }
    };

    container.addEventListener("keydown", onKeyDown);
    return () => {
      container.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose, containerRef, triggerRef]);
}
