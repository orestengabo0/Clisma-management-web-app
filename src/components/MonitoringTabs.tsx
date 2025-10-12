// src/components/MonitoringTabs.tsx
import React from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import CameraStream from './CameraStream'

type Props = { className?: string }

const MonitoringTabs = ({ className }: Props) => {
  return (
    <div className={`h-full ${className ?? ''}`}>
      <Tabs defaultValue="Camera Feed" className="flex h-full flex-col">
        <TabsList className="bg-[#113B38] text-white rounded-t-lg w-full">
          <TabsTrigger value="Camera Feed" className="w-1/2">Camera Feed</TabsTrigger>
          <TabsTrigger value="Detected Vehicles" className="w-1/2">Detected Vehicles</TabsTrigger>
        </TabsList>

        <TabsContent value="Camera Feed" className="flex-1">
          <Card className="h-full flex flex-col overflow-hidden">
            <CardContent className="flex-1 p-0 overflow-hidden">
              <div className="h-full w-full p-2">
                <CameraStream />
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
              <div className="flex flex-col items-center justify-center h-full bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                <div className="text-center p-8">
                  <div className="text-6xl mb-4">🚗</div>
                  <div className="text-xl font-semibold text-gray-600 mb-2">Vehicle Detection System</div>
                  <div className="text-gray-500 mb-4">Real-time vehicle detection and analysis</div>
                  <div className="text-sm text-gray-400">
                    This feature will display detected vehicles with emission data
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default MonitoringTabs