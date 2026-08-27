"use client";

import React, { useState, useEffect, useMemo } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useAuth } from "@/context/AuthContext";
import {
  getHppRecipes,
  saveHppRecipe,
  deleteHppRecipe,
  applyHppToProduct,
  getProducts,
  getCategories,
  createExpense,
} from "@/services/firestore";
import {
  HppRecipe,
  HppIngredient,
  HppPackaging,
  Product,
  Category,
} from "@/types";
import {
  HPP_BIG_DATA_TEMPLATES,
  BUSINESS_CATEGORIES_METADATA,
  BusinessCategory,
  PresetRecipeItem,
} from "@/data/hpp";
import { formatRupiah } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { CustomSelect, CustomSelectOption, CustomSelectGroup } from "@/components/common/CustomSelect";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Calculator,
  GraduationCap,
  Sparkles,
  Plus,
  Trash2,
  Save,
  CheckCircle2,
  TrendingUp,
  Target,
  ArrowRight,
  HelpCircle,
  Package,
  Layers,
  ShoppingBag,
  Zap,
  Info,
  DollarSign,
  PieChart,
  Lightbulb,
  FileCheck,
  AlertCircle,
  Copy,
  ChevronDown,
  Search,
  BookOpen,
  Filter,
  Flame,
  Store,
  Grid,
} from "lucide-react";
import { toast } from "sonner";
import confetti from "canvas-confetti";

