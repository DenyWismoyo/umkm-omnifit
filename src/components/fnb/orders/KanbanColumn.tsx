import React from "react";
import { IncomingOrder, OrderStatus } from "@/types";
import { OrderCard } from "./OrderCard";

interface KanbanColumnProps {
  title: string;
  count: number;
  subtitle: string;
  orders: IncomingOrder[];
  emptyMessage: string;
  onUpdateStatus: (orderId: string, status: OrderStatus) => void;
  onPrintTicket: (order: IncomingOrder) => void;
  variant: "pending" | "cooking" | "ready";
}

export function KanbanColumn({
  title,
  count,
  subtitle,
  orders,
  emptyMessage,
  onUpdateStatus,
  onPrintTicket,
  variant,
}: KanbanColumnProps) {
  const styles = {
    pending: {
      bg: "bg-amber-50/60 border-amber-200",
      dot: "bg-amber-500 animate-pulse",
      title: "text-amber-950",
      subtitle: "text-amber-700",
      empty: "text-amber-700/60",
    },
    cooking: {
      bg: "bg-blue-50/60 border-blue-200",
      dot: "bg-blue-500 animate-pulse",
      title: "text-blue-950",
      subtitle: "text-blue-700",
      empty: "text-blue-700/60",
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
            <OrderCard
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
