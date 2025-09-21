// src/components/StatsCard.tsx
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { ReactNode } from "react";

type StatsColor = "emerald" | "rose" | "amber";

const COLOR_MAP: Record<StatsColor, { chipBg: string; chipRing: string; text: string; value: string; icon: string }> = {
  emerald: {
    chipBg: "bg-emerald-50",
    chipRing: "ring-emerald-200/80",
    text: "text-emerald-700",
    value: "text-emerald-800",
    icon: "text-emerald-600",
  },
  rose: {
    chipBg: "bg-rose-50",
    chipRing: "ring-rose-200/80",
    text: "text-rose-700",
    value: "text-rose-800",
    icon: "text-rose-600",
  },
  amber: {
    chipBg: "bg-amber-50",
    chipRing: "ring-amber-200/80",
    text: "text-amber-700",
    value: "text-amber-800",
    icon: "text-amber-600",
  },
};

function abbreviate(n: number) {
  const abs = Math.abs(n);
  if (abs >= 1e9) return (n / 1e9).toFixed(1).replace(/\.0$/, "") + "B";
  if (abs >= 1e6) return (n / 1e6).toFixed(1).replace(/\.0$/, "") + "M";
  if (abs >= 1e3) return (n / 1e3).toFixed(1).replace(/\.0$/, "") + "K";
  return n.toLocaleString();
}

export type StatsCardProps = {
  title: string;
  value: number | string;
  unit?: string;                // e.g. "%"
  icon: ReactNode;
  color?: StatsColor;           // emerald | rose | amber
  period?: string;              // select value
  onPeriodChange?: (value: string) => void;
  periodOptions?: { value: string; label: string }[];
  className?: string;
};

export function StatsCard({
  title,
  value,
  unit,
  icon,
  color = "emerald",
  period = "last_year",
  onPeriodChange,
  periodOptions = [
    { value: "last_7", label: "Last 7 days" },
    { value: "last_30", label: "Last 30 days" },
    { value: "this_year", label: "This year" },
    { value: "last_year", label: "Last year" },
  ],
  className,
}: StatsCardProps) {
  const c = COLOR_MAP[color];
  const display =
    typeof value === "number" ? abbreviate(value) + (unit ? unit : "") : value;

  return (
    <Card className={`rounded-2xl border shadow-sm p-5 ${className ?? ""}`}>
      <div className="flex items-start gap-3">
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-xl ring-1 ${c.chipBg} ${c.chipRing}`}
        >
          <div className={`${c.icon}`}>{icon}</div>
        </div>
        <div className="min-w-0">
          <p className={`text-sm font-medium ${c.text}`}>{title}</p>
          <p className={`mt-1 text-3xl sm:text-4xl font-semibold tracking-tight ${c.value}`}>
            {display}
          </p>
        </div>
      </div>

      <div className="mt-6">
        <Select value={period} onValueChange={onPeriodChange}>
          <SelectTrigger className="h-8 w-36 rounded-md bg-muted text-foreground/80">
            <SelectValue placeholder="Period" />
          </SelectTrigger>
          <SelectContent>
            {periodOptions.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </Card>
  );
}