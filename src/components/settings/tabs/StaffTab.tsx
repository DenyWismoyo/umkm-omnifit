"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Users, Plus, Copy, RefreshCw, Building2, Eye, EyeOff, Trash2, Check } from "lucide-react";
import { Cashier, UserRole } from "@/types";

interface StaffTabProps {
  cashiers: Cashier[];
  shopProfile: any;
  handleCopyStoreCode: () => void;
  isCopiedCode: boolean;
  showCustomCodeInput: boolean;
  setShowCustomCodeInput: React.Dispatch<React.SetStateAction<boolean>>;
  customStoreCode: string;
  setCustomStoreCode: React.Dispatch<React.SetStateAction<string>>;
  isGeneratingCode: boolean;
  handleGenerateStoreCode: (custom?: string) => Promise<void>;
  newCashierName: string;
  setNewCashierName: React.Dispatch<React.SetStateAction<string>>;
  newCashierPin: string;
  setNewCashierPin: React.Dispatch<React.SetStateAction<string>>;
  newCashierRole: UserRole;
  setNewCashierRole: React.Dispatch<React.SetStateAction<UserRole>>;
  handleAddCashier: (e: React.FormEvent) => Promise<void>;
  isAddingCashier: boolean;
  showPins: Record<string, boolean>;
  toggleShowPin: (id: string) => void;
  handleDeleteCashier: (id: string, name: string) => Promise<void>;
}

