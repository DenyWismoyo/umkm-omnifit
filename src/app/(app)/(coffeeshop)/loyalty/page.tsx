"use client";

import React, { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useAuth } from "@/context/AuthContext";
import {
  subscribeLoyaltyCards,
  addLoyaltyStamp,
  redeemLoyaltyCard,
} from "@/services/firestore";
import { LoyaltyCard } from "@/types";
import { PageHeader } from "@/components/common/PageHeader";
import { FeatureGate } from "@/components/common/FeatureGate";
import { LoyaltyCardDisplay } from "@/components/coffeeshop/loyalty/LoyaltyCardDisplay";
import { Button } from "@/components/ui/button";
import { Search, Plus, Gift, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

export default function LoyaltyPage() {
  const { user, storeOwnerUid } = useAuth();
  const activeUid = storeOwnerUid || user?.uid;

  const [cards, setCards] = useState<LoyaltyCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const [isAdding, setIsAdding] = useState(false);
  const [newCustomerName, setNewCustomerName] = useState("");
  const [newCustomerPhone, setNewCustomerPhone] = useState("");

  useEffect(() => {
    if (!activeUid) return;
    const unsub = subscribeLoyaltyCards(activeUid, (list) => {
      setCards(list);
      setLoading(false);
    });
    return () => unsub();
  }, [activeUid]);

  const handleAddStamp = async (
    customerId: string,
    customerName: string,
    phone: string,
    qty: number
  ) => {
    if (!activeUid) return;
    try {
      await addLoyaltyStamp(activeUid, customerId, customerName, qty, phone);
      toast.success(`Berhasil menambahkan ${qty} stempel untuk ${customerName}`);
      setIsAdding(false);
      setNewCustomerName("");
      setNewCustomerPhone("");
    } catch (e: any) {
      toast.error(e.message || "Gagal menambah stempel");
    }
  };

  const handleRedeem = async (customerId: string) => {
    if (!activeUid) return;
    try {
      await redeemLoyaltyCard(activeUid, customerId);
      toast.success("Berhasil menukar 10 stempel dengan minuman gratis!");
    } catch (e: any) {
      toast.error(e.message || "Gagal menukar stempel");
    }
  };

  const filteredCards = cards.filter(
    (c) =>
      c.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.customerPhone?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <DashboardLayout>
      <FeatureGate
        requiredTier="pro"
        requiredIndustry={["coffeeshop"]}
        featureName="Loyalty & Digital Stamp"
        description="Program retensi pelanggan setia kedai kopi dengan sistem stempel digital (Kumpulkan 10 cup gratis 1)."
      >
        <div className="space-y-4 sm:space-y-6 max-w-7xl mx-auto pb-12">
          <PageHeader
            title="Customer Loyalty"
            description="Manajemen Stempel Digital (Buy 10 Get 1 Free)."
            actions={
              <Button
                type="button"
                onClick={() => setIsAdding(!isAdding)}
                className="bg-[#8B5E3C] hover:bg-[#6e482b] text-white"
              >
                <Plus className="mr-2 h-4 w-4" />
                Member Baru
              </Button>
            }
          />

          {isAdding && (
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm animate-in slide-in-from-top-4">
              <h3 className="font-bold text-slate-800 mb-3">
                Buat Member & Tambah Stempel
              </h3>
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  placeholder="Nama Pelanggan"
                  value={newCustomerName}
                  onChange={(e) => setNewCustomerName(e.target.value)}
                  className="flex-1 h-10 px-3 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#8B5E3C]"
                />
                <input
                  type="text"
                  placeholder="No. WA (Opsional)"
                  value={newCustomerPhone}
                  onChange={(e) => setNewCustomerPhone(e.target.value)}
                  className="flex-1 h-10 px-3 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#8B5E3C]"
                />
                <Button
                  onClick={() =>
                    handleAddStamp(
                      `member_${Date.now()}`,
                      newCustomerName,
                      newCustomerPhone,
                      1
                    )
                  }
                  disabled={!newCustomerName.trim()}
                  className="bg-emerald-600 hover:bg-emerald-700 h-10"
                >
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  Simpan & Beri 1 Stamp
                </Button>
              </div>
            </div>
          )}

          <div className="flex bg-white p-3 rounded-2xl border border-slate-200 shadow-2xs">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Cari nama member atau nomor telepon..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9.5 pr-4 h-9 rounded-xl border border-slate-200 bg-slate-50/80 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#8B5E3C]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCards.map((card) => (
              <div key={card.id} className="space-y-3">
                <LoyaltyCardDisplay card={card} maxStamps={10} />
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="flex-1 border-[#8B5E3C] text-[#8B5E3C] hover:bg-[#8B5E3C]/10"
                    onClick={() =>
                      handleAddStamp(
                        card.id,
                        card.customerName,
                        card.customerPhone || "",
                        1
                      )
                    }
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    +1 Cup (Stamp)
                  </Button>

                  <Button
                    variant="default"
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white disabled:opacity-50"
                    disabled={card.stampsCurrentCard < 10}
                    onClick={() => handleRedeem(card.id)}
                  >
                    <Gift className="mr-2 h-4 w-4" />
                    Redeem Free
                  </Button>
                </div>
              </div>
            ))}
            {!loading && filteredCards.length === 0 && (
              <div className="col-span-full py-12 text-center text-slate-500">
                Belum ada data pelanggan untuk program loyalty.
              </div>
            )}
          </div>
        </div>
      </FeatureGate>
    </DashboardLayout>
  );
}
