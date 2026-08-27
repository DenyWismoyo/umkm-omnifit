import { UserRole, SubscriptionTier, IndustryPack } from "@/types";

export interface RoutePermissionRule {
  isPublic?: boolean;
  requiresAuth?: boolean;
  allowedRoles?: UserRole[];
  allowedTiers?: SubscriptionTier[]; // 'basic' | 'pro' | 'enterprise'
  allowedIndustries?: IndustryPack[]; // e.g. ['fnb']
  /**
   * Jika true, rute ini boleh diakses oleh user dalam masa trial aktif (30 hari)
   * tanpa harus upgrade tier — namun industry check tetap berlaku.
   * Default: undefined (ikuti aturan tier normal)
   */
  trialAllowed?: boolean;
  featureName?: string;
  featureDescription?: string;
}

export const PUBLIC_ROUTES = [
  "/login",
  "/pricing",
  "/upgrade",
  "/menu",
  "/display",
  "/checkout",
  "/api/auth/session",
  "/api/payment/webhook",
];

export const ROUTE_PERMISSIONS: Record<string, RoutePermissionRule> = {
  // Public Landing / Auth / Customer views
  "/login": { isPublic: true },
  "/pricing": { isPublic: true },
  "/upgrade": { isPublic: true },
  "/menu": { isPublic: true },
  "/display": { isPublic: true },
  "/checkout": { isPublic: true },

  // Core POS & Produk (Tersedia untuk semua paket: Basic, Pro, Enterprise & Trial)
  "/pos": {
    requiresAuth: true,
    allowedRoles: ["owner", "supervisor", "cashier"],
    allowedTiers: ["basic", "pro", "enterprise"],
    featureName: "Mesin Kasir (POS)",
    featureDescription: "Transaksi kasir, struk belanja, dan pembayaran multi-metode",
  },
  "/products": {
    requiresAuth: true,
    allowedRoles: ["owner", "supervisor", "cashier"],
    allowedTiers: ["basic", "pro", "enterprise"],
    featureName: "Katalog Produk & Stok",
    featureDescription: "Daftar produk, barcode SKU, dan manajemen stok fisik",
  },

  // Fitur Pro Umum (Semua Industri dengan Tier PRO / Enterprise / Trial)
  "/dashboard": {
    requiresAuth: true,
    allowedRoles: ["owner", "supervisor"],
    allowedTiers: ["pro", "enterprise"],
    trialAllowed: true,
    featureName: "Dashboard & Analitik Bisnis",
    featureDescription: "Ringkasan omset, grafik penjualan, dan performa kasir harian",
  },
  "/reports": {
    requiresAuth: true,
    allowedRoles: ["owner"],
    allowedTiers: ["pro", "enterprise"],
    trialAllowed: true,
    featureName: "Laporan Laba/Rugi & Keuangan",
    featureDescription: "Laporan margin kotor, laba bersih, dan ekspor data ke Excel/CSV",
  },
  "/expenses": {
    requiresAuth: true,
    allowedRoles: ["owner"],
    allowedTiers: ["pro", "enterprise"],
    trialAllowed: true,
    featureName: "Pencatatan Pengeluaran",
    featureDescription: "Catat biaya operasional, sewa, gaji, dan belanja utilitas",
  },
  "/debts": {
    requiresAuth: true,
    allowedRoles: ["owner", "supervisor", "cashier"],
    allowedTiers: ["pro", "enterprise"],
    trialAllowed: true,
    featureName: "Buku Pelanggan & Kasbon",
    featureDescription: "Catatan piutang pelanggan dan kirim tagihan WhatsApp otomatis",
  },
  "/academy": {
    requiresAuth: true,
    allowedRoles: ["owner", "supervisor"],
    allowedTiers: ["pro", "enterprise"],
    trialAllowed: true,
    featureName: "Akademi UMKM & Simulator BEP",
    featureDescription: "Modul edukasi bisnis, kalkulator BEP, dan playbook strategi UMKM",
  },
  "/settings": {
    requiresAuth: true,
    allowedRoles: ["owner"],
    allowedTiers: ["basic", "pro", "enterprise"], // Settings basic config always accessible to owner
    featureName: "Pengaturan Toko & QR",
    featureDescription: "Profil toko, QRIS statis, struk thermal, dan manajemen kasir",
  },

  // Fitur Spesifik Industri (Hanya untuk Industri Tertentu Tier PRO / Enterprise / Trial)
  "/orders": {
    requiresAuth: true,
    allowedRoles: ["owner", "supervisor", "cashier"],
    allowedTiers: ["pro", "enterprise"],
    allowedIndustries: ["fnb", "universal"],
    trialAllowed: true,
    featureName: "Antrean Pesanan Dapur Live",
    featureDescription: "Sistem tiket pesanan meja/bungkus real-time untuk dapur & barista",
  },
  "/tables": {
    requiresAuth: true,
    allowedRoles: ["owner", "supervisor", "cashier"],
    allowedTiers: ["pro", "enterprise"],
    allowedIndustries: ["fnb", "coffeeshop", "universal"],
    trialAllowed: true,
    featureName: "Manajemen Meja",
    featureDescription: "Denah meja real-time, status keterisian meja, dan integrasi pesanan dine-in",
  },
  "/inventory": {
    requiresAuth: true,
    allowedRoles: ["owner", "supervisor"],
    allowedTiers: ["pro", "enterprise"],
    allowedIndustries: ["fnb", "coffeeshop", "retail", "laundry", "universal"],
    trialAllowed: true,
    featureName: "Stok Bahan Baku & Barang",
    featureDescription: "Pengurangan otomatis stok bahan baku resep dan pelacakan inventaris",
  },
  "/hpp": {
    requiresAuth: true,
    allowedRoles: ["owner"], // Hanya owner yang bisa melihat & edit HPP
    allowedTiers: ["pro", "enterprise"],
    allowedIndustries: ["fnb", "coffeeshop", "salon", "laundry", "universal"],
    trialAllowed: true,
    featureName: "Kalkulator HPP",
    featureDescription:
      "Hitung modal bahan baku secara otomatis untuk penentuan harga jual yang akurat.",
  },

  // ----------------------------------------------------------------------
  // COFFEE SHOP EXCLUSIVE
  // ----------------------------------------------------------------------
  "/barista-queue": {
    requiresAuth: true,
    allowedRoles: ["owner", "supervisor", "cashier"],
    allowedTiers: ["pro", "enterprise"],
    allowedIndustries: ["coffeeshop"],
    trialAllowed: true,
    featureName: "Antrian Barista",
    featureDescription: "Sistem antrian minuman real-time khusus untuk area bar/dapur minuman.",
  },
  "/recipes": {
    requiresAuth: true,
    allowedRoles: ["owner", "supervisor"],
    allowedTiers: ["pro", "enterprise"],
    allowedIndustries: ["coffeeshop"],
    trialAllowed: true,
    featureName: "Resep Minuman",
    featureDescription: "Manajemen takaran resep dan HPP per-cup minuman.",
  },
  "/loyalty": {
    requiresAuth: true,
    allowedRoles: ["owner", "supervisor", "cashier"],
    allowedTiers: ["pro", "enterprise"],
    allowedIndustries: ["coffeeshop"],
    trialAllowed: true,
    featureName: "Loyalty & Stamp",
    featureDescription: "Program kartu stempel digital pelanggan setia.",
  },

  // ----------------------------------------------------------------------
  // LAUNDRY EXCLUSIVE
  // ----------------------------------------------------------------------
  "/laundry-queue": {
    requiresAuth: true,
    allowedRoles: ["owner", "supervisor", "cashier"],
    allowedTiers: ["pro", "enterprise"],
    allowedIndustries: ["laundry"],
    trialAllowed: true,
    featureName: "Antrean Laundry",
    featureDescription: "Manajemen proses cuci, setrika, hingga selesai.",
  },
  "/weight-pricing": {
    requiresAuth: true,
    allowedRoles: ["owner", "supervisor", "cashier"],
    allowedTiers: ["pro", "enterprise"],
    allowedIndustries: ["laundry"],
    trialAllowed: true,
    featureName: "Kalkulator Timbangan",
    featureDescription: "Sistem hitung harga otomatis berbasis timbangan cerdas.",
  },
  "/pickup-delivery": {
    requiresAuth: true,
    allowedRoles: ["owner", "supervisor"],
    allowedTiers: ["pro", "enterprise"],
    allowedIndustries: ["laundry"],
    trialAllowed: true,
    featureName: "Antar Jemput (Delivery)",
    featureDescription: "Manajemen jadwal antar-jemput dan kurir.",
  },

  // ----------------------------------------------------------------------
  // RETAIL EXCLUSIVE
  // ----------------------------------------------------------------------
  "/purchase-orders": {
    requiresAuth: true,
    allowedRoles: ["owner", "supervisor"],
    allowedTiers: ["pro", "enterprise"],
    allowedIndustries: ["retail"],
    trialAllowed: true,
    featureName: "Purchase Orders (PO)",
    featureDescription: "Manajemen order barang ke supplier atau distributor.",
  },
  "/barcode-scanner": {
    requiresAuth: true,
    allowedRoles: ["owner", "supervisor", "cashier"],
    allowedTiers: ["basic", "pro", "enterprise"],
    allowedIndustries: ["retail"],
    trialAllowed: true, // Tersedia di trial meski basic
    featureName: "Barcode Scanner",
    featureDescription: "Pindai produk menggunakan barcode fisik.",
  },

  // ----------------------------------------------------------------------
  // SALON EXCLUSIVE
  // ----------------------------------------------------------------------
  "/appointments": {
    requiresAuth: true,
    allowedRoles: ["owner", "supervisor", "cashier"],
    allowedTiers: ["pro", "enterprise"],
    allowedIndustries: ["salon"],
    trialAllowed: true,
    featureName: "Jadwal Booking",
    featureDescription: "Manajemen janji temu pelanggan dengan kapster.",
  },
  "/stylists": {
    requiresAuth: true,
    allowedRoles: ["owner"],
    allowedTiers: ["pro", "enterprise"],
    allowedIndustries: ["salon"],
    trialAllowed: true,
    featureName: "Manajemen Kapster",
    featureDescription: "Atur jadwal kerja dan komisi karyawan kapster/stylist.",
  },
  "/services": {
    requiresAuth: true,
    allowedRoles: ["owner", "supervisor", "cashier"],
    allowedTiers: ["basic", "pro", "enterprise"],
    allowedIndustries: ["salon"],
    featureName: "Katalog Servis",
    featureDescription: "Daftar layanan jasa perawatan yang ditawarkan.",
  },
};

