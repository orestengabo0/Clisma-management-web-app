import React from "react";
import { Card } from "@/components/ui/card";

type Variant = "emerald" | "rose" | "amber" | "slate";

const COLORS: Record<
  Variant,
  { chipBg: string; chipRing: string; chipText: string }
> = {
  emerald: {
    chipBg: "bg-gradient-to-br from-emerald-50 to-emerald-100",
    chipRing: "ring-emerald-200/80",
    chipText: "text-emerald-700",
  },
  rose: {
    chipBg: "bg-gradient-to-br from-rose-50 to-rose-100",
    chipRing: "ring-rose-200/80",
    chipText: "text-rose-700",
  },
  amber: {
    chipBg: "bg-gradient-to-br from-amber-50 to-amber-100",
    chipRing: "ring-amber-200/80",
    chipText: "text-amber-700",
  },
  slate: {
    chipBg: "bg-gradient-to-br from-slate-50 to-slate-100",
    chipRing: "ring-slate-200/80",
    chipText: "text-slate-700",
  },
};

export interface GasesStatCardProps {
  gas: string;               // e.g., "co", "no₂", "pm2.5"
  value: number | string;    // e.g., 986
  unit?: string;             // e.g., "gm", "µg/m³"
  variant?: Variant;         // color theme
  className?: string;
}

export default function GasesStatCard({
  gas,
  value,
  unit = "",
  variant = "emerald",
  className,
}: GasesStatCardProps) {
  const c = COLORS[variant];

  return (
    <Card className={`rounded-2xl border shadow-sm p-6 ${className ?? ""}`}>
      <div className="flex items-center gap-4">
        {/* Chip */}
        <div
          className={`flex h-14 w-14 items-center justify-center rounded-lg ring-1 ${c.chipBg} ${c.chipRing}`}
          aria-label={gas}
        >
          <span className={`text-2xl font-semibold tracking-wide ${c.chipText}`}>
            {gas}
          </span>
        </div>

        {/* Value + unit */}
        <div className="flex items-baseline gap-2">
          <span className="text-4xl sm:text-5xl font-semibold tracking-tight text-foreground leading-none">
            {typeof value === "number" ? value.toLocaleString() : value}
          </span>
          {unit ? (
            <span className="text-sm sm:text-base text-muted-foreground">
              {unit}
            </span>
          ) : null}
        </div>
      </div>
    </Card>
  );
}