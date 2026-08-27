"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Banknote,
  QrCode,
  CreditCard,
  UserCheck,
  Plus,
  AlertCircle,
  CheckCircle,
  Loader2,
  Receipt,
  Sparkles,
  Copy,
  Settings,
  ExternalLink,
} from "lucide-react";
import { CartItem, Customer, PaymentMethod, ShopProfile, Transaction } from "@/types";
import { formatRupiah, generateInvoiceNumber } from "@/lib/utils";
import confetti from "canvas-confetti";
import { toast } from "sonner";
import { createCustomer } from "@/services/firestore";

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  subtotal: number;
  discount: number;
  taxRate: number;
  taxAmount: number;
  totalAmount: number;
  customers: Customer[];
  userId: string;
  shopProfile: ShopProfile | null;
  onProcessCheckout: (trxData: Omit<Transaction, "id">) => Promise<Transaction>;
  onSuccess: (completedTrx: Transaction) => void;
}

export function CheckoutModal({
  isOpen,
  onClose,
  cart,
  subtotal,
  discount,
  taxRate,
  taxAmount,
  totalAmount,
  customers,
  userId,
  shopProfile,
  onProcessCheckout,
  onSuccess,
}: CheckoutModalProps) {
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cash");
  const [amountPaidInput, setAmountPaidInput] = useState<string>(totalAmount.toString());
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>("");
  const [newCustomerName, setNewCustomerName] = useState<string>("");
  const [newCustomerPhone, setNewCustomerPhone] = useState<string>("");
  const [isAddingNewCustomer, setIsAddingNewCustomer] = useState<boolean>(false);
  const [notes, setNotes] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen) {
      setAmountPaidInput(totalAmount.toString());
      setPaymentMethod("cash");
      setSelectedCustomerId("");
      setIsAddingNewCustomer(false);
      setNotes("");
    }
  }, [isOpen, totalAmount]);

  const numAmountPaid = Number(amountPaidInput) || 0;
  const changeAmount = paymentMethod === "cash" ? Math.max(0, numAmountPaid - totalAmount) : 0;
  const isCashInsufficient = paymentMethod === "cash" && numAmountPaid < totalAmount;

  // Preset pecahan uang tunai
  const getCashPresets = () => {
    const presets = [totalAmount]; // Uang Pas
    const next10k = Math.ceil(totalAmount / 10000) * 10000;
    const next20k = Math.ceil(totalAmount / 20000) * 20000;
    const next50k = Math.ceil(totalAmount / 50000) * 50000;
    const next100k = Math.ceil(totalAmount / 100000) * 100000;

    if (!presets.includes(next10k) && next10k > totalAmount) presets.push(next10k);
    if (!presets.includes(next20k) && next20k > totalAmount) presets.push(next20k);
    if (!presets.includes(next50k) && next50k > totalAmount) presets.push(next50k);
    if (!presets.includes(next100k) && next100k > totalAmount) presets.push(next100k);

    return presets.slice(0, 4);
  };

  const handleCheckout = async () => {
    if (cart.length === 0) {
      toast.error("Keranjang belanja kosong.");
      return;
    }

    if (paymentMethod === "cash" && numAmountPaid < totalAmount) {
      toast.error("Uang pembayaran kurang dari total belanja!");
      return;
    }

    let customerId = selectedCustomerId;
    let customerName = "";

    if (paymentMethod === "debt" && !customerId && !newCustomerName.trim()) {
      toast.error("Untuk transaksi Kasbon / Piutang, Anda harus memilih atau mengisi nama pelanggan.");
      return;
    }

    try {
      setIsSubmitting(true);

      // Buat pelanggan baru jika user mengisi form pelanggan baru
      if (isAddingNewCustomer && newCustomerName.trim()) {
        const createdCust = await createCustomer(userId, {
          name: newCustomerName.trim(),
          phone: newCustomerPhone.trim(),
          totalDebt: 0,
          totalSpent: 0,
        });
        customerId = createdCust.id;
        customerName = createdCust.name;
      } else if (customerId) {
        const found = customers.find((c) => c.id === customerId);
        if (found) customerName = found.name;
      }

      // Hitung total harga pokok / modal untuk laba kotor
      const totalCost = cart.reduce(
        (acc, item) => acc + (item.product.costPrice || 0) * item.quantity,
        0
      );
      const grossProfit = totalAmount - totalCost;

      const finalAmountPaid = paymentMethod === "cash" ? numAmountPaid : totalAmount;
      const finalChange = paymentMethod === "cash" ? Math.max(0, numAmountPaid - totalAmount) : 0;

      const trxPayload: Omit<Transaction, "id"> = {
        invoiceNumber: generateInvoiceNumber("POS"),
        date: new Date().toISOString(),
        items: cart.map((it) => ({
          productId: it.product.id,
          productName: it.product.name,
          costPrice: it.product.costPrice || 0,
          sellingPrice: it.product.sellingPrice || 0,
          quantity: it.quantity,
          discount: it.discount || 0,
          subtotal: it.subtotal,
          unit: it.product.unit || "Pcs",
          notes: it.notes || "",
        })),
        itemCount: cart.reduce((acc, it) => acc + it.quantity, 0),
        subtotal,
        discount,
        taxRate,
        taxAmount,
        totalAmount,
        totalCost,
        grossProfit,
        paymentMethod,
        amountPaid: finalAmountPaid,
        changeAmount: finalChange,
        customerId: customerId || undefined,
        customerName: customerName || undefined,
        notes: notes || undefined,
        status: paymentMethod === "debt" ? "debt" : "completed",
      };

      const savedTrx = await onProcessCheckout(trxPayload);

      // Trigger Confetti effect
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ["#10b981", "#06b6d4", "#3b82f6", "#f59e0b"],
        });
      } catch (e) {}

      toast.success("Transaksi berhasil diproses!");
      onSuccess(savedTrx);
      onClose();
    } catch (error: any) {
      console.error(error);
      toast.error("Gagal memproses transaksi: " + (error?.message || "Terjadi kesalahan"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl font-bold">
            <Receipt className="h-5 w-5 text-emerald-600" />
            <span>Pembayaran Pesanan</span>
          </DialogTitle>
          <DialogDescription>
            Pilih metode pembayaran dan konfirmasi transaksi.
          </DialogDescription>
        </DialogHeader>

        {/* Ringkasan Biaya */}
        <div className="rounded-2xl bg-emerald-500/10 border border-emerald-500/20 p-4 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-emerald-800 uppercase tracking-wider">
              Total yang Harus Dibayar
            </p>
            <p className="text-2xl font-black text-emerald-950">
              {formatRupiah(totalAmount)}
            </p>
            <p className="text-[11px] text-emerald-700">
              {cart.reduce((a, b) => a + b.quantity, 0)} item dalam keranjang
            </p>
          </div>
          <div className="text-right text-xs text-slate-500 space-y-0.5">
            <p>Subtotal: {formatRupiah(subtotal)}</p>
            {discount > 0 && <p className="text-emerald-600">Diskon: -{formatRupiah(discount)}</p>}
            {taxAmount > 0 && <p>Pajak ({taxRate}%): {formatRupiah(taxAmount)}</p>}
          </div>
        </div>

        {/* Pilihan Metode Pembayaran */}
        <div className="space-y-4">
          <Tabs
            value={paymentMethod}
            onValueChange={(val) => setPaymentMethod(val as PaymentMethod)}
            className="w-full"
          >
            <TabsList className="grid grid-cols-4 w-full h-12 rounded-xl bg-slate-100 p-1">
              <TabsTrigger
                value="cash"
                className="flex items-center gap-1.5 text-xs font-semibold"
              >
                <Banknote className="h-4 w-4 text-emerald-600" />
                <span>Tunai</span>
              </TabsTrigger>
              <TabsTrigger
                value="qris"
                className="flex items-center gap-1.5 text-xs font-semibold"
              >
                <QrCode className="h-4 w-4 text-teal-600" />
                <span>QRIS</span>
              </TabsTrigger>
              <TabsTrigger
                value="transfer"
                className="flex items-center gap-1.5 text-xs font-semibold"
              >
                <CreditCard className="h-4 w-4 text-blue-600" />
                <span>Transfer</span>
              </TabsTrigger>
              <TabsTrigger
                value="debt"
                className="flex items-center gap-1.5 text-xs font-semibold"
              >
                <UserCheck className="h-4 w-4 text-amber-600" />
                <span>Kasbon</span>
              </TabsTrigger>
            </TabsList>

            {/* TAB TUNAI */}
            <TabsContent value="cash" className="space-y-4 pt-2">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                  Jumlah Uang Tunai Diterima (Rp)
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400">
                    Rp
                  </span>
                  <Input
                    type="number"
                    min="0"
                    step="500"
                    value={amountPaidInput}
                    onChange={(e) => setAmountPaidInput(e.target.value)}
                    className="pl-11 text-lg font-bold text-slate-900 h-12"
                    placeholder="0"
                    autoFocus
                  />
                </div>
              </div>

              {/* Preset Tombol Cepat Pecahan Uang */}
              <div>
                <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-1.5">
                  Pilihan Cepat Pecahan Uang:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {getCashPresets().map((presetVal, idx) => (
                    <Button
                      key={idx}
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setAmountPaidInput(presetVal.toString())}
                      className={`text-xs font-semibold h-9 ${
                        numAmountPaid === presetVal
                          ? "border-emerald-600 bg-emerald-50 text-emerald-800"
                          : ""
                      }`}
                    >
                      {presetVal === totalAmount ? "Uang Pas" : formatRupiah(presetVal)}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Kembalian Box */}
              <div
                className={`rounded-xl p-3 flex items-center justify-between border ${
                  isCashInsufficient
                    ? "bg-rose-50 border-rose-200 text-rose-800"
                    : "bg-emerald-50 border-emerald-200 text-emerald-900"
                }`}
              >
                <div className="flex items-center gap-2">
                  {isCashInsufficient ? (
                    <AlertCircle className="h-5 w-5 text-rose-600" />
                  ) : (
                    <CheckCircle className="h-5 w-5 text-emerald-600" />
                  )}
                  <div>
                    <p className="text-xs font-semibold">
                      {isCashInsufficient ? "Uang Masih Kurang" : "Kembalian"}
                    </p>
                    <p className="text-base font-bold">
                      {isCashInsufficient
                        ? `Kurang ${formatRupiah(totalAmount - numAmountPaid)}`
                        : formatRupiah(changeAmount)}
                    </p>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* TAB QRIS */}
            <TabsContent value="qris" className="space-y-4 pt-2 text-center">
              {shopProfile?.qrisImageUrl ? (
                <div className="rounded-2xl border border-teal-200 bg-teal-50/30 p-5 flex flex-col items-center justify-center space-y-3">
                  <div className="relative p-2.5 bg-white rounded-2xl shadow-md border border-slate-200">
                    <img
                      src={shopProfile.qrisImageUrl}
                      alt="QRIS Toko"
                      className="w-48 h-48 sm:w-56 sm:h-56 object-contain rounded-lg bg-white"
                    />
                  </div>

                  <div>
                    <h4 className="font-black text-slate-900 text-base">
                      {shopProfile?.qrisMerchantName || shopProfile?.shopName || "QRIS TOKO"}
                    </h4>
                    {shopProfile?.qrisNmid ? (
                      <p className="text-xs text-slate-500 font-mono mt-0.5">
                        NMID: {shopProfile.qrisNmid}
                      </p>
                    ) : (
                      <p className="text-xs text-slate-500 mt-0.5">
                        A/N {shopProfile?.ownerName || "Merchant UMKM"}
                      </p>
                    )}
                  </div>

                  <div className="rounded-xl bg-white border border-teal-200 px-6 py-2 shadow-sm">
                    <span className="text-[11px] text-slate-500 block">Total Pembayaran:</span>
                    <span className="text-xl font-black text-emerald-700">
                      {formatRupiah(totalAmount)}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-500 max-w-sm">
                    Arahkan pelanggan untuk scan kode QR di atas menggunakan GoPay, OVO, Dana, ShopeePay, BCA, atau Mobile Banking.
                  </p>
                </div>
              ) : (
                <div className="rounded-2xl border-2 border-dashed border-amber-300 bg-amber-50/50 p-6 flex flex-col items-center justify-center text-center space-y-3">
                  <div className="h-16 w-16 rounded-2xl bg-amber-100 flex items-center justify-center text-amber-600 shadow-sm">
                    <QrCode className="h-8 w-8" />
                  </div>

                  <div>
                    <h4 className="font-extrabold text-amber-950 text-base">
                      QRIS Toko Belum Diunggah
                    </h4>
                    <p className="text-xs text-amber-800/90 max-w-sm mt-1 leading-relaxed">
                      Anda belum mengunggah gambar barcode QRIS usaha Anda. Unggah QRIS sekarang agar pelanggan dapat langsung melakukan pembayaran non-tunai di layar kasir.
                    </p>
                  </div>

                  <a
                    href="/settings"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs px-4 py-2.5 shadow-md shadow-amber-600/20 transition-all"
                  >
                    <Settings className="h-4 w-4" />
                    <span>Upload QRIS di Pengaturan Toko</span>
                    <ExternalLink className="h-3.5 w-3.5 opacity-80" />
                  </a>

                  <p className="text-[10px] text-slate-400">
                    *Jika pelanggan sudah scan QRIS pada stiker cetak toko, Anda tetap dapat menekan "Konfirmasi Bayar".
                  </p>
                </div>
              )}
            </TabsContent>

            {/* TAB TRANSFER BANK */}
            <TabsContent value="transfer" className="space-y-3 pt-2">
              {shopProfile?.bankAccountNumber ? (
                <div className="rounded-2xl border border-blue-200 bg-blue-50/60 p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-blue-900 uppercase tracking-wider">
                      Rekening Tujuan Transfer:
                    </span>
                    <span className="text-xs font-black bg-blue-600 text-white px-2 py-0.5 rounded-md">
                      {shopProfile.bankName || "Bank Transfer"}
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-xl bg-white border border-blue-200">
                    <div>
                      <p className="text-[10px] text-slate-400">Nomor Rekening:</p>
                      <p className="text-lg font-black text-slate-900 font-mono">
                        {shopProfile.bankAccountNumber}
                      </p>
                      <p className="text-xs text-slate-600 font-semibold mt-0.5">
                        A/N {shopProfile.bankAccountName || shopProfile.ownerName || shopProfile.shopName}
                      </p>
                    </div>

                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        navigator.clipboard.writeText(shopProfile.bankAccountNumber || "");
                        toast.success("Nomor rekening berhasil disalin!");
                      }}
                      className="gap-1.5 text-xs font-bold border-blue-300 text-blue-800 hover:bg-blue-50"
                    >
                      <Copy className="h-3.5 w-3.5" />
                      <span>Salin</span>
                    </Button>
                  </div>

                  <div className="flex items-center justify-between text-xs text-blue-900 font-bold px-1">
                    <span>Total Nominal Transfer:</span>
                    <span className="text-sm font-black text-blue-950">
                      {formatRupiah(totalAmount)}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-xs space-y-2 text-slate-700">
                  <p className="font-semibold text-slate-900">
                    Rekening Toko Belum Diisi
                  </p>
                  <p className="text-slate-500">
                    Anda dapat menambahkan info nomor rekening bank di menu Pengaturan Toko.
                  </p>
                  <a
                    href="/settings"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-blue-600 font-bold hover:underline text-xs"
                  >
                    <Settings className="h-3.5 w-3.5" />
                    <span>Atur Rekening Bank di Pengaturan</span>
                  </a>
                </div>
              )}

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Catatan Bank / No. Referensi Transfer (Opsional)
                </label>
                <Input
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Contoh: BCA Transfer an Budi - Ref 12345"
                />
              </div>
            </TabsContent>

            {/* TAB KASBON / PIUTANG */}
            <TabsContent value="debt" className="space-y-3 pt-2">
              <div className="rounded-xl border border-amber-200 bg-amber-50/60 p-3 text-xs text-amber-900">
                <p className="font-semibold">Pencatatan Piutang / Kasbon:</p>
                <p>Transaksi ini akan otomatis dicatat sebagai hutang pelanggan dan ditambahkan ke buku piutang usaha.</p>
              </div>

              {!isAddingNewCustomer ? (
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-semibold text-slate-700">
                      Pilih Pelanggan:
                    </label>
                    <button
                      type="button"
                      onClick={() => setIsAddingNewCustomer(true)}
                      className="text-xs font-semibold text-emerald-600 hover:underline flex items-center gap-1"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      <span>Pelanggan Baru</span>
                    </button>
                  </div>

                  <select
                    value={selectedCustomerId}
                    onChange={(e) => setSelectedCustomerId(e.target.value)}
                    className="w-full h-10 rounded-xl border border-slate-200 bg-white text-slate-900 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="">-- Pilih Pelanggan Terdaftar --</option>
                    {customers.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} {c.phone ? `(${c.phone})` : ""} - Hutang: {formatRupiah(c.totalDebt)}
                      </option>
                    ))}
                  </select>
                </div>
              ) : (
                <div className="space-y-2 border border-slate-200 rounded-xl p-3 bg-slate-50">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800">
                      Tambah Data Pelanggan Baru
                    </span>
                    <button
                      type="button"
                      onClick={() => setIsAddingNewCustomer(false)}
                      className="text-xs text-slate-500 hover:underline"
                    >
                      Pilih yang sudah ada
                    </button>
                  </div>
                  <Input
                    placeholder="Nama Pelanggan (Wajib)"
                    value={newCustomerName}
                    onChange={(e) => setNewCustomerName(e.target.value)}
                  />
                  <Input
                    placeholder="No. WhatsApp / HP (Opsional)"
                    value={newCustomerPhone}
                    onChange={(e) => setNewCustomerPhone(e.target.value)}
                  />
                </div>
              )}

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Catatan / Janji Bayar (Opsional)
                </label>
                <Input
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Contoh: Janji bayar tanggal 10 depan"
                />
              </div>
            </TabsContent>
          </Tabs>

          {/* Opsi Pelanggan untuk Non-Debt (Opsional) */}
          {paymentMethod !== "debt" && !isAddingNewCustomer && (
            <div className="pt-2 border-t border-slate-100">
              <label className="text-xs font-medium text-slate-500 block mb-1">
                Catat ke Nama Pelanggan? (Opsional)
              </label>
              <select
                value={selectedCustomerId}
                onChange={(e) => setSelectedCustomerId(e.target.value)}
                className="w-full h-9 rounded-lg border border-slate-200 bg-white px-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="">-- Umum / Tanpa Nama Pelanggan --</option>
                {customers.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} {c.phone ? `(${c.phone})` : ""}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        <DialogFooter className="gap-2 sm:gap-0 mt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Batal
          </Button>

          <Button
            type="button"
            variant="default"
            onClick={handleCheckout}
            disabled={isSubmitting || (paymentMethod === "cash" && isCashInsufficient)}
            className="w-full sm:w-auto h-11 px-6 shadow-emerald-600/25 flex items-center gap-2"
          >
            {isSubmitting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Sparkles className="h-4 w-4" />
            )}
            <span>
              {isSubmitting
                ? "Menyimpan Transaksi..."
                : `Konfirmasi Bayar (${formatRupiah(totalAmount)})`}
            </span>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
