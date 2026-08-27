"use client";

import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Printer, MessageSquare, Check, Download } from "lucide-react";
import { Transaction, ShopProfile } from "@/types";
import { formatRupiah } from "@/lib/utils";

interface ReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  transaction: Transaction | null;
  shopProfile: ShopProfile | null;
}

export function ReceiptModal({
  isOpen,
  onClose,
  transaction,
  shopProfile,
}: ReceiptModalProps) {
  if (!transaction) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleSendWhatsApp = () => {
    if (!transaction) return;

    let itemsText = transaction.items
      .map(
        (it) =>
          `• ${it.productName} x${it.quantity} = ${formatRupiah(it.subtotal)}`
      )
      .join("\n");

    const message = `*${shopProfile?.shopName || "STRUK PENJUALAN"}*\n` +
      `No. Faktur: ${transaction.invoiceNumber}\n` +
      `Tanggal: ${new Date(transaction.date).toLocaleString("id-ID")}\n` +
      `--------------------------------\n` +
      `${itemsText}\n` +
      `--------------------------------\n` +
      `Subtotal: ${formatRupiah(transaction.subtotal)}\n` +
      (transaction.taxAmount > 0 ? `Pajak (${transaction.taxRate}%): ${formatRupiah(transaction.taxAmount)}\n` : "") +
      `*TOTAL: ${formatRupiah(transaction.totalAmount)}*\n` +
      `Metode: ${transaction.paymentMethod.toUpperCase()}\n` +
      `Bayar: ${formatRupiah(transaction.amountPaid)}\n` +
      `Kembalian: ${formatRupiah(transaction.changeAmount)}\n\n` +
      `${shopProfile?.receiptFooter || "Terima kasih atas kunjungan Anda!"}`;

    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md p-0 overflow-hidden bg-slate-900/40 backdrop-blur-md border-slate-700">
        <div className="p-6 pb-2 text-center text-white">
          <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
            <Check className="h-6 w-6" />
          </div>
          <DialogTitle className="text-xl font-bold text-white">
            Transaksi Berhasil!
          </DialogTitle>
          <p className="text-xs text-slate-300 mt-1">
            Faktur: {transaction.invoiceNumber}
          </p>
        </div>

        {/* Printable Receipt Paper Visual */}
        <div className="p-4 sm:p-6 bg-slate-100 flex justify-center">
          <div
            id="printable-receipt"
            className="w-full max-w-[320px] bg-white p-5 rounded-lg shadow-md border border-slate-200 text-slate-800 text-[12px] font-mono leading-relaxed"
          >
            {/* Store Header */}
            <div className="text-center pb-3 border-b border-dashed border-slate-300">
              <h3 className="font-bold text-sm tracking-wider text-slate-950 uppercase">
                {shopProfile?.shopName || "TOKO UMKM"}
              </h3>
              {shopProfile?.address && (
                <p className="text-[11px] text-slate-600 mt-0.5">{shopProfile.address}</p>
              )}
              {shopProfile?.phoneNumber && (
                <p className="text-[11px] text-slate-600">Telp: {shopProfile.phoneNumber}</p>
              )}
            </div>

            {/* Meta Info */}
            <div className="py-2.5 border-b border-dashed border-slate-300 space-y-0.5 text-[11px]">
              <div className="flex justify-between">
                <span>No: {transaction.invoiceNumber}</span>
                <span>{new Date(transaction.date).toLocaleDateString("id-ID")}</span>
              </div>
              <div className="flex justify-between">
                <span>Kasir: {shopProfile?.ownerName || "Admin"}</span>
                <span>{new Date(transaction.date).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}</span>
              </div>
              {transaction.customerName && (
                <div className="flex justify-between font-semibold text-slate-900">
                  <span>Pelanggan:</span>
                  <span>{transaction.customerName}</span>
                </div>
              )}
            </div>

            {/* Items */}
            <div className="py-3 border-b border-dashed border-slate-300 space-y-2">
              {transaction.items.map((item, idx) => (
                <div key={idx} className="space-y-0.5">
                  <div className="font-semibold text-slate-900">{item.productName}</div>
                  <div className="flex justify-between text-[11px] text-slate-600">
                    <span>
                      {item.quantity} x {formatRupiah(item.sellingPrice)}
                      {item.discount > 0 ? ` (disc: ${formatRupiah(item.discount)})` : ""}
                    </span>
                    <span className="font-semibold text-slate-900">{formatRupiah(item.subtotal)}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Total Calculations */}
            <div className="py-2.5 border-b border-dashed border-slate-300 space-y-1 text-[11px]">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{formatRupiah(transaction.subtotal)}</span>
              </div>
              {transaction.taxAmount > 0 && (
                <div className="flex justify-between">
                  <span>Pajak ({transaction.taxRate}%)</span>
                  <span>{formatRupiah(transaction.taxAmount)}</span>
                </div>
              )}
              {transaction.discount > 0 && (
                <div className="flex justify-between text-emerald-700">
                  <span>Total Diskon</span>
                  <span>-{formatRupiah(transaction.discount)}</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-sm text-slate-950 pt-1 border-t border-slate-200">
                <span>TOTAL</span>
                <span>{formatRupiah(transaction.totalAmount)}</span>
              </div>
              <div className="flex justify-between pt-1">
                <span>Metode ({transaction.paymentMethod.toUpperCase()})</span>
                <span>{formatRupiah(transaction.amountPaid)}</span>
              </div>
              <div className="flex justify-between font-semibold text-emerald-700">
                <span>Kembalian</span>
                <span>{formatRupiah(transaction.changeAmount)}</span>
              </div>
            </div>

            {/* Receipt Footer */}
            <div className="text-center pt-3 text-[10px] text-slate-500 italic">
              <p>{shopProfile?.receiptFooter || "Terima kasih telah berbelanja!"}</p>
              <p className="mt-0.5 text-[9px] not-italic text-slate-400">Powered by POS UMKM</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="p-4 bg-white border-t border-slate-200 flex flex-wrap gap-2 justify-end">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleSendWhatsApp}
            className="flex items-center gap-1.5 text-emerald-700 border-emerald-300 hover:bg-emerald-50"
          >
            <MessageSquare className="h-4 w-4" />
            <span>Kirim WhatsApp</span>
          </Button>

          <Button
            type="button"
            variant="default"
            size="sm"
            onClick={handlePrint}
            className="flex items-center gap-1.5 shadow-emerald-600/25"
          >
            <Printer className="h-4 w-4" />
            <span>Cetak Struk</span>
          </Button>

          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={onClose}
          >
            Selesai / Tutup
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
