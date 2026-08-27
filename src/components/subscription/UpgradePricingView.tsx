"use client";

import React, { useState, useMemo } from "react";
import { useAuth } from "@/context/AuthContext";
import {
  INDUSTRY_METADATA,
  INDUSTRY_PRICING_PLANS,
  DetailedPricingPlan,
} from "@/data/subscriptionPlans";
import { IndustryPack, SubscriptionTier } from "@/types";
import { formatRupiah } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  CheckCircle2,
  Sparkles,
  Lock,
  ArrowRight,
  ShieldCheck,
  Loader2,
  QrCode,
  Crown,
  Clock,
  Zap,
} from "lucide-react";
import { toast } from "sonner";

interface UpgradePricingViewProps {
  /** Industri yang sedang aktif — dari AuthContext, diteruskan dari parent */
  industry: IndustryPack;
  /** Nama fitur yang sedang terkunci (opsional, ditampilkan di banner) */
  highlightFeature?: string;
  /** Callback setelah payment berhasil diinisiasi */
  onPaymentStart?: () => void;
}

export function UpgradePricingView({
  industry,
  highlightFeature,
  onPaymentStart,
}: UpgradePricingViewProps) {
  const { user, shopProfile, isTrialActive, trialDaysLeft } = useAuth();

  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("yearly");
  const [selectedTier, setSelectedTier] = useState<SubscriptionTier>("pro");
  const [isProcessing, setIsProcessing] = useState(false);
  const [qrisUrl, setQrisUrl] = useState<string | null>(null);

  const meta = INDUSTRY_METADATA[industry] || INDUSTRY_METADATA.fnb;

  // Resolve plans for active industry
  const basicPlan = useMemo(() => {
    return INDUSTRY_PRICING_PLANS.find(
      (p) => p.industry === industry && p.tier === "basic" && p.billingCycle === billingCycle
    );
  }, [industry, billingCycle]);

  const proPlan = useMemo(() => {
    return INDUSTRY_PRICING_PLANS.find(
      (p) => p.industry === industry && p.tier === "pro" && p.billingCycle === billingCycle
    );
  }, [industry, billingCycle]);

  const selectedPlan: DetailedPricingPlan | undefined = useMemo(() => {
    return INDUSTRY_PRICING_PLANS.find(
      (p) => p.industry === industry && p.tier === selectedTier && p.billingCycle === billingCycle
    );
  }, [industry, selectedTier, billingCycle]);

  const handleCheckoutMayar = async () => {
    if (!user || !selectedPlan) {
      toast.error("Silakan login terlebih dahulu.");
      return;
    }

    try {
      setIsProcessing(true);
      onPaymentStart?.();
      toast.loading("Menyiapkan invoice pembayaran Mayar...", { id: "mayar-checkout" });

      const txId = `TX-${selectedPlan.id.toUpperCase()}-${Date.now()}`;

      const res = await fetch("/api/payment/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          planId: selectedPlan.id,
          planName: `${selectedPlan.name} — ${meta.name}`,
          amount: selectedPlan.price,
          userEmail: user.email || shopProfile?.email || "owner@posumkm.id",
          userName: shopProfile?.ownerName || user.displayName || "Pemilik Toko",
          userId: user.uid,
          transactionId: txId,
        }),
      });

      const data = await res.json();
      if (!res.ok || data.error) {
        throw new Error(data.error || "Gagal membuat invoice Mayar.");
      }

      toast.success("Membuka halaman pembayaran Mayar...", { id: "mayar-checkout" });
      if (data.paymentLink) {
        window.location.href = data.paymentLink;
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Gagal memproses pembayaran.";
      toast.error(msg, { id: "mayar-checkout" });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleGenerateQris = async () => {
    if (!user || !selectedPlan) {
      toast.error("Silakan login terlebih dahulu.");
      return;
    }
    try {
      setIsProcessing(true);
      toast.loading("Membuat QRIS Dinamis...", { id: "mayar-qris" });

      const txId = `QRIS-${selectedPlan.id.toUpperCase()}-${Date.now()}`;

      const res = await fetch("/api/payment/qris", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          transactionId: txId,
          amount: selectedPlan.price,
          userEmail: user.email || shopProfile?.email || "owner@posumkm.id",
          userName: shopProfile?.ownerName || user.displayName || "Pemilik Toko",
        }),
      });

      const data = await res.json();
      if (!res.ok || data.error) {
        throw new Error(data.error || "Gagal membuat QRIS.");
      }

      if (data.qrUrl) {
        setQrisUrl(data.qrUrl);
        toast.success("QRIS Berhasil dibuat! Silakan scan.", { id: "mayar-qris" });
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Gagal membuat QRIS.";
      toast.error(msg, { id: "mayar-qris" });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-5">
      {/* Industry Identity Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900 p-4 sm:p-5 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-6 -mr-6 h-32 w-32 rounded-full bg-emerald-500/10 blur-2xl pointer-events-none" />
        <div className="relative z-10 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="text-4xl leading-none">{meta.icon}</div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400">
                  Paket {meta.shortName}
                </span>
                {isTrialActive && (
                  <span className="inline-flex items-center gap-1 bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-bold px-2 py-0.5 rounded-full">
                    <Clock className="h-3 w-3" />
                    Trial: {trialDaysLeft} Hari Lagi
                  </span>
                )}
              </div>
              <h2 className="text-base sm:text-lg font-black text-white leading-tight">
                Upgrade ke PRO — {meta.name}
              </h2>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Dirancang untuk: {meta.targetBusiness}
              </p>
            </div>
          </div>
          <Crown className="h-8 w-8 text-amber-400 shrink-0" />
        </div>
      </div>

      {/* Feature Lock Banner (if highlightFeature is given) */}
      {highlightFeature && (
        <div className="rounded-2xl border border-amber-300/80 bg-amber-50/80 p-3.5 flex items-center gap-3 shadow-2xs animate-in fade-in">
          <div className="h-9 w-9 rounded-xl bg-amber-500/20 flex items-center justify-center shrink-0">
            <Lock className="h-4 w-4 text-amber-700" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-wider bg-amber-200 text-amber-900 px-2 py-0.5 rounded-full">
                Fitur PRO
              </span>
            </div>
            <p className="text-xs font-bold text-slate-800 mt-0.5">
              Buka Akses &ldquo;{highlightFeature}&rdquo;
            </p>
          </div>
        </div>
      )}

      {/* Billing Cycle Toggle */}
      <div className="flex items-center justify-between bg-slate-100/80 p-1.5 rounded-2xl border border-slate-200/60">
        <span className="text-[11px] font-extrabold text-slate-700 px-2">
          Siklus Pembayaran:
        </span>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => { setBillingCycle("monthly"); setQrisUrl(null); }}
            className={`touch-press px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              billingCycle === "monthly"
                ? "bg-white text-slate-900 shadow-xs"
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            Bulanan
          </button>
          <button
            type="button"
            onClick={() => { setBillingCycle("yearly"); setQrisUrl(null); }}
            className={`touch-press px-3 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 ${
              billingCycle === "yearly"
                ? "bg-emerald-600 text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <span>Tahunan</span>
            <span className="bg-emerald-200 text-emerald-950 text-[9px] px-1.5 py-0.5 rounded-md">
              Hemat ~47%
            </span>
          </button>
        </div>
      </div>

      {/* Tier Cards: Basic vs Pro */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* BASIC CARD */}
        {basicPlan && (
          <div
            onClick={() => { setSelectedTier("basic"); setQrisUrl(null); }}
            className={`relative p-4 rounded-2xl border transition-all cursor-pointer flex flex-col ${
              selectedTier === "basic"
                ? "bg-emerald-50/60 border-emerald-500 ring-2 ring-emerald-500/20 shadow-sm"
                : "bg-slate-50/70 border-slate-200 hover:bg-slate-50 hover:border-slate-300"
            }`}
          >
            {basicPlan.badge && (
              <span className={`absolute -top-2.5 left-3 text-[9px] font-black px-2 py-0.5 rounded-full shadow-2xs border ${basicPlan.badgeColor || "bg-slate-200 text-slate-800"}`}>
                {basicPlan.badge}
              </span>
            )}
            <div className="mt-1">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">Tier Pemula</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">Basic</span>
              </div>
              <h4 className="font-extrabold text-sm text-slate-900">
                Paket {meta.shortName} Basic
              </h4>
              <div className="mt-2">
                <span className="text-xl font-black text-slate-900">
                  {formatRupiah(basicPlan.price)}
                </span>
                {basicPlan.originalPrice && (
                  <span className="text-[10px] text-slate-400 line-through ml-2">
                    {formatRupiah(basicPlan.originalPrice)}
                  </span>
                )}
                <p className="text-[10px] text-slate-500 mt-0.5">{basicPlan.periodLabel}</p>
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-slate-200/60 space-y-1.5">
              <span className="text-[10px] font-bold text-slate-700 block">Fitur Utama:</span>
              {basicPlan.allFeatures.slice(0, 4).map((f, i) => (
                <div key={i} className="flex items-start gap-1.5 text-[10.5px] text-slate-600">
                  <CheckCircle2 className="h-3 w-3 text-slate-400 shrink-0 mt-0.5" />
                  <span>{f}</span>
                </div>
              ))}
            </div>
            {selectedTier === "basic" && (
              <div className="mt-3 pt-2 border-t border-emerald-200">
                <span className="text-[10px] font-black text-emerald-700 flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3" /> Dipilih
                </span>
              </div>
            )}
          </div>
        )}

        {/* PRO CARD */}
        {proPlan && (
          <div
            onClick={() => { setSelectedTier("pro"); setQrisUrl(null); }}
            className={`relative p-4 rounded-2xl border transition-all cursor-pointer flex flex-col ${
              selectedTier === "pro"
                ? "bg-emerald-50/80 border-emerald-600 ring-2 ring-emerald-600/30 shadow-md"
                : "bg-slate-50/70 border-slate-200 hover:bg-slate-50 hover:border-slate-300"
            }`}
          >
            <span className="absolute -top-2.5 left-3 text-[9px] font-black px-2.5 py-0.5 rounded-full shadow-2xs bg-emerald-500 text-slate-950">
              {proPlan.badge || "Rekomendasi ⭐"}
            </span>
            <div className="mt-1">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-black uppercase tracking-wider text-emerald-700">Otomatisasi Penuh</span>
                <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900">PRO</span>
              </div>
              <h4 className="font-extrabold text-sm text-slate-900 flex items-center gap-1.5">
                Paket {meta.shortName} PRO
                <Sparkles className="h-3.5 w-3.5 text-amber-500" />
              </h4>
              <div className="mt-2">
                <span className="text-xl font-black text-emerald-700">
                  {formatRupiah(proPlan.price)}
                </span>
                {proPlan.originalPrice && (
                  <span className="text-[10px] text-slate-400 line-through ml-2">
                    {formatRupiah(proPlan.originalPrice)}
                  </span>
                )}
                <p className="text-[10px] text-slate-500 mt-0.5">{proPlan.periodLabel}</p>
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-slate-200/60 space-y-1.5">
              <span className="text-[10px] font-black text-emerald-900 block">
                Fitur Eksklusif {meta.shortName}:
              </span>
              {proPlan.exclusiveFeatures.slice(0, 4).map((f, i) => (
                <div key={i} className="flex items-start gap-1.5 text-[10.5px] text-slate-800 font-medium">
                  <CheckCircle2 className="h-3 w-3 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{f}</span>
                </div>
              ))}
            </div>
            {selectedTier === "pro" && (
              <div className="mt-3 pt-2 border-t border-emerald-300">
                <span className="text-[10px] font-black text-emerald-700 flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3" /> Dipilih
                </span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Full Features List for Selected Plan */}
      {selectedPlan && (
        <div className="rounded-2xl border border-slate-200/80 bg-slate-50/80 p-4 space-y-2.5">
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-emerald-600" />
            <span className="font-extrabold text-slate-900 text-xs">
              Semua yang Anda Dapatkan dengan {selectedPlan.name}:
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
            {selectedPlan.allFeatures.map((feat, idx) => (
              <div key={idx} className="flex items-start gap-1.5 text-slate-700 text-[11px]">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0 mt-0.5" />
                <span>{feat}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* QRIS Display View if generated */}
      {qrisUrl && (
        <div className="rounded-2xl border border-teal-200 bg-teal-50/40 p-4 flex flex-col items-center justify-center space-y-2.5 text-center animate-in fade-in">
          <span className="font-black text-teal-950 text-xs">
            Scan QRIS dengan BCA, GoPay, OVO, Dana, ShopeePay, dll:
          </span>
          <div className="p-2 bg-white rounded-xl shadow-md border border-teal-100 max-w-[200px]">
            <img src={qrisUrl} alt="QRIS Mayar" className="w-full h-auto" />
          </div>
          {selectedPlan && (
            <span className="text-[10px] text-slate-500">
              Total: <strong>{formatRupiah(selectedPlan.price)}</strong> (Aktivasi Otomatis)
            </span>
          )}
        </div>
      )}

      {/* Security & Guarantee Note */}
      <div className="flex items-center justify-between text-[10px] text-slate-500 px-1">
        <span className="flex items-center gap-1">
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
          <span>Pembayaran Aman Resmi Mayar.id</span>
        </span>
        <span className="flex items-center gap-1">
          <Sparkles className="h-3.5 w-3.5 text-amber-500" />
          <span>Aktivasi Instan Tanpa Konfirmasi Manual</span>
        </span>
      </div>

      {/* CTA Footer */}
      <div className="pt-2 border-t border-slate-100">
        <div className="flex items-center justify-between mb-3">
          <div>
            <span className="text-[10px] text-slate-400 block">Total Investasi:</span>
            <span className="text-lg font-black text-slate-900">
              {selectedPlan ? formatRupiah(selectedPlan.price) : "—"}
            </span>
          </div>
          {billingCycle === "yearly" && selectedPlan?.originalPrice && (
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-full">
              Hemat {formatRupiah(selectedPlan.originalPrice - selectedPlan.price)}/thn
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            disabled={isProcessing}
            onClick={handleGenerateQris}
            className="touch-press flex-1 h-11 text-xs font-bold border-slate-300 gap-1.5 rounded-xl"
          >
            <QrCode className="h-4 w-4 text-emerald-600" />
            <span>Bayar QRIS</span>
          </Button>
          <Button
            type="button"
            disabled={isProcessing || !selectedPlan}
            onClick={handleCheckoutMayar}
            className="touch-press flex-[2] h-11 text-xs font-black bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5 shadow-md shadow-emerald-600/20 rounded-xl"
          >
            {isProcessing ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Memproses...</span>
              </>
            ) : (
              <>
                <span>
                  Upgrade Sekarang ({selectedPlan ? formatRupiah(selectedPlan.price) : "—"})
                </span>
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
