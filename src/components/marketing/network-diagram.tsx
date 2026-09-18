import { useI18n } from "@/i18n";
import { cn } from "@/lib/utils";
import type { RegionStatus } from "@/types";

export interface DiagramRegion {
  id: string;
  /** Short label that fits the node, e.g. "US West" */
  label: string;
  latencyMs: number | null;
  status: RegionStatus;
}

const NODE_CENTER_Y = [52, 132, 212, 292];
const STATUS_FILL: Record<RegionStatus, string> = {
  available: "fill-success",
  degraded: "fill-warning",
  offline: "fill-danger",
};

/**
 * Abstract "how the service works" diagram:
 * your device → secure connection → NOVA network → regions.
 * Pure SVG — no decoration, just the service topology.
 */
export function NetworkDiagram({
  regions,
  className,
}: {
  regions: DiagramRegion[];
  className?: string;
}) {
  const { t } = useI18n();
  const nodes = regions.slice(0, 4);

  return (
    <svg
      viewBox="0 0 480 344"
      role="img"
      aria-label={t("home.hero.diagram.ariaLabel")}
      className={cn("h-auto w-full", className)}
    >
      {/* device → hub */}
      <line
        x1="122"
        y1="172"
        x2="212"
        y2="172"
        className="stroke-subtle/50"
        strokeWidth="1.5"
      />
      <text
        x="167"
        y="190"
        textAnchor="middle"
        className="fill-subtle text-[9px]"
      >
        {t("home.hero.diagram.secureConnection")}
      </text>

      {/* hub → regions */}
      {nodes.map((region, i) => {
        const y = NODE_CENTER_Y[i];
        return (
          <path
            key={region.id}
            d={`M 284 172 C 322 172, 322 ${y}, 356 ${y}`}
            fill="none"
            className="stroke-subtle/40"
            strokeWidth="1.5"
          />
        );
      })}

      {/* device node */}
      <g>
        <rect
          x="10"
          y="144"
          width="112"
          height="56"
          rx="10"
          className="fill-surface stroke-border"
          strokeWidth="1.5"
        />
        <circle cx="28" cy="165" r="3" className="fill-primary" />
        <text x="38" y="169" className="fill-foreground text-[12px] font-medium">
          {t("home.hero.diagram.device")}
        </text>
        <text x="38" y="186" className="fill-subtle text-[10px]">
          {t("home.hero.diagram.anyPlatform")}
        </text>
      </g>

      {/* hub */}
      <g>
        <circle
          cx="250"
          cy="172"
          r="34"
          className="fill-surface stroke-primary/40"
          strokeWidth="1.5"
        />
        <circle
          cx="250"
          cy="172"
          r="22"
          className="fill-tint stroke-primary/30"
          strokeWidth="1"
        />
        <path
          d="M250 163 L259 172 L250 181 L241 172 Z"
          className="fill-primary"
        />
        <text
          x="250"
          y="226"
          textAnchor="middle"
          className="fill-foreground text-[12px] font-medium"
        >
          {t("home.hero.diagram.network")}
        </text>
        <text
          x="250"
          y="242"
          textAnchor="middle"
          className="fill-subtle text-[10px]"
        >
          {t("home.hero.diagram.oneSubscription")}
        </text>
      </g>

      {/* region nodes */}
      {nodes.map((region, i) => {
        const y = NODE_CENTER_Y[i];
        return (
          <g key={region.id}>
            <rect
              x="356"
              y={y - 19}
              width="112"
              height="38"
              rx="8"
              className="fill-surface stroke-border"
              strokeWidth="1.5"
            />
            <circle
              cx="372"
              cy={y}
              r="3"
              className={STATUS_FILL[region.status]}
            />
            <text x="382" y={y - 1} className="fill-foreground text-[11px] font-medium">
              {region.label}
            </text>
            <text x="382" y={y + 12} className="fill-subtle text-[9px]">
              {region.latencyMs !== null ? `${region.latencyMs} ms` : "—"}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
