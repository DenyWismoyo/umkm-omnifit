"use client";

import React, { useState, useEffect, useMemo } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useAuth } from "@/context/AuthContext";
import {
  subscribeIncomingOrders,
  updateOrderStatus,
} from "@/services/firestore";
import { IncomingOrder, OrderStatus } from "@/types";
import { PageHeader } from "@/components/common/PageHeader";
import { FeatureGate } from "@/components/common/FeatureGate";
import { StatCard } from "@/components/common/StatCard";
import { Button } from "@/components/ui/button";
import {
  BellRing,
  ChefHat,
  CheckCircle2,
  Utensils,
  Volume2,
  VolumeX,
  Search,
  Tv,
} from "lucide-react";
import { toast } from "sonner";
import { handlePrintKitchenTicket } from "@/lib/printUtils";
import { KitchenBatchingCard } from "@/components/fnb/orders/KitchenBatchingCard";
import { KanbanColumn } from "@/components/fnb/orders/KanbanColumn";

export default function OrdersManagementPage() {
  const { user, storeOwnerUid, shopProfile } = useAuth();
  const activeUid = storeOwnerUid || user?.uid;

  const [orders, setOrders] = useState<IncomingOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTableFilter, setSelectedTableFilter] = useState("all");
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

    const unsub = subscribeIncomingOrders(activeUid, (orderList) => {
      setOrders(orderList);
      setLoading(false);

      // Trigger audio on new PENDING orders
      const pendingList = orderList.filter((o) => o.status === "PENDING");
      let hasNew = false;
      pendingList.forEach((o) => {
        if (!knownOrderIds.has(o.id)) hasNew = true;
      });

      if (hasNew && knownOrderIds.size > 0) {
        playOrderChime();
        toast.info("🔔 Pesanan Baru Masuk dari Meja Pelanggan!", { duration: 5000 });
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
      const matchSearch =
        o.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        o.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        o.tableNumber.toLowerCase().includes(searchQuery.toLowerCase());

      const matchTable =
        selectedTableFilter === "all" || o.tableNumber === selectedTableFilter;

      return matchSearch && matchTable;
    });
  }, [orders, searchQuery, selectedTableFilter]);

  const pendingOrders = filteredOrders.filter((o) => o.status === "PENDING");
  const cookingOrders = filteredOrders.filter(
    (o) => o.status === "COOKING" || o.status === "ACCEPTED"
  );
  const readyOrders = filteredOrders.filter((o) => o.status === "READY");
  const completedOrders = filteredOrders.filter((o) => o.status === "COMPLETED");

  // Smart Kitchen Batching Suggestions (Masak Sekaligus)
  const kitchenBatching = useMemo(() => {
    const activeOrders = orders.filter(
      (o) => o.status === "PENDING" || o.status === "COOKING" || o.status === "ACCEPTED"
    );
    const itemMap: Record<
      string,
      { name: string; totalQty: number; tables: string[]; orderCount: number }
    > = {};

    activeOrders.forEach((o) => {
      o.items.forEach((it) => {
        if (!itemMap[it.productName]) {
          itemMap[it.productName] = {
            name: it.productName,
            totalQty: 0,
            tables: [],
            orderCount: 0,
          };
        }
        itemMap[it.productName].totalQty += it.quantity;
        if (!itemMap[it.productName].tables.includes(o.tableNumber)) {
          itemMap[it.productName].tables.push(o.tableNumber);
        }
        itemMap[it.productName].orderCount += 1;
      });
    });

    return Object.values(itemMap)
      .filter((item) => item.totalQty >= 2 && item.tables.length >= 1)
      .sort((a, b) => b.totalQty - a.totalQty);
  }, [orders]);

  const tablesList = Array.from(new Set(orders.map((o) => o.tableNumber))).filter(Boolean);

  return (
    <DashboardLayout>
      <FeatureGate
        requiredTier="pro"
        requiredIndustry={["fnb", "universal"]}
        featureName="Antrean Pesanan Dapur Live (KDS)"
        description="Sistem tiket pesanan meja/bungkus real-time, layar dapur otomatis, dan kitchen display khusus industri Kuliner & F&B."
      >
        <div className="space-y-4 sm:space-y-6 max-w-7xl mx-auto pb-12">
          {/* Header with Sound Notification & TV Display Buttons */}
          <PageHeader
            title="Antrean Pesanan & Dapur (KDS)"
            description="Pantau pesanan meja real-time, kelola antrean dapur cerdas, dan tayangkan di Layar TV Toko."
            actions={
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setSoundEnabled(!soundEnabled)}
                  className={`touch-press h-9 text-xs font-bold gap-1.5 ${
                    soundEnabled
                      ? "border-emerald-300 bg-emerald-50 text-emerald-950"
                      : "border-slate-300 text-slate-500"
                  }`}
                >
                  {soundEnabled ? (
                    <>
                      <Volume2 className="h-3.5 w-3.5 text-emerald-600 animate-pulse" />
                      <span>Suara Bell Aktif</span>
                    </>
                  ) : (
                    <>
                      <VolumeX className="h-3.5 w-3.5" />
                      <span>Suara Bell Mati</span>
                    </>
                  )}
                </Button>

                <Button
                  type="button"
                  variant="default"
                  size="sm"
                  onClick={() => {
                    const code = shopProfile?.storeCode;
                    if (code) {
                      window.open(`/display/${code}`, "_blank");
                    } else {
                      toast.error("Kode toko belum aktif di Pengaturan.");
                    }
                  }}
                  className="touch-press h-9 text-xs font-black bg-slate-900 hover:bg-slate-800 text-white gap-1.5 rounded-xl shadow-xs"
                >
                  <Tv className="h-4 w-4 text-emerald-400" />
                  <span>Buka Layar TV Antrean</span>
                </Button>
              </div>
            }
          />

          {/* SMART KITCHEN BATCHING AI CARD (IF MULTIPLE SIMILAR ORDERS) */}
          <KitchenBatchingCard batching={kitchenBatching} />

          {/* 4 Stat Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
            <StatCard
              title="Pesanan Baru"
              value={pendingOrders.length}
              icon={BellRing}
              iconBgColor="bg-amber-100"
              iconColor="text-amber-700"
              valueColor={pendingOrders.length > 0 ? "text-amber-600 font-black" : undefined}
              subtitle="Menunggu diterima kasir"
            />
            <StatCard
              title="Sedang Dimasak"
              value={cookingOrders.length}
              icon={ChefHat}
              iconBgColor="bg-blue-100"
              iconColor="text-blue-700"
              subtitle="Dalam proses dapur"
            />
            <StatCard
              title="Siap Disajikan"
              value={readyOrders.length}
              icon={Utensils}
              iconBgColor="bg-emerald-100"
              iconColor="text-emerald-700"
              subtitle="Siap diantar ke meja"
            />
            <StatCard
              title="Selesai / Lunas"
              value={completedOrders.length}
              icon={CheckCircle2}
              iconBgColor="bg-slate-100"
              iconColor="text-slate-700"
              subtitle="Pesanan hari ini"
            />
          </div>

          {/* Filter & Search Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 bg-white p-3 rounded-2xl border border-slate-200 shadow-2xs">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Cari nomor pesanan, nama meja, atau pelanggan..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9.5 pr-4 h-9 rounded-xl border border-slate-200 bg-slate-50/80 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="flex items-center gap-2">
              <select
                value={selectedTableFilter}
                onChange={(e) => setSelectedTableFilter(e.target.value)}
                className="h-9 rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs font-bold text-slate-700"
              >
                <option value="all">Semua Meja</option>
                {tablesList.map((tbl) => (
                  <option key={tbl} value={tbl}>
                    {tbl}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Kanban Board Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
            <KanbanColumn
              variant="pending"
              title="Pesanan Baru"
              count={pendingOrders.length}
              subtitle="Menunggu Kasir"
              orders={pendingOrders}
              emptyMessage="Tidak ada pesanan baru."
              onUpdateStatus={handleUpdateStatus}
              onPrintTicket={handlePrintKitchenTicket}
            />

            <KanbanColumn
              variant="cooking"
              title="Sedang Dimasak"
              count={cookingOrders.length}
              subtitle="Di Dapur / Barista"
              orders={cookingOrders}
              emptyMessage="Dapur sedang santai."
              onUpdateStatus={handleUpdateStatus}
              onPrintTicket={handlePrintKitchenTicket}
            />

            <KanbanColumn
              variant="ready"
              title="Siap Disajikan"
              count={readyOrders.length}
              subtitle="Siap Diantar"
              orders={readyOrders}
              emptyMessage="Semua pesanan telah selesai disajikan."
              onUpdateStatus={handleUpdateStatus}
              onPrintTicket={handlePrintKitchenTicket}
            />
          </div>
        </div>
      </FeatureGate>
    </DashboardLayout>
  );
}
