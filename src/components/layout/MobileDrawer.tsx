"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  LayoutDashboard,
  ShoppingCart,
  PackageCheck,
  TrendingDown,
  Users,
  FileBarChart2,
  Settings,
  Store,
  Calculator,
  LogOut,
  X,
  GraduationCap,
  ChevronRight,
  Unlock,
  Download,
  Crown,
  Boxes,
  BellRing,
  Lock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { usePwaInstall } from "@/components/common/PwaInstallPrompt";
import { checkRouteAccess } from "@/lib/routePermissions";
import { INDUSTRY_METADATA } from "@/data/subscriptionPlans";

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenShiftModal?: () => void;
}

export function MobileDrawer({
  isOpen,
  onClose,
  onOpenShiftModal,
}: MobileDrawerProps) {
  const pathname = usePathname();
  const router = useRouter();
  const {
    user,
    shopProfile,
    activeRole,
    activeCashier,
    activeIndustry,
    activeTier,
    switchRoleToOwner,
    signOut,
    isTrialActive,
    trialDaysLeft,
    openUpgradeModal,
  } = useAuth();
  const { promptInstall } = usePwaInstall();

  const isCashier = activeRole === "cashier";
  const currentIndustry = INDUSTRY_METADATA[activeIndustry] || INDUSTRY_METADATA.fnb;

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success("Berhasil logout.");
      onClose();
      router.push("/login");
    } catch {
      toast.error("Gagal logout.");
    }
  };

  const MENU_SECTIONS = [
    {
      title: "Operasional Utama",
      items: [
        {
          title: "Mesin Kasir (POS)",
          href: "/pos",
          icon: ShoppingCart,
          badge: "Kasir",
          badgeColor: "bg-emerald-600 text-white",
          roles: ["owner", "supervisor", "cashier"],
        },
        {
          title: "Antrean Pesanan",
          href: "/orders",
          icon: BellRing,
          badge: "Live",
          badgeColor: "bg-amber-500 text-slate-950",
          roles: ["owner", "supervisor", "cashier"],
        },
        {
          title: "Katalog Produk & Stok",
          href: "/products",
          icon: PackageCheck,
          roles: ["owner", "supervisor", "cashier"],
        },
        {
          title: "Stok Bahan Baku & HPP",
          href: "/inventory",
          icon: Boxes,
          badge: "Auto",
          badgeColor: "bg-emerald-500 text-slate-950",
          roles: ["owner", "supervisor"],
        },
        {
          title: "Pelanggan & Kasbon",
          href: "/debts",
          icon: Users,
          roles: ["owner", "supervisor", "cashier"],
        },
      ],
    },
    {
      title: "Finansial & Analisis",
      items: [
        {
          title: "Dashboard Toko",
          href: "/dashboard",
          icon: LayoutDashboard,
          roles: ["owner", "supervisor"],
        },
        {
          title: "Kalkulator HPP & Resep",
          href: "/hpp",
          icon: Calculator,
          badge: "Cerdas",
          badgeColor: "bg-amber-500 text-white",
          roles: ["owner"],
        },
        {
          title: "Pencatatan Biaya Toko",
          href: "/expenses",
          icon: TrendingDown,
          roles: ["owner"],
        },
        {
          title: "Laporan Laba / Rugi",
          href: "/reports",
          icon: FileBarChart2,
          roles: ["owner"],
        },
      ],
    },
    {
      title: "Edukasi & Pertumbuhan",
      items: [
        {
          title: "Akademi & Playbook Bisnis",
          href: "/academy",
          icon: GraduationCap,
          badge: "9 Pilar",
          badgeColor: "bg-blue-600 text-white",
          roles: ["owner", "supervisor"],
        },
        {
          title: "Pengaturan Toko",
          href: "/settings",
          icon: Settings,
          roles: ["owner"],
        },
      ],
    },
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 md:hidden flex animate-in fade-in duration-200">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Drawer Panel */}
      <div className="relative w-[84%] max-w-xs bg-white h-full shadow-2xl flex flex-col z-10 animate-in slide-in-from-left duration-250">
        {/* Drawer Header with Shop & User Info */}
        <div className="p-4 bg-gradient-to-r from-emerald-950 via-slate-900 to-teal-950 text-white relative overflow-hidden shrink-0 space-y-2.5">
          <div className="absolute top-0 right-0 -mt-6 -mr-6 h-28 w-28 rounded-full bg-emerald-500/10 blur-xl pointer-events-none" />

          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-slate-950 font-black shrink-0 shadow-xs">
                <Store className="h-5 w-5" />
              </div>
              <div className="min-w-0 leading-tight">
                <h3 className="text-xs font-black text-white truncate">
                  {shopProfile?.shopName || "POS UMKM"}
                </h3>
                <p className="text-[10px] text-slate-300 truncate">
                  {shopProfile?.ownerName || user?.displayName || "Pemilik Toko"}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="touch-press h-8 w-8 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Role & Industry Status Pill */}
          <div className="flex items-center justify-between bg-white/10 rounded-xl p-2 text-xs">
            <div className="flex items-center gap-1.5 min-w-0">
              <span className="text-xs">{currentIndustry.icon}</span>
              <span className="text-[10.5px] font-semibold text-slate-200 truncate">
                {isCashier
                  ? `Kasir: ${activeCashier?.name || "Aktif"}`
                  : `${currentIndustry.shortName} • ${activeTier.toUpperCase()}`}
              </span>
            </div>
            {onOpenShiftModal && isCashier && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenShiftModal();
                }}
                className="touch-press text-[10px] font-bold text-emerald-400 hover:underline shrink-0"
              >
                Shift
              </button>
            )}
          </div>

          {/* PRO / Trial Upgrade Banner */}
          {!isCashier && (
            <Link
              href="/upgrade"
              onClick={onClose}
              className="touch-press bg-gradient-to-r from-amber-500/20 to-emerald-500/20 border border-amber-400/40 rounded-xl p-2 flex items-center justify-between cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <Crown className="h-3.5 w-3.5 text-amber-400 shrink-0" />
                <div className="leading-tight text-left">
                  <span className="text-[11px] font-black text-amber-300 block">
                    {isTrialActive
                      ? `Trial: ${trialDaysLeft} Hari Lagi`
                      : activeTier === "basic"
                      ? "Paket Basic (Upgrade ke PRO)"
                      : "Status: Akun PRO Aktif"}
                  </span>
                  <span className="text-[9px] text-slate-300">
                    {activeTier === "basic"
                      ? "Buka akses HPP & Laporan"
                      : isTrialActive
                      ? "Ketuk untuk langganan tanpa batas"
                      : "Semua fitur aktif"}
                  </span>
                </div>
              </div>
              <ChevronRight className="h-3.5 w-3.5 text-amber-400" />
            </Link>
          )}
        </div>

        {/* Drawer Scrollable Navigation Links */}
        <div className="flex-1 overflow-y-auto p-3 space-y-4 no-scrollbar">
          {MENU_SECTIONS.map((section, sIdx) => {
            const visibleItems = section.items.filter((it) =>
              it.roles.includes(activeRole || "owner")
            );

            if (visibleItems.length === 0) return null;

            return (
              <div key={sIdx} className="space-y-1">
                <p className="text-[10px] font-black uppercase tracking-wider text-slate-400 px-3">
                  {section.title}
                </p>
                {visibleItems.map((item) => {
                  const isActive =
                    pathname === item.href ||
                    (item.href !== "/dashboard" && pathname.startsWith(item.href));
                  const Icon = item.icon;

                  const access = checkRouteAccess({
                    pathname: item.href,
                    role: activeRole,
                    tier: activeTier,
                    industry: activeIndustry,
                    isTrial: isTrialActive,
                  });

                  const isLocked = !access.allowed;

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={onClose}
                      className={cn(
                        "touch-press flex items-center justify-between rounded-xl px-3 py-2.5 text-xs font-semibold transition-all",
                        isActive
                          ? "bg-emerald-50 text-emerald-800 font-bold border border-emerald-200/80 shadow-2xs"
                          : isLocked
                          ? "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
                          : "text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                      )}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon
                          className={cn(
                            "h-4 w-4",
                            isActive
                              ? "text-emerald-600 stroke-[2.5]"
                              : isLocked
                              ? "text-slate-400 group-hover:text-amber-600"
                              : "text-slate-400"
                          )}
                        />
                        <span>{item.title}</span>
                      </div>

                      {isLocked ? (
                        <div className="flex items-center gap-1 bg-amber-100/80 text-amber-800 text-[9px] font-black px-1.5 py-0.5 rounded-md border border-amber-200">
                          <Lock className="h-2.5 w-2.5" />
                          <span>PRO</span>
                        </div>
                      ) : (
                        item.badge && (
                          <span
                            className={cn(
                              "rounded-full px-2 py-0.5 text-[9px] font-extrabold uppercase",
                              item.badgeColor || "bg-slate-100 text-slate-700"
                            )}
                          >
                            {item.badge}
                          </span>
                        )
                      )}
                    </Link>
                  );
                })}
              </div>
            );
          })}

          {/* Switch to Owner mode button for cashier */}
          {isCashier && (
            <div className="p-3 rounded-2xl border border-amber-200 bg-amber-50/70 text-xs space-y-2">
              <span className="font-extrabold text-amber-950 block text-[11px]">
                Akses Dibatasi (Shift Kasir)
              </span>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => {
                  switchRoleToOwner();
                  onClose();
                  toast.info("Beralih ke Mode Pemilik Toko (Full Access).");
                }}
                className="touch-press w-full h-8 text-[11px] font-bold border-amber-300 bg-white text-amber-950 gap-1.5"
              >
                <Unlock className="h-3 w-3 text-amber-600" />
                <span>Masuk Mode Owner</span>
              </Button>
            </div>
          )}
        </div>

        {/* Drawer Footer with Install App & Logout */}
        <div className="p-3 border-t border-slate-100 bg-slate-50/80 shrink-0 space-y-1">
          {/* PWA Install Button */}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => {
              onClose();
              promptInstall();
            }}
            className="touch-press w-full h-9 justify-start text-emerald-800 bg-emerald-50/80 hover:bg-emerald-100 border-emerald-200 text-xs font-bold gap-2 px-3 rounded-xl"
          >
            <Download className="h-4 w-4 text-emerald-600" />
            <span>Install Aplikasi (PWA)</span>
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleSignOut}
            className="touch-press w-full h-9 justify-start text-rose-600 hover:bg-rose-50 hover:text-rose-700 text-xs font-bold gap-2 px-3 rounded-xl"
          >
            <LogOut className="h-4 w-4" />
            <span>Keluar dari Akun</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
