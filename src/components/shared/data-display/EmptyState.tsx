import React from "react";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: React.ReactNode;
  accentColor?: string;
  className?: string;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  accentColor = "emerald",
  className,
}: EmptyStateProps) {
  // Mapping tailwind colors dynamically for the icon background
  const bgClasses: Record<string, string> = {
    emerald: "bg-emerald-50 text-emerald-600",
    amber: "bg-amber-50 text-amber-600",
    blue: "bg-blue-50 text-blue-600",
    rose: "bg-rose-50 text-rose-600",
    slate: "bg-slate-50 text-slate-600",
    violet: "bg-violet-50 text-violet-600",
  };

  const selectedBg = bgClasses[accentColor] || bgClasses.slate;

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50/50 px-6 py-12 text-center w-full min-h-[300px]",
        className
      )}
      data-testid="empty-state"
    >
      <div className={cn("mb-4 flex h-16 w-16 items-center justify-center rounded-2xl shadow-sm", selectedBg)}>
        <Icon className="h-8 w-8" />
      </div>
      <h3 className="mb-2 text-lg font-bold text-slate-900">{title}</h3>
      <p className="mb-6 max-w-sm text-sm text-slate-500 leading-relaxed">
        {description}
      </p>
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}
