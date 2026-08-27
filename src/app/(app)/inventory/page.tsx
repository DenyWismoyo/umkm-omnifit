"use client";

import React, { useState, useEffect, useMemo } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useAuth } from "@/context/AuthContext";
import {
  getRawMaterials,
  saveRawMaterial,
  deleteRawMaterial,
  restockRawMaterial,
  getHppRecipes,
  importHppRecipeToRawMaterials,
} from "@/services/firestore";
import { RawMaterial, RawMaterialCategory, HppRecipe } from "@/types";
import { HPP_BIG_DATA_TEMPLATES } from "@/data/hpp";
import { formatRupiah } from "@/lib/utils";
import { PageHeader } from "@/components/common/PageHeader";
import { FeatureGate } from "@/components/common/FeatureGate";
import { StatCard } from "@/components/common/StatCard";
import { CustomSelect, CustomSelectOption } from "@/components/common/CustomSelect";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Boxes,
  Plus,
  Search,
  AlertTriangle,
  CheckCircle2,
  TrendingDown,
  Sparkles,
  RefreshCw,
  Trash2,
  Edit2,
  Download,
  ShoppingBag,
  ArrowUpRight,
  PackageCheck,
  Zap,
} from "lucide-react";
import { toast } from "sonner";

const RAW_CATEGORIES: RawMaterialCategory[] = [
  "Bahan Baku",
  "Kemasan",
  "Bumbu",
  "Lainnya",
];

const UNIT_OPTIONS = [
  "Gram",
  "Ml",
  "Pcs",
  "Lembar",
  "Kg",
  "Liter",
  "Butir",
  "Sachet",
  "Pack",
];

