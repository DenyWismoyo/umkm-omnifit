"use client";

import React, { useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { QrCode, CreditCard, Upload, Trash2, CheckCircle, AlertCircle } from "lucide-react";

interface PaymentTabProps {
  formData: any;
  setFormData: React.Dispatch<React.SetStateAction<any>>;
  handleQrisFileChange: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
  handleRemoveQris: () => void;
  isUploadingQris: boolean;
}

export function PaymentTab({
  formData,
  setFormData,
  handleQrisFileChange,
  handleRemoveQris,
  isUploadingQris,
}: PaymentTabProps) {
  const qrisFileInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="animate-in fade-in duration-200 space-y-6">
      <Card className="border-teal-200 bg-gradient-to-br from-teal-50/30 to-emerald-50/20 shadow-sm">
        <CardHeader className="pb-4 border-b border-teal-100/80">
          <CardTitle className="text-base flex items-center justify-between">
            <div className="flex items-center gap-2 text-teal-950 font-black">
              <QrCode className="h-5 w-5 text-teal-600" />
              <span>Pengaturan QRIS Toko (Pembayaran Non-Tunai)</span>
            </div>
            {formData.qrisImageUrl ? (
              <span className="text-[11px] font-bold bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <CheckCircle className="h-3 w-3 text-emerald-600" />
                QRIS Aktif
              </span>
            ) : (
              <span className="text-[11px] font-bold bg-amber-100 text-amber-800 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <AlertCircle className="h-3 w-3 text-amber-600" />
                Belum Upload
              </span>
            )}
          </CardTitle>
          <CardDescription className="text-xs text-slate-600">
            Unggah gambar QRIS statis toko Anda (dari BCA, GoPay Merchant, DANA Bisnis, OVO, ShopeePay, BRI, dll). Gambar ini akan otomatis muncul di layar kasir POS saat pelanggan memilih bayar QRIS.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4 pt-4 text-xs">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
            <div className="flex flex-col items-center justify-center p-4 rounded-2xl bg-white border border-slate-200 shadow-sm text-center">
              {formData.qrisImageUrl ? (
                <div className="space-y-3">
                  <div className="relative p-2 bg-slate-900 rounded-xl shadow-md border border-slate-800 max-w-[180px] mx-auto">
                    <img
                      src={formData.qrisImageUrl}
                      alt="QRIS Toko Preview"
                      className="w-40 h-40 object-contain rounded bg-white"
                    />
                  </div>
                  <div>
                    <p className="font-extrabold text-slate-900 text-xs">
                      {formData.qrisMerchantName || formData.shopName || "QRIS Toko"}
                    </p>
                    {formData.qrisNmid && (
                      <p className="text-[10px] text-slate-400 font-mono">
                        NMID: {formData.qrisNmid}
                      </p>
                    )}
                  </div>
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={handleRemoveQris}
                    className="gap-1 text-[11px] h-7 px-2.5"
                  >
                    <Trash2 className="h-3 w-3" />
                    <span>Hapus QRIS</span>
                  </Button>
                </div>
              ) : (
                <div className="py-6 px-4 space-y-3">
                  <div className="h-24 w-24 rounded-2xl bg-slate-100 border-2 border-dashed border-slate-300 flex flex-col items-center justify-center mx-auto text-slate-400">
                    <QrCode className="h-10 w-10 text-slate-300 mb-1" />
                    <span className="text-[10px] font-semibold">Belum ada foto</span>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-tight">
                    Upload QR Code barcode QRIS toko Anda agar kasir dapat menampilkan scan bayar.
                  </p>
                </div>
              )}
            </div>

            <div className="md:col-span-2 space-y-4">
              <div>
                <label className="font-bold text-slate-800 block mb-1">
                  Unggah File Gambar QRIS (PNG / JPG / WebP)
                </label>
                <input
                  type="file"
                  ref={qrisFileInputRef}
                  accept="image/*"
                  onChange={handleQrisFileChange}
                  className="hidden"
                />
                <div className="flex gap-2 items-center">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => qrisFileInputRef.current?.click()}
                    disabled={isUploadingQris}
                    className="gap-2 text-xs font-bold border-teal-300 bg-teal-50/50 hover:bg-teal-100 text-teal-900 h-10"
                  >
                    <Upload className="h-4 w-4 text-teal-600" />
                    <span>{isUploadingQris ? "Mengunggah..." : "Pilih File Gambar QRIS"}</span>
                  </Button>
                  {formData.qrisImageUrl && (
                    <span className="text-[11px] text-emerald-700 font-semibold">
                      ✓ Gambar terpilih
                    </span>
                  )}
                </div>
                <p className="text-[10px] text-slate-400 mt-1">
                  Tips: Ambil tangkapan layar (screenshot) kode QRIS dari aplikasi merchant Anda, lalu upload di sini.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    Nama Merchant QRIS
                  </label>
                  <Input
                    value={formData.qrisMerchantName}
                    onChange={(e) =>
                      setFormData({ ...formData, qrisMerchantName: e.target.value })
                    }
                    placeholder={formData.shopName || "Contoh: KOPI SENJA STORE"}
                  />
                  <span className="text-[10px] text-slate-400 mt-0.5 block">
                    Nama pemilik / usaha yang terdaftar di QRIS.
                  </span>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    Nomor NMID QRIS (Opsional)
                  </label>
                  <Input
                    value={formData.qrisNmid}
                    onChange={(e) =>
                      setFormData({ ...formData, qrisNmid: e.target.value })
                    }
                    placeholder="Contoh: ID1020304050"
                  />
                  <span className="text-[10px] text-slate-400 mt-0.5 block">
                    Nomor identitas National Merchant ID.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-4 border-b border-slate-100">
          <CardTitle className="text-base flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-blue-600" />
            <span>Rekening Bank Toko (Metode Transfer)</span>
          </CardTitle>
          <CardDescription className="text-xs">
            Informasi rekening ini akan ditampilkan pada layar kasir POS ketika kasir memilih metode pembayaran Transfer Bank.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4 pt-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                Nama Bank / E-Wallet
              </label>
              <select
                value={formData.bankName}
                onChange={(e) =>
                  setFormData({ ...formData, bankName: e.target.value })
                }
                className="w-full h-10 rounded-xl border border-slate-200 bg-white text-slate-900 px-3 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="BCA">Bank BCA</option>
                <option value="BRI">Bank BRI</option>
                <option value="Mandiri">Bank Mandiri</option>
                <option value="BNI">Bank BNI</option>
                <option value="BSI">Bank Syariah Indonesia (BSI)</option>
                <option value="CIMB Niaga">Bank CIMB Niaga</option>
                <option value="Permata">Bank Permata</option>
                <option value="Seabank">SeaBank</option>
                <option value="Bank Jago">Bank Jago</option>
                <option value="DANA">DANA Bisnis</option>
                <option value="GoPay">GoPay</option>
                <option value="OVO">OVO</option>
                <option value="Lainnya">Lain-lain</option>
              </select>
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                Nomor Rekening / No. HP E-Wallet
              </label>
              <Input
                value={formData.bankAccountNumber}
                onChange={(e) =>
                  setFormData({ ...formData, bankAccountNumber: e.target.value })
                }
                placeholder="Contoh: 1234567890"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                Atas Nama Rekening (A/N)
              </label>
              <Input
                value={formData.bankAccountName}
                onChange={(e) =>
                  setFormData({ ...formData, bankAccountName: e.target.value })
                }
                placeholder="Contoh: Budi Santoso"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
