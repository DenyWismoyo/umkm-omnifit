"use client";

import React from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { Lock, Crown, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { INDUSTRY_METADATA } from "@/data/subscriptionPlans";
import { SubscriptionTier, IndustryPack } from "@/types";

interface FeatureGateProps {
  requiredTier?: SubscriptionTier;
  requiredIndustry?: IndustryPack | IndustryPack[];
  featureName: string;
  description?: string;
  children: React.ReactNode;
  fallbackMode?: "card" | "banner" | "hide";
}

export function FeatureGate({
  requiredTier = "pro",
  requiredIndustry,
  featureName,
  description,
  children,
  fallbackMode = "card",
}: FeatureGateProps) {
  const { activeTier, activeIndustry, isTrialActive, openUpgradeModal } = useAuth();

  // Active trial or enterprise has access to all
  const hasTierAccess =
    isTrialActive ||
    activeTier === "enterprise" ||
    (requiredTier === "basic" && ["basic", "pro", "enterprise"].includes(activeTier)) ||
    (requiredTier === "pro" && ["pro", "enterprise"].includes(activeTier));

  // Check industry requirement
  const hasIndustryAccess =
    isTrialActive ||
    activeTier === "enterprise" ||
    !requiredIndustry ||
    (Array.isArray(requiredIndustry)
      ? requiredIndustry.includes(activeIndustry)
      : requiredIndustry === activeIndustry);

  const isAllowed = hasTierAccess && hasIndustryAccess;

  if (isAllowed) {
    return <>{children}</>;
  }

  if (fallbackMode === "hide") {
    return null;
  }

  const currentMeta = INDUSTRY_METADATA[activeIndustry] || INDUSTRY_METADATA.fnb;

  if (fallbackMode === "banner") {
    return (
      <div className="rounded-2xl border border-amber-200/90 bg-gradient-to-r from-amber-50 to-orange-50 p-4 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0">
            <Lock className="h-5 w-5 text-amber-600" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-bold text-slate-900 text-sm">{featureName} (Terkunci)</h4>
              <span className="text-[10px] font-black uppercase bg-amber-200 text-amber-900 px-2 py-0.5 rounded-full">
                Tier {requiredTier.toUpperCase()}
              </span>
            </div>
            <p className="text-xs text-slate-600 mt-0.5">
              {description || "Fitur ini memerlukan paket langganan PRO atau paket industri khusus."}
            </p>
          </div>
        </div>

        <Button
          onClick={openUpgradeModal}
          size="sm"
          className="bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs gap-1.5 shrink-0 shadow-sm"
        >
          <Crown className="h-3.5 w-3.5" />
          <span>Buka Akses</span>
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-[380px] rounded-3xl border border-slate-200/90 bg-gradient-to-b from-white to-slate-50/80 p-8 flex flex-col items-center justify-center text-center max-w-lg mx-auto shadow-sm my-6">
      <div className="relative mb-4">
        <div className="h-16 w-16 rounded-3xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-600 shadow-inner">
          <Crown className="h-8 w-8" />
        </div>
        <div className="absolute -bottom-1 -right-1 h-7 w-7 rounded-full bg-slate-900 text-white flex items-center justify-center shadow-md">
          <Lock className="h-3.5 w-3.5 text-amber-400" />
        </div>
      </div>

      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-300 text-[11px] font-black uppercase tracking-wider mb-2">
        <Sparkles className="h-3 w-3 text-amber-600" />
        <span>Fitur Eksklusif {requiredTier.toUpperCase()}</span>
      </div>

      <h3 className="text-xl font-black text-slate-900 tracking-tight mb-2">{featureName}</h3>
      <p className="text-xs text-slate-600 max-w-md leading-relaxed mb-6">
        {description ||
          `Tingkatkan performa usaha Anda dengan membuka akses ${featureName}. Dilengkapi otomatisasi cerdas khusus paket ${currentMeta.shortName}.`}
      </p>

      <div className="flex flex-col sm:flex-row items-center gap-2.5 w-full max-w-xs">
        <Button
          onClick={openUpgradeModal}
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs h-10 gap-2 shadow-md shadow-emerald-600/20"
        >
          <Crown className="h-4 w-4" />
          <span>Upgrade Akses Sekarang</span>
        </Button>
        <Link href="/pricing" className="w-full">
          <Button variant="outline" className="w-full border-slate-300 text-xs font-bold h-10">
            <span>Lihat Semua Paket</span>
          </Button>
        </Link>
      </div>
    </div>
  );
}
