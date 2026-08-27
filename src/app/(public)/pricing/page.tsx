"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  INDUSTRY_METADATA,
  INDUSTRY_PRICING_PLANS,
} from "@/data/subscriptionPlans";
import { IndustryPack } from "@/types";
import { formatRupiah } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Store,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function PricingPage() {
  const { user } = useAuth();
  const [selectedIndustry, setSelectedIndustry] = useState<IndustryPack>("fnb");
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("yearly");

  const currentMeta = INDUSTRY_METADATA[selectedIndustry] || INDUSTRY_METADATA.fnb;
  const industries: IndustryPack[] = ["fnb", "retail", "salon", "laundry"];

  const basicPlan = INDUSTRY_PRICING_PLANS.find(
    (p) =>
      p.industry === selectedIndustry &&
      p.tier === "basic" &&
      p.billingCycle === billingCycle
  );

  const proPlan = INDUSTRY_PRICING_PLANS.find(
    (p) =>
      p.industry === selectedIndustry &&
      p.tier === "pro" &&
      p.billingCycle === billingCycle
  );

  const enterprisePlan = INDUSTRY_PRICING_PLANS.find((p) => p.tier === "enterprise");

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-emerald-500 selection:text-white">
      {/* Header Navigation */}
      <header className="border-b border-slate-200/80 bg-white/90 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/pos" className="flex items-center gap-2 font-black text-lg text-emerald-800">
            <div className="h-9 w-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
              <Store className="h-5 w-5" />
            </div>
            <span>POS UMKM</span>
          </Link>

          <div className="flex items-center gap-3">
            {user ? (
              <Link href="/dashboard">
                <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs">
                  Buka Dashboard
                </Button>
              </Link>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" size="sm" className="text-xs font-bold">
                    Masuk
                  </Button>
                </Link>
                <Link href="/login">
                  <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs">
                    Coba Gratis 30 Hari
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-12 pb-8 px-4 sm:px-6 lg:px-8 text-center max-w-4xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300 text-xs font-black uppercase tracking-wider">
          <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
          <span>Harga Transparan & Ramah UMKM</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight">
          Pilih Paket Terbaik Sesuai <br className="hidden sm:block" />
          <span className="text-emerald-700">Kebutuhan Bisnis Anda</span>
        </h1>

        <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
          Tidak perlu membayar fitur yang tidak Anda butuhkan. Setiap paket telah dioptimasi dengan resep, alur operasional, dan laporan khusus untuk industri Anda.
        </p>

        {/* Industry Tabs */}
        <div className="pt-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 max-w-3xl mx-auto">
            {industries.map((indKey) => {
              const meta = INDUSTRY_METADATA[indKey];
              const isSelected = selectedIndustry === indKey;

              return (
                <button
                  key={indKey}
                  type="button"
                  onClick={() => setSelectedIndustry(indKey)}
                  className={`touch-press flex items-center justify-center gap-2 p-3 rounded-2xl border transition-all cursor-pointer ${
                    isSelected
                      ? "bg-emerald-600 text-white border-emerald-700 shadow-md shadow-emerald-600/20 font-black scale-102"
                      : "bg-white text-slate-700 border-slate-200/80 hover:bg-slate-50 font-bold shadow-2xs"
                  }`}
                >
                  <span className="text-xl">{meta.icon}</span>
                  <span className="text-xs">{meta.shortName}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Billing Cycle Switcher */}
        <div className="pt-2 flex items-center justify-center">
          <div className="inline-flex items-center bg-slate-200/70 p-1.5 rounded-2xl border border-slate-300/60 shadow-inner">
            <button
              type="button"
              onClick={() => setBillingCycle("monthly")}
              className={`touch-press px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                billingCycle === "monthly"
                  ? "bg-white text-slate-900 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Bayar Bulanan
            </button>
            <button
              type="button"
              onClick={() => setBillingCycle("yearly")}
              className={`touch-press px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 ${
                billingCycle === "yearly"
                  ? "bg-emerald-600 text-white shadow-xs"
                  : "text-slate-700 hover:text-slate-900"
              }`}
            >
              <span>Bayar Tahunan</span>
              <span className="bg-emerald-200 text-emerald-950 text-[10px] font-black px-2 py-0.5 rounded-md">
                Hemat ~47%
              </span>
            </button>
          </div>
        </div>
      </section>

      {/* Pricing Cards Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
          {/* 1. BASIC CARD */}
          {basicPlan && (
            <div className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-8 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] font-black uppercase tracking-wider text-slate-400">
                    Tier Pemula
                  </span>
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
                    Basic
                  </span>
                </div>

                <h3 className="text-xl font-black text-slate-900">
                  {basicPlan.name}
                </h3>
                <p className="text-xs text-slate-500 mt-1 min-h-[32px]">
                  Cocok untuk {currentMeta.shortName} solo/rintisan yang butuh kasir cepat.
                </p>

                <div className="mt-4 pt-4 border-t border-slate-100">
                  <span className="text-3xl font-black text-slate-900">
                    {formatRupiah(basicPlan.price)}
                  </span>
                  {basicPlan.originalPrice && (
                    <span className="text-xs text-slate-400 line-through block mt-0.5">
                      {formatRupiah(basicPlan.originalPrice)}
                    </span>
                  )}
                  <span className="text-xs text-slate-500 block mt-1 font-medium">
                    {basicPlan.periodLabel}
                  </span>
                </div>

                <div className="mt-6 space-y-2.5">
                  <span className="text-xs font-bold text-slate-800 block">
                    Fitur yang Termasuk:
                  </span>
                  {basicPlan.allFeatures.map((f, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-slate-600">
                      <CheckCircle2 className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-8 pt-4">
                <Link href={`/upgrade?feature=Paket%20Basic&from=/pricing&industry=${selectedIndustry}`}>
                  <Button variant="outline" className="w-full h-11 text-xs font-black rounded-xl border-slate-300 hover:bg-slate-50">
                    Pilih Paket Basic
                  </Button>
                </Link>
              </div>
            </div>
          )}

          {/* 2. PRO CARD (Highlighted) */}
          {proPlan && (
            <div className="relative rounded-3xl border-2 border-emerald-600 bg-gradient-to-b from-emerald-50/50 via-white to-white p-6 sm:p-8 flex flex-col justify-between shadow-xl ring-4 ring-emerald-600/10">
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 text-xs font-black px-4 py-1 rounded-full shadow-sm bg-emerald-600 text-white flex items-center gap-1">
                <Sparkles className="h-3.5 w-3.5" />
                <span>Paling Direkomendasikan</span>
              </div>

              <div>
                <div className="flex items-center justify-between mb-3 mt-1">
                  <span className="text-[11px] font-black uppercase tracking-wider text-emerald-700">
                    Otomatisasi & Laporan
                  </span>
                  <span className="text-xs font-black px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300">
                    PRO
                  </span>
                </div>

                <h3 className="text-xl font-black text-slate-900">
                  {proPlan.name}
                </h3>
                <p className="text-xs text-slate-600 mt-1 min-h-[32px]">
                  Solusi komplit untuk mengontrol laba rugi, HPP, bahan baku & kasir.
                </p>

                <div className="mt-4 pt-4 border-t border-slate-100">
                  <span className="text-3xl font-black text-emerald-700">
                    {formatRupiah(proPlan.price)}
                  </span>
                  {proPlan.originalPrice && (
                    <span className="text-xs text-slate-400 line-through block mt-0.5">
                      {formatRupiah(proPlan.originalPrice)}
                    </span>
                  )}
                  <span className="text-xs text-slate-500 block mt-1 font-medium">
                    {proPlan.periodLabel}
                  </span>
                </div>

                <div className="mt-6 space-y-2.5">
                  <span className="text-xs font-black text-emerald-950 block">
                    Semua Fitur Basic + Eksklusif {currentMeta.shortName}:
                  </span>
                  {proPlan.allFeatures.map((f, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-slate-800 font-medium">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-8 pt-4">
                <Link href={`/upgrade?feature=Paket%20PRO&from=/pricing&industry=${selectedIndustry}`}>
                  <Button className="w-full h-11 text-xs font-black rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-600/20 gap-1.5">
                    <span>Mulai Paket PRO Sekarang</span>
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          )}

          {/* 3. ENTERPRISE WHITELABEL */}
          {enterprisePlan && (
            <div className="rounded-3xl border border-slate-200/90 bg-gradient-to-b from-slate-900 to-slate-950 text-white p-6 sm:p-8 flex flex-col justify-between shadow-xl">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] font-black uppercase tracking-wider text-amber-400">
                    Kustomisasi Penuh
                  </span>
                  <span className="text-xs font-black px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950">
                    Enterprise
                  </span>
                </div>

                <h3 className="text-xl font-black text-white">
                  Whitelabel & Multi-Cabang
                </h3>
                <p className="text-xs text-slate-300 mt-1 min-h-[32px]">
                  Untuk franchise, grup resto, jaringan klinik atau pemilik banyak cabang.
                </p>

                <div className="mt-4 pt-4 border-t border-slate-800">
                  <span className="text-2xl sm:text-3xl font-black text-amber-400">
                    {formatRupiah(enterprisePlan.price)}
                  </span>
                  <span className="text-xs text-slate-400 block mt-1 font-medium">
                    {enterprisePlan.periodLabel}
                  </span>
                </div>

                <div className="mt-6 space-y-2.5">
                  <span className="text-xs font-bold text-slate-200 block">
                    Layanan Eksklusif Enterprise:
                  </span>
                  {enterprisePlan.exclusiveFeatures.map((f, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-slate-300">
                      <Sparkles className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-8 pt-4">
                <a
                  href="https://wa.me/628990000000?text=Halo%20Admin%20POS%20UMKM,%20saya%20tertarik%20konsultasi%20Paket%20Enterprise%20Whitelabel"
                  target="_blank"
                  rel="noreferrer"
                >
                  <Button className="w-full h-11 text-xs font-black rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-950">
                    Hubungi Tim Konsultan
                  </Button>
                </a>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-t border-slate-200/80">
        <h2 className="text-2xl font-black text-slate-900 text-center mb-8">
          Pertanyaan yang Sering Diajukan (FAQ)
        </h2>

        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs">
            <h4 className="font-bold text-sm text-slate-900">
              Apakah saya bisa mengganti jenis paket industri nanti?
            </h4>
            <p className="text-xs text-slate-600 mt-1">
              Ya, Anda dapat beralih kapan saja (misal dari F&B ke Retail atau upgrade dari Basic ke PRO) langsung dari menu pengaturan atau modal upgrade.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs">
            <h4 className="font-bold text-sm text-slate-900">
              Metode pembayaran apa saja yang didukung?
            </h4>
            <p className="text-xs text-slate-600 mt-1">
              Didukung pembayaran instan melalui QRIS (BCA, GoPay, OVO, Dana, ShopeePay), Virtual Account Bank, dan Transfer Bank resmi bermitra dengan Mayar.id.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs">
            <h4 className="font-bold text-sm text-slate-900">
              Apakah data saya aman jika langganan saya habis?
            </h4>
            <p className="text-xs text-slate-600 mt-1">
              Data transaksi, produk, dan laporan keuangan Anda tersimpan aman selamanya di cloud Firebase. Anda dapat mengaktifkan kembali langganan kapan saja tanpa kehilangan data.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 text-center text-xs text-slate-500">
        <p>&copy; 2026 POS UMKM Indonesia. Solusi Aplikasi Kasir Cerdas untuk Semua Industri.</p>
      </footer>
    </div>
  );
}
