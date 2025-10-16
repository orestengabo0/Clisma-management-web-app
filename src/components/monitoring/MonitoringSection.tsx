import { useEffect, useState } from "react";
import { AnalyticsCard } from "../AnalyticsCard";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { ChartConfig } from "../ui/chart";
import { FaCar } from "react-icons/fa6";
import { EmissionsPieCard, type EmissionSlice } from "../EmissionPieChart";
import LatestDetections from "../LatestDetections";
import { useAuthStore } from "@/lib/authStore";
import { getEmissionAverages, getHotspotsCount, getVehicleDetectionsCount } from '@/lib/api';
import { IoCarSportOutline, IoWarning } from "react-icons/io5";
import { SiPodcastindex } from "react-icons/si";
import DeviceHeatMap from "../DeviceHeatMap";
import CameraStream from "../CameraStream";

const MonitoringSection = () => {
    const token = useAuthStore((s) => s.token);
    const [vehicleCount, setVehicleCount] = useState<number | null>(null);
    const [hotspotCount, setHotspotCount] = useState<number | null>(null);
    const [emissionSlices, setEmissionSlices] = useState<EmissionSlice[] | null>(null);

    useEffect(() => {
        if (!token) return;
        let isCancelled = false;
        (async () => {
            try {
                const [vehicles, hotspots, averages] = await Promise.all([
                    getVehicleDetectionsCount(),
                    getHotspotsCount(),
                    getEmissionAverages(),
                ]);
                if (!isCancelled) {
                    setVehicleCount(vehicles);
                    setHotspotCount(hotspots);
                    const slices: EmissionSlice[] = [
                        { gas: "AQI", level: averages.aqi, fill: "#CD273F" },
                        { gas: "MQ135", level: averages.mq135, fill: "#8979FF" },
                        { gas: "MQ7", level: averages.mq7, fill: "#D89B76" },
                        { gas: "CO (ppm)", level: averages.coPpm, fill: "#3CC3DF" },
                        { gas: "MQ135R", level: averages.mq135R, fill: "#A3A3A3" },
                    ];
                    setEmissionSlices(slices);
                }
            } catch {
                // ignore errors for now; could add UI toast/logging later
            }
        })();
        return () => {
            isCancelled = true;
        };
    }, [token]);

    const iconSize = 30;
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

    return (
        <div className="p-6 space-y-6">
            <div>
                <h1 className="text-3xl font-bold">Real-time Monitoring</h1>
                <p>Visualization of real-time & Emission Trend Tracking</p>
            </div>

            {/* Row: left = cards (2x2), right = pie chart */}
            <div className="grid gap-6 lg:grid-cols-3 items-start">
                {/* Left: 2x2 analytics cards (spans 2/3) */}
                <div className="grid grid-cols-2 gap-6 lg:col-span-2 min-w-0">
                    <AnalyticsCard icon={<FaCar size={iconSize} />} title="Vehicles Detected" value={vehicleCount !== null ? vehicleCount.toLocaleString() : '—'} description="+400 from last month" />
                    <AnalyticsCard icon={<IoWarning size={iconSize} />} title="Violations Detected" value="+2,350" description="+180 from last month" />
                    <AnalyticsCard icon={<IoCarSportOutline size={iconSize} />} title="Avg Emission Rate" value="30%" description="Rate" />
                    <AnalyticsCard icon={<SiPodcastindex size={iconSize} />} title="Active Hot-Spots" value={hotspotCount !== null ? hotspotCount.toLocaleString() : '—'} description="Stations" />
                </div>

                <EmissionsPieCard data={emissionSlices ?? [
                    { gas: "CO2", level: 0, fill: "#CD273F" },
                    { gas: "NOx", level: 0, fill: "#8979FF" },
                    { gas: "PM10", level: 0, fill: "#D89B76" },
                    { gas: "CO", level: 0, fill: "#3CC3DF" },
                    { gas: "PM2.5", level: 0, fill: "#A3A3A3" },
                ]} />
                <div className="grid gap-6 sm:grid-cols-1 lg:grid-cols-2 lg:col-span-3">
                    <CameraStream />
                    <LatestDetections />
                </div>
                <div className="col-span-full h-[30rem]">
                    <Card className="w-full h-full flex flex-col">
                        <CardHeader className="pb-2 flex-shrink-0">
                            <CardTitle>Emission Map (Heat)</CardTitle>
                        </CardHeader>
                        <CardContent className="flex-1 p-0 overflow-hidden">
                            <div className="relative w-full h-full">
                                <DeviceHeatMap />
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default MonitoringSection;