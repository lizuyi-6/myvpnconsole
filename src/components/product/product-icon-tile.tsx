import { Bot, Code2, Globe, Globe2, Layers, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ProductIcon } from "@/types";

const ICONS: Record<ProductIcon, typeof Sparkles> = {
  sparkles: Sparkles,
  bot: Bot,
  layers: Layers,
  code: Code2,
  globe: Globe,
  "globe-2": Globe2,
};

interface ProductIconTileProps {
  icon: ProductIcon;
  accent: { from: string; to: string };
  size?: "sm" | "md" | "lg";
  className?: string;
}

const SIZES = {
  sm: { tile: "size-9 rounded-lg", icon: "size-4" },
  md: { tile: "size-11 rounded-[10px]", icon: "size-5" },
  lg: { tile: "size-16 rounded-xl", icon: "size-7" },
};

/** Product glyph in a subtle gradient tile. */
export function ProductIconTile({
  icon,
  accent,
  size = "md",
  className,
}: ProductIconTileProps) {
  const Icon = ICONS[icon];
  const s = SIZES[size];
  return (
    <div
      aria-hidden
      className={cn(
        "flex shrink-0 items-center justify-center border border-white/10",
        s.tile,
        className,
      )}
      style={{
        background: `linear-gradient(135deg, ${accent.from}26, ${accent.to}14)`,
      }}
    >
      <Icon className={s.icon} style={{ color: accent.from }} />
    </div>
  );
}
