import React from 'react';
import { Card, CardContent } from './ui/card';
import { FaRegCircleCheck } from "react-icons/fa6";

interface DetectionCardProps {
    license: string;
    co: string;
    so: string;
    time: string;
    type: string;
}

const DetectionCard = ({ license, co, so, time, type }: DetectionCardProps) => {
    return (
        <Card className="overflow-hidden">
            {/* 
              Reduce padding on CardContent (default is often p-6) 
              to make it compact like the image.
            */}
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
                            <div className="flex items-center gap-6 mt-1 text-sm text-muted-foreground">
                                <span>CO :{co}</span>
                                <span>SO :{so}</span>
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
}

export default DetectionCard;