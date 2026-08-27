"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  UserCheck,
  Lock,
  Unlock,
  Crown,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { checkRouteAccess } from "@/lib/routePermissions";
import { INDUSTRY_METADATA } from "@/data/subscriptionPlans";
import { INDUSTRY_NAV_CONFIG, NAV_ITEM_REGISTRY } from "@/lib/industryConfig";

export function AppSidebar() {
  const pathname = usePathname();
  const {
    activeRole,
    activeCashier,
    activeIndustry,
    activeTier,
    isTrialActive,
    switchRoleToOwner,
    openUpgradeModal,
  } = useAuth();

  const isCashier = activeRole === "cashier";
  const currentIndustry = INDUSTRY_METADATA[activeIndustry] || INDUSTRY_METADATA.fnb;

  const navSections = INDUSTRY_NAV_CONFIG[activeIndustry] || INDUSTRY_NAV_CONFIG.universal;

  return (
    <aside className="w-64 shrink-0 border-r border-slate-200/80 bg-white min-h-[calc(100vh-4rem)] p-4 flex flex-col justify-between hidden md:flex">
      <div className="space-y-1 flex flex-col h-full">
        {/* Industry & Role Indicator Header */}
        <div className="flex items-center justify-between px-3 mb-3 shrink-0">
          <div className="flex items-center gap-1.5">
            <span className="text-xs">{currentIndustry.icon}</span>
            <p className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 truncate max-w-[120px]">
              {currentIndustry.shortName}
            </p>
          </div>

          {isCashier ? (
            <span className="text-[10px] font-black uppercase bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Kasir
            </span>
          ) : (
            <span
              className={cn(
                "text-[9px] font-black uppercase px-2 py-0.5 rounded-full border flex items-center gap-1",
                activeTier === "pro" || isTrialActive
                  ? "bg-amber-50 text-amber-900 border-amber-300"
                  : "bg-slate-100 text-slate-700 border-slate-200"
              )}
            >
              {isTrialActive ? "TRIAL" : activeTier.toUpperCase()}
            </span>
          )}
        </div>

        {/* Navigation List with Smart Feature Gating */}
        <div className="flex-1 overflow-y-auto pr-1 -mr-1 space-y-4">
          {navSections.map((section) => {
            const visibleItems = section.items
              .map((key) => NAV_ITEM_REGISTRY[key])
              .filter((item) => item && item.roles.includes(activeRole || "owner"));
              
            if (visibleItems.length === 0) return null;

            return (
              <div key={section.section} className="space-y-1">
                <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                  {section.section}
                </p>
                {visibleItems.map((item) => {
                  const isActive =
                    pathname === item.href ||
                    (item.href !== "/dashboard" && pathname.startsWith(item.href));
                  const Icon = item.icon;

                  // Cek hak akses rute
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
                      className={cn(
                        "flex items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all group",
                        isActive
                          ? "bg-emerald-50 text-emerald-700 font-semibold shadow-xs"
                          : isLocked
                          ? "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
                          : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <Icon
                          className={cn(
                            "h-5 w-5 transition-colors",
                            isActive
                              ? "text-emerald-600"
                              : isLocked
                              ? "text-slate-400 group-hover:text-amber-600"
                              : "text-slate-400 group-hover:text-slate-600"
                          )}
                        />
                        <span className="text-xs">{item.title}</span>
                      </div>

                      {isLocked ? (
                        <div className="flex items-center gap-1 bg-amber-100/70 text-amber-800 text-[9px] font-black px-1.5 py-0.5 rounded-md border border-amber-200/60">
                          <Lock className="h-2.5 w-2.5" />
                          <span>PRO</span>
                        </div>
                      ) : (
                        item.badge && (
                          <span
                            className={cn(
                              "rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider",
                              isActive
                                ? "bg-emerald-600 text-white"
                                : "bg-emerald-100 text-emerald-800"
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
        </div>
      </div>

      {/* Footer Mode & Status Kasir / Upgrade Promo */}
      {isCashier ? (
        <div className="rounded-2xl border border-amber-200 bg-amber-50/70 p-3.5 text-xs space-y-2.5">
          <div className="flex items-center gap-2 font-bold text-amber-950">
            <UserCheck className="h-4 w-4 text-amber-600" />
            <span>Shift: {activeCashier?.name || "Kasir Aktif"}</span>
          </div>
          <p className="text-[11px] text-amber-800 leading-tight">
            Menu laporan keuangan dan HPP dibatasi demi keamanan toko.
          </p>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => {
              switchRoleToOwner();
              toast.info("Beralih ke Mode Pemilik Toko (Full Access).");
            }}
            className="w-full h-8 text-[11px] font-bold border-amber-300 bg-white hover:bg-amber-100 text-amber-950 gap-1.5"
          >
            <Unlock className="h-3 w-3 text-amber-600" />
            <span>Masuk Mode Owner</span>
          </Button>
        </div>
      ) : activeTier === "basic" && !isTrialActive ? (
        <div className="rounded-2xl border border-amber-300/80 bg-gradient-to-br from-amber-500/10 to-orange-500/10 p-3.5 text-xs space-y-2">
          <div className="flex items-center gap-1.5 font-black text-amber-950 text-[11px]">
            <Crown className="h-3.5 w-3.5 text-amber-600" />
            <span>Paket {currentIndustry.shortName} Basic</span>
          </div>
          <p className="text-[10.5px] text-slate-600 leading-tight">
            Upgrade ke PRO untuk fitur lengkap & otomatisasi bisnis Anda.
          </p>
          <Link href="/upgrade" className="block">
            <Button
              size="sm"
              className="w-full h-7 text-[10.5px] font-black bg-amber-600 hover:bg-amber-700 text-white shadow-xs"
            >
              Upgrade ke PRO →
            </Button>
          </Link>
        </div>
      ) : (
        <div className="rounded-2xl border border-emerald-100 bg-gradient-to-br from-emerald-50/50 to-teal-50/50 p-4 text-xs">
          <div className="flex items-center gap-2 font-bold text-emerald-900 mb-1">
            <Sparkles className="h-4 w-4 text-emerald-600" />
            <span>Mode Pemilik (Owner)</span>
          </div>
          <p className="text-slate-600 leading-relaxed text-[11px]">
            Akses penuh ke seluruh modul, kalkulator HPP, pengeluaran, dan manajemen kasir.
          </p>
        </div>
      )}
    </aside>
  );
}
