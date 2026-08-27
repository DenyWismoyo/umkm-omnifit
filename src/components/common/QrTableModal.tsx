"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  QrCode,
  Printer,
  Copy,
  ExternalLink,
  Store,
  Sparkles,
  Share2,
} from "lucide-react";
import { toast } from "sonner";

interface QrTableModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function QrTableModal({ isOpen, onClose }: QrTableModalProps) {
  const { shopProfile } = useAuth();
  const [selectedTable, setSelectedTable] = useState("01");

  const storeCode = shopProfile?.storeCode || "TOKO-DEMO";
  const baseUrl = typeof window !== "undefined" ? window.location.origin : "https://posumkm.id";
  const menuUrl = `${baseUrl}/menu/${storeCode}?table=${selectedTable}`;
  const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&margin=10&data=${encodeURIComponent(
    menuUrl
  )}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(menuUrl);
    toast.success("Tautan Menu Digital disalin ke clipboard!");
  };

  const handlePrintStand = () => {
    window.print();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md rounded-3xl p-5 bg-white border border-slate-200 shadow-2xl text-slate-900">
        <DialogTitle className="text-base font-black flex items-center gap-2">
          <QrCode className="h-5 w-5 text-emerald-600" />
          <span>QR Meja & Menu Digital Pelanggan</span>
        </DialogTitle>

        <p className="text-xs text-slate-600 leading-relaxed mt-0.5">
          Cetak dan letakkan kode QR ini di atas meja pelanggan agar mereka bisa langsung memesan via WhatsApp.
        </p>

        {/* Table Selector */}
        <div className="space-y-1.5 mt-2 text-xs">
          <label className="font-bold text-slate-700">Pilih Nomor Meja:</label>
          <select
            value={selectedTable}
            onChange={(e) => setSelectedTable(e.target.value)}
            className="w-full h-9 rounded-xl border border-slate-200 px-3 text-xs bg-white font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            {Array.from({ length: 20 }).map((_, i) => {
              const num = i + 1 < 10 ? `0${i + 1}` : `${i + 1}`;
              return (
                <option key={num} value={num}>
                  📍 Meja {num}
                </option>
              );
            })}
          </select>
        </div>

        {/* Stand QR Preview Card */}
        <div className="mt-2 bg-gradient-to-b from-slate-900 to-emerald-950 text-white p-5 rounded-2xl text-center space-y-3 shadow-lg border border-emerald-500/30">
          <div className="space-y-0.5">
            <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest block">
              Scan untuk Pesan Menu
            </span>
            <h3 className="font-black text-base text-white truncate">
              {shopProfile?.shopName || "Toko Kami"}
            </h3>
            <span className="inline-block bg-emerald-500 text-slate-950 font-black text-xs px-2.5 py-0.5 rounded-full">
              MEJA {selectedTable}
            </span>
          </div>

          <div className="p-2.5 bg-white rounded-2xl inline-block shadow-md">
            <img
              src={qrApiUrl}
              alt={`QR Menu Meja ${selectedTable}`}
              className="w-44 h-44 mx-auto"
            />
          </div>

          <p className="text-[10px] text-slate-300">
            Powered by POS UMKM • Self-Order WhatsApp
          </p>
        </div>

        {/* Actions */}
        <div className="space-y-2 pt-2 text-xs">
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleCopyLink}
              className="touch-press flex-1 h-9 text-xs font-bold border-slate-200 gap-1.5"
            >
              <Copy className="h-3.5 w-3.5" />
              <span>Salin Link</span>
            </Button>

            <Button
              type="button"
              variant="default"
              size="sm"
              onClick={() => window.open(menuUrl, "_blank")}
              className="touch-press flex-1 h-9 text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white gap-1.5"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              <span>Buka Menu</span>
            </Button>
          </div>

          <Button
            type="button"
            variant="default"
            size="sm"
            onClick={handlePrintStand}
            className="touch-press w-full h-10 text-xs font-black bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5 rounded-xl shadow-xs"
          >
            <Printer className="h-4 w-4" />
            <span>Cetak Stand QR Meja {selectedTable}</span>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
