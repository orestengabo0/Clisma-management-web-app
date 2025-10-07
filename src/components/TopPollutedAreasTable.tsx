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
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import { Hotspot } from "@/lib/api";
import { useState } from "react";
import AreaDetailsModal from "./AreaDetailsModal";

interface TopPollutedAreasTableProps {
  hotspots?: Hotspot[];
  title?: string;
  className?: string;
}

export default function TopPollutedAreasTable({
  hotspots = [],
  title = "Top Polluted Areas",
  className,
}: TopPollutedAreasTableProps) {
  const [selectedHotspot, setSelectedHotspot] = useState<Hotspot | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleViewDetails = (hotspot: Hotspot) => {
    setSelectedHotspot(hotspot);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedHotspot(null);
  };

  return (
    <>
      <Card className={`rounded-2xl p-3 ${className ?? ""}`}>
        <CardHeader className="pb-3 border-b">
          <CardTitle className="text-lg">{title}</CardTitle>
        </CardHeader>

        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-b">
                <TableHead className="w-[50%] text-foreground font-semibold">
                  Location
                </TableHead>
                <TableHead className="text-center text-foreground font-semibold">
                  Pollution Level
                </TableHead>
                <TableHead className="text-center text-foreground font-semibold">
                  Action
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {hotspots.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} className="py-8 text-center text-muted-foreground">
                    No data available
                  </TableCell>
                </TableRow>
              ) : (
                hotspots.map((hotspot, i) => (
                  <TableRow
                    key={hotspot.id}
                    className={i !== hotspots.length - 1 ? "border-b" : ""}
                  >
                    <TableCell className="py-4">
                      <div>
                        <div className="font-medium">{hotspot.location.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {hotspot.location.description}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="py-4 text-center">
                      <span className="font-medium">{hotspot.pollutionLevel}</span>
                    </TableCell>
                    <TableCell className="py-4 text-center">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewDetails(hotspot)}
                        className="flex items-center gap-1"
                      >
                        <Eye className="h-4 w-4" />
                        View Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <AreaDetailsModal
        hotspot={selectedHotspot}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </>
  );
}