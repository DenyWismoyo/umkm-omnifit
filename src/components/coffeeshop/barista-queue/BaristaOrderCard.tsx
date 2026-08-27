"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { BaristaOrder, OrderStatus } from "@/types";
import { Button } from "@/components/ui/button";
import { Coffee, CheckCircle2, ShoppingCart, Printer } from "lucide-react";
import { LevelBadge } from "./LevelBadge";

interface BaristaOrderCardProps {
  order: BaristaOrder;
  onUpdateStatus: (orderId: string, status: OrderStatus) => void;
  onPrintTicket: (order: BaristaOrder) => void;
}

export function BaristaOrderCard({
  order,
  onUpdateStatus,
  onPrintTicket,
}: BaristaOrderCardProps) {
  const router = useRouter();
  const isPending = order.status === "PENDING";
  const isMaking = order.status === "COOKING" || order.status === "ACCEPTED";
  const isReady = order.status === "READY";

  const elapsedMins = Math.floor(
    (Date.now() - new Date(order.createdAt).getTime()) / 60000
  );
  const isOverdue = elapsedMins >= 10 && (isPending || isMaking);
  const isWarning =
    elapsedMins >= 5 && elapsedMins < 10 && (isPending || isMaking);

  return (
    <div
      className={`rounded-2xl border p-3 shadow-sm space-y-2.5 text-xs transition-all ${
        isOverdue
          ? "bg-rose-50 border-rose-300 shadow-rose-500/10"
          : "bg-white border-slate-200"
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <span className="font-mono font-black text-[11px] bg-[#3C2A21] text-white px-2 py-0.5 rounded-md">
            #{order.orderNumber}
          </span>
          <span className="font-black text-[#3C2A21] text-xs">
            {order.tableNumber}
          </span>
        </div>

        <div className="flex items-center gap-1">
          {(isPending || isMaking) && (
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
        </div>
      </div>

      <p className="text-[11px] text-slate-500 font-medium">
        Pelanggan: <strong className="text-slate-800">{order.customerName}</strong>
      </p>

      {/* Item List with Ice/Sugar levels */}
      <div className="divide-y divide-slate-100 bg-[#F9F5F0] rounded-xl p-2 space-y-1.5">
        {order.items.map((it, idx) => (
          <div key={idx} className="pt-1.5 first:pt-0">
            <div className="flex justify-between items-start">
              <span className="font-bold text-[#3C2A21]">
                {it.quantity}x {it.productName}
              </span>
              {it.cupSize && (
                <span className="text-[9px] font-black uppercase tracking-widest text-[#8B5E3C] bg-[#EAE0D5] px-1 rounded">
                  {it.cupSize}
                </span>
              )}
            </div>
            
            <div className="flex gap-1 flex-wrap">
              <LevelBadge type="ice" level={it.iceLevel} />
              <LevelBadge type="sugar" level={it.sugarLevel} />
            </div>

            {it.notes && (
              <span className="text-[10px] text-amber-800 block italic mt-0.5">
                ↳ {it.notes}
              </span>
            )}
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
                className="touch-press h-7 text-[10px] font-black bg-[#8B5E3C] hover:bg-[#6e482b] text-white gap-1 px-2.5 rounded-xl shadow-xs"
              >
                <Coffee className="h-3 w-3" />
                <span>Buat Kopi</span>
              </Button>
            </>
          )}

          {isMaking && (
            <Button
              type="button"
              variant="default"
              size="sm"
              onClick={() => onUpdateStatus(order.id, "READY")}
              className="touch-press h-7 text-[10px] font-black bg-emerald-600 hover:bg-emerald-700 text-white gap-1 px-2.5 rounded-xl shadow-xs"
            >
              <CheckCircle2 className="h-3 w-3" />
              <span>Selesai & Panggil</span>
            </Button>
          )}

          {isReady && (
            <Button
              type="button"
              variant="default"
              size="sm"
              onClick={() => router.push(`/pos?loadOrder=${order.id}`)}
              className="touch-press h-7 text-[10px] font-black bg-slate-900 hover:bg-slate-800 text-white gap-1 px-2.5 rounded-xl shadow-xs"
            >
              <ShoppingCart className="h-3 w-3" />
              <span>Bayar</span>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
