"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { IncomingOrder, OrderStatus } from "@/types";
import { formatRupiah } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ChefHat, CheckCircle2, ShoppingCart, Printer } from "lucide-react";

interface OrderCardProps {
  order: IncomingOrder;
  onUpdateStatus: (orderId: string, status: OrderStatus) => void;
  onPrintTicket: (order: IncomingOrder) => void;
}

export function OrderCard({
  order,
  onUpdateStatus,
  onPrintTicket,
}: OrderCardProps) {
  const router = useRouter();
  const isPending = order.status === "PENDING";
  const isCooking = order.status === "COOKING" || order.status === "ACCEPTED";
  const isReady = order.status === "READY";

  const elapsedMins = Math.floor(
    (Date.now() - new Date(order.createdAt).getTime()) / 60000
  );
  const isOverdue = elapsedMins >= 15 && (isPending || isCooking);
  const isWarning =
    elapsedMins >= 8 && elapsedMins < 15 && (isPending || isCooking);

  return (
    <div
      className={`rounded-2xl border p-3.5 shadow-sm space-y-2.5 text-xs transition-all ${
        isOverdue
          ? "bg-rose-50/70 border-rose-300 shadow-rose-500/10"
          : "bg-white border-slate-200"
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <span className="font-mono font-black text-[11px] bg-slate-900 text-white px-2 py-0.5 rounded-md">
            #{order.orderNumber}
          </span>
          <span className="font-black text-slate-900 text-xs">
            {order.tableNumber}
          </span>
        </div>

        <div className="flex items-center gap-1">
          {(isPending || isCooking) && (
            <span
              className={`text-[9px] font-bold px-1.5 py-0.2 rounded-md border ${
                isOverdue
                  ? "bg-rose-100 text-rose-800 border-rose-300 animate-pulse font-black"
                  : isWarning
                  ? "bg-amber-100 text-amber-900 border-amber-300"
                  : "bg-slate-100 text-slate-600 border-slate-200"
              }`}
            >
              ⏱️ {elapsedMins}m
            </span>
          )}
          {isReady && (
            <span className="text-[9px] font-bold bg-amber-100 text-amber-900 border border-amber-300 px-1.5 py-0.2 rounded-md">
              Belum Lunas
            </span>
          )}
          <span className="text-[10px] text-slate-400">
            {new Date(order.createdAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        </div>
      </div>

      <p className="text-[11px] text-slate-500 font-medium">
        Pemesan: <strong className="text-slate-800">{order.customerName}</strong>
      </p>

      {/* Item List */}
      <div className="divide-y divide-slate-100 bg-slate-50/70 rounded-xl p-2 space-y-1">
        {order.items.map((it, idx) => (
          <div key={idx} className="flex justify-between items-start pt-1 first:pt-0">
            <div>
              <span className="font-bold text-slate-800">
                {it.quantity}x {it.productName}
              </span>
              {it.notes && (
                <span className="text-[10px] text-amber-800 block italic">
                  ↳ {it.notes}
                </span>
              )}
            </div>
            <span className="font-bold text-slate-700 text-[11px]">
              {formatRupiah(it.subtotal)}
            </span>
          </div>
        ))}
      </div>

      {order.generalNotes && (
        <p className="text-[10px] text-slate-500 bg-amber-50/80 border border-amber-200 p-1.5 rounded-lg">
          <strong>Catatan:</strong> {order.generalNotes}
        </p>
      )}

      {/* Action Buttons */}
      <div className="flex items-center justify-between pt-1 border-t border-slate-100">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => onPrintTicket(order)}
          className="touch-press h-7 text-[10px] font-bold border-slate-200 gap-1 px-2"
        >
          <Printer className="h-3 w-3" />
          <span>Tiket</span>
        </Button>

        <div className="flex items-center gap-1">
          {isPending && (
            <>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => onUpdateStatus(order.id, "CANCELLED")}
                className="touch-press h-7 text-[10px] font-bold text-rose-600 hover:bg-rose-50 px-2"
              >
                Tolak
              </Button>
              <Button
                type="button"
                variant="default"
                size="sm"
                onClick={() => onUpdateStatus(order.id, "COOKING")}
                className="touch-press h-7 text-[10px] font-black bg-blue-600 hover:bg-blue-700 text-white gap-1 px-2.5 rounded-xl shadow-xs"
              >
                <ChefHat className="h-3 w-3" />
                <span>Terima & Masak</span>
              </Button>
            </>
          )}

          {isCooking && (
            <Button
              type="button"
              variant="default"
              size="sm"
              onClick={() => onUpdateStatus(order.id, "READY")}
              className="touch-press h-7 text-[10px] font-black bg-emerald-600 hover:bg-emerald-700 text-white gap-1 px-2.5 rounded-xl shadow-xs"
            >
              <CheckCircle2 className="h-3 w-3" />
              <span>Selesai Dimasak & Antar</span>
            </Button>
          )}

          {isReady && (
            <Button
              type="button"
              variant="default"
              size="sm"
              onClick={() => router.push(`/pos?loadOrder=${order.id}`)}
              className="touch-press h-7 text-[10px] font-black bg-emerald-600 hover:bg-emerald-700 text-white gap-1 px-2.5 rounded-xl shadow-xs"
            >
              <ShoppingCart className="h-3 w-3" />
              <span>Bayar di Kasir</span>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
