"use client";

import React, { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { PageHeader } from "@/components/common/PageHeader";
import { FeatureGate } from "@/components/common/FeatureGate";
import { Button } from "@/components/ui/button";
import { Calculator, Scale, ShoppingCart } from "lucide-react";
import { formatRupiah } from "@/lib/utils";

export default function WeightPricingPage() {
  const [weightKg, setWeightKg] = useState<number>(1);
  const [pricePerKg, setPricePerKg] = useState<number>(6000); // Default 6rb/kg
  const [serviceType, setServiceType] = useState<"Reguler" | "Express">("Reguler");
  
  const expressMultiplier = 1.5;
  const finalPrice = serviceType === "Express" ? pricePerKg * expressMultiplier : pricePerKg;
  const total = weightKg * finalPrice;

  return (
    <DashboardLayout>
      <FeatureGate
        requiredTier="pro"
        requiredIndustry={["laundry"]}
        featureName="Timbangan & Kalkulator Harga Laundry"
        description="Fitur timbangan digital otomatis dan kalkulasi harga layanan per kilo (Reguler/Express)."
      >
        <div className="space-y-4 sm:space-y-6 max-w-2xl mx-auto pb-12">
          <PageHeader
            title="Kalkulator Timbangan Kiloan"
            description="Hitung otomatis harga laundry berdasarkan berat timbangan."
          />

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
            
            {/* Input Berat */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <Scale className="w-4 h-4 text-indigo-600" />
                Berat Pakaian (Kg)
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  min="0.1"
                  step="0.1"
                  value={weightKg}
                  onChange={(e) => setWeightKg(parseFloat(e.target.value) || 0)}
                  className="flex-1 h-14 text-center text-3xl font-black text-slate-900 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
                <span className="text-xl font-bold text-slate-400 w-12">Kg</span>
              </div>
            </div>

            {/* Pilihan Layanan */}
            <div className="grid grid-cols-2 gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setServiceType("Reguler")}
                className={`h-14 flex flex-col justify-center gap-0 border-2 ${
                  serviceType === "Reguler"
                    ? "border-indigo-600 bg-indigo-50 text-indigo-900"
                    : "border-slate-200 text-slate-500"
                }`}
              >
                <span className="font-black text-sm">Reguler (3 Hari)</span>
                <span className="text-[10px]">{formatRupiah(pricePerKg)}/Kg</span>
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setServiceType("Express")}
                className={`h-14 flex flex-col justify-center gap-0 border-2 ${
                  serviceType === "Express"
                    ? "border-amber-500 bg-amber-50 text-amber-900"
                    : "border-slate-200 text-slate-500"
                }`}
              >
                <span className="font-black text-sm text-amber-600">Express (1 Hari)</span>
                <span className="text-[10px]">{formatRupiah(pricePerKg * expressMultiplier)}/Kg</span>
              </Button>
            </div>

            {/* Rekap Total */}
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
              <div className="flex justify-between items-center mb-2">
                <span className="text-slate-500 text-sm">Total Tagihan</span>
                <span className="font-black text-2xl text-slate-900">{formatRupiah(total)}</span>
              </div>
              <p className="text-xs text-slate-400 text-right">
                {weightKg} Kg × {formatRupiah(finalPrice)}
              </p>
            </div>

            <Button className="w-full h-12 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-sm rounded-xl">
              <ShoppingCart className="w-4 h-4 mr-2" />
              Lanjut ke Kasir (POS)
            </Button>
          </div>
        </div>
      </FeatureGate>
    </DashboardLayout>
  );
}
