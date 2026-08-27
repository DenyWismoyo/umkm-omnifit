"use client";

import React, { useState, useEffect, useMemo } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useAuth } from "@/context/AuthContext";
import {
  getCustomers,
  createCustomer,
  settleCustomerDebt,
  getDebtPayments,
} from "@/services/firestore";
import { Customer, DebtPayment } from "@/types";
import { formatRupiah } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/common/PageHeader";
import { FeatureGate } from "@/components/common/FeatureGate";
import { DataTable } from "@/components/shared/data-display/DataTable";
import {
  Users,
  Plus,
  CheckCircle,
  Banknote,
  MessageCircle,
  Loader2,
  DollarSign,
} from "lucide-react";
import { toast } from "sonner";
import { ColumnDef } from "@tanstack/react-table";
import {
  AddCustomerModal,
  AddCustomerFormValues,
  SettleDebtModal,
  SettleDebtFormValues,
} from "@/components/debts/DebtModals";

export default function DebtsPage() {
  const { user, storeOwnerUid } = useAuth();
  const activeUid = storeOwnerUid || user?.uid;
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [payments, setPayments] = useState<DebtPayment[]>([]);
  const [loading, setLoading] = useState(true);

  // Tabs
  const [activeTab, setActiveTab] = useState<"has_debt" | "all" | "history">("has_debt");

  // Modals
  const [isAddCustModalOpen, setIsAddCustModalOpen] = useState(false);
  const [isSettleModalOpen, setIsSettleModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  const loadData = async () => {
    if (!activeUid) return;
    try {
      setLoading(true);
      const [custList, payList] = await Promise.all([
        getCustomers(activeUid),
        getDebtPayments(activeUid),
      ]);
      setCustomers(custList);
      setPayments(payList);
    } catch (err) {
      console.error(err);
      toast.error("Gagal memuat data pelanggan dan kasbon.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [activeUid]);

  const handleAddCustomer = async (data: AddCustomerFormValues) => {
    if (!activeUid) return;
    try {
      await createCustomer(activeUid, {
        name: data.name,
        phone: data.phone || undefined,
        address: data.address || undefined,
        totalDebt: 0,
        totalSpent: 0,
      });
      toast.success(`Pelanggan "${data.name}" berhasil didaftarkan!`);
      await loadData();
    } catch (err: any) {
      toast.error("Gagal menyimpan pelanggan: " + err.message);
      throw err;
    }
  };

  const handleProcessSettle = async (data: SettleDebtFormValues) => {
    if (!activeUid || !selectedCustomer) return;
    if (data.amount > selectedCustomer.totalDebt) {
      toast.warning("Jumlah pembayaran melebihi sisa hutang!");
    }
    try {
      await settleCustomerDebt(
        activeUid,
        selectedCustomer.id,
        selectedCustomer.name,
        data.amount,
        data.method,
        data.notes
      );
      toast.success(`Pembayaran ${formatRupiah(data.amount)} dari ${selectedCustomer.name} berhasil dicatat!`);
      await loadData();
    } catch (err: any) {
      toast.error("Gagal mencatat pelunasan: " + err.message);
      throw err;
    }
  };

  const handleSendReminder = (cust: Customer) => {
    if (!cust.phone) {
      toast.error("Nomor WhatsApp pelanggan belum terdaftar.");
      return;
    }
    let phone = cust.phone.replace(/[^0-9]/g, "");
    if (phone.startsWith("0")) phone = "62" + phone.slice(1);
    const message = `Halo Kak ${cust.name}, ini pengingat ramah dari toko kami mengenai catatan kasbon/piutang sebesar *${formatRupiah(cust.totalDebt)}*. Mohon konfirmasi untuk waktu pelunasannya ya. Terima kasih banyak!`;
    const url = `https://api.whatsapp.com/send?phone=${phone}&text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
  };

  const totalReceivables = useMemo(() => {
    return customers.reduce((acc, c) => acc + (c.totalDebt > 0 ? c.totalDebt : 0), 0);
  }, [customers]);

  const totalCustomersWithDebt = useMemo(() => {
    return customers.filter((c) => c.totalDebt > 0).length;
  }, [customers]);

  const filteredCustomers = useMemo(() => {
    if (activeTab === "has_debt") {
      return customers.filter((c) => c.totalDebt > 0);
    }
    return customers;
  }, [customers, activeTab]);

  // COLUMNS DEFINITION
  const customerColumns: ColumnDef<Customer>[] = [
    {
      accessorKey: "name",
      header: "Nama Pelanggan",
      cell: ({ row }) => (
        <div>
          <div className="font-bold text-slate-900 text-sm">{row.original.name}</div>
          {row.original.address && <p className="text-[10px] text-slate-400">{row.original.address}</p>}
        </div>
      ),
    },
    {
      accessorKey: "phone",
      header: "Nomor WhatsApp",
      cell: ({ row }) => <span className="text-slate-600 font-mono">{row.original.phone || "-"}</span>,
    },
    {
      accessorKey: "totalSpent",
      header: () => <div className="text-right">Total Belanja</div>,
      cell: ({ row }) => <div className="text-right font-medium text-slate-600">{formatRupiah(row.original.totalSpent)}</div>,
    },
    {
      accessorKey: "totalDebt",
      header: () => <div className="text-right">Sisa Hutang</div>,
      cell: ({ row }) => (
        <div className="text-right">
          {row.original.totalDebt > 0 ? (
            <span className="font-black text-amber-700 text-sm">{formatRupiah(row.original.totalDebt)}</span>
          ) : (
            <Badge variant="default" className="text-[9px] bg-emerald-100 text-emerald-800">Lunas</Badge>
          )}
        </div>
      ),
    },
    {
      id: "actions",
      header: () => <div className="text-right">Aksi</div>,
      cell: ({ row }) => {
        const c = row.original;
        return (
          <div className="flex justify-end gap-1.5">
            {c.totalDebt > 0 && c.phone && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleSendReminder(c)}
                className="touch-press h-8 text-[11px] font-bold text-emerald-700 border-emerald-300 hover:bg-emerald-50 gap-1 rounded-xl"
              >
                <MessageCircle className="h-3.5 w-3.5" />
                <span>WA</span>
              </Button>
            )}
            {c.totalDebt > 0 && (
              <Button
                variant="default"
                size="sm"
                onClick={() => {
                  setSelectedCustomer(c);
                  setIsSettleModalOpen(true);
                }}
                className="touch-press h-8 text-[11px] font-bold bg-amber-600 hover:bg-amber-700 text-white gap-1 rounded-xl"
              >
                <Banknote className="h-3.5 w-3.5" />
                <span>Pelunasan</span>
              </Button>
            )}
          </div>
        );
      },
    },
  ];

  const paymentColumns: ColumnDef<DebtPayment>[] = [
    {
      accessorKey: "createdAt",
      header: "Waktu Pembayaran",
      cell: ({ row }) => (
        <div className="text-xs font-semibold text-slate-800">
          {new Date(row.original.date).toLocaleString("id-ID", {
            day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit"
          })}
        </div>
      ),
    },
    {
      accessorKey: "customerName",
      header: "Nama Pelanggan",
      cell: ({ row }) => <span className="font-bold text-sm text-slate-900">{row.original.customerName}</span>,
    },
    {
      accessorKey: "paymentMethod",
      header: "Metode",
      cell: ({ row }) => (
        <Badge variant="outline" className="text-[9px] uppercase font-bold text-slate-600">
          {row.original.paymentMethod}
        </Badge>
      ),
    },
    {
      accessorKey: "notes",
      header: "Catatan",
      cell: ({ row }) => <span className="text-xs text-slate-500">{row.original.notes || "-"}</span>,
    },
    {
      accessorKey: "amountPaid",
      header: () => <div className="text-right">Nominal</div>,
      cell: ({ row }) => (
        <div className="text-right font-black text-emerald-600 text-sm">
          +{formatRupiah(row.original.amount)}
        </div>
      ),
    },
  ];

  return (
    <DashboardLayout>
      <FeatureGate
        requiredTier="pro"
        featureName="Buku Pelanggan & Piutang Kasbon"
        description="Pantau catatan kasbon pelanggan, kirim pengingat tagihan WhatsApp 1-klik, dan kelola histori pelunasan piutang toko."
      >
        <div className="space-y-6">
          <PageHeader
            title="Buku Piutang & Kasbon"
            description="Pantau catatan hutang pelanggan, kirim pengingat WhatsApp, dan catat pelunasan cicilan."
            actions={
              <Button
                variant="default"
                size="sm"
                onClick={() => setIsAddCustModalOpen(true)}
                className="touch-press gap-2 h-9 text-xs font-bold shadow-xs"
              >
                <Plus className="h-4 w-4" />
                <span>Daftar Pelanggan</span>
              </Button>
            }
          />

          {/* Stats Card */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="rounded-2xl border border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50/50 p-5 flex items-center justify-between shadow-sm">
              <div>
                <span className="text-xs font-bold text-amber-800 uppercase tracking-wider">Total Piutang Belum Lunas</span>
                <p className="text-2xl sm:text-3xl font-black text-amber-950 mt-1">{formatRupiah(totalReceivables)}</p>
                <p className="text-xs text-amber-700 mt-1">{totalCustomersWithDebt} pelanggan memiliki catatan hutang</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/15 text-amber-700">
                <DollarSign className="h-6 w-6" />
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 flex items-center justify-between shadow-sm">
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Pelanggan Terdaftar</span>
                <p className="text-2xl font-black text-slate-900 mt-1">{customers.length} Orang</p>
                <p className="text-xs text-slate-500 mt-1">Basis data pelanggan toko Anda</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-600">
                <Users className="h-6 w-6" />
              </div>
            </div>

            <div className="rounded-2xl border border-emerald-200 bg-emerald-50/50 p-5 flex items-center justify-between shadow-sm">
              <div>
                <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">Riwayat Pembayaran Kasbon</span>
                <p className="text-2xl font-black text-emerald-950 mt-1">{payments.length} Kali</p>
                <p className="text-xs text-emerald-700 mt-1">Tercatat di sistem pelunasan</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/20 text-emerald-700">
                <CheckCircle className="h-6 w-6" />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5 bg-white border border-slate-200 p-1.5 rounded-xl w-fit shadow-sm">
            <button
              onClick={() => setActiveTab("has_debt")}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${activeTab === "has_debt" ? "bg-amber-100 text-amber-900 shadow-sm" : "text-slate-600 hover:text-slate-900"}`}
            >
              Belum Lunas ({totalCustomersWithDebt})
            </button>
            <button
              onClick={() => setActiveTab("all")}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${activeTab === "all" ? "bg-slate-100 text-slate-900 shadow-sm" : "text-slate-600 hover:text-slate-900"}`}
            >
              Semua Pelanggan ({customers.length})
            </button>
            <button
              onClick={() => setActiveTab("history")}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${activeTab === "history" ? "bg-emerald-100 text-emerald-900 shadow-sm" : "text-slate-600 hover:text-slate-900"}`}
            >
              Riwayat Cicilan ({payments.length})
            </button>
          </div>

          <div className="bg-white rounded-2xl shadow-2xs border border-slate-200/80 p-1">
            {loading ? (
              <div className="p-12 flex justify-center items-center gap-2 text-slate-400 text-sm">
                <Loader2 className="h-5 w-5 animate-spin text-emerald-600" />
                <span>Memuat data...</span>
              </div>
            ) : activeTab === "history" ? (
              <DataTable
                columns={paymentColumns}
                data={payments}
                searchKey="customerName"
                searchPlaceholder="Cari nama pelanggan..."
              />
            ) : (
              <DataTable
                columns={customerColumns}
                data={filteredCustomers}
                searchKey="name"
                searchPlaceholder="Cari nama pelanggan..."
              />
            )}
          </div>
        </div>

        <AddCustomerModal
          isOpen={isAddCustModalOpen}
          onClose={() => setIsAddCustModalOpen(false)}
          onSave={handleAddCustomer}
        />
        
        <SettleDebtModal
          isOpen={isSettleModalOpen}
          onClose={() => { setIsSettleModalOpen(false); setSelectedCustomer(null); }}
          customer={selectedCustomer}
          onSave={handleProcessSettle}
        />
      </FeatureGate>
    </DashboardLayout>
  );
}
