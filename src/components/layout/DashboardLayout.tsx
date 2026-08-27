"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { AppNavbar } from "./AppNavbar";
import { AppSidebar } from "./AppSidebar";
import { MobileBottomNav } from "./MobileBottomNav";
import { MobileDrawer } from "./MobileDrawer";
import { CashierShiftModal } from "@/components/pos/CashierShiftModal";
import { Loader2 } from "lucide-react";

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isShiftModalOpen, setIsShiftModalOpen] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center bg-slate-50">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-600/10 text-emerald-600 mb-4 animate-pulse">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
        <p className="text-sm font-semibold text-slate-700">
          Memuat Data Usaha Anda...
        </p>
        <p className="text-xs text-slate-400 mt-1">
          Menghubungkan ke Firebase & Menyiapkan Ruang Data
        </p>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      {/* Top Navbar with Mobile Hamburger Trigger */}
      <AppNavbar onOpenDrawer={() => setIsDrawerOpen(true)} />

      {/* Main Content Area */}
      <div className="flex flex-1">
        <AppSidebar />
        <main className="flex-1 p-3 sm:p-6 lg:p-8 pb-28 sm:pb-32 md:pb-8 overflow-y-auto max-w-7xl mx-auto w-full">
          {children}
        </main>
      </div>

      {/* Mobile-First Spacious Bottom Navigation (5 Primary Tabs) */}
      <MobileBottomNav onOpenMenu={() => setIsDrawerOpen(true)} />

      {/* Mobile Drawer (Hamburger Menu Sheet) */}
      <MobileDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onOpenShiftModal={() => setIsShiftModalOpen(true)}
      />

      {/* Shift Switch Modal triggered from drawer */}
      <CashierShiftModal
        isOpen={isShiftModalOpen}
        onClose={() => setIsShiftModalOpen(false)}
      />
    </div>
  );
}
