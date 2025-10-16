import React from 'react';
import { Card, CardContent } from './ui/card';
import { FaRegCircleCheck } from "react-icons/fa6";

interface VehicleDetectionCardProps {
    license: string;
    aqi: string;
    coPpm: string;
    mq135: string;
    mq7: string;
    time: string;
    type: string;
}

const VehicleDetectionCard = ({ license, aqi, coPpm, mq135, mq7, time, type }: VehicleDetectionCardProps) => {
    return (
        <Card className="overflow-hidden">
            <CardContent className="p-3">
                {/* Main Flex Container: Aligns left and right sections */}
                <div className="flex items-center justify-between">
                    {/* --- Left Section: Icon and Main Details --- */}
                    <div className="flex items-center gap-3 flex-1">
                        {/* Icon */}
                        <FaRegCircleCheck
                            className="w-6 h-6 text-emerald-500 flex-shrink-0"
                        />

                        {/* Licence and Gases */}
                        <div>
                            {/* Licence (Bigger font) */}
                            <p className="text-base md:text-lg font-medium leading-none">
                                Licence : {license}
                            </p>

                            {/* Gases (Smaller font, gray, inline) */}
                            <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                                <span>AQI: {aqi}</span>
                                <span>CO: {coPpm}</span>
                                <span>MQ135: {mq135}</span>
                                <span>MQ7: {mq7}</span>
                            </div>
                        </div>
                    </div>

                    {/* --- Right Section: Type and Time --- */}
                    <div className="text-right text-sm text-muted-foreground">
                        <p>Type: {type}</p>
                        <p>{time}</p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default VehicleDetectionCard;
