import { LayoutDashboard, ShoppingCart, BellRing, Calculator, PackageCheck, Boxes, TrendingDown, Users, FileBarChart2, Settings, GraduationCap, Calendar, Scissors, Sparkles, Scale, Truck } from "lucide-react";
import { IndustryPack } from "@/types";

export interface NavItemDef {
  href: string;
  title: string;
  icon: any; // LucideIcon
  badge: string | null;
  roles: string[];
}

export interface NavSection {
  section: string;
  items: string[];
}

export const NAV_ITEM_REGISTRY: Record<string, NavItemDef> = {
  // --- CORE ROUTES ---
  dashboard: { href: "/dashboard", title: "Dashboard", icon: LayoutDashboard, badge: null, roles: ["owner", "supervisor"] },
  pos: { href: "/pos", title: "Mesin Kasir (POS)", icon: ShoppingCart, badge: "Utama", roles: ["owner", "supervisor", "cashier"] },
  products: { href: "/products", title: "Produk & Stok", icon: PackageCheck, badge: null, roles: ["owner", "supervisor", "cashier"] },
  
  // --- FNB EXCLUSIVE ---
  "fnb-orders": { href: "/orders", title: "Antrean Pesanan", icon: BellRing, badge: "Live", roles: ["owner", "supervisor", "cashier"] },
  "fnb-inventory": { href: "/inventory", title: "Stok Bahan Baku", icon: Boxes, badge: "Auto", roles: ["owner", "supervisor"] },
  "fnb-hpp": { href: "/hpp", title: "Kalkulator HPP", icon: Calculator, badge: "Cerdas", roles: ["owner"] },
  "fnb-tables": { href: "/tables", title: "Manajemen Meja", icon: LayoutDashboard, badge: "Pro", roles: ["owner", "supervisor", "cashier"] }, // Assuming LayoutDashboard for now, change later if needed

  // --- COFFEESHOP EXCLUSIVE ---
  "coffee-barista": { href: "/barista-queue", title: "Antrian Barista", icon: BellRing, badge: "Live", roles: ["owner", "supervisor", "cashier"] },
  "coffee-recipes": { href: "/recipes", title: "Resep Minuman", icon: Calculator, badge: "Pro", roles: ["owner", "supervisor"] },
  "coffee-loyalty": { href: "/loyalty", title: "Loyalty & Stamp", icon: Sparkles, badge: "Promo", roles: ["owner", "supervisor", "cashier"] },

  // --- RETAIL EXCLUSIVE ---
  "retail-inventory": { href: "/inventory", title: "Manajemen Stok", icon: Boxes, badge: "Pro", roles: ["owner", "supervisor"] },
  "retail-po": { href: "/purchase-orders", title: "Purchase Orders", icon: Truck, badge: "Pro", roles: ["owner", "supervisor"] },
  "retail-barcode": { href: "/barcode-scanner", title: "Barcode Scanner", icon: PackageCheck, badge: null, roles: ["owner", "supervisor", "cashier"] },

  // --- SALON EXCLUSIVE ---
  "salon-appointments": { href: "/appointments", title: "Jadwal Booking", icon: Calendar, badge: "Pro", roles: ["owner", "supervisor", "cashier"] },
  "salon-stylists": { href: "/stylists", title: "Manajemen Kapster", icon: Users, badge: "Pro", roles: ["owner"] },
  "salon-services": { href: "/services", title: "Katalog Servis", icon: Scissors, badge: null, roles: ["owner", "supervisor", "cashier"] },

  // --- LAUNDRY EXCLUSIVE ---
  "laundry-orders": { href: "/laundry-queue", title: "Antrean Laundry", icon: BellRing, badge: "Live", roles: ["owner", "supervisor", "cashier"] },
  "laundry-weight": { href: "/weight-pricing", title: "Timbangan Kiloan", icon: Scale, badge: "Pro", roles: ["owner", "supervisor", "cashier"] },
  "laundry-pickup": { href: "/pickup-delivery", title: "Antar Jemput", icon: Truck, badge: "Pro", roles: ["owner", "supervisor"] },
  "laundry-inventory": { href: "/inventory", title: "Stok Sabun & Parfum", icon: Boxes, badge: "Auto", roles: ["owner", "supervisor"] },

  // --- FINANCE & REPORTS ---
  expenses: { href: "/expenses", title: "Pengeluaran Toko", icon: TrendingDown, badge: null, roles: ["owner"] },
  debts: { href: "/debts", title: "Pelanggan & Kasbon", icon: Users, badge: null, roles: ["owner", "supervisor", "cashier"] },
  reports: { href: "/reports", title: "Laporan Laba/Rugi", icon: FileBarChart2, badge: null, roles: ["owner"] },

  // --- OTHERS ---
  academy: { href: "/academy", title: "Akademi & Simulator", icon: GraduationCap, badge: "Visioner", roles: ["owner", "supervisor"] },
  settings: { href: "/settings", title: "Pengaturan Toko", icon: Settings, badge: null, roles: ["owner"] },
};

export const INDUSTRY_NAV_CONFIG: Record<string, NavSection[]> = {
  fnb: [
    { section: "Utama", items: ["dashboard", "pos", "products"] },
    { section: "F&B Khusus", items: ["fnb-orders", "fnb-tables", "fnb-inventory", "fnb-hpp"] },
    { section: "Keuangan", items: ["reports", "expenses", "debts"] },
    { section: "Lainnya", items: ["academy", "settings"] },
  ],
  coffeeshop: [
    { section: "Utama", items: ["dashboard", "pos", "products"] },
    { section: "Coffee Shop", items: ["coffee-barista", "coffee-recipes", "coffee-loyalty", "fnb-inventory"] },
    { section: "Keuangan", items: ["reports", "expenses", "debts"] },
    { section: "Lainnya", items: ["academy", "settings"] },
  ],
  retail: [
    { section: "Utama", items: ["dashboard", "pos", "products"] },
    { section: "Retail & Toko", items: ["retail-barcode", "retail-inventory", "retail-po"] },
    { section: "Keuangan", items: ["reports", "expenses", "debts"] },
    { section: "Lainnya", items: ["academy", "settings"] },
  ],
  salon: [
    { section: "Utama", items: ["dashboard", "pos", "salon-services", "products"] },
    { section: "Salon & Barbershop", items: ["salon-appointments", "salon-stylists"] },
    { section: "Keuangan", items: ["reports", "expenses", "debts"] },
    { section: "Lainnya", items: ["academy", "settings"] },
  ],
  laundry: [
    { section: "Utama", items: ["dashboard", "pos", "products"] },
    { section: "Laundry Kiloan", items: ["laundry-orders", "laundry-weight", "laundry-pickup", "laundry-inventory"] },
    { section: "Keuangan", items: ["reports", "expenses", "debts"] },
    { section: "Lainnya", items: ["academy", "settings"] },
  ],
  universal: [
    { section: "Utama", items: ["dashboard", "pos", "products"] },
    { section: "Operasional", items: ["fnb-orders", "fnb-inventory"] },
    { section: "Keuangan", items: ["reports", "expenses", "debts"] },
    { section: "Lainnya", items: ["academy", "settings"] },
  ],
};
