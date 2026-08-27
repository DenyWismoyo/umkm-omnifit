import { BrandThemePreset, ShopProfile } from "@/types";

export interface BrandThemeDefinition {
  id: BrandThemePreset;
  name: string;
  categoryDesc: string;
  primaryColor: string;
  secondaryColor: string;
  darkBgColor: string;
  accentBadgeColor: string;
  gradientBg: string;
}

export const BRAND_THEME_PRESETS: Record<BrandThemePreset, BrandThemeDefinition> = {
  emerald: {
    id: "emerald",
    name: "Emerald Modern",
    categoryDesc: "Resto Segar, F&B Modern, Healthy Bar, & Minuman Kekinian",
    primaryColor: "#059669",
    secondaryColor: "#10b981",
    darkBgColor: "#022c22",
    accentBadgeColor: "bg-emerald-500 text-slate-950",
    gradientBg: "from-emerald-950 via-slate-900 to-teal-950",
  },
  coffee: {
    id: "coffee",
    name: "Warm Coffee & Roastery",
    categoryDesc: "Kafe Kopi, Kedai Kopi Nusantara, Warm Bakery, & Warkop Estetik",
    primaryColor: "#b45309",
    secondaryColor: "#f59e0b",
    darkBgColor: "#451a03",
    accentBadgeColor: "bg-amber-500 text-slate-950",
    gradientBg: "from-amber-950 via-stone-900 to-yellow-950",
  },
  crimson: {
    id: "crimson",
    name: "Crimson Spice & Grill",
    categoryDesc: "Steakhouse, Ayam Geprek, Ramen, Sambal Bakar, & Fast Food",
    primaryColor: "#dc2626",
    secondaryColor: "#ef4444",
    darkBgColor: "#450a0a",
    accentBadgeColor: "bg-rose-500 text-white",
    gradientBg: "from-rose-950 via-slate-900 to-red-950",
  },
  ocean: {
    id: "ocean",
    name: "Ocean Wave & Seafood",
    categoryDesc: "Resto Seafood, Minuman Es Segar, Mocktail, & Ice Cream Gelato",
    primaryColor: "#0284c7",
    secondaryColor: "#0ea5e9",
    darkBgColor: "#082f49",
    accentBadgeColor: "bg-sky-500 text-slate-950",
    gradientBg: "from-sky-950 via-slate-900 to-cyan-950",
  },
  purple: {
    id: "purple",
    name: "Royal Berry & Pastry",
    categoryDesc: "Patisserie, Artisan Cake, Dessert Shop, & French Bakery",
    primaryColor: "#7c3aed",
    secondaryColor: "#8b5cf6",
    darkBgColor: "#2e1065",
    accentBadgeColor: "bg-purple-500 text-white",
    gradientBg: "from-purple-950 via-slate-900 to-indigo-950",
  },
  midnight: {
    id: "midnight",
    name: "Midnight Monochrome",
    categoryDesc: "Fine Dining, Minimalist Coffee Bar, Lounge, & Steak Bar",
    primaryColor: "#3f3f46",
    secondaryColor: "#71717a",
    darkBgColor: "#09090b",
    accentBadgeColor: "bg-zinc-100 text-slate-950",
    gradientBg: "from-zinc-950 via-neutral-900 to-stone-950",
  },
  custom: {
    id: "custom",
    name: "Kustom HEX Mandiri",
    categoryDesc: "Warna Brand Bebas Sesuai Keinginan Pemilik Bisnis",
    primaryColor: "#059669",
    secondaryColor: "#10b981",
    darkBgColor: "#0f172a",
    accentBadgeColor: "bg-emerald-500 text-slate-950",
    gradientBg: "from-slate-900 via-slate-950 to-slate-900",
  },
};

export function resolveBrandColors(shop?: ShopProfile | null) {
  const presetKey: BrandThemePreset = shop?.brandThemePreset || "emerald";
  const defaultPreset = BRAND_THEME_PRESETS[presetKey] || BRAND_THEME_PRESETS.emerald;

  const primary = shop?.brandColorPrimary || defaultPreset.primaryColor;
  const secondary = shop?.brandColorSecondary || defaultPreset.secondaryColor;

  return {
    primary,
    secondary,
    gradient: defaultPreset.gradientBg,
    accentBadge: defaultPreset.accentBadgeColor,
    darkBg: defaultPreset.darkBgColor,
    presetId: presetKey,
  };
}
