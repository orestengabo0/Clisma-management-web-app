import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import DetectionCard from './DetectionCard'

const detectionData = [
    { licence: "RAE057UZ", CO: '50', SO: '30', time: '10:00 AM', Type: 'Car' },
    { licence: "RAE057UZ", CO: '50', SO: '30', time: '10:00 AM', Type: 'Car' },
    { licence: "RAE057UZ", CO: '50', SO: '30', time: '10:00 AM', Type: 'Car' },
    { licence: "RAE057UZ", CO: '50', SO: '30', time: '10:00 AM', Type: 'Car' },
    { licence: "RAE057UZ", CO: '50', SO: '30', time: '10:00 AM', Type: 'Car' },
    { licence: "RAE057UZ", CO: '50', SO: '30', time: '10:00 AM', Type: 'Car' },
    { licence: "RAE057UZ", CO: '50', SO: '30', time: '10:00 AM', Type: 'Car' },
]

const LatestDetections = () => {
  return (
    <div>
        <Card className="p-4 pt-0 h-96 overflow-y-auto">
          <CardHeader className='sticky top-0 bg-white z-10'>
            <CardTitle>Latest Detections</CardTitle>
          </CardHeader>
          <CardContent>
            {
                detectionData.map((detection, index) => (
                    <div key={index} className={index < detectionData.length - 1 ? "mb-2" : ""}>
                        <DetectionCard
                            license={detection.licence}
                            co={detection.CO}
                            so={detection.SO}
                            time={detection.time}
                            type={detection.Type}
                        />
                    </div>
                ))
            }
          </CardContent>
        </Card>
    </div>
  )
}

export default LatestDetections