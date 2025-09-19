// src/components/DailyEmissionChart.tsx
import { CartesianGrid, Line, LineChart, XAxis, YAxis, ResponsiveContainer } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

const chartData = [
  { hour: "00:00", CO: 20, NO_2: 30, PM2_5: 25, SOx: 15 },
  { hour: "01:00", CO: 35, NO_2: 25, PM2_5: 30, SOx: 20 },
  { hour: "02:00", CO: 25, NO_2: 30, PM2_5: 35, SOx: 15 },
  { hour: "03:00", CO: 20, NO_2: 25, PM2_5: 30, SOx: 10 },
  { hour: "04:00", CO: 35, NO_2: 30, PM2_5: 25, SOx: 20 },
  { hour: "05:00", CO: 25, NO_2: 35, PM2_5: 30, SOx: 15 },
  { hour: "06:00", CO: 20, NO_2: 25, PM2_5: 35, SOx: 10 },
  { hour: "07:00", CO: 35, NO_2: 30, PM2_5: 25, SOx: 20 },
  { hour: "08:00", CO: 25, NO_2: 35, PM2_5: 30, SOx: 15 },
  { hour: "09:00", CO: 20, NO_2: 25, PM2_5: 35, SOx: 10 },
  { hour: "10:00", CO: 35, NO_2: 30, PM2_5: 25, SOx: 20 },
  { hour: "11:00", CO: 25, NO_2: 35, PM2_5: 30, SOx: 15 },
];

const chartConfig = {
  CO:   { label: "CO",    color: "#2E50CB" },
  NO_2: { label: "NO₂",   color: "#3CC3DF" },
  PM2_5:{ label: "PM₂.₅", color: "#FFAE4C" },
  SOx:  { label: "SOx",   color: "#FF5C5C" },
} satisfies ChartConfig;

type Props = { className?: string };

const DailyEmissionChart = ({ className = "h-full" }: Props) => {
  return (
    <div className={`w-full ${className} min-h-0`}>
      <ChartContainer
        config={chartConfig}
        className="h-full w-full !aspect-auto overflow-hidden"
      >
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ left: 16, right: 12, top: 8, bottom: 8 }}>
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis dataKey="hour" tickLine={false} axisLine={false} tickMargin={8} />
            <YAxis tickLine={false} axisLine={false} tickMargin={8} />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <Line type="monotone" dataKey="CO"   stroke={chartConfig.CO.color}   strokeWidth={2} dot={{ r: 3, fill: chartConfig.CO.color }}   activeDot={{ r: 5 }} />
            <Line type="monotone" dataKey="NO_2" stroke={chartConfig.NO_2.color} strokeWidth={2} dot={{ r: 3, fill: chartConfig.NO_2.color }} activeDot={{ r: 5 }} />
            <Line type="monotone" dataKey="PM2_5" stroke={chartConfig.PM2_5.color} strokeWidth={2} dot={{ r: 3, fill: chartConfig.PM2_5.color }} activeDot={{ r: 5 }} />
            <Line type="monotone" dataKey="SOx"  stroke={chartConfig.SOx.color}  strokeWidth={2} dot={{ r: 3, fill: chartConfig.SOx.color }}  activeDot={{ r: 5 }} />
          </LineChart>
        </ResponsiveContainer>
      </ChartContainer>
    </div>
  );
};

export default DailyEmissionChart;