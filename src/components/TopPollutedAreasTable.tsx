// src/components/TopPollutedAreasTable.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type Row = { location: string; percentage: string };

interface TopPollutedAreasTableProps {
  rows?: Row[];
  title?: string;
  className?: string;
}

const DEFAULT_ROWS: Row[] = [
  { location: "Shyorongi",  percentage: "75%" },
  { location: "Nyabugogo",  percentage: "61%" },
  { location: "Kinamba",    percentage: "11%" },
  { location: "DownTown",   percentage: "0.9%" },
  { location: "Rompuwe",    percentage: "0.5%" },
];

export default function TopPollutedAreasTable({
  rows = DEFAULT_ROWS,
  title = "Top Polluted Areas",
  className,
}: TopPollutedAreasTableProps) {
  return (
    <Card className={`rounded-2xl p-3 ${className ?? ""}`}>
      <CardHeader className="pb-3 border-b">
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>

      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow className="border-b">
              <TableHead className="w-[70%] text-foreground font-semibold">
                Location
              </TableHead>
              <TableHead className="text-right text-foreground font-semibold">
                Percentage
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {rows.map((r, i) => (
              <TableRow
                key={r.location}
                className={i !== rows.length - 1 ? "border-b" : ""}
              >
                <TableCell className="py-4">{r.location}</TableCell>
                <TableCell className="py-4 text-right">{r.percentage}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}