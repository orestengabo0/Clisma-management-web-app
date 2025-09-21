import React from "react";
import { AnalyticsCard } from "../AnalyticsCard";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { ChartConfig } from "../ui/chart";
import { FaTruckFront } from "react-icons/fa6";
import { EmissionsPieCard } from "../EmissionPieChart";
import LiveCamera from "../LiveCamera";
import LatestDetections from "../LatestDetections";

const MonitoringSection = () => {
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
                    <AnalyticsCard icon={<FaTruckFront size={iconSize} />} title="Vehicles Detected" value="4,507" description="+400 from last month" />
                    <AnalyticsCard icon={<FaTruckFront size={iconSize}/>} title="Violations Detected" value="+2,350" description="+180 from last month" />
                    <AnalyticsCard icon={<FaTruckFront size={iconSize} />} title="Avg Emission Rate" value="30%" description="Rate" />
                    <AnalyticsCard icon={<FaTruckFront size={iconSize} />} title="Active Hot-Spots" value="47" description="Stations" />
                </div>

                <EmissionsPieCard />
                <div className="grid gap-6 sm:grid-cols-1 lg:grid-cols-2 lg:col-span-3">
                    <LiveCamera />
                    <LatestDetections />
                </div>
                <div className="col-span-full h-[30rem]">
                    <Card className="w-full h-full">
                        <CardHeader>
                            <CardTitle>Emission Map</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center justify-center h-full bg-gray-100 rounded-lg text-gray-400">
                                [Placeholder for Map]
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default MonitoringSection;