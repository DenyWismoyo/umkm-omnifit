"use client";

import React, { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useAuth } from "@/context/AuthContext";
import { subscribeAppointments, subscribeStylists } from "@/services/firestore";
import { Appointment, Stylist } from "@/types";
import { PageHeader } from "@/components/common/PageHeader";
import { FeatureGate } from "@/components/common/FeatureGate";
import { AppointmentCard } from "@/components/salon/AppointmentCard";
import { Button } from "@/components/ui/button";
import { Plus, Search, Calendar } from "lucide-react";
import { NewAppointmentModal } from "@/components/salon/NewAppointmentModal";

export default function AppointmentsPage() {
  const { user, storeOwnerUid } = useAuth();
  const activeUid = storeOwnerUid || user?.uid;

  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [stylists, setStylists] = useState<Stylist[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (!activeUid) return;
    const unsubAppt = subscribeAppointments(activeUid, (list) => {
      setAppointments(list as Appointment[]);
      setLoading(false);
    });
    const unsubStylists = subscribeStylists(activeUid, (list) => {
      setStylists(list as Stylist[]);
    });
    
    return () => {
      unsubAppt();
      unsubStylists();
    };
  }, [activeUid]);

  const filtered = appointments.filter(a => 
    a.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.stylistName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <DashboardLayout>
      <FeatureGate
        requiredTier="pro"
        requiredIndustry={["salon"]}
        featureName="Sistem Booking & Reservasi"
        description="Jadwalkan booking pelanggan tanpa takut bentrok jadwal antar kapster."
      >
        <div className="space-y-4 sm:space-y-6 max-w-7xl mx-auto pb-12">
          <PageHeader
            title="Reservasi & Kalender"
            description="Manajemen antrean booking dan Walk-in pelanggan salon."
            actions={
              <Button onClick={() => setIsModalOpen(true)} className="bg-rose-600 hover:bg-rose-700 text-white shadow-lg shadow-rose-500/20">
                <Plus className="mr-2 h-4 w-4" /> Reservasi Baru
              </Button>
            }
          />

          <div className="flex flex-col sm:flex-row bg-white p-3 rounded-2xl border border-slate-200 shadow-2xs gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Cari pelanggan atau kapster..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9.5 pr-4 h-9 rounded-xl border border-slate-200 bg-slate-50/80 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>
            <Button variant="outline" className="h-9 border-slate-200 text-slate-600 font-bold text-xs">
              <Calendar className="mr-2 h-4 w-4" /> Mode Kalender
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map(a => <AppointmentCard key={a.id} appointment={a} />)}
            {!loading && filtered.length === 0 && (
              <div className="col-span-full py-12 text-center text-slate-500">
                Belum ada reservasi aktif.
              </div>
            )}
          </div>
        </div>

        <NewAppointmentModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          stylists={stylists} 
          services={[]} 
        />
      </FeatureGate>
    </DashboardLayout>
  );
}
