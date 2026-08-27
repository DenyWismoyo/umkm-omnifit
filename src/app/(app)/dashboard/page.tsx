"use client";

import React, { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useAuth } from "@/context/AuthContext";
import { getDashboardData, getTransactions, getProducts } from "@/services/firestore";
import { DashboardSummary, Transaction, Product } from "@/types";
import { formatRupiah } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  TrendingUp,
  ShoppingCart,
  DollarSign,
  Package,
  AlertTriangle,
  ArrowUpRight,
  TrendingDown,
  Clock,
  Plus,
  Users,
  Sparkles,
  Receipt,
  Store,
  ChevronRight,
  Calculator,
  GraduationCap,
  BookOpen,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export default function DashboardPage() {
  const { user, shopProfile, isTrialActive, trialDaysLeft, openUpgradeModal } = useAuth();
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([]);
  const [lowStockProducts, setLowStockProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      if (!user) return;
      try {
        setLoading(true);
        const [dashData, trxs, prods] = await Promise.all([
          getDashboardData(user.uid),
          getTransactions(user.uid, 8),
          getProducts(user.uid),
        ]);
        setSummary(dashData);
        setRecentTransactions(trxs);
        setLowStockProducts(
          prods.filter((p) => p.stock <= (p.minStockAlert || 5)).slice(0, 6)
        );
      } catch (err) {
        console.error(err);
        toast.error("Gagal memuat ringkasan dashboard.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, [user]);

  return (
    <DashboardLayout>
      <div className="space-y-4 sm:space-y-6">
        {/* Welcome Banner - Mobile Borderless Optimized */}
        <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-br from-emerald-900 via-teal-950 to-slate-950 p-5 sm:p-8 text-white shadow-md border-0 sm:border border-emerald-800/40">
          <div className="absolute top-0 right-0 -mt-10 -mr-10 h-48 w-48 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
          <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="space-y-1.5 sm:space-y-2">
              <div className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-2.5 py-0.5 sm:px-3 sm:py-1 text-[11px] sm:text-xs font-semibold text-emerald-200 backdrop-blur-sm">
                <Sparkles className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                <span>Panel Manajemen Usaha Terisolasi</span>
              </div>
              <h1 className="text-xl sm:text-3xl font-black tracking-tight leading-tight">
                Halo, {shopProfile?.ownerName || user?.displayName || "Pengusaha Sukses"}! 👋
              </h1>
              <p className="text-xs sm:text-sm text-emerald-100/80 max-w-xl leading-relaxed">
                Pantau performa harian toko <strong className="text-white">{shopProfile?.shopName || "POS UMKM"}</strong> secara real-time.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Link href="/hpp" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  variant="outline"
                  className="touch-press w-full sm:w-auto border-emerald-400/50 bg-emerald-800/40 text-emerald-100 hover:bg-emerald-800/60 font-bold gap-2 text-xs sm:text-sm h-10 sm:h-11"
                >
                  <Calculator className="h-4 w-4 text-amber-300" />
                  <span>Kalkulator HPP</span>
                </Button>
              </Link>

              <Link href="/pos" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  className="touch-press w-full sm:w-auto bg-white text-emerald-950 hover:bg-emerald-50 font-black shadow-md gap-2 text-xs sm:text-sm h-10 sm:h-11"
                >
                  <ShoppingCart className="h-4 w-4 text-emerald-700" />
                  <span>Buka Kasir POS</span>
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Active Trial Info Banner */}
        {isTrialActive && (
          <div className="rounded-2xl border border-amber-300/90 bg-gradient-to-r from-amber-500/15 via-orange-500/10 to-amber-500/5 p-4 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-in fade-in">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-700 shrink-0 shadow-inner">
                <Clock className="h-5 w-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-extrabold text-slate-900 text-xs sm:text-sm">
                    Paket Trial 30 Hari Aktif ({trialDaysLeft} Hari Tersisa)
                  </h4>
                  <span className="text-[10px] font-black uppercase bg-amber-200 text-amber-900 px-2 py-0.5 rounded-full">
                    Termasuk HPP
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 mt-0.5">
                  Anda dapat mencoba bebas seluruh fitur Kasir dan Kalkulator HPP Cerdas 111+ Resep UMKM tanpa biaya.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Link href="/hpp" className="flex-1 sm:flex-none">
                <Button
                  size="sm"
                  variant="outline"
                  className="w-full text-xs font-bold border-amber-300 bg-white hover:bg-amber-50 text-amber-950 h-8 gap-1.5"
                >
                  <Calculator className="h-3.5 w-3.5 text-amber-600" />
                  <span>Coba HPP</span>
                </Button>
              </Link>
              <Button
                size="sm"
                onClick={openUpgradeModal}
                className="flex-1 sm:flex-none text-xs font-black bg-emerald-600 hover:bg-emerald-700 text-white h-8 shadow-xs"
              >
                Pilih Paket Industri
              </Button>
            </div>
          </div>
        )}

        {/* KPI Stats Cards - Borderless & Touch-Optimized */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
          {/* Omzet Hari Ini */}
          <div className="borderless-card p-3.5 sm:p-4 touch-press hover-lift flex flex-col justify-between bg-gradient-to-br from-white to-emerald-50/30">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] sm:text-xs font-extrabold text-slate-500 uppercase tracking-wider">
                Omzet Hari Ini
              </span>
              <div className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-700">
                <DollarSign className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              </div>
            </div>
            <div>
              <div className="text-base sm:text-xl font-black text-slate-900 leading-tight">
                {formatRupiah(summary?.todayRevenue || 0)}
              </div>
              <p className="text-[10px] sm:text-xs text-slate-500 mt-1 flex items-center gap-1">
                <Clock className="h-3 w-3 text-slate-400 shrink-0" />
                <span>{summary?.todayTransactions || 0} transaksi</span>
              </p>
            </div>
          </div>

          {/* Laba Kotor Hari Ini */}
          <div className="borderless-card p-3.5 sm:p-4 touch-press hover-lift flex flex-col justify-between bg-gradient-to-br from-white to-teal-50/30">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] sm:text-xs font-extrabold text-slate-500 uppercase tracking-wider">
                Laba Kotor
              </span>
              <div className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-xl bg-teal-500/10 text-teal-700">
                <TrendingUp className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              </div>
            </div>
            <div>
              <div className="text-base sm:text-xl font-black text-teal-700 leading-tight">
                {formatRupiah(summary?.todayProfit || 0)}
              </div>
              <p className="text-[10px] sm:text-xs text-slate-500 mt-1">
                Margin - HPP
              </p>
            </div>
          </div>

          {/* Laba Bersih Bulan Ini */}
          <div className="borderless-card p-3.5 sm:p-4 touch-press hover-lift flex flex-col justify-between bg-gradient-to-br from-white to-blue-50/30">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] sm:text-xs font-extrabold text-slate-500 uppercase tracking-wider">
                Laba Bersih
              </span>
              <div className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-xl bg-blue-500/10 text-blue-700">
                <ArrowUpRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              </div>
            </div>
            <div>
              <div
                className={`text-base sm:text-xl font-black leading-tight ${
                  (summary?.netProfit || 0) >= 0 ? "text-emerald-700" : "text-rose-600"
                }`}
              >
                {formatRupiah(summary?.netProfit || 0)}
              </div>
              <p className="text-[10px] sm:text-xs text-slate-500 mt-1">
                Bulan berjalan
              </p>
            </div>
          </div>

          {/* Total Kasbon Pelanggan */}
          <div className="borderless-card p-3.5 sm:p-4 touch-press hover-lift flex flex-col justify-between bg-gradient-to-br from-white to-amber-50/30">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] sm:text-xs font-extrabold text-slate-500 uppercase tracking-wider">
                Piutang Toko
              </span>
              <div className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-xl bg-amber-500/10 text-amber-700">
                <Users className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              </div>
            </div>
            <div>
              <div className="text-base sm:text-xl font-black text-amber-700 leading-tight">
                {formatRupiah(summary?.totalReceivables || 0)}
              </div>
              <Link
                href="/debts"
                className="text-[10px] sm:text-xs text-amber-700 font-semibold hover:underline mt-1 inline-flex items-center gap-0.5"
              >
                <span>Buku kasbon</span>
                <ChevronRight className="h-3 w-3" />
              </Link>
            </div>
          </div>
        </div>

        {/* Action Shortcuts - Modern Tactile Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
          <Link
            href="/pos"
            className="touch-press flex items-center gap-2.5 sm:gap-3 rounded-2xl border border-emerald-500/20 bg-gradient-to-br from-emerald-50/90 to-teal-50/40 p-3 sm:p-4 shadow-2xs hover:shadow-xs"
          >
            <div className="flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white shadow-xs">
              <ShoppingCart className="h-4 w-4 sm:h-5 sm:w-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-emerald-950">Transaksi</h4>
              <p className="text-[10px] text-emerald-700">Mesin kasir</p>
            </div>
          </Link>

          <Link
            href="/academy"
            className="touch-press flex items-center gap-2.5 sm:gap-3 rounded-2xl border border-blue-500/20 bg-gradient-to-br from-blue-50/90 to-indigo-50/40 p-3 sm:p-4 shadow-2xs hover:shadow-xs"
          >
            <div className="flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 text-white shadow-xs">
              <GraduationCap className="h-4 w-4 sm:h-5 sm:w-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-blue-950">Akademi</h4>
              <p className="text-[10px] text-blue-700">Playbook & BEP</p>
            </div>
          </Link>

          <Link
            href="/hpp"
            className="touch-press flex items-center gap-2.5 sm:gap-3 rounded-2xl border border-amber-500/20 bg-gradient-to-br from-amber-50/90 to-orange-50/40 p-3 sm:p-4 shadow-2xs hover:shadow-xs"
          >
            <div className="flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-amber-600 to-orange-500 text-white shadow-xs">
              <Calculator className="h-4 w-4 sm:h-5 sm:w-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-amber-950">Hitung HPP</h4>
              <p className="text-[10px] text-amber-700">Resep & margin</p>
            </div>
          </Link>

          <Link
            href="/reports"
            className="touch-press flex items-center gap-2.5 sm:gap-3 rounded-2xl border border-purple-500/20 bg-gradient-to-br from-purple-50/90 to-rose-50/40 p-3 sm:p-4 shadow-2xs hover:shadow-xs"
          >
            <div className="flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-purple-600 to-rose-500 text-white shadow-xs">
              <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-purple-950">Laba Rugi</h4>
              <p className="text-[10px] text-purple-700">Evaluasi toko</p>
            </div>
          </Link>
        </div>

        {/* User Guide & Manual Book Quick Access Banner */}
        <div className="rounded-2xl border border-indigo-200 bg-gradient-to-r from-indigo-50/90 via-purple-50/50 to-emerald-50/40 p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-2xs">
          <div className="flex items-center gap-3.5">
            <div className="h-11 w-11 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-500 text-white flex items-center justify-center shrink-0 shadow-md">
              <BookOpen className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-extrabold text-slate-900 text-xs sm:text-sm">
                  Pusat Panduan & Manual Book Sistem
                </h4>
                <span className="text-[9px] font-black uppercase bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded-full">
                  Dokumentasi
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-slate-600 mt-0.5">
                Pelajari cara kerja alur kasir, fitur 6 modul industri, setting printer thermal, dan perhitungan HPP resep otomatis.
              </p>
            </div>
          </div>

          <Link href="/docs" className="w-full sm:w-auto shrink-0">
            <Button
              size="sm"
              className="touch-press w-full sm:w-auto h-9 px-4 text-xs font-black bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-xs gap-1.5"
            >
              <span>Buka Manual Book</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </Button>
          </Link>
        </div>

        {/* Lower Grid: Recent Transactions & Low Stock Alerts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Recent Transactions (2 cols on large screen) */}
          <div className="lg:col-span-2 space-y-2.5 sm:space-y-3">
            <div className="flex items-center justify-between px-0.5">
              <div>
                <h3 className="font-extrabold text-slate-900 text-sm sm:text-base">
                  Riwayat Transaksi Terkini
                </h3>
                <p className="text-[11px] sm:text-xs text-slate-500">
                  Transaksi terbaru yang tercatat di toko Anda
                </p>
              </div>
              <Link href="/reports">
                <Button variant="ghost" size="sm" className="text-xs text-emerald-600 font-bold touch-press">
                  Lihat Semua
                </Button>
              </Link>
            </div>

            <div className="list-stacked">
              {recentTransactions.length === 0 ? (
                <div className="p-8 text-center text-slate-400 text-xs">
                  Belum ada transaksi penjualan hari ini.
                </div>
              ) : (
                recentTransactions.map((trx) => (
                  <div
                    key={trx.id}
                    className="list-stacked-item touch-press"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-600 shrink-0">
                        <Receipt className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs text-slate-900">
                            {trx.invoiceNumber}
                          </span>
                          <Badge
                            variant={trx.paymentMethod === "debt" ? "warning" : "default"}
                            className="text-[8px] sm:text-[9px] uppercase px-1.5 py-0"
                          >
                            {trx.paymentMethod}
                          </Badge>
                        </div>
                        <p className="text-[10px] sm:text-[11px] text-slate-400 mt-0.5">
                          {trx.itemCount} item • {new Date(trx.date).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}
                          {trx.customerName && ` • ${trx.customerName}`}
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="font-black text-xs sm:text-sm text-slate-900">
                        {formatRupiah(trx.totalAmount)}
                      </div>
                      <div className="text-[9px] sm:text-[10px] font-semibold text-emerald-700">
                        +{formatRupiah(trx.grossProfit)}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Low Stock Alerts (1 col) */}
          <div className="space-y-2.5 sm:space-y-3">
            <div className="flex items-center justify-between px-0.5">
              <div>
                <h3 className="font-extrabold text-slate-900 text-sm sm:text-base flex items-center gap-1.5">
                  <AlertTriangle className="h-4 w-4 text-amber-500" />
                  <span>Stok Menipis</span>
                </h3>
                <p className="text-[11px] sm:text-xs text-slate-500">
                  Perlu segera kulakan / restock
                </p>
              </div>
              <Link href="/products">
                <Button variant="ghost" size="sm" className="text-xs text-emerald-600 font-bold touch-press">
                  Katalog
                </Button>
              </Link>
            </div>

            <div className="borderless-card p-3 sm:p-4 space-y-2.5">
              {lowStockProducts.length === 0 ? (
                <div className="py-6 text-center text-xs text-slate-400">
                  🎉 Semua stok produk dalam batas aman.
                </div>
              ) : (
                lowStockProducts.map((p) => (
                  <div
                    key={p.id}
                    className="touch-press flex items-center justify-between gap-2 p-2.5 rounded-xl border border-amber-100 bg-amber-50/50"
                  >
                    <div>
                      <h5 className="font-bold text-xs text-slate-900 line-clamp-1">{p.name}</h5>
                      <p className="text-[10px] text-slate-500">
                        Jual: {formatRupiah(p.sellingPrice)}
                      </p>
                    </div>

                    <div className="text-right shrink-0">
                      <Badge
                        variant={p.stock <= 0 ? "destructive" : "warning"}
                        className="text-[9px] sm:text-[10px]"
                      >
                        {p.stock <= 0 ? "Habis (0)" : `Sisa ${p.stock}`}
                      </Badge>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
