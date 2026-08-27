"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/AuthContext";
import { UserCheck, KeyRound, ShieldCheck, Lock, Unlock, Users, Plus } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface CashierShiftModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CashierShiftModal({ isOpen, onClose }: CashierShiftModalProps) {
  const {
    cashiers,
    activeCashier,
    activeRole,
    loginCashierWithPin,
    switchRoleToOwner,
  } = useAuth();

  const [selectedCashierId, setSelectedCashierId] = useState<string>("");
  const [pinInput, setPinInput] = useState<string>("");
  const [isVerifying, setIsVerifying] = useState(false);
  const router = useRouter();

  const handleKeypadPress = (digit: string) => {
    if (pinInput.length < 6) {
      setPinInput((prev) => prev + digit);
    }
  };

  const handleBackspace = () => {
    setPinInput((prev) => prev.slice(0, -1));
  };

  const handleClear = () => {
    setPinInput("");
  };

  const handleLoginCashier = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!pinInput.trim()) {
      toast.error("Masukkan PIN Kasir!");
      return;
    }

    try {
      setIsVerifying(true);
      const success = await loginCashierWithPin(pinInput.trim(), selectedCashierId || undefined);

      if (success) {
        toast.success(`✨ Berhasil masuk shift kasir!`);
        setPinInput("");
        onClose();
        router.push("/pos");
      } else {
        toast.error("PIN Kasir salah atau akun tidak aktif!");
        setPinInput("");
      }
    } catch (err: any) {
      toast.error("Gagal verifikasi: " + err.message);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleBackToOwner = () => {
    switchRoleToOwner();
    toast.success("Beralih kembali ke Mode Pemilik Toko (Owner).");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-base font-black text-slate-900">
            <UserCheck className="h-5 w-5 text-emerald-600" />
            <span>Ganti Shift Kasir / Kunci Layar</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2 text-xs">
          {/* Current Active Status */}
          <div className="rounded-xl bg-slate-50 border border-slate-200 p-3 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                Status Pengguna Saat Ini:
              </span>
              <p className="text-sm font-extrabold text-slate-900 mt-0.5">
                {activeRole === "cashier" ? `Kasir: ${activeCashier?.name || "Kasir"}` : "Mode Pemilik (Owner Full Access)"}
              </p>
            </div>
            {activeRole === "cashier" ? (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleBackToOwner}
                className="text-[11px] font-bold border-amber-300 bg-amber-50 hover:bg-amber-100 text-amber-900 h-8"
              >
                <Unlock className="h-3 w-3 mr-1 text-amber-600" />
                <span>Mode Owner</span>
              </Button>
            ) : (
              <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full">
                Owner
              </span>
            )}
          </div>

          {/* Select Cashier */}
          <div>
            <label className="font-bold text-slate-700 block mb-1.5">
              Pilih Akun Kasir yang Bertugas:
            </label>
            <select
              value={selectedCashierId}
              onChange={(e) => {
                setSelectedCashierId(e.target.value);
                setPinInput("");
              }}
              className="w-full h-10 rounded-xl border border-slate-200 bg-white text-slate-900 px-3 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 font-semibold"
            >
              <option value="">-- Semua Kasir (Cek Berdasarkan PIN) --</option>
              {cashiers
                .filter((c) => c.isActive)
                .map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.role === "supervisor" ? "Supervisor" : "Kasir"})
                  </option>
                ))}
            </select>
          </div>

          {/* PIN Input Display */}
          <div>
            <label className="font-bold text-slate-700 block mb-1.5 text-center">
              Masukkan PIN Kasir (4 - 6 Digit):
            </label>
            <div className="flex justify-center mb-3">
              <Input
                type="password"
                maxLength={6}
                readOnly
                value={pinInput}
                placeholder="• • • •"
                className="w-48 text-center text-2xl tracking-[0.5em] font-black h-12 bg-slate-50 border-emerald-300"
              />
            </div>

            {/* Quick Keypad */}
            <div className="grid grid-cols-3 gap-2 max-w-[240px] mx-auto">
              {["1", "2", "3", "4", "5", "6", "7", "8", "9"].map((num) => (
                <Button
                  key={num}
                  type="button"
                  variant="outline"
                  onClick={() => handleKeypadPress(num)}
                  className="h-11 text-base font-bold rounded-xl hover:bg-emerald-50 hover:text-emerald-800 border-slate-200"
                >
                  {num}
                </Button>
              ))}
              <Button
                type="button"
                variant="ghost"
                onClick={handleClear}
                className="h-11 text-xs font-bold text-slate-400 hover:text-slate-700"
              >
                Clear
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => handleKeypadPress("0")}
                className="h-11 text-base font-bold rounded-xl hover:bg-emerald-50 hover:text-emerald-800 border-slate-200"
              >
                0
              </Button>
              <Button
                type="button"
                variant="ghost"
                onClick={handleBackspace}
                className="h-11 text-xs font-bold text-rose-500 hover:text-rose-700"
              >
                ⌫
              </Button>
            </div>
          </div>

          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
            >
              Batal
            </Button>
            <Button
              type="button"
              onClick={() => handleLoginCashier()}
              disabled={isVerifying || pinInput.length < 4}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-md shadow-emerald-600/20"
            >
              {isVerifying ? "Memverifikasi..." : "Mulai Shift Kasir"}
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
