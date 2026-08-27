"use client";

import React from "react";
import { TabsContent } from "@/components/ui/tabs";
import { CheckSquare, BookMarked, CheckCircle2, Square } from "lucide-react";

interface ChecklistsTabProps {
  checkedSopItems: Record<string, boolean>;
  toggleSopItem: (key: string) => void;
}

export function ChecklistsTab({ checkedSopItems, toggleSopItem }: ChecklistsTabProps) {
  return (
    <TabsContent value="checklists" className="space-y-3 pt-1">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
        <div className="borderless-card p-3.5 space-y-2">
          <h4 className="font-extrabold text-emerald-950 text-xs flex items-center gap-1.5">
            <CheckSquare className="h-4 w-4 text-emerald-600" />
            <span>Checklist Harian Buka & Tutup Toko</span>
          </h4>
          <div className="space-y-1.5">
            {[
              { id: "sop_open_cash", label: "Hitung uang modal kas kecil kembalian." },
              { id: "sop_open_stock", label: "Cek bahan kritis & display produk." },
              { id: "sop_open_qris", label: "Pastikan barcode QRIS bersih dan terbaca." },
              { id: "sop_close_recon", label: "Rekonsiliasi uang fisik dengan laporan POS." },
              { id: "sop_close_expense", label: "Catat pengeluaran belanja harian." },
            ].map((item) => {
              const isChecked = !!checkedSopItems[item.id];
              return (
                <div
                  key={item.id}
                  onClick={() => toggleSopItem(item.id)}
                  className={`touch-press flex items-center gap-2 p-2 rounded-lg border transition-all cursor-pointer ${
                    isChecked
                      ? "bg-emerald-50 border-emerald-200 text-emerald-950"
                      : "bg-slate-50/80 border-slate-200/60 text-slate-700"
                  }`}
                >
                  {isChecked ? (
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                  ) : (
                    <Square className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                  )}
                  <span className={isChecked ? "line-through opacity-75 text-[11px]" : "text-[11px]"}>
                    {item.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="borderless-card p-3.5 space-y-2">
          <h4 className="font-extrabold text-blue-950 text-xs flex items-center gap-1.5">
            <BookMarked className="h-4 w-4 text-blue-600" />
            <span>Checklist Evaluasi Bulanan</span>
          </h4>
          <div className="space-y-1.5">
            {[
              { id: "sop_m_pl", label: "Tinjau Laporan Laba/Rugi: Net Margin &ge; 15%." },
              { id: "sop_m_salary", label: "Transfer gaji tetap owner ke rekening pribadi." },
              { id: "sop_m_debt", label: "Kirim pesan tagihan kasbon pelanggan via WA." },
              { id: "sop_m_audit_hpp", label: "Audit harga pasar & sesuaikan resep HPP." },
              { id: "sop_m_emergency", label: "Sisihkan 10-15% laba ke Dana Darurat." },
            ].map((item) => {
              const isChecked = !!checkedSopItems[item.id];
              return (
                <div
                  key={item.id}
                  onClick={() => toggleSopItem(item.id)}
                  className={`touch-press flex items-center gap-2 p-2 rounded-lg border transition-all cursor-pointer ${
                    isChecked
                      ? "bg-blue-50 border-blue-200 text-blue-950"
                      : "bg-slate-50/80 border-slate-200/60 text-slate-700"
                  }`}
                >
                  {isChecked ? (
                    <CheckCircle2 className="h-3.5 w-3.5 text-blue-600 shrink-0" />
                  ) : (
                    <Square className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                  )}
                  <span className={isChecked ? "line-through opacity-75 text-[11px]" : "text-[11px]"}>
                    <span dangerouslySetInnerHTML={{ __html: item.label }} />
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </TabsContent>
  );
}
