"use client";

import React, { useState, useEffect, useMemo } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useAuth } from "@/context/AuthContext";
import {
  getTransactions,
  getExpenses,
  getProducts,
  getCustomers,
  getHppRecipes,
} from "@/services/firestore";
import { Transaction, Expense, Product, Customer, HppRecipe } from "@/types";
import {
  ALL_ACADEMY_ARTICLES,
  ACADEMY_CATEGORIES,
  AcademyArticle,
} from "@/data/academy";
import { FeatureGate } from "@/components/common/FeatureGate";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CustomSelect } from "@/components/common/CustomSelect";
import {
  Calculator,
  Activity,
  BookOpen,
  Sparkles,
  CheckSquare,
  Lightbulb,
} from "lucide-react";

import { PlaybookTab } from "@/components/academy/tabs/PlaybookTab";
import { SimulatorTab } from "@/components/academy/tabs/SimulatorTab";
import { HealthCheckTab } from "@/components/academy/tabs/HealthCheckTab";
import { ChecklistsTab } from "@/components/academy/tabs/ChecklistsTab";
import { SmartAdvisorTab } from "@/components/academy/tabs/SmartAdvisorTab";
import { ArticleModal } from "@/components/academy/ArticleModal";

export default function AcademyPage() {
  const { user, storeOwnerUid } = useAuth();
  const activeUid = storeOwnerUid || user?.uid;

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [recipes, setRecipes] = useState<HppRecipe[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  const [activeTab, setActiveTab] = useState<
    "playbook" | "simulator" | "health_check" | "checklists" | "smart_advisor"
  >("playbook");

  const [articleSearch, setArticleSearch] = useState("");
  const [selectedArticleCategory, setSelectedArticleCategory] = useState<string>("all");
  const [selectedArticle, setSelectedArticle] = useState<AcademyArticle | null>(null);

  const [checkedSopItems, setCheckedSopItems] = useState<Record<string, boolean>>({});

  useEffect(() => {
    try {
      const saved = localStorage.getItem("pos_academy_sop_checklists");
      if (saved) setCheckedSopItems(JSON.parse(saved));
    } catch (e) {}
  }, []);

  const toggleSopItem = (key: string) => {
    setCheckedSopItems((prev) => {
      const updated = { ...prev, [key]: !prev[key] };
      localStorage.setItem("pos_academy_sop_checklists", JSON.stringify(updated));
      return updated;
    });
  };

  const [bepInitialCapital, setBepInitialCapital] = useState<number>(15000000);
  const [bepMonthlyFixedCost, setBepMonthlyFixedCost] = useState<number>(3000000);
  const [bepSellingPrice, setBepSellingPrice] = useState<number>(20000);
  const [bepHppPrice, setBepHppPrice] = useState<number>(10000);

  const bepContributionMargin = Math.max(0, bepSellingPrice - bepHppPrice);
  const bepMarginPct = bepSellingPrice > 0 ? (bepContributionMargin / bepSellingPrice) * 100 : 0;
  const bepMonthlyUnits = bepContributionMargin > 0 ? Math.ceil(bepMonthlyFixedCost / bepContributionMargin) : 0;
  const bepDailyUnits = Math.ceil(bepMonthlyUnits / 30);
  const simulatedSalesDaily = Math.max(bepDailyUnits + 15, Math.ceil(bepDailyUnits * 1.5));
  const simulatedMonthlyProfit = simulatedSalesDaily * 30 * bepContributionMargin - bepMonthlyFixedCost;
  const paybackMonths = simulatedMonthlyProfit > 0 ? (bepInitialCapital / simulatedMonthlyProfit).toFixed(1) : "Tidak Tersentuh";

  const [promoNormalPrice, setPromoNormalPrice] = useState<number>(25000);
  const [promoHpp, setPromoHpp] = useState<number>(12000);
  const [promoNormalDailyQtyBase, setPromoNormalDailyQty] = useState<number>(40);
  const [promoDiscountPct, setPromoDiscountPct] = useState<number>(20);

  const promoDiscountedPrice = promoNormalPrice * (1 - promoDiscountPct / 100);
  const promoNormalProfitPerUnit = Math.max(0, promoNormalPrice - promoHpp);
  const promoDiscountedProfitPerUnit = Math.max(0, promoDiscountedPrice - promoHpp);
  const promoNormalTotalDailyProfit = promoNormalDailyQtyBase * promoNormalProfitPerUnit;
  const promoRequiredDailyQty = promoDiscountedProfitPerUnit > 0 ? Math.ceil(promoNormalTotalDailyProfit / promoDiscountedProfitPerUnit) : 0;
  const promoVolumeIncreasePct = promoNormalDailyQtyBase > 0 ? Math.round(((promoRequiredDailyQty - promoNormalDailyQtyBase) / promoNormalDailyQtyBase) * 100) : 0;

  const [staffSalary, setStaffSalary] = useState<number>(2000000);
  const staffAvgProfitPerUnit = 8000;
  const staffRequiredUnitsMonth = staffAvgProfitPerUnit > 0 ? Math.ceil(staffSalary / staffAvgProfitPerUnit) : 0;
  const staffRequiredUnitsDay = Math.ceil(staffRequiredUnitsMonth / 30);

  const [runwayCashReserve, setRunwayCashReserve] = useState<number>(12000000);
  const [runwayMonthlyBurn, setRunwayMonthlyBurn] = useState<number>(4000000);
  const runwayMonths = runwayMonthlyBurn > 0 ? (runwayCashReserve / runwayMonthlyBurn).toFixed(1) : "Tak Terhingga";

  useEffect(() => {
    async function loadStoreData() {
      if (!activeUid) return;
      try {
        setLoadingData(true);
        const [trxList, expList, prodList, custList, recList] = await Promise.all([
          getTransactions(activeUid, 100),
          getExpenses(activeUid),
          getProducts(activeUid),
          getCustomers(activeUid),
          getHppRecipes(activeUid),
        ]);
        setTransactions(trxList);
        setExpenses(expList);
        setProducts(prodList);
        setCustomers(custList);
        setRecipes(recList);
      } catch (err) {
        console.error("Error loading academy metrics:", err);
      } finally {
        setLoadingData(false);
      }
    }
    loadStoreData();
  }, [activeUid]);

  const healthMetrics = useMemo(() => {
    const totalOmzet = transactions.reduce((acc, t) => acc + (t.totalAmount || 0), 0);
    const totalHpp = transactions.reduce((acc, t) => acc + (t.totalCost || 0), 0);
    const totalGrossProfit = totalOmzet - totalHpp;
    const totalExpenses = expenses.reduce((acc, e) => acc + (e.amount || 0), 0);
    const netProfit = totalGrossProfit - totalExpenses;
    const totalDebts = customers.reduce((acc, c) => acc + (c.totalDebt || 0), 0);

    const grossMarginPct = totalOmzet > 0 ? Math.round((totalGrossProfit / totalOmzet) * 100) : 0;
    const opexRatioPct = totalOmzet > 0 ? Math.round((totalExpenses / totalOmzet) * 100) : 0;
    const netMarginPct = totalOmzet > 0 ? Math.round((netProfit / totalOmzet) * 100) : 0;
    const debtRatioPct = totalOmzet > 0 ? Math.round((totalDebts / totalOmzet) * 100) : 0;

    let score = 50;
    if (grossMarginPct >= 45) score += 20;
    else if (grossMarginPct >= 30) score += 10;
    else score -= 10;
    if (opexRatioPct > 0 && opexRatioPct <= 25) score += 15;
    else if (opexRatioPct <= 35) score += 5;
    else if (opexRatioPct > 40) score -= 10;
    if (netMarginPct >= 20) score += 15;
    else if (netMarginPct >= 10) score += 8;
    else if (netMarginPct < 0) score -= 20;
    if (debtRatioPct <= 10) score += 10;
    else if (debtRatioPct > 25) score -= 15;
    score = Math.max(10, Math.min(100, score));

    return {
      totalOmzet, totalGrossProfit, totalExpenses, netProfit, totalDebts,
      grossMarginPct, opexRatioPct, netMarginPct, debtRatioPct, score,
    };
  }, [transactions, expenses, products, customers]);

  const filteredArticles = useMemo(() => {
    return ALL_ACADEMY_ARTICLES.filter((art) => {
      const matchSearch =
        art.title.toLowerCase().includes(articleSearch.toLowerCase()) ||
        art.summary.toLowerCase().includes(articleSearch.toLowerCase()) ||
        art.categoryLabel.toLowerCase().includes(articleSearch.toLowerCase()) ||
        art.content.toLowerCase().includes(articleSearch.toLowerCase());
      const matchCat = selectedArticleCategory === "all" || art.categoryId === selectedArticleCategory;
      return matchSearch && matchCat;
    });
  }, [articleSearch, selectedArticleCategory]);

  const MODULE_OPTIONS = useMemo(() => [
    { value: "playbook", label: "1. Playbook Edukasi Bisnis", emoji: "📖", badge: `${ALL_ACADEMY_ARTICLES.length} Panduan`, description: "Panduan 9 pilar bisnis & strategi UMKM" },
    { value: "simulator", label: "2. Simulator Titik Impas (BEP) & Diskon", emoji: "🧮", badge: "4 Tools", description: "Kalkulasi BEP, sensitivitas diskon & runway" },
    { value: "health_check", label: "3. Scorecard & Diagnosa Kesehatan Toko", emoji: "📊", badge: `Skor ${healthMetrics.score}/100`, description: "Analisis margin, opex & piutang otomatis" },
    { value: "checklists", label: "4. Checklist SOP Buka/Tutup & Bulanan", emoji: "✅", badge: "SOP", description: "Standard operasional harian & evaluasi" },
    { value: "smart_advisor", label: "5. Rekomendasi Cerdas (Smart Advisor)", emoji: "💡", badge: "Advisor", description: "Saran strategis optimasi omzet & HPP" },
  ], [healthMetrics.score]);

  const CATEGORY_OPTIONS = useMemo(() => [
    { value: "all", label: "Semua Topik (9 Pilar)", emoji: "📚", badge: ALL_ACADEMY_ARTICLES.length, description: "Seluruh panduan & studi kasus bisnis" },
    ...ACADEMY_CATEGORIES.map((cat) => ({
      value: cat.id, label: cat.name, emoji: cat.emoji, badge: ALL_ACADEMY_ARTICLES.filter((a) => a.categoryId === cat.id).length, description: cat.description,
    })),
  ], []);

  return (
    <DashboardLayout>
      <FeatureGate
        requiredTier="pro"
        featureName="Akademi Bisnis UMKM & Simulator Finansial"
        description="Akses seluruh playbook bisnis 9 pilar, 4 simulator keuangan & BEP, checklist SOP harian, dan analisis kesehatan toko otomatis."
      >
        <div className="space-y-3.5 sm:space-y-5 max-w-6xl mx-auto pb-16">
          <div className="rounded-2xl sm:rounded-3xl bg-gradient-to-r from-slate-900 via-slate-950 to-emerald-950 p-4 sm:p-6 text-white relative overflow-hidden shadow-sm border border-slate-800/80">
            <div className="absolute top-0 right-0 -mt-6 -mr-6 h-36 w-36 rounded-full bg-emerald-500/10 blur-2xl pointer-events-none" />
            <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 text-[10px] font-bold">
                    <Sparkles className="h-3 w-3" />
                    <span>Akademi Bisnis UMKM</span>
                  </span>
                  <span className="text-[10px] text-slate-400">
                    {ALL_ACADEMY_ARTICLES.length} Playbook & 4 Simulator
                  </span>
                </div>
                <h1 className="text-lg sm:text-2xl font-black tracking-tight text-white leading-tight">
                  Playbook Finansial & Simulator BEP
                </h1>
                <p className="text-xs text-slate-300 line-clamp-1">
                  Edukasi 9 pilar bisnis, strategi margin, dan kalkulasi titik impas usaha.
                </p>
              </div>

              <div className="inline-flex items-center gap-2.5 bg-white/10 border border-white/15 backdrop-blur-md rounded-xl py-1.5 px-3 shrink-0 self-start sm:self-auto">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500 text-slate-950 font-black text-xs">
                  {healthMetrics.score}
                </div>
                <div className="leading-tight">
                  <span className="text-[9px] text-slate-300 font-bold uppercase tracking-wider block">
                    Skor Usaha
                  </span>
                  <span className="text-xs font-extrabold text-white">
                    {healthMetrics.score >= 80 ? "Sangat Sehat" : healthMetrics.score >= 60 ? "Cukup Sehat" : "Perlu Optimasi"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <Tabs
            value={activeTab}
            onValueChange={(v) => setActiveTab(v as any)}
            className="w-full space-y-3"
          >
            <div className="sm:hidden">
              <CustomSelect
                options={MODULE_OPTIONS}
                value={activeTab}
                onChange={(val) => setActiveTab(val as any)}
                size="md"
              />
            </div>

            <div className="hidden sm:block">
              <TabsList className="grid grid-cols-5 w-full h-10 p-1 rounded-xl bg-slate-100/90 border border-slate-200/60 shadow-2xs">
                <TabsTrigger
                  value="playbook"
                  className="touch-press flex items-center justify-center gap-1.5 py-1.5 px-2 text-xs font-bold rounded-lg data-[state=active]:bg-white data-[state=active]:text-emerald-950 data-[state=active]:shadow-xs transition-all"
                >
                  <BookOpen className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                  <span className="truncate">1. Playbook ({ALL_ACADEMY_ARTICLES.length})</span>
                </TabsTrigger>
                <TabsTrigger
                  value="simulator"
                  className="touch-press flex items-center justify-center gap-1.5 py-1.5 px-2 text-xs font-bold rounded-lg data-[state=active]:bg-white data-[state=active]:text-blue-950 data-[state=active]:shadow-xs transition-all"
                >
                  <Calculator className="h-3.5 w-3.5 text-blue-600 shrink-0" />
                  <span className="truncate">2. Simulator BEP</span>
                </TabsTrigger>
                <TabsTrigger
                  value="health_check"
                  className="touch-press flex items-center justify-center gap-1.5 py-1.5 px-2 text-xs font-bold rounded-lg data-[state=active]:bg-white data-[state=active]:text-purple-950 data-[state=active]:shadow-xs transition-all"
                >
                  <Activity className="h-3.5 w-3.5 text-purple-600 shrink-0" />
                  <span className="truncate">3. Diagnosa Toko</span>
                </TabsTrigger>
                <TabsTrigger
                  value="checklists"
                  className="touch-press flex items-center justify-center gap-1.5 py-1.5 px-2 text-xs font-bold rounded-lg data-[state=active]:bg-white data-[state=active]:text-teal-950 data-[state=active]:shadow-xs transition-all"
                >
                  <CheckSquare className="h-3.5 w-3.5 text-teal-600 shrink-0" />
                  <span className="truncate">4. Checklist SOP</span>
                </TabsTrigger>
                <TabsTrigger
                  value="smart_advisor"
                  className="touch-press flex items-center justify-center gap-1.5 py-1.5 px-2 text-xs font-bold rounded-lg data-[state=active]:bg-white data-[state=active]:text-amber-950 data-[state=active]:shadow-xs transition-all"
                >
                  <Lightbulb className="h-3.5 w-3.5 text-amber-600 shrink-0" />
                  <span className="truncate">5. Advisor</span>
                </TabsTrigger>
              </TabsList>
            </div>

            <PlaybookTab 
              CATEGORY_OPTIONS={CATEGORY_OPTIONS} 
              selectedArticleCategory={selectedArticleCategory} 
              setSelectedArticleCategory={setSelectedArticleCategory} 
              articleSearch={articleSearch} 
              setArticleSearch={setArticleSearch} 
              filteredArticles={filteredArticles} 
              setSelectedArticle={setSelectedArticle} 
            />
            
            <SimulatorTab 
              bepInitialCapital={bepInitialCapital} setBepInitialCapital={setBepInitialCapital}
              bepMonthlyFixedCost={bepMonthlyFixedCost} setBepMonthlyFixedCost={setBepMonthlyFixedCost}
              bepSellingPrice={bepSellingPrice} setBepSellingPrice={setBepSellingPrice}
              bepHppPrice={bepHppPrice} setBepHppPrice={setBepHppPrice}
              bepDailyUnits={bepDailyUnits} bepMarginPct={bepMarginPct} paybackMonths={paybackMonths}
              promoNormalPrice={promoNormalPrice} setPromoNormalPrice={setPromoNormalPrice}
              promoHpp={promoHpp} setPromoHpp={setPromoHpp}
              promoNormalDailyQtyBase={promoNormalDailyQtyBase} setPromoNormalDailyQty={setPromoNormalDailyQty}
              promoDiscountPct={promoDiscountPct} setPromoDiscountPct={setPromoDiscountPct}
              promoRequiredDailyQty={promoRequiredDailyQty} promoVolumeIncreasePct={promoVolumeIncreasePct}
              staffSalary={staffSalary} setStaffSalary={setStaffSalary} staffRequiredUnitsDay={staffRequiredUnitsDay}
              runwayCashReserve={runwayCashReserve} setRunwayCashReserve={setRunwayCashReserve} runwayMonths={runwayMonths}
            />

            <HealthCheckTab healthMetrics={healthMetrics} />

            <ChecklistsTab checkedSopItems={checkedSopItems} toggleSopItem={toggleSopItem} />

            <SmartAdvisorTab />
          </Tabs>
        </div>

        <ArticleModal selectedArticle={selectedArticle} setSelectedArticle={setSelectedArticle} />
      </FeatureGate>
    </DashboardLayout>
  );
}
