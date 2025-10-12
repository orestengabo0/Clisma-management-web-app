import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "./ui/button";
import { Link } from "react-router-dom";
import { HighestPolluter } from "@/lib/api";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type Row = {
  plate: string;
  emissions: string[]; // e.g., ["CO", "PM"]
  rate: number;        // as percent value, e.g., 23 -> 23%
  vehicleType: string;
  totalScore: number;
};

interface HighestPollutingVehiclesTableProps {
  title?: string;
  rows?: Row[];
  data?: HighestPolluter[]; // API data
  className?: string;
  ringColorClass?: string; // customize outline color if you want
}

const DEFAULT_ROWS: Row[] = [
  { plate: "RCA123L", emissions: ["CO", "PM"], rate: 23, vehicleType: "CAR", totalScore: 92 },
  { plate: "RCA123L", emissions: ["CO", "PM"], rate: 13, vehicleType: "TRUCK", totalScore: 52 },
  { plate: "RCA123L", emissions: ["CO", "PM"], rate: 8, vehicleType: "BUS", totalScore: 32 },
  { plate: "RCA123L", emissions: ["CO", "PM"], rate: 7, vehicleType: "CAR", totalScore: 28 },
  { plate: "RCA123L", emissions: ["CO", "PM"], rate: 3, vehicleType: "OTHER", totalScore: 12 },
];

const formatRate = (n: number) => `${Number.isInteger(n) ? n : n.toFixed(1)}%`;

// Convert API data to Row format
const convertApiDataToRows = (data: HighestPolluter[]): Row[] => {
  return data.map(item => {
    // Determine which emissions are above average (simplified logic)
    const emissions: string[] = [];
    if (item.co2Level > 100) emissions.push("CO2");
    if (item.coLevel > 10) emissions.push("CO");
    if (item.noxLevel > 5) emissions.push("NOx");
    if (item.pm10Level > 50) emissions.push("PM10");
    if (item.pm25Level > 25) emissions.push("PM2.5");

    // Use totalScore as the rate (you might want to normalize this)
    const rate = Math.min(100, Math.max(0, (item.totalScore / 4))); // Normalize to 0-100%

    return {
      plate: item.licensePlate,
      emissions: emissions.length > 0 ? emissions : ["Multiple"],
      rate: rate,
      vehicleType: item.vehicleType,
      totalScore: item.totalScore
    };
  });
};

export default function HighestPollutingVehiclesTable({
  title = "Highest Polluting Vehicles",
  rows,
  data,
  className,
  ringColorClass = "ring-sky-500",
}: HighestPollutingVehiclesTableProps) {
  // Use API data if provided, otherwise use rows prop, otherwise default
  const displayRows = data ? convertApiDataToRows(data) : (rows || DEFAULT_ROWS);
  const [isOpen, setIsOpen] = React.useState(false);
  const [selectedIndex, setSelectedIndex] = React.useState<number | null>(null);

  const selectedPolluter: HighestPolluter | null = React.useMemo(() => {
    if (selectedIndex == null) return null;
    if (data && data[selectedIndex]) return data[selectedIndex];
    // Fallback: synthesize from displayRows if API data not provided
    const r = displayRows[selectedIndex];
    if (!r) return null;
    return {
      licensePlate: r.plate,
      vehicleType: r.vehicleType || "UNKNOWN",
      totalScore: r.totalScore ?? r.rate * 1,
      // Set unknown levels to 0 when not available
      co2Level: 0,
      coLevel: 0,
      noxLevel: 0,
      pm10Level: 0,
      pm25Level: 0,
      recordCount: 0,
    } as HighestPolluter;
  }, [selectedIndex, data, displayRows]);
  return (
    <div className={className}>
      <h3 className="mb-3 text-base font-medium">{title}</h3>

      {/* Rounded, blue-outlined container */}
      <div
        className={`rounded-xl ring-2 ${ringColorClass} bg-background overflow-hidden`}
      >
        <Table>
          <TableHeader>
            <TableRow className="border-b">
              <TableHead className="pl-6 py-3 text-left font-semibold">
                Number Plate
              </TableHead>
              <TableHead className="py-3 text-center font-semibold">
                Vehicle Type
              </TableHead>
              <TableHead className="py-3 text-center font-semibold">
                Emissions
              </TableHead>
              <TableHead className="pr-6 py-3 text-right font-semibold">
                Score
              </TableHead>
              <TableHead className="pr-6 py-3 text-right font-semibold">Action</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {displayRows.map((r, i) => (
              <TableRow
                key={`${r.plate}-${i}`}
                className={i !== displayRows.length - 1 ? "border-b" : ""}
              >
                <TableCell className="pl-6 py-4">{r.plate}</TableCell>
                <TableCell className="py-4 text-center">
                  <span className="px-2 py-1 bg-gray-100 rounded text-xs">
                    {r.vehicleType}
                  </span>
                </TableCell>
                <TableCell className="py-4 text-center">
                  {r.emissions.join(", ")}
                </TableCell>
                <TableCell className="pr-6 py-4 text-right">
                  {formatRate(r.rate)}
                </TableCell>
                <TableCell className="pl-6 pr-6 text-right">
                  <button
                    type="button"
                    className="text-sm font-medium underline-offset-4 hover:underline"
                    onClick={() => {
                      setSelectedIndex(i);
                      setIsOpen(true);
                    }}
                  >
                    View details
                  </button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Vehicle Details</DialogTitle>
            <DialogDescription>
              Detailed emission metrics for the selected vehicle.
            </DialogDescription>
          </DialogHeader>
          {selectedPolluter && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs text-muted-foreground">License Plate</p>
                  <p className="font-medium">{selectedPolluter.licensePlate}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Vehicle Type</p>
                  <p className="font-medium">{selectedPolluter.vehicleType}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Records</p>
                  <p className="font-medium">{selectedPolluter.recordCount}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Total Score</p>
                  <p className="font-medium">{selectedPolluter.totalScore}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                <div className="rounded-md border p-3">
                  <p className="text-xs text-muted-foreground">CO2</p>
                  <p className="font-medium">{selectedPolluter.co2Level}</p>
                </div>
                <div className="rounded-md border p-3">
                  <p className="text-xs text-muted-foreground">CO</p>
                  <p className="font-medium">{selectedPolluter.coLevel}</p>
                </div>
                <div className="rounded-md border p-3">
                  <p className="text-xs text-muted-foreground">NOx</p>
                  <p className="font-medium">{selectedPolluter.noxLevel}</p>
                </div>
                <div className="rounded-md border p-3">
                  <p className="text-xs text-muted-foreground">PM10</p>
                  <p className="font-medium">{selectedPolluter.pm10Level}</p>
                </div>
                <div className="rounded-md border p-3">
                  <p className="text-xs text-muted-foreground">PM2.5</p>
                  <p className="font-medium">{selectedPolluter.pm25Level}</p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}