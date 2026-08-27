"use client";

import React, { useState, useEffect, useMemo } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useAuth } from "@/context/AuthContext";
import { getExpenses, createExpense, deleteExpense } from "@/services/firestore";
import { Expense } from "@/types";
import { formatRupiah } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/common/PageHeader";
import { FeatureGate } from "@/components/common/FeatureGate";
import {
  Plus,
  TrendingDown,
  Trash2,
  Calendar,
  FileText,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { DataTable } from "@/components/shared/data-display/DataTable";
import { ExpenseFormDialog, ExpenseFormValues } from "@/components/expenses/ExpenseFormDialog";
import { ColumnDef } from "@tanstack/react-table";

export default function ExpensesPage() {
  const { user } = useAuth();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);

  // Form Modal
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Month Filter
  const currentMonthStr = new Date().toISOString().slice(0, 7);
  const [selectedMonth, setSelectedMonth] = useState(currentMonthStr);

  const loadExpenses = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const data = await getExpenses(user.uid);
      setExpenses(data);
    } catch (err) {
      console.error(err);
      toast.error("Gagal memuat catatan pengeluaran.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadExpenses();
  }, [user]);

  const handleSaveExpense = async (data: ExpenseFormValues) => {
    if (!user) return;

    try {
      await createExpense(user.uid, {
        date: data.date,
        category: data.category,
        amount: data.amount,
        description: data.description || data.category,
      });

      toast.success("Pengeluaran berhasil dicatat!");
      await loadExpenses();
    } catch (err: any) {
      toast.error("Gagal menyimpan: " + err.message);
      throw err;
    }
  };

  const handleDeleteExpense = async (id: string, desc: string) => {
    if (!user) return;
    if (confirm(`Hapus catatan pengeluaran "${desc}"?`)) {
      try {
        await deleteExpense(user.uid, id);
        toast.success("Pengeluaran berhasil dihapus.");
        await loadExpenses();
      } catch (err) {
        toast.error("Gagal menghapus.");
      }
    }
  };

  // Filtered by selected month
  const filteredExpenses = useMemo(() => {
    return expenses.filter((e) => e.date.startsWith(selectedMonth));
  }, [expenses, selectedMonth]);

  // Total for selected month
  const totalMonthExpense = useMemo(() => {
    return filteredExpenses.reduce((acc, curr) => acc + curr.amount, 0);
  }, [filteredExpenses]);

  // DataTable Columns
  const columns: ColumnDef<Expense>[] = [
    {
      accessorKey: "date",
      header: "Tanggal",
      cell: ({ row }) => (
        <span className="font-semibold text-slate-900">
          {new Date(row.original.date).toLocaleDateString("id-ID", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })}
        </span>
      ),
    },
    {
      accessorKey: "category",
      header: "Kategori Beban",
      cell: ({ row }) => (
        <span className="rounded-lg bg-rose-50 border border-rose-100 text-rose-800 font-semibold px-2 py-0.5 text-[11px]">
          {row.original.category}
        </span>
      ),
    },
    {
      accessorKey: "description",
      header: "Keterangan / Rincian",
      cell: ({ row }) => <span className="text-slate-800">{row.original.description}</span>,
    },
    {
      accessorKey: "amount",
      header: () => <div className="text-right">Nominal Biaya</div>,
      cell: ({ row }) => (
        <div className="text-right font-black text-rose-600 text-sm">
          {formatRupiah(row.original.amount)}
        </div>
      ),
    },
    {
      id: "actions",
      header: () => <div className="text-right">Aksi</div>,
      cell: ({ row }) => {
        const exp = row.original;
        return (
          <div className="flex justify-end">
            <Button
              variant="ghost"
              size="iconSm"
              onClick={() => handleDeleteExpense(exp.id, exp.description)}
              title="Hapus Catatan"
              className="touch-press"
            >
              <Trash2 className="h-4 w-4 text-slate-400 hover:text-rose-600" />
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
        featureName="Pencatatan Biaya & Pengeluaran Toko"
        description="Catat seluruh beban operasional, sewa, gaji karyawan, listrik/gas, dan kas kecil usaha agar perhitungan laba bersih toko akurat."
      >
        <div className="space-y-6">
          <PageHeader
            title="Pencatatan Biaya & Pengeluaran"
            description="Catat setiap beban operasional usaha agar perhitungan laba bersih akurat."
            actions={
              <Button
                variant="default"
                size="sm"
                onClick={() => setIsModalOpen(true)}
                className="touch-press gap-2 h-9 text-xs font-bold shadow-xs bg-rose-600 hover:bg-rose-700 text-white"
              >
                <Plus className="h-4 w-4" />
                <span>Catat Pengeluaran</span>
              </Button>
            }
          />

          {/* Summary Card & Month Selector */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2 rounded-2xl border border-rose-100 bg-gradient-to-br from-rose-50/80 to-orange-50/60 p-5 flex items-center justify-between shadow-sm">
              <div>
                <span className="text-xs font-bold text-rose-800 uppercase tracking-wider">
                  Total Beban Pengeluaran Bulan Ini
                </span>
                <p className="text-2xl sm:text-3xl font-black text-rose-950 mt-1">
                  {formatRupiah(totalMonthExpense)}
                </p>
                <p className="text-xs text-rose-700/80 mt-1">
                  {filteredExpenses.length} transaksi pengeluaran pada periode ini
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-500/10 text-rose-600">
                <TrendingDown className="h-6 w-6" />
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 flex flex-col justify-center space-y-2 shadow-sm">
              <label className="text-xs font-semibold text-slate-500 flex items-center gap-1.5">
                <Calendar className="h-4 w-4 text-slate-400" />
                <span>Filter Periode Bulan:</span>
              </label>
              <Input
                type="month"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="h-10 text-xs font-bold text-slate-800"
              />
            </div>
          </div>

          {/* Expenses Display */}
          <div className="bg-white rounded-2xl shadow-2xs border border-slate-200/80 p-1">
            {loading ? (
              <div className="p-12 flex justify-center items-center gap-2 text-slate-400 text-sm">
                <Loader2 className="h-5 w-5 animate-spin text-emerald-600" />
                <span>Memuat data pengeluaran...</span>
              </div>
            ) : filteredExpenses.length === 0 ? (
              <div className="p-10 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 mb-3">
                  <FileText className="h-6 w-6" />
                </div>
                <h4 className="font-bold text-slate-800 text-sm">
                  Belum Ada Pengeluaran di Bulan Ini
                </h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-4">
                  Catat biaya sewa, gaji, listrik, atau bahan baku untuk menghitung laba bersih.
                </p>
                <Button
                  size="sm"
                  onClick={() => setIsModalOpen(true)}
                  className="touch-press gap-2 text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white"
                >
                  <Plus className="h-4 w-4" />
                  <span>Catat Pengeluaran</span>
                </Button>
              </div>
            ) : (
              <DataTable
                columns={columns}
                data={filteredExpenses}
                searchKey="description"
                searchPlaceholder="Cari keterangan..."
              />
            )}
          </div>
        </div>

        <ExpenseFormDialog
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveExpense}
        />
      </FeatureGate>
    </DashboardLayout>
  );
}
