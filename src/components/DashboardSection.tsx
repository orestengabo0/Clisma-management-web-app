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

      {/* Bottom Section: Map (left 2/3) + Right column (MonitoringTabs top, AI card bottom) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map: spans 2/3 on large screens */}
        <Card className="lg:col-span-2 h-[32rem] flex flex-col">
          <CardHeader className="pb-2">
            <CardTitle>Device Location</CardTitle>
          </CardHeader>
          <CardContent className="flex-1">
            <div className="h-full">
              <DeviceClusterMap />
            </div>
          </CardContent>
        </Card>

        {/* Right column: MonitoringTabs (top) + AI predictions card (bottom) */}
        <div className="lg:col-span-1 flex flex-col h-[32rem] gap-6">
          {/* Fill available height */}
          <MonitoringTabs className="flex-1 min-h-0" />

          <Card className="p-2 pb-0 bg-[#113B38]">
            <div className="flex justify-between items-center h-full">
              <div>
                <p className="text-white pl-6 pt-3">WANNA VIEW AI PREDICTIONS</p>
                <CardContent>
                  <p className="text-white text-2xl font-bold">
                    Get More Action Through Our AI Prediction
                  </p>
                  <Button className="bg-white text-black mt-3 hover:bg-gray-100">
                    Go to AI center
                  </Button>
                </CardContent>
              </div>
              <div>
                <HiOutlineCpuChip size={100} color="#fff" />
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}