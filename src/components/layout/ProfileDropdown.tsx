"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  User,
  Store,
  Settings,
  LogOut,
  Crown,
  ChevronRight,
  Copy,
  Check,
  RefreshCw,
  QrCode,
  BookOpen,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { INDUSTRY_METADATA } from "@/data/subscriptionPlans";
import { toast } from "sonner";

export function ProfileDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [isCopiedCode, setIsCopiedCode] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const {
    user,
    shopProfile,
    activeRole,
    activeIndustry,
    activeTier,
    isTrialActive,
    trialDaysLeft,
    signOut,
  } = useAuth();

  const isCashier = activeRole === "cashier";
  const currentIndustry = INDUSTRY_METADATA[activeIndustry] || INDUSTRY_METADATA.fnb;

  // Handle click outside to close dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleCopyStoreCode = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!shopProfile?.storeCode) return;
    navigator.clipboard.writeText(shopProfile.storeCode);
    setIsCopiedCode(true);
    toast.success(`Kode Toko ${shopProfile.storeCode} berhasil disalin!`);
    setTimeout(() => setIsCopiedCode(false), 2000);
  };

  const handleSignOut = async () => {
    try {
      setIsOpen(false);
      await signOut();
      toast.success("Berhasil keluar dari akun.");
      router.push("/login");
    } catch (error) {
      toast.error("Gagal logout. Silakan coba lagi.");
    }
  };

  const displayName = shopProfile?.ownerName || user?.displayName || "Pemilik Toko";
  const userInitial = displayName.charAt(0).toUpperCase();

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Avatar Button Trigger */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="touch-press flex items-center gap-1.5 p-1 rounded-full hover:bg-slate-100 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
        title="Buka Menu Profil & Toko"
      >
        <div className="relative">
          {user?.photoURL ? (
            <img
              src={user.photoURL}
              alt={displayName}
              className="h-8 w-8 sm:h-9 sm:w-9 rounded-full border border-slate-200 object-cover shadow-2xs"
            />
          ) : (
            <div className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full bg-gradient-to-tr from-emerald-600 to-teal-500 text-white font-black text-xs sm:text-sm shadow-2xs">
              {userInitial}
            </div>
          )}
          {/* Online green indicator */}
          <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
        </div>
      </button>

      {/* Dropdown Menu Popup */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-88 rounded-3xl bg-white border border-slate-200/80 shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150 text-slate-900">
          {/* Profile Header */}
          <div className="p-4 bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900 text-white space-y-3">
            <div className="flex items-center gap-3">
              {user?.photoURL ? (
                <img
                  src={user.photoURL}
                  alt={displayName}
                  className="h-12 w-12 rounded-2xl border-2 border-white/20 object-cover shadow-md"
                />
              ) : (
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-slate-950 font-black text-lg shadow-md">
                  {userInitial}
                </div>
              )}
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <h3 className="text-sm font-black text-white truncate">
                    {displayName}
                  </h3>
                  <span className="text-[9px] font-black uppercase bg-emerald-500/30 text-emerald-300 px-2 py-0.2 rounded-full border border-emerald-500/40">
                    {isCashier ? "Kasir" : "Owner"}
                  </span>
                </div>
                <p className="text-[11px] text-slate-300 truncate">
                  {user?.email || "owner@posumkm.id"}
                </p>
              </div>
            </div>

            {/* Shop & Subscription Card */}
            <div className="bg-white/10 rounded-2xl p-3 space-y-2 text-xs border border-white/10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 min-w-0">
                  <Store className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                  <span className="font-bold text-white truncate">
                    {shopProfile?.shopName || "POS UMKM"}
                  </span>
                </div>
                <span className="text-[10px] font-black bg-emerald-400/20 text-emerald-300 px-2 py-0.5 rounded-full flex items-center gap-1 shrink-0">
                  <span>{currentIndustry.icon}</span>
                  <span>{currentIndustry.shortName}</span>
                </span>
              </div>

              <div className="flex items-center justify-between pt-1 border-t border-white/10 text-[11px]">
                <div className="flex items-center gap-1.5 text-amber-300 font-semibold">
                  <Crown className="h-3.5 w-3.5" />
                  <span>
                    {isTrialActive
                      ? `Trial: ${trialDaysLeft} Hari Tersisa`
                      : activeTier === "basic"
                      ? "Paket Basic"
                      : "Akun PRO Aktif"}
                  </span>
                </div>
                {!isCashier && (
                  <Link
                    href="/upgrade"
                    onClick={() => setIsOpen(false)}
                    className="text-[10px] font-black text-amber-400 hover:underline uppercase"
                  >
                    {isTrialActive || activeTier === "basic" ? "Upgrade" : "Detail"}
                  </Link>
                )}
              </div>
            </div>

            {/* Store Code Card for Cashier Login */}
            {shopProfile?.storeCode && (
              <div className="flex items-center justify-between bg-black/30 rounded-xl px-3 py-1.5 text-[11px]">
                <div className="flex items-center gap-1.5 text-slate-300">
                  <QrCode className="h-3.5 w-3.5 text-slate-400" />
                  <span>Kode Toko:</span>
                  <span className="font-mono font-black text-emerald-400">
                    {shopProfile.storeCode}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleCopyStoreCode}
                  className="touch-press text-[10px] font-bold text-slate-300 hover:text-white flex items-center gap-1 bg-white/10 px-2 py-0.5 rounded-md hover:bg-white/20 transition-colors"
                >
                  {isCopiedCode ? (
                    <>
                      <Check className="h-3 w-3 text-emerald-400" />
                      <span className="text-emerald-400">Disalin</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3 w-3" />
                      <span>Salin</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </div>

          {/* Navigation Links */}
          <div className="p-2 space-y-1 text-xs">
            {!isCashier && (
              <>
                <Link
                  href="/settings"
                  onClick={() => setIsOpen(false)}
                  className="touch-press flex items-center justify-between rounded-xl px-3 py-2 text-slate-700 hover:bg-slate-50 font-semibold transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="h-7 w-7 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
                      <Store className="h-4 w-4" />
                    </div>
                    <div>
                      <span className="block font-bold text-slate-900">Identitas & Profil Usaha</span>
                      <span className="text-[10px] text-slate-400 font-normal">Nama toko, alamat, dan kontak</span>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-slate-400" />
                </Link>

                <Link
                  href="/onboarding?edit=true"
                  onClick={() => setIsOpen(false)}
                  className="touch-press flex items-center justify-between rounded-xl px-3 py-2 text-slate-700 hover:bg-slate-50 font-semibold transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="h-7 w-7 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
                      <RefreshCw className="h-4 w-4" />
                    </div>
                    <div>
                      <span className="block font-bold text-slate-900">Ganti Jenis Industri</span>
                      <span className="text-[10px] text-slate-400 font-normal">Sesuaikan modul bisnis (FnB, Salon, dll)</span>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-slate-400" />
                </Link>

                <Link
                  href="/upgrade"
                  onClick={() => setIsOpen(false)}
                  className="touch-press flex items-center justify-between rounded-xl px-3 py-2 text-slate-700 hover:bg-slate-50 font-semibold transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="h-7 w-7 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
                      <Crown className="h-4 w-4" />
                    </div>
                    <div>
                      <span className="block font-bold text-slate-900">Paket & Langganan PRO</span>
                      <span className="text-[10px] text-slate-400 font-normal">Kelola tier langganan & invoice</span>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-slate-400" />
                </Link>

                <Link
                  href="/settings"
                  onClick={() => setIsOpen(false)}
                  className="touch-press flex items-center justify-between rounded-xl px-3 py-2 text-slate-700 hover:bg-slate-50 font-semibold transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="h-7 w-7 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center">
                      <Settings className="h-4 w-4" />
                    </div>
                    <div>
                      <span className="block font-bold text-slate-900">Pengaturan Toko & Kasir</span>
                      <span className="text-[10px] text-slate-400 font-normal">Struk, thermal printer, staf kasir & QRIS</span>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-slate-400" />
                </Link>

                <Link
                  href="/docs"
                  onClick={() => setIsOpen(false)}
                  className="touch-press flex items-center justify-between rounded-xl px-3 py-2 text-slate-700 hover:bg-slate-50 font-semibold transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="h-7 w-7 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center">
                      <BookOpen className="h-4 w-4" />
                    </div>
                    <div>
                      <span className="block font-bold text-slate-900">Buku Panduan & Manual</span>
                      <span className="text-[10px] text-slate-400 font-normal">Panduan fitur 6 industri & kasir</span>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-slate-400" />
                </Link>
              </>
            )}

            {isCashier && (
              <>
                <Link
                  href="/docs"
                  onClick={() => setIsOpen(false)}
                  className="touch-press flex items-center justify-between rounded-xl px-3 py-2 text-slate-700 hover:bg-slate-50 font-semibold transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="h-7 w-7 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center">
                      <BookOpen className="h-4 w-4" />
                    </div>
                    <div>
                      <span className="block font-bold text-slate-900">Buku Panduan Kasir</span>
                      <span className="text-[10px] text-slate-400 font-normal">Panduan transaksi & printer</span>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-slate-400" />
                </Link>
                <Link
                  href="/pos"
                  onClick={() => setIsOpen(false)}
                  className="touch-press flex items-center justify-between rounded-xl px-3 py-2 text-slate-700 hover:bg-slate-50 font-semibold transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="h-7 w-7 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
                      <Store className="h-4 w-4" />
                    </div>
                    <div>
                      <span className="block font-bold text-slate-900">Kembali ke Kasir POS</span>
                      <span className="text-[10px] text-slate-400 font-normal">Akses kasir aktif</span>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-slate-400" />
                </Link>
              </>
            )}
          </div>

          {/* Footer Logout */}
          <div className="p-2.5 border-t border-slate-100 bg-slate-50/80">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleSignOut}
              className="touch-press w-full h-9 justify-start text-rose-600 hover:bg-rose-50 text-xs font-bold gap-2 px-3 rounded-xl"
            >
              <LogOut className="h-4 w-4" />
              <span>Keluar dari Akun</span>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
