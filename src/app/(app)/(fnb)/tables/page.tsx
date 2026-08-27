"use client";

import React, { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useAuth } from "@/context/AuthContext";
import { RestaurantTable } from "@/types";
import { PageHeader } from "@/components/common/PageHeader";
import { FeatureGate } from "@/components/common/FeatureGate";
import { Button } from "@/components/ui/button";
import { Plus, LayoutDashboard, Users, Clock, ReceiptText } from "lucide-react";
import { subscribeTables, addTable, updateTableStatus } from "@/services/firestore";
import { cn } from "@/lib/utils";

export default function TableManagementPage() {
  const { user, storeOwnerUid } = useAuth();
  const activeUid = storeOwnerUid || user?.uid;

  const [tables, setTables] = useState<RestaurantTable[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!activeUid) return;
    const unsub = subscribeTables(activeUid, (data) => {
      setTables(data as RestaurantTable[]);
      setLoading(false);
    });
    return () => unsub();
  }, [activeUid]);

  const handleAddTable = async () => {
    if (!activeUid) return;
    const tableNumber = prompt("Masukkan Nomor/Nama Meja:");
    if (!tableNumber) return;
    
    await addTable(activeUid, {
      tableNumber,
      capacity: 4,
      status: "available",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "available": return "bg-emerald-50 border-emerald-200 text-emerald-800";
      case "occupied": return "bg-rose-50 border-rose-200 text-rose-800";
      case "reserved": return "bg-amber-50 border-amber-200 text-amber-800";
      default: return "bg-slate-50 border-slate-200 text-slate-800";
    }
  };

  return (
    <DashboardLayout>
      <FeatureGate
        requiredTier="pro"
        requiredIndustry={["fnb", "coffeeshop", "universal"]}
        featureName="Manajemen Meja (Table Management)"
        description="Fitur untuk memantau meja kosong, terisi, dan menghubungkan pesanan langsung ke meja."
      >
        <div className="space-y-6 max-w-5xl mx-auto pb-12">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <PageHeader
              title="Denah Meja"
              description="Kelola status meja dan integrasi pesanan dine-in."
            />
            <Button onClick={handleAddTable} className="bg-emerald-600 hover:bg-emerald-700 font-bold text-white shadow-lg shadow-emerald-500/20 rounded-xl">
              <Plus className="w-4 h-4 mr-2" /> Tambah Meja
            </Button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {loading ? (
              [...Array(8)].map((_, i) => (
                <div key={i} className="h-32 bg-slate-100 animate-pulse rounded-2xl"></div>
              ))
            ) : tables.length === 0 ? (
              <div className="col-span-full py-12 text-center border-2 border-dashed border-slate-200 rounded-3xl">
                <LayoutDashboard className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <h3 className="font-bold text-slate-700">Belum Ada Meja</h3>
                <p className="text-sm text-slate-500 mb-4">Mulai dengan menambahkan meja pertama Anda.</p>
                <Button onClick={handleAddTable} variant="outline" className="rounded-xl font-bold">
                  Buat Meja
                </Button>
              </div>
            ) : (
              tables.map((table) => (
                <div
                  key={table.id}
                  className={cn(
                    "p-4 rounded-2xl border-2 transition-all cursor-pointer hover:-translate-y-1 shadow-sm",
                    getStatusColor(table.status)
                  )}
                  onClick={() => {
                    const cycleStatus = table.status === "available" ? "occupied" : table.status === "occupied" ? "reserved" : "available";
                    updateTableStatus(activeUid!, table.id, { status: cycleStatus });
                  }}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-black text-xl">{table.tableNumber}</h3>
                      <p className="text-[10px] font-bold uppercase tracking-wider opacity-70">
                        {table.status}
                      </p>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-white/50 flex items-center justify-center">
                      <Users className="w-4 h-4 opacity-70" />
                    </div>
                  </div>
                  
                  {table.status === "occupied" && (
                    <div className="mt-4 pt-4 border-t border-current/10 space-y-2">
                      <div className="flex items-center text-xs font-medium">
                        <ReceiptText className="w-3 h-3 mr-2 opacity-70" />
                        Aktif
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </FeatureGate>
    </DashboardLayout>
  );
}
