import React from 'react'
import { Card, CardHeader, CardTitle } from './ui/card'

const HotspotsHeatMap = () => {
    return (
        <div className=''>
            <Card className='h-full p-4'>
                <CardHeader>
                    <CardTitle>Geographic HotSpot & Unit Activity</CardTitle>
                </CardHeader>
                <div className="flex items-center justify-center bg-gray-100 rounded-lg text-gray-400">
                    [Map Placeholder]
                </div>
            </Card>
        </div>
    )
}

export default HotspotsHeatMap