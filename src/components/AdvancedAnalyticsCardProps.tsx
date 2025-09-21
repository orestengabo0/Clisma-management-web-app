import { Card, CardContent } from "@/components/ui/card";
import type { ReactNode } from "react";

type AdvancedAnalyticsCardProps = {
  icon: ReactNode;
  title: string;
  description: string;
  href?: string;
  onClick?: () => void;
  className?: string;
};

export function AdvancedAnalyticsCard({
  icon,
  title,
  description,
  href = "#",
  onClick,
  className,
}: AdvancedAnalyticsCardProps) {
  return (
    <Card className={`rounded-2xl border shadow-sm hover:shadow-md transition ${className ?? ""}`}>
      <CardContent className="p-5 h-full">
        <div className="flex h-full flex-col">
          {/* Top: icon + text */}
          <div className="grid grid-cols-[3rem_1fr] gap-4 items-start">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl ring-1 ring-emerald-200/70 bg-emerald-50 text-emerald-900">
              {icon}
            </div>
            <div>
              <h3 className="text-lg font-semibold leading-tight">{title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {description}
              </p>
            </div>
          </div>

          {/* Bottom: view more */}
          <div className="mt-auto pt-4 flex justify-end">
            <a
              href={href}
              onClick={onClick}
              className="text-sm font-medium underline-offset-4 hover:underline"
            >
              view more
            </a>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}