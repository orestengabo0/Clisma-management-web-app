// src/components/GeoHotspotBarChart.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";

type Props = {
  className?: string; // height/width control (defaults to h-[24rem])
};

const data = [
  { type: "Car",   PM: 20, COx: 95, SOx: 52, NO: 95 },
  { type: "Truck", PM: 90, COx: 25, SOx: 75, NO: 85 },
  { type: "Moto",  PM: 95, COx: 50, SOx: 70, NO: 95 },
  { type: "Bus",   PM: 100, COx: 95, SOx: 30, NO: 25 },
];

const chartConfig = {
  PM:  { label: "PM",  color: "#6366F1" }, // indigo-500
  COx: { label: "COx", color: "#FB7185" }, // rose-400
  SOx: { label: "SOx", color: "#22D3EE" }, // cyan-400
  NO:  { label: "NO",  color: "#F59E0B" }, // amber-500
} satisfies ChartConfig;

export default function GeoHotspotBarChart({ className = "h-[24rem]" }: Props) {
  return (
    <Card className="rounded-2xl">
      <CardHeader className="pb-2">
        <CardTitle>Geographic HotSpot & Unit Activity</CardTitle>
      </CardHeader>

      <CardContent className="p-4 pt-0">
        <ChartContainer config={chartConfig} className={`w-full !aspect-auto ${className}`}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ left: 16, right: 16, top: 8, bottom: 8 }}
              barCategoryGap={24}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="type"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
              />
              <YAxis
                domain={[0, 100]}
                tickLine={false}
                axisLine={false}
                tickMargin={8}
              />
              <ChartTooltip content={<ChartTooltipContent />} />

              <Bar dataKey="PM"  fill={chartConfig.PM.color}  radius={[6, 6, 0, 0]} />
              <Bar dataKey="COx" fill={chartConfig.COx.color} radius={[6, 6, 0, 0]} />
              <Bar dataKey="SOx" fill={chartConfig.SOx.color} radius={[6, 6, 0, 0]} />
              <Bar dataKey="NO"  fill={chartConfig.NO.color}  radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>

        {/* Legend */}
        <div className="mt-4 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm">
          {Object.entries(chartConfig).map(([key, cfg]) => (
            <div key={key} className="flex items-center gap-2">
              <span
                className="inline-block h-3 w-3 rounded-sm"
                style={{ backgroundColor: cfg.color }}
                aria-hidden
              />
              <span className="text-muted-foreground">{cfg.label}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}