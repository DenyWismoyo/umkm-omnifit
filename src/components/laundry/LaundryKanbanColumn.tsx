import React from "react";
import { LaundryOrder } from "@/types";
import { LaundryOrderCard } from "./LaundryOrderCard";

interface LaundryKanbanColumnProps {
  title: string;
  count: number;
  subtitle: string;
  orders: LaundryOrder[];
  emptyMessage: string;
  onUpdateStatus: (orderId: string, status: string) => void;
  variant: "pending" | "washing" | "ironing" | "ready";
}

export function LaundryKanbanColumn({
  title,
  count,
  subtitle,
  orders,
  emptyMessage,
  onUpdateStatus,
  variant,
}: LaundryKanbanColumnProps) {
  const styles = {
    pending: {
      bg: "bg-slate-50 border-slate-200",
      dot: "bg-slate-500",
      title: "text-slate-900",
    },
    washing: {
      bg: "bg-blue-50/60 border-blue-200",
      dot: "bg-blue-500 animate-pulse",
      title: "text-blue-900",
    },
    ironing: {
      bg: "bg-amber-50/60 border-amber-200",
      dot: "bg-amber-500 animate-pulse",
      title: "text-amber-900",
    },
    ready: {
      bg: "bg-emerald-50/60 border-emerald-200",
      dot: "bg-emerald-500",
      title: "text-emerald-900",
    },
  };

  const style = styles[variant];

  return (
    <div className={`rounded-2xl border p-3 space-y-3 ${style.bg}`}>
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <div className={`h-2.5 w-2.5 rounded-full ${style.dot}`} />
          <h3 className={`font-black text-xs sm:text-sm ${style.title}`}>
            {title} ({count})
          </h3>
        </div>
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
          {subtitle}
        </span>
      </div>

      <div className="space-y-2.5">
        {orders.length === 0 ? (
          <p className="text-[11px] text-center py-8 text-slate-500/80">
            {emptyMessage}
          </p>
        ) : (
          orders.map((o) => (
            <LaundryOrderCard
              key={o.id}
              order={o}
              onUpdateStatus={onUpdateStatus}
            />
          ))
        )}
      </div>
    </div>
  );
}