export default function HppEducationPage() {
  const { user, isTrialActive, trialDaysLeft } = useAuth();
  const [activeTab, setActiveTab] = useState<string>("calculator");
  const [savedRecipes, setSavedRecipes] = useState<HppRecipe[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);

  // Big Data Catalog Modal
  const [isCatalogModalOpen, setIsCatalogModalOpen] = useState(false);
  const [catalogSearchQuery, setCatalogSearchQuery] = useState("");
  const [selectedCatalogCategory, setSelectedCatalogCategory] = useState<string>("all");
  const [selectedSubCategory, setSelectedSubCategory] = useState<string>("all");

  // Form State Calculator
  const [recipeName, setRecipeName] = useState<string>(HPP_BIG_DATA_TEMPLATES[0].name);
  const [recipeCategory, setRecipeCategory] = useState<string>(HPP_BIG_DATA_TEMPLATES[0].mainCategory);
  const [batchYield, setBatchYield] = useState<number>(HPP_BIG_DATA_TEMPLATES[0].batchYield);
  const [ingredients, setIngredients] = useState<HppIngredient[]>(
    HPP_BIG_DATA_TEMPLATES[0].ingredients
  );
  const [packagings, setPackagings] = useState<HppPackaging[]>(
    HPP_BIG_DATA_TEMPLATES[0].packagings
  );
  const [directLaborCost, setDirectLaborCost] = useState<number>(
    HPP_BIG_DATA_TEMPLATES[0].directLaborCost
  );
  const [overheadCost, setOverheadCost] = useState<number>(
    HPP_BIG_DATA_TEMPLATES[0].overheadCost
  );
  const [targetMarginPct, setTargetMarginPct] = useState<number>(
    HPP_BIG_DATA_TEMPLATES[0].targetMarginPct
  );
  const [customPrice, setCustomPrice] = useState<number>(
    HPP_BIG_DATA_TEMPLATES[0].targetSellingPrice
  );
  const [monthlyFixedCost, setMonthlyFixedCost] = useState<number>(
    HPP_BIG_DATA_TEMPLATES[0].monthlyFixedCost
  );
  const [recipeTip, setRecipeTip] = useState<string | undefined>(
    HPP_BIG_DATA_TEMPLATES[0].tips
  );
  const [priceStrategy, setPriceStrategy] = useState<"margin" | "custom">("margin");

  // What-If Simulator state
  const [ingredientInflationPct, setIngredientInflationPct] = useState<number>(0);

  // Applied Product selection
  const [isApplyingToPOS, setIsApplyingToPOS] = useState<boolean>(false);
  const [selectedExistingProductId, setSelectedExistingProductId] = useState<string>("");

  const loadSavedData = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const [recipes, prods, cats] = await Promise.all([
        getHppRecipes(user.uid),
        getProducts(user.uid),
        getCategories(user.uid),
      ]);
      setSavedRecipes(recipes);
      setProducts(prods);
      setCategories(cats);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSavedData();
  }, [user]);

  // Handle Load Preset
  const handleLoadPreset = (preset: PresetRecipeItem) => {
    setRecipeName(preset.name);
    setRecipeCategory(preset.mainCategory);
    setBatchYield(preset.batchYield);
    setIngredients(preset.ingredients.map((i) => ({ ...i })));
    setPackagings(preset.packagings.map((p) => ({ ...p })));
    setDirectLaborCost(preset.directLaborCost);
    setOverheadCost(preset.overheadCost);
    setTargetMarginPct(preset.targetMarginPct);
    setCustomPrice(preset.targetSellingPrice);
    setMonthlyFixedCost(preset.monthlyFixedCost);
    setRecipeTip(preset.tips);
    setIngredientInflationPct(0);
    setIsCatalogModalOpen(false);
    toast.success(`Template "${preset.name}" (${preset.mainCategory}) berhasil dimuat!`);
  };

  // Add / Edit Ingredient
  const handleAddIngredient = () => {
    const newId = Date.now().toString();
    setIngredients([
      ...ingredients,
      {
        id: newId,
        name: "",
        packagePrice: 0,
        packageQty: 1000,
        packageUnit: "Gram",
        usedQty: 0,
        usedUnit: "Gram",
        cost: 0,
      },
    ]);
  };

  const handleUpdateIngredient = (
    id: string,
    field: keyof HppIngredient,
    value: any
  ) => {
    setIngredients((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const updated = { ...item, [field]: value };
          const pkgPrice = Number(field === "packagePrice" ? value : updated.packagePrice) || 0;
          const pkgQty = Number(field === "packageQty" ? value : updated.packageQty) || 1;
          const usedQty = Number(field === "usedQty" ? value : updated.usedQty) || 0;
          updated.cost = Math.round((pkgPrice / (pkgQty || 1)) * usedQty);
          return updated;
        }
        return item;
      })
    );
  };

  const handleRemoveIngredient = (id: string) => {
    setIngredients((prev) => prev.filter((i) => i.id !== id));
  };

  // Add / Edit Packaging
  const handleAddPackaging = () => {
    const newId = Date.now().toString();
    setPackagings([
      ...packagings,
      {
        id: newId,
        name: "",
        unitPrice: 0,
        qty: 1,
        cost: 0,
      },
    ]);
  };

  const handleUpdatePackaging = (
    id: string,
    field: keyof HppPackaging,
    value: any
  ) => {
    setPackagings((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const updated = { ...item, [field]: value };
          const price = Number(field === "unitPrice" ? value : updated.unitPrice) || 0;
          const qty = Number(field === "qty" ? value : updated.qty) || 0;
          updated.cost = Math.round(price * qty);
          return updated;
        }
        return item;
      })
    );
  };

  const handleRemovePackaging = (id: string) => {
    setPackagings((prev) => prev.filter((p) => p.id !== id));
  };

  // Calculated Totals
  const rawIngredientsCost = useMemo(() => {
    return ingredients.reduce((acc, curr) => acc + curr.cost, 0);
  }, [ingredients]);

  // Applied with What-If inflation slider
  const totalIngredientsCost = useMemo(() => {
    const factor = 1 + ingredientInflationPct / 100;
    return Math.round(rawIngredientsCost * factor);
  }, [rawIngredientsCost, ingredientInflationPct]);

  const totalPackagingCost = useMemo(() => {
    return packagings.reduce((acc, curr) => acc + curr.cost, 0);
  }, [packagings]);

  const totalBatchCost = useMemo(() => {
    return (
      totalIngredientsCost +
      totalPackagingCost +
      (Number(directLaborCost) || 0) +
      (Number(overheadCost) || 0)
    );
  }, [totalIngredientsCost, totalPackagingCost, directLaborCost, overheadCost]);

  const validYield = Math.max(1, Number(batchYield) || 1);
  const hppPerUnit = Math.round(totalBatchCost / validYield);

  // Recommended Price Calculations based on Cost-Plus Margin
  const calculatedCostPlusPrice = useMemo(() => {
    if (targetMarginPct >= 100) return hppPerUnit * 2;
    const marginRatio = (100 - targetMarginPct) / 100;
    const rawPrice = hppPerUnit / Math.max(0.01, marginRatio);
    // Round to nearest 500
    return Math.ceil(rawPrice / 500) * 500;
  }, [hppPerUnit, targetMarginPct]);

  const activeSellingPrice =
    priceStrategy === "margin" ? calculatedCostPlusPrice : Number(customPrice) || 0;

  const profitPerUnit = activeSellingPrice - hppPerUnit;
  const actualMarginPct =
    activeSellingPrice > 0
      ? Math.round(((activeSellingPrice - hppPerUnit) / activeSellingPrice) * 100)
      : 0;
  const actualMarkupPct =
    hppPerUnit > 0
      ? Math.round(((activeSellingPrice - hppPerUnit) / hppPerUnit) * 100)
      : 0;

  // Break-Even Point (BEP) Calculations
  const bepUnitsMonth = useMemo(() => {
    if (profitPerUnit <= 0) return 0;
    return Math.ceil(monthlyFixedCost / profitPerUnit);
  }, [monthlyFixedCost, profitPerUnit]);

  const bepUnitsDay = Math.ceil(bepUnitsMonth / 30);
  const bepRevenueMonth = bepUnitsMonth * activeSellingPrice;

  // Available Subcategories based on selected category
  const availableSubCategories = useMemo(() => {
    if (selectedCatalogCategory === "all") return [];
    const subs = new Set<string>();
    HPP_BIG_DATA_TEMPLATES.filter(
      (t) => t.mainCategory === selectedCatalogCategory
    ).forEach((t) => subs.add(t.subCategory));
    return Array.from(subs);
  }, [selectedCatalogCategory]);

  // Filter Big Data Catalog Templates
  const filteredTemplates = useMemo(() => {
    return HPP_BIG_DATA_TEMPLATES.filter((t) => {
      const matchSearch =
        t.name.toLowerCase().includes(catalogSearchQuery.toLowerCase()) ||
        t.description.toLowerCase().includes(catalogSearchQuery.toLowerCase()) ||
        t.subCategory.toLowerCase().includes(catalogSearchQuery.toLowerCase()) ||
        t.ingredients.some((i) =>
          i.name.toLowerCase().includes(catalogSearchQuery.toLowerCase())
        );

      const matchCategory =
        selectedCatalogCategory === "all" || t.mainCategory === selectedCatalogCategory;

      const matchSub =
        selectedSubCategory === "all" || t.subCategory === selectedSubCategory;

      return matchSearch && matchCategory && matchSub;
    });
  }, [catalogSearchQuery, selectedCatalogCategory, selectedSubCategory]);

  // Save Recipe to Firestore
  const handleSaveRecipe = async () => {
    if (!user) return;
    if (!recipeName.trim()) {
      toast.error("Nama resep produk tidak boleh kosong!");
      return;
    }

    try {
      const payload: Omit<HppRecipe, "id"> = {
        name: recipeName.trim(),
        category: recipeCategory,
        batchYield: validYield,
        ingredients,
        packagings,
        directLaborCost,
        overheadCost,
        totalIngredientsCost,
        totalPackagingCost,
        totalProductionCost: totalBatchCost,
        hppPerUnit,
        targetMarginPct,
        targetSellingPrice: activeSellingPrice,
        profitPerUnit,
        monthlyFixedCost,
        bepUnits: bepUnitsMonth,
        bepRevenue: bepRevenueMonth,
      };

      await saveHppRecipe(user.uid, payload);
      toast.success(`Resep HPP "${recipeName}" berhasil disimpan ke sistem!`);
      await loadSavedData();
    } catch (err: any) {
      toast.error("Gagal menyimpan resep: " + err.message);
    }
  };

  // Apply to POS Product Catalog
  const handleApplyToPOS = async () => {
    if (!user) return;
    if (activeSellingPrice <= 0) {
      toast.error("Harga jual harus lebih besar dari 0!");
      return;
    }

    try {
      setIsApplyingToPOS(true);
      await applyHppToProduct(
        user.uid,
        recipeName,
        hppPerUnit,
        activeSellingPrice,
        recipeCategory,
        "Porsi",
        selectedExistingProductId || undefined
      );

      // Trigger Confetti
      try {
        confetti({
          particleCount: 70,
          spread: 60,
          origin: { y: 0.6 },
        });
      } catch (e) {}

      toast.success(
        `✨ Berhasil! Produk "${recipeName}" telah diterapkan ke Kasir POS dengan Modal ${formatRupiah(hppPerUnit)} & Harga Jual ${formatRupiah(activeSellingPrice)}.`
      );
      await loadSavedData();
    } catch (err: any) {
      toast.error("Gagal menerapkan ke POS: " + err.message);
    } finally {
      setIsApplyingToPOS(false);
    }
  };

  // Record Raw Materials / Packaging as Store Expense
  const handleRecordHppExpense = async () => {
    if (!user) return;
    if (totalBatchCost <= 0) {
      toast.error("Total biaya bahan/produksi masih Rp 0!");
      return;
    }

    try {
      await createExpense(user.uid, {
        description: `Belanja Bahan & Kemasan Resep: ${recipeName} (${validYield} Unit)`,
        amount: totalBatchCost,
        category: "Bahan Baku / Kulakan",
        paymentMethod: "cash",
        date: new Date().toISOString(),
      });
      toast.success(
        `✨ Berhasil! Pengeluaran modal belanja bahan ${formatRupiah(totalBatchCost)} untuk "${recipeName}" telah dicatat ke Buku Pengeluaran Toko.`
      );
    } catch (err: any) {
      toast.error("Gagal mencatat pengeluaran: " + err.message);
    }
  };

  // Delete Recipe
  const handleDeleteRecipe = async (id: string, name: string) => {
    if (!user) return;
    if (confirm(`Hapus resep HPP "${name}"?`)) {
      try {
        await deleteHppRecipe(user.uid, id);
        toast.success(`Resep "${name}" dihapus.`);
        await loadSavedData();
      } catch (err) {
        toast.error("Gagal menghapus.");
      }
    }
  };

  // Grouped Preset Options for CustomSelect
  const PRESET_GROUPS: CustomSelectGroup[] = useMemo(() => {
    return BUSINESS_CATEGORIES_METADATA.map((cat) => ({
      id: cat.name,
      label: cat.name,
      icon: cat.icon,
    }));
  }, []);

  const PRESET_OPTIONS: CustomSelectOption[] = useMemo(() => {
    return HPP_BIG_DATA_TEMPLATES.map((t) => ({
      value: t.id,
      label: t.name,
      emoji: t.icon,
      group: t.mainCategory,
      badge: `${t.ingredients.length} Bahan`,
      description: `Porsi: ${t.batchYield} | Target Jual: ${formatRupiah(t.targetSellingPrice || 0)}`,
    }));
  }, []);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Compact, Ultra-Modern Hero Banner */}
        <div className="rounded-2xl sm:rounded-3xl bg-gradient-to-r from-emerald-950 via-slate-900 to-teal-950 p-4 sm:p-6 text-white relative overflow-hidden shadow-sm border border-emerald-900/60">
          <div className="absolute top-0 right-0 -mt-6 -mr-6 h-36 w-36 rounded-full bg-emerald-500/10 blur-2xl pointer-events-none" />
          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 text-[10px] font-bold">
                  <Sparkles className="h-3 w-3" />
                  <span>Big Data & Smart Pricing</span>
                </span>
                <span className="text-[10px] text-slate-400">
                  {HPP_BIG_DATA_TEMPLATES.length}+ Template 10 Sektor
                </span>
              </div>
              <h1 className="text-lg sm:text-2xl font-black tracking-tight text-white leading-tight">
                Kalkulator HPP & Smart Pricing
              </h1>
              <p className="text-xs text-slate-300 line-clamp-1">
                Hitung modal presisi hingga gram/ml, kemasan, margin kontribusi & balik modal.
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0 self-start sm:self-auto">
              <Button
                variant="default"
                size="sm"
                onClick={() => setIsCatalogModalOpen(true)}
                className="touch-press bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black text-xs h-8 px-3 gap-1.5 shadow-xs"
              >
                <BookOpen className="h-3.5 w-3.5" />
                <span>Katalog ({HPP_BIG_DATA_TEMPLATES.length})</span>
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setActiveTab("academy")}
                className="touch-press bg-white/10 text-white border-white/20 hover:bg-white/20 text-xs h-8 px-2.5 gap-1"
              >
                <GraduationCap className="h-3.5 w-3.5 text-emerald-400" />
                <span>Teori HPP</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Trial Feature Highlight Banner */}
        {isTrialActive && (
          <div className="rounded-2xl border border-emerald-300/90 bg-emerald-50/80 p-3.5 sm:p-4 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-in fade-in">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                <Sparkles className="h-4.5 w-4.5 text-amber-300" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-black text-emerald-950">
                    Akses Kalkulator HPP Terbuka Penuh (Masa Trial: {trialDaysLeft} Hari Tersisa)
                  </span>
                  <span className="text-[9px] font-bold bg-emerald-200 text-emerald-950 px-2 py-0.2 rounded-full">
                    FREE TRIAL
                  </span>
                </div>
                <p className="text-[10.5px] text-slate-600 mt-0.5">
                  Gunakan seluruh template resep UMKM, atur margin keuntungan, dan simpan langsung ke katalog produk POS Anda!
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Tabs - 100% In-Boundary Grid (Zero Overflow) */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3 w-full h-10 p-1 rounded-xl bg-slate-100/90 border border-slate-200/60 shadow-2xs">
            <TabsTrigger
              value="calculator"
              className="touch-press flex items-center justify-center gap-1 py-1.5 px-1 text-[11px] sm:text-xs font-bold rounded-lg data-[state=active]:bg-white data-[state=active]:text-emerald-950 data-[state=active]:shadow-xs transition-all"
            >
              <Calculator className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
              <span className="truncate">1. Hitung Resep</span>
            </TabsTrigger>
            <TabsTrigger
              value="academy"
              className="touch-press flex items-center justify-center gap-1 py-1.5 px-1 text-[11px] sm:text-xs font-bold rounded-lg data-[state=active]:bg-white data-[state=active]:text-teal-950 data-[state=active]:shadow-xs transition-all"
            >
              <GraduationCap className="h-3.5 w-3.5 text-teal-600 shrink-0" />
              <span className="truncate">2. Teori HPP</span>
            </TabsTrigger>
            <TabsTrigger
              value="saved"
              className="touch-press flex items-center justify-center gap-1 py-1.5 px-1 text-[11px] sm:text-xs font-bold rounded-lg data-[state=active]:bg-white data-[state=active]:text-blue-950 data-[state=active]:shadow-xs transition-all"
            >
              <FileCheck className="h-3.5 w-3.5 text-blue-600 shrink-0" />
              <span className="truncate">3. Resep Saya ({savedRecipes.length})</span>
            </TabsTrigger>
          </TabsList>

          {/* =========================================================
              TAB 1: SMART HPP & RECIPE COSTING CALCULATOR
              ========================================================= */}
          <TabsContent value="calculator" className="space-y-3.5 pt-1">
            {/* 100% In-Boundary Custom Preset Selector Dropdown + Catalog Button */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              <div className="flex-1">
                <CustomSelect
                  options={PRESET_OPTIONS}
                  groups={PRESET_GROUPS}
                  value=""
                  onChange={(val) => {
                    const found = HPP_BIG_DATA_TEMPLATES.find((t) => t.id === val);
                    if (found) handleLoadPreset(found);
                  }}
                  placeholder="⚡ Pilih Preset Resep Cepat (111+ Template)..."
                  size="md"
                />
              </div>

              <Button
                type="button"
                variant="default"
                size="sm"
                onClick={() => setIsCatalogModalOpen(true)}
                className="touch-press h-11 px-4 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold gap-1.5 shrink-0 shadow-xs rounded-2xl"
              >
                <Grid className="h-4 w-4 text-emerald-400" />
                <span>Katalog Lengkap ({HPP_BIG_DATA_TEMPLATES.length})</span>
              </Button>
            </div>

            {/* Tips Banner if available */}
            {recipeTip && (
              <div className="rounded-xl border border-amber-200 bg-amber-50/70 p-3 text-xs text-amber-950 flex items-start gap-2.5 shadow-2xs">
                <Lightbulb className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <span className="font-extrabold block text-amber-900 text-[11px]">
                    💡 Rahasia Margin ({recipeCategory}):
                  </span>
                  <p className="text-[11px] leading-relaxed text-amber-800">
                    {recipeTip}
                  </p>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
              {/* LEFT & CENTER (2 COLS): Ingredients & Packaging Specs */}
              <div className="lg:col-span-2 space-y-4 sm:space-y-5">
                {/* 1. Identity & Batch Yield */}
                <div className="borderless-card p-3.5 sm:p-5 space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                    <h3 className="font-extrabold text-slate-900 text-xs sm:text-sm flex items-center gap-2">
                      <Package className="h-4 w-4 text-emerald-600" />
                      <span>Identitas Produk & Hasil Porsi (Batch Yield)</span>
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
                    <div className="sm:col-span-2">
                      <label className="font-semibold text-slate-700 block mb-1 text-[11px]">
                        Nama Menu / Produk / Jasa
                      </label>
                      <Input
                        value={recipeName}
                        onChange={(e) => setRecipeName(e.target.value)}
                        placeholder="Contoh: Nasi Kucing Sambal Teri"
                        className="font-bold text-xs sm:text-sm h-9 bg-white"
                      />
                    </div>

                    <div>
                      <label className="font-semibold text-slate-700 block mb-1 text-[11px]">
                        Kategori Bisnis
                      </label>
                      <Input
                        value={recipeCategory}
                        onChange={(e) => setRecipeCategory(e.target.value)}
                        placeholder="Angkringan / Minuman / Laundry"
                        className="text-xs h-9 bg-white"
                      />
                    </div>
                  </div>

                  <div className="rounded-xl bg-slate-50/80 border border-slate-200/80 p-2.5 sm:p-3 flex items-center justify-between gap-2">
                    <div>
                      <span className="text-xs font-bold text-slate-800 block">
                        Hasil Porsi per 1 Resep Adonan (Batch Yield)
                      </span>
                      <p className="text-[10px] sm:text-[11px] text-slate-500">
                        Isi 1 jika resep 1 porsi/kg, atau isi total porsi per 1 batch masak.
                      </p>
                    </div>
                    <div className="w-20 sm:w-24 shrink-0">
                      <Input
                        type="number"
                        min="1"
                        value={batchYield}
                        onChange={(e) => setBatchYield(Math.max(1, Number(e.target.value) || 1))}
                        className="text-center font-black text-sm sm:text-base h-8 sm:h-9 bg-white"
                      />
                    </div>
                  </div>
                </div>

                {/* 2. Rincian Spesifikasi Bahan Baku (Direct Materials) */}
                <div className="borderless-card p-3.5 sm:p-5 space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                    <div>
                      <h3 className="font-extrabold text-slate-900 text-xs sm:text-sm flex items-center gap-1.5">
                        <Layers className="h-4 w-4 text-teal-600" />
                        <span>1. Bahan Baku Langsung (Direct Materials)</span>
                      </h3>
                      <p className="text-[10px] sm:text-[11px] text-slate-500">
                        Dihitung proporsional dari harga beli kemasan dibagi takaran.
                      </p>
                    </div>

                    <Button
                      type="button"
                      variant="default"
                      size="sm"
                      onClick={handleAddIngredient}
                      className="touch-press gap-1 text-xs h-8 px-2.5 font-bold shadow-xs shrink-0"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      <span>Tambah</span>
                    </Button>
                  </div>

                  {ingredients.length === 0 ? (
                    <div className="text-center py-6 text-xs text-slate-400">
                      Belum ada bahan baku ditambahkan. Klik "Tambah Bahan" di atas.
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {ingredients.map((ing) => (
                        <div
                          key={ing.id}
                          className="rounded-xl border border-slate-200 bg-slate-50/50 p-3 space-y-2.5 transition-all hover:bg-slate-50"
                        >
                          <div className="flex items-center justify-between gap-2">
                            <Input
                              value={ing.name}
                              onChange={(e) =>
                                handleUpdateIngredient(ing.id, "name", e.target.value)
                              }
                              placeholder="Nama Bahan (contoh: Biji Kopi / Deterjen / Daging)"
                              className="font-bold text-xs h-8 flex-1 bg-white"
                            />
                            <div className="flex items-center gap-2">
                              <span className="font-black text-xs text-emerald-800 bg-emerald-100/70 px-2.5 py-1 rounded-lg">
                                {formatRupiah(ing.cost)}
                              </span>
                              <button
                                type="button"
                                onClick={() => handleRemoveIngredient(ing.id)}
                                className="text-slate-400 hover:text-rose-600 p-1"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
                            <div>
                              <label className="text-slate-500 block mb-0.5">
                                Harga 1 Kemasan Beli
                              </label>
                              <Input
                                type="number"
                                min="0"
                                value={ing.packagePrice || ""}
                                onChange={(e) =>
                                  handleUpdateIngredient(
                                    ing.id,
                                    "packagePrice",
                                    Number(e.target.value) || 0
                                  )
                                }
                                placeholder="Rp"
                                className="h-7 text-xs bg-white"
                              />
                            </div>

                            <div>
                              <label className="text-slate-500 block mb-0.5">
                                Isi Volume Kemasan
                              </label>
                              <div className="flex gap-1">
                                <Input
                                  type="number"
                                  min="1"
                                  value={ing.packageQty || ""}
                                  onChange={(e) =>
                                    handleUpdateIngredient(
                                      ing.id,
                                      "packageQty",
                                      Number(e.target.value) || 1
                                    )
                                  }
                                  placeholder="1000"
                                  className="h-7 text-xs w-16 bg-white"
                                />
                                <Input
                                  value={ing.packageUnit}
                                  onChange={(e) =>
                                    handleUpdateIngredient(
                                      ing.id,
                                      "packageUnit",
                                      e.target.value
                                    )
                                  }
                                  placeholder="Gram/Ml/Pcs"
                                  className="h-7 text-xs flex-1 bg-white"
                                />
                              </div>
                            </div>

                            <div className="col-span-2">
                              <label className="text-slate-500 block mb-0.5">
                                Takaran Dipakai per Resep
                              </label>
                              <div className="flex items-center gap-1.5">
                                <Input
                                  type="number"
                                  min="0"
                                  value={ing.usedQty || ""}
                                  onChange={(e) =>
                                    handleUpdateIngredient(
                                      ing.id,
                                      "usedQty",
                                      Number(e.target.value) || 0
                                    )
                                  }
                                  placeholder="Takaran"
                                  className="h-7 text-xs w-20 bg-white font-bold"
                                />
                                <span className="text-slate-500 text-xs">
                                  {ing.packageUnit}
                                </span>
                                <span className="text-[10px] text-slate-400 ml-auto">
                                  ({formatRupiah(ing.packagePrice)} ÷ {ing.packageQty} × {ing.usedQty})
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}

                      <div className="flex justify-between items-center pt-2 text-xs font-bold text-slate-800">
                        <span>Total Biaya Bahan Baku:</span>
                        <span className="text-sm font-black text-teal-800">
                          {formatRupiah(totalIngredientsCost)}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* 3. Rincian Kemasan & Packaging */}
                <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div>
                      <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                        <ShoppingBag className="h-4 w-4 text-amber-600" />
                        <span>2. Kemasan, Label Stiker & Perlengkapan (Packaging)</span>
                      </h3>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Biaya pembungkus, cup, paperbox, plastik sablon, sedotan, sendok, dan stiker label.
                      </p>
                    </div>

                    <Button
                      type="button"
                      variant="default"
                      size="sm"
                      onClick={handleAddPackaging}
                      className="gap-1 text-xs h-8 bg-amber-600 hover:bg-amber-700 text-white"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      <span>Tambah Kemasan</span>
                    </Button>
                  </div>

                  {packagings.length === 0 ? (
                    <div className="text-center py-4 text-xs text-slate-400">
                      Belum ada kemasan ditambahkan.
                    </div>
                  ) : (
                    <div className="space-y-2.5">
                      {packagings.map((pkg) => (
                        <div
                          key={pkg.id}
                          className="flex items-center justify-between gap-2 p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs"
                        >
                          <Input
                            value={pkg.name}
                            onChange={(e) =>
                              handleUpdatePackaging(pkg.id, "name", e.target.value)
                            }
                            placeholder="Contoh: Plastik Laundry / Dus Donat / Paper Cup"
                            className="h-8 text-xs font-semibold bg-white flex-1"
                          />

                          <div className="flex items-center gap-2">
                            <div className="flex items-center gap-1">
                              <span className="text-[10px] text-slate-400">Rp/pcs:</span>
                              <Input
                                type="number"
                                min="0"
                                value={pkg.unitPrice || ""}
                                onChange={(e) =>
                                  handleUpdatePackaging(
                                    pkg.id,
                                    "unitPrice",
                                    Number(e.target.value) || 0
                                  )
                                }
                                placeholder="0"
                                className="h-8 w-20 text-xs bg-white text-right"
                              />
                            </div>

                            <span className="font-black text-xs text-amber-800 bg-amber-100/70 px-2 py-1 rounded-md min-w-[70px] text-right">
                              {formatRupiah(pkg.cost)}
                            </span>

                            <button
                              type="button"
                              onClick={() => handleRemovePackaging(pkg.id)}
                              className="text-slate-400 hover:text-rose-600 p-1"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}

                      <div className="flex justify-between items-center pt-2 text-xs font-bold text-slate-800">
                        <span>Total Biaya Kemasan:</span>
                        <span className="text-sm font-black text-amber-800">
                          {formatRupiah(totalPackagingCost)}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* 4. Tenaga Kerja Langsung & Beban Utilitas/Overhead */}
                <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm space-y-4">
                  <div className="border-b border-slate-100 pb-3">
                    <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                      <Zap className="h-4 w-4 text-purple-600" />
                      <span>3. Tenaga Kerja & Biaya Overhead Produksi / Layanan</span>
                    </h3>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Alokasi upah pengerjaan/komisi serta biaya gas LPG, listrik mesin, air, dan peralatan per batch.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">
                        Biaya Tenaga Kerja (Labor) per Batch
                      </label>
                      <Input
                        type="number"
                        min="0"
                        value={directLaborCost || ""}
                        onChange={(e) =>
                          setDirectLaborCost(Number(e.target.value) || 0)
                        }
                        placeholder="Contoh: 1000"
                        className="h-10 text-sm font-bold"
                      />
                      <span className="text-[10px] text-slate-400 mt-1 block">
                        Estimasi upah pembuatan / komisi teknisi per 1 porsi/batch
                      </span>
                    </div>

                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">
                        Biaya Utilitas & Overhead per Batch
                      </label>
                      <Input
                        type="number"
                        min="0"
                        value={overheadCost || ""}
                        onChange={(e) =>
                          setOverheadCost(Number(e.target.value) || 0)
                        }
                        placeholder="Contoh: 500"
                        className="h-10 text-sm font-bold"
                      />
                      <span className="text-[10px] text-slate-400 mt-1 block">
                        Alokasi gas, listrik, air, dan keausan alat per batch
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* RIGHT COLUMN (1 COL): HPP Summary, Pricing Engine & POS Action */}
              <div className="space-y-6">
                {/* HPP Result Card */}
                <div className="rounded-3xl border border-emerald-300 bg-gradient-to-br from-emerald-500/10 via-teal-500/10 to-slate-900/5 p-6 shadow-md space-y-4">
                  <div>
                    <span className="text-[11px] font-black uppercase tracking-wider text-emerald-800">
                      Total HPP (Harga Pokok)
                    </span>
                    <div className="flex items-baseline gap-2 mt-1">
                      <p className="text-3xl font-black text-emerald-950">
                        {formatRupiah(hppPerUnit)}
                      </p>
                      <span className="text-xs font-semibold text-emerald-700">
                        / {batchYield > 1 ? `Unit (dari ${batchYield} porsi)` : "Unit"}
                      </span>
                    </div>
                  </div>

                  {/* Breakdown cost pills */}
                  <div className="space-y-1.5 text-xs pt-2 border-t border-emerald-200">
                    <div className="flex justify-between text-slate-600">
                      <span>Bahan Baku:</span>
                      <span className="font-bold">{formatRupiah(totalIngredientsCost)}</span>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>Kemasan Packaging:</span>
                      <span className="font-bold">{formatRupiah(totalPackagingCost)}</span>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>Tenaga Kerja:</span>
                      <span className="font-bold">{formatRupiah(directLaborCost)}</span>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>Overhead / Utilitas:</span>
                      <span className="font-bold">{formatRupiah(overheadCost)}</span>
                    </div>
                    {batchYield > 1 && (
                      <div className="flex justify-between font-bold text-emerald-900 pt-1 border-t border-emerald-200">
                        <span>Total 1 Batch ({batchYield} unit):</span>
                        <span>{formatRupiah(totalBatchCost)}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Smart Pricing Strategy Engine */}
                <div className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-sm space-y-4">
                  <div className="border-b border-slate-100 pb-3">
                    <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                      <Target className="h-4 w-4 text-emerald-600" />
                      <span>Strategi Penentuan Harga Jual</span>
                    </h3>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Pilih target persentase margin keuntungan Anda
                    </p>
                  </div>

                  {/* Quick Margin Presets */}
                  <div>
                    <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-2">
                      Pilihan Target Margin Profit:
                    </label>
                    <div className="grid grid-cols-4 gap-1.5">
                      {[30, 40, 50, 60].map((m) => (
                        <button
                          key={m}
                          type="button"
                          onClick={() => {
                            setTargetMarginPct(m);
                            setPriceStrategy("margin");
                          }}
                          className={`rounded-xl py-2 text-xs font-black transition-all ${
                            targetMarginPct === m && priceStrategy === "margin"
                              ? "bg-emerald-600 text-white shadow-sm shadow-emerald-600/30"
                              : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                          }`}
                        >
                          {m}%
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Target Selling Price Input & Custom Toggle */}
                  <div className="space-y-2 pt-2">
                    <label className="text-xs font-bold text-slate-800 block">
                      Harga Jual Final (Rp)
                    </label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400">
                        Rp
                      </span>
                      <Input
                        type="number"
                        min="0"
                        step="500"
                        value={activeSellingPrice || ""}
                        onChange={(e) => {
                          setCustomPrice(Number(e.target.value) || 0);
                          setPriceStrategy("custom");
                        }}
                        className="pl-11 text-xl font-black text-slate-950 h-12 border-emerald-400 focus:ring-emerald-500"
                      />
                    </div>
                  </div>

                  {/* Profit Result Display */}
                  <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-emerald-900">
                        Laba Bersih per Unit:
                      </span>
                      <span className="text-base font-black text-emerald-800">
                        +{formatRupiah(profitPerUnit)}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs text-emerald-700 pt-1 border-t border-emerald-200/80">
                      <span>Profit Margin: <strong>{actualMarginPct}%</strong></span>
                      <span>Markup: <strong>{actualMarkupPct}%</strong></span>
                    </div>
                  </div>

                  {/* Break-Even Point Box */}
                  <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-3.5 space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-800 flex items-center gap-1.5">
                        <TrendingUp className="h-3.5 w-3.5 text-blue-600" />
                        <span>Analisis Titik Impas (BEP)</span>
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[11px] text-slate-500">Biaya Tetap/Bln:</span>
                      <Input
                        type="number"
                        min="0"
                        step="100000"
                        value={monthlyFixedCost || ""}
                        onChange={(e) => setMonthlyFixedCost(Number(e.target.value) || 0)}
                        placeholder="Sewa + Gaji"
                        className="h-7 text-xs bg-white flex-1 text-right font-semibold"
                      />
                    </div>

                    <div className="rounded-xl bg-white border border-slate-200 p-2.5 text-center">
                      <p className="text-[11px] text-slate-500">
                        Target Penjualan Minimal agar Bebas Biaya Operasional:
                      </p>
                      <p className="text-base font-black text-slate-900 mt-0.5">
                        {bepUnitsDay} unit / hari
                      </p>
                      <p className="text-[10px] text-slate-400">
                        ({bepUnitsMonth} unit/bulan = {formatRupiah(bepRevenueMonth)})
                      </p>
                    </div>
                  </div>

                  {/* "What-If" Sensitivity Simulation Slider */}
                  <div className="rounded-2xl border border-amber-200 bg-amber-50/50 p-3.5 space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-amber-900 flex items-center gap-1">
                        <AlertCircle className="h-3.5 w-3.5 text-amber-600" />
                        <span>Simulasi Inflasi Bahan (+{ingredientInflationPct}%)</span>
                      </span>
                      <span className="text-[11px] text-amber-800 font-bold">
                        HPP: {formatRupiah(hppPerUnit)}
                      </span>
                    </div>

                    <input
                      type="range"
                      min="0"
                      max="50"
                      step="5"
                      value={ingredientInflationPct}
                      onChange={(e) => setIngredientInflationPct(Number(e.target.value))}
                      className="w-full accent-amber-600 cursor-pointer"
                    />
                    <p className="text-[10px] text-slate-500">
                      Geser slider untuk melihat dampak kenaikan harga bahan baku terhadap margin keuntungan Anda.
                    </p>
                  </div>

                  {/* ACTION BUTTONS */}
                  <div className="space-y-2 pt-2">
                    {/* Apply to POS Button */}
                    <Button
                      type="button"
                      variant="default"
                      onClick={handleApplyToPOS}
                      disabled={isApplyingToPOS || activeSellingPrice <= 0}
                      className="w-full h-12 text-sm font-extrabold shadow-md shadow-emerald-600/30 gap-2 bg-emerald-600 hover:bg-emerald-700"
                    >
                      <Sparkles className="h-4 w-4" />
                      <span>
                        {isApplyingToPOS
                          ? "Menerapkan ke POS..."
                          : "Terapkan ke Kasir POS Sekarang"}
                      </span>
                    </Button>

                    {/* Save Recipe Button */}
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleSaveRecipe}
                      className="w-full h-10 text-xs font-bold gap-2 border-slate-300 hover:bg-slate-50"
                    >
                      <Save className="h-4 w-4 text-slate-600" />
                      <span>Simpan Resep Spesifikasi HPP</span>
                    </Button>

                    {/* Record as Expense Button */}
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleRecordHppExpense}
                      className="w-full h-10 text-xs font-bold gap-2 border-amber-300 text-amber-900 bg-amber-50 hover:bg-amber-100"
                    >
                      <DollarSign className="h-4 w-4 text-amber-600" />
                      <span>Catat Belanja Bahan ({formatRupiah(totalBatchCost)}) ke Pengeluaran</span>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* =========================================================
              TAB 2: HPP & SMART PRICING ACADEMY (PANDUAN INTERAKTIF)
              ========================================================= */}
          <TabsContent value="academy" className="space-y-6 pt-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Card 1: Apa itu HPP */}
              <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm space-y-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
                  <GraduationCap className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-black text-slate-900">
                  1. Apa itu HPP (Harga Pokok Produksi)?
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  <strong>HPP</strong> adalah total seluruh biaya langsung yang dikeluarkan untuk memproduksi atau menyiapkan 1 unit barang dagangan sampai siap dijual ke tangan pelanggan.
                </p>
                <div className="rounded-2xl bg-slate-50 border border-slate-200 p-3.5 space-y-1.5 text-xs text-slate-700">
                  <p className="font-bold text-slate-900">Komponen Utama HPP:</p>
                  <ul className="list-disc pl-4 space-y-1 text-slate-600">
                    <li><strong>Bahan Baku Langsung</strong>: Kopi, susu, beras, daging, tepung, deterjen.</li>
                    <li><strong>Kemasan (Packaging)</strong>: Cup, sedotan, plastik, paperbox, label stiker.</li>
                    <li><strong>Tenaga Kerja Langsung</strong>: Upah pembuatan per item / per jam kerja.</li>
                    <li><strong>Biaya Overhead</strong>: Gas LPG, listrik alat masak, air, es batu, minyak goreng.</li>
                  </ul>
                </div>
              </div>

              {/* Card 2: Perbedaan Margin vs Markup */}
              <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm space-y-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-teal-100 text-teal-700">
                  <PieChart className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-black text-slate-900">
                  2. Jebakan UMKM: Margin vs Markup
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Banyak pengusaha UMKM keliru menganggap Margin sama dengan Markup. Padahal dasar pembaginya berbeda drastis!
                </p>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="rounded-xl bg-teal-50 border border-teal-200 p-3">
                    <p className="font-bold text-teal-950">Rumus Margin (%)</p>
                    <p className="text-[11px] text-teal-700 mt-1 font-mono">
                      (Laba ÷ Harga Jual) × 100%
                    </p>
                    <p className="text-[10px] text-slate-500 mt-1">
                      Menunjukkan berapa % dari harga jual yang menjadi keuntungan Anda.
                    </p>
                  </div>

                  <div className="rounded-xl bg-blue-50 border border-blue-200 p-3">
                    <p className="font-bold text-blue-950">Rumus Markup (%)</p>
                    <p className="text-[11px] text-blue-700 mt-1 font-mono">
                      (Laba ÷ HPP Modal) × 100%
                    </p>
                    <p className="text-[10px] text-slate-500 mt-1">
                      Menunjukkan berapa % kenaikan harga dari harga modal dasar.
                    </p>
                  </div>
                </div>

                <div className="rounded-xl bg-amber-50 border border-amber-200 p-2.5 text-[11px] text-amber-900">
                  💡 <strong>Contoh Nyata:</strong> Modal Rp 10.000 dijual Rp 15.000.<br />
                  Markup = +50%, tetapi Margin sebenarnya hanya <strong>33.3%</strong>!
                </div>
              </div>

              {/* Card 3: 4 Strategi Penetapan Harga */}
              <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm space-y-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-purple-100 text-purple-700">
                  <Target className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-black text-slate-900">
                  3. Empat Strategi Penetapan Harga Jual
                </h3>
                <div className="space-y-2 text-xs text-slate-700">
                  <div className="p-2.5 rounded-xl border border-slate-200 bg-slate-50">
                    <p className="font-bold text-slate-900">A. Cost-Plus Pricing (Berbasis Biaya)</p>
                    <p className="text-[11px] text-slate-500">
                      Menambahkan persentase margin laba tetap di atas HPP (paling aman & standar).
                    </p>
                  </div>
                  <div className="p-2.5 rounded-xl border border-slate-200 bg-slate-50">
                    <p className="font-bold text-slate-900">B. Competitive / Market Pricing</p>
                    <p className="text-[11px] text-slate-500">
                      Menyesuaikan harga dengan kompetitor sekitar untuk penetrasi pasar baru.
                    </p>
                  </div>
                  <div className="p-2.5 rounded-xl border border-slate-200 bg-slate-50">
                    <p className="font-bold text-slate-900">C. Value-Based Pricing (Nilai Tambah)</p>
                    <p className="text-[11px] text-slate-500">
                      Menetapkan harga tinggi karena kualitas premium, tempat estetik, atau merk ternama.
                    </p>
                  </div>
                  <div className="p-2.5 rounded-xl border border-slate-200 bg-slate-50">
                    <p className="font-bold text-slate-900">D. Psychological Pricing (Harga Psikologis)</p>
                    <p className="text-[11px] text-slate-500">
                      Menggunakan angka ganjil seperti Rp 19.900 alih-alih Rp 20.000 untuk kesan lebih terjangkau.
                    </p>
                  </div>
                </div>
              </div>

              {/* Card 4: Titik Impas / BEP */}
              <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm space-y-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-rose-100 text-rose-700">
                  <TrendingUp className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-black text-slate-900">
                  4. Break-Even Point (BEP / Titik Impas)
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  BEP adalah titik di mana seluruh pendapatan penjualan Anda tepat menutup seluruh biaya (biaya modal HPP + biaya sewa toko & gaji karyawan).
                </p>
                <div className="rounded-2xl bg-slate-900 text-white p-4 text-xs font-mono space-y-2">
                  <p className="text-emerald-400 font-bold">Rumus BEP Unit:</p>
                  <p>BEP Unit = Total Biaya Tetap Bulanan ÷ (Harga Jual - HPP)</p>
                </div>
                <p className="text-xs text-slate-500">
                  Dengan mengetahui BEP, Anda tahu berapa porsi yang <strong>wajib terjual setiap hari</strong> agar tidak tekor menanggung sewa tempat atau gaji karyawan.
                </p>
              </div>
            </div>
          </TabsContent>

          {/* =========================================================
              TAB 3: SAVED RECIPES (RESEP & SPESIFIKASI TERSIMPAN)
              ========================================================= */}
          <TabsContent value="saved" className="space-y-4 pt-2">
            <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
                <div>
                  <h3 className="font-extrabold text-slate-900 text-base">
                    Daftar Resep & Spesifikasi HPP Toko Anda
                  </h3>
                  <p className="text-xs text-slate-500">
                    Resep yang tersimpan dapat dimuat kembali ke kalkulator atau langsung diterapkan ke kasir POS.
                  </p>
                </div>
              </div>

              {savedRecipes.length === 0 ? (
                <div className="text-center py-12 text-slate-400 text-xs">
                  <Package className="h-8 w-8 mx-auto mb-2 text-slate-300" />
                  <p className="font-bold text-slate-700">Belum Ada Resep Tersimpan</p>
                  <p className="mt-1">
                    Gunakan tab "Kalkulator HPP & Resep" lalu klik tombol "Simpan Resep".
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {savedRecipes.map((rec) => (
                    <div
                      key={rec.id}
                      className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm space-y-3 hover:border-emerald-400 transition-all"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                            {rec.category || "Umum"}
                          </span>
                          <h4 className="text-sm font-black text-slate-900 mt-0.5">
                            {rec.name}
                          </h4>
                        </div>
                        <Badge variant="default" className="text-[10px]">
                          {rec.batchYield} Unit
                        </Badge>
                      </div>

                      <div className="rounded-xl bg-slate-50 p-3 space-y-1.5 text-xs">
                        <div className="flex justify-between text-slate-500">
                          <span>HPP Modal per Unit:</span>
                          <span className="font-bold text-slate-900">
                            {formatRupiah(rec.hppPerUnit)}
                          </span>
                        </div>
                        <div className="flex justify-between text-slate-500">
                          <span>Rekomendasi Jual:</span>
                          <span className="font-black text-emerald-800">
                            {formatRupiah(rec.targetSellingPrice)}
                          </span>
                        </div>
                        <div className="flex justify-between text-emerald-700 font-semibold pt-1 border-t border-slate-200">
                          <span>Laba Bersih:</span>
                          <span>+{formatRupiah(rec.profitPerUnit)} ({rec.targetMarginPct}%)</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-1">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setRecipeName(rec.name);
                            setRecipeCategory(rec.category || "Umum");
                            setBatchYield(rec.batchYield);
                            setIngredients(rec.ingredients);
                            setPackagings(rec.packagings);
                            setDirectLaborCost(rec.directLaborCost);
                            setOverheadCost(rec.overheadCost);
                            setTargetMarginPct(rec.targetMarginPct);
                            setCustomPrice(rec.targetSellingPrice);
                            setActiveTab("calculator");
                            toast.success(`Resep "${rec.name}" dimuat ke kalkulator.`);
                          }}
                          className="text-xs h-8 px-3"
                        >
                          Buka di Kalkulator
                        </Button>

                        <button
                          type="button"
                          onClick={() => handleDeleteRecipe(rec.id, rec.name)}
                          className="text-slate-400 hover:text-rose-600 p-1.5"
                          title="Hapus Resep"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* =========================================================
          MODAL KATALOG BIG DATA RESEP (10 KATEGORI BISNIS UMKM)
          ========================================================= */}
      <Dialog open={isCatalogModalOpen} onOpenChange={setIsCatalogModalOpen}>
        <DialogContent className="sm:max-w-5xl max-h-[90vh] overflow-hidden flex flex-col p-0 bg-slate-50">
          {/* Modal Header */}
          <div className="p-5 pb-3 bg-white border-b border-slate-200 shrink-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white shadow-md shadow-emerald-500/20">
                  <Store className="h-6 w-6" />
                </div>
                <div>
                  <DialogTitle className="text-lg font-black text-slate-900">
                    Big Data Repository HPP UMKM Indonesia ({HPP_BIG_DATA_TEMPLATES.length} Template)
                  </DialogTitle>
                  <DialogDescription className="text-xs text-slate-500">
                    Pilih template usaha di bawah untuk melihat rincian bahan, takaran, kemasan, dan kalkulasi HPP otomatis.
                  </DialogDescription>
                </div>
              </div>
            </div>

            {/* Search Bar */}
            <div className="mt-3 relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                type="text"
                placeholder="Cari menu, resep, bahan (contoh: kopi, ayam, donat, laundry, cuci motor, lilin, pempek)..."
                value={catalogSearchQuery}
                onChange={(e) => setCatalogSearchQuery(e.target.value)}
                className="pl-10 h-10 text-xs bg-slate-50 border-slate-200"
              />
            </div>

            {/* 10 Business Category Pills Bar */}
            <div className="mt-3 flex items-center gap-1.5 overflow-x-auto pb-1.5 no-scrollbar">
              <button
                type="button"
                onClick={() => {
                  setSelectedCatalogCategory("all");
                  setSelectedSubCategory("all");
                }}
                className={`rounded-xl px-3 py-1.5 text-xs font-bold whitespace-nowrap transition-all ${
                  selectedCatalogCategory === "all"
                    ? "bg-slate-900 text-white shadow-sm"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                Semua ({HPP_BIG_DATA_TEMPLATES.length})
              </button>

              {BUSINESS_CATEGORIES_METADATA.map((cat) => {
                const count = HPP_BIG_DATA_TEMPLATES.filter(
                  (t) => t.mainCategory === cat.id
                ).length;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => {
                      setSelectedCatalogCategory(cat.id);
                      setSelectedSubCategory("all");
                    }}
                    className={`rounded-xl px-3 py-1.5 text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                      selectedCatalogCategory === cat.id
                        ? "bg-emerald-600 text-white shadow-sm shadow-emerald-600/20"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    <span>{cat.icon}</span>
                    <span>{cat.name} ({count})</span>
                  </button>
                );
              })}
            </div>

            {/* Sub-Category Pills if a category is selected */}
            {availableSubCategories.length > 1 && (
              <div className="mt-2 flex items-center gap-1.5 overflow-x-auto pb-1 pt-1 border-t border-slate-100 no-scrollbar">
                <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider mr-1">
                  Sub-Kategori:
                </span>
                <button
                  type="button"
                  onClick={() => setSelectedSubCategory("all")}
                  className={`rounded-lg px-2.5 py-1 text-[11px] font-semibold transition-all ${
                    selectedSubCategory === "all"
                      ? "bg-teal-100 text-teal-900 font-bold"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  Semua Sub
                </button>
                {availableSubCategories.map((sub) => (
                  <button
                    key={sub}
                    type="button"
                    onClick={() => setSelectedSubCategory(sub)}
                    className={`rounded-lg px-2.5 py-1 text-[11px] font-semibold transition-all ${
                      selectedSubCategory === sub
                        ? "bg-teal-600 text-white font-bold"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {sub}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Modal Body: Cards Grid */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {filteredTemplates.length === 0 ? (
              <div className="text-center py-16 text-slate-400 text-xs">
                Tidak ada resep ditemukan untuk pencarian "{catalogSearchQuery}".
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredTemplates.map((template) => {
                  const estRawIng = template.ingredients.reduce((a, b) => a + b.cost, 0);
                  const estPkg = template.packagings.reduce((a, b) => a + b.cost, 0);
                  const estTotalHpp = Math.round(
                    (estRawIng + estPkg + template.directLaborCost + template.overheadCost) /
                      template.batchYield
                  );
                  const estProfit = template.targetSellingPrice - estTotalHpp;

                  return (
                    <div
                      key={template.id}
                      className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm hover:border-emerald-500 hover:shadow-md transition-all flex flex-col justify-between"
                    >
                      <div className="space-y-2.5">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-2.5">
                            <span className="text-2xl">{template.icon}</span>
                            <div>
                              <div className="flex items-center gap-1.5">
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                  {template.mainCategory}
                                </span>
                                <span className="text-slate-300">•</span>
                                <span className="text-[10px] font-semibold text-teal-700 bg-teal-50 px-1.5 py-0.2 rounded">
                                  {template.subCategory}
                                </span>
                              </div>
                              <h4 className="text-sm font-black text-slate-900 leading-tight mt-0.5">
                                {template.name}
                              </h4>
                            </div>
                          </div>
                          <Badge variant="default" className="text-[10px] shrink-0">
                            {template.batchYield} Unit
                          </Badge>
                        </div>

                        <p className="text-xs text-slate-500 line-clamp-2">
                          {template.description}
                        </p>

                        {/* Ingredients preview chips */}
                        <div className="flex flex-wrap gap-1 pt-1">
                          {template.ingredients.slice(0, 4).map((ing) => (
                            <span
                              key={ing.id}
                              className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-600"
                            >
                              {ing.name.split(" ")[0]} ({formatRupiah(ing.cost)})
                            </span>
                          ))}
                          {template.ingredients.length > 4 && (
                            <span className="text-[10px] text-slate-400 self-center">
                              +{template.ingredients.length - 4} lainnya
                            </span>
                          )}
                          {template.packagings.length > 0 && (
                            <span className="rounded-md bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 text-[10px] font-semibold">
                              +{template.packagings.length} Kemasan
                            </span>
                          )}
                        </div>

                        {template.tips && (
                          <div className="rounded-xl bg-amber-50/70 border border-amber-200/80 p-2 text-[10px] text-amber-900 flex items-start gap-1.5">
                            <Lightbulb className="h-3.5 w-3.5 text-amber-600 shrink-0 mt-0.5" />
                            <p className="line-clamp-2">{template.tips}</p>
                          </div>
                        )}
                      </div>

                      {/* Bottom Pricing Row & Button */}
                      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                        <div>
                          <div className="text-[10px] text-slate-400">
                            HPP: <strong>{formatRupiah(estTotalHpp)}</strong> • Jual: <strong>{formatRupiah(template.targetSellingPrice)}</strong>
                          </div>
                          <div className="text-xs font-black text-emerald-700">
                            Laba: +{formatRupiah(estProfit)} ({template.targetMarginPct}% Margin)
                          </div>
                        </div>

                        <Button
                          type="button"
                          variant="default"
                          size="sm"
                          onClick={() => handleLoadPreset(template)}
                          className="text-xs h-8 px-3 font-bold bg-emerald-600 hover:bg-emerald-700 shadow-xs gap-1.5"
                        >
                          <span>Gunakan Resep</span>
                          <ArrowRight className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