export default function InventoryPage() {
  const { user, storeOwnerUid, activeRole } = useAuth();
  const [materials, setMaterials] = useState<RawMaterial[]>([]);
  const [userRecipes, setUserRecipes] = useState<HppRecipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  // Modal States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isRestockModalOpen, setIsRestockModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState<RawMaterial | null>(null);

  // Form States for Add / Edit
  const [formName, setFormName] = useState("");
  const [formCategory, setFormCategory] = useState<RawMaterialCategory>("Bahan Baku");
  const [formStock, setFormStock] = useState("");
  const [formUnit, setFormUnit] = useState("Gram");
  const [formCostPerUnit, setFormCostPerUnit] = useState("");
  const [formMinAlert, setFormMinAlert] = useState("");
  const [formNotes, setFormNotes] = useState("");

  // Form States for Restock
  const [restockAmount, setRestockAmount] = useState("");
  const [restockCost, setRestockCost] = useState("");
  const [recordExpense, setRecordExpense] = useState(true);

  // Import Recipe Select
  const [selectedRecipeToImport, setSelectedRecipeToImport] = useState("");

  const isCashier = activeRole === "cashier";

  const loadData = async () => {
    if (!storeOwnerUid) return;
    try {
      setLoading(true);
      const [matList, recList] = await Promise.all([
        getRawMaterials(storeOwnerUid),
        getHppRecipes(storeOwnerUid),
      ]);
      setMaterials(matList);
      setUserRecipes(recList);
    } catch (err) {
      console.error("Failed loading raw materials:", err);
      toast.error("Gagal memuat data inventori bahan.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [storeOwnerUid]);

  // Filtered Materials
  const filteredMaterials = useMemo(() => {
    return materials.filter((m) => {
      const matchSearch =
        m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (m.notes && m.notes.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchCat =
        selectedCategory === "all" || m.category === selectedCategory;
      return matchSearch && matchCat;
    });
  }, [materials, searchQuery, selectedCategory]);

  // Statistics
  const totalValuation = useMemo(() => {
    return materials.reduce((acc, m) => acc + (m.stock || 0) * (m.costPerUnit || 0), 0);
  }, [materials]);

  const lowStockCount = useMemo(() => {
    return materials.filter((m) => (m.stock || 0) <= (m.minStockAlert || 10)).length;
  }, [materials]);

  const outOfStockCount = useMemo(() => {
    return materials.filter((m) => (m.stock || 0) <= 0).length;
  }, [materials]);

  const openAddModal = (mat?: RawMaterial) => {
    if (mat) {
      setSelectedMaterial(mat);
      setFormName(mat.name);
      setFormCategory(mat.category);
      setFormStock(String(mat.stock));
      setFormUnit(mat.unit);
      setFormCostPerUnit(String(mat.costPerUnit));
      setFormMinAlert(String(mat.minStockAlert));
      setFormNotes(mat.notes || "");
    } else {
      setSelectedMaterial(null);
      setFormName("");
      setFormCategory("Bahan Baku");
      setFormStock("");
      setFormUnit("Gram");
      setFormCostPerUnit("");
      setFormMinAlert("100");
      setFormNotes("");
    }
    setIsAddModalOpen(true);
  };

  const handleSaveMaterial = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!storeOwnerUid) return;
    if (!formName.trim()) {
      toast.error("Nama bahan wajib diisi.");
      return;
    }

    try {
      await saveRawMaterial(storeOwnerUid, {
        id: selectedMaterial?.id,
        name: formName.trim(),
        category: formCategory,
        stock: Number(formStock) || 0,
        unit: formUnit,
        costPerUnit: Number(formCostPerUnit) || 0,
        minStockAlert: Number(formMinAlert) || 10,
        notes: formNotes.trim(),
      });

      toast.success(
        selectedMaterial
          ? `Bahan "${formName}" berhasil diperbarui.`
          : `Bahan "${formName}" berhasil ditambahkan.`
      );
      setIsAddModalOpen(false);
      await loadData();
    } catch (err) {
      toast.error("Gagal menyimpan bahan baku.");
    }
  };

  const handleDeleteMaterial = async (mat: RawMaterial) => {
    if (!storeOwnerUid) return;
    if (confirm(`Hapus bahan "${mat.name}" dari inventori?`)) {
      try {
        await deleteRawMaterial(storeOwnerUid, mat.id);
        toast.success(`Bahan "${mat.name}" dihapus.`);
        await loadData();
      } catch (err) {
        toast.error("Gagal menghapus bahan.");
      }
    }
  };

  const openRestock = (mat: RawMaterial) => {
    setSelectedMaterial(mat);
    setRestockAmount("");
    setRestockCost("");
    setRecordExpense(true);
    setIsRestockModalOpen(true);
  };

  const handleExecuteRestock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!storeOwnerUid || !selectedMaterial) return;

    const amount = Number(restockAmount);
    if (!amount || amount <= 0) {
      toast.error("Masukkan jumlah stok yang valid.");
      return;
    }

    try {
      const cost = Number(restockCost) || 0;
      await restockRawMaterial(storeOwnerUid, selectedMaterial.id, amount, cost, recordExpense);
      toast.success(
        `Berhasil restock +${amount} ${selectedMaterial.unit} untuk ${selectedMaterial.name}.`
      );
      setIsRestockModalOpen(false);
      await loadData();
    } catch (err) {
      toast.error("Gagal melakukan restock.");
    }
  };

  const handleImportRecipe = async () => {
    if (!storeOwnerUid || !selectedRecipeToImport) return;
    try {
      // Find in user recipes or preset templates
      let targetRecipe: HppRecipe | undefined = userRecipes.find(
        (r) => r.id === selectedRecipeToImport
      );

      if (!targetRecipe) {
        const preset = HPP_BIG_DATA_TEMPLATES.find((t) => t.id === selectedRecipeToImport);
        if (preset) {
          targetRecipe = {
            id: preset.id,
            name: preset.name,
            batchYield: preset.batchYield,
            ingredients: preset.ingredients.map((ing, i) => ({
              id: `ing-${i}`,
              name: ing.name,
              packagePrice: ing.packagePrice,
              packageQty: ing.packageQty,
              packageUnit: ing.packageUnit,
              usedQty: ing.usedQty,
              usedUnit: ing.usedUnit,
              cost: (ing.packagePrice / ing.packageQty) * ing.usedQty,
            })),
            packagings: preset.packagings.map((pkg, i) => ({
              id: `pkg-${i}`,
              name: pkg.name,
              unitPrice: pkg.unitPrice,
              qty: pkg.qty,
              cost: pkg.unitPrice * pkg.qty,
            })),
            directLaborCost: preset.directLaborCost,
            overheadCost: preset.overheadCost,
            totalIngredientsCost: 0,
            totalPackagingCost: 0,
            totalProductionCost: 0,
            hppPerUnit: 0,
            targetMarginPct: preset.targetMarginPct,
            targetSellingPrice: preset.targetSellingPrice,
            profitPerUnit: 0,
          };
        }
      }

      if (!targetRecipe) {
        toast.error("Resep tidak ditemukan.");
        return;
      }

      const imported = await importHppRecipeToRawMaterials(storeOwnerUid, targetRecipe);
      toast.success(`Berhasil mengimpor ${imported} bahan baku & kemasan dari "${targetRecipe.name}".`);
      setIsImportModalOpen(false);
      await loadData();
    } catch (err) {
      toast.error("Gagal mengimpor bahan dari resep.");
    }
  };

  // Recipe Options for Import Selector
  const IMPORT_RECIPE_OPTIONS: CustomSelectOption[] = useMemo(() => {
    const userOpts: CustomSelectOption[] = userRecipes.map((r) => ({
      value: r.id,
      label: `[Resep Saya] ${r.name}`,
      emoji: "🍳",
      badge: `${r.ingredients?.length || 0} Bahan`,
      description: `Porsi: ${r.batchYield}`,
    }));

    const presetOpts: CustomSelectOption[] = HPP_BIG_DATA_TEMPLATES.map((t) => ({
      value: t.id,
      label: `${t.icon} ${t.name}`,
      badge: `${t.ingredients.length} Bahan`,
      description: `Sektor: ${t.mainCategory}`,
    }));

    return [...userOpts, ...presetOpts];
  }, [userRecipes]);

  return (
    <DashboardLayout>
      <FeatureGate
        requiredTier="pro"
        requiredIndustry={["fnb", "laundry", "universal"]}
        featureName="Stok Bahan Baku & Kemasan (Inventori Otomatis)"
        description="Pantau sisa gramatur, kemasan, nilai gudang, dan pemotongan otomatis dari penjualan POS khusus industri Kuliner & Laundry."
      >
        <div className="space-y-4 sm:space-y-6">
          {/* Header with Add & Import Actions */}
          <PageHeader
            title="Stok Bahan Baku & Kemasan"
            description="Pantau sisa gramatur, kemasan, nilai gudang, dan pemotongan otomatis dari penjualan POS."
            actions={
              !isCashier ? (
                <div className="flex items-center gap-2">
                <Button
                  onClick={() => setIsImportModalOpen(true)}
                  variant="outline"
                  size="sm"
                  className="touch-press h-9 text-xs font-bold border-emerald-300 bg-emerald-50/80 text-emerald-950 hover:bg-emerald-100 gap-1.5"
                >
                  <Download className="h-3.5 w-3.5 text-emerald-600" />
                  <span>Impor dari HPP</span>
                </Button>

                <Button
                  onClick={() => openAddModal()}
                  variant="default"
                  size="sm"
                  className="touch-press h-9 text-xs font-black bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5 shadow-xs"
                >
                  <Plus className="h-4 w-4" />
                  <span>Tambah Bahan</span>
                </Button>
              </div>
            ) : undefined
          }
        />

        {/* 4 Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
          <StatCard
            title="Total Item Bahan"
            value={materials.length}
            icon={Boxes}
            iconBgColor="bg-emerald-100"
            iconColor="text-emerald-700"
            subtitle="Bahan baku & kemasan"
          />
          <StatCard
            title="Valuasi Gudang"
            value={formatRupiah(totalValuation)}
            icon={ShoppingBag}
            iconBgColor="bg-blue-100"
            iconColor="text-blue-700"
            subtitle="Nilai total aset persediaan"
          />
          <StatCard
            title="Stok Menipis"
            value={lowStockCount}
            icon={AlertTriangle}
            iconBgColor="bg-amber-100"
            iconColor="text-amber-700"
            valueColor={lowStockCount > 0 ? "text-amber-600" : undefined}
            subtitle="Mendekati batas restock"
          />
          <StatCard
            title="Stok Habis"
            value={outOfStockCount}
            icon={TrendingDown}
            iconBgColor="bg-rose-100"
            iconColor="text-rose-700"
            valueColor={outOfStockCount > 0 ? "text-rose-600" : undefined}
            subtitle="Perlu segera dibeli ulang"
          />
        </div>

        {/* Search & Filter Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 bg-white p-3 rounded-2xl border border-slate-200/80 shadow-2xs">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              type="text"
              placeholder="Cari bahan baku, kemasan, atau catatan..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-9 text-xs rounded-xl border-slate-200"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
            <button
              onClick={() => setSelectedCategory("all")}
              className={`touch-press text-xs font-bold px-3 py-1.5 rounded-xl border transition-all shrink-0 ${
                selectedCategory === "all"
                  ? "bg-slate-900 text-white border-slate-900 shadow-2xs"
                  : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
              }`}
            >
              Semua ({materials.length})
            </button>
            {RAW_CATEGORIES.map((cat) => {
              const count = materials.filter((m) => m.category === cat).length;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`touch-press text-xs font-bold px-3 py-1.5 rounded-xl border transition-all shrink-0 ${
                    selectedCategory === cat
                      ? "bg-emerald-600 text-white border-emerald-600 shadow-2xs"
                      : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  {cat} ({count})
                </button>
              );
            })}
          </div>
        </div>

        {/* Raw Materials Grid List */}
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="h-7 w-7 animate-spin rounded-full border-2 border-emerald-600 border-t-transparent" />
          </div>
        ) : filteredMaterials.length === 0 ? (
          <div className="bg-white rounded-3xl border border-dashed border-slate-300 p-8 sm:p-12 text-center space-y-3">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 mx-auto">
              <Boxes className="h-7 w-7" />
            </div>
            <h3 className="text-base font-extrabold text-slate-900">
              Belum Ada Bahan Baku
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Tambahkan bahan baku manual atau impor otomatis dari 111+ Resep HPP agar stok terpotong setiap kali kasir checkout.
            </p>
            {!isCashier && (
              <div className="flex items-center justify-center gap-2 pt-2">
                <Button
                  onClick={() => setIsImportModalOpen(true)}
                  variant="outline"
                  size="sm"
                  className="touch-press text-xs font-bold gap-1.5 border-emerald-300 bg-emerald-50 text-emerald-950"
                >
                  <Download className="h-3.5 w-3.5 text-emerald-600" />
                  <span>Impor dari Resep HPP</span>
                </Button>
                <Button
                  onClick={() => openAddModal()}
                  size="sm"
                  className="touch-press text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5"
                >
                  <Plus className="h-4 w-4" />
                  <span>Tambah Bahan Manual</span>
                </Button>
              </div>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {filteredMaterials.map((mat) => {
              const isOutOfStock = (mat.stock || 0) <= 0;
              const isLowStock = !isOutOfStock && (mat.stock || 0) <= (mat.minStockAlert || 10);
              const totalCostValue = (mat.stock || 0) * (mat.costPerUnit || 0);

              return (
                <div
                  key={mat.id}
                  className="touch-press bg-white rounded-2xl p-4 border border-slate-200/80 hover:border-emerald-300 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between space-y-3"
                >
                  {/* Top: Name & Category Badge */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                          {mat.category}
                        </span>
                        {isOutOfStock ? (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 border border-rose-200 flex items-center gap-1">
                            <TrendingDown className="h-3 w-3" />
                            <span>Habis</span>
                          </span>
                        ) : isLowStock ? (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200 flex items-center gap-1">
                            <AlertTriangle className="h-3 w-3" />
                            <span>Menipis</span>
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                            <CheckCircle2 className="h-3 w-3" />
                            <span>Aman</span>
                          </span>
                        )}
                      </div>
                      <h4 className="font-extrabold text-sm text-slate-900 mt-1 truncate">
                        {mat.name}
                      </h4>
                      {mat.notes && (
                        <p className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">
                          {mat.notes}
                        </p>
                      )}
                    </div>

                    {!isCashier && (
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          type="button"
                          onClick={() => openAddModal(mat)}
                          className="touch-press p-1.5 text-slate-400 hover:text-emerald-600 rounded-lg hover:bg-slate-50"
                          title="Edit"
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteMaterial(mat)}
                          className="touch-press p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-slate-50"
                          title="Hapus"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Middle: Stock Level & Cost Valuation */}
                  <div className="bg-slate-50/80 rounded-xl p-2.5 border border-slate-100 space-y-1 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 text-[11px]">Sisa Stok:</span>
                      <span
                        className={`font-black text-sm ${
                          isOutOfStock
                            ? "text-rose-600"
                            : isLowStock
                            ? "text-amber-600"
                            : "text-slate-900"
                        }`}
                      >
                        {mat.stock} {mat.unit}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-500">
                      <span>Modal / {mat.unit}:</span>
                      <span className="font-bold text-slate-700">
                        {formatRupiah(mat.costPerUnit || 0)}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[11px] pt-1 border-t border-slate-200/60 font-extrabold text-emerald-950">
                      <span>Total Nilai Aset:</span>
                      <span>{formatRupiah(totalCostValue)}</span>
                    </div>
                  </div>

                  {/* Bottom Action: Restock Button */}
                  {!isCashier && (
                    <Button
                      onClick={() => openRestock(mat)}
                      variant="outline"
                      size="sm"
                      className="touch-press w-full h-8 text-xs font-bold border-slate-200 hover:border-emerald-300 hover:bg-emerald-50 text-slate-700 hover:text-emerald-900 gap-1 rounded-xl"
                    >
                      <Plus className="h-3.5 w-3.5 text-emerald-600" />
                      <span>Belanja / Restock Stok</span>
                    </Button>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Modal 1: Tambah / Edit Bahan Baku */}
        <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
          <DialogContent className="max-w-md rounded-3xl p-5 bg-white border border-slate-200 shadow-2xl text-slate-900">
            <DialogTitle className="text-base font-black flex items-center gap-2">
              <Boxes className="h-5 w-5 text-emerald-600" />
              <span>{selectedMaterial ? "Edit Bahan Baku" : "Tambah Bahan Baku Baru"}</span>
            </DialogTitle>

            <form onSubmit={handleSaveMaterial} className="space-y-3.5 mt-2 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Nama Bahan / Kemasan *</label>
                <Input
                  required
                  placeholder="Misal: Biji Kopi Arabika, Susu UHT, Cup 16oz"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="h-9 text-xs rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Kategori</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as any)}
                    className="w-full h-9 rounded-xl border border-slate-200 px-3 text-xs bg-white text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    {RAW_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Satuan Unit</label>
                  <select
                    value={formUnit}
                    onChange={(e) => setFormUnit(e.target.value)}
                    className="w-full h-9 rounded-xl border border-slate-200 px-3 text-xs bg-white text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    {UNIT_OPTIONS.map((u) => (
                      <option key={u} value={u}>
                        {u}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Stok Awal</label>
                  <Input
                    type="number"
                    min="0"
                    placeholder="0"
                    value={formStock}
                    onChange={(e) => setFormStock(e.target.value)}
                    className="h-9 text-xs rounded-xl"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Modal / Unit</label>
                  <Input
                    type="number"
                    min="0"
                    placeholder="Rp 0"
                    value={formCostPerUnit}
                    onChange={(e) => setFormCostPerUnit(e.target.value)}
                    className="h-9 text-xs rounded-xl"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Min. Alert</label>
                  <Input
                    type="number"
                    min="0"
                    placeholder="10"
                    value={formMinAlert}
                    onChange={(e) => setFormMinAlert(e.target.value)}
                    className="h-9 text-xs rounded-xl"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Catatan Tambahan (Opsional)</label>
                <Input
                  placeholder="Misal: Merk Anchor, Beli di Toko Surya"
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  className="h-9 text-xs rounded-xl"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsAddModalOpen(false)}
                  className="text-xs h-9"
                >
                  Batal
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  className="text-xs font-bold h-9 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl px-4"
                >
                  Simpan Bahan
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

        {/* Modal 2: Restock Bahan Baku */}
        <Dialog open={isRestockModalOpen} onOpenChange={setIsRestockModalOpen}>
          <DialogContent className="max-w-sm rounded-3xl p-5 bg-white border border-slate-200 shadow-2xl text-slate-900">
            <DialogTitle className="text-base font-black flex items-center gap-2">
              <PackageCheck className="h-5 w-5 text-emerald-600" />
              <span>Restock: {selectedMaterial?.name}</span>
            </DialogTitle>

            <form onSubmit={handleExecuteRestock} className="space-y-3.5 mt-2 text-xs">
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 text-[11px] space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-500">Stok Saat Ini:</span>
                  <span className="font-extrabold text-slate-900">
                    {selectedMaterial?.stock} {selectedMaterial?.unit}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Modal Sebelumnya:</span>
                  <span className="font-bold text-slate-700">
                    {formatRupiah(selectedMaterial?.costPerUnit || 0)} / {selectedMaterial?.unit}
                  </span>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">
                  Jumlah Tambahan Stok ({selectedMaterial?.unit}) *
                </label>
                <Input
                  required
                  type="number"
                  min="1"
                  placeholder={`Contoh: 1000 ${selectedMaterial?.unit}`}
                  value={restockAmount}
                  onChange={(e) => setRestockAmount(e.target.value)}
                  className="h-9 text-xs rounded-xl"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">
                  Total Biaya Belanja (Rupiah)
                </label>
                <Input
                  type="number"
                  min="0"
                  placeholder="Contoh: 75000"
                  value={restockCost}
                  onChange={(e) => setRestockCost(e.target.value)}
                  className="h-9 text-xs rounded-xl"
                />
              </div>

              <label className="flex items-center gap-2 cursor-pointer p-2 bg-emerald-50/60 rounded-xl border border-emerald-200/70">
                <input
                  type="checkbox"
                  checked={recordExpense}
                  onChange={(e) => setRecordExpense(e.target.checked)}
                  className="rounded text-emerald-600 focus:ring-emerald-500"
                />
                <span className="text-[11px] font-bold text-emerald-950">
                  Otomatis catat ke Buku Pengeluaran Toko
                </span>
              </label>

              <div className="flex items-center justify-end gap-2 pt-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsRestockModalOpen(false)}
                  className="text-xs h-9"
                >
                  Batal
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  className="text-xs font-bold h-9 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl px-4"
                >
                  Konfirmasi Restock
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

        {/* Modal 3: Impor dari Resep HPP */}
        <Dialog open={isImportModalOpen} onOpenChange={setIsImportModalOpen}>
          <DialogContent className="max-w-md rounded-3xl p-5 bg-white border border-slate-200 shadow-2xl text-slate-900">
            <DialogTitle className="text-base font-black flex items-center gap-2">
              <Download className="h-5 w-5 text-emerald-600" />
              <span>Impor Bahan dari Resep HPP</span>
            </DialogTitle>

            <p className="text-xs text-slate-600 leading-relaxed mt-1">
              Pilih resep HPP yang Anda gunakan. Seluruh bahan baku dan kemasannya akan otomatis didaftarkan ke inventori gudang Anda.
            </p>

            <div className="space-y-3.5 mt-3 text-xs">
              <div className="space-y-1.5">
                <label className="font-bold text-slate-700">Pilih Resep / Preset:</label>
                <CustomSelect
                  options={IMPORT_RECIPE_OPTIONS}
                  value={selectedRecipeToImport}
                  onChange={setSelectedRecipeToImport}
                  placeholder="Pilih resep HPP untuk diimpor..."
                  size="md"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsImportModalOpen(false)}
                  className="text-xs h-9"
                >
                  Batal
                </Button>
                <Button
                  type="button"
                  disabled={!selectedRecipeToImport}
                  onClick={handleImportRecipe}
                  size="sm"
                  className="text-xs font-black h-9 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl px-4 gap-1.5"
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>Impor Bahan Sekarang</span>
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </FeatureGate>
  </DashboardLayout>
);
}
