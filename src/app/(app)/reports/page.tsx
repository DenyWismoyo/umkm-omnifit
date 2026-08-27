"use client";

import React, { useState, useEffect, useMemo } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useAuth } from "@/context/AuthContext";
import { getTransactions, getExpenses } from "@/services/firestore";
import { Transaction, Expense } from "@/types";
import { formatRupiah } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/common/PageHeader";
import { FeatureGate } from "@/components/common/FeatureGate";
import { DataTable } from "@/components/shared/data-display/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import {
  Download,
  Calendar,
  TrendingUp,
  Loader2,
  PieChart as PieIcon,
  Eye,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { ReceiptModal } from "@/components/pos/ReceiptModal";
import { toast } from "sonner";

export default function ReportsPage() {
  const { user, shopProfile } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);

  // Date Filter Preset
  const [presetFilter, setPresetFilter] = useState<string>("this_month");
  const [startDate, setStartDate] = useState<string>(
    new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().slice(0, 10)
  );
  const [endDate, setEndDate] = useState<string>(new Date().toISOString().slice(0, 10));

  // Modals
  const [selectedTrx, setSelectedTrx] = useState<Transaction | null>(null);
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);

  const loadReportData = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const [trxList, expList] = await Promise.all([
        getTransactions(user.uid, 1000),
        getExpenses(user.uid),
      ]);
      setTransactions(trxList);
      setExpenses(expList);
    } catch (err) {
      console.error(err);
      toast.error("Gagal memuat data laporan.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReportData();
  }, [user]);

  const handlePresetChange = (preset: string) => {
    setPresetFilter(preset);
    const today = new Date();
    const todayStr = today.toISOString().slice(0, 10);

    if (preset === "today") {
      setStartDate(todayStr);
      setEndDate(todayStr);
    } else if (preset === "7days") {
      const past7 = new Date();
      past7.setDate(past7.getDate() - 6);
      setStartDate(past7.toISOString().slice(0, 10));
      setEndDate(todayStr);
    } else if (preset === "this_month") {
      const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
      setStartDate(firstDay.toISOString().slice(0, 10));
      setEndDate(todayStr);
    }
  };

  const filteredTransactions = useMemo(() => {
    return transactions.filter((t) => {
      const d = t.date ? t.date.slice(0, 10) : "";
      return d >= startDate && d <= endDate;
    });
  }, [transactions, startDate, endDate]);

  const filteredExpenses = useMemo(() => {
    return expenses.filter((e) => {
      const d = e.date ? e.date.slice(0, 10) : "";
      return d >= startDate && d <= endDate;
    });
  }, [expenses, startDate, endDate]);

  const totalRevenue = useMemo(() => {
    return filteredTransactions.reduce((acc, t) => acc + (t.totalAmount || 0), 0);
  }, [filteredTransactions]);

  const totalCost = useMemo(() => {
    return filteredTransactions.reduce((acc, t) => acc + (t.totalCost || 0), 0);
  }, [filteredTransactions]);

  const totalGrossProfit = totalRevenue - totalCost;
  const totalExpense = useMemo(() => {
    return filteredExpenses.reduce((acc, e) => acc + (e.amount || 0), 0);
  }, [filteredExpenses]);
  const totalNetProfit = totalGrossProfit - totalExpense;

  const chartData = useMemo(() => {
    const dailyMap: Record<string, { date: string; omzet: number; laba: number }> = {};
    filteredTransactions.forEach((t) => {
      const day = t.date ? t.date.slice(0, 10) : "N/A";
      if (!dailyMap[day]) {
        dailyMap[day] = { date: day, omzet: 0, laba: 0 };
      }
      dailyMap[day].omzet += t.totalAmount || 0;
      dailyMap[day].laba += t.grossProfit || 0;
    });
    return Object.values(dailyMap).sort((a, b) => a.date.localeCompare(b.date));
  }, [filteredTransactions]);

  const paymentMethodData = useMemo(() => {
    const map: Record<string, number> = { cash: 0, qris: 0, transfer: 0, debt: 0 };
    filteredTransactions.forEach((t) => {
      if (map[t.paymentMethod] !== undefined) {
        map[t.paymentMethod] += t.totalAmount || 0;
      }
    });
    return [
      { name: "Tunai", value: map.cash, color: "#10b981" },
      { name: "QRIS", value: map.qris, color: "#06b6d4" },
      { name: "Transfer", value: map.transfer, color: "#3b82f6" },
      { name: "Kasbon", value: map.debt, color: "#f59e0b" },
    ].filter((item) => item.value > 0);
  }, [filteredTransactions]);

  const handleExportCSV = () => {
    if (filteredTransactions.length === 0) {
      toast.error("Tidak ada data transaksi untuk diekspor.");
      return;
    }
    const headers = ["No Faktur", "Tanggal", "Waktu", "Jumlah Item", "Metode Pembayaran", "Pelanggan", "Subtotal", "Diskon", "Pajak", "Total Omzet", "Total Modal (HPP)", "Laba Kotor"];
    const rows = filteredTransactions.map((t) => [
      `"${t.invoiceNumber}"`,
      `"${new Date(t.date).toLocaleDateString("id-ID")}"`,
      `"${new Date(t.date).toLocaleTimeString("id-ID")}"`,
      t.itemCount,
      `"${t.paymentMethod.toUpperCase()}"`,
      `"${t.customerName || "Umum"}"`,
      t.subtotal,
      t.discount,
      t.taxAmount,
      t.totalAmount,
      t.totalCost,
      t.grossProfit,
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Laporan_POS_${shopProfile?.shopName || "Toko"}_${startDate}_sd_${endDate}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("File CSV Laporan Penjualan berhasil diunduh!");
  };

  const columns: ColumnDef<Transaction>[] = [
    {
      accessorKey: "invoiceNumber",
      header: "No. Faktur",
      cell: ({ row }) => <span className="font-bold text-slate-900 font-mono">{row.original.invoiceNumber}</span>,
    },
    {
      accessorKey: "date",
      header: "Waktu",
      cell: ({ row }) => (
        <span className="text-slate-600">
          {new Date(row.original.date).toLocaleString("id-ID", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
        </span>
      ),
    },
    {
      accessorKey: "customerName",
      header: "Pelanggan",
      cell: ({ row }) => <span className="text-slate-800 font-medium">{row.original.customerName || "-"}</span>,
    },
    {
      accessorKey: "paymentMethod",
      header: "Metode",
      cell: ({ row }) => (
        <Badge variant={row.original.paymentMethod === "debt" ? "warning" : "default"} className="text-[9px] uppercase">
          {row.original.paymentMethod}
        </Badge>
      ),
    },
    {
      accessorKey: "itemCount",
      header: () => <div className="text-center">Item</div>,
      cell: ({ row }) => <div className="text-center font-semibold">{row.original.itemCount}</div>,
    },
    {
      accessorKey: "totalAmount",
      header: () => <div className="text-right">Omzet</div>,
      cell: ({ row }) => <div className="text-right font-bold text-slate-900">{formatRupiah(row.original.totalAmount)}</div>,
    },
    {
      accessorKey: "grossProfit",
      header: () => <div className="text-right">Laba Kotor</div>,
      cell: ({ row }) => <div className="text-right font-black text-emerald-700">+{formatRupiah(row.original.grossProfit)}</div>,
    },
    {
      id: "actions",
      header: () => <div className="text-right">Aksi</div>,
      cell: ({ row }) => {
        const trx = row.original;
        return (
          <div className="flex justify-end">
            <Button
              variant="ghost"
              size="iconSm"
              onClick={() => {
                setSelectedTrx(trx);
                setIsReceiptOpen(true);
              }}
              title="Lihat Struk"
              className="touch-press"
            >
              <Eye className="h-4 w-4 text-slate-500 hover:text-emerald-600" />
            </Button>
          </div>
        );
      },
    },
  ];

  return (
    <DashboardLayout>
      <FeatureGate
        requiredTier="pro"
        featureName="Laporan Laba/Rugi & Analisis Finansial"
        description="Analisis performa omzet penjualan harian/bulanan, HPP, beban operasional, laba bersih, dan ekspor data ke Excel / CSV."
      >
        <div className="space-y-6">
          <PageHeader
            title="Laporan Keuangan & Laba Rugi"
            description="Analisis performa omzet penjualan, HPP, beban operasional, dan laba bersih."
            actions={
              <Button
                variant="outline"
                size="sm"
                onClick={handleExportCSV}
                className="touch-press gap-1.5 h-9 text-xs font-bold border-slate-300 hover:bg-slate-50"
              >
                <Download className="h-4 w-4 text-emerald-600" />
                <span>Ekspor CSV</span>
              </Button>
            }
          />

          <div className="flex flex-col lg:flex-row gap-3 items-stretch lg:items-center justify-between rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm">
            <div className="flex flex-wrap items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
              <button onClick={() => handlePresetChange("today")} className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${presetFilter === "today" ? "bg-white text-slate-900 shadow-sm" : "text-slate-600 hover:text-slate-900"}`}>Hari Ini</button>
              <button onClick={() => handlePresetChange("7days")} className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${presetFilter === "7days" ? "bg-white text-slate-900 shadow-sm" : "text-slate-600 hover:text-slate-900"}`}>7 Hari Terakhir</button>
              <button onClick={() => handlePresetChange("this_month")} className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${presetFilter === "this_month" ? "bg-white text-slate-900 shadow-sm" : "text-slate-600 hover:text-slate-900"}`}>Bulan Ini</button>
            </div>

            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-slate-400 shrink-0" />
              <Input type="date" value={startDate} onChange={(e) => { setStartDate(e.target.value); setPresetFilter("custom"); }} className="h-9 text-xs w-36" />
              <span className="text-xs text-slate-400">s/d</span>
              <Input type="date" value={endDate} onChange={(e) => { setEndDate(e.target.value); setPresetFilter("custom"); }} className="h-9 text-xs w-36" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
            <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Omzet</span>
              <p className="text-lg sm:text-xl font-black text-slate-900 mt-1">{formatRupiah(totalRevenue)}</p>
              <p className="text-[11px] text-slate-500 mt-0.5">{filteredTransactions.length} transaksi</p>
            </div>
            <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Harga Pokok (HPP)</span>
              <p className="text-lg sm:text-xl font-black text-slate-600 mt-1">{formatRupiah(totalCost)}</p>
              <p className="text-[11px] text-slate-400 mt-0.5">Modal beli produk</p>
            </div>
            <div className="rounded-2xl border border-teal-200 bg-teal-50/50 p-4 shadow-sm">
              <span className="text-[11px] font-bold uppercase tracking-wider text-teal-800">Laba Kotor (Margin)</span>
              <p className="text-lg sm:text-xl font-black text-teal-900 mt-1">{formatRupiah(totalGrossProfit)}</p>
              <p className="text-[11px] text-teal-700 mt-0.5">Omzet dikurangi Modal</p>
            </div>
            <div className="rounded-2xl border border-rose-200 bg-rose-50/50 p-4 shadow-sm">
              <span className="text-[11px] font-bold uppercase tracking-wider text-rose-800">Biaya Operasional</span>
              <p className="text-lg sm:text-xl font-black text-rose-900 mt-1">{formatRupiah(totalExpense)}</p>
              <p className="text-[11px] text-rose-700 mt-0.5">{filteredExpenses.length} pos pengeluaran</p>
            </div>
            <div className={`rounded-2xl border p-4 shadow-sm ${totalNetProfit >= 0 ? "border-emerald-300 bg-emerald-50 text-emerald-950" : "border-rose-300 bg-rose-50 text-rose-950"}`}>
              <span className="text-[11px] font-bold uppercase tracking-wider">Laba Bersih Akhir</span>
              <p className="text-lg sm:text-xl font-black mt-1">{formatRupiah(totalNetProfit)}</p>
              <p className="text-[11px] opacity-80 mt-0.5">Laba Kotor - Biaya Toko</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm space-y-4">
              <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-emerald-600" />
                <span>Tren Penjualan & Laba Harian</span>
              </h3>
              {chartData.length === 0 ? (
                <div className="h-64 flex items-center justify-center text-xs text-slate-400">Belum ada data grafik transaksi pada rentang tanggal ini.</div>
              ) : (
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                      <XAxis dataKey="date" tick={{ fontSize: 10, fill: "#64748b" }} tickFormatter={(val) => val.slice(5)} />
                      <YAxis tick={{ fontSize: 10, fill: "#64748b" }} tickFormatter={(val) => `${val / 1000}k`} />
                      <Tooltip formatter={(value: any) => [formatRupiah(Number(value)), ""]} labelFormatter={(label) => `Tanggal: ${label}`} contentStyle={{ borderRadius: "12px", fontSize: "12px" }} />
                      <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "10px" }} />
                      <Bar dataKey="omzet" name="Omzet Penjualan" fill="#059669" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="laba" name="Laba Kotor" fill="#06b6d4" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>

            <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm space-y-4">
              <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                <PieIcon className="h-4 w-4 text-teal-600" />
                <span>Porsi Metode Pembayaran</span>
              </h3>
              {paymentMethodData.length === 0 ? (
                <div className="h-64 flex items-center justify-center text-xs text-slate-400">Tidak ada data metode pembayaran.</div>
              ) : (
                <div className="h-64 w-full flex flex-col items-center justify-center">
                  <ResponsiveContainer width="100%" height={180}>
                    <PieChart>
                      <Pie data={paymentMethodData} cx="50%" cy="50%" innerRadius={45} outerRadius={75} paddingAngle={4} dataKey="value">
                        {paymentMethodData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                      </Pie>
                      <Tooltip formatter={(val: any) => formatRupiah(Number(val))} contentStyle={{ borderRadius: "12px", fontSize: "12px" }} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="flex flex-wrap justify-center gap-3 mt-2 text-[11px]">
                    {paymentMethodData.map((it) => (
                      <div key={it.name} className="flex items-center gap-1.5">
                        <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: it.color }} />
                        <span className="text-slate-600">{it.name}: <strong>{formatRupiah(it.value)}</strong></span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-2xs border border-slate-200/80 p-1 mt-4">
            {loading ? (
              <div className="p-12 flex justify-center items-center gap-2 text-slate-400 text-sm">
                <Loader2 className="h-5 w-5 animate-spin text-emerald-600" />
                <span>Memuat data laporan...</span>
              </div>
            ) : filteredTransactions.length === 0 ? (
              <div className="p-10 text-center text-xs text-slate-400">Tidak ada transaksi ditemukan pada rentang tanggal ini.</div>
            ) : (
              <DataTable
                columns={columns}
                data={filteredTransactions}
                searchKey="invoiceNumber"
                searchPlaceholder="Cari no. faktur..."
              />
            )}
          </div>
        </div>

        <ReceiptModal
          isOpen={isReceiptOpen}
          onClose={() => setIsReceiptOpen(false)}
          transaction={selectedTrx}
          shopProfile={shopProfile}
        />
      </FeatureGate>
    </DashboardLayout>
  );
}
