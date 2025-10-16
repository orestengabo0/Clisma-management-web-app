import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import DetectionCard from './DetectionCard'
import { getHighestPollutingVehicles, type HighestPolluter } from '@/lib/api'

const LatestDetections = () => {
  const [items, setItems] = useState<HighestPolluter[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
      ; (async () => {
        setLoading(true)
        setError(null)
        try {
          const data = await getHighestPollutingVehicles('total', 10)
          if (!cancelled) setItems(data)
        } catch (e) {
          if (!cancelled) setError(e instanceof Error ? e.message : 'Failed to load detections')
        } finally {
          if (!cancelled) setLoading(false)
        }
      })()
    return () => { cancelled = true }
  }, [])

  const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

  return (
    <div>
      <Card className="p-4 pt-0 h-96 overflow-y-auto">
        <CardHeader className='sticky top-0 bg-white z-10'>
          <CardTitle>Latest Detections</CardTitle>
        </CardHeader>
        <CardContent>
          {loading && (
            <div className="text-sm text-muted-foreground">Loading…</div>
          )}
          {error && (
            <div className="text-sm text-red-600">{error}</div>
          )}
          {!loading && !error && items.length === 0 && (
            <div className="text-sm text-muted-foreground">No detections found.</div>
          )}
          {!loading && !error && items.map((detection, index) => (
            <div key={`${detection.licensePlate}-${index}`} className={index < items.length - 1 ? "mb-2" : ""}>
              <DetectionCard
                license={detection.licensePlate}
                co={String(detection.coPpm)}
                so={String(detection.aqi)}
                time={nowTime}
                type={detection.vehicleType}
              />
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}

export default LatestDetections