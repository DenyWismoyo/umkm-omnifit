"use client";

import React, { useState } from "react";
import { BrandThemePreset, ShopProfile } from "@/types";
import { BRAND_THEME_PRESETS } from "@/data/brandingThemes";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Palette,
  Sparkles,
  Smartphone,
  Check,
  Image as ImageIcon,
  Camera,
  Eye,
  Store,
  Crown,
} from "lucide-react";

interface WhiteLabelSettingsCardProps {
  formData: {
    brandThemePreset: BrandThemePreset;
    brandColorPrimary: string;
    brandColorSecondary: string;
    tagline: string;
    bannerUrl: string;
    instagram: string;
    hideWatermark: boolean;
    shopName: string;
  };
  onChange: (fields: Partial<WhiteLabelSettingsCardProps["formData"]>) => void;
  isPro?: boolean;
}

export function WhiteLabelSettingsCard({
  formData,
  onChange,
  isPro,
}: WhiteLabelSettingsCardProps) {
  const currentPreset = BRAND_THEME_PRESETS[formData.brandThemePreset] || BRAND_THEME_PRESETS.emerald;

  const handleSelectPreset = (presetKey: BrandThemePreset) => {
    const p = BRAND_THEME_PRESETS[presetKey];
    onChange({
      brandThemePreset: presetKey,
      brandColorPrimary: p.primaryColor,
      brandColorSecondary: p.secondaryColor,
    });
  };

  return (
    <Card className="border-indigo-200 bg-gradient-to-br from-indigo-50/30 to-purple-50/20 shadow-sm overflow-hidden">
      <CardHeader className="pb-4 border-b border-indigo-100/80">
        <CardTitle className="text-base flex items-center justify-between">
          <div className="flex items-center gap-2 text-indigo-950 font-black">
            <Palette className="h-5 w-5 text-indigo-600" />
            <span>Kustomisasi Merek & White-Labeling (Branding Toko)</span>
          </div>
          <span className="text-[10px] font-bold bg-indigo-100 text-indigo-900 border border-indigo-200 px-2.5 py-0.5 rounded-full flex items-center gap-1">
            <Sparkles className="h-3 w-3 text-indigo-600" />
            Custom Identity
          </span>
        </CardTitle>
        <CardDescription className="text-xs text-slate-600">
          Ubah palet warna, tema visual, banner header, dan hilangkan watermark agar Menu Digital & Layar TV mencerminkan brand toko Anda secara eksklusif.
        </CardDescription>
      </CardHeader>

      <CardContent className="pt-5 space-y-6 text-xs">
        {/* 6 THEME PRESET CARDS */}
        <div>
          <label className="font-extrabold text-slate-900 block mb-2">
            1. Pilih Preset Palet Warna Brand:
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
            {(Object.keys(BRAND_THEME_PRESETS) as BrandThemePreset[]).map((key) => {
              const p = BRAND_THEME_PRESETS[key];
              const isSelected = formData.brandThemePreset === key;

              return (
                <div
                  key={key}
                  onClick={() => handleSelectPreset(key)}
                  className={`touch-press p-3 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between space-y-2 ${
                    isSelected
                      ? "bg-white border-2 border-indigo-600 shadow-md ring-2 ring-indigo-500/20"
                      : "bg-white/80 border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div
                        className="h-5 w-5 rounded-full border border-black/10 shadow-xs shrink-0"
                        style={{ backgroundColor: p.primaryColor }}
                      />
                      <span className="font-bold text-slate-900 text-xs truncate">
                        {p.name}
                      </span>
                    </div>
                    {isSelected && (
                      <div className="h-4 w-4 rounded-full bg-indigo-600 text-white flex items-center justify-center">
                        <Check className="h-2.5 w-2.5" />
                      </div>
                    )}
                  </div>

                  <p className="text-[10px] text-slate-500 line-clamp-2 leading-tight">
                    {p.categoryDesc}
                  </p>

                  <div className="flex items-center gap-1.5 pt-1">
                    <span
                      className="h-2 flex-1 rounded-full"
                      style={{ backgroundColor: p.primaryColor }}
                    />
                    <span
                      className="h-2 flex-1 rounded-full"
                      style={{ backgroundColor: p.secondaryColor }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* CUSTOM HEX PICKERS & LIVE MOCKUP PREVIEW GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* Left Column: Color Pickers & Brand Inputs */}
          <div className="lg:col-span-2 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Warna Utama (Primary Hex):
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={formData.brandColorPrimary || "#059669"}
                    onChange={(e) =>
                      onChange({
                        brandColorPrimary: e.target.value,
                        brandThemePreset: "custom",
                      })
                    }
                    className="h-9 w-9 rounded-xl border border-slate-200 cursor-pointer p-0.5 bg-white shrink-0"
                  />
                  <Input
                    value={formData.brandColorPrimary || "#059669"}
                    onChange={(e) =>
                      onChange({
                        brandColorPrimary: e.target.value,
                        brandThemePreset: "custom",
                      })
                    }
                    placeholder="#059669"
                    className="bg-white font-mono text-xs uppercase"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Warna Aksen (Secondary Hex):
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={formData.brandColorSecondary || "#10b981"}
                    onChange={(e) =>
                      onChange({
                        brandColorSecondary: e.target.value,
                        brandThemePreset: "custom",
                      })
                    }
                    className="h-9 w-9 rounded-xl border border-slate-200 cursor-pointer p-0.5 bg-white shrink-0"
                  />
                  <Input
                    value={formData.brandColorSecondary || "#10b981"}
                    onChange={(e) =>
                      onChange({
                        brandColorSecondary: e.target.value,
                        brandThemePreset: "custom",
                      })
                    }
                    placeholder="#10b981"
                    className="bg-white font-mono text-xs uppercase"
                  />
                </div>
              </div>
            </div>

            {/* Tagline & Banner Cover URL */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Slogan / Tagline Toko:
                </label>
                <Input
                  value={formData.tagline || ""}
                  onChange={(e) => onChange({ tagline: e.target.value })}
                  placeholder="Contoh: Kopi Asli Nusantara & Roastery"
                  className="bg-white text-xs"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Akun Instagram Toko:
                </label>
                <div className="relative">
                  <Camera className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                  <Input
                    value={formData.instagram || ""}
                    onChange={(e) => onChange({ instagram: e.target.value })}
                    placeholder="@kopisenja.id"
                    className="pl-8.5 bg-white text-xs"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">
                URL Banner Cover Toko (Header Menu Digital):
              </label>
              <Input
                value={formData.bannerUrl || ""}
                onChange={(e) => onChange({ bannerUrl: e.target.value })}
                placeholder="https://images.unsplash.com/... (atau kosongkan)"
                className="bg-white text-xs"
              />
            </div>

            {/* Watermark Toggle */}
            <div className="flex items-center justify-between p-3 rounded-2xl bg-white border border-indigo-100 shadow-2xs">
              <div className="space-y-0.5">
                <span className="font-extrabold text-slate-900 text-xs flex items-center gap-1.5">
                  <Crown className="h-3.5 w-3.5 text-amber-500" />
                  <span>Sembunyikan Watermark &quot;Powered by POS UMKM&quot;</span>
                </span>
                <p className="text-[10px] text-slate-500">
                  Tampilan menu dan TV display 100% eksklusif atas nama brand Anda sendiri.
                </p>
              </div>
              <input
                type="checkbox"
                checked={formData.hideWatermark}
                onChange={(e) => onChange({ hideWatermark: e.target.checked })}
                className="h-4 w-4 rounded accent-indigo-600 cursor-pointer"
              />
            </div>
          </div>

          {/* Right Column: Interactive Live Preview Mockup */}
          <div className="p-4 rounded-3xl bg-slate-900 text-white space-y-3 shadow-xl border border-slate-800 flex flex-col">
            <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-800">
              <span className="font-bold flex items-center gap-1 text-indigo-300">
                <Eye className="h-3.5 w-3.5" />
                <span>Live Preview Menu</span>
              </span>
              <span className="text-[9px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full font-mono">
                {formData.brandColorPrimary}
              </span>
            </div>

            {/* Mini Phone Mockup */}
            <div className="rounded-2xl bg-slate-950 p-3 border border-slate-800 space-y-2.5">
              {/* Mini Hero with Dynamic Brand Color */}
              <div
                className="p-3 rounded-xl relative overflow-hidden transition-colors"
                style={{
                  background: `linear-gradient(135deg, ${formData.brandColorPrimary} 0%, #0f172a 100%)`,
                }}
              >
                <div className="flex items-center gap-2">
                  <div className="h-7 w-7 rounded-lg bg-white/20 flex items-center justify-center text-white font-black text-xs">
                    <Store className="h-4 w-4" />
                  </div>
                  <div>
                    <h5 className="font-black text-xs text-white truncate max-w-[120px]">
                      {formData.shopName || "Toko Anda"}
                    </h5>
                    <p className="text-[9px] text-white/70 truncate max-w-[120px]">
                      {formData.tagline || "Tagline Brand Toko"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Mini Menu Item */}
              <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-white block">
                    Kopi Susu Signature
                  </span>
                  <span
                    className="text-[10px] font-black"
                    style={{ color: formData.brandColorSecondary }}
                  >
                    Rp 18.000
                  </span>
                </div>
                <button
                  type="button"
                  className="px-2 py-0.5 rounded-md text-[9px] font-bold text-white shadow-xs"
                  style={{ backgroundColor: formData.brandColorPrimary }}
                >
                  + Tambah
                </button>
              </div>

              {/* Mini Floating Cart Button */}
              <div
                className="p-2 rounded-xl text-white text-center font-bold text-[10px] shadow-md flex items-center justify-between"
                style={{
                  backgroundColor: formData.brandColorPrimary,
                }}
              >
                <span>Keranjang (2 Item)</span>
                <span className="font-black">Rp 36.000</span>
              </div>
            </div>

            <p className="text-[9px] text-slate-400 text-center">
              Warna ini akan otomatis diterapkan ke Menu Digital & TV Antrean Toko.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
