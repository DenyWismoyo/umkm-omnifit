import React from "react";
import { LucideIcon, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  title: string;
  value: string | number;
  trend?: number; // e.g. 15 for +15%, -5 for -5%
  trendLabel?: string; // e.g. "vs last month"
  icon: LucideIcon;
  accentColor?: string;
  isLoading?: boolean;
}

export function MetricCard({
  title,
  value,
  trend,
  trendLabel,
  icon: Icon,
  accentColor = "emerald",
  isLoading = false,
}: MetricCardProps) {
  const bgClasses: Record<string, string> = {
    emerald: "bg-emerald-50 text-emerald-600",
    amber: "bg-amber-50 text-amber-600",
    blue: "bg-blue-50 text-blue-600",
    rose: "bg-rose-50 text-rose-600",
    slate: "bg-slate-50 text-slate-600",
    violet: "bg-violet-50 text-violet-600",
  };

  const selectedBg = bgClasses[accentColor] || bgClasses.slate;

  const isPositive = trend && trend > 0;
  const isNegative = trend && trend < 0;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:shadow-md" data-testid="metric-card">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-sm font-semibold text-slate-500">{title}</h4>
        <div className={cn("flex h-10 w-10 items-center justify-center rounded-xl", selectedBg)}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
      
      {isLoading ? (
        <div className="space-y-2">
          <div className="h-8 w-2/3 animate-pulse rounded-md bg-slate-200" />
          <div className="h-4 w-1/2 animate-pulse rounded-md bg-slate-100" />
        </div>
      ) : (
        <div>
          <div className="text-2xl font-black text-slate-900 tracking-tight">{value}</div>
          
          {trend !== undefined && (
            <div className="mt-2 flex items-center gap-1.5 text-xs font-medium">
              <span
                className={cn(
                  "flex items-center gap-0.5 rounded-full px-1.5 py-0.5",
                  isPositive ? "bg-emerald-100 text-emerald-700" : isNegative ? "bg-rose-100 text-rose-700" : "bg-slate-100 text-slate-700"
                )}
              >
                {isPositive && <TrendingUp className="h-3 w-3" />}
                {isNegative && <TrendingDown className="h-3 w-3" />}
                {!isPositive && !isNegative && <Minus className="h-3 w-3" />}
                {Math.abs(trend)}%
              </span>
              {trendLabel && <span className="text-slate-500">{trendLabel}</span>}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