export function StaffTab({
  cashiers,
  shopProfile,
  handleCopyStoreCode,
  isCopiedCode,
  showCustomCodeInput,
  setShowCustomCodeInput,
  customStoreCode,
  setCustomStoreCode,
  isGeneratingCode,
  handleGenerateStoreCode,
  newCashierName,
  setNewCashierName,
  newCashierPin,
  setNewCashierPin,
  newCashierRole,
  setNewCashierRole,
  handleAddCashier,
  isAddingCashier,
  showPins,
  toggleShowPin,
  handleDeleteCashier,
}: StaffTabProps) {
  return (
    <div className="animate-in fade-in duration-200 space-y-6">
      <Card className="border-emerald-200 shadow-sm">
        <CardHeader className="pb-4 border-b border-emerald-100/80">
          <CardTitle className="text-base flex items-center justify-between">
            <div className="flex items-center gap-2 text-emerald-950 font-black">
              <Users className="h-5 w-5 text-emerald-600" />
              <span>Manajemen Akun Kasir & PIN Karyawan</span>
            </div>
            <span className="text-[11px] font-bold bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full">
              {cashiers.length} Akun Kasir
            </span>
          </CardTitle>
          <CardDescription className="text-xs text-slate-600">
            Buat PIN untuk kasir atau staf jaga toko. Kasir hanya dapat mengakses Mesin Kasir POS tanpa melihat menu sensitif Laporan Laba Rugi, HPP, atau Pengeluaran Toko.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-5 pt-4 text-xs">
          <div className="rounded-2xl border-2 border-emerald-200 bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 p-4 space-y-3 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-700 block">
                  KODE AKSES TOKO UNTUK LOGIN KASIR:
                </span>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-2xl sm:text-3xl font-black font-mono tracking-widest text-slate-950 bg-white px-3 py-1 rounded-xl border border-emerald-300 shadow-xs">
                    {shopProfile?.storeCode || "MEMUAT..."}
                  </span>
                  <Button
                    type="button"
                    size="sm"
                    onClick={handleCopyStoreCode}
                    className="h-10 bg-emerald-600 hover:bg-emerald-700 text-white font-bold gap-1.5 text-xs shadow-sm"
                  >
                    {isCopiedCode ? (
                      <>
                        <Check className="h-4 w-4" />
                        <span>Tersalin!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4" />
                        <span>Salin Kode</span>
                      </>
                    )}
                  </Button>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {showCustomCodeInput ? (
                  <div className="flex items-center gap-2">
                    <Input
                      type="text"
                      value={customStoreCode}
                      onChange={(e) => setCustomStoreCode(e.target.value.toUpperCase())}
                      placeholder="KODE-KUSTOM"
                      className="h-9 w-36 uppercase font-mono font-bold bg-white text-xs"
                    />
                    <Button
                      type="button"
                      size="sm"
                      disabled={isGeneratingCode || !customStoreCode.trim()}
                      onClick={() => handleGenerateStoreCode(customStoreCode)}
                      className="h-9 bg-emerald-700 text-white font-bold text-xs"
                    >
                      Simpan
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowCustomCodeInput(false)}
                      className="h-9 text-xs text-slate-500"
                    >
                      Batal
                    </Button>
                  </div>
                ) : (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handleGenerateStoreCode()}
                    disabled={isGeneratingCode}
                    className="h-9 border-emerald-300 bg-white hover:bg-emerald-50 text-emerald-900 font-semibold text-xs gap-1.5"
                  >
                    <RefreshCw className={`h-3.5 w-3.5 text-emerald-600 ${isGeneratingCode ? "animate-spin" : ""}`} />
                    <span>Acak Kode Baru</span>
                  </Button>
                )}
              </div>
            </div>

            <div className="border-t border-emerald-200/80 pt-2 text-[11px] text-slate-600 flex items-start gap-2">
              <Building2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
              <p>
                <strong>Cara Kasir Masuk:</strong> Kasir di HP/komputer kasir cukup membuka menu Login ➡️ Pilih tab <strong>&quot;Login Kasir&quot;</strong> ➡️ Masukkan <strong>Kode Toko di atas</strong> dan <strong>PIN Kasir</strong> masing-masing. Kasir tidak perlu login dengan akun Google/email Anda!
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 space-y-3">
            <h4 className="font-extrabold text-slate-900 text-xs flex items-center gap-1.5">
              <Plus className="h-4 w-4 text-emerald-600" />
              <span>Tambah Akun Kasir Baru:</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div className="sm:col-span-2">
                <label className="font-semibold text-slate-700 block mb-1">
                  Nama Kasir / Staff
                </label>
                <Input
                  value={newCashierName}
                  onChange={(e) => setNewCashierName(e.target.value)}
                  placeholder="Contoh: Kasir Siti / Shift Pagi"
                  className="bg-white text-xs h-9"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  PIN Kasir (4-6 Digit)
                </label>
                <Input
                  type="password"
                  maxLength={6}
                  value={newCashierPin}
                  onChange={(e) => setNewCashierPin(e.target.value)}
                  placeholder="Contoh: 1234"
                  className="bg-white text-xs h-9 tracking-widest font-mono font-bold"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Hak Akses / Role
                </label>
                <select
                  value={newCashierRole}
                  onChange={(e) => setNewCashierRole(e.target.value as UserRole)}
                  className="w-full h-9 rounded-xl border border-slate-200 bg-white text-slate-900 px-3 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                >
                  <option value="cashier">Kasir (Hanya POS)</option>
                  <option value="supervisor">Supervisor (POS + Stok)</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end pt-1">
              <Button
                type="button"
                onClick={handleAddCashier}
                disabled={isAddingCashier || !newCashierName.trim() || newCashierPin.length < 4}
                size="sm"
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold h-8 text-xs gap-1.5"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>{isAddingCashier ? "Menambahkan..." : "Tambah Kasir"}</span>
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <p className="font-bold text-slate-700 text-xs">
              Daftar Akun Kasir Terdaftar:
            </p>

            {cashiers.length === 0 ? (
              <p className="text-slate-400 py-3 text-center">
                Belum ada kasir tambahan terdaftar.
              </p>
            ) : (
              <div className="divide-y divide-slate-100 rounded-2xl border border-slate-200 bg-white overflow-hidden">
                {cashiers.map((c) => {
                  const isPinVisible = showPins[c.id];
                  return (
                    <div
                      key={c.id}
                      className="flex items-center justify-between p-3 text-xs hover:bg-slate-50/70 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-black text-xs">
                          {c.name.slice(0, 1).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-extrabold text-slate-900 text-xs">
                            {c.name}
                          </p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md font-semibold uppercase">
                              {c.role === "supervisor" ? "Supervisor" : "Kasir"}
                            </span>
                            <span className="text-[10px] text-slate-400">
                              PIN:{" "}
                              <strong className="font-mono text-slate-700">
                                {isPinVisible ? c.pin : "••••"}
                              </strong>
                            </span>
                            <button
                              type="button"
                              onClick={() => toggleShowPin(c.id)}
                              className="text-slate-400 hover:text-slate-600 p-0.5"
                              title={isPinVisible ? "Sembunyikan PIN" : "Lihat PIN"}
                            >
                              {isPinVisible ? (
                                <EyeOff className="h-3 w-3" />
                              ) : (
                                <Eye className="h-3 w-3" />
                              )}
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteCashier(c.id, c.name)}
                          className="text-rose-600 hover:bg-rose-50 h-7 px-2 text-xs"
                        >
                          <Trash2 className="h-3.5 w-3.5 mr-1" />
                          <span>Hapus</span>
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
