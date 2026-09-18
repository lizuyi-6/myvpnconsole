import { useEffect, useState } from "react";

/**
 * True once the window is scrolled past `offset` — drives the subtle
 * header shadow that adds depth only when content is underneath (HIG depth).
 */
export function useScrolled(offset = 8): boolean {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > offset);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [offset]);

  return scrolled;
}
