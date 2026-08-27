"use client";

import React from "react";
import { TabsContent } from "@/components/ui/tabs";
import { formatRupiah } from "@/lib/utils";

interface HealthCheckTabProps {
  healthMetrics: {
    grossMarginPct: number;
    opexRatioPct: number;
    netProfit: number;
    totalDebts: number;
    debtRatioPct: number;
  };
}

export function HealthCheckTab({ healthMetrics }: HealthCheckTabProps) {
  return (
    <TabsContent value="health_check" className="space-y-3 pt-1">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        <div className="borderless-card p-3 space-y-1">
          <span className="text-[10px] text-slate-500 font-bold block">Gross Margin</span>
          <p className="text-lg sm:text-xl font-black text-slate-900">{healthMetrics.grossMarginPct}%</p>
          <span className="text-[9px] text-emerald-600 font-semibold">Target &gt; 40%</span>
        </div>
        <div className="borderless-card p-3 space-y-1">
          <span className="text-[10px] text-slate-500 font-bold block">Opex Ratio</span>
          <p className="text-lg sm:text-xl font-black text-slate-900">{healthMetrics.opexRatioPct}%</p>
          <span className="text-[9px] text-slate-400 font-semibold">Maks 30%</span>
        </div>
        <div className="borderless-card p-3 space-y-1">
          <span className="text-[10px] text-slate-500 font-bold block">Net Profit</span>
          <p className="text-lg sm:text-xl font-black text-emerald-700">{formatRupiah(healthMetrics.netProfit)}</p>
          <span className="text-[9px] text-emerald-600 font-semibold">Laba Bersih</span>
        </div>
        <div className="borderless-card p-3 space-y-1">
          <span className="text-[10px] text-slate-500 font-bold block">Piutang Kasbon</span>
          <p className="text-lg sm:text-xl font-black text-slate-900">{formatRupiah(healthMetrics.totalDebts)}</p>
          <span className="text-[9px] text-amber-600 font-semibold">{healthMetrics.debtRatioPct}% Omzet</span>
        </div>
      </div>
    </TabsContent>
  );
}
