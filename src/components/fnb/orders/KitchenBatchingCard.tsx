import React from "react";
import { Flame } from "lucide-react";

export interface BatchItem {
  name: string;
  totalQty: number;
  tables: string[];
  orderCount: number;
}

interface KitchenBatchingCardProps {
  batching: BatchItem[];
}

export function KitchenBatchingCard({ batching }: KitchenBatchingCardProps) {
  if (batching.length === 0) return null;

  return (
    <div className="rounded-2xl border border-amber-300 bg-gradient-to-r from-amber-50 via-orange-50/50 to-amber-50/80 p-3.5 sm:p-4 shadow-sm animate-in fade-in space-y-2">
      <div className="flex items-center gap-2">
        <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-amber-500 text-slate-950 font-black shrink-0 shadow-xs">
          <Flame className="h-4 w-4" />
        </div>
        <div>
          <h4 className="text-xs sm:text-sm font-black text-amber-950">
            Rekomendasi Masak Dapur Cerdas (Kitchen Batching)
          </h4>
          <p className="text-[11px] text-amber-800">
            Beberapa meja memesan menu yang sama. Masak sekaligus dalam 1 batch untuk hemat waktu!
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 pt-1">
        {batching.slice(0, 3).map((b, idx) => (
          <div
            key={idx}
            className="bg-white/90 border border-amber-200/90 rounded-xl p-2.5 flex items-center justify-between text-xs shadow-2xs"
          >
            <div className="min-w-0">
              <span className="font-extrabold text-slate-900 block truncate">
                {b.name}
              </span>
              <span className="text-[10px] text-amber-900 font-medium">
                📍 {b.tables.join(", ")}
              </span>
            </div>
            <span className="font-black text-sm text-amber-900 bg-amber-100 border border-amber-300 px-2 py-0.5 rounded-lg shrink-0">
              {b.totalQty} Porsi
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
