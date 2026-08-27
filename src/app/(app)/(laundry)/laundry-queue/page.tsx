"use client";

import React, { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useAuth } from "@/context/AuthContext";
import { subscribeLaundryOrders, updateLaundryStatus } from "@/services/firestore";
import { LaundryOrder } from "@/types";
import { PageHeader } from "@/components/common/PageHeader";
import { FeatureGate } from "@/components/common/FeatureGate";
import { LaundryKanbanColumn } from "@/components/laundry/LaundryKanbanColumn";
import { toast } from "sonner";
import { Search } from "lucide-react";

export default function LaundryQueuePage() {
  const { user, storeOwnerUid } = useAuth();
  const activeUid = storeOwnerUid || user?.uid;

  const [orders, setOrders] = useState<LaundryOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (!activeUid) return;
    const unsub = subscribeLaundryOrders(activeUid, (orderList) => {
      setOrders(orderList as LaundryOrder[]);
      setLoading(false);
    });
    return () => unsub();
  }, [activeUid]);

  const handleUpdateStatus = async (orderId: string, status: string) => {
    if (!activeUid) return;
    try {
      await updateLaundryStatus(activeUid, orderId, status);
      toast.success("Status laundry diperbarui.");
    } catch (err) {
      toast.error("Gagal mengubah status.");
    }
  };

  const filteredOrders = orders.filter(
    (o) =>
      o.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.customerName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const pendingOrders = filteredOrders.filter((o) => o.status === "pending");
  const washingOrders = filteredOrders.filter((o) => o.status === "washing");
  const ironingOrders = filteredOrders.filter((o) => o.status === "ironing");
  const readyOrders = filteredOrders.filter((o) => o.status === "ready");

  return (
    <DashboardLayout>
      <FeatureGate
        requiredTier="pro"
        requiredIndustry={["laundry"]}
        featureName="Sistem Manajemen Laundry"
        description="Kelola alur kerja laundry dari antrean, mesin cuci, setrika, hingga siap diambil."
      >
        <div className="space-y-4 sm:space-y-6 max-w-7xl mx-auto pb-12">
          <PageHeader
            title="Antrean Laundry (Kiloan & Satuan)"
            description="Lacak proses pakaian pelanggan secara real-time."
          />

          <div className="flex bg-white p-3 rounded-2xl border border-slate-200 shadow-2xs">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Cari nomor nota atau nama pelanggan..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9.5 pr-4 h-9 rounded-xl border border-slate-200 bg-slate-50/80 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 items-start">
            <LaundryKanbanColumn
              variant="pending"
              title="Menunggu"
              count={pendingOrders.length}
              subtitle="Antrean Masuk"
              orders={pendingOrders}
              emptyMessage="Tidak ada antrean baru."
              onUpdateStatus={handleUpdateStatus}
            />
            <LaundryKanbanColumn
              variant="washing"
              title="Proses Cuci"
              count={washingOrders.length}
              subtitle="Di Mesin / Basah"
              orders={washingOrders}
              emptyMessage="Mesin cuci sedang kosong."
              onUpdateStatus={handleUpdateStatus}
            />
            <LaundryKanbanColumn
              variant="ironing"
              title="Setrika & Lipat"
              count={ironingOrders.length}
              subtitle="Proses Akhir"
              orders={ironingOrders}
              emptyMessage="Tidak ada yang disetrika."
              onUpdateStatus={handleUpdateStatus}
            />
            <LaundryKanbanColumn
              variant="ready"
              title="Selesai & Rak"
              count={readyOrders.length}
              subtitle="Siap Diambil"
              orders={readyOrders}
              emptyMessage="Semua laundry sudah diambil."
              onUpdateStatus={handleUpdateStatus}
            />
          </div>
        </div>
      </FeatureGate>
    </DashboardLayout>
  );
}