/**
 * Helper: Cek apakah sebuah URL path merupakan public route
 */
export function isPublicPath(pathname: string): boolean {
  if (pathname === "/" || pathname === "") return true;
  return PUBLIC_ROUTES.some((route) => pathname === route || pathname.startsWith(`${route}/`));
}

/**
 * Helper: Ambil aturan izin rute berdasarkan pathname
 */
export function getRoutePermission(pathname: string): RoutePermissionRule | null {
  // Cek exact match
  if (ROUTE_PERMISSIONS[pathname]) {
    return ROUTE_PERMISSIONS[pathname];
  }

  // Cek prefix match (misal /hpp/edit, /settings/kasir, dll)
  const matchedKey = Object.keys(ROUTE_PERMISSIONS).find(
    (key) => key !== "/" && pathname.startsWith(key)
  );

  return matchedKey ? ROUTE_PERMISSIONS[matchedKey] : null;
}

export interface AccessCheckParams {
  pathname: string;
  role?: UserRole | string | null;
  tier?: SubscriptionTier | string | null;
  industry?: IndustryPack | string | null;
  isTrial?: boolean;
  isActiveSubscription?: boolean;
}

export interface AccessCheckResult {
  allowed: boolean;
  reason?: "unauthenticated" | "role_unauthorized" | "upgrade_required" | "industry_mismatch";
  featureName?: string;
  featureDescription?: string;
  redirectUrl?: string;
}

/**
 * Fungsi Utama: Evaluasi Hak Akses Rute untuk Server (proxy.ts) dan Client UI
 *
 * Trial Policy (30 Hari):
 * - User trial mendapat akses PRO penuh untuk industri yang dipilih saat onboarding.
 * - Industry check TETAP berlaku — user laundry tidak bisa akses menu coffeeshop saat trial.
 * - Setelah trial expire (isTrial = false), akses kembali ke tier normal.
 */
export function checkRouteAccess({
  pathname,
  role = "owner",
  tier = "basic",
  industry = "fnb",
  isTrial = false,
  _isActiveSubscription = true,
}: AccessCheckParams & { _isActiveSubscription?: boolean }): AccessCheckResult {
  if (isPublicPath(pathname)) {
    return { allowed: true };
  }

  const rule = getRoutePermission(pathname);
  if (!rule) {
    // Rute internal lainnya yang tidak terdaftar default ke allow jika authenticated
    return { allowed: true };
  }

  // 1. Cek Role Access
  const effectiveRole = (role as UserRole) || "owner";
  if (rule.allowedRoles && !rule.allowedRoles.includes(effectiveRole)) {
    return {
      allowed: false,
      reason: "role_unauthorized",
      featureName: rule.featureName,
      featureDescription: rule.featureDescription,
      redirectUrl: effectiveRole === "cashier" ? "/pos" : "/dashboard",
    };
  }

  const effectiveIndustry: IndustryPack = (industry as IndustryPack) || "fnb";

  // 2. Trial aktif: bypass tier check, tapi industry check TETAP berlaku
  if (isTrial && rule.trialAllowed !== false) {
    if (rule.allowedIndustries && !rule.allowedIndustries.includes(effectiveIndustry)) {
      const upgradeUrl = `/upgrade?feature=${encodeURIComponent(rule.featureName || "Fitur Industri")}&from=${encodeURIComponent(pathname)}&industry=${effectiveIndustry}&reason=industry_mismatch`;
      return {
        allowed: false,
        reason: "industry_mismatch",
        featureName: rule.featureName,
        featureDescription: rule.featureDescription,
        redirectUrl: upgradeUrl,
      };
    }
    return { allowed: true }; // Trial: lolos semua check kecuali industry
  }

  // 3. Evaluasi Hak Tier untuk non-trial user
  const effectiveTier: SubscriptionTier =
    tier === "enterprise" ? "enterprise" : (tier as SubscriptionTier) || "basic";

  // Cek Tier Permission
  if (rule.allowedTiers && !rule.allowedTiers.includes(effectiveTier)) {
    const upgradeUrl = `/upgrade?feature=${encodeURIComponent(rule.featureName || "Fitur PRO")}&from=${encodeURIComponent(pathname)}&reason=upgrade_required`;
    return {
      allowed: false,
      reason: "upgrade_required",
      featureName: rule.featureName,
      featureDescription: rule.featureDescription,
      redirectUrl: upgradeUrl,
    };
  }

  // 4. Cek Industry Permission (kecuali user Enterprise)
  if (effectiveTier !== "enterprise" && rule.allowedIndustries) {
    if (!rule.allowedIndustries.includes(effectiveIndustry)) {
      const upgradeUrl = `/upgrade?feature=${encodeURIComponent(rule.featureName || "Fitur Industri")}&from=${encodeURIComponent(pathname)}&industry=${effectiveIndustry}&reason=industry_mismatch`;
      return {
        allowed: false,
        reason: "industry_mismatch",
        featureName: rule.featureName,
        featureDescription: rule.featureDescription,
        redirectUrl: upgradeUrl,
      };
    }
  }

  return { allowed: true };
}
