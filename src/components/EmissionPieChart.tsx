import React, { useMemo, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { PieChart, Pie, Cell } from "recharts";
import { Calendar as CalendarIcon } from "lucide-react";

const chartData = [
  { gas: "CO2", level: 400, fill: "#CD273F" },
  { gas: "NO2", level: 300, fill: "#8979FF" },
  { gas: "SO2", level: 200, fill: "#D89B76" },
  { gas: "CO", level: 278, fill: "#3CC3DF" },
  { gas: "PM2.5", level: 189, fill: "#A3A3A3" },
];

const chartConfig = {
  gas: { label: "Gas" },
  CO2: { label: "CO2", color: "hsl(var(--chart-1))" },
  NO2: { label: "NO2", color: "hsl(var(--chart-2))" },
  SO2: { label: "SO2", color: "hsl(var(--chart-3))" },
  CO: { label: "CO", color: "hsl(var(--chart-4))" },
  "PM2.5": { label: "PM2.5", color: "hsl(var(--chart-5))" },
} satisfies ChartConfig;

export type MonthRange = {
  start: { month: number; year: number };
  end: { month: number; year: number };
};

export const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
export const currentYear = new Date().getFullYear();
export const YEARS = Array.from({ length: 6 }, (_, i) => currentYear - 5 + i); // e.g., 2020..current

export function EmissionsPieCard() {
  // Default range: Jan–Jun 2024
  const [range, setRange] = useState<MonthRange>({
    start: { month: 0, year: 2024 },
    end: { month: 5, year: 2024 },
  });

  // Format range for the header
  const rangeLabel = useMemo(
    () =>
      `${MONTHS[range.start.month]} ${range.start.year} – ${MONTHS[range.end.month]} ${range.end.year}`,
    [range]
  );

  const total = chartData.reduce((sum, d) => sum + d.level, 0);

  return (
    <Card className="lg:col-span-1">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <div>
            <CardTitle>Emissions by Gas</CardTitle>
            <CardDescription>{rangeLabel}</CardDescription>
          </div>
          <MonthRangePicker value={range} onChange={setRange} />
        </div>
      </CardHeader>

      <CardContent className="pb-6">
        {/* Chart */}
        <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[270px]">
          <PieChart>
            <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
            <Pie
              data={chartData}
              dataKey="level"
              nameKey="gas"
              innerRadius={60}
              outerRadius={100}
              strokeWidth={2}
            >
              {chartData.map((d) => (
                <Cell key={d.gas} fill={d.fill} />
              ))}
            </Pie>
          </PieChart>
        </ChartContainer>

        {/* Always-visible legend */}
        <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
          {chartData.map((d) => {
            const pct = ((d.level / total) * 100).toFixed(1);
            return (
              <div key={d.gas} className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full" style={{ backgroundColor: d.fill }} aria-hidden />
                <span className="text-muted-foreground">{d.gas}</span>
                <span className="ml-auto font-medium">{pct}%</span>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

// Month range picker used in the header (Popover + Selects)
export function MonthRangePicker({
  value,
  onChange,
}: {
  value: MonthRange;
  onChange: (next: MonthRange) => void;
}) {
  const [open, setOpen] = useState(false);
  const normalize = (next: MonthRange) => {
    const a = new Date(next.start.year, next.start.month, 1);
    const b = new Date(next.end.year, next.end.month, 1);
    // Ensure start <= end by swapping if needed
    if (a > b) return { start: next.end, end: next.start };
    return next;
  };

  const setStartMonth = (m: number) => onChange(normalize({ ...value, start: { ...value.start, month: m } }));
  const setStartYear = (y: number) => onChange(normalize({ ...value, start: { ...value.start, year: y } }));
  const setEndMonth = (m: number) => onChange(normalize({ ...value, end: { ...value.end, month: m } }));
  const setEndYear = (y: number) => onChange(normalize({ ...value, end: { ...value.end, year: y } }));

  const label = `${MONTHS[value.start.month]} ${value.start.year} – ${MONTHS[value.end.month]} ${value.end.year}`;

  // Quick presets (optional)
  const applyPreset = (monthsBack: number) => {
    const end = new Date();
    const start = new Date(end.getFullYear(), end.getMonth() - (monthsBack - 1), 1);
    onChange(
      normalize({
        start: { month: start.getMonth(), year: start.getFullYear() },
        end: { month: end.getMonth(), year: end.getFullYear() },
      })
    );
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" role="combobox" aria-expanded={open} className="w-[220px] justify-between">
          <CalendarIcon className="h-4 w-4" />
          <span className="hidden md:inline">{label}</span>
          <span className="md:hidden">Select months</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[340px] p-4" align="end">
        <div className="space-y-4">
          {/* Presets */}
          <div className="flex flex-wrap gap-2">
            <Button variant="secondary" size="sm" onClick={() => applyPreset(3)}>
              Last 3M
            </Button>
            <Button variant="secondary" size="sm" onClick={() => applyPreset(6)}>
              Last 6M
            </Button>
            <Button variant="secondary" size="sm" onClick={() => {
              const now = new Date();
              onChange({ start: { month: 0, year: now.getFullYear() }, end: { month: now.getMonth(), year: now.getFullYear() } });
            }}>
              YTD
            </Button>
          </div>

          {/* Custom range */}
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2 text-xs text-muted-foreground">From</div>
            <Select
              value={String(value.start.month)}
              onValueChange={(v) => setStartMonth(Number(v))}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Month" />
              </SelectTrigger>
              <SelectContent>
                {MONTHS.map((m, i) => (
                  <SelectItem key={m} value={String(i)}>
                    {m}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={String(value.start.year)}
              onValueChange={(v) => setStartYear(Number(v))}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Year" />
              </SelectTrigger>
              <SelectContent>
                {YEARS.map((y) => (
                  <SelectItem key={y} value={String(y)}>
                    {y}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="col-span-2 text-xs text-muted-foreground mt-2">To</div>
            <Select
              value={String(value.end.month)}
              onValueChange={(v) => setEndMonth(Number(v))}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Month" />
              </SelectTrigger>
              <SelectContent>
                {MONTHS.map((m, i) => (
                  <SelectItem key={m} value={String(i)}>
                    {m}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={String(value.end.year)}
              onValueChange={(v) => setEndYear(Number(v))}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Year" />
              </SelectTrigger>
              <SelectContent>
                {YEARS.map((y) => (
                  <SelectItem key={y} value={String(y)}>
                    {y}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}