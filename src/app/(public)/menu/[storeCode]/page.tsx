"use client";

import React, { useEffect, useState, useMemo, use } from "react";
import {
  getStoreByCode,
  getShopProfile,
  getProducts,
  getCategories,
  createIncomingOrder,
  subscribeSingleOrder,
} from "@/services/firestore";
import { ShopProfile, Product, Category, StoreCodeMapping, IncomingOrder } from "@/types";
import { resolveBrandColors } from "@/data/brandingThemes";
import { formatRupiah } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Store,
  ShoppingCart,
  Plus,
  Minus,
  Search,
  CheckCircle2,
  Phone,
  MapPin,
  Clock,
  Sparkles,
  Send,
  X,
  RotateCcw,
  Utensils,
  ChevronRight,
  Info,
  Loader2,
  ChefHat,
  BellRing,
  CheckCircle,
  AlertCircle,
  Receipt,
  Camera,
  Eye,
  Ban,
} from "lucide-react";
import { toast } from "sonner";
import confetti from "canvas-confetti";

interface MenuCartItem {
  product: Product;
  quantity: number;
  notes?: string;
}

export default function PublicMenuPage({
  params,
}: {
  params: Promise<{ storeCode: string }>;
}) {
  const resolvedParams = use(params);
  const rawStoreCode = resolvedParams.storeCode;
  const storeCode = decodeURIComponent(rawStoreCode).toUpperCase().trim();

  const [storeMapping, setStoreMapping] = useState<StoreCodeMapping | null>(null);
  const [shopProfile, setShopProfile] = useState<ShopProfile | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  // Customer Order Information
  const [customerName, setCustomerName] = useState("");
  const [tableNumber, setTableNumber] = useState("Meja 01");
  const [orderType, setOrderType] = useState<"dine-in" | "takeaway">("dine-in");
  const [generalNotes, setGeneralNotes] = useState("");

  // Cart State
  const [cart, setCart] = useState<MenuCartItem[]>([]);
  const [isCartSheetOpen, setIsCartSheetOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Active Live Order Tracking
  const [activeOrderId, setActiveOrderId] = useState<string | null>(null);
  const [activeOrder, setActiveOrder] = useState<IncomingOrder | null>(null);

  // Product Detail Quick View Modal State
  const [selectedDetailProduct, setSelectedDetailProduct] = useState<Product | null>(null);
  const [detailNotes, setDetailNotes] = useState("");
  const [detailQty, setDetailQty] = useState(1);

  // Dynamic Brand Customization & White-Label
  const brand = useMemo(() => resolveBrandColors(shopProfile), [shopProfile]);

  useEffect(() => {
    async function fetchMenu() {
      try {
        setLoading(true);
        const mapping = await getStoreByCode(storeCode);
        if (!mapping || !mapping.isActive) {
          setStoreMapping(null);
          setLoading(false);
          return;
        }

        setStoreMapping(mapping);
        const ownerUid = mapping.ownerUid;

        const [profile, productList, catList] = await Promise.all([
          getShopProfile(ownerUid),
          getProducts(ownerUid),
          getCategories(ownerUid),
        ]);

        setShopProfile(profile);
        setProducts(productList.filter((p) => p.sellingPrice > 0));
        setCategories(catList);

        // Check if there is an active order saved in session
        const savedOrderId = localStorage.getItem(`pos_active_order_${storeCode}`);
        if (savedOrderId) {
          setActiveOrderId(savedOrderId);
        }
      } catch (err) {
        console.error("Failed loading digital menu:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchMenu();
  }, [storeCode]);

  // Subscribe to live active order updates
  useEffect(() => {
    if (!storeMapping?.ownerUid || !activeOrderId) return;

    const unsub = subscribeSingleOrder(storeMapping.ownerUid, activeOrderId, (order) => {
      if (order) {
        setActiveOrder(order);
        if (order.status === "READY" || order.status === "COMPLETED") {
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 },
          });

          // Trigger smartphone vibration if supported
          if (typeof window !== "undefined" && "vibrate" in navigator) {
            navigator.vibrate([300, 150, 300]);
          }
        }
      } else {
        setActiveOrder(null);
      }
    });

    return () => unsub();
  }, [storeMapping, activeOrderId]);

  // Filtered Products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchSearch =
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.description && p.description.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchCat =
        selectedCategory === "all" || p.categoryId === selectedCategory;
      return matchSearch && matchCat;
    });
  }, [products, searchQuery, selectedCategory]);

  // Cart Calculations
  const totalQty = useMemo(() => {
    return cart.reduce((acc, item) => acc + item.quantity, 0);
  }, [cart]);

  const totalAmount = useMemo(() => {
    return cart.reduce((acc, item) => acc + item.quantity * item.product.sellingPrice, 0);
  }, [cart]);

  const addToCart = (product: Product) => {
    if (product.stock <= 0 || product.isAvailable === false) {
      toast.error(`Mohon maaf, "${product.name}" sedang habis / tidak tersedia.`);
      return;
    }

    setCart((prev) => {
      const idx = prev.findIndex((i) => i.product.id === product.id);
      if (idx > -1) {
        const updated = [...prev];
        updated[idx].quantity += 1;
        return updated;
      } else {
        return [...prev, { product, quantity: 1 }];
      }
    });
    toast.success(`+1 ${product.name} masuk ke pesanan.`);
  };

  const addToCartWithDetails = (product: Product, quantity: number, notes?: string) => {
    if (product.stock <= 0 || product.isAvailable === false) {
      toast.error(`Mohon maaf, "${product.name}" sedang habis / tidak tersedia.`);
      return;
    }

    setCart((prev) => {
      const idx = prev.findIndex((i) => i.product.id === product.id);
      if (idx > -1) {
        const updated = [...prev];
        updated[idx].quantity = quantity;
        if (notes?.trim()) {
          updated[idx].notes = notes.trim();
        }
        return updated;
      } else {
        return [...prev, { product, quantity, notes: notes?.trim() || undefined }];
      }
    });
    toast.success(`${quantity}x ${product.name} masuk ke pesanan.`);
  };

  const handleOpenProductDetail = (product: Product) => {
    setSelectedDetailProduct(product);
    const existingInCart = cart.find((c) => c.product.id === product.id);
    setDetailNotes(existingInCart?.notes || "");
    setDetailQty(existingInCart?.quantity || 1);
  };

  const updateQuantity = (productId: string, delta: number) => {
    setCart((prev) => {
      return prev
        .map((item) => {
          if (item.product.id === productId) {
            const newQty = item.quantity + delta;
            if (newQty <= 0) return null;
            return { ...item, quantity: newQty };
          }
          return item;
        })
        .filter(Boolean) as MenuCartItem[];
    });
  };

  const updateItemNotes = (productId: string, notes: string) => {
    setCart((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, notes } : item
      )
    );
  };

  // Submit Order 100% In-App (No WhatsApp Dependency)
  const handleSubmitOrderToCashier = async () => {
    if (!storeMapping?.ownerUid) return;
    if (cart.length === 0) {
      toast.error("Pilih minimal 1 menu pesanan.");
      return;
    }

    try {
      setIsSubmitting(true);
      toast.loading("Mengirim pesanan ke kasir toko...", { id: "submit-order" });

      const orderItems = cart.map((c) => ({
        productId: c.product.id,
        productName: c.product.name,
        sellingPrice: c.product.sellingPrice,
        quantity: c.quantity,
        notes: c.notes || "",
        subtotal: c.quantity * c.product.sellingPrice,
      }));

      const res = await createIncomingOrder(storeCode, {
        ownerUid: storeMapping.ownerUid,
        customerName: customerName.trim() || "Pelanggan Meja",
        orderType,
        tableNumber: orderType === "dine-in" ? tableNumber : "Bungkus / Takeaway",
        items: orderItems,
        totalAmount,
        totalQty,
        generalNotes: generalNotes.trim(),
      });

      // Save active order in session
      setActiveOrderId(res.id);
      localStorage.setItem(`pos_active_order_${storeCode}`, res.id);

      toast.success("Pesanan berhasil dikirim ke kasir toko!", { id: "submit-order" });
      setCart([]);
      setIsCartSheetOpen(false);
    } catch (err: any) {
      console.error("Failed submitting order:", err);
      toast.error("Gagal mengirim pesanan: " + err.message, { id: "submit-order" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetActiveOrder = () => {
    setActiveOrderId(null);
    setActiveOrder(null);
    localStorage.removeItem(`pos_active_order_${storeCode}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white p-4">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent mb-3" />
        <p className="text-xs font-bold text-slate-400">Memuat Menu Digital...</p>
      </div>
    );
  }

  if (!storeMapping) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white p-6 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-rose-500/20 text-rose-400 border border-rose-500/30 mb-4">
          <Store className="h-8 w-8" />
        </div>
        <h2 className="text-xl font-black text-white">Menu Toko Tidak Ditemukan</h2>
        <p className="text-xs text-slate-400 max-w-xs mt-1 mb-4">
          Kode toko &quot;{storeCode}&quot; tidak aktif atau tautan QR Meja tidak valid.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex justify-center pb-28">
      <div className="w-full max-w-md bg-slate-900 min-h-screen flex flex-col relative shadow-2xl">
        {/* Top Store Hero Header with Dynamic Cover Banner & Brand Color */}
        <div
          className="p-5 border-b border-slate-800/80 relative overflow-hidden shrink-0 space-y-3"
          style={{
            background: shopProfile?.bannerUrl
              ? `linear-gradient(to bottom, rgba(15, 23, 42, 0.75), rgba(15, 23, 42, 0.95)), url(${shopProfile.bannerUrl}) center/cover no-repeat`
              : `linear-gradient(180deg, ${brand.darkBg} 0%, #0f172a 100%)`,
          }}
        >
          <div
            className="absolute top-0 right-0 -mt-8 -mr-8 h-36 w-36 rounded-full blur-2xl pointer-events-none opacity-40"
            style={{ backgroundColor: brand.primary }}
          />

          <div className="flex items-center gap-3">
            <div
              className="flex h-12 w-12 items-center justify-center rounded-2xl text-white font-black shrink-0 shadow-lg"
              style={{ backgroundColor: brand.primary }}
            >
              <Store className="h-6 w-6" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h1 className="text-base font-black text-white tracking-tight truncate">
                  {shopProfile?.shopName || storeMapping.shopName}
                </h1>
                <span
                  className="inline-flex items-center gap-1 rounded-full px-2 py-0.2 text-[9px] font-bold shrink-0 border"
                  style={{
                    backgroundColor: `${brand.primary}25`,
                    color: brand.secondary,
                    borderColor: `${brand.secondary}40`,
                  }}
                >
                  <Sparkles className="h-2.5 w-2.5" />
                  <span>Buka</span>
                </span>
              </div>

              {shopProfile?.tagline ? (
                <p className="text-[11px] font-medium text-slate-300 truncate mt-0.5">
                  {shopProfile.tagline}
                </p>
              ) : (
                <p className="text-[11px] text-slate-400 truncate flex items-center gap-1 mt-0.5">
                  <MapPin className="h-3 w-3 text-slate-500 shrink-0" />
                  <span>{shopProfile?.address || "Indonesia"}</span>
                </p>
              )}

              {shopProfile?.instagram && (
                <a
                  href={`https://instagram.com/${shopProfile.instagram.replace("@", "")}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-[10px] text-slate-400 hover:text-white mt-0.5 transition-colors"
                >
                  <Camera className="h-3 w-3 text-pink-400" />
                  <span>{shopProfile.instagram}</span>
                </a>
              )}
            </div>
          </div>

          {/* Quick Table / Dine-in Selector Pill */}
          <div className="flex items-center gap-2 bg-slate-950/80 p-2 rounded-2xl border border-slate-800 text-xs">
            <div className="flex rounded-xl bg-slate-900 p-0.5 border border-slate-800 shrink-0">
              <button
                type="button"
                onClick={() => setOrderType("dine-in")}
                className={`touch-press px-2.5 py-1 text-[10px] font-bold rounded-lg transition-all ${
                  orderType === "dine-in"
                    ? "text-white shadow-xs"
                    : "text-slate-400 hover:text-white"
                }`}
                style={orderType === "dine-in" ? { backgroundColor: brand.primary } : {}}
              >
                Makan Sini
              </button>
              <button
                type="button"
                onClick={() => setOrderType("takeaway")}
                className={`touch-press px-2.5 py-1 text-[10px] font-bold rounded-lg transition-all ${
                  orderType === "takeaway"
                    ? "text-white shadow-xs"
                    : "text-slate-400 hover:text-white"
                }`}
                style={orderType === "takeaway" ? { backgroundColor: brand.primary } : {}}
              >
                Bungkus
              </button>
            </div>

            {orderType === "dine-in" ? (
              <select
                value={tableNumber}
                onChange={(e) => setTableNumber(e.target.value)}
                className="flex-1 h-7 bg-slate-900 border border-slate-700/80 rounded-lg px-2 text-[11px] font-bold appearance-none cursor-pointer"
                style={{ color: brand.secondary }}
              >
                {Array.from({ length: 20 }).map((_, i) => {
                  const num = i + 1 < 10 ? `0${i + 1}` : `${i + 1}`;
                  return (
                    <option key={num} value={`Meja ${num}`}>
                      📍 Meja {num}
                    </option>
                  );
                })}
              </select>
            ) : (
              <span className="text-[11px] text-slate-400 px-2 font-medium">
                🥡 Bawa Pulang
              </span>
            )}
          </div>
        </div>

        {/* ACTIVE LIVE ORDER TRACKER CARD (IF ANY ACTIVE ORDER) */}
        {activeOrderId && activeOrder && (
          <div className="m-3 p-4 rounded-2xl bg-gradient-to-r from-slate-900 to-emerald-950 border border-emerald-500/40 shadow-xl space-y-3 animate-in slide-in-from-top duration-300">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-500 text-slate-950 font-black text-xs">
                  <BellRing className="h-4 w-4 animate-bounce" />
                </div>
                <div>
                  <span className="text-xs font-black text-white block">
                    Status Pesanan #{activeOrder.orderNumber}
                  </span>
                  <span className="text-[10px] text-slate-300">
                    {activeOrder.tableNumber} • {activeOrder.totalQty} Item
                  </span>
                </div>
              </div>

              <span
                className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full border ${
                  activeOrder.status === "PENDING"
                    ? "bg-amber-500/20 text-amber-300 border-amber-500/30"
                    : activeOrder.status === "ACCEPTED" || activeOrder.status === "COOKING"
                    ? "bg-blue-500/20 text-blue-300 border-blue-500/30"
                    : activeOrder.status === "READY"
                    ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40 animate-pulse"
                    : activeOrder.status === "COMPLETED"
                    ? "bg-emerald-600 text-white border-emerald-500"
                    : "bg-rose-500/20 text-rose-300 border-rose-500/30"
                }`}
              >
                {activeOrder.status === "PENDING" && "⏳ Menunggu Kasir"}
                {activeOrder.status === "ACCEPTED" && "👍 Pesanan Diterima"}
                {activeOrder.status === "COOKING" && "🍳 Sedang Dimasak"}
                {activeOrder.status === "READY" && "🍽️ Siap Disajikan"}
                {activeOrder.status === "COMPLETED" && "✅ Selesai / Lunas"}
                {activeOrder.status === "CANCELLED" && "❌ Dibatalkan"}
              </span>
            </div>

            {/* Dynamic Smart ETA Message */}
            {(activeOrder.status === "PENDING" || activeOrder.status === "COOKING" || activeOrder.status === "ACCEPTED") && (
              <div className="bg-emerald-950/60 border border-emerald-500/30 rounded-xl px-2.5 py-1.5 flex items-center justify-between text-[11px] text-emerald-300">
                <span className="flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5 text-emerald-400 animate-spin" />
                  <span>Perkiraan Waktu Masak:</span>
                </span>
                <span className="font-extrabold text-emerald-200">
                  ~{Math.min(25, Math.max(5, (activeOrder.totalQty || 1) * 3))} Menit
                </span>
              </div>
            )}

            {activeOrder.status === "READY" && (
              <div className="bg-emerald-500/20 border border-emerald-500/50 rounded-xl px-2.5 py-1.5 flex items-center gap-2 text-[11px] text-emerald-300 animate-pulse">
                <Sparkles className="h-4 w-4 text-emerald-400" />
                <span>Pesanan Anda telah siap disajikan di meja! Selamat menikmati 🍽️</span>
              </div>
            )}

            {activeOrder.status === "COMPLETED" && (
              <div className="bg-emerald-900/40 border border-emerald-500/40 rounded-xl px-2.5 py-1.5 flex items-center gap-2 text-[11px] text-emerald-200">
                <CheckCircle className="h-4 w-4 text-emerald-400" />
                <span>Pembayaran telah lunas di kasir. Terima kasih banyak! 🎉</span>
              </div>
            )}

            {/* Stepper Progress Bar */}
            <div className="grid grid-cols-4 gap-1.5 pt-1">
              {["Terkirim", "Dimasak", "Siap", "Selesai"].map((step, sIdx) => {
                const isCurrent =
                  (sIdx === 0 && activeOrder.status === "PENDING") ||
                  (sIdx === 1 && (activeOrder.status === "ACCEPTED" || activeOrder.status === "COOKING")) ||
                  (sIdx === 2 && activeOrder.status === "READY") ||
                  (sIdx === 3 && activeOrder.status === "COMPLETED");

                const isPassed =
                  (sIdx === 0 && activeOrder.status !== "PENDING" && activeOrder.status !== "CANCELLED") ||
                  (sIdx === 1 && (activeOrder.status === "READY" || activeOrder.status === "COMPLETED")) ||
                  (sIdx === 2 && activeOrder.status === "COMPLETED");

                return (
                  <div key={sIdx} className="space-y-1">
                    <div
                      className={`h-1.5 rounded-full transition-all ${
                        isPassed
                          ? "bg-emerald-500"
                          : isCurrent
                          ? "bg-emerald-400 animate-pulse"
                          : "bg-slate-800"
                      }`}
                    />
                    <span
                      className={`text-[9px] block text-center truncate ${
                        isPassed || isCurrent ? "text-emerald-300 font-bold" : "text-slate-500"
                      }`}
                    >
                      {step}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="flex items-center justify-between pt-1 border-t border-slate-800 text-[11px]">
              <span className="text-slate-300">
                Total: <strong>{formatRupiah(activeOrder.totalAmount)}</strong>
              </span>
              <button
                type="button"
                onClick={handleResetActiveOrder}
                className="text-[10px] text-slate-400 hover:text-white underline"
              >
                Pesan Menu Lain
              </button>
            </div>
          </div>
        )}

        {/* Search & Category Filter */}
        <div className="p-3 bg-slate-900/90 backdrop-blur-md sticky top-0 z-20 space-y-2 border-b border-slate-800">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-500" />
            <Input
              type="text"
              placeholder="Cari makanan, kopi, minuman, snack..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8.5 h-8.5 bg-slate-950 border-slate-800 text-xs rounded-xl text-white placeholder:text-slate-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
              >
                <X className="h-3 w-3" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
            <button
              onClick={() => setSelectedCategory("all")}
              className={`touch-press text-[11px] font-bold px-3 py-1 rounded-xl border transition-all shrink-0 ${
                selectedCategory === "all"
                  ? "text-white shadow-xs"
                  : "bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200"
              }`}
              style={
                selectedCategory === "all"
                  ? { backgroundColor: brand.primary, borderColor: brand.secondary }
                  : {}
              }
            >
              Semua ({products.length})
            </button>
            {categories.map((cat) => {
              const count = products.filter((p) => p.categoryId === cat.id).length;
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`touch-press text-[11px] font-bold px-3 py-1 rounded-xl border transition-all shrink-0 ${
                    isSelected
                      ? "text-white shadow-xs"
                      : "bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200"
                  }`}
                  style={
                    isSelected
                      ? { backgroundColor: brand.primary, borderColor: brand.secondary }
                      : {}
                  }
                >
                  {cat.name} ({count})
                </button>
              );
            })}
          </div>
        </div>

        {/* Product Menu List */}
        <div className="p-3 space-y-2.5 flex-1">
          {filteredProducts.length === 0 ? (
            <div className="p-8 text-center space-y-2">
              <Utensils className="h-8 w-8 text-slate-600 mx-auto" />
              <p className="text-xs text-slate-400">Tidak ada menu yang sesuai.</p>
            </div>
          ) : (
            filteredProducts.map((prod) => {
              const isAvailable = prod.isAvailable !== false;
              const isSoldOut = prod.stock <= 0 || !isAvailable;
              const inCart = cart.find((c) => c.product.id === prod.id);

              return (
                <div
                  key={prod.id}
                  className={`bg-slate-950/80 border rounded-2xl p-2.5 sm:p-3 flex items-center justify-between gap-3 transition-all shadow-2xs ${
                    isSoldOut
                      ? "border-slate-850 opacity-75"
                      : "border-slate-800/80 hover:border-slate-700"
                  }`}
                >
                  {/* Thumbnail Image - Clicking opens Quick View Modal */}
                  <div
                    onClick={() => handleOpenProductDetail(prod)}
                    className="relative shrink-0 cursor-pointer group"
                  >
                    {prod.imageUrl ? (
                      <img
                        src={prod.imageUrl}
                        alt={prod.name}
                        className={`w-16 h-16 sm:w-18 sm:h-18 rounded-xl object-cover border border-slate-800/80 bg-slate-900 shadow-xs group-hover:scale-102 transition-transform ${
                          isSoldOut ? "grayscale opacity-60" : ""
                        }`}
                        loading="lazy"
                      />
                    ) : (
                      <div
                        className={`w-16 h-16 sm:w-18 sm:h-18 rounded-xl bg-slate-900 border border-slate-800/80 flex flex-col items-center justify-center text-slate-500 ${
                          isSoldOut ? "opacity-50" : "group-hover:text-slate-300"
                        } transition-colors`}
                      >
                        <Utensils className="h-6 w-6 opacity-60" />
                        <span className="text-[8px] mt-0.5 text-slate-500 font-medium">
                          Menu
                        </span>
                      </div>
                    )}

                    {isSoldOut && (
                      <div className="absolute inset-0 bg-black/60 rounded-xl flex items-center justify-center">
                        <span className="bg-rose-600 text-white text-[8px] font-black px-1.5 py-0.5 rounded shadow-xs uppercase tracking-wider">
                          Habis
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Product Info - Clicking opens Quick View Modal */}
                  <div
                    onClick={() => handleOpenProductDetail(prod)}
                    className="min-w-0 flex-1 cursor-pointer"
                  >
                    <div className="flex items-center gap-1.5">
                      <h3
                        className={`text-xs sm:text-sm font-bold line-clamp-1 transition-colors ${
                          isSoldOut
                            ? "text-slate-400"
                            : "text-white group-hover:text-emerald-400"
                        }`}
                      >
                        {prod.name}
                      </h3>
                      {isSoldOut && (
                        <Badge
                          variant="destructive"
                          className="text-[8px] px-1 py-0 uppercase shrink-0"
                        >
                          Sold Out
                        </Badge>
                      )}
                    </div>
                    {prod.description && (
                      <p className="text-[10px] text-slate-400 line-clamp-1 mt-0.5 leading-snug">
                        {prod.description}
                      </p>
                    )}
                    <div className="flex items-center gap-2 mt-1">
                      <span
                        className={`text-xs sm:text-sm font-black ${
                          isSoldOut ? "text-slate-500 line-through" : ""
                        }`}
                        style={{ color: isSoldOut ? undefined : brand.secondary }}
                      >
                        {formatRupiah(prod.sellingPrice)}
                      </span>
                    </div>
                  </div>

                  {/* Cart Action Buttons */}
                  {isSoldOut ? (
                    <Button
                      size="sm"
                      variant="outline"
                      disabled
                      className="h-8 px-2.5 rounded-xl text-slate-500 bg-slate-900/60 border-slate-800 text-[11px] font-bold shrink-0 cursor-not-allowed opacity-75"
                    >
                      <span>Stok Habis</span>
                    </Button>
                  ) : inCart ? (
                    <div
                      className="flex items-center gap-1 bg-slate-900 border rounded-xl p-1 shrink-0"
                      style={{ borderColor: `${brand.secondary}60` }}
                    >
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          updateQuantity(prod.id, -1);
                        }}
                        className="touch-press h-6 w-6 rounded-lg bg-slate-800 text-slate-300 flex items-center justify-center hover:bg-slate-700"
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="text-xs font-black text-white px-1.5 min-w-[18px] text-center">
                        {inCart.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          updateQuantity(prod.id, 1);
                        }}
                        className="touch-press h-6 w-6 rounded-lg text-white flex items-center justify-center shadow-xs"
                        style={{ backgroundColor: brand.primary }}
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>
                  ) : (
                    <Button
                      size="sm"
                      onClick={() => handleOpenProductDetail(prod)}
                      className="touch-press h-8 px-3 rounded-xl text-white text-xs font-bold gap-1 shrink-0 shadow-xs"
                      style={{ backgroundColor: brand.primary }}
                    >
                      <Plus className="h-3.5 w-3.5" />
                      <span>Pilih</span>
                    </Button>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Dynamic Watermark Footer */}
        {!shopProfile?.hideWatermark && (
          <div className="text-center py-4 text-[10px] text-slate-600 space-y-0.5">
            <p>Powered by <strong>POS UMKM</strong></p>
            <p className="text-slate-700 text-[9px]">Sistem Menu Digital & Kasir Restoran</p>
          </div>
        )}

        {/* Floating Bottom Cart Bar */}
        {cart.length > 0 && (
          <div className="fixed bottom-3 left-3 right-3 max-w-md mx-auto z-40">
            <div
              onClick={() => setIsCartSheetOpen(true)}
              className="touch-press text-white p-3 rounded-2xl shadow-2xl flex items-center justify-between cursor-pointer border animate-in slide-in-from-bottom duration-250"
              style={{
                backgroundColor: brand.primary,
                borderColor: `${brand.secondary}60`,
              }}
            >
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-950/40 font-black text-xs">
                  {totalQty}
                </div>
                <div className="leading-tight">
                  <span className="text-[10px] text-white/80 font-bold block">
                    {orderType === "dine-in" ? tableNumber : "Bungkus / Takeaway"}
                  </span>
                  <span className="text-sm font-black text-white">
                    {formatRupiah(totalAmount)}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1 font-extrabold text-xs bg-white text-slate-950 px-3 py-1.5 rounded-xl shadow-xs">
                <span>Konfirmasi Pesanan</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </div>
            </div>
          </div>
        )}

        {/* Cart Bottom Sheet Modal */}
        {isCartSheetOpen && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex flex-col justify-end">
            <div className="bg-slate-900 border-t border-slate-800 rounded-t-3xl p-5 max-w-md w-full mx-auto max-h-[85vh] flex flex-col space-y-3 animate-in slide-in-from-bottom duration-250">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <ShoppingCart className="h-4 w-4" style={{ color: brand.secondary }} />
                  <h3 className="font-extrabold text-sm text-white">
                    Rincian Pesanan ({totalQty} Item)
                  </h3>
                </div>
                <button
                  onClick={() => setIsCartSheetOpen(false)}
                  className="touch-press p-1 text-slate-400 hover:text-white"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Order Info Form */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 block mb-1">
                    Nama Pemesan:
                  </label>
                  <Input
                    placeholder="Nama Anda..."
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="h-8 bg-slate-950 border-slate-800 text-xs rounded-xl text-white"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 block mb-1">
                    Lokasi / Meja:
                  </label>
                  <Input
                    value={orderType === "dine-in" ? tableNumber : "Bungkus / Takeaway"}
                    disabled
                    className="h-8 bg-slate-950/60 border-slate-800 text-xs rounded-xl text-slate-300"
                  />
                </div>
              </div>

              {/* Items List */}
              <div className="flex-1 overflow-y-auto space-y-2 no-scrollbar max-h-56 pr-0.5">
                {cart.map((item) => (
                  <div
                    key={item.product.id}
                    className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white truncate max-w-[180px]">
                        {item.product.name}
                      </span>
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.product.id, -1)}
                          className="h-5 w-5 rounded bg-slate-800 text-slate-300 flex items-center justify-center"
                        >
                          <Minus className="h-2.5 w-2.5" />
                        </button>
                        <span className="text-xs font-bold text-white px-1">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.product.id, 1)}
                          className="h-5 w-5 rounded text-white flex items-center justify-center"
                          style={{ backgroundColor: brand.primary }}
                        >
                          <Plus className="h-2.5 w-2.5" />
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-[11px]">
                      <Input
                        placeholder="Catatan (misal: less ice, pedas)..."
                        value={item.notes || ""}
                        onChange={(e) => updateItemNotes(item.product.id, e.target.value)}
                        className="h-6 bg-slate-900 border-slate-800 text-[10px] rounded-lg text-slate-300 py-0"
                      />
                      <span
                        className="font-extrabold shrink-0 ml-2"
                        style={{ color: brand.secondary }}
                      >
                        {formatRupiah(item.quantity * item.product.sellingPrice)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Notes */}
              <div>
                <label className="text-[10px] font-bold text-slate-400 block mb-1">
                  Catatan Keseluruhan (Opsional):
                </label>
                <Input
                  placeholder="Contoh: Tolong disajikan bersamaan..."
                  value={generalNotes}
                  onChange={(e) => setGeneralNotes(e.target.value)}
                  className="h-8 bg-slate-950 border-slate-800 text-xs rounded-xl text-white"
                />
              </div>

              {/* Total & Action: 100% IN-APP SUBMISSION */}
              <div className="pt-2 border-t border-slate-800 space-y-2">
                <div className="flex justify-between items-center text-sm font-black text-white">
                  <span>Total Pesanan:</span>
                  <span className="text-base font-black" style={{ color: brand.secondary }}>
                    {formatRupiah(totalAmount)}
                  </span>
                </div>

                <Button
                  disabled={isSubmitting}
                  onClick={handleSubmitOrderToCashier}
                  className="touch-press w-full h-11 text-white font-black text-xs rounded-2xl gap-2 shadow-lg"
                  style={{ backgroundColor: brand.primary }}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Mengirim Pesanan...</span>
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      <span>Kirim Pesanan ke Kasir Toko</span>
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL QUICK VIEW / DETAIL MENU PRODUK */}
        <Dialog
          open={!!selectedDetailProduct}
          onOpenChange={(open) => !open && setSelectedDetailProduct(null)}
        >
          <DialogContent className="sm:max-w-md bg-slate-950 border border-slate-800 text-white p-0 overflow-hidden rounded-3xl shadow-2xl">
            {selectedDetailProduct && (() => {
              const isAvailable = selectedDetailProduct.isAvailable !== false;
              const isSoldOut = selectedDetailProduct.stock <= 0 || !isAvailable;

              return (
                <div className="flex flex-col max-h-[90vh]">
                  {/* Product Hero Image / Banner */}
                  {selectedDetailProduct.imageUrl ? (
                    <div className="relative w-full h-56 bg-slate-900 overflow-hidden">
                      <img
                        src={selectedDetailProduct.imageUrl}
                        alt={selectedDetailProduct.name}
                        className={`w-full h-full object-cover ${
                          isSoldOut ? "grayscale opacity-75" : ""
                        }`}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-black/40" />
                      {isSoldOut && (
                        <div className="absolute top-4 left-4">
                          <span className="bg-rose-600 text-white text-[10px] font-black px-2.5 py-1 rounded-lg uppercase tracking-wider shadow-lg">
                            HABIS / SOLD OUT
                          </span>
                        </div>
                      )}
                      <button
                        type="button"
                        onClick={() => setSelectedDetailProduct(null)}
                        className="absolute top-3 right-3 h-8 w-8 rounded-full bg-black/60 backdrop-blur-md text-white flex items-center justify-center hover:bg-black/80 shadow-md"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="relative w-full h-36 bg-gradient-to-br from-slate-900 to-slate-950 flex items-center justify-center border-b border-slate-800/80">
                      <Utensils className="h-12 w-12 text-slate-700" />
                      {isSoldOut && (
                        <div className="absolute top-4 left-4">
                          <span className="bg-rose-600 text-white text-[10px] font-black px-2.5 py-1 rounded-lg uppercase tracking-wider shadow-lg">
                            HABIS / SOLD OUT
                          </span>
                        </div>
                      )}
                      <button
                        type="button"
                        onClick={() => setSelectedDetailProduct(null)}
                        className="absolute top-3 right-3 h-8 w-8 rounded-full bg-slate-800 text-white flex items-center justify-center hover:bg-slate-700 shadow-md"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  )}

                  {/* Content Body */}
                  <div className="p-4.5 space-y-4 overflow-y-auto flex-1 text-xs">
                    <div>
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="text-[10px] bg-slate-900 border border-slate-800 text-slate-400 px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider">
                          {selectedDetailProduct.categoryName || "Menu"}
                        </span>
                        {isSoldOut && (
                          <Badge
                            variant="destructive"
                            className="text-[9px] px-2 py-0 uppercase"
                          >
                            Stok Habis
                          </Badge>
                        )}
                      </div>
                      <h2 className="text-base sm:text-lg font-black text-white leading-tight">
                        {selectedDetailProduct.name}
                      </h2>
                      <p
                        className={`text-base font-black mt-1 ${
                          isSoldOut ? "text-slate-500 line-through" : ""
                        }`}
                        style={{
                          color: isSoldOut ? undefined : brand.secondary,
                        }}
                      >
                        {formatRupiah(selectedDetailProduct.sellingPrice)}
                      </p>
                    </div>

                    {isSoldOut && (
                      <div className="p-3 bg-rose-950/60 rounded-2xl border border-rose-800/80 flex items-center gap-2.5 text-rose-300">
                        <AlertCircle className="h-5 w-5 text-rose-400 shrink-0" />
                        <div>
                          <p className="font-bold text-xs text-rose-200">
                            Menu Ini Sedang Habis / Tidak Tersedia
                          </p>
                          <p className="text-[10px] text-rose-400">
                            Mohon maaf, saat ini menu sedang tidak dapat dipesan.
                          </p>
                        </div>
                      </div>
                    )}

                    {selectedDetailProduct.description && (
                      <div className="p-3 bg-slate-900/60 rounded-2xl border border-slate-800/80 space-y-1">
                        <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider">
                          Deskripsi Menu:
                        </span>
                        <p className="text-xs text-slate-300 leading-relaxed">
                          {selectedDetailProduct.description}
                        </p>
                      </div>
                    )}

                    {!isSoldOut && (
                      <div>
                        <label className="font-bold text-slate-300 block mb-1">
                          Catatan Pesanan Khusus (Opsional):
                        </label>
                        <Input
                          value={detailNotes}
                          onChange={(e) => setDetailNotes(e.target.value)}
                          placeholder="Contoh: Kurang manis / es dipisah / pedas sedang..."
                          className="bg-slate-900 border-slate-800 text-white placeholder:text-slate-500 text-xs rounded-xl h-9.5"
                        />
                      </div>
                    )}

                    {/* Quantity Stepper & Add Action */}
                    <div className="pt-2 border-t border-slate-800/80">
                      {isSoldOut ? (
                        <Button
                          type="button"
                          disabled
                          className="w-full h-11 rounded-2xl text-slate-400 bg-slate-900 border border-slate-800 font-bold text-xs cursor-not-allowed opacity-80 gap-1.5"
                        >
                          <Ban className="h-4 w-4 text-rose-500" />
                          <span>Menu Sedang Habis (Sold Out)</span>
                        </Button>
                      ) : (
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-xl p-1 shrink-0">
                            <button
                              type="button"
                              onClick={() => setDetailQty((q) => Math.max(1, q - 1))}
                              className="touch-press h-8 w-8 rounded-lg bg-slate-800 text-slate-300 flex items-center justify-center hover:bg-slate-700 text-sm font-bold"
                            >
                              <Minus className="h-4 w-4" />
                            </button>
                            <span className="text-sm font-black text-white px-2">
                              {detailQty}
                            </span>
                            <button
                              type="button"
                              onClick={() => setDetailQty((q) => q + 1)}
                              className="touch-press h-8 w-8 rounded-lg text-white flex items-center justify-center shadow-xs text-sm font-bold"
                              style={{ backgroundColor: brand.primary }}
                            >
                              <Plus className="h-4 w-4" />
                            </button>
                          </div>

                          <Button
                            type="button"
                            onClick={() => {
                              addToCartWithDetails(
                                selectedDetailProduct,
                                detailQty,
                                detailNotes
                              );
                              setSelectedDetailProduct(null);
                            }}
                            className="touch-press flex-1 h-10 rounded-xl text-white font-black text-xs gap-2 shadow-lg"
                            style={{ backgroundColor: brand.primary }}
                          >
                            <ShoppingCart className="h-4 w-4" />
                            <span>
                              Tambah • {formatRupiah(selectedDetailProduct.sellingPrice * detailQty)}
                            </span>
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })()}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
