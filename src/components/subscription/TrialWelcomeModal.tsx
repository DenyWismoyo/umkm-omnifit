"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Calculator,
  ShoppingCart,
  Sparkles,
  CheckCircle2,
  Clock,
  ArrowRight,
  ChefHat,
  X,
} from "lucide-react";
import confetti from "canvas-confetti";

export function TrialWelcomeModal() {
  const { user, isTrialActive, trialDaysLeft, activeRole } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!user || !isTrialActive || activeRole === "cashier") return;

    // Check if user has already seen this trial welcome onboarding
    const seenKey = `pos_trial_welcome_seen_${user.uid}`;
    const hasSeen = localStorage.getItem(seenKey);

    if (!hasSeen) {
      // Delay slightly for smooth page render
      const timer = setTimeout(() => {
        setIsOpen(true);
        // Trigger celebratory confetti
        try {
          confetti({
            particleCount: 50,
            spread: 60,
            origin: { y: 0.6 },
          });
        } catch {
          // ignore if canvas-confetti fails
        }
      }, 600);

      return () => clearTimeout(timer);
    }
  }, [user, isTrialActive, activeRole]);

  const handleDismiss = () => {
    if (user) {
      localStorage.setItem(`pos_trial_welcome_seen_${user.uid}`, "true");
    }
    setIsOpen(false);
  };

  const handleGoToHpp = () => {
    handleDismiss();
    router.push("/hpp");
  };

  const handleGoToPos = () => {
    handleDismiss();
    router.push("/pos");
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-lg sm:rounded-3xl p-0 overflow-hidden border-0 sm:border border-slate-200/80 shadow-2xl bg-white flex flex-col">
        {/* Header with gradient and celebration */}
        <div className="bg-gradient-to-br from-emerald-950 via-slate-900 to-teal-950 p-6 text-white relative overflow-hidden shrink-0">
          <div className="absolute top-0 right-0 -mt-8 -mr-8 h-36 w-36 rounded-full bg-emerald-500/20 blur-2xl pointer-events-none" />

          <button
            type="button"
            onClick={handleDismiss}
            className="touch-press absolute top-4 right-4 h-8 w-8 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 z-20"
          >
            <X className="h-4 w-4" />
          </button>

          <div className="relative z-10 space-y-2">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-400/20 border border-amber-400/40 px-3 py-0.5 text-[11px] font-black text-amber-300">
              <Sparkles className="h-3.5 w-3.5" />
              <span>TRIAL AKTIF: {trialDaysLeft} HARI GRATIS</span>
            </div>

            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight leading-tight">
              Selamat Datang! <br />
              Akses Trial Anda Siap Digunakan 🎉
            </h2>

            <p className="text-xs text-emerald-100/80 leading-relaxed">
              Kami tidak langsung meminta Anda berlangganan. Silakan coba dan buktikan kemudahan aplikasi POS UMKM selama 30 hari ke depan!
            </p>
          </div>
        </div>

        {/* Content Highlights */}
        <div className="p-6 space-y-4 text-xs">
          <div className="rounded-2xl border border-emerald-200/80 bg-emerald-50/60 p-4 space-y-3">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                <ChefHat className="h-4 w-4" />
              </div>
              <div>
                <h4 className="font-extrabold text-xs text-slate-900">
                  Termasuk Kalkulator HPP Cerdas (111+ Resep)
                </h4>
                <p className="text-[11px] text-slate-600">
                  Hitung biaya modal bahan, porsi, kemasan, gas/listrik, dan tentukan harga jual ideal.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-emerald-200/60 text-[11px] text-slate-700">
              <div className="flex items-center gap-1.5 font-medium">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                <span>Mesin Kasir POS Unlimited</span>
              </div>
              <div className="flex items-center gap-1.5 font-medium">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                <span>Katalog Produk & Stok Fisik</span>
              </div>
              <div className="flex items-center gap-1.5 font-medium">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                <span>Cetak Struk Bluetooth & QRIS</span>
              </div>
              <div className="flex items-center gap-1.5 font-medium">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                <span>Cloud Backup Firebase Aman</span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-black uppercase tracking-wider text-slate-400 block px-0.5">
              Mulai Eksplorasi:
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={handleGoToHpp}
                className="touch-press flex items-center justify-between p-3.5 rounded-2xl border border-amber-300/80 bg-gradient-to-br from-amber-50 to-orange-50/50 hover:bg-amber-100/60 text-left transition-all group cursor-pointer shadow-2xs"
              >
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-xs">
                    <Calculator className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="font-extrabold text-xs text-slate-900 block group-hover:text-amber-950">
                      Hitung HPP Resep
                    </span>
                    <span className="text-[10px] text-slate-500">
                      Cari dari 111+ resep UMKM
                    </span>
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 text-amber-600 group-hover:translate-x-0.5 transition-transform" />
              </button>

              <button
                type="button"
                onClick={handleGoToPos}
                className="touch-press flex items-center justify-between p-3.5 rounded-2xl border border-emerald-300/80 bg-gradient-to-br from-emerald-50 to-teal-50/50 hover:bg-emerald-100/60 text-left transition-all group cursor-pointer shadow-2xs"
              >
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                    <ShoppingCart className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="font-extrabold text-xs text-slate-900 block group-hover:text-emerald-950">
                      Buka Mesin Kasir
                    </span>
                    <span className="text-[10px] text-slate-500">
                      Mulai catat transaksi POS
                    </span>
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 text-emerald-600 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/80 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
            <Clock className="h-3.5 w-3.5 text-amber-500" />
            <span>Aktif hingga {trialDaysLeft || 30} hari ke depan</span>
          </div>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleDismiss}
            className="text-xs font-bold text-slate-600 hover:text-slate-900 h-8"
          >
            Masuk ke Dashboard
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
