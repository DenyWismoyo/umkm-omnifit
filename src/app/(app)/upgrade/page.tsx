"use client";

import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { UpgradePricingView } from "@/components/subscription/UpgradePricingView";
import { INDUSTRY_METADATA } from "@/data/subscriptionPlans";
import { ArrowLeft, Loader2 } from "lucide-react";

function UpgradeContent() {
  const searchParams = useSearchParams();
  const featureParam = searchParams.get("feature") || undefined;
  const fromParam = searchParams.get("from") || "/dashboard";

  const { activeIndustry } = useAuth();

  // Gunakan industri yang sudah dipilih saat onboarding — tidak ada pilihan manual
  const industry = activeIndustry || "universal";
  const meta = INDUSTRY_METADATA[industry] || INDUSTRY_METADATA.universal;

  return (
    <div className="max-w-2xl mx-auto pb-16 space-y-6">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center justify-between">
        <Link
          href={fromParam}
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Kembali</span>
        </Link>

        <div className="flex items-center gap-2 text-xs text-slate-500">
          <span className="text-base">{meta.icon}</span>
          <span className="font-bold text-slate-700">{meta.shortName}</span>
          <span>·</span>
          <span>Halaman Upgrade</span>
        </div>
      </div>

      {/* Pricing View — Fully Industry-Aware */}
      <UpgradePricingView
        industry={industry}
        highlightFeature={featureParam}
      />
    </div>
  );
}

export default function UpgradePage() {
  return (
    <DashboardLayout>
      <Suspense
        fallback={
          <div className="flex items-center justify-center min-h-[40vh]">
            <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
          </div>
        }
      >
        <UpgradeContent />
      </Suspense>
    </DashboardLayout>
  );
}
