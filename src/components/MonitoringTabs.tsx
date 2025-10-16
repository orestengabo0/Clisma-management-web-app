// src/components/MonitoringTabs.tsx
import React, { useEffect, useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import CameraStream from './CameraStream'
import VehicleDetectionCard from './VehicleDetectionCard'
import LoadingPlaceholder from './ui/loading-placeholder'
import { getSensorsData, type SensorsData } from '@/lib/api'
import { useAuthStore } from '@/lib/authStore'

type Props = { className?: string }

const MonitoringTabs = ({ className }: Props) => {
  const token = useAuthStore((s) => s.token)
  const [sensorsData, setSensorsData] = useState<SensorsData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!token) return
    let cancelled = false

    const fetchSensorsData = async () => {
      setLoading(true)
      setError(null)
      try {
        const data = await getSensorsData()
        if (!cancelled) setSensorsData(data)
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : 'Failed to load sensors data')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    fetchSensorsData()

    // Poll every 5 seconds for real-time updates
    const interval = setInterval(fetchSensorsData, 5000)

    return () => {
      cancelled = true
      clearInterval(interval)
    }
  }, [token])

  const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

  return (
    <div className={`h-full ${className ?? ''}`}>
      <Tabs defaultValue="Live Chart" className="flex h-full flex-col">
        <TabsList className="bg-[#113B38] text-white rounded-t-lg w-full">
          <TabsTrigger value="Live Chart" className="w-1/2">Live Chart</TabsTrigger>
          <TabsTrigger value="Detected Vehicles" className="w-1/2">Detected Vehicles</TabsTrigger>
        </TabsList>

        <TabsContent value="Live Chart" className="flex-1">
          <Card className="h-full flex flex-col overflow-hidden">
            <CardContent className="flex-1 p-0 overflow-hidden">
              <div className="h-full w-full p-2">
                {/* <CameraStream /> */}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="Detected Vehicles" className="flex-1">
          <Card className="h-full flex flex-col">
            <CardHeader className="pb-2 flex-shrink-0">
              <CardTitle className="text-lg">Detected Vehicles</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 overflow-auto">
              {loading ? (
                <LoadingPlaceholder kind="list" lines={3} />
              ) : error ? (
                <div className="text-sm text-red-600">{error}</div>
              ) : sensorsData?.sensors.ultrasonic.vehicle_detected ? (
                <div className="space-y-2">
                  <VehicleDetectionCard
                    license="DEF456"
                    aqi={sensorsData.sensors.mq.data.AQI.toFixed(1)}
                    coPpm={sensorsData.sensors.mq.data.CO_PPM.toFixed(1)}
                    mq135={sensorsData.sensors.mq.data.MQ135.toFixed(0)}
                    mq7={sensorsData.sensors.mq.data.MQ7.toFixed(0)}
                    time={nowTime}
                    type="Car"
                  />
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                  <div className="text-center p-8">
                    <div className="text-6xl mb-4">🚗</div>
                    <div className="text-xl font-semibold text-gray-600 mb-2">No Vehicle Detected</div>
                    <div className="text-gray-500 mb-4">Waiting for vehicle detection...</div>
                    <div className="text-sm text-gray-400">
                      {sensorsData?.vehicle_detection.message || 'System is monitoring for vehicles'}
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default MonitoringTabs