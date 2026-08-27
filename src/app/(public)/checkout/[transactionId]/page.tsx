"use client";

import React, { useEffect, useState, use } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { activateProSubscription } from "@/services/firestore";
import { SUBSCRIPTION_PLANS } from "@/data/subscriptionPlans";
import { Button } from "@/components/ui/button";
import {
  CheckCircle2,
  Crown,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Store,
  Loader2,
} from "lucide-react";
import confetti from "canvas-confetti";
import { toast } from "sonner";

export default function CheckoutReturnPage({
  params,
}: {
  params: Promise<{ transactionId: string }>;
}) {
  const resolvedParams = use(params);
  const transactionId = resolvedParams.transactionId;
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, refreshSubscription } = useAuth();
  const [isActivating, setIsActivating] = useState(true);

  useEffect(() => {
    async function handleActivation() {
      if (!user) return;

      try {
        // Fire celebration confetti!
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 },
          colors: ["#059669", "#10b981", "#34d399", "#f59e0b"],
        });

        // Activate yearly or monthly subscription for user
        await activateProSubscription(user.uid, "yearly", transactionId, 299000);
        await refreshSubscription();
        toast.success("Selamat! Akun POS UMKM PRO Anda telah aktif.");
      } catch (err) {
        console.error("Activation error:", err);
      } finally {
        setIsActivating(false);
      }
    }

    handleActivation();
  }, [user, transactionId]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-900 p-4 text-white">
      <div className="max-w-md w-full rounded-3xl bg-slate-950 border border-slate-800 p-6 sm:p-8 text-center space-y-6 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 h-48 w-48 rounded-full bg-emerald-500/20 blur-3xl pointer-events-none" />

        {/* Success Icon */}
        <div className="flex justify-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-slate-950 font-black shadow-lg shadow-emerald-500/25">
            <Crown className="h-10 w-10" />
          </div>
        </div>

        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/20 border border-emerald-500/30 px-3 py-1 text-xs font-bold text-emerald-400">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Pembayaran Berhasil Diverifikasi</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Selamat Datang di POS UMKM PRO!
          </h1>

          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
            Terima kasih telah mempercayai POS UMKM. Seluruh fitur kasir tanpa batas, HPP big data, dan laporan keuangan telah aktif sepenuhnya.
          </p>
        </div>

        <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800 text-xs text-left space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span>ID Transaksi:</span>
            <span className="font-mono text-slate-200">{transactionId}</span>
          </div>
          <div className="flex items-center justify-between text-slate-400">
            <span>Status Langganan:</span>
            <span className="font-bold text-emerald-400 flex items-center gap-1">
              <CheckCircle2 className="h-3.5 w-3.5" />
              <span>PRO Aktif (1 Tahun)</span>
            </span>
          </div>
        </div>

        <Button
          onClick={() => router.push("/dashboard")}
          className="touch-press w-full h-12 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black text-sm gap-2 shadow-lg shadow-emerald-500/20"
        >
          <span>Masuk ke Dashboard Toko</span>
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
