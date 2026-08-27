"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  Store,
  ShoppingCart,
  LogOut,
  User,
  Settings,
  UserCheck,
  Menu,
  Crown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { CashierShiftModal } from "@/components/pos/CashierShiftModal";
import { toast } from "sonner";

interface AppNavbarProps {
  onOpenDrawer?: () => void;
}

export function AppNavbar({ onOpenDrawer }: AppNavbarProps) {
  const {
    user,
    shopProfile,
    activeCashier,
    activeRole,
    signOut,
    isTrialActive,
    trialDaysLeft,
    openUpgradeModal,
  } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isShiftModalOpen, setIsShiftModalOpen] = useState(false);

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success("Berhasil keluar dari akun.");
      router.push("/login");
    } catch (error) {
      toast.error("Gagal logout. Silakan coba lagi.");
    }
  };

  const isCashier = activeRole === "cashier";

  return (
    <>
      <header className="sticky top-0 z-40 flex h-14 sm:h-16 w-full items-center justify-between border-b border-slate-200/80 bg-white/95 px-3 sm:px-6 backdrop-blur-md">
        {/* Left: Hamburger (Mobile) + Brand & Store Name */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          {/* Hamburger Trigger for Mobile */}
          {onOpenDrawer && (
            <button
              type="button"
              onClick={onOpenDrawer}
              className="touch-press md:hidden flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 shrink-0"
              title="Buka Menu"
            >
              <Menu className="h-5 w-5" />
            </button>
          )}

          <Link
            href={isCashier ? "/pos" : "/dashboard"}
            className="flex items-center gap-2 font-bold text-slate-900 transition-opacity hover:opacity-90 min-w-0"
          >
            <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white shadow-sm shadow-emerald-500/20 shrink-0">
              <Store className="h-4 w-4 sm:h-5 sm:w-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 leading-tight">
                <span className="text-xs sm:text-base font-extrabold tracking-tight text-slate-900 truncate max-w-[120px] sm:max-w-[200px]">
                  {shopProfile?.shopName || "POS UMKM"}
                </span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    openUpgradeModal();
                  }}
                  className={`touch-press inline-flex items-center rounded-full px-1.5 py-0.2 text-[9px] sm:text-[10px] font-bold shrink-0 ${
                    isTrialActive
                      ? "bg-amber-100 text-amber-900 border border-amber-300"
                      : "bg-emerald-100 text-emerald-800"
                  }`}
                  title="Klik untuk Kelola Langganan"
                >
                  {isTrialActive ? `Trial ${trialDaysLeft}h` : "PRO"}
                </button>
              </div>
              <p className="hidden sm:block text-xs text-slate-500 truncate">
                {shopProfile?.ownerName || user?.displayName || "Pemilik Toko"}
              </p>
            </div>
          </Link>
        </div>

        {/* Right Action Buttons */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          {/* Upgrade PRO Button */}
          {!isCashier && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={openUpgradeModal}
              className="touch-press gap-1 text-[11px] sm:text-xs font-black h-8 sm:h-9 px-2 sm:px-3 bg-gradient-to-r from-amber-50 to-orange-50 border-amber-300 text-amber-950 hover:bg-amber-100 shadow-2xs"
            >
              <Crown className="h-3.5 w-3.5 text-amber-600" />
              <span className="hidden sm:inline">Upgrade PRO</span>
              <span className="sm:hidden text-[10px]">PRO</span>
            </Button>
          )}

          {/* Shift / Cashier Quick Switch Button */}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setIsShiftModalOpen(true)}
            className={`touch-press gap-1 text-[11px] sm:text-xs font-bold h-8 sm:h-9 px-2 sm:px-3 border-slate-200 ${
              isCashier
                ? "bg-amber-50 text-amber-900 border-amber-300 hover:bg-amber-100"
                : "bg-emerald-50 text-emerald-900 border-emerald-300 hover:bg-emerald-100"
            }`}
          >
            <UserCheck className="h-3.5 w-3.5 text-emerald-600" />
            <span className="hidden sm:inline">
              {isCashier ? `Kasir: ${activeCashier?.name || "Kasir"}` : "Mode: Owner"}
            </span>
            <span className="sm:hidden text-[10px]">
              {isCashier ? "Kasir" : "Owner"}
            </span>
          </Button>

          {/* Desktop POS Quick Open */}
          {pathname !== "/pos" && (
            <Link href="/pos" className="hidden md:inline-flex">
              <Button
                size="sm"
                variant="default"
                className="touch-press items-center gap-2 bg-emerald-600 hover:bg-emerald-700 font-bold h-9 text-xs shadow-xs"
              >
                <ShoppingCart className="h-4 w-4" />
                <span>Buka Kasir POS</span>
              </Button>
            </Link>
          )}

          {/* Desktop Settings Link */}
          {!isCashier && (
            <Link href="/settings" className="hidden sm:inline-flex">
              <Button variant="ghost" size="iconSm" title="Pengaturan Toko" className="touch-press">
                <Settings className="h-4 w-4 text-slate-600" />
              </Button>
            </Link>
          )}

          {/* User Info & Logout */}
          <div className="flex items-center gap-1.5 sm:gap-2 border-l border-slate-200 pl-1.5 sm:pl-3">
            {user?.photoURL ? (
              <img
                src={user.photoURL}
                alt={user.displayName || "User"}
                className="h-7 w-7 sm:h-8 sm:w-8 rounded-full border border-slate-200 object-cover"
              />
            ) : (
              <div className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-full bg-slate-100 text-slate-600 font-semibold text-xs">
                <User className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              </div>
            )}

            <Button
              variant="ghost"
              size="sm"
              onClick={handleSignOut}
              className="touch-press hidden sm:inline-flex text-rose-600 hover:bg-rose-50 hover:text-rose-700 px-2 sm:px-3 text-xs h-9"
            >
              <LogOut className="h-4 w-4 sm:mr-1.5" />
              <span>Keluar</span>
            </Button>
          </div>
        </div>
      </header>

      {/* MODAL GANTI SHIFT KASIR */}
      <CashierShiftModal
        isOpen={isShiftModalOpen}
        onClose={() => setIsShiftModalOpen(false)}
      />
    </>
  );
}
