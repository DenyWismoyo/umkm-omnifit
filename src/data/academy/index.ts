import { AcademyArticle, AcademyCategoryId, CategoryMeta } from "./types";
import { financeArticles } from "./categories/finance";
import { pricingArticles } from "./categories/pricing";
import { menuArticles } from "./categories/menu";
import { operationsArticles } from "./categories/operations";
import { customersArticles } from "./categories/customers";
import { marketingArticles } from "./categories/marketing";
import { hrArticles } from "./categories/hr";
import { legalArticles } from "./categories/legal";
import { growthArticles } from "./categories/growth";

export * from "./types";

// Category Metadata Definition
export const ACADEMY_CATEGORIES: CategoryMeta[] = [
  {
    id: "finance",
    name: "Manajemen Keuangan & Arus Kas",
    shortName: "Keuangan",
    icon: "Wallet",
    emoji: "💰",
    description: "Memisahkan kas pribadi, formula gaji owner, dana darurat, dan mengendalikan cashflow.",
    badgeColor: "bg-emerald-100 text-emerald-800 border-emerald-200",
  },
  {
    id: "pricing",
    name: "Strategi Penetapan Harga & Margin",
    shortName: "Harga & Margin",
    icon: "Tag",
    emoji: "🏷️",
    description: "Cost-Plus, Value Pricing, Psikologi Angka (Charm), dan Rumus Promo Ojol tanpa rugi.",
    badgeColor: "bg-amber-100 text-amber-800 border-amber-200",
  },
  {
    id: "menu",
    name: "Menu Engineering & Paket Bundling",
    shortName: "Menu & Bundling",
    icon: "ShoppingBag",
    emoji: "🍔",
    description: "Matriks menu Stars & Dogs, trik bundling, upselling kasir, dan menaikkan rata-rata keranjang.",
    badgeColor: "bg-orange-100 text-orange-800 border-orange-200",
  },
  {
    id: "operations",
    name: "Operasional Dapur, Yield & SOP",
    shortName: "Operasional & SOP",
    icon: "Layers",
    emoji: "🥩",
    description: "Menghitung penyusutan resep (Yield Factor), manajemen stok FIFO, dan mencegah kebocoran bahan.",
    badgeColor: "bg-teal-100 text-teal-800 border-teal-200",
  },
  {
    id: "customers",
    name: "Manajemen Kasbon & Loyalitas Pelanggan",
    shortName: "Kasbon & Pelanggan",
    icon: "Users",
    emoji: "🤝",
    description: "SOP kasbon sehat, template WA tagihan sopan, dan program loyalitas stamp card.",
    badgeColor: "bg-blue-100 text-blue-800 border-blue-200",
  },
  {
    id: "marketing",
    name: "Pemasaran Lokal & Promosi Digital",
    shortName: "Pemasaran & Promosi",
    icon: "Globe",
    emoji: "📢",
    description: "Optimasi Google Maps gratis, ulasan bintang 5, dan konten video pendek menggugah selera.",
    badgeColor: "bg-purple-100 text-purple-800 border-purple-200",
  },
  {
    id: "hr",
    name: "SDM, Karyawan & Skema Bonus",
    shortName: "SDM & Karyawan",
    icon: "Users",
    emoji: "👥",
    description: "Struktur gaji pokok + insentif omzet, training kilat 3 hari, dan SOP disiplin shift kasir.",
    badgeColor: "bg-indigo-100 text-indigo-800 border-indigo-200",
  },
  {
    id: "legal",
    name: "Pajak UMKM, Legalitas & Sertifikasi",
    shortName: "Pajak & Legalitas",
    icon: "Building",
    emoji: "⚖️",
    description: "Bebas pajak s.d. Rp 500 Jt/tahun (PPh 0.5%), NIB OSS kilat, P-IRT, dan Halal SEHATI.",
    badgeColor: "bg-rose-100 text-rose-800 border-rose-200",
  },
  {
    id: "growth",
    name: "Ekspansi, Cabang Baru & Permodalan",
    shortName: "Ekspansi & KUR",
    icon: "TrendingUp",
    emoji: "🚀",
    description: "Waktu tepat buka cabang 2, standarisasi central kitchen, dan syarat lolos pinjaman KUR Bank 6%.",
    badgeColor: "bg-cyan-100 text-cyan-800 border-cyan-200",
  },
];

// Unified Master Articles List
export const ALL_ACADEMY_ARTICLES: AcademyArticle[] = [
  ...financeArticles,
  ...pricingArticles,
  ...menuArticles,
  ...operationsArticles,
  ...customersArticles,
  ...marketingArticles,
  ...hrArticles,
  ...legalArticles,
  ...growthArticles,
];

export const ACADEMY_ARTICLES = ALL_ACADEMY_ARTICLES;

// Helper Functions
export function getArticleById(id: string): AcademyArticle | undefined {
  return ALL_ACADEMY_ARTICLES.find((art) => art.id === id);
}

export function getArticlesByCategory(categoryId: AcademyCategoryId): AcademyArticle[] {
  return ALL_ACADEMY_ARTICLES.filter((art) => art.categoryId === categoryId);
}

export function searchArticles(query: string): AcademyArticle[] {
  const cleanQ = query.toLowerCase().trim();
  if (!cleanQ) return ALL_ACADEMY_ARTICLES;
  return ALL_ACADEMY_ARTICLES.filter(
    (art) =>
      art.title.toLowerCase().includes(cleanQ) ||
      art.summary.toLowerCase().includes(cleanQ) ||
      art.categoryLabel.toLowerCase().includes(cleanQ) ||
      art.content.toLowerCase().includes(cleanQ)
  );
}
