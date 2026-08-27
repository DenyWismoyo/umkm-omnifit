"use client";

import React, { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useAuth } from "@/context/AuthContext";
import { subscribePurchaseOrders, receivePurchaseOrder } from "@/services/firestore";
import { PurchaseOrder } from "@/types";
import { PageHeader } from "@/components/common/PageHeader";
import { FeatureGate } from "@/components/common/FeatureGate";
import { POCard } from "@/components/retail/POCard";
import { Button } from "@/components/ui/button";
import { Plus, Search } from "lucide-react";
import { toast } from "sonner";

export default function PurchaseOrdersPage() {
  const { user, storeOwnerUid } = useAuth();
  const activeUid = storeOwnerUid || user?.uid;

  const [pos, setPos] = useState<PurchaseOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (!activeUid) return;
    const unsub = subscribePurchaseOrders(activeUid, (list) => {
      setPos(list as PurchaseOrder[]);
      setLoading(false);
    });
    return () => unsub();
  }, [activeUid]);

  const handleReceive = async (po: PurchaseOrder) => {
    if (!activeUid) return;
    try {
      await receivePurchaseOrder(activeUid, po.id, po.items);
      toast.success("Barang diterima! Stok dan HPP telah diupdate otomatis.");
    } catch (e: any) {
      toast.error(e.message || "Gagal mengupdate stok.");
    }
  };

  const filtered = pos.filter(p => 
    p.supplierName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.poNumber.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <DashboardLayout>
      <FeatureGate
        requiredTier="pro"
        requiredIndustry={["retail"]}
        featureName="Purchase Orders (PO) ke Supplier"
        description="Kelola belanja stok grosir, tracking HPP (Harga Pokok Penjualan) dinamis, dan auto-update stok."
      >
        <div className="space-y-4 sm:space-y-6 max-w-7xl mx-auto pb-12">
          <PageHeader
            title="Pembelian Stok (PO)"
            description="Lacak pemesanan barang ke supplier dan update inventaris otomatis."
            actions={
              <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">
                <Plus className="mr-2 h-4 w-4" /> Buat PO Baru
              </Button>
            }
          />

          <div className="flex bg-white p-3 rounded-2xl border border-slate-200 shadow-2xs">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Cari nomor PO atau nama supplier..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9.5 pr-4 h-9 rounded-xl border border-slate-200 bg-slate-50/80 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filtered.map(po => <POCard key={po.id} po={po} onReceive={handleReceive} />)}
            {!loading && filtered.length === 0 && (
              <div className="col-span-full py-12 text-center text-slate-500">
                Belum ada histori Purchase Order.
              </div>
            )}
          </div>
        </div>
      </FeatureGate>
    </DashboardLayout>
  );
}
