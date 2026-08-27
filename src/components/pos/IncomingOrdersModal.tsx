"use client";

import React, { useState } from "react";
import { IncomingOrder, OrderStatus, Product } from "@/types";
import { updateOrderStatus } from "@/services/firestore";
import { formatRupiah } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  BellRing,
  ShoppingCart,
  ChefHat,
  CheckCircle2,
  XCircle,
  Clock,
  Printer,
  X,
  ArrowRight,
  Sparkles,
  Utensils,
} from "lucide-react";
import { toast } from "sonner";

interface IncomingOrdersModalProps {
  isOpen: boolean;
  onClose: () => void;
  orders: IncomingOrder[];
  ownerUid: string;
  onLoadOrderToCart: (order: IncomingOrder) => void;
}

export function IncomingOrdersModal({
  isOpen,
  onClose,
  orders,
  ownerUid,
  onLoadOrderToCart,
}: IncomingOrdersModalProps) {
  const [selectedFilter, setSelectedFilter] = useState<string>("active");

  const filteredOrders = orders.filter((o) => {
    if (selectedFilter === "active") {
      return o.status === "PENDING" || o.status === "ACCEPTED" || o.status === "COOKING" || o.status === "READY";
    }
    if (selectedFilter === "pending") return o.status === "PENDING";
    if (selectedFilter === "cooking") return o.status === "COOKING" || o.status === "ACCEPTED";
    if (selectedFilter === "ready") return o.status === "READY";
    if (selectedFilter === "completed") return o.status === "COMPLETED";
    return true;
  });

  const handleUpdateStatus = async (orderId: string, status: OrderStatus) => {
    if (!ownerUid) return;
    try {
      await updateOrderStatus(ownerUid, orderId, status);
      toast.success(`Status pesanan diperbarui.`);
    } catch (err) {
      toast.error("Gagal memperbarui status pesanan.");
    }
  };

  const handlePrintKitchenTicket = (order: IncomingOrder) => {
    // Generate simple printable kitchen slip
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    const html = `
      <html>
        <head>
          <title>TIKET DAPUR #${order.orderNumber}</title>
          <style>
            body { font-family: monospace; padding: 10px; width: 280px; font-size: 13px; line-height: 1.4; }
            .header { text-align: center; border-bottom: 2px dashed #000; padding-bottom: 8px; margin-bottom: 8px; }
            .title { font-size: 16px; font-weight: bold; }
            .table { font-size: 18px; font-weight: bold; background: #000; color: #fff; padding: 2px 6px; display: inline-block; margin: 4px 0; }
            .item { margin-bottom: 6px; }
            .item-name { font-weight: bold; }
            .item-notes { font-style: italic; color: #333; margin-left: 10px; }
            .footer { border-top: 1px dashed #000; padding-top: 6px; margin-top: 10px; text-align: center; font-size: 11px; }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="title">TIKET PESANAN DAPUR</div>
            <div class="table">${order.tableNumber.toUpperCase()}</div>
            <div>#${order.orderNumber} • ${order.customerName}</div>
            <div>${new Date(order.createdAt).toLocaleTimeString()}</div>
          </div>
          <div class="items">
            ${order.items
              .map(
                (it) => `
              <div class="item">
                <div class="item-name">${it.quantity}x ${it.productName}</div>
                ${it.notes ? `<div class="item-notes">↳ ${it.notes}</div>` : ""}
              </div>
            `
              )
              .join("")}
          </div>
          ${order.generalNotes ? `<div style="margin-top:8px; border-top:1px dotted #000; padding-top:4px;"><b>Catatan:</b> ${order.generalNotes}</div>` : ""}
          <div class="footer">
            Harap segera diproses oleh Barista / Koki.
          </div>
          <script>
            window.onload = function() { window.print(); window.close(); }
          </script>
        </body>
      </html>
    `;
    printWindow.document.write(html);
    printWindow.document.close();
  };

  const pendingCount = orders.filter((o) => o.status === "PENDING").length;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl rounded-3xl p-0 overflow-hidden border border-slate-200 shadow-2xl bg-white max-h-[90vh] flex flex-col">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-teal-950 p-4 sm:p-5 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500 text-slate-950 font-black shrink-0 shadow-md">
              <BellRing className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm sm:text-base font-black text-white">
                  Radar Pesanan Meja (Self-Order)
                </h3>
                {pendingCount > 0 && (
                  <span className="bg-rose-500 text-white font-black text-[10px] px-2 py-0.2 rounded-full animate-pulse">
                    {pendingCount} Baru
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-300">
                Pesanan masuk otomatis dari scan QR Meja pelanggan.
              </p>
            </div>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="p-3 bg-slate-50 border-b border-slate-200 flex items-center gap-1.5 overflow-x-auto no-scrollbar shrink-0 text-xs">
          {[
            { id: "active", label: "Semua Aktif" },
            { id: "pending", label: `Baru (${pendingCount})` },
            { id: "cooking", label: "Sedang Dimasak" },
            { id: "ready", label: "Di Meja (Belum Lunas)" },
            { id: "completed", label: "Selesai / Lunas" },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setSelectedFilter(f.id)}
              className={`touch-press px-3 py-1.5 rounded-xl font-bold transition-all shrink-0 ${
                selectedFilter === f.id
                  ? "bg-slate-900 text-white shadow-xs"
                  : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-100"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Orders Scrollable List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 text-xs no-scrollbar">
          {filteredOrders.length === 0 ? (
            <div className="py-16 text-center space-y-2">
              <Utensils className="h-10 w-10 text-slate-300 mx-auto" />
              <p className="font-bold text-slate-700 text-sm">Tidak Ada Pesanan Meja</p>
              <p className="text-xs text-slate-400 max-w-xs mx-auto">
                Saat pelanggan memesan dari QR Meja, pesanan akan muncul langsung di sini.
              </p>
            </div>
          ) : (
            filteredOrders.map((order) => {
              const isPending = order.status === "PENDING";
              const isCooking = order.status === "COOKING" || order.status === "ACCEPTED";
              const isReady = order.status === "READY";
              const isCompleted = order.status === "COMPLETED";

              return (
                <div
                  key={order.id}
                  className={`rounded-2xl border p-4 transition-all space-y-3 ${
                    isPending
                      ? "bg-amber-50/60 border-amber-300 shadow-xs"
                      : isCooking
                      ? "bg-blue-50/50 border-blue-200"
                      : isReady
                      ? "bg-emerald-50/60 border-emerald-300"
                      : "bg-slate-50/70 border-slate-200 opacity-75"
                  }`}
                >
                  {/* Header Card */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-200/80">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-black text-xs px-2 py-0.5 bg-slate-900 text-white rounded-lg">
                        #{order.orderNumber}
                      </span>
                      <span className="font-extrabold text-sm text-slate-900">
                        {order.tableNumber}
                      </span>
                      <span className="text-slate-500 text-xs font-medium">
                        • {order.customerName}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 self-start sm:self-auto">
                      <span
                        className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                          isPending
                            ? "bg-amber-100 text-amber-900 border-amber-300"
                            : isCooking
                            ? "bg-blue-100 text-blue-900 border-blue-300"
                            : isReady
                            ? "bg-emerald-100 text-emerald-900 border-emerald-300"
                            : isCompleted
                            ? "bg-slate-100 text-slate-700 border-slate-200"
                            : "bg-rose-100 text-rose-800 border-rose-200"
                        }`}
                      >
                        {isPending && "⏳ Menunggu Kasir"}
                        {isCooking && "🍳 Sedang Dimasak"}
                        {isReady && "🍽️ Di Meja (Belum Lunas)"}
                        {isCompleted && "✅ Lunas / Selesai"}
                        {order.status === "CANCELLED" && "❌ Dibatalkan"}
                      </span>

                      <span className="text-[10px] text-slate-400">
                        {new Date(order.createdAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                  </div>

                  {/* Items List */}
                  <div className="space-y-1.5">
                    {order.items.map((it, idx) => (
                      <div key={idx} className="flex justify-between items-start text-xs">
                        <div className="leading-tight">
                          <span className="font-bold text-slate-800">
                            {it.quantity}x {it.productName}
                          </span>
                          {it.notes && (
                            <span className="text-[10px] text-amber-800 block italic">
                              ↳ {it.notes}
                            </span>
                          )}
                        </div>
                        <span className="font-bold text-slate-700">
                          {formatRupiah(it.subtotal)}
                        </span>
                      </div>
                    ))}

                    {order.generalNotes && (
                      <p className="text-[11px] text-slate-500 bg-white/80 p-2 rounded-xl border border-slate-200 mt-2">
                        <strong>Catatan:</strong> {order.generalNotes}
                      </p>
                    )}
                  </div>

                  {/* Total & Action Bar */}
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 pt-2 border-t border-slate-200/80">
                    <div className="flex items-center justify-between sm:justify-start gap-3">
                      <span className="text-[11px] text-slate-500">Total Pesanan:</span>
                      <span className="text-sm font-black text-emerald-800">
                        {formatRupiah(order.totalAmount)}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-1.5">
                      {/* Print Kitchen Slip */}
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => handlePrintKitchenTicket(order)}
                        className="touch-press h-8 text-[11px] font-bold border-slate-300 gap-1 px-2.5"
                      >
                        <Printer className="h-3 w-3" />
                        <span>Tiket Dapur</span>
                      </Button>

                      {/* Status Flow Buttons */}
                      {isPending && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => handleUpdateStatus(order.id, "COOKING")}
                          className="touch-press h-8 text-[11px] font-bold border-blue-300 bg-blue-50 text-blue-900 hover:bg-blue-100 gap-1 px-2.5"
                        >
                          <ChefHat className="h-3 w-3 text-blue-600" />
                          <span>Terima & Masak</span>
                        </Button>
                      )}

                      {isCooking && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => handleUpdateStatus(order.id, "READY")}
                          className="touch-press h-8 text-[11px] font-bold border-emerald-300 bg-emerald-50 text-emerald-900 hover:bg-emerald-100 gap-1 px-2.5"
                        >
                          <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                          <span>Siap Disajikan</span>
                        </Button>
                      )}

                      {/* Main Load to POS Cart Button */}
                      {!isCompleted && order.status !== "CANCELLED" && (
                        <Button
                          type="button"
                          size="sm"
                          onClick={() => {
                            onLoadOrderToCart(order);
                            onClose();
                          }}
                          className="touch-press h-8 text-[11px] font-black bg-emerald-600 hover:bg-emerald-700 text-white gap-1 px-3 shadow-xs"
                        >
                          <ShoppingCart className="h-3 w-3" />
                          <span>Muat ke Kasir & Bayar</span>
                          <ArrowRight className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
