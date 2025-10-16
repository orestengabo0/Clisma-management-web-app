// src/components/EmissionTrendChart.tsx
import React, { useEffect, useMemo, useState } from "react";
import { ResponsiveContainer, LineChart, CartesianGrid, XAxis, YAxis, Line } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import { getAdjustableEmissionAverages, type AdjustableInterval } from "@/lib/api";
import LoadingPlaceholder from "@/components/ui/loading-placeholder";

type Props = { className?: string };

type TrendPoint = {
    label: string; // time bucket label from API keys
    AQI: number;
    MQ135: number;
    MQ7: number;
    COppm: number;
};

const chartConfig = {
    AQI: { label: "AQI", color: "#2E50CB" },
    MQ135: { label: "MQ135", color: "#3CC3DF" },
    MQ7: { label: "MQ7", color: "#FFAE4C" },
    COppm: { label: "CO (ppm)", color: "#FF5C5C" },
} satisfies ChartConfig;

function getDefaultRangeForInterval(interval: AdjustableInterval): { start: string; end: string } {
    const end = new Date();
    const start = new Date(end);
    if (interval === "hour") start.setDate(end.getDate() - 7); // last 7 days by hour
    else if (interval === "month") start.setMonth(end.getMonth() - 6); // last 6 months
    else if (interval === "year") start.setFullYear(end.getFullYear() - 3); // last 3 years
    else start.setDate(end.getDate() - 7);
    return { start: start.toISOString(), end: end.toISOString() };
}

const EmissionTrendChart: React.FC<Props> = ({ className = "h-full" }) => {
    const [interval, setInterval] = useState<AdjustableInterval>("hour");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [data, setData] = useState<TrendPoint[]>([]);

    const { start, end } = useMemo(() => getDefaultRangeForInterval(interval), [interval]);

    useEffect(() => {
        let cancelled = false;
        (async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await getAdjustableEmissionAverages(start, end, interval);
                // response is Record<label, EmissionAverages>
                const points: TrendPoint[] = Object.entries(response)
                    .sort(([a], [b]) => a.localeCompare(b))
                    .map(([label, v]) => ({
                        label,
                        AQI: v.aqi,
                        MQ135: v.mq135,
                        MQ7: v.mq7,
                        COppm: v.coPpm,
                    }));
                if (!cancelled) setData(points);
            } catch (e) {
                if (!cancelled) setError(e instanceof Error ? e.message : "Failed to load emission trends");
            } finally {
                if (!cancelled) setLoading(false);
            }
        })();
        return () => { cancelled = true; };
    }, [interval, start, end]);

    return (
        <Card className="h-[28rem] flex flex-col overflow-hidden">
            <div className="flex justify-between p-6">
                <CardTitle className="font-bold">Emission Trends</CardTitle>
                <div className="">
                    <select
                        id="interval"
                        className="border rounded-md px-2 py-1 text-sm"
                        value={interval}
                        onChange={(e) => setInterval(e.target.value as AdjustableInterval)}
                    >
                        <option value="hour">Hour</option>
                        <option value="month">Month</option>
                        <option value="year">Year</option>
                    </select>
                </div>
            </div>
            <CardContent className="flex-1 p-4 min-h-0">
                {loading ? (
                    <LoadingPlaceholder kind="chart" heightClass="h-64" />
                ) : error ? (
                    <div className="mt-2 text-sm text-red-600">{error}</div>
                ) : (
                    <ChartContainer config={chartConfig} className={`h-full w-full !aspect-auto ${className}`}>
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={data} margin={{ left: 16, right: 12, top: 8, bottom: 8 }}>
                                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                                <XAxis dataKey="label" tickLine={false} axisLine={false} tickMargin={8} minTickGap={16} />
                                <YAxis tickLine={false} axisLine={false} tickMargin={8} />
                                <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                                <Line type="monotone" dataKey="AQI" stroke={chartConfig.AQI.color} strokeWidth={2} dot={{ r: 3, fill: chartConfig.AQI.color }} activeDot={{ r: 5 }} />
                                <Line type="monotone" dataKey="MQ135" stroke={chartConfig.MQ135.color} strokeWidth={2} dot={{ r: 3, fill: chartConfig.MQ135.color }} activeDot={{ r: 5 }} />
                                <Line type="monotone" dataKey="MQ7" stroke={chartConfig.MQ7.color} strokeWidth={2} dot={{ r: 3, fill: chartConfig.MQ7.color }} activeDot={{ r: 5 }} />
                                <Line type="monotone" dataKey="COppm" stroke={chartConfig.COppm.color} strokeWidth={2} dot={{ r: 3, fill: chartConfig.COppm.color }} activeDot={{ r: 5 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </ChartContainer>
                )}
            </CardContent>
        </Card>
    );
};

export default EmissionTrendChart;