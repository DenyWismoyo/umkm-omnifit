"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  LayoutDashboard,
  ShoppingCart,
  Calculator,
  GraduationCap,
  Menu,
  Lock,
  BellRing,
  Calendar,
  PackageCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { checkRouteAccess } from "@/lib/routePermissions";

interface MobileBottomNavProps {
  onOpenMenu: () => void;
}

export function MobileBottomNav({ onOpenMenu }: MobileBottomNavProps) {
  const pathname = usePathname();
  const { activeRole, activeTier, activeIndustry, isTrialActive } = useAuth();

  const getDynamicNavTabs = () => {
    const base = { href: "/dashboard", label: "Beranda", icon: LayoutDashboard };
    let secondTab = { href: "/hpp", label: "HPP", icon: Calculator };
    
    if (activeIndustry === "laundry") {
      secondTab = { href: "/laundry-queue", label: "Antrean", icon: BellRing };
    } else if (activeIndustry === "salon") {
      secondTab = { href: "/appointments", label: "Jadwal", icon: Calendar };
    } else if (activeIndustry === "retail") {
      secondTab = { href: "/barcode-scanner", label: "Scanner", icon: PackageCheck };
    }

    const third = { href: "/pos", label: "Kasir", icon: ShoppingCart, isPrimary: true };
    const fourth = { href: "/academy", label: "Akademi", icon: GraduationCap, badge: "Baru" };

    return [base, secondTab, third, fourth];
  };

  const NAV_TABS = getDynamicNavTabs();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-2xl border-t border-slate-200/60 md:hidden shadow-[0_-4px_24px_rgba(15,23,42,0.06)] pb-[env(safe-area-inset-bottom)]">
      <div className="flex items-center justify-around h-15 px-2 max-w-md mx-auto">
        {/* First 2 tabs: Beranda & HPP / Industry Feature */}
        {NAV_TABS.slice(0, 2).map((item) => {
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
              className={cn(
                "touch-press flex flex-col items-center justify-center gap-0.5 py-1 px-2 rounded-2xl transition-all min-w-[54px] relative",
                isActive
                  ? "text-emerald-700 font-extrabold"
                  : isLocked
                  ? "text-slate-400 hover:text-slate-600"
                  : "text-slate-500 hover:text-slate-800"
              )}
            >
              <div className="relative flex flex-col items-center">
                <Icon
                  className={cn(
                    "h-5 w-5 transition-all duration-200",
                    isActive
                      ? "stroke-[2.5] text-emerald-600 scale-110"
                      : isLocked
                      ? "text-slate-400"
                      : "text-slate-400"
                  )}
                />
                {isLocked && (
                  <span className="absolute -top-1 -right-1.5 h-3.5 w-3.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300 flex items-center justify-center text-[7px] font-black shadow-2xs">
                    <Lock className="h-2 w-2" />
                  </span>
                )}
                {isActive && (
                  <span className="h-1 w-1 rounded-full bg-emerald-600 mt-0.5 animate-in fade-in zoom-in" />
                )}
              </div>
              <span className="text-[10px] tracking-tight">{item.label}</span>
            </Link>
          );
        })}

        {/* Center Primary Action: KASIR POS */}
        <Link
          href="/pos"
          className="touch-press -mt-5 flex flex-col items-center justify-center gap-0.5"
        >
          <div
            className={cn(
              "flex h-12 w-12 items-center justify-center rounded-2xl transition-all duration-200",
              pathname === "/pos"
                ? "bg-gradient-to-tr from-emerald-700 to-teal-600 text-white ring-4 ring-emerald-100 shadow-xl shadow-emerald-700/35 scale-105"
                : "bg-gradient-to-tr from-emerald-600 to-teal-500 text-white shadow-lg shadow-emerald-600/30 hover:shadow-emerald-600/40 hover:scale-102"
            )}
          >
            <ShoppingCart className="h-6 w-6 stroke-[2.4]" />
          </div>
          <span
            className={cn(
              "text-[10px] font-black tracking-tight",
              pathname === "/pos" ? "text-emerald-700 font-black" : "text-slate-600 font-bold"
            )}
          >
            Kasir
          </span>
        </Link>

        {/* Tab 4: Akademi */}
        {NAV_TABS.slice(3).map((item) => {
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
              className={cn(
                "touch-press flex flex-col items-center justify-center gap-0.5 py-1 px-2 rounded-2xl transition-all min-w-[54px] relative",
                isActive
                  ? "text-emerald-700 font-extrabold"
                  : isLocked
                  ? "text-slate-400 hover:text-slate-600"
                  : "text-slate-500 hover:text-slate-800"
              )}
            >
              <div className="relative flex flex-col items-center">
                <Icon
                  className={cn(
                    "h-5 w-5 transition-all duration-200",
                    isActive ? "stroke-[2.5] text-emerald-600 scale-110" : "text-slate-400"
                  )}
                />
                {isLocked && (
                  <span className="absolute -top-1 -right-1.5 h-3.5 w-3.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300 flex items-center justify-center text-[7px] font-black shadow-2xs">
                    <Lock className="h-2 w-2" />
                  </span>
                )}
                {(item as any).badge && !isActive && !isLocked && (
                  <span className="absolute -top-1 -right-2 flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                )}
                {isActive && (
                  <span className="h-1 w-1 rounded-full bg-emerald-600 mt-0.5 animate-in fade-in zoom-in" />
                )}
              </div>
              <span className="text-[10px] tracking-tight">{item.label}</span>
            </Link>
          );
        })}

        {/* Tab 5: Menu Drawer (Hamburger) */}
        <button
          type="button"
          onClick={onOpenMenu}
          className="touch-press flex flex-col items-center justify-center gap-0.5 py-1 px-2 rounded-2xl text-slate-500 hover:text-slate-900 min-w-[54px]"
        >
          <Menu className="h-5 w-5 text-slate-400" />
          <span className="text-[10px] tracking-tight font-medium">Menu</span>
        </button>
      </div>
    </nav>
  );
}
