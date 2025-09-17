// src/components/AnalyticsCard.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import React from "react";

interface AnalyticsCardProps {
  title: string;
  value: string;
  description: string;
  icon: React.ReactNode;
}

export function AnalyticsCard({ title, value, description, icon }: AnalyticsCardProps) {
  return (
    <Card className="relative overflow-hidden pl-4">
      {/* Right-centered icon with circular white–gray background */}
      <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2">
        <div className="flex h-16 w-16 items-center justify-center rounded-full
                        bg-gradient-to-br from-white to-gray-100
                        dark:from-gray-800 dark:to-gray-700
                        ring-1 ring-gray-200/80 dark:ring-white/10
                        shadow-sm">
          <span className="text-gray-700 dark:text-gray-100">
            {icon}
          </span>
        </div>
      </div>

      {/* Extra right padding so text doesn’t overlap the icon */}
      <CardHeader className="p-4 pr-24 pb-2">
        <CardTitle className="text-lg font-medium">{title}</CardTitle>
      </CardHeader>

      <CardContent className="p-4 pt-0 pr-24">
        <div className="text-3xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}