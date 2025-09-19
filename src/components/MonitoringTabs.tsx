// src/components/MonitoringTabs.tsx
import React from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'

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
          <Card className="h-full flex flex-col">
            <CardHeader className="pb-2">
              <CardTitle>Camera Feed</CardTitle>
            </CardHeader>
            <CardContent className="flex-1">
              <div className="flex items-center justify-center h-full bg-gray-100 rounded-lg text-gray-400">
                [Camera Feed Placeholder]
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="Detected Vehicles" className="flex-1">
          <Card className="h-full flex flex-col">
            <CardHeader className="pb-2">
              <CardTitle>Detected Vehicles</CardTitle>
            </CardHeader>
            <CardContent className="flex-1">
              <div className="flex items-center justify-center h-full bg-gray-100 rounded-lg text-gray-400">
                [Detected Vehicles Placeholder]
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default MonitoringTabs