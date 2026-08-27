"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useAuth } from "@/context/AuthContext";
import {
  getProducts,
  getCategories,
  createProduct,
  updateProduct,
  deleteProduct,
  createCategory,
  deleteCategory,
  createExpense,
} from "@/services/firestore";
import { storage } from "@/lib/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { compressImage, CompressionResult } from "@/lib/imageCompressor";
import { Product, Category } from "@/types";
import { formatRupiah } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ProductFormDialog, ProductFormValues } from "@/components/products/ProductFormDialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { PageHeader } from "@/components/common/PageHeader";
import {
  Plus,
  Search,
  Package,
  Edit2,
  Trash2,
  Layers,
  AlertTriangle,
  Sparkles,
  TrendingUp,
  Tag,
  Loader2,
  Image as ImageIcon,
  Camera,
  Upload,
  X,
  CheckCircle2,
  Ban,
  Check,
} from "lucide-react";
import { toast } from "sonner";

export default function ProductsPage() {
  const { user, storeOwnerUid } = useAuth();
  const activeUid = storeOwnerUid || user?.uid;
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [stockFilter, setStockFilter] = useState<"all" | "low" | "out">("all");

  // Form Product Modal
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    sku: "",
    barcode: "",
    categoryId: "",
    costPrice: 0,
    sellingPrice: 0,
    stock: 0,
    minStockAlert: 5,
    unit: "Pcs",
    description: "",
    imageUrl: "",
    isAvailable: true,
  });
  const [isSaving, setIsSaving] = useState(false);

  // Smart Image Compression State
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [compressionInfo, setCompressionInfo] = useState<CompressionResult | null>(null);

  // Restock Modal State
  const [isRestockModalOpen, setIsRestockModalOpen] = useState(false);
  const [restockProduct, setRestockProduct] = useState<Product | null>(null);
  const [restockQty, setRestockQty] = useState(10);
  const [restockUnitCost, setRestockUnitCost] = useState(0);
  const [recordAsExpense, setRecordAsExpense] = useState(true);
  const [isRestocking, setIsRestocking] = useState(false);

  // Category Modal
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [newCatName, setNewCatName] = useState("");

  const loadData = async () => {
    if (!activeUid) return;
    try {
      setLoading(true);
      const [prodList, catList] = await Promise.all([
        getProducts(activeUid),
        getCategories(activeUid),
      ]);
      setProducts(prodList);
      setCategories(catList);
    } catch (err) {
      console.error(err);
      toast.error("Gagal memuat data produk.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [activeUid]);

  // Open modal for restock
  const handleOpenRestock = (prod: Product) => {
    setRestockProduct(prod);
    setRestockQty(10);
    setRestockUnitCost(prod.costPrice || 0);
    setRecordAsExpense(true);
    setIsRestockModalOpen(true);
  };

  // Save Restock action
  const handleSaveRestock = async () => {
    if (!activeUid || !restockProduct) return;
    if (restockQty <= 0) {
      toast.error("Jumlah restok harus lebih dari 0!");
      return;
    }

    try {
      setIsRestocking(true);
      const newStock = (Number(restockProduct.stock) || 0) + Number(restockQty);
      const totalExpense = Number(restockQty) * Number(restockUnitCost);

      // 1. Update stock
      await updateProduct(activeUid, restockProduct.id, {
        stock: newStock,
        costPrice: Number(restockUnitCost) || restockProduct.costPrice,
      });

      // 2. Otomatis catat ke pengeluaran toko jika dicentang
      if (recordAsExpense && totalExpense > 0) {
        await createExpense(activeUid, {
          description: `Kulakan / Restok: ${restockProduct.name} (+${restockQty} ${restockProduct.unit || "Pcs"})`,
          amount: totalExpense,
          category: "Bahan Baku / Kulakan",
          paymentMethod: "cash",
          date: new Date().toISOString(),
        });
      }

      toast.success(
        `✨ Restok ${restockQty} ${restockProduct.unit || "Pcs"} "${restockProduct.name}" berhasil! ${
          recordAsExpense && totalExpense > 0
            ? `Tercatat di pengeluaran toko: ${formatRupiah(totalExpense)}`
            : ""
        }`
      );
      setIsRestockModalOpen(false);
      await loadData();
    } catch (err: any) {
      toast.error("Gagal restok: " + err.message);
    } finally {
      setIsRestocking(false);
    }
  };

  // Handle image upload with smart client-side compression
  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !activeUid) return;

    try {
      setIsUploadingImage(true);
      toast.loading("Mengompresi gambar produk...", { id: "compress-img" });

      // 1. Kompresi gambar menjadi WebP ultra-ringan (~30KB-50KB)
      const compressed = await compressImage(file, {
        maxWidth: 600,
        maxHeight: 600,
        quality: 0.8,
        mimeType: "image/webp",
      });

      setCompressionInfo(compressed);
      toast.loading("Mengunggah foto produk...", { id: "compress-img" });

      // 2. Unggah ke Firebase Storage dengan fallback data URL
      try {
        const storageRef = ref(
          storage,
          `users/${activeUid}/products/prod_${Date.now()}.webp`
        );
        const snap = await uploadBytes(storageRef, compressed.file);
        const downloadUrl = await getDownloadURL(snap.ref);
        setFormData((prev) => ({ ...prev, imageUrl: downloadUrl }));
        toast.success(
          `Foto berhasil dikompresi (${compressed.compressionRatio}) dan diunggah!`,
          { id: "compress-img" }
        );
      } catch (storageErr) {
        console.warn("Storage upload fallback to base64", storageErr);
        const reader = new FileReader();
        reader.onload = (event) => {
          const base64 = event.target?.result as string;
          setFormData((prev) => ({ ...prev, imageUrl: base64 }));
          toast.success(
            `Foto berhasil dikompresi (${compressed.compressionRatio}) dan disimpan!`,
            { id: "compress-img" }
          );
        };
        reader.readAsDataURL(compressed.file);
      }
    } catch (err: any) {
      console.error(err);
      toast.error("Gagal mengunggah foto: " + (err?.message || "Error"), {
        id: "compress-img",
      });
    } finally {
      setIsUploadingImage(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  // Quick 1-Click Toggle Availability (Tersedia ⇋ Tandai Habis Sementara)
  const handleToggleAvailability = async (prod: Product) => {
    if (!activeUid) return;
    const currentStatus = prod.isAvailable !== false; // default true
    const newStatus = !currentStatus;

    try {
      await updateProduct(activeUid, prod.id, { isAvailable: newStatus });
      toast.success(
        newStatus
          ? `✓ "${prod.name}" sekarang berstatus TERSEDIA.`
          : `⚠️ "${prod.name}" DITANDAI HABIS / SOLD OUT.`
      );
      await loadData();
    } catch (err: any) {
      toast.error("Gagal mengubah status: " + err.message);
    }
  };

  // Open modal for new product
  const handleOpenAddProduct = () => {
    setEditingProduct(null);
    setCompressionInfo(null);
    setFormData({
      name: "",
      sku: "",
      barcode: "",
      categoryId: categories[0]?.id || "",
      costPrice: 0,
      sellingPrice: 0,
      stock: 10,
      minStockAlert: 5,
      unit: "Pcs",
      description: "",
      imageUrl: "",
      isAvailable: true,
    });
    setIsProductModalOpen(true);
  };

  // Open modal for editing
  const handleOpenEditProduct = (prod: Product) => {
    setEditingProduct(prod);
    setCompressionInfo(null);
    setFormData({
      name: prod.name,
      sku: prod.sku || "",
      barcode: prod.barcode || "",
      categoryId: prod.categoryId || "",
      costPrice: prod.costPrice || 0,
      sellingPrice: prod.sellingPrice || 0,
      stock: prod.stock || 0,
      minStockAlert: prod.minStockAlert || 5,
      unit: prod.unit || "Pcs",
      description: prod.description || "",
      imageUrl: prod.imageUrl || "",
      isAvailable: prod.isAvailable !== false,
    });
    setIsProductModalOpen(true);
  };

  // Save product
  // Zod Save product
  const handleZodSaveProduct = async (data: ProductFormValues) => {
    if (!activeUid) return;

    const selectedCat = categories.find((c) => c.id === data.categoryId);

    const payload = {
      name: data.name.trim(),
      sku: data.sku?.trim() || undefined,
      barcode: data.barcode?.trim() || undefined,
      categoryId: data.categoryId || undefined,
      categoryName: selectedCat ? selectedCat.name : "Umum",
      costPrice: data.costPrice || 0,
      sellingPrice: data.sellingPrice || 0,
      stock: data.stock || 0,
      minStockAlert: data.minStockAlert || 5,
      unit: data.unit.trim() || "Pcs",
      description: data.description?.trim() || undefined,
      imageUrl: data.imageUrl?.trim() || undefined,
      isAvailable: data.isAvailable !== false,
    };

    if (editingProduct) {
      await updateProduct(activeUid, editingProduct.id, payload);
      toast.success("Produk berhasil diperbarui!");
    } else {
      await createProduct(activeUid, payload);
      toast.success("Produk baru berhasil ditambahkan!");
    }

    setIsProductModalOpen(false);
    await loadData();
  };

  // Delete product
  const handleDeleteProduct = async (id: string, name: string) => {
    if (!activeUid) return;
    if (confirm(`Apakah Anda yakin ingin menghapus produk "${name}"?`)) {
      try {
        await deleteProduct(activeUid, id);
        toast.success(`Produk "${name}" berhasil dihapus.`);
        await loadData();
      } catch (err) {
        toast.error("Gagal menghapus produk.");
      }
    }
  };

  // Create Category
  const handleCreateCategory = async () => {
    if (!activeUid || !newCatName.trim()) return;
    try {
      await createCategory(activeUid, { name: newCatName.trim() });
      toast.success(`Kategori "${newCatName}" berhasil dibuat!`);
      setNewCatName("");
      await loadData();
    } catch (err) {
      toast.error("Gagal membuat kategori.");
    }
  };

  // Delete Category
  const handleDeleteCategory = async (id: string, name: string) => {
    if (!activeUid) return;
    if (confirm(`Hapus kategori "${name}"? Produk dalam kategori ini akan menjadi Umum.`)) {
      try {
        await deleteCategory(activeUid, id);
        toast.success(`Kategori "${name}" dihapus.`);
        await loadData();
      } catch (err) {
        toast.error("Gagal menghapus kategori.");
      }
    }
  };

  // Calculated stats for summary dashboard
  const totalProducts = products.length;
  const totalAssetValue = useMemo(() => {
    return products.reduce(
      (acc, p) => acc + (p.stock || 0) * (p.costPrice || 0),
      0
    );
  }, [products]);
  const lowStockCount = useMemo(() => {
    return products.filter(
      (p) =>
        p.isAvailable !== false &&
        p.stock > 0 &&
        p.stock <= (p.minStockAlert || 5)
    ).length;
  }, [products]);
  const outOfStockCount = useMemo(() => {
    return products.filter((p) => p.stock <= 0 || p.isAvailable === false).length;
  }, [products]);

  // Calculated margin stats for the modal
  const profitPerUnit = (formData.sellingPrice || 0) - (formData.costPrice || 0);
  const profitMarginPercent =
    formData.sellingPrice > 0
      ? Math.round((profitPerUnit / formData.sellingPrice) * 100)
      : 0;

  // Filtered Products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchSearch =
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.sku && p.sku.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (p.barcode && p.barcode.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchCat =
        selectedCategory === "all" || p.categoryId === selectedCategory;

      let matchStock = true;
      if (stockFilter === "low") {
        matchStock =
          p.isAvailable !== false &&
          p.stock > 0 &&
          p.stock <= (p.minStockAlert || 5);
      } else if (stockFilter === "out") {
        matchStock = p.stock <= 0 || p.isAvailable === false;
      }

      return matchSearch && matchCat && matchStock;
    });
  }, [products, searchQuery, selectedCategory, stockFilter]);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Reusable Standard Page Header */}
        <PageHeader
          title="Katalog Produk & Stok"
          description="Kelola daftar barang dagangan, harga modal, harga jual, dan kontrol stok."
          actions={
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsCategoryModalOpen(true)}
                className="touch-press gap-1.5 text-xs h-9"
              >
                <Layers className="h-4 w-4 text-slate-600" />
                <span>Kategori</span>
              </Button>

              <Button
                variant="default"
                size="sm"
                onClick={handleOpenAddProduct}
                className="touch-press gap-1.5 text-xs h-9 shadow-xs"
              >
                <Plus className="h-4 w-4" />
                <span>Tambah Produk</span>
              </Button>
            </>
          }
        />

        {/* Summary Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="rounded-2xl border border-slate-200/80 bg-white p-3 sm:p-4 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Total Produk
              </span>
              <div className="h-8 w-8 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600">
                <Package className="h-4 w-4" />
              </div>
            </div>
            <p className="mt-2 text-xl sm:text-2xl font-black text-slate-900">
              {totalProducts} <span className="text-xs font-semibold text-slate-400">SKU</span>
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200/80 bg-white p-3 sm:p-4 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Nilai Aset Stok
              </span>
              <div className="h-8 w-8 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                <TrendingUp className="h-4 w-4" />
              </div>
            </div>
            <p className="mt-2 text-xl sm:text-2xl font-black text-emerald-700">
              {formatRupiah(totalAssetValue)}
            </p>
          </div>

          <div
            onClick={() => setStockFilter(stockFilter === "low" ? "all" : "low")}
            className={`rounded-2xl border p-3 sm:p-4 transition-all cursor-pointer shadow-2xs ${
              stockFilter === "low"
                ? "border-amber-400 bg-amber-50/70 ring-2 ring-amber-400/30"
                : "border-slate-200/80 bg-white hover:border-amber-300"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-amber-800 uppercase tracking-wider">
                Stok Menipis
              </span>
              <div className="h-8 w-8 rounded-xl bg-amber-100/70 flex items-center justify-center text-amber-700">
                <AlertTriangle className="h-4 w-4" />
              </div>
            </div>
            <p className="mt-2 text-xl sm:text-2xl font-black text-amber-700">
              {lowStockCount} <span className="text-xs font-semibold text-amber-600">Item</span>
            </p>
          </div>

          <div
            onClick={() => setStockFilter(stockFilter === "out" ? "all" : "out")}
            className={`rounded-2xl border p-3 sm:p-4 transition-all cursor-pointer shadow-2xs ${
              stockFilter === "out"
                ? "border-rose-400 bg-rose-50/70 ring-2 ring-rose-400/30"
                : "border-slate-200/80 bg-white hover:border-rose-300"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-rose-800 uppercase tracking-wider">
                Stok Habis
              </span>
              <div className="h-8 w-8 rounded-xl bg-rose-100/70 flex items-center justify-center text-rose-700">
                <AlertTriangle className="h-4 w-4" />
              </div>
            </div>
            <p className="mt-2 text-xl sm:text-2xl font-black text-rose-700">
              {outOfStockCount} <span className="text-xs font-semibold text-rose-600">Item</span>
            </p>
          </div>
        </div>

        {/* Filter Bar & Category Pills */}
        <div className="space-y-2.5">
          <div className="flex flex-col sm:flex-row gap-2.5">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                type="text"
                placeholder="Cari nama barang, kode SKU, atau barcode..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9.5 h-10 bg-white rounded-xl border-slate-200 text-xs"
              />
            </div>

            {/* Quick Stock Filter Chips */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
              <button
                type="button"
                onClick={() => setStockFilter("all")}
                className={`touch-press px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all border ${
                  stockFilter === "all"
                    ? "bg-slate-900 text-white border-slate-900 shadow-2xs"
                    : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                }`}
              >
                Semua Status
              </button>
              <button
                type="button"
                onClick={() => setStockFilter("low")}
                className={`touch-press px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all border ${
                  stockFilter === "low"
                    ? "bg-amber-600 text-white border-amber-600 shadow-2xs"
                    : "bg-white text-amber-700 border-amber-200 hover:bg-amber-50"
                }`}
              >
                Menipis ({lowStockCount})
              </button>
              <button
                type="button"
                onClick={() => setStockFilter("out")}
                className={`touch-press px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all border ${
                  stockFilter === "out"
                    ? "bg-rose-600 text-white border-rose-600 shadow-2xs"
                    : "bg-white text-rose-700 border-rose-200 hover:bg-rose-50"
                }`}
              >
                Habis ({outOfStockCount})
              </button>
            </div>
          </div>
        </div>

        {/* Product Catalog Display (Table on Desktop, Cards on Mobile) */}
        <div className="rounded-2xl border border-slate-200/80 bg-white overflow-hidden shadow-2xs">
          {loading ? (
            <div className="flex items-center justify-center p-12 text-slate-400 gap-2">
              <Loader2 className="h-5 w-5 animate-spin text-emerald-600" />
              <span className="text-xs font-semibold">Memuat data produk...</span>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-12 text-center">
              <div className="h-12 w-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 mb-2">
                <Package className="h-6 w-6" />
              </div>
              <h4 className="font-bold text-slate-800 text-sm">Produk Tidak Ditemukan</h4>
              <p className="text-xs text-slate-500 max-w-xs mt-0.5 mb-4">
                {products.length === 0
                  ? "Katalog Anda masih kosong. Tambahkan produk pertama sekarang."
                  : "Tidak ada produk yang cocok dengan pencarian atau filter Anda."}
              </p>
            </div>
          ) : (
            <>
              {/* MOBILE CARD VIEW (< sm) */}
              <div className="divide-y divide-slate-100 block sm:hidden">
                {filteredProducts.map((p) => {
                  const isAvailable = p.isAvailable !== false;
                  const isLow = isAvailable && p.stock > 0 && p.stock <= (p.minStockAlert || 5);
                  const isOut = p.stock <= 0 || !isAvailable;

                  return (
                    <div
                      key={p.id}
                      className={`p-3.5 space-y-2.5 transition-colors ${
                        !isAvailable ? "bg-rose-50/30" : ""
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex gap-2.5 min-w-0 flex-1">
                          <div className="relative shrink-0">
                            {p.imageUrl ? (
                              <img
                                src={p.imageUrl}
                                alt={p.name}
                                className={`w-12 h-12 rounded-xl object-cover border border-slate-100 bg-slate-50 ${
                                  !isAvailable ? "grayscale opacity-75" : ""
                                }`}
                              />
                            ) : (
                              <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400">
                                <Package className="h-5 w-5" />
                              </div>
                            )}
                            {!isAvailable && (
                              <span className="absolute -bottom-1 -right-1 bg-rose-600 text-white text-[8px] font-black px-1 rounded-sm shadow-xs">
                                HABIS
                              </span>
                            )}
                          </div>

                          <div className="min-w-0 flex-1">
                            <h4 className="font-extrabold text-slate-900 text-xs truncate">
                              {p.name}
                            </h4>
                            {p.description && (
                              <p className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">
                                {p.description}
                              </p>
                            )}
                            <div className="flex items-center gap-1.5 mt-1">
                              <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded font-medium">
                                {p.categoryName || "Umum"}
                              </span>
                              <span className="text-[10px] font-bold text-emerald-700">
                                {formatRupiah(p.sellingPrice)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Stock & Action Bar */}
                      <div className="flex items-center justify-between pt-1 border-t border-slate-100/80 gap-2">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[11px] text-slate-500 font-medium">Status:</span>
                          {!isAvailable ? (
                            <Badge variant="destructive" className="text-[10px]">Ditandai Habis</Badge>
                          ) : p.stock <= 0 ? (
                            <Badge variant="destructive" className="text-[10px]">Stok 0 (Habis)</Badge>
                          ) : isLow ? (
                            <Badge variant="warning" className="text-[10px]">Sisa {p.stock}</Badge>
                          ) : (
                            <span className="text-xs font-bold text-slate-800">{p.stock} {p.unit}</span>
                          )}
                        </div>

                        <div className="flex items-center gap-1">
                          <Button
                            type="button"
                            variant={isAvailable ? "outline" : "destructive"}
                            size="sm"
                            onClick={() => handleToggleAvailability(p)}
                            className="h-7 px-2 text-[10px] font-bold gap-1"
                            title={isAvailable ? "Tandai Stok Habis Mendadak" : "Aktifkan Kembali Menu"}
                          >
                            {isAvailable ? (
                              <>
                                <Ban className="h-3 w-3 text-rose-500" />
                                <span>Tandai Habis</span>
                              </>
                            ) : (
                              <>
                                <CheckCircle2 className="h-3 w-3 text-white" />
                                <span>Aktifkan</span>
                              </>
                            )}
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => handleOpenRestock(p)} className="h-7 px-2 text-[11px]">Restok</Button>
                          <Button variant="ghost" size="iconSm" onClick={() => handleOpenEditProduct(p)} className="h-7 w-7"><Edit2 className="h-3.5 w-3.5" /></Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* DESKTOP TABLE VIEW (>= sm) */}
              <div className="hidden sm:block overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="border-b border-slate-100 bg-slate-50/70 font-bold uppercase text-slate-500">
                    <tr>
                      <th className="py-3.5 px-4">Produk</th>
                      <th className="py-3.5 px-4">Kategori</th>
                      <th className="py-3.5 px-4 text-right">Harga Modal</th>
                      <th className="py-3.5 px-4 text-right">Harga Jual</th>
                      <th className="py-3.5 px-4 text-center">Status / Stok</th>
                      <th className="py-3.5 px-4 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredProducts.map((p) => {
                      const isAvailable = p.isAvailable !== false;
                      const isLow = isAvailable && p.stock > 0 && p.stock <= (p.minStockAlert || 5);
                      const isOut = p.stock <= 0 || !isAvailable;

                      return (
                        <tr
                          key={p.id}
                          className={`transition-colors ${
                            !isAvailable ? "bg-rose-50/20" : ""
                          }`}
                        >
                          <td className="py-3.5 px-4 flex items-center gap-3">
                            <div className="relative shrink-0">
                              {p.imageUrl ? (
                                <img
                                  src={p.imageUrl}
                                  alt=""
                                  className={`w-10 h-10 rounded-lg object-cover border border-slate-100 bg-slate-50 ${
                                    !isAvailable ? "grayscale opacity-75" : ""
                                  }`}
                                />
                              ) : (
                                <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400">
                                  <Package className="h-5 w-5" />
                                </div>
                              )}
                              {!isAvailable && (
                                <span className="absolute -bottom-1 -right-1 bg-rose-600 text-white text-[7px] font-black px-1 rounded-sm shadow-xs">
                                  HABIS
                                </span>
                              )}
                            </div>
                            <div>
                              <div className="font-bold text-slate-900 flex items-center gap-1.5">
                                <span>{p.name}</span>
                                {!isAvailable && (
                                  <span className="text-[9px] font-bold text-rose-600 bg-rose-50 border border-rose-200 px-1.5 rounded">
                                    Ditandai Habis
                                  </span>
                                )}
                              </div>
                              <div className="text-[10px] text-slate-400">{p.sku || "-"}</div>
                            </div>
                          </td>
                          <td className="py-3.5 px-4 font-medium text-slate-600">{p.categoryName || "Umum"}</td>
                          <td className="py-3.5 px-4 text-right text-slate-500">{formatRupiah(p.costPrice)}</td>
                          <td className="py-3.5 px-4 text-right font-bold text-emerald-800">{formatRupiah(p.sellingPrice)}</td>
                          <td className="py-3.5 px-4 text-center">
                            {!isAvailable ? (
                              <Badge variant="destructive" className="text-[10px]">Ditandai Habis</Badge>
                            ) : p.stock <= 0 ? (
                              <Badge variant="destructive" className="text-[10px]">Stok Habis (0)</Badge>
                            ) : isLow ? (
                              <Badge variant="warning" className="text-[10px]">Sisa {p.stock}</Badge>
                            ) : (
                              <Badge variant="outline" className="text-[10px] text-emerald-700 border-emerald-300 bg-emerald-50">
                                {p.stock} {p.unit || "Pcs"}
                              </Badge>
                            )}
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <Button
                                type="button"
                                variant={isAvailable ? "outline" : "destructive"}
                                size="sm"
                                onClick={() => handleToggleAvailability(p)}
                                className="h-7 px-2 text-[10px] font-bold gap-1"
                                title={isAvailable ? "Tandai Stok Habis Mendadak" : "Aktifkan Kembali Menu"}
                              >
                                {isAvailable ? (
                                  <>
                                    <Ban className="h-3 w-3 text-rose-500" />
                                    <span>Tandai Habis</span>
                                  </>
                                ) : (
                                  <>
                                    <CheckCircle2 className="h-3 w-3 text-white" />
                                    <span>Aktifkan</span>
                                  </>
                                )}
                              </Button>
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => handleOpenRestock(p)}
                                className="h-7 px-2 text-[11px]"
                              >
                                Restok
                              </Button>
                              <Button
                                variant="ghost"
                                size="iconSm"
                                onClick={() => handleOpenEditProduct(p)}
                                className="h-7 w-7"
                              >
                                <Edit2 className="h-3.5 w-3.5" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
        <ProductFormDialog
          isOpen={isProductModalOpen}
          onClose={() => setIsProductModalOpen(false)}
          categories={categories}
          initialData={editingProduct}
          onSave={handleZodSaveProduct}
          activeUid={activeUid || ""}
        />
      </div>

      {/* MODAL KELOLA KATEGORI */}
      <Dialog open={isCategoryModalOpen} onOpenChange={setIsCategoryModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-bold flex items-center gap-2">
              <Layers className="h-5 w-5 text-emerald-600" />
              <span>Kelola Kategori Produk</span>
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-3 text-xs">
            {/* Form Buat Kategori Baru */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleCreateCategory();
              }}
              className="flex gap-2"
            >
              <Input
                placeholder="Nama kategori baru..."
                value={newCatName}
                onChange={(e) => setNewCatName(e.target.value)}
                className="h-9 text-xs"
              />
              <Button
                type="submit"
                disabled={!newCatName.trim()}
                size="sm"
                className="h-9 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shrink-0"
              >
                Tambah
              </Button>
            </form>

            <div className="space-y-1.5 max-h-60 overflow-y-auto pr-1">
              {categories.length === 0 ? (
                <p className="text-slate-400 py-4 text-center">
                  Belum ada kategori kustom.
                </p>
              ) : (
                categories.map((c) => {
                  const productCount = products.filter(
                    (p) => p.categoryId === c.id
                  ).length;
                  return (
                    <div
                      key={c.id}
                      className="flex items-center justify-between p-2.5 rounded-xl border border-slate-100 bg-slate-50/70 hover:bg-slate-100 transition-colors"
                    >
                      <div>
                        <span className="font-bold text-slate-800">{c.name}</span>
                        <span className="text-[10px] text-slate-400 ml-2">
                          ({productCount} Produk)
                        </span>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="iconSm"
                        onClick={() => handleDeleteCategory(c.id, c.name)}
                        className="h-6 w-6 text-slate-400 hover:text-rose-600"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsCategoryModalOpen(false)}
            >
              Tutup
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* MODAL RESTOK / KULAKAN PRODUK */}
      <Dialog open={isRestockModalOpen} onOpenChange={setIsRestockModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-black text-slate-900 flex items-center gap-2">
              <Package className="h-5 w-5 text-emerald-600" />
              <span>Restok / Kulakan Stok Produk</span>
            </DialogTitle>
          </DialogHeader>

          {restockProduct && (
            <div className="space-y-4 py-2 text-xs">
              <div className="rounded-xl bg-slate-50 border border-slate-200 p-3">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Produk yang Direstok:
                </span>
                <h4 className="font-extrabold text-slate-900 text-sm mt-0.5">
                  {restockProduct.name}
                </h4>
                <div className="flex justify-between items-center text-slate-600 mt-2 pt-2 border-t border-slate-200 text-xs">
                  <span>Stok Saat Ini: <strong>{restockProduct.stock} {restockProduct.unit || "Pcs"}</strong></span>
                  <span>HPP Modal: <strong>{formatRupiah(restockProduct.costPrice)}</strong></span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Tambah Stok (+{restockProduct.unit || "Pcs"})
                  </label>
                  <Input
                    type="number"
                    min="1"
                    value={restockQty || ""}
                    onChange={(e) => setRestockQty(Number(e.target.value) || 0)}
                    className="font-bold text-base h-10"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Harga Beli / Modal per Unit
                  </label>
                  <Input
                    type="number"
                    min="0"
                    value={restockUnitCost || ""}
                    onChange={(e) => setRestockUnitCost(Number(e.target.value) || 0)}
                    className="font-bold text-xs h-10"
                  />
                </div>
              </div>

              {/* Total Kulakan */}
              <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-3 flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-emerald-800 font-semibold block">
                    Total Biaya Modal Kulakan:
                  </span>
                  <span className="text-base font-black text-emerald-950">
                    {formatRupiah(restockQty * restockUnitCost)}
                  </span>
                </div>
                <Badge variant="default" className="text-xs bg-emerald-600 text-white font-bold">
                  Stok Jadi: {Number(restockProduct.stock || 0) + Number(restockQty || 0)} {restockProduct.unit || "Pcs"}
                </Badge>
              </div>

              {/* Auto Record Expense Checkbox */}
              <label className="flex items-start gap-2.5 rounded-xl border border-amber-200 bg-amber-50/70 p-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={recordAsExpense}
                  onChange={(e) => setRecordAsExpense(e.target.checked)}
                  className="mt-0.5 h-4 w-4 rounded border-amber-300 text-emerald-600 focus:ring-emerald-500 accent-emerald-600"
                />
                <div>
                  <span className="font-bold text-amber-950 block">
                    Otomatis Catat sebagai Pengeluaran Toko (Expenses)
                  </span>
                  <span className="text-[11px] text-amber-800 leading-tight block mt-0.5">
                    Biaya kulakan sebesar {formatRupiah(restockQty * restockUnitCost)} akan langsung masuk ke buku pengeluaran kas toko kategori "Bahan Baku / Kulakan".
                  </span>
                </div>
              </label>

              <DialogFooter className="pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsRestockModalOpen(false)}
                >
                  Batal
                </Button>
                <Button
                  type="button"
                  onClick={handleSaveRestock}
                  disabled={isRestocking || restockQty <= 0}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-md shadow-emerald-600/20"
                >
                  {isRestocking ? "Memproses..." : "Konfirmasi Restok"}
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
