"use client";

import React from "react";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  iconBgColor?: string;
  iconColor?: string;
  valueColor?: string;
  badge?: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

export function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  iconBgColor = "bg-emerald-100",
  iconColor = "text-emerald-700",
  valueColor = "text-slate-900",
  badge,
  onClick,
  className,
}: StatCardProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "stat-card touch-press hover-lift select-none",
        onClick && "cursor-pointer",
        className
      )}
    >
      <div className="flex items-center justify-between gap-2 mb-1.5">
        <span className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider truncate">
          {title}
        </span>
        <div
          className={cn(
            "flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-xl shrink-0",
            iconBgColor,
            iconColor
          )}
        >
          <Icon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
        </div>
      </div>

      <div>
        <div className={cn("text-base sm:text-xl font-black leading-tight", valueColor)}>
          {value}
        </div>
        {(subtitle || badge) && (
          <div className="flex items-center justify-between gap-1 mt-1 text-[10px] sm:text-xs text-slate-500">
            {subtitle && <span className="truncate">{subtitle}</span>}
            {badge && <div className="shrink-0">{badge}</div>}
          </div>
        )}
      </div>
    </div>
  );
}
