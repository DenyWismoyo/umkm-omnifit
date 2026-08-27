"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Receipt, QrCode, ExternalLink, Tv, Printer } from "lucide-react";
import { toast } from "sonner";

interface ReceiptQrTabProps {
  formData: any;
  setFormData: React.Dispatch<React.SetStateAction<any>>;
  shopProfile: any;
  setIsQrModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export function ReceiptQrTab({ formData, setFormData, shopProfile, setIsQrModalOpen }: ReceiptQrTabProps) {
  return (
    <div className="animate-in fade-in duration-200 space-y-6">
      <Card>
        <CardHeader className="pb-4 border-b border-slate-100">
          <CardTitle className="text-base flex items-center gap-2">
            <Receipt className="h-5 w-5 text-teal-600" />
            <span>Pengaturan Struk Kasir & Pajak</span>
          </CardTitle>
          <CardDescription className="text-xs">
            Sesuaikan footer struk, format printer thermal, dan pajak penjualan.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4 pt-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                Pajak Penjualan PPN (%)
              </label>
              <Input
                type="number"
                min="0"
                max="100"
                value={formData.taxPercentage}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    taxPercentage: Number(e.target.value) || 0,
                  })
                }
                placeholder="0"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">
                Isi 0 jika toko Anda tidak mengenakan pajak PPN kepada pelanggan.
              </span>
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                Ukuran Kertas Thermal Printer
              </label>
              <select
                value={formData.paperSize}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    paperSize: e.target.value as any,
                  })
                }
                className="w-full h-10 rounded-xl border border-slate-200 bg-white text-slate-900 px-3 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="58mm">58 mm (Printer Kasir Portable / Bluetooth)</option>
                <option value="80mm">80 mm (Printer Kasir Standar / Desktop)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">
              Catatan Kaki Struk (Footer Message)
            </label>
            <Input
              value={formData.receiptFooter}
              onChange={(e) =>
                setFormData({ ...formData, receiptFooter: e.target.value })
              }
              placeholder="Terima kasih atas kunjungan Anda!"
            />
          </div>
        </CardContent>
      </Card>

      <Card className="border-emerald-200 bg-gradient-to-br from-emerald-50/40 to-teal-50/30 shadow-sm">
        <CardHeader className="pb-4 border-b border-emerald-100/80">
          <CardTitle className="text-base flex items-center justify-between">
            <div className="flex items-center gap-2 text-emerald-950 font-black">
              <QrCode className="h-5 w-5 text-emerald-600" />
              <span>Katalog Online & QR Meja (Self-Order In-App)</span>
            </div>
            <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full">
              Gratis & Cepat
            </span>
          </CardTitle>
          <CardDescription className="text-xs text-slate-600">
            Pelanggan kafe / warung Anda bisa scan barcode QR di meja untuk melihat menu, memilih pesanan, dan langsung kirim pesanan ke Kasir Toko tanpa antre.
          </CardDescription>
        </CardHeader>

        <CardContent className="pt-4 text-xs space-y-3">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3.5 bg-white rounded-2xl border border-slate-200">
            <div className="space-y-0.5">
              <span className="font-extrabold text-slate-900 block text-xs">
                Link Menu Digital Toko Anda:
              </span>
              <code className="text-[11px] font-mono text-emerald-700 font-bold block truncate">
                /menu/{shopProfile?.storeCode || "KODE-TOKO"}
              </code>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  const code = shopProfile?.storeCode;
                  if (code) {
                    window.open(`/menu/${code}`, "_blank");
                  } else {
                    toast.error("Simpan profil toko terlebih dahulu.");
                  }
                }}
                className="touch-press text-xs font-bold gap-1.5 h-9"
              >
                <ExternalLink className="h-3.5 w-3.5" />
                <span>Buka Menu</span>
              </Button>

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  const code = shopProfile?.storeCode;
                  if (code) {
                    window.open(`/display/${code}`, "_blank");
                  } else {
                    toast.error("Simpan profil toko terlebih dahulu.");
                  }
                }}
                className="touch-press text-xs font-bold gap-1.5 h-9"
              >
                <Tv className="h-3.5 w-3.5 text-emerald-600" />
                <span>Layar TV Antrean</span>
              </Button>

              <Button
                type="button"
                variant="default"
                size="sm"
                onClick={() => setIsQrModalOpen(true)}
                className="touch-press text-xs font-black bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5 h-9 shadow-xs"
              >
                <Printer className="h-3.5 w-3.5" />
                <span>Cetak Stand QR Meja</span>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
