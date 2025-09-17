import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'

const LiveCamera = () => {
  return (
    <div>
        <Card className="p-4 h-96">
          <CardHeader>
            <CardTitle>Live Camera Feeds</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center h-full bg-gray-100 rounded-lg text-gray-400">
              [Placeholder for Live Camera Feed]
            </div>
          </CardContent>
        </Card>
    </div>
  )
}

export default LiveCamera