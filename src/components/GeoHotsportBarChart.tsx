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
import { useEffect, useState } from "react";
import { useAuthStore } from "@/lib/authStore";
import { getEmissionAveragesByVehicleType } from "@/lib/api";
import { AlertCircle, Loader2 } from "lucide-react";

type Props = {
  className?: string; // height/width control (defaults to h-[24rem])
};

type ChartData = {
  type: string;
  AQI: number;
  MQ135: number;
  MQ7: number;
  COppm: number;
  MQ135R: number;
};

const chartConfig = {
  AQI: { label: "AQI", color: "#6366F1" },
  MQ135: { label: "MQ135", color: "#FB7185" },
  MQ7: { label: "MQ7", color: "#22D3EE" },
  COppm: { label: "CO (ppm)", color: "#F59E0B" },
  MQ135R: { label: "MQ135R", color: "#10B981" },
} satisfies ChartConfig;

export default function GeoHotspotBarChart({ className = "h-[24rem]" }: Props) {
  const token = useAuthStore((s) => s.token);
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;

    const vehicleTypes = ['CAR', 'TRUCK', 'BUS', 'MOTORCYCLE'];
    let isCancelled = false;

    (async () => {
      setLoading(true);
      setError(null);

      try {
        const promises = vehicleTypes.map(async (type) => {
          try {
            const data = await getEmissionAveragesByVehicleType(type);
            return {
              type: type.charAt(0) + type.slice(1).toLowerCase(), // Capitalize first letter
              AQI: data.aqi,
              MQ135: data.mq135,
              MQ7: data.mq7,
              COppm: data.coPpm,
              MQ135R: data.mq135R,
            };
          } catch (error) {
            console.warn(`Failed to fetch data for ${type}:`, error);
            return {
              type: type.charAt(0) + type.slice(1).toLowerCase(),
              AQI: 0,
              MQ135: 0,
              MQ7: 0,
              COppm: 0,
              MQ135R: 0,
            };
          }
        });

        const results = await Promise.all(promises);

        if (!isCancelled) {
          setChartData(results);
        }
      } catch (error) {
        if (!isCancelled) {
          setError('Failed to load vehicle emission data');
        }
      } finally {
        if (!isCancelled) {
          setLoading(false);
        }
      }
    })();

    return () => {
      isCancelled = true;
    };
  }, [token]);

  // Calculate max value for Y-axis domain
  const maxValue = Math.max(
    ...chartData.flatMap(d => [d.AQI, d.MQ135, d.MQ7, d.COppm, d.MQ135R])
  );
  const yAxisMax = maxValue > 0 ? Math.ceil(maxValue * 1.1) : 100;

  if (loading) {
    return (
      <Card className="rounded-2xl">
        <CardHeader className="pb-2">
          <CardTitle>Vehicle Emission Analysis</CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <div className="flex items-center justify-center h-64">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Loading emission data...</span>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="rounded-2xl">
        <CardHeader className="pb-2">
          <CardTitle>Vehicle Emission Analysis</CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <div className="flex items-center justify-center h-64">
            <div className="text-center text-red-500">
              <AlertCircle className="h-8 w-8 mx-auto mb-2" />
              <p className="font-medium">Failed to load data</p>
              <p className="text-sm text-muted-foreground">{error}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="rounded-2xl">
      <CardHeader className="pb-2">
        <CardTitle>Vehicle Emission Analysis</CardTitle>
        <p className="text-sm text-muted-foreground">Average emissions by vehicle type</p>
      </CardHeader>

      <CardContent className="p-4 pt-0">
        <ChartContainer config={chartConfig} className={`w-full !aspect-auto ${className}`}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
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
                domain={[0, yAxisMax]}
                tickLine={false}
                axisLine={false}
                tickMargin={8}
              />
              <ChartTooltip content={<ChartTooltipContent />} />

              <Bar dataKey="AQI" fill={chartConfig.AQI.color} radius={[6, 6, 0, 0]} />
              <Bar dataKey="MQ135" fill={chartConfig.MQ135.color} radius={[6, 6, 0, 0]} />
              <Bar dataKey="MQ7" fill={chartConfig.MQ7.color} radius={[6, 6, 0, 0]} />
              <Bar dataKey="COppm" fill={chartConfig.COppm.color} radius={[6, 6, 0, 0]} />
              <Bar dataKey="MQ135R" fill={chartConfig.MQ135R.color} radius={[6, 6, 0, 0]} />
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