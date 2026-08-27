import React from "react";
import { PurchaseOrder } from "@/types";
import { formatRupiah } from "@/lib/utils";
import { Package, Truck, CheckCircle2, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

interface POCardProps {
  po: PurchaseOrder;
  onReceive: (po: PurchaseOrder) => void;
}

export function POCard({ po, onReceive }: POCardProps) {
  const isDraft = po.status === "draft";
  const isOrdered = po.status === "ordered";
  const isReceived = po.status === "received";

  return (
    <div className={`rounded-2xl border p-4 space-y-3 ${
      isReceived ? "bg-emerald-50/40 border-emerald-200" :
      "bg-white border-slate-200 shadow-sm"
    }`}>
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-2">
          <div className="h-10 w-10 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center">
            <Truck className="h-5 w-5" />
          </div>
          <div>
            <h4 className="font-bold text-slate-800 text-sm">{po.supplierName}</h4>
            <p className="text-[10px] text-slate-500 font-mono">{po.poNumber}</p>
          </div>
        </div>
        <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded ${
          isDraft ? "bg-slate-100 text-slate-600" :
          isOrdered ? "bg-amber-100 text-amber-800 animate-pulse" :
          "bg-emerald-100 text-emerald-800"
        }`}>
          {po.status}
        </span>
      </div>

      <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 space-y-1.5 text-xs">
        {po.items.slice(0, 2).map((item, idx) => (
          <div key={idx} className="flex justify-between items-center">
            <span className="text-slate-700 truncate max-w-[150px]">{item.qty}x {item.productName}</span>
            <span className="font-medium text-slate-500">{formatRupiah(item.totalCost)}</span>
          </div>
        ))}
        {po.items.length > 2 && (
          <div className="text-[10px] text-slate-400 italic">
            + {po.items.length - 2} item lainnya...
          </div>
        )}
      </div>

      <div className="flex justify-between items-center text-sm pt-1">
        <span className="text-slate-500 font-medium text-xs">Total Pembelian</span>
        <span className="font-black text-slate-800">
          {formatRupiah(po.totalCost)}
        </span>
      </div>

      {isOrdered && (
        <div className="pt-2 flex gap-2">
           <Button onClick={() => onReceive(po)} className="flex-1 h-8 text-[10px] bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl">
             <CheckCircle2 className="w-3 h-3 mr-1" /> Terima & Update Stok
           </Button>
        </div>
      )}
    </div>
  );
}
