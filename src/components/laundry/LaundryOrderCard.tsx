"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { LaundryOrder } from "@/types";
import { Button } from "@/components/ui/button";
import { formatRupiah } from "@/lib/utils";
import { Shirt, CheckCircle2, ShoppingCart } from "lucide-react";

interface LaundryOrderCardProps {
  order: LaundryOrder;
  onUpdateStatus: (orderId: string, status: string) => void;
}

export function LaundryOrderCard({ order, onUpdateStatus }: LaundryOrderCardProps) {
  const router = useRouter();
  
  const isPending = order.status === "pending";
  const isWashing = order.status === "washing";
  const isIroning = order.status === "ironing";
  const isReady = order.status === "ready";

  return (
    <div className="rounded-2xl border p-3 shadow-sm space-y-2.5 text-xs bg-white border-slate-200">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <span className="font-mono font-black text-[11px] bg-indigo-900 text-white px-2 py-0.5 rounded-md">
            #{order.orderNumber}
          </span>
          <span className="text-[10px] uppercase font-bold text-indigo-700 bg-indigo-100 px-1.5 rounded">
            {order.serviceType}
          </span>
        </div>
        <span className="text-[10px] text-slate-400">
          {new Date(order.createdAt).toLocaleDateString()}
        </span>
      </div>

      <div>
        <p className="text-[11px] font-bold text-slate-800">{order.customerName}</p>
        <p className="text-[10px] text-slate-500">{order.customerPhone || "-"}</p>
      </div>

      <div className="flex justify-between items-center bg-indigo-50 p-2 rounded-xl border border-indigo-100">
        <div>
          <span className="text-[10px] text-indigo-900 block">Total Beban</span>
          <span className="font-black text-indigo-700">
            {order.serviceType === "kiloan" ? `${order.weightKg} Kg` : `${order.totalItems} Pcs`}
          </span>
        </div>
        <div className="text-right">
          <span className="text-[10px] text-indigo-900 block">Tagihan</span>
          <span className="font-black text-slate-800">{formatRupiah(order.totalAmount)}</span>
        </div>
      </div>

      {order.notes && (
        <p className="text-[10px] text-slate-500 bg-amber-50 border border-amber-200 p-1.5 rounded-lg italic">
          "{order.notes}"
        </p>
      )}

      {/* Action Buttons */}
      <div className="flex items-center justify-end pt-1 border-t border-slate-100 gap-2">
        {isPending && (
          <Button
            type="button"
            size="sm"
            onClick={() => onUpdateStatus(order.id, "washing")}
            className="h-7 text-[10px] font-black bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-xs"
          >
            Mulai Cuci
          </Button>
        )}
        {isWashing && (
          <Button
            type="button"
            size="sm"
            onClick={() => onUpdateStatus(order.id, "ironing")}
            className="h-7 text-[10px] font-black bg-amber-600 hover:bg-amber-700 text-white rounded-xl shadow-xs"
          >
            <Shirt className="h-3 w-3 mr-1" /> Setrika
          </Button>
        )}
        {isIroning && (
          <Button
            type="button"
            size="sm"
            onClick={() => onUpdateStatus(order.id, "ready")}
            className="h-7 text-[10px] font-black bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-xs"
          >
            <CheckCircle2 className="h-3 w-3 mr-1" /> Selesai & Packing
          </Button>
        )}
        {isReady && (
          <Button
            type="button"
            size="sm"
            onClick={() => router.push(`/pos?loadLaundry=${order.id}`)}
            className="h-7 text-[10px] font-black bg-slate-900 hover:bg-slate-800 text-white rounded-xl shadow-xs"
          >
            <ShoppingCart className="h-3 w-3 mr-1" /> Bayar / Ambil
          </Button>
        )}
      </div>
    </div>
  );
}
