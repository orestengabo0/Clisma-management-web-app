import React from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
// import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Calendar, Gauge } from "lucide-react";
import { Hotspot } from "@/lib/api";

interface AreaDetailsModalProps {
    hotspot: Hotspot | null;
    isOpen: boolean;
    onClose: () => void;
}

export default function AreaDetailsModal({ hotspot, isOpen, onClose }: AreaDetailsModalProps) {
    if (!hotspot) return null;

    const getPollutionLevelColor = (level: number) => {
        if (level >= 80) return "bg-red-500";
        if (level >= 60) return "bg-orange-500";
        if (level >= 40) return "bg-yellow-500";
        return "bg-green-500";
    };

    const getPollutionLevelText = (level: number) => {
        if (level >= 80) return "Very High";
        if (level >= 60) return "High";
        if (level >= 40) return "Medium";
        return "Low";
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <MapPin className="h-5 w-5" />
                        {hotspot.location.name}
                    </DialogTitle>
                    <DialogDescription>
                        {hotspot.location.description}
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6">
                    {/* Pollution Level Card */}
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <Gauge className="h-5 w-5" />
                                Pollution Level
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center gap-4">
                                <div className="text-3xl font-bold">{hotspot.pollutionLevel}</div>
                                <span
                                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold text-white ${getPollutionLevelColor(hotspot.pollutionLevel)}`}
                                >
                                    {getPollutionLevelText(hotspot.pollutionLevel)}
                                </span>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Location Details */}
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-lg">Location Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">Latitude</label>
                                    <p className="text-sm">{hotspot.location.latitude}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">Longitude</label>
                                    <p className="text-sm">{hotspot.location.longitude}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Timestamps */}
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <Calendar className="h-5 w-5" />
                                Timestamps
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div>
                                <label className="text-sm font-medium text-muted-foreground">Created</label>
                                <p className="text-sm">
                                    {new Date(hotspot.location.dateCreated).toLocaleString()}
                                </p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-muted-foreground">Last Updated</label>
                                <p className="text-sm">
                                    {new Date(hotspot.location.lastUpdated).toLocaleString()}
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </DialogContent>
        </Dialog>
    );
}
