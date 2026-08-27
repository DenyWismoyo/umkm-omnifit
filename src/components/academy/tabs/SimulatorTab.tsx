"use client";

import React from "react";
import { TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Calculator, Percent, Users, ShieldCheck } from "lucide-react";

interface SimulatorTabProps {
  bepInitialCapital: number;
  setBepInitialCapital: (v: number) => void;
  bepMonthlyFixedCost: number;
  setBepMonthlyFixedCost: (v: number) => void;
  bepSellingPrice: number;
  setBepSellingPrice: (v: number) => void;
  bepHppPrice: number;
  setBepHppPrice: (v: number) => void;
  bepDailyUnits: number;
  bepMarginPct: number;
  paybackMonths: string | number;
  promoNormalPrice: number;
  setPromoNormalPrice: (v: number) => void;
  promoHpp: number;
  setPromoHpp: (v: number) => void;
  promoNormalDailyQtyBase: number;
  setPromoNormalDailyQty: (v: number) => void;
  promoDiscountPct: number;
  setPromoDiscountPct: (v: number) => void;
  promoRequiredDailyQty: number;
  promoVolumeIncreasePct: number;
  staffSalary: number;
  setStaffSalary: (v: number) => void;
  staffRequiredUnitsDay: number;
  runwayCashReserve: number;
  setRunwayCashReserve: (v: number) => void;
  runwayMonths: string | number;
}

