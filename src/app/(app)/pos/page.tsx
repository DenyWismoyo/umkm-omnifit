"use client";

import React, { useState, useEffect, useMemo } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useAuth } from "@/context/AuthContext";
import { useCartStore } from "@/store/useCartStore";
import {
  getProducts,
  getCategories,
  getCustomers,
  createTransaction,
  deductRawMaterialsForTransaction,
  subscribeIncomingOrders,
  updateOrderStatus,
} from "@/services/firestore";
import {
  Product,
  Category,
  Customer,
  CartItem,
  Transaction,
  IncomingOrder,
} from "@/types";
import { formatRupiah } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Plus,
  Minus,
  Trash2,
  ShoppingCart,
  Receipt,
  ScanBarcode,
  Package,
  Layers,
  Sparkles,
  Percent,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  ChevronUp,
  X,
  BellRing,
} from "lucide-react";
import { CheckoutModal } from "@/components/pos/CheckoutModal";
import { ReceiptModal } from "@/components/pos/ReceiptModal";
import { IncomingOrdersModal } from "@/components/pos/IncomingOrdersModal";
import { toast } from "sonner";
import Link from "next/link";

export default function PosPage() {
  const { user, storeOwnerUid, shopProfile } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);

  const activeUid = storeOwnerUid || user?.uid;

  // Filter & Search states
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [hideOutOfStock, setHideOutOfStock] = useState<boolean>(false);

  // Cart state from Zustand
  const { 
    items: cart, 
    globalDiscount: cartDiscount, 
    setGlobalDiscount: setCartDiscount,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    setItems: setZustandItems
  } = useCartStore();
  
  const [showDiscountInput, setShowDiscountInput] = useState(false);
  const [mobileCartSheetOpen, setMobileCartSheetOpen] = useState(false);

  // Modals state
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);
  const [completedTransaction, setCompletedTransaction] = useState<Transaction | null>(null);

  // Incoming Digital Orders Radar (Real-time 100% In-App)
  const [incomingOrders, setIncomingOrders] = useState<IncomingOrder[]>([]);
  const [isOrdersModalOpen, setIsOrdersModalOpen] = useState(false);
  const [activeProcessingOrder, setActiveProcessingOrder] = useState<IncomingOrder | null>(null);
  const [knownOrderIds, setKnownOrderIds] = useState<Set<string>>(new Set());

  // Web Audio Chime Sound
  const playOrderChime = () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
      osc.frequency.setValueAtTime(880, ctx.currentTime + 0.12); // A5
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.45);
    } catch (e) {
      console.warn("Audio playback not permitted yet", e);
    }
  };

  // Subscribe to real-time incoming orders from QR Meja
  useEffect(() => {
    if (!activeUid) return;

    const unsub = subscribeIncomingOrders(activeUid, (orders) => {
      setIncomingOrders(orders);

      // Check if there is any new PENDING order
      const pendingOrders = orders.filter((o) => o.status === "PENDING");
      let hasNewOrder = false;

      pendingOrders.forEach((o) => {
        if (!knownOrderIds.has(o.id)) {
          hasNewOrder = true;
        }
      });

      if (hasNewOrder && knownOrderIds.size > 0) {
        playOrderChime();
        const latest = pendingOrders[0];
        toast.info(
          `🔔 Pesanan Masuk! ${latest?.tableNumber || "Meja Baru"} (${latest?.customerName})`,
          {
            duration: 6000,
            action: {
              label: "Buka Radar",
              onClick: () => setIsOrdersModalOpen(true),
            },
          }
        );
      }

      setKnownOrderIds(new Set(orders.map((o) => o.id)));
    });

    return () => unsub();
  }, [activeUid, knownOrderIds]);

  // Auto load order from URL query param (e.g. redirected from Kitchen Orders Page)
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const targetId = params.get("loadOrder");
    if (targetId && incomingOrders.length > 0 && products.length > 0) {
      const targetOrder = incomingOrders.find((o) => o.id === targetId);
      if (targetOrder && activeProcessingOrder?.id !== targetOrder.id) {
        handleLoadOrderToCart(targetOrder);
        setIsCheckoutOpen(true);
        window.history.replaceState({}, "", "/pos");
      }
    }
  }, [incomingOrders, products, activeProcessingOrder]);

  // Fetch initial products and categories
  const loadData = async () => {
    if (!activeUid) return;
    try {
      setLoading(true);
      const [prodList, catList, custList] = await Promise.all([
        getProducts(activeUid),
        getCategories(activeUid),
        getCustomers(activeUid),
      ]);
      setProducts(prodList);
      setCategories(catList);
      setCustomers(custList);
    } catch (err) {
      console.error("Error loading POS data:", err);
      toast.error("Gagal memuat data produk kasir.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [activeUid]);

  // Filtered products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchSearch =
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.sku && p.sku.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (p.barcode && p.barcode.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchCategory =
        selectedCategory === "all" || p.categoryId === selectedCategory;

      const matchAvailability =
        !hideOutOfStock || (p.isAvailable !== false && p.stock > 0);

      return matchSearch && matchCategory && matchAvailability;
    });
  }, [products, searchQuery, selectedCategory, hideOutOfStock]);

  // Cart Calculations
  const totalCartQty = useMemo(() => {
    return cart.reduce((acc, item) => acc + item.quantity, 0);
  }, [cart]);

  const subtotal = useMemo(() => {
    return cart.reduce((acc, item) => acc + item.subtotal, 0);
  }, [cart]);

  const taxRate = shopProfile?.taxPercentage || 0;
  const taxableAmount = Math.max(0, subtotal - cartDiscount);
  const taxAmount = (taxableAmount * taxRate) / 100;
  const totalAmount = taxableAmount + taxAmount;



  // Load incoming QR order into POS cart
  const handleLoadOrderToCart = async (order: IncomingOrder) => {
    const newCartItems: CartItem[] = [];

    for (const item of order.items) {
      const matchProd = products.find(
        (p) =>
          p.id === item.productId ||
          p.name.toLowerCase() === item.productName.toLowerCase()
      );

      const baseProduct: Product = matchProd || {
        id: item.productId,
        name: item.productName,
        sellingPrice: item.sellingPrice,
        costPrice: 0,
        stock: 9999,
        minStockAlert: 5,
        unit: "Pcs",
        categoryId: "general",
        sku: "QR",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      newCartItems.push({
        product: baseProduct,
        quantity: item.quantity,
        discount: 0,
        subtotal: item.quantity * baseProduct.sellingPrice,
        notes: item.notes,
      });
    }

    setZustandItems(newCartItems);
    setCartDiscount(0);
    setActiveProcessingOrder(order);

    if (activeUid) {
      try {
        await updateOrderStatus(activeUid, order.id, "COOKING");
      } catch (e) {
        console.warn("Failed updating order to COOKING:", e);
      }
    }

    toast.success(
      `✨ Pesanan ${order.tableNumber} (#${order.orderNumber}) berhasil dimuat ke kasir!`,
      { duration: 4000 }
    );
  };

  // Handle Checkout Process
  const handleProcessCheckout = async (trxData: Omit<Transaction, "id">) => {
    if (!activeUid) throw new Error("Sesi kasir tidak valid");
    const result = await createTransaction(activeUid, trxData);

    // Auto-complete the incoming order if it was loaded from radar
    if (activeProcessingOrder) {
      try {
        await updateOrderStatus(activeUid, activeProcessingOrder.id, "COMPLETED");
        setActiveProcessingOrder(null);
      } catch (err) {
        console.warn("Failed setting incoming order to COMPLETED:", err);
      }
    }

    // Auto-deduct raw materials from inventory!
    try {
      const lowStockAlerts = await deductRawMaterialsForTransaction(
        activeUid,
        trxData.items.map((it) => ({ productId: it.productId, quantity: it.quantity }))
      );

      if (lowStockAlerts.length > 0) {
        const names = lowStockAlerts
          .map((l) => `${l.materialName} (sisa ${l.remainingStock})`)
          .join(", ");
        toast.warning(`⚠️ Bahan Menipis: ${names}`, { duration: 5000 });
      }
    } catch (err) {
      console.warn("Auto-deduction non-blocking error:", err);
    }

    await loadData();
    clearCart();
    setMobileCartSheetOpen(false);
    return result;
  };

  // Cart Content Component (Reusable for Desktop Sidebar and Mobile Bottom Sheet)
  const CartContent = (
    <div className="flex flex-col h-full justify-between">
      {/* Cart Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 shrink-0">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
            <ShoppingCart className="h-4 w-4 sm:h-5 sm:w-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-slate-900 text-xs sm:text-sm">
              Keranjang Kasir
            </h3>
            <p className="text-[10px] sm:text-[11px] text-slate-500">
              {totalCartQty} item dipilih
            </p>
          </div>
        </div>

        {cart.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearCart}
            className="touch-press text-[11px] text-rose-600 hover:bg-rose-50 h-7 sm:h-8 px-2"
            title="Kosongkan Keranjang"
          >
            <RotateCcw className="h-3 w-3 mr-1" />
            Reset
          </Button>
        )}
      </div>

      {/* Cart Items List */}
      <div className="flex-1 overflow-y-auto py-2.5 space-y-2 pr-0.5 no-scrollbar max-h-[45vh] sm:max-h-none">
        {cart.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 text-center p-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 mb-2">
              <ShoppingCart className="h-6 w-6" />
            </div>
            <p className="text-xs sm:text-sm font-bold text-slate-700">
              Keranjang Kosong
            </p>
            <p className="text-[11px] text-slate-400 max-w-[200px] mt-0.5">
              Pilih produk di katalog untuk ditambahkan.
            </p>
          </div>
        ) : (
          cart.map((item) => (
            <div
              key={item.product.id}
              className="rounded-xl border border-slate-200/70 bg-slate-50/70 p-2.5 transition-all"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-bold text-slate-900 truncate">
                    {item.product.name}
                  </h4>
                  <p className="text-[10px] sm:text-[11px] font-semibold text-emerald-700">
                    {formatRupiah(item.product.sellingPrice)}
                  </p>
                </div>

                <button
                  onClick={() => removeFromCart(item.product.id)}
                  className="text-slate-400 hover:text-rose-600 transition-colors p-1"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>

              {/* Quantity Controls & Subtotal */}
              <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-200/50">
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => updateQuantity(item.product.id, -1)}
                    className="touch-press flex h-6 w-6 sm:h-7 sm:w-7 items-center justify-center rounded-lg border border-slate-300 bg-white text-slate-700 active:scale-95 text-xs font-bold"
                  >
                    <Minus className="h-3 w-3" />
                  </button>
                  <span className="w-7 text-center text-xs font-bold text-slate-900">
                    {item.quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => updateQuantity(item.product.id, 1)}
                    className="touch-press flex h-6 w-6 sm:h-7 sm:w-7 items-center justify-center rounded-lg border border-slate-300 bg-white text-slate-700 active:scale-95 text-xs font-bold"
                  >
                    <Plus className="h-3 w-3" />
                  </button>
                </div>

                <span className="text-xs font-black text-slate-900">
                  {formatRupiah(item.subtotal)}
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Cart Pricing Summary & Pay Button */}
      <div className="shrink-0 pt-2.5 border-t border-slate-200 space-y-2">
        <div className="space-y-1 text-xs">
          <div className="flex justify-between text-slate-500">
            <span>Subtotal</span>
            <span className="font-semibold text-slate-800">
              {formatRupiah(subtotal)}
            </span>
          </div>

          {/* Diskon Manual */}
          <div className="flex items-center justify-between text-slate-500">
            <button
              type="button"
              onClick={() => setShowDiscountInput(!showDiscountInput)}
              className="flex items-center gap-1 text-emerald-600 hover:underline font-medium text-[11px]"
            >
              <Percent className="h-3 w-3" />
              <span>{cartDiscount > 0 ? "Edit Diskon" : "+ Diskon"}</span>
            </button>
            {cartDiscount > 0 && (
              <span className="font-semibold text-emerald-600 text-xs">
                -{formatRupiah(cartDiscount)}
              </span>
            )}
          </div>

          {showDiscountInput && (
            <div className="flex items-center gap-2 pt-1 pb-1">
              <span className="text-[11px] text-slate-400">Rp</span>
              <Input
                type="number"
                min="0"
                placeholder="Nominal Diskon"
                value={cartDiscount || ""}
                onChange={(e) => setCartDiscount(Number(e.target.value) || 0)}
                className="h-8 text-xs bg-white"
              />
            </div>
          )}

          {/* Pajak PPN jika ada */}
          {taxRate > 0 && (
            <div className="flex justify-between text-slate-500">
              <span>PPN ({taxRate}%)</span>
              <span className="font-semibold text-slate-800">
                {formatRupiah(taxAmount)}
              </span>
            </div>
          )}

          <div className="flex justify-between text-sm sm:text-base font-black text-slate-900 pt-1.5 border-t border-slate-200">
            <span>Total Bayar</span>
            <span className="text-emerald-700 text-base sm:text-lg">
              {formatRupiah(totalAmount)}
            </span>
          </div>
        </div>

        {/* Pay Button */}
        <Button
          type="button"
          variant="default"
          disabled={cart.length === 0}
          onClick={() => {
            setMobileCartSheetOpen(false);
            setIsCheckoutOpen(true);
          }}
          className="touch-press w-full h-11 sm:h-12 rounded-xl text-xs sm:text-sm font-extrabold shadow-md bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center gap-2"
        >
          <Sparkles className="h-4 w-4" />
          <span>Bayar Sekarang ({formatRupiah(totalAmount)})</span>
        </Button>
      </div>
    </div>
  );

  return (
    <DashboardLayout>
      <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 lg:h-[calc(100vh-8rem)] pb-32 sm:pb-36 lg:pb-0">
        {/* LEFT COLUMN: Product Catalog & Fast Search */}
        <div className="flex-1 flex flex-col min-w-0 borderless-card p-3.5 sm:p-5 overflow-hidden">
          {/* Header Controls */}
          <div className="space-y-2.5 pb-3 border-b border-slate-100 shrink-0">
            <div className="flex gap-2 items-center justify-between">
              {/* Search Bar */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari produk / barcode..."
                  className="pl-9 h-10 bg-slate-50/80 border-slate-200/80 focus:bg-white text-xs rounded-xl"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>

              {/* Live Order Radar Button */}
              <Button
                type="button"
                onClick={() => setIsOrdersModalOpen(true)}
                variant={incomingOrders.some((o) => o.status === "PENDING") ? "default" : "outline"}
                size="sm"
                className={`touch-press h-10 px-3 gap-1.5 shrink-0 rounded-xl text-xs font-black transition-all ${
                  incomingOrders.some((o) => o.status === "PENDING")
                    ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-600/30 animate-pulse"
                    : "border-slate-200 text-slate-700 hover:bg-slate-100"
                }`}
              >
                <BellRing className="h-4 w-4" />
                <span className="hidden sm:inline">Pesanan Meja</span>
                {incomingOrders.filter((o) => o.status === "PENDING").length > 0 && (
                  <span className="bg-rose-500 text-white text-[10px] px-1.5 py-0.2 rounded-full font-black ml-0.5">
                    {incomingOrders.filter((o) => o.status === "PENDING").length}
                  </span>
                )}
              </Button>

              {/* Add Product Shortcut */}
              <Link href="/products">
                <Button variant="outline" size="sm" className="touch-press h-10 px-3 gap-1.5 shrink-0 rounded-xl text-xs font-bold">
                  <Plus className="h-3.5 w-3.5 text-emerald-600" />
                  <span className="hidden sm:inline">Tambah Produk</span>
                </Button>
              </Link>
            </div>

            {/* Category Filter Pills (Mobile Swipeable) */}
            <div className="pill-nav">
              <button
                type="button"
                onClick={() => setSelectedCategory("all")}
                className={`pill-nav-item touch-press ${
                  selectedCategory === "all"
                    ? "bg-slate-900 text-white shadow-xs"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                Semua ({products.length})
              </button>
              {categories.map((cat) => {
                const count = products.filter((p) => p.categoryId === cat.id).length;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`pill-nav-item touch-press ${
                      selectedCategory === cat.id
                        ? "bg-emerald-600 text-white shadow-xs"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {cat.name} ({count})
                  </button>
                );
              })}

              {/* Quick Filter: Sembunyikan Habis */}
              <button
                type="button"
                onClick={() => setHideOutOfStock(!hideOutOfStock)}
                className={`pill-nav-item touch-press transition-all shrink-0 ${
                  hideOutOfStock
                    ? "bg-amber-600 text-white shadow-xs font-bold"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {hideOutOfStock ? "✓ Sembunyikan Habis" : "Filter Habis"}
              </button>
            </div>
          </div>

          {/* Product Grid */}
          <div className="flex-1 overflow-y-auto pt-3 pr-0.5 no-scrollbar">
            {loading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-2.5 sm:gap-3">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-32 sm:h-36 rounded-2xl bg-slate-100 skeleton"
                  />
                ))}
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-56 text-center p-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 mb-2">
                  <Package className="h-6 w-6" />
                </div>
                <h4 className="font-bold text-slate-800 text-xs sm:text-sm">
                  {products.length === 0
                    ? "Belum Ada Produk"
                    : "Produk Tidak Ditemukan"}
                </h4>
                <p className="text-[11px] text-slate-500 max-w-xs mt-0.5 mb-3">
                  {products.length === 0
                    ? "Tambahkan produk pertama untuk mulai kasir."
                    : "Coba ubah kata kunci atau pilih kategori lain."}
                </p>
                {products.length === 0 && (
                  <Link href="/products">
                    <Button size="sm" className="touch-press gap-1.5 text-xs font-bold">
                      <Plus className="h-3.5 w-3.5" />
                      <span>Tambah Produk</span>
                    </Button>
                  </Link>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-2.5 sm:gap-3 pb-10 lg:pb-0">
                {filteredProducts.map((product) => {
                  const isAvailable = product.isAvailable !== false;
                  const isOutOfStock = product.stock <= 0 || !isAvailable;
                  const isLowStock =
                    isAvailable &&
                    product.stock > 0 &&
                    product.stock <= (product.minStockAlert || 5);
                  const cartItem = cart.find((i) => i.product.id === product.id);

                  return (
                    <div
                      key={product.id}
                      onClick={() => {
                        if (isOutOfStock) {
                          toast.error(
                            `"${product.name}" sedang ${
                              !isAvailable
                                ? "ditandai habis / tidak tersedia"
                                : "kehabisan stok (0)"
                            }.`
                          );
                          return;
                        }
                        addToCart(product);
                      }}
                      className={`touch-press group relative flex flex-col justify-between rounded-2xl p-3 transition-all text-left select-none border ${
                        isOutOfStock
                          ? "border-rose-200/70 bg-rose-50/25 opacity-60 cursor-not-allowed"
                          : "border-slate-200/60 bg-white/95 hover:border-emerald-500/40 shadow-2xs hover:shadow-sm cursor-pointer"
                      }`}
                    >
                      {/* Top Badges */}
                      <div className="flex items-start justify-between gap-1 mb-1.5">
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider truncate">
                          {product.categoryName || "Umum"}
                        </span>
                        {!isAvailable ? (
                          <span className="bg-rose-100 text-rose-800 text-[8px] font-extrabold px-1.5 py-0.5 rounded-md">
                            Habis
                          </span>
                        ) : product.stock <= 0 ? (
                          <span className="bg-rose-100 text-rose-800 text-[8px] font-extrabold px-1.5 py-0.5 rounded-md">
                            Stok 0
                          </span>
                        ) : isLowStock ? (
                          <span className="bg-amber-100 text-amber-900 text-[8px] font-extrabold px-1.5 py-0.5 rounded-md">
                            Sisa {product.stock}
                          </span>
                        ) : (
                          <span className="text-[9px] font-semibold text-slate-400">
                            Stok {product.stock}
                          </span>
                        )}
                      </div>

                      {/* Product Thumbnail & Name */}
                      <div className="flex gap-2.5 items-start mb-2">
                        <div className="relative shrink-0">
                          {product.imageUrl ? (
                            <img
                              src={product.imageUrl}
                              alt={product.name}
                              className={`w-11 h-11 sm:w-12 sm:h-12 rounded-xl object-cover border border-slate-100 bg-slate-50 ${
                                isOutOfStock ? "grayscale opacity-75" : ""
                              }`}
                              loading="lazy"
                            />
                          ) : (
                            <div className={`w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-slate-100/90 border border-slate-200/40 flex items-center justify-center text-slate-400 ${
                              isOutOfStock ? "opacity-60" : "group-hover:bg-emerald-50 group-hover:text-emerald-600"
                            } transition-colors`}>
                              <Package className="h-5 w-5" />
                            </div>
                          )}
                          {isOutOfStock && (
                            <span className="absolute -bottom-1 -right-1 bg-rose-600 text-white text-[7px] font-black px-1 rounded-sm shadow-xs">
                              HABIS
                            </span>
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <h4 className="text-xs sm:text-sm font-bold text-slate-900 line-clamp-2 leading-snug">
                            {product.name}
                          </h4>
                          {product.description && (
                            <p className="text-[10px] text-slate-400 line-clamp-1 mt-0.5 hidden sm:block">
                              {product.description}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Price & Cart Quantity Indicator */}
                      <div className="flex items-center justify-between pt-2 border-t border-slate-100/80">
                        <span className="text-xs sm:text-sm font-black text-emerald-800">
                          {formatRupiah(product.sellingPrice)}
                        </span>
                        {cartItem && (
                          <span className="flex h-5 w-5 sm:h-6 sm:w-6 items-center justify-center rounded-full bg-gradient-to-tr from-emerald-600 to-teal-500 text-[10px] sm:text-[11px] font-black text-white shadow-sm shadow-emerald-600/30 scale-105">
                            {cartItem.quantity}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: Desktop Cart Sidebar (hidden on mobile, uses bottom sheet instead) */}
        <div className="hidden lg:flex w-[360px] xl:w-[400px] flex-col shrink-0 borderless-card p-5 overflow-hidden">
          {CartContent}
        </div>
      </div>

      {/* ========================================================
       * MOBILE FLOATING CART BAR & BOTTOM SHEET
       * ======================================================== */}
      {cart.length > 0 && (
        <div className="lg:hidden fixed bottom-[calc(3.75rem+env(safe-area-inset-bottom)+0.625rem)] left-0 right-0 z-35 px-3 max-w-lg mx-auto pointer-events-auto">
          <div className="rounded-2xl bg-slate-950/95 text-white p-3 shadow-2xl flex items-center justify-between border border-slate-800/90 backdrop-blur-md">
            <div
              onClick={() => setMobileCartSheetOpen(true)}
              className="flex items-center gap-2.5 cursor-pointer flex-1"
            >
              <div className="relative">
                <div className="h-9 w-9 rounded-xl bg-emerald-500 text-slate-950 flex items-center justify-center font-black">
                  <ShoppingCart className="h-4 w-4" />
                </div>
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[9px] font-bold text-white">
                  {totalCartQty}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-medium block">
                  {totalCartQty} item • Ketuk rincian
                </span>
                <span className="text-sm font-black text-white">
                  {formatRupiah(totalAmount)}
                </span>
              </div>
            </div>

            <Button
              size="sm"
              onClick={() => setIsCheckoutOpen(true)}
              className="touch-press bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black text-xs h-9 px-3.5 rounded-xl shadow-xs"
            >
              <span>Bayar</span>
              <Sparkles className="h-3.5 w-3.5 ml-1" />
            </Button>
          </div>
        </div>
      )}

      {/* Mobile Cart Bottom Sheet Modal */}
      {mobileCartSheetOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex flex-col justify-end">
          <div className="bottom-sheet max-h-[85vh] flex flex-col">
            <div className="bottom-sheet-handle" onClick={() => setMobileCartSheetOpen(false)} />
            <div className="flex items-center justify-between mb-2">
              <span className="font-black text-sm text-slate-900">Rincian Keranjang Kasir</span>
              <button
                type="button"
                onClick={() => setMobileCartSheetOpen(false)}
                className="touch-press h-7 w-7 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
            <div className="flex-1 overflow-hidden">
              {CartContent}
            </div>
          </div>
        </div>
      )}

      {/* Checkout Modal */}
      {activeUid && (
        <CheckoutModal
          isOpen={isCheckoutOpen}
          onClose={() => setIsCheckoutOpen(false)}
          cart={cart}
          subtotal={subtotal}
          discount={cartDiscount}
          taxRate={taxRate}
          taxAmount={taxAmount}
          totalAmount={totalAmount}
          customers={customers}
          userId={activeUid}
          shopProfile={shopProfile}
          onProcessCheckout={handleProcessCheckout}
          onSuccess={(trx) => {
            setCompletedTransaction(trx);
            setIsReceiptOpen(true);
          }}
        />
      )}

      {/* Receipt Modal */}
      <ReceiptModal
        isOpen={isReceiptOpen}
        onClose={() => setIsReceiptOpen(false)}
        transaction={completedTransaction}
        shopProfile={shopProfile}
      />

      {/* Incoming Orders Modal (Live Radar) */}
      {activeUid && (
        <IncomingOrdersModal
          isOpen={isOrdersModalOpen}
          onClose={() => setIsOrdersModalOpen(false)}
          orders={incomingOrders}
          ownerUid={activeUid}
          onLoadOrderToCart={handleLoadOrderToCart}
        />
      )}
    </DashboardLayout>
  );
}
