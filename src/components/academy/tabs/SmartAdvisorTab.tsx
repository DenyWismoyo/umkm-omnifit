"use client";

import React from "react";
import { TabsContent } from "@/components/ui/tabs";
import { Lightbulb, Zap, Percent } from "lucide-react";

export function SmartAdvisorTab() {
  return (
    <TabsContent value="smart_advisor" className="space-y-3 pt-1">
      <div className="borderless-card p-4 space-y-2.5 bg-gradient-to-r from-purple-50/60 via-indigo-50/60 to-purple-50/60">
        <div className="flex items-center gap-1.5 font-black text-purple-950 text-xs">
          <Lightbulb className="h-4 w-4 text-purple-600" />
          <span>Rekomendasi Cerdas Operasional Toko:</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 text-xs">
          <div className="bg-white p-3 rounded-xl border border-purple-100 shadow-2xs space-y-1">
            <span className="font-extrabold text-slate-900 block flex items-center gap-1.5 text-[11px]">
              <Zap className="h-3.5 w-3.5 text-amber-500" />
              <span>Restok Bahan Jam Sibuk</span>
            </span>
            <p className="text-slate-600 text-[11px]">
              Pastikan bahan produk fast-moving sudah dipersiapkan sebelum jam ramai kasir.
            </p>
          </div>
          <div className="bg-white p-3 rounded-xl border border-purple-100 shadow-2xs space-y-1">
            <span className="font-extrabold text-slate-900 block flex items-center gap-1.5 text-[11px]">
              <Percent className="h-3.5 w-3.5 text-emerald-600" />
              <span>Eksplorasi 111+ Resep HPP</span>
            </span>
            <p className="text-slate-600 text-[11px]">
              Bandingkan takaran gramasi bahan Anda dengan template industri di menu Kalkulator HPP.
            </p>
          </div>
        </div>
      </div>
    </TabsContent>
  );
}