export function SimulatorTab({
  bepInitialCapital, setBepInitialCapital,
  bepMonthlyFixedCost, setBepMonthlyFixedCost,
  bepSellingPrice, setBepSellingPrice,
  bepHppPrice, setBepHppPrice,
  bepDailyUnits, bepMarginPct, paybackMonths,
  promoNormalPrice, setPromoNormalPrice,
  promoHpp, setPromoHpp,
  promoNormalDailyQtyBase, setPromoNormalDailyQty,
  promoDiscountPct, setPromoDiscountPct,
  promoRequiredDailyQty,
  promoVolumeIncreasePct,
  staffSalary, setStaffSalary,
  staffRequiredUnitsDay,
  runwayCashReserve, setRunwayCashReserve,
  runwayMonths,
}: SimulatorTabProps) {
  return (
    <TabsContent value="simulator" className="space-y-3.5 pt-1">
      <div className="borderless-card p-4 sm:p-5 space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2 font-black text-slate-900 text-xs sm:text-sm">
            <Calculator className="h-4 w-4 text-emerald-600" />
            <span>Simulasi 1: Titik Impas (BEP) & Balik Modal</span>
          </div>
          <Badge className="bg-emerald-100 text-emerald-800 text-[9px]">Fondasi</Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 text-xs">
          <div className="space-y-2.5 bg-slate-50/80 p-3 rounded-xl border border-slate-100">
            <div>
              <label className="font-semibold text-slate-700 block mb-1 text-[11px]">
                Modal Awal Usaha:
              </label>
              <Input
                type="number"
                value={bepInitialCapital}
                onChange={(e) => setBepInitialCapital(Number(e.target.value) || 0)}
                className="bg-white font-bold text-xs h-8"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1 text-[11px]">
                Biaya Tetap / Bulan (Gaji, Sewa, Wifi):
              </label>
              <Input
                type="number"
                value={bepMonthlyFixedCost}
                onChange={(e) => setBepMonthlyFixedCost(Number(e.target.value) || 0)}
                className="bg-white font-bold text-xs h-8"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="font-semibold text-slate-700 block mb-1 text-[11px]">
                  Harga Jual:
                </label>
                <Input
                  type="number"
                  value={bepSellingPrice}
                  onChange={(e) => setBepSellingPrice(Number(e.target.value) || 0)}
                  className="bg-white font-bold text-xs h-8"
                />
              </div>
              <div>
                <label className="font-semibold text-slate-700 block mb-1 text-[11px]">
                  HPP / Porsi:
                </label>
                <Input
                  type="number"
                  value={bepHppPrice}
                  onChange={(e) => setBepHppPrice(Number(e.target.value) || 0)}
                  className="bg-white font-bold text-xs h-8"
                />
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-emerald-200 bg-emerald-50/40 p-3 flex flex-col justify-between space-y-2">
            <div className="space-y-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Hasil Titik Impas:
              </span>
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-white p-2.5 rounded-lg border border-emerald-100">
                  <span className="text-[9px] text-slate-500 block">Target Harian:</span>
                  <span className="text-base font-black text-emerald-800">{bepDailyUnits} porsi/hari</span>
                </div>
                <div className="bg-white p-2.5 rounded-lg border border-emerald-100">
                  <span className="text-[9px] text-slate-500 block">Margin:</span>
                  <span className="text-base font-black text-slate-900">{bepMarginPct.toFixed(0)}%</span>
                </div>
              </div>
              <div className="bg-white p-2.5 rounded-lg border border-emerald-100">
                <span className="text-[9px] text-slate-500 block">Estimasi Balik Modal:</span>
                <span className="text-base font-black text-emerald-800">{paybackMonths} Bulan</span>
              </div>
            </div>
            <p className="text-[10px] text-slate-600 italic">
              💡 Porsi di atas {bepDailyUnits}/hari adalah murni keuntungan bersih Anda.
            </p>
          </div>
        </div>
      </div>

      <div className="borderless-card p-4 sm:p-5 space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2 font-black text-slate-900 text-xs sm:text-sm">
            <Percent className="h-4 w-4 text-amber-600" />
            <span>Simulasi 2: Sensitivitas Diskon & Komisi Ojol</span>
          </div>
          <Badge className="bg-amber-100 text-amber-800 text-[9px]">Jebakan Diskon</Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          <div className="space-y-2 bg-slate-50/80 p-3 rounded-xl border border-slate-100">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="font-semibold text-slate-700 block mb-1 text-[11px]">Harga Normal:</label>
                <Input
                  type="number"
                  value={promoNormalPrice}
                  onChange={(e) => setPromoNormalPrice(Number(e.target.value) || 0)}
                  className="bg-white font-bold text-xs h-8"
                />
              </div>
              <div>
                <label className="font-semibold text-slate-700 block mb-1 text-[11px]">HPP Produk:</label>
                <Input
                  type="number"
                  value={promoHpp}
                  onChange={(e) => setPromoHpp(Number(e.target.value) || 0)}
                  className="bg-white font-bold text-xs h-8"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="font-semibold text-slate-700 block mb-1 text-[11px]">Penjualan Normal:</label>
                <Input
                  type="number"
                  value={promoNormalDailyQtyBase}
                  onChange={(e) => setPromoNormalDailyQty(Number(e.target.value) || 0)}
                  className="bg-white font-bold text-xs h-8"
                />
              </div>
              <div>
                <label className="font-semibold text-slate-700 block mb-1 text-[11px]">Diskon (%):</label>
                <Input
                  type="number"
                  value={promoDiscountPct}
                  onChange={(e) => setPromoDiscountPct(Number(e.target.value) || 0)}
                  className="bg-white font-bold text-xs h-8 text-rose-600"
                />
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-amber-200 bg-amber-50/40 p-3 flex flex-col justify-between space-y-2">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Wajib Capai Target:
              </span>
              <div className="bg-white p-2.5 rounded-lg border border-amber-200 flex items-center justify-between">
                <div>
                  <span className="text-base font-black text-amber-900">{promoRequiredDailyQty} porsi/hari</span>
                  <span className="text-[10px] text-slate-500 block">(+{promoRequiredDailyQty - promoNormalDailyQtyBase} porsi ekstra)</span>
                </div>
                <Badge className="bg-rose-100 text-rose-800 text-[9px] font-extrabold">+{promoVolumeIncreasePct}%</Badge>
              </div>
            </div>
            <p className="text-[10px] text-amber-900 font-medium">
              ⚠️ Diskon {promoDiscountPct}% menuntut <strong>+{promoVolumeIncreasePct}% pelanggan baru</strong> agar profit tidak tekor.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
        <div className="borderless-card p-3.5 space-y-2">
          <span className="font-extrabold text-slate-900 text-xs flex items-center gap-1.5">
            <Users className="h-4 w-4 text-blue-600" />
            <span>Simulasi Rekrut Karyawan</span>
          </span>
          <div className="space-y-1.5">
            <label className="text-[11px] text-slate-600">Gaji Karyawan / Bulan:</label>
            <Input
              type="number"
              value={staffSalary}
              onChange={(e) => setStaffSalary(Number(e.target.value) || 0)}
              className="h-8 text-xs bg-slate-50 font-bold"
            />
            <div className="bg-blue-50/80 border border-blue-200 p-2 rounded-lg text-blue-950 flex items-center justify-between">
              <span className="text-[10px]">Target Ekstra Penjualan:</span>
              <span className="font-black text-xs text-blue-900">+{staffRequiredUnitsDay} porsi/hari</span>
            </div>
          </div>
        </div>

        <div className="borderless-card p-3.5 space-y-2">
          <span className="font-extrabold text-slate-900 text-xs flex items-center gap-1.5">
            <ShieldCheck className="h-4 w-4 text-purple-600" />
            <span>Daya Tahan Kas Darurat</span>
          </span>
          <div className="space-y-1.5">
            <label className="text-[11px] text-slate-600">Kas Cadangan Saat Ini:</label>
            <Input
              type="number"
              value={runwayCashReserve}
              onChange={(e) => setRunwayCashReserve(Number(e.target.value) || 0)}
              className="h-8 text-xs bg-slate-50 font-bold"
            />
            <div className="bg-purple-50/80 border border-purple-200 p-2 rounded-lg text-purple-950 flex items-center justify-between">
              <span className="text-[10px]">Zero Income Runway:</span>
              <span className="font-black text-xs text-purple-900">{runwayMonths} Bulan</span>
            </div>
          </div>
        </div>
      </div>
    </TabsContent>
  );
}
