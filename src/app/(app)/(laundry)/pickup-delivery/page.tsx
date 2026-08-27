"use client";

import React, { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useAuth } from "@/context/AuthContext";
import { PickupDeliveryOrder } from "@/types";
import { PageHeader } from "@/components/common/PageHeader";
import { FeatureGate } from "@/components/common/FeatureGate";
import { Button } from "@/components/ui/button";
import { Plus, Truck, MapPin, Phone, CheckCircle2 } from "lucide-react";
import { subscribePickupDeliveries, addPickupDelivery, updatePickupDeliveryStatus } from "@/services/firestore";
import { format, parseISO } from "date-fns";
import { id } from "date-fns/locale";

export default function PickupDeliveryPage() {
  const { user, storeOwnerUid } = useAuth();
  const activeUid = storeOwnerUid || user?.uid;

  const [deliveries, setDeliveries] = useState<PickupDeliveryOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!activeUid) return;
    const unsub = subscribePickupDeliveries(activeUid, (list) => {
      setDeliveries(list as PickupDeliveryOrder[]);
      setLoading(false);
    });
    return () => unsub();
  }, [activeUid]);

  const handleAdd = async () => {
    if (!activeUid) return;
    const customerName = prompt("Nama Pelanggan:");
    if (!customerName) return;
    const address = prompt("Alamat Jemput:");
    if (!address) return;
    
    await addPickupDelivery(activeUid, {
      customerName,
      customerPhone: "08XX",
      address,
      pickupTime: new Date().toISOString(),
      status: "pending",
      driverName: "Kurir Internal"
    });
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
      case "pending": return <span className="px-2 py-1 bg-amber-100 text-amber-800 text-[10px] font-bold rounded-full">Menunggu Kurir</span>;
      case "picking_up": return <span className="px-2 py-1 bg-blue-100 text-blue-800 text-[10px] font-bold rounded-full">Sedang Dijemput</span>;
      case "at_laundry": return <span className="px-2 py-1 bg-purple-100 text-purple-800 text-[10px] font-bold rounded-full">Di Laundry</span>;
      case "delivering": return <span className="px-2 py-1 bg-indigo-100 text-indigo-800 text-[10px] font-bold rounded-full">Sedang Diantar</span>;
      case "completed": return <span className="px-2 py-1 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded-full">Selesai</span>;
      default: return null;
    }
  };

  return (
    <DashboardLayout>
      <FeatureGate
        requiredTier="pro"
        requiredIndustry={["laundry"]}
        featureName="Manajemen Antar Jemput (Pickup & Delivery)"
        description="Kelola jadwal penjemputan dan pengantaran laundry secara sistematis dengan rute kurir."
      >
        <div className="space-y-6 max-w-5xl mx-auto pb-12">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <PageHeader
              title="Antar Jemput Laundry"
              description="Pantau status kurir dan antrean penjemputan pelanggan."
            />
            <Button onClick={handleAdd} className="bg-sky-600 hover:bg-sky-700 font-bold text-white shadow-lg shadow-sky-500/20 rounded-xl">
              <Plus className="w-4 h-4 mr-2" /> Jadwal Baru
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {loading ? (
              [...Array(3)].map((_, i) => (
                <div key={i} className="h-48 bg-slate-100 animate-pulse rounded-2xl"></div>
              ))
            ) : deliveries.length === 0 ? (
              <div className="col-span-full py-16 text-center border-2 border-dashed border-slate-200 rounded-3xl">
                <Truck className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <h3 className="font-bold text-slate-700">Belum Ada Jadwal</h3>
                <p className="text-sm text-slate-500 mb-4">Mulai dengan membuat jadwal penjemputan pelanggan.</p>
              </div>
            ) : (
              deliveries.map(d => (
                <div key={d.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col gap-3 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-3">
                    {getStatusBadge(d.status)}
                  </div>
                  
                  <div>
                    <h4 className="font-bold text-slate-800 text-lg">{d.customerName}</h4>
                    <div className="flex items-center text-xs text-slate-500 mt-1">
                      <Phone className="w-3 h-3 mr-1" /> {d.customerPhone}
                    </div>
                  </div>

                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 flex gap-3 text-sm">
                    <MapPin className="w-4 h-4 text-sky-500 shrink-0 mt-0.5" />
                    <p className="text-slate-600 leading-tight">{d.address}</p>
                  </div>

                  <div className="mt-auto pt-3 border-t border-slate-100 flex justify-between items-center">
                    <div className="text-[10px] text-slate-500 font-medium">
                      Kurir: <span className="font-bold text-slate-700">{d.driverName}</span>
                    </div>
                    {d.status === "pending" && (
                      <Button size="sm" onClick={() => updatePickupDeliveryStatus(activeUid!, d.id, "picking_up")} className="h-7 text-[10px] bg-sky-600 hover:bg-sky-700 text-white rounded-lg px-3">
                        Mulai Jemput
                      </Button>
                    )}
                    {d.status === "picking_up" && (
                      <Button size="sm" onClick={() => updatePickupDeliveryStatus(activeUid!, d.id, "at_laundry")} className="h-7 text-[10px] bg-purple-600 hover:bg-purple-700 text-white rounded-lg px-3">
                        Tiba di Laundry
                      </Button>
                    )}
                    {d.status === "at_laundry" && (
                      <Button size="sm" onClick={() => updatePickupDeliveryStatus(activeUid!, d.id, "delivering")} className="h-7 text-[10px] bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg px-3">
                        Antar Kembali
                      </Button>
                    )}
                    {d.status === "delivering" && (
                      <Button size="sm" onClick={() => updatePickupDeliveryStatus(activeUid!, d.id, "completed")} className="h-7 text-[10px] bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg px-3">
                        <CheckCircle2 className="w-3 h-3 mr-1" /> Selesai
                      </Button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </FeatureGate>
    </DashboardLayout>
  );
}
