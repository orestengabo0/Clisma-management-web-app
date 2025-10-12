// src/components/AnalyticsSection.tsx (DashboardSection)
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AnalyticsCard } from './AnalyticsCard';
import { FaCar } from 'react-icons/fa6';
import { IoWarning, IoCarSportOutline } from "react-icons/io5";
import { SiPodcastindex } from "react-icons/si";
import DailyEmissionChart from './DailyEmissionChart';
import { Button } from './ui/button';
import DeviceClusterMap from './DeviceClusterMap';
import { HiOutlineCpuChip } from "react-icons/hi2";
import MonitoringTabs from './MonitoringTabs';
import { useEffect, useState } from 'react';
import { useAuthStore } from '@/lib/authStore';
import { getHotspotsCount, getVehicleDetectionsCount } from '@/lib/api';

export function DashboardSection() {
  const iconSize = 30;
  const token = useAuthStore((s) => s.token);
  const [vehicleCount, setVehicleCount] = useState<number | null>(null);
  const [hotspotCount, setHotspotCount] = useState<number | null>(null);

  useEffect(() => {
    if (!token) return;
    let isCancelled = false;
    (async () => {
      try {
        const [vehicles, hotspots] = await Promise.all([
          getVehicleDetectionsCount(),
          getHotspotsCount(),
        ]);
        if (!isCancelled) {
          setVehicleCount(vehicles);
          setHotspotCount(hotspots);
        }
      } catch {
        // ignore errors for now; could add UI toast/logging later
      }
    })();
    return () => {
      isCancelled = true;
    };
  }, [token]);

  return (
    <div className="p-6 space-y-6">
      <h1 className='text-2xl font-semibold'>Welcome, Oreste</h1>
      <h1 className="text-3xl font-bold">Dashboard</h1>

      {/* Top Section: Main Graph and Analytics Data */}
      <div className="flex flex-col md:flex-row gap-6">
        <Card className="flex-1 flex flex-col p-3 pr-6 h-[30rem]">
          <CardHeader className="pb-2">
            <CardTitle>Emission Trends</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 p-0">
            <DailyEmissionChart className="h-full" />
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:w-1/2">
          <AnalyticsCard icon={<FaCar size={iconSize} />} title="Vehicles Detected" value={vehicleCount !== null ? vehicleCount.toLocaleString() : '—'} description="+400 from last month" />
          <AnalyticsCard icon={<IoWarning size={iconSize} color='#db0707ff' />} title="Violations Detected" value="+2,350" description="+180 from last month" />
          <AnalyticsCard icon={<IoCarSportOutline size={iconSize} />} title="Avg Emission Rate" value="30%" description="Rate" />
          <AnalyticsCard icon={<SiPodcastindex size={iconSize} />} title="Active Hot-Spots" value={hotspotCount !== null ? hotspotCount.toLocaleString() : '—'} description="Stations" />
        </div>
      </div>

      {/* Bottom Section: Device Location Map and Live Camera Stream */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        {/* Left: Device Location Map */}
        <Card className="h-[36rem] flex flex-col">
          <CardHeader className="pb-2 flex-shrink-0">
            <CardTitle className="text-lg">Device Location & Coverage</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 overflow-hidden">
            <div className="h-full w-full">
              <DeviceClusterMap />
            </div>
          </CardContent>
        </Card>

        {/* Right: Live Camera Monitoring */}
        <Card className="h-[36rem] flex flex-col px-3">
          <CardHeader className="pb-2 flex-shrink-0">
            <CardTitle className="text-lg">Live Camera Monitoring</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 p-1 overflow-hidden">
            <MonitoringTabs className="h-full" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}