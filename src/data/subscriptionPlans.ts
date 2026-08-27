import { SubscriptionPlanId, IndustryPack, SubscriptionTier } from "@/types";

export interface IndustryMeta {
  id: IndustryPack;
  name: string;
  shortName: string;
  tagline: string;
  icon: string; // Emoji
  color: string;
  accentBg: string;
  badgeBg: string;
  targetBusiness: string;
  accentColor: string; // Tailwind text color for branding
  ringColor: string;   // Tailwind ring color for selection
}

export interface DetailedPricingPlan {
  id: SubscriptionPlanId;
  industry: IndustryPack;
  tier: SubscriptionTier;
  billingCycle: "monthly" | "yearly" | "lifetime";
  name: string;
  badge?: string;
  badgeColor?: string;
  price: number;
  originalPrice?: number;
  periodLabel: string;
  durationDays: number;
  isPopular?: boolean;
  coreFeatures: string[];
  exclusiveFeatures: string[];
  allFeatures: string[];
  limitations?: string[];
}

export const INDUSTRY_METADATA: Record<IndustryPack, IndustryMeta> = {
  fnb: {
    id: "fnb",
    name: "Kuliner, Café & Resto",
    shortName: "Kuliner / F&B",
    tagline: "Khusus Warung Makan, Café, Bakery, Ghost Kitchen & Resto",
    icon: "🍜",
    color: "text-amber-600",
    accentBg: "bg-amber-500",
    badgeBg: "bg-amber-100 text-amber-900 border-amber-300",
    targetBusiness: "Kafe, Warteg, Resto, Angkringan, Kopi Susu, Bakery, Kedai Makanan",
    accentColor: "text-amber-700",
    ringColor: "ring-amber-500/20",
  },
  retail: {
    id: "retail",
    name: "Retail, Grosir & Toko Kelontong",
    shortName: "Retail / Toko",
    tagline: "Khusus Toko Kelontong, Minimarket, Fashion & Aksesoris",
    icon: "🛒",
    color: "text-blue-600",
    accentBg: "bg-blue-500",
    badgeBg: "bg-blue-100 text-blue-900 border-blue-300",
    targetBusiness: "Toko Sembako, Minimarket, Butik Fashion, Toko Bangunan, Toko Aksesoris",
    accentColor: "text-blue-700",
    ringColor: "ring-blue-500/20",
  },
  salon: {
    id: "salon",
    name: "Salon, Barbershop & Spa",
    shortName: "Salon & Barbershop",
    tagline: "Khusus Barbershop, Salon Kecantikan, Spa & Pangkas Rambut",
    icon: "✂️",
    color: "text-purple-600",
    accentBg: "bg-purple-500",
    badgeBg: "bg-purple-100 text-purple-900 border-purple-300",
    targetBusiness: "Barbershop, Salon Rambut, Nail Art, Klinik Kecantikan, Pijat Refleksi, Spa",
    accentColor: "text-purple-700",
    ringColor: "ring-purple-500/20",
  },
  laundry: {
    id: "laundry",
    name: "Laundry & Dry Cleaning",
    shortName: "Laundry & Kiloan",
    tagline: "Khusus Laundry Kiloan, Satuan, Sepatu, Karpet & Helm",
    icon: "👕",
    color: "text-teal-600",
    accentBg: "bg-teal-500",
    badgeBg: "bg-teal-100 text-teal-900 border-teal-300",
    targetBusiness: "Laundry Kiloan, Laundry Satuan, Cuci Sepatu, Cuci Karpet & Stroller",
    accentColor: "text-teal-700",
    ringColor: "ring-teal-500/20",
  },
  universal: {
    id: "universal",
    name: "Paket Universal POS",
    shortName: "Universal",
    tagline: "Dukungan all-in-one untuk segala jenis usaha",
    icon: "⚡",
    color: "text-emerald-600",
    accentBg: "bg-emerald-500",
    badgeBg: "bg-emerald-100 text-emerald-900 border-emerald-300",
    targetBusiness: "Segala jenis usaha mikro, kecil, dan menengah",
    accentColor: "text-emerald-700",
    ringColor: "ring-emerald-500/20",
  },
  coffeeshop: {
    id: "coffeeshop",
    name: "Coffee Shop & Cafe",
    shortName: "Coffee Shop",
    tagline: "Khusus Kedai Kopi, Boba, Minuman Kekinian & Dessert Bar",
    icon: "☕",
    color: "text-amber-800",
    accentBg: "bg-amber-700",
    badgeBg: "bg-amber-100 text-amber-900 border-amber-300",
    targetBusiness: "Kedai Kopi, Boba Tea, Minuman Kekinian, Dessert Bar, Es Krim",
    accentColor: "text-amber-900",
    ringColor: "ring-amber-700/20",
  },
};

// ===========================================================
// FITUR DASAR (CORE) — Ada di semua paket Basic & Pro
// ===========================================================
export const COMMON_CORE_FEATURES = [
  "Mesin Kasir POS Tanpa Batas Transaksi",
  "Katalog Produk, Varian & Multi-Harga",
  "Cetak Struk Thermal Bluetooth (58mm / 80mm)",
  "Struk Digital Online / WhatsApp Pelanggan",
  "Multi-Kasir Shift (Hingga 2 Akun Kasir)",
  "Dukungan Pembayaran: Tunai, Transfer & QRIS",
  "Cloud Backup Otomatis Real-time Firebase",
];

// ===========================================================
// FITUR UMUM PRO — Ada di semua paket Pro (semua industri)
// ===========================================================
export const COMMON_PRO_FEATURES = [
  "Semua Fitur Paket Basic",
  "Multi-Kasir Shift Tanpa Batas & Otorisasi Supervisor",
  "Laporan Laba Rugi Real-Time & Ekspor Excel / CSV",
  "Dashboard Analitik Omset & Grafik Penjualan",
  "Pencatatan Pengeluaran Operasional & Kas Kecil",
  "Buku Kasbon / Piutang & Tagihan WhatsApp 1-Klik",
  "Akses Penuh Seluruh Modul Akademi & Simulator BEP",
  "Prioritas Dukungan Teknis UMKM 24/7",
];

// ===========================================================
// MATRIKS FITUR EKSKLUSIF — Spesifik per Industri (dari SKILL.md)
// ===========================================================
export const INDUSTRY_FEATURES: Record<
  IndustryPack,
  { basic: string[]; pro: string[] }
> = {
  // ---- F&B: Kuliner, Café & Resto ----
  fnb: {
    basic: [
      "Kategori Menu: Makanan, Minuman & Topping",
      "Kalkulator HPP Standar (Bahan & Porsi per Menu)",
      "Catatan Pesanan Khusus (Pedas, Less Sugar, Tanpa MSG, dll)",
    ],
    pro: [
      "Kalkulator HPP Cerdas + 111+ Template Resep UMKM Siap Pakai",
      "Sistem Antrean Pesanan Dapur Live — Kitchen Display Real-Time (/orders)",
      "Layar Antrian Pelanggan / Kitchen Display Fullscreen (/display)",
      "Buku Menu Digital QR — Pelanggan Scan Langsung dari Meja (/menu)",
      "Manajemen Bahan Baku & Pengurangan Stok Otomatis per Porsi",
      "Diagnosa Margin Profit & Analisa Biaya Kemasan / Overhead",
    ],
  },

  // ---- Retail: Toko, Minimarket & Grosir ----
  retail: {
    basic: [
      "Input Barcode / SKU Manual & Cepat di Kasir",
      "Pengelompokan Kategori Barang (Sembako, Elektronik, Fashion, dll)",
      "Alert Stok Menipis Otomatis & Notifikasi Reorder",
    ],
    pro: [
      "Integrasi Barcode Scanner Kamera & Hardware (Scan via HP) (/barcode-scanner)",
      "Manajemen Multi-Kategori & Lokasi Rak Penyimpanan",
      "Laporan Produk Terlaris & Dead Stock per Periode",
      "Audit Opname Stok & Riwayat Penyesuaian Stok Manual",
      "Cetak Label Barcode & Label Harga Rak Otomatis",
      "Pencatatan Purchase Order ke Supplier & Update HPP Otomatis (/purchase-orders)",
    ],
  },

  // ---- Salon: Barbershop, Nail Art & Spa ----
  salon: {
    basic: [
      "Katalog Layanan & Paket Treatment Dasar (Potong, Creambath, Nail Art)",
      "Pencatatan Nama Kapster / Stylist di Setiap Transaksi",
      "Input Diskon Khusus Pelanggan per Layanan",
    ],
    pro: [
      "Kalkulator HPP Biaya Jasa, Produk Obat & Durasi Treatment",
      "Pencatatan Komisi Stylist / Kapster Otomatis per Layanan",
      "Database Riwayat Treatment & Preferensi Pelanggan Lengkap",
      "Manajemen Stok Bahan Kimia, Obat Rambut & Produk Skincare",
      "Laporan Performa Stylist & Jam Sibuk Salon per Periode",
      "Manajemen Jadwal Booking & Cegah Double Booking Kapster (/appointments)",
    ],
  },

  // ---- Laundry: Kiloan, Satuan & Cuci Sepatu ----
  laundry: {
    basic: [
      "Pilihan Satuan: Kiloan, Satuan & Meteran (Karpet/Gorden)",
      "Catatan Khusus Cucian (Noda, Parfum, Cara Lipat/Gantung)",
      "Format Struk Tanda Terima Cuci Lengkap (Nomor Tiket + Estimasi Selesai)",
    ],
    pro: [
      "Kalkulator Harga Kiloan & Status Tracking Order Real-Time (/weight-pricing)",
      "Status Tracking: Diterima → Dicuci → Disetrika → Selesai → Diambil",
      "Notifikasi WhatsApp Otomatis 'Cucian Selesai Siap Ambil' ke Pelanggan",
      "Manajemen Stok Bahan: Sabun, Softener, Hanger & Parfum Laundry",
      "Laporan Berat Kiloan Harian & Efisiensi Pemakaian Bahan Cuci",
      "Manajemen Jadwal Antar-Jemput Cucian (Pickup & Delivery) (/pickup-delivery)",
    ],
  },

  // ---- Coffee Shop: Kedai Kopi, Boba & Minuman Kekinian ----
  coffeeshop: {
    basic: [
      "Kategori Menu: Kopi, Non-Kopi, Boba & Snack",
      "Pilihan Level Minuman: Es (Normal/Less/No) & Gula (Normal/Less/No/Extra)",
      "Cetak Struk Khusus Label Cup dengan Detail Level Minuman",
    ],
    pro: [
      "Manajemen Resep & Kalkulasi HPP per Cup Otomatis (/recipes)",
      "Papan Antrean Barista Live — Update Status Real-Time (/barista-queue)",
      "Loyalty Program & Stamp Digital (10 Cup Gratis 1) (/loyalty)",
      "Buku Menu Digital QR Meja Pelanggan — Scan Langsung Order (/menu)",
      "Manajemen Stok Bahan Baku & Pengurangan Otomatis per Resep",
    ],
  },

  // ---- Universal: Semua Jenis Usaha ----
  universal: {
    basic: [
      "Fitur Kasir POS Universal (Cocok untuk Segala Jenis Usaha)",
      "Cetak Struk & Manajemen Produk Dasar",
      "Laporan Penjualan Harian Sederhana",
    ],
    pro: [
      "Kalkulator HPP Multi-Industri Lengkap (111+ Template)",
      "Laporan Laba Rugi Lengkap & Ekspor Excel / CSV",
      "Buku Kasbon / Piutang & Tagihan WhatsApp 1-Klik",
      "Seluruh Modul Akademi & Simulator BEP Bisnis",
      "Kalkulator Margin & Analisa Break-Even Point",
    ],
  },
};

// ===========================================================
// PRICING PLANS — 6 Industri × 4 SKU + Enterprise = 25 SKU
// ===========================================================
export const INDUSTRY_PRICING_PLANS: DetailedPricingPlan[] = [
  // ===================== F&B PACK =====================
  {
    id: "fnb-basic-monthly",
    industry: "fnb",
    tier: "basic",
    billingCycle: "monthly",
    name: "Kuliner Basic (Bulanan)",
    badge: "Mulai Usaha",
    badgeColor: "bg-amber-100 text-amber-900 border-amber-300",
    price: 39000,
    periodLabel: "per bulan",
    durationDays: 30,
    coreFeatures: COMMON_CORE_FEATURES,
    exclusiveFeatures: INDUSTRY_FEATURES.fnb.basic,
    allFeatures: [...COMMON_CORE_FEATURES, ...INDUSTRY_FEATURES.fnb.basic],
  },
  {
    id: "fnb-basic-yearly",
    industry: "fnb",
    tier: "basic",
    billingCycle: "yearly",
    name: "Kuliner Basic (Tahunan)",
    badge: "Hemat 47%",
    badgeColor: "bg-emerald-100 text-emerald-900 border-emerald-300",
    price: 249000,
    originalPrice: 468000,
    periodLabel: "per tahun (~Rp 20.750/bln)",
    durationDays: 365,
    coreFeatures: COMMON_CORE_FEATURES,
    exclusiveFeatures: INDUSTRY_FEATURES.fnb.basic,
    allFeatures: [...COMMON_CORE_FEATURES, ...INDUSTRY_FEATURES.fnb.basic],
  },
  {
    id: "fnb-pro-monthly",
    industry: "fnb",
    tier: "pro",
    billingCycle: "monthly",
    name: "Kuliner PRO (Bulanan)",
    badge: "Fitur Lengkap",
    badgeColor: "bg-amber-500 text-slate-950",
    price: 69000,
    periodLabel: "per bulan",
    durationDays: 30,
    coreFeatures: COMMON_PRO_FEATURES,
    exclusiveFeatures: INDUSTRY_FEATURES.fnb.pro,
    allFeatures: [...COMMON_PRO_FEATURES, ...INDUSTRY_FEATURES.fnb.pro],
  },
  {
    id: "fnb-pro-yearly",
    industry: "fnb",
    tier: "pro",
    billingCycle: "yearly",
    name: "Kuliner PRO (Tahunan)",
    badge: "Paling Populer ⭐",
    badgeColor: "bg-emerald-500 text-slate-950 font-bold",
    price: 449000,
    originalPrice: 828000,
    periodLabel: "per tahun (~Rp 37.400/bln)",
    durationDays: 365,
    isPopular: true,
    coreFeatures: COMMON_PRO_FEATURES,
    exclusiveFeatures: INDUSTRY_FEATURES.fnb.pro,
    allFeatures: [...COMMON_PRO_FEATURES, ...INDUSTRY_FEATURES.fnb.pro],
  },

  // ===================== RETAIL PACK =====================
  {
    id: "retail-basic-monthly",
    industry: "retail",
    tier: "basic",
    billingCycle: "monthly",
    name: "Retail Basic (Bulanan)",
    badge: "Toko Sembako",
    badgeColor: "bg-blue-100 text-blue-900 border-blue-300",
    price: 39000,
    periodLabel: "per bulan",
    durationDays: 30,
    coreFeatures: COMMON_CORE_FEATURES,
    exclusiveFeatures: INDUSTRY_FEATURES.retail.basic,
    allFeatures: [...COMMON_CORE_FEATURES, ...INDUSTRY_FEATURES.retail.basic],
  },
  {
    id: "retail-basic-yearly",
    industry: "retail",
    tier: "basic",
    billingCycle: "yearly",
    name: "Retail Basic (Tahunan)",
    badge: "Hemat 47%",
    badgeColor: "bg-emerald-100 text-emerald-900 border-emerald-300",
    price: 249000,
    originalPrice: 468000,
    periodLabel: "per tahun (~Rp 20.750/bln)",
    durationDays: 365,
    coreFeatures: COMMON_CORE_FEATURES,
    exclusiveFeatures: INDUSTRY_FEATURES.retail.basic,
    allFeatures: [...COMMON_CORE_FEATURES, ...INDUSTRY_FEATURES.retail.basic],
  },
  {
    id: "retail-pro-monthly",
    industry: "retail",
    tier: "pro",
    billingCycle: "monthly",
    name: "Retail PRO (Bulanan)",
    badge: "Minimarket",
    badgeColor: "bg-blue-500 text-white",
    price: 69000,
    periodLabel: "per bulan",
    durationDays: 30,
    coreFeatures: COMMON_PRO_FEATURES,
    exclusiveFeatures: INDUSTRY_FEATURES.retail.pro,
    allFeatures: [...COMMON_PRO_FEATURES, ...INDUSTRY_FEATURES.retail.pro],
  },
  {
    id: "retail-pro-yearly",
    industry: "retail",
    tier: "pro",
    billingCycle: "yearly",
    name: "Retail PRO (Tahunan)",
    badge: "Rekomendasi Retail ⭐",
    badgeColor: "bg-blue-600 text-white font-bold",
    price: 449000,
    originalPrice: 828000,
    periodLabel: "per tahun (~Rp 37.400/bln)",
    durationDays: 365,
    isPopular: true,
    coreFeatures: COMMON_PRO_FEATURES,
    exclusiveFeatures: INDUSTRY_FEATURES.retail.pro,
    allFeatures: [...COMMON_PRO_FEATURES, ...INDUSTRY_FEATURES.retail.pro],
  },

  // ===================== SALON PACK =====================
  {
    id: "salon-basic-monthly",
    industry: "salon",
    tier: "basic",
    billingCycle: "monthly",
    name: "Salon Basic (Bulanan)",
    badge: "Barbershop Solo",
    badgeColor: "bg-purple-100 text-purple-900 border-purple-300",
    price: 39000,
    periodLabel: "per bulan",
    durationDays: 30,
    coreFeatures: COMMON_CORE_FEATURES,
    exclusiveFeatures: INDUSTRY_FEATURES.salon.basic,
    allFeatures: [...COMMON_CORE_FEATURES, ...INDUSTRY_FEATURES.salon.basic],
  },
  {
    id: "salon-basic-yearly",
    industry: "salon",
    tier: "basic",
    billingCycle: "yearly",
    name: "Salon Basic (Tahunan)",
    badge: "Hemat 47%",
    badgeColor: "bg-emerald-100 text-emerald-900 border-emerald-300",
    price: 249000,
    originalPrice: 468000,
    periodLabel: "per tahun (~Rp 20.750/bln)",
    durationDays: 365,
    coreFeatures: COMMON_CORE_FEATURES,
    exclusiveFeatures: INDUSTRY_FEATURES.salon.basic,
    allFeatures: [...COMMON_CORE_FEATURES, ...INDUSTRY_FEATURES.salon.basic],
  },
  {
    id: "salon-pro-monthly",
    industry: "salon",
    tier: "pro",
    billingCycle: "monthly",
    name: "Salon PRO (Bulanan)",
    badge: "Studio & Spa",
    badgeColor: "bg-purple-500 text-white",
    price: 69000,
    periodLabel: "per bulan",
    durationDays: 30,
    coreFeatures: COMMON_PRO_FEATURES,
    exclusiveFeatures: INDUSTRY_FEATURES.salon.pro,
    allFeatures: [...COMMON_PRO_FEATURES, ...INDUSTRY_FEATURES.salon.pro],
  },
  {
    id: "salon-pro-yearly",
    industry: "salon",
    tier: "pro",
    billingCycle: "yearly",
    name: "Salon PRO (Tahunan)",
    badge: "Rekomendasi Salon ⭐",
    badgeColor: "bg-purple-600 text-white font-bold",
    price: 449000,
    originalPrice: 828000,
    periodLabel: "per tahun (~Rp 37.400/bln)",
    durationDays: 365,
    isPopular: true,
    coreFeatures: COMMON_PRO_FEATURES,
    exclusiveFeatures: INDUSTRY_FEATURES.salon.pro,
    allFeatures: [...COMMON_PRO_FEATURES, ...INDUSTRY_FEATURES.salon.pro],
  },

  // ===================== LAUNDRY PACK =====================
  {
    id: "laundry-basic-monthly",
    industry: "laundry",
    tier: "basic",
    billingCycle: "monthly",
    name: "Laundry Basic (Bulanan)",
    badge: "Laundry Kiloan",
    badgeColor: "bg-teal-100 text-teal-900 border-teal-300",
    price: 39000,
    periodLabel: "per bulan",
    durationDays: 30,
    coreFeatures: COMMON_CORE_FEATURES,
    exclusiveFeatures: INDUSTRY_FEATURES.laundry.basic,
    allFeatures: [...COMMON_CORE_FEATURES, ...INDUSTRY_FEATURES.laundry.basic],
  },
  {
    id: "laundry-basic-yearly",
    industry: "laundry",
    tier: "basic",
    billingCycle: "yearly",
    name: "Laundry Basic (Tahunan)",
    badge: "Hemat 47%",
    badgeColor: "bg-emerald-100 text-emerald-900 border-emerald-300",
    price: 249000,
    originalPrice: 468000,
    periodLabel: "per tahun (~Rp 20.750/bln)",
    durationDays: 365,
    coreFeatures: COMMON_CORE_FEATURES,
    exclusiveFeatures: INDUSTRY_FEATURES.laundry.basic,
    allFeatures: [...COMMON_CORE_FEATURES, ...INDUSTRY_FEATURES.laundry.basic],
  },
  {
    id: "laundry-pro-monthly",
    industry: "laundry",
    tier: "pro",
    billingCycle: "monthly",
    name: "Laundry PRO (Bulanan)",
    badge: "Laundry Modern",
    badgeColor: "bg-teal-500 text-white",
    price: 69000,
    periodLabel: "per bulan",
    durationDays: 30,
    coreFeatures: COMMON_PRO_FEATURES,
    exclusiveFeatures: INDUSTRY_FEATURES.laundry.pro,
    allFeatures: [...COMMON_PRO_FEATURES, ...INDUSTRY_FEATURES.laundry.pro],
  },
  {
    id: "laundry-pro-yearly",
    industry: "laundry",
    tier: "pro",
    billingCycle: "yearly",
    name: "Laundry PRO (Tahunan)",
    badge: "Rekomendasi Laundry ⭐",
    badgeColor: "bg-teal-600 text-white font-bold",
    price: 449000,
    originalPrice: 828000,
    periodLabel: "per tahun (~Rp 37.400/bln)",
    durationDays: 365,
    isPopular: true,
    coreFeatures: COMMON_PRO_FEATURES,
    exclusiveFeatures: INDUSTRY_FEATURES.laundry.pro,
    allFeatures: [...COMMON_PRO_FEATURES, ...INDUSTRY_FEATURES.laundry.pro],
  },

  // ===================== COFFEE SHOP PACK =====================
  {
    id: "coffeeshop-basic-monthly",
    industry: "coffeeshop",
    tier: "basic",
    billingCycle: "monthly",
    name: "Coffee Shop Basic (Bulanan)",
    badge: "Kedai Kopi",
    badgeColor: "bg-amber-100 text-amber-900 border-amber-300",
    price: 39000,
    periodLabel: "per bulan",
    durationDays: 30,
    coreFeatures: COMMON_CORE_FEATURES,
    exclusiveFeatures: INDUSTRY_FEATURES.coffeeshop.basic,
    allFeatures: [...COMMON_CORE_FEATURES, ...INDUSTRY_FEATURES.coffeeshop.basic],
  },
  {
    id: "coffeeshop-basic-yearly",
    industry: "coffeeshop",
    tier: "basic",
    billingCycle: "yearly",
    name: "Coffee Shop Basic (Tahunan)",
    badge: "Hemat 47%",
    badgeColor: "bg-emerald-100 text-emerald-900 border-emerald-300",
    price: 249000,
    originalPrice: 468000,
    periodLabel: "per tahun (~Rp 20.750/bln)",
    durationDays: 365,
    coreFeatures: COMMON_CORE_FEATURES,
    exclusiveFeatures: INDUSTRY_FEATURES.coffeeshop.basic,
    allFeatures: [...COMMON_CORE_FEATURES, ...INDUSTRY_FEATURES.coffeeshop.basic],
  },
  {
    id: "coffeeshop-pro-monthly",
    industry: "coffeeshop",
    tier: "pro",
    billingCycle: "monthly",
    name: "Coffee Shop PRO (Bulanan)",
    badge: "Barista Modern",
    badgeColor: "bg-amber-700 text-white",
    price: 69000,
    periodLabel: "per bulan",
    durationDays: 30,
    coreFeatures: COMMON_PRO_FEATURES,
    exclusiveFeatures: INDUSTRY_FEATURES.coffeeshop.pro,
    allFeatures: [...COMMON_PRO_FEATURES, ...INDUSTRY_FEATURES.coffeeshop.pro],
  },
  {
    id: "coffeeshop-pro-yearly",
    industry: "coffeeshop",
    tier: "pro",
    billingCycle: "yearly",
    name: "Coffee Shop PRO (Tahunan)",
    badge: "Rekomendasi Coffee Shop ⭐",
    badgeColor: "bg-amber-800 text-white font-bold",
    price: 449000,
    originalPrice: 828000,
    periodLabel: "per tahun (~Rp 37.400/bln)",
    durationDays: 365,
    isPopular: true,
    coreFeatures: COMMON_PRO_FEATURES,
    exclusiveFeatures: INDUSTRY_FEATURES.coffeeshop.pro,
    allFeatures: [...COMMON_PRO_FEATURES, ...INDUSTRY_FEATURES.coffeeshop.pro],
  },

  // ===================== UNIVERSAL PACK =====================
  {
    id: "universal-basic-monthly",
    industry: "universal",
    tier: "basic",
    billingCycle: "monthly",
    name: "Universal Basic (Bulanan)",
    badge: "Semua Usaha",
    badgeColor: "bg-emerald-100 text-emerald-900 border-emerald-300",
    price: 39000,
    periodLabel: "per bulan",
    durationDays: 30,
    coreFeatures: COMMON_CORE_FEATURES,
    exclusiveFeatures: INDUSTRY_FEATURES.universal.basic,
    allFeatures: [...COMMON_CORE_FEATURES, ...INDUSTRY_FEATURES.universal.basic],
  },
  {
    id: "universal-basic-yearly",
    industry: "universal",
    tier: "basic",
    billingCycle: "yearly",
    name: "Universal Basic (Tahunan)",
    badge: "Hemat 47%",
    badgeColor: "bg-emerald-100 text-emerald-900 border-emerald-300",
    price: 249000,
    originalPrice: 468000,
    periodLabel: "per tahun (~Rp 20.750/bln)",
    durationDays: 365,
    coreFeatures: COMMON_CORE_FEATURES,
    exclusiveFeatures: INDUSTRY_FEATURES.universal.basic,
    allFeatures: [...COMMON_CORE_FEATURES, ...INDUSTRY_FEATURES.universal.basic],
  },
  {
    id: "universal-pro-monthly",
    industry: "universal",
    tier: "pro",
    billingCycle: "monthly",
    name: "Universal PRO (Bulanan)",
    badge: "Fitur Lengkap",
    badgeColor: "bg-emerald-500 text-white",
    price: 69000,
    periodLabel: "per bulan",
    durationDays: 30,
    coreFeatures: COMMON_PRO_FEATURES,
    exclusiveFeatures: INDUSTRY_FEATURES.universal.pro,
    allFeatures: [...COMMON_PRO_FEATURES, ...INDUSTRY_FEATURES.universal.pro],
  },
  {
    id: "universal-pro-yearly",
    industry: "universal",
    tier: "pro",
    billingCycle: "yearly",
    name: "Universal PRO (Tahunan)",
    badge: "Paling Populer ⭐",
    badgeColor: "bg-emerald-600 text-white font-bold",
    price: 449000,
    originalPrice: 828000,
    periodLabel: "per tahun (~Rp 37.400/bln)",
    durationDays: 365,
    isPopular: true,
    coreFeatures: COMMON_PRO_FEATURES,
    exclusiveFeatures: INDUSTRY_FEATURES.universal.pro,
    allFeatures: [...COMMON_PRO_FEATURES, ...INDUSTRY_FEATURES.universal.pro],
  },

  // ===================== ENTERPRISE WHITELABEL =====================
  {
    id: "enterprise-yearly",
    industry: "universal",
    tier: "enterprise",
    billingCycle: "yearly",
    name: "Enterprise Whitelabel (Tahunan)",
    badge: "Whitelabel & Multi-Cabang",
    badgeColor: "bg-amber-400 text-slate-950 font-black",
    price: 2500000,
    periodLabel: "per tahun (Kustomisasi Penuh)",
    durationDays: 365,
    coreFeatures: COMMON_PRO_FEATURES,
    exclusiveFeatures: [
      "Whitelabeling Penuh (Logo, Nama & Domain Kustom)",
      "Multi-Outlet & Multi-Cabang Tersentralisasi",
      "Kustomisasi Template Struk & Laporan Khusus",
      "Dedicated Technical Account Manager & Onboarding Tim",
      "Akses API Integrasi & Backup Database Dedicated",
    ],
    allFeatures: [
      ...COMMON_PRO_FEATURES,
      "Whitelabeling Penuh (Logo, Nama & Domain Kustom)",
      "Multi-Outlet & Multi-Cabang Tersentralisasi",
      "Kustomisasi Template Struk & Laporan Khusus",
      "Dedicated Technical Account Manager & Onboarding Tim",
      "Akses API Integrasi & Backup Database Dedicated",
    ],
  },
];

// Helper: Ambil seluruh plan untuk industri tertentu
export function getPlansByIndustry(industry: IndustryPack): DetailedPricingPlan[] {
  return INDUSTRY_PRICING_PLANS.filter(
    (p) => p.industry === industry || p.tier === "enterprise"
  );
}

// Helper: Cari detail plan berdasarkan planId
export function getPlanDetails(planId: SubscriptionPlanId): DetailedPricingPlan | undefined {
  const found = INDUSTRY_PRICING_PLANS.find((p) => p.id === planId);
  if (found) return found;

  // Fallback untuk legacy ID
  if (planId === "monthly") return INDUSTRY_PRICING_PLANS.find((p) => p.id === "fnb-pro-monthly");
  if (planId === "yearly") return INDUSTRY_PRICING_PLANS.find((p) => p.id === "fnb-pro-yearly");
  if (planId === "lifetime") return INDUSTRY_PRICING_PLANS.find((p) => p.id === "enterprise-yearly");
  return undefined;
}

// Legacy Compatible PricingPlan interface
export interface PricingPlan {
  id: SubscriptionPlanId;
  name: string;
  badge?: string;
  badgeColor?: string;
  price: number;
  originalPrice?: number;
  periodLabel: string;
  durationDays: number;
  isPopular?: boolean;
  features: string[];
}

// Backward-compatible array for existing imports
export const SUBSCRIPTION_PLANS: PricingPlan[] = [
  {
    id: "fnb-pro-monthly",
    name: "Paket Bulanan (PRO)",
    price: 69000,
    periodLabel: "per bulan",
    durationDays: 30,
    features: [
      "Mesin Kasir POS Tanpa Batas Transaksi",
      "Kalkulator HPP & Big Data 111+ Resep UMKM",
      "Pencatatan Piutang & Tagihan WhatsApp 1-Klik",
      "Laporan Keuangan & Laba Rugi Otomatis",
      "Multi-Kasir Shift Tanpa Batas",
      "Pencetakan Struk Bluetooth 58mm / 80mm",
      "Backup Cloud Firebase Real-time",
    ],
  },
  {
    id: "fnb-pro-yearly",
    name: "Paket Tahunan (Hemat 46%)",
    badge: "Paling Populer",
    badgeColor: "bg-emerald-500 text-slate-950",
    price: 449000,
    originalPrice: 828000,
    periodLabel: "per tahun (~Rp 37rb/bln)",
    durationDays: 365,
    isPopular: true,
    features: [
      "Semua Fitur Paket Bulanan PRO",
      "Hemat 46% Dibandingkan Bayar Bulanan",
      "Prioritas Dukungan Teknis UMKM",
      "Akses Penuh Seluruh Modul Akademi & Playbook",
      "Simulator BEP & Diagnosa Kesehatan Finansial",
      "Ekspor Laporan Keuangan ke Excel / CSV",
      "Update Fitur Baru Selama 1 Tahun Penuh",
    ],
  },
  {
    id: "enterprise-yearly",
    name: "Paket Enterprise Whitelabel",
    badge: "Investasi Bisnis",
    badgeColor: "bg-amber-400 text-slate-950",
    price: 2500000,
    periodLabel: "per tahun (Whitelabel & Multi-Cabang)",
    durationDays: 365,
    features: [
      "Whitelabeling Kustom Branding Toko",
      "Bebas Tambah Toko & Cabang Multi-Outlet",
      "Semua Fitur PRO & Seluruh Resep HPP",
      "Layanan Prioritas & Konsultasi Langsung",
      "Garansi Update Selamanya",
    ],
  },
];
