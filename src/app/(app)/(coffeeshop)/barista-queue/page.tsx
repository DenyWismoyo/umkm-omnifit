"use client";

import React, { useState, useEffect, useMemo } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useAuth } from "@/context/AuthContext";
import {
  subscribeIncomingOrders,
  updateOrderStatus,
} from "@/services/firestore";
import { BaristaOrder, OrderStatus } from "@/types";
import { PageHeader } from "@/components/common/PageHeader";
import { FeatureGate } from "@/components/common/FeatureGate";
import { StatCard } from "@/components/common/StatCard";
import { Button } from "@/components/ui/button";
import {
  BellRing,
  Coffee,
  CheckCircle2,
  Utensils,
  Volume2,
  VolumeX,
  Search,
} from "lucide-react";
import { toast } from "sonner";
import { handlePrintKitchenTicket } from "@/lib/printUtils";
import { BaristaQueueColumn } from "@/components/coffeeshop/barista-queue/BaristaQueueColumn";

export default function BaristaQueuePage() {
  const { user, storeOwnerUid } = useAuth();
  const activeUid = storeOwnerUid || user?.uid;

  const [orders, setOrders] = useState<BaristaOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [knownOrderIds, setKnownOrderIds] = useState<Set<string>>(new Set());

  // Web Audio Chime Sound
  const playOrderChime = () => {
    if (!soundEnabled) return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
      osc.frequency.setValueAtTime(880, ctx.currentTime + 0.12); // A5
      gain.gain.setValueAtTime(0.35, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.45);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.5);
    } catch (e) {
      console.warn("Audio playback not allowed", e);
    }
  };

  useEffect(() => {
    if (!activeUid) return;

    // We reuse subscribeIncomingOrders but cast to BaristaOrder
    const unsub = subscribeIncomingOrders(activeUid, (orderList) => {
      setOrders(orderList as BaristaOrder[]);
      setLoading(false);

      // Trigger audio on new PENDING orders
      const pendingList = orderList.filter((o) => o.status === "PENDING");
      let hasNew = false;
      pendingList.forEach((o) => {
        if (!knownOrderIds.has(o.id)) hasNew = true;
      });

      if (hasNew && knownOrderIds.size > 0) {
        playOrderChime();
        toast.info("☕ Pesanan Kopi Baru Masuk!", { duration: 5000 });
      }

      setKnownOrderIds(new Set(orderList.map((o) => o.id)));
    });

    return () => unsub();
  }, [activeUid, knownOrderIds, soundEnabled]);

  const handleUpdateStatus = async (orderId: string, status: OrderStatus) => {
    if (!activeUid) return;
    try {
      await updateOrderStatus(activeUid, orderId, status);
      toast.success(`Status pesanan diperbarui.`);
    } catch (err) {
      toast.error("Gagal mengubah status pesanan.");
    }
  };

  // Filtered Orders
  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      return (
        o.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        o.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        o.tableNumber.toLowerCase().includes(searchQuery.toLowerCase())
      );
    });
  }, [orders, searchQuery]);

  const pendingOrders = filteredOrders.filter((o) => o.status === "PENDING");
  const makingOrders = filteredOrders.filter(
    (o) => o.status === "COOKING" || o.status === "ACCEPTED"
  );
  const readyOrders = filteredOrders.filter((o) => o.status === "READY");
  const completedOrders = filteredOrders.filter((o) => o.status === "COMPLETED");

  return (
    <DashboardLayout>
      <FeatureGate
        requiredTier="pro"
        requiredIndustry={["coffeeshop"]}
        featureName="Antrean Barista"
        description="Pantau antrean pesanan kopi, level es & gula, dan manage workflow Barista."
      >
        <div className="space-y-4 sm:space-y-6 max-w-7xl mx-auto pb-12">
          {/* Header */}
          <PageHeader
            title="Antrean Barista (KDS)"
            description="Layar pembuat kopi (Barista Display System) dengan detail Ice & Sugar Level."
            actions={
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setSoundEnabled(!soundEnabled)}
                className={`touch-press h-9 text-xs font-bold gap-1.5 ${
                  soundEnabled
                    ? "border-[#8B5E3C] bg-[#F9F5F0] text-[#3C2A21]"
                    : "border-slate-300 text-slate-500"
                }`}
              >
                {soundEnabled ? (
                  <>
                    <Volume2 className="h-3.5 w-3.5 text-[#8B5E3C] animate-pulse" />
                    <span>Suara Bell Aktif</span>
                  </>
                ) : (
                  <>
                    <VolumeX className="h-3.5 w-3.5" />
                    <span>Suara Bell Mati</span>
                  </>
                )}
              </Button>
            }
          />

          {/* 4 Stat Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
            <StatCard
              title="Pesanan Baru"
              value={pendingOrders.length}
              icon={BellRing}
              iconBgColor="bg-orange-100"
              iconColor="text-orange-700"
              valueColor={pendingOrders.length > 0 ? "text-orange-600 font-black" : undefined}
            />
            <StatCard
              title="Sedang Dibuat"
              value={makingOrders.length}
              icon={Coffee}
              iconBgColor="bg-[#EAE0D5]"
              iconColor="text-[#8B5E3C]"
            />
            <StatCard
              title="Siap Dipanggil"
              value={readyOrders.length}
              icon={CheckCircle2}
              iconBgColor="bg-emerald-100"
              iconColor="text-emerald-700"
            />
            <StatCard
              title="Selesai / Lunas"
              value={completedOrders.length}
              icon={Utensils}
              iconBgColor="bg-slate-100"
              iconColor="text-slate-700"
            />
          </div>

          {/* Search Bar */}
          <div className="flex bg-white p-3 rounded-2xl border border-slate-200 shadow-2xs">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Cari nomor pesanan, meja, atau nama pelanggan..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9.5 pr-4 h-9 rounded-xl border border-slate-200 bg-slate-50/80 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#8B5E3C]"
              />
            </div>
          </div>

          {/* Kanban Board Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
            <BaristaQueueColumn
              variant="pending"
              title="Antrean Baru"
              count={pendingOrders.length}
              subtitle="Menunggu Dibuat"
              orders={pendingOrders}
              emptyMessage="Belum ada pesanan baru."
              onUpdateStatus={handleUpdateStatus}
              onPrintTicket={handlePrintKitchenTicket} // Cast as BaristaOrder but interface overlaps IncomingOrder so it's fine
            />

            <BaristaQueueColumn
              variant="making"
              title="Sedang Dirakit"
              count={makingOrders.length}
              subtitle="Di Tangan Barista"
              orders={makingOrders}
              emptyMessage="Barista sedang santai."
              onUpdateStatus={handleUpdateStatus}
              onPrintTicket={handlePrintKitchenTicket}
            />

            <BaristaQueueColumn
              variant="ready"
              title="Siap Dipanggil"
              count={readyOrders.length}
              subtitle="Tunggu Diambil Pelanggan"
              orders={readyOrders}
              emptyMessage="Semua kopi telah disajikan."
              onUpdateStatus={handleUpdateStatus}
              onPrintTicket={handlePrintKitchenTicket}
            />
          </div>
        </div>
      </FeatureGate>
    </DashboardLayout>
  );
}
