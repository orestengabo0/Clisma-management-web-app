// src/components/AnalyticsSection.tsx
import React, { useMemo, useState } from 'react'
import { MonthRange, MonthRangePicker, MONTHS } from './EmissionPieChart'
import { LocationPicker } from './LocationPicker';
import VehiclePicker from './VehiclePicker';
import DailyEmissionChart from './DailyEmissionChart';
import TopEmissionBarchart from './TopEmissionBarchart';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

const AnalyticsSection = () => {
  const [location, setLocation] = useState<string | undefined>(undefined);
  const [vehicle, setVehicle] = useState<string | undefined>(undefined);
  const [range, setRange] = useState<MonthRange>({
    start: { month: 0, year: 2024 },
    end: { month: 5, year: 2024 },
  });

  const rangeLabel = useMemo(
    () => `${MONTHS[range.start.month]} ${range.start.year} – ${MONTHS[range.end.month]} ${range.end.year}`,
    [range]
  );

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
          <CardContent className="flex-1 p-0 min-h-0">
            <DailyEmissionChart className="h-full" />
          </CardContent>
        </Card>

        {/* Right: Top Emission Bar Chart */}
        <TopEmissionBarchart />
      </div>
    </div>
  );
};

export default AnalyticsSection;