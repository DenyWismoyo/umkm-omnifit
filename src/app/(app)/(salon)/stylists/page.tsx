"use client";

import React, { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useAuth } from "@/context/AuthContext";
import { subscribeStylists } from "@/services/firestore";
import { Stylist } from "@/types";
import { PageHeader } from "@/components/common/PageHeader";
import { FeatureGate } from "@/components/common/FeatureGate";
import { StylistCard } from "@/components/salon/StylistCard";
import { Button } from "@/components/ui/button";
import { Plus, Search } from "lucide-react";

export default function StylistsPage() {
  const { user, storeOwnerUid } = useAuth();
  const activeUid = storeOwnerUid || user?.uid;

  const [stylists, setStylists] = useState<Stylist[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (!activeUid) return;
    const unsub = subscribeStylists(activeUid, (list) => {
      setStylists(list as Stylist[]);
      setLoading(false);
    });
    return () => unsub();
  }, [activeUid]);

  const filtered = stylists.filter(s => s.name.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <DashboardLayout>
      <FeatureGate
        requiredTier="pro"
        requiredIndustry={["salon"]}
        featureName="Manajemen Kapster & Komisi"
        description="Kelola jadwal dan otomatisasi komisi (bagi hasil) untuk kapster/stylist."
      >
        <div className="space-y-4 sm:space-y-6 max-w-7xl mx-auto pb-12">
          <PageHeader
            title="Daftar Kapster (Stylist)"
            description="Manajemen staf salon, jadwal kerja, dan persentase komisi layanan."
            actions={
              <Button className="bg-rose-600 hover:bg-rose-700 text-white">
                <Plus className="mr-2 h-4 w-4" /> Kapster Baru
              </Button>
            }
          />

          <div className="flex bg-white p-3 rounded-2xl border border-slate-200 shadow-2xs">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Cari nama kapster..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9.5 pr-4 h-9 rounded-xl border border-slate-200 bg-slate-50/80 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filtered.map(s => <StylistCard key={s.id} stylist={s} />)}
            {!loading && filtered.length === 0 && (
              <div className="col-span-full py-12 text-center text-slate-500">
                Belum ada data kapster.
              </div>
            )}
          </div>
        </div>
      </FeatureGate>
    </DashboardLayout>
  );
}
