"use client";

import React, { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useAuth } from "@/context/AuthContext";
import { SalonService } from "@/types";
import { PageHeader } from "@/components/common/PageHeader";
import { FeatureGate } from "@/components/common/FeatureGate";
import { ServiceCard } from "@/components/salon/ServiceCard";
import { Button } from "@/components/ui/button";
import { Plus, Search } from "lucide-react";
import { collection, query, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function ServicesPage() {
  const { user, storeOwnerUid } = useAuth();
  const activeUid = storeOwnerUid || user?.uid;

  const [services, setServices] = useState<SalonService[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (!activeUid) return;
    const q = query(collection(db, "users", activeUid, "salon_services"));
    const unsub = onSnapshot(q, (snap) => {
      setServices(snap.docs.map(d => ({ id: d.id, ...d.data() } as SalonService)));
      setLoading(false);
    });
    return () => unsub();
  }, [activeUid]);

  const filtered = services.filter(s => s.name.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <DashboardLayout>
      <FeatureGate
        requiredTier="basic" // Basic can access
        requiredIndustry={["salon"]}
        featureName="Katalog Layanan & Treatment"
        description="Kelola daftar layanan salon (Haircut, Creambath, Spa) beserta durasi & harga."
      >
        <div className="space-y-4 sm:space-y-6 max-w-7xl mx-auto pb-12">
          <PageHeader
            title="Layanan & Treatment"
            description="Daftar layanan yang ditawarkan beserta estimasi waktu pengerjaan."
            actions={
              <Button className="bg-rose-600 hover:bg-rose-700 text-white">
                <Plus className="mr-2 h-4 w-4" /> Layanan Baru
              </Button>
            }
          />

          <div className="flex bg-white p-3 rounded-2xl border border-slate-200 shadow-2xs">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Cari layanan (misal: Haircut)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9.5 pr-4 h-9 rounded-xl border border-slate-200 bg-slate-50/80 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filtered.map(s => <ServiceCard key={s.id} service={s} />)}
            {!loading && filtered.length === 0 && (
              <div className="col-span-full py-12 text-center text-slate-500">
                Belum ada data layanan salon.
              </div>
            )}
          </div>
        </div>
      </FeatureGate>
    </DashboardLayout>
  );
}
