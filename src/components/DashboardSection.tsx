// src/components/AnalyticsSection.tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AnalyticsCard } from './AnalyticsCard';
import { FaTruckFront } from 'react-icons/fa6';

export function AnalyticsSection() {
  const iconSize = 30;
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>

      {/* Top Section: Main Graph and Analytics Data */}
      <div className="flex flex-col md:flex-row gap-6">
        {/* Graph Placeholder */}
        <Card className="flex-1 p-4 h-96">
          <CardHeader>
            <CardTitle>Emission Trends</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Here you would integrate a charting library like Recharts or Chart.js */}
            <div className="flex items-center justify-center h-full bg-gray-100 rounded-lg text-gray-400">
              [Placeholder for Graph]
            </div>
          </CardContent>
        </Card>

        {/* Analytics Data Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:w-1/2">
          <AnalyticsCard icon={<FaTruckFront size={iconSize} />} title="Vehicles Detected" value="4,507" description="+400 from last month" />
          <AnalyticsCard icon={<FaTruckFront size={iconSize} />} title="Violations Detected" value="+2,350" description="+180 from last month" />
          <AnalyticsCard icon={<FaTruckFront size={iconSize} />} title="Avg Emission Rate" value="30%" description="Rate" />
          <AnalyticsCard icon={<FaTruckFront size={iconSize} />} title="Active Hot-Spots" value="47" description="Stations" />
        </div>
      </div>

      {/* Bottom Section: Other Graphs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="p-4 h-72">
          <CardHeader>
            <CardTitle>Users by Country</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center h-full bg-gray-100 rounded-lg text-gray-400">
              [Another Graph Placeholder]
            </div>
          </CardContent>
        </Card>

        <Card className="p-4 h-72">
          <CardHeader>
            <CardTitle>Sessions by Device</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center h-full bg-gray-100 rounded-lg text-gray-400">
              [Another Graph Placeholder]
            </div>
          </CardContent>
        </Card>

        <Card className="p-4 h-72">
          <CardHeader>
            <CardTitle>Revenue by Product</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center h-full bg-gray-100 rounded-lg text-gray-400">
              [Another Graph Placeholder]
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}