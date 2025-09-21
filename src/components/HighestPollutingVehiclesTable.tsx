import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type Row = {
  plate: string;
  emissions: string[]; // e.g., ["CO", "PM"]
  rate: number;        // as percent value, e.g., 23 -> 23%
};

interface HighestPollutingVehiclesTableProps {
  title?: string;
  rows?: Row[];
  className?: string;
  ringColorClass?: string; // customize outline color if you want
}

const DEFAULT_ROWS: Row[] = [
  { plate: "RCA123L", emissions: ["CO", "PM"], rate: 23 },
  { plate: "RCA123L", emissions: ["CO", "PM"], rate: 13 },
  { plate: "RCA123L", emissions: ["CO", "PM"], rate: 8 },
  { plate: "RCA123L", emissions: ["CO", "PM"], rate: 7 },
  { plate: "RCA123L", emissions: ["CO", "PM"], rate: 3 },
];

const formatRate = (n: number) => `${Number.isInteger(n) ? n : n.toFixed(1)}%`;

export default function HighestPollutingVehiclesTable({
  title = "Highest Polluting Vehicles",
  rows = DEFAULT_ROWS,
  className,
  ringColorClass = "ring-sky-500",
}: HighestPollutingVehiclesTableProps) {
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
                Emissions
              </TableHead>
              <TableHead className="pr-6 py-3 text-right font-semibold">
                Rate
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {rows.map((r, i) => (
              <TableRow
                key={`${r.plate}-${i}`}
                className={i !== rows.length - 1 ? "border-b" : ""}
              >
                <TableCell className="pl-6 py-4">{r.plate}</TableCell>
                <TableCell className="py-4 text-center">
                  {r.emissions.join(",")}
                </TableCell>
                <TableCell className="pr-6 py-4 text-right">
                  {formatRate(r.rate)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}