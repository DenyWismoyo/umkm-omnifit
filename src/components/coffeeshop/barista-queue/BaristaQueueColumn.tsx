import React from "react";
import { BaristaOrder, OrderStatus } from "@/types";
import { BaristaOrderCard } from "./BaristaOrderCard";

interface BaristaQueueColumnProps {
  title: string;
  count: number;
  subtitle: string;
  orders: BaristaOrder[];
  emptyMessage: string;
  onUpdateStatus: (orderId: string, status: OrderStatus) => void;
  onPrintTicket: (order: BaristaOrder) => void;
  variant: "pending" | "making" | "ready";
}

export function BaristaQueueColumn({
  title,
  count,
  subtitle,
  orders,
  emptyMessage,
  onUpdateStatus,
  onPrintTicket,
  variant,
}: BaristaQueueColumnProps) {
  const styles = {
    pending: {
      bg: "bg-orange-50/60 border-orange-200",
      dot: "bg-orange-500 animate-pulse",
      title: "text-orange-950",
      subtitle: "text-orange-700",
      empty: "text-orange-700/60",
    },
    making: {
      bg: "bg-[#F3EFE9] border-[#D9CFC4]", // Coffee light theme
      dot: "bg-[#8B5E3C] animate-pulse",
      title: "text-[#3C2A21]",
      subtitle: "text-[#6B4F3A]",
      empty: "text-[#8B5E3C]/60",
    },
    ready: {
      bg: "bg-emerald-50/60 border-emerald-200",
      dot: "bg-emerald-500",
      title: "text-emerald-950",
      subtitle: "text-emerald-700",
      empty: "text-emerald-700/60",
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
        <span className={`text-[10px] font-bold uppercase tracking-wider ${style.subtitle}`}>
          {subtitle}
        </span>
      </div>

      <div className="space-y-2.5">
        {orders.length === 0 ? (
          <p className={`text-[11px] text-center py-8 ${style.empty}`}>
            {emptyMessage}
          </p>
        ) : (
          orders.map((o) => (
            <BaristaOrderCard
              key={o.id}
              order={o}
              onUpdateStatus={onUpdateStatus}
              onPrintTicket={onPrintTicket}
            />
          ))
        )}
      </div>
    </div>
  );
}
