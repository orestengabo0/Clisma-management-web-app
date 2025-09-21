// src/components/AnalyticsSection.tsx
import React, { useMemo, useState } from 'react'
import { MonthRange, MonthRangePicker, MONTHS } from './EmissionPieChart'
import { LocationPicker } from './LocationPicker';
import VehiclePicker from './VehiclePicker';
import DailyEmissionChart from './DailyEmissionChart';
import TopEmissionBarchart from './TopEmissionBarchart';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { StatsCard } from './StatsCard';
import { AlertCircle, BrainCircuit, Car, Factory, LineChart, Rocket } from 'lucide-react';
import GasesStatsCard from './GasesStatsCard';
import GasesStatCard from './GasesStatsCard';
import HotspotsHeatMap from './HotspotsHeatMap';
import GeoHotspotBarChart from './GeoHotsportBarChart';
import TopPollutedAreasTable from './TopPollutedAreasTable';
import HighestPollutingVehiclesTable from './HighestPollutingVehiclesTable';
import { AdvancedAnalyticsCard } from './AdvancedAnalyticsCardProps';

const AnalyticsSection = () => {
  const [location, setLocation] = useState<string | undefined>(undefined);
  const [vehicle, setVehicle] = useState<string | undefined>(undefined);
  const [range, setRange] = useState<MonthRange>({
    start: { month: 0, year: 2024 },
    end: { month: 5, year: 2024 },
  });
  const [period1, setPeriod1] = useState("last_year");
  const [period2, setPeriod2] = useState("last_year");
  const [period3, setPeriod3] = useState("last_year");

  const rangeLabel = useMemo(
    () => `${MONTHS[range.start.month]} ${range.start.year} – ${MONTHS[range.end.month]} ${range.end.year}`,
    [range]
  );

  const desc =
    "The current inspection trend indicates that emissions will reduce by 5% in the next 3 month if compliance continues";

  return (
    <div className="p-6 space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
        <p className="text-muted-foreground mt-1">Interactive insights and trend analysis.</p>
      </div>

      <div className="flex flex-wrap items-center gap-4 bg-card p-4 rounded-lg border shadow-sm">
        <div className="flex-1 min-w-[240px]">
          <p className="text-sm font-medium mb-1">Time Range</p>
          <MonthRangePicker value={range} onChange={setRange} />
        </div>
        <div className="flex-1 min-w-[200px]">
          <p className="text-sm font-medium mb-1">Location</p>
          <LocationPicker value={location ?? 'all'} onChange={setLocation} />
        </div>
        <div className="flex-1 min-w-[200px]">
          <p className="text-sm font-medium mb-1">Vehicle Type</p>
          <VehiclePicker value={vehicle} onChange={setVehicle} />
        </div>
      </div>

      {/* Charts: 2/3 left (Daily) and 1/3 right (Top Emission) */}
      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6 items-stretch">
        {/* Left: Daily Emission Trends */}
        <Card className="h-[28rem] flex flex-col overflow-hidden">
          <CardHeader className="pb-2">
            <CardTitle>Daily Emission Trends</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 p-4 pr-6 min-h-0">
            <DailyEmissionChart className="h-full" />
          </CardContent>
        </Card>

        {/* Right: Top Emission Bar Chart */}
        <TopEmissionBarchart />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatsCard
          title="Total Vehicles Scanned"
          value={2400000}            // will show 2.4M
          icon={<Car className="h-5 w-5" />}
          color="emerald"
          period={period1}
          onPeriodChange={setPeriod1}
        />

        <StatsCard
          title="Violations Detected"
          value={900000}             // will show 900K (or 0.9M depending on your formatter)
          icon={<AlertCircle className="h-5 w-5" />}
          color="rose"
          period={period2}
          onPeriodChange={setPeriod2}
        />

        <StatsCard
          title="Avg Emission Rate"
          value={30}
          unit="%"                   // shows 30%
          icon={<Factory className="h-5 w-5" />}
          color="amber"
          period={period3}
          onPeriodChange={setPeriod3}
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
        <GasesStatCard gas="CO" value={986} unit="gm" variant="emerald" />
        <GasesStatCard gas="NO₂" value={1320} unit="gm" variant="rose" />
        <GasesStatCard gas="PM" value={30} unit="µg/m³" variant="amber" />
        <GasesStatCard gas="PM" value={30} unit="µg/m³" variant="amber" />
      </div>
      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
        <HotspotsHeatMap />
        <GeoHotspotBarChart />
        <TopPollutedAreasTable />
      </div>
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
        <HighestPollutingVehiclesTable />
        <Card className="mt-6 p-4">
          <div className="flex justify-center items-center h-full">
            [Placeholder for AI Prediction Card]
          </div>
        </Card>
      </div>
      <section className="space-y-4">
      <h2 className="text-lg sm:text-xl font-semibold">Advanced Analytics</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        <AdvancedAnalyticsCard
          icon={<BrainCircuit className="h-6 w-6" />}
          title="AI Prediction"
          description={desc}
          href="#"
        />
        <AdvancedAnalyticsCard
          icon={<LineChart className="h-6 w-6" />}
          title="AI Prediction"
          description={desc}
          href="#"
        />
        <AdvancedAnalyticsCard
          icon={<Rocket className="h-6 w-6" />}
          title="AI Prediction"
          description={desc}
          href="#"
        />
      </div>
    </section>
    </div>
  );
};

export default AnalyticsSection;