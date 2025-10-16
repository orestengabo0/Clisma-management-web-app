import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

type Kind = "chart" | "list" | "table";

type Props = {
    kind?: Kind;
    className?: string;
    lines?: number; // for list/table
    heightClass?: string; // for chart height (e.g., h-64)
};

export default function LoadingPlaceholder({ kind = "chart", className, lines = 3, heightClass = "h-64" }: Props) {
    if (kind === "chart") {
        return (
            <div className={`space-y-3 ${className ?? ""}`}>
                <Skeleton className={`${heightClass} w-full`} />
                <div className="flex gap-3">
                    <Skeleton className="h-6 w-24" />
                    <Skeleton className="h-6 w-24" />
                    <Skeleton className="h-6 w-24" />
                    <Skeleton className="h-6 w-24" />
                </div>
            </div>
        );
    }

    if (kind === "list") {
        return (
            <div className={`space-y-2 ${className ?? ""}`}>
                {Array.from({ length: lines }).map((_, i) => (
                    <Skeleton key={i} className="h-10 w-full" />
                ))}
            </div>
        );
    }

    // table
    return (
        <div className={`space-y-2 ${className ?? ""}`}>
            <Skeleton className="h-10 w-full" />
            {Array.from({ length: lines }).map((_, i) => (
                <Skeleton key={i} className="h-10 w-full" />
            ))}
        </div>
    );
}


