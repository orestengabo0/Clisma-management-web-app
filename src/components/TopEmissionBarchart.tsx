// src/components/TopEmissionBarchart.tsx
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "./ui/chart";
import { Bar, BarChart, XAxis, YAxis } from "recharts";

const chartData = [
  { location: "Mukamira", emission: 30 },
  { location: "Kigali", emission: 50 },
  { location: "Butare", emission: 61 },
  { location: "Gisenyi", emission: 40 },
  { location: "Ruhengeri", emission: 54 },
  { location: "Nyagatare", emission: 50 },
];

const chartConfig = {
  emission: { label: "Emission", color: "#E8A370" },
} satisfies ChartConfig;

const TopEmissionBarchart = () => {
  return (
    <Card className="h-[28rem] flex flex-col p-4 pl-6">
      <CardHeader className="pb-2">
        <CardTitle>Top Emission Trends</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 p-0">
        <ChartContainer config={chartConfig} className="h-full w-full">
          <BarChart
            accessibilityLayer
            data={chartData}
            layout="vertical"
            margin={{ left: 12, right: 16, top: 8, bottom: 8 }}
          >
            <XAxis type="number" dataKey="emission" hide />
            <YAxis
              dataKey="location"
              type="category"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <Bar dataKey="emission" fill={chartConfig.emission.color} radius={[6, 6, 6, 6]} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default TopEmissionBarchart;