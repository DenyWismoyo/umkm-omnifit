"use client";

import React, { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import {
  BookOpen,
  Search,
  Download,
  ExternalLink,
  ChevronRight,
  UtensilsCrossed,
  Coffee,
  ShoppingBag,
  Scissors,
  Shirt,
  Printer,
  Receipt,
  Layers,
  Copy,
  Check,
  FileText,
  HelpCircle,
  Share2,
  Sparkles,
  Tag,
  Users,
  ShieldCheck,
  Scale,
  Briefcase,
  DollarSign,
  Award,
  ShoppingCart,
  Calculator,
  Store,
  HeartHandshake,
  FileBadge,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

interface DocItem {
  id: string;
  title: string;
  category: "feature" | "offer" | "manual" | "industry" | "hardware";
  icon: React.ReactNode;
  badge: string;
  fileName: string;
  description: string;
}

const DOC_ITEMS: DocItem[] = [
  // Fitur-Fitur Sistem (public/docs/fitur/)
  {
    id: "fitur-kasir",
    title: "Sistem Kasir & Transaksi Modern",
    category: "feature",
    icon: <ShoppingCart className="h-4 w-4" />,
    badge: "Fitur Kasir",
    fileName: "fitur/KASIR_DAN_TRANSAKSI.md",
    description: "Scan barcode, multi-metode (QRIS/Tunai/Transfer/Kasbon), split bill & shift laci",
  },
  {
    id: "fitur-hpp",
    title: "Kalkulator HPP Cerdas & Stok Presisi",
    category: "feature",
    icon: <Calculator className="h-4 w-4" />,
    badge: "Fitur HPP",
    fileName: "fitur/HPP_DAN_MANAJEMEN_STOK.md",
    description: "Recipe BoM multi-satuan, auto-deduct bahan saat transaksi & margin profit",
  },
  {
    id: "fitur-multi-outlet",
    title: "Multi-Outlet & Akses Karyawan (RBAC)",
    category: "feature",
    icon: <Store className="h-4 w-4" />,
    badge: "Fitur Cabang",
    fileName: "fitur/MULTI_OUTLET_DAN_KARYAWAN.md",
    description: "Dashboard terpusat, transfer stok antar cabang & matrix hak akses kasir",
  },
  {
    id: "fitur-loyalty-kasbon",
    title: "Loyalitas, Promo & Buku Kasbon Digital",
    category: "feature",
    icon: <HeartHandshake className="h-4 w-4" />,
    badge: "Fitur CRM",
    fileName: "fitur/LOYALITAS_DAN_KASBON.md",
    description: "Stempel digital reward, diskon grosir bertingkat & pengingat piutang WhatsApp",
  },
  {
    id: "fitur-hardware-pwa",
    title: "Hardware, PWA & Cetak Struk Bluetooth",
    category: "feature",
    icon: <Printer className="h-4 w-4" />,
    badge: "Fitur Hardware",
    fileName: "fitur/INTEGRASI_HARDWARE_PWA.md",
    description: "PWA offline-first, printer thermal 58mm/80mm & kustomisasi struk",
  },

  // Dokumen Penawaran & Bisnis (public/docs/penawaran/)
  {
    id: "penawaran-proposal",
    title: "Proposal Penawaran Digitalisasi UMKM",
    category: "offer",
    icon: <FileBadge className="h-4 w-4" />,
    badge: "Proposal Resmi",
    fileName: "penawaran/PROPOSAL_PENAWARAN_UMKM.md",
    description: "Executive summary, solusi All-in-One POS & dampak nyata efisiensi toko",
  },
  {
    id: "penawaran-paket-harga",
    title: "Skema Paket Harga & Langganan",
    category: "offer",
    icon: <DollarSign className="h-4 w-4" />,
    badge: "Paket Harga",
    fileName: "penawaran/PAKET_HARGA_DAN_LANGGANAN.md",
    description: "Free Trial 30 Hari Tanpa Kartu Kredit, Paket Pro Bulanan & Tahunan",
  },
  {
    id: "penawaran-kemitraan",
    title: "Program Kemitraan, Afiliasi & Reseller",
    category: "offer",
    icon: <Briefcase className="h-4 w-4" />,
    badge: "Kemitraan",
    fileName: "penawaran/PROGRAM_KEMITRAAN_RESELLER.md",
    description: "Peluang komisi pasif 20%-40% recurring, bundling hardware & materi promosi",
  },
  {
    id: "penawaran-roi",
    title: "Perbandingan Fitur & Analisis ROI",
    category: "offer",
    icon: <Scale className="h-4 w-4" />,
    badge: "Analisis ROI",
    fileName: "penawaran/PERBANDINGAN_FITUR_DAN_ROI.md",
    description: "Komparasi POS UMKM Pro vs kompetitor konvensional & kalkulasi hemat Rp1.5jt+/bln",
  },

  // Panduan Operasional (public/docs/)
  {
    id: "manual",
    title: "Buku Panduan Utama (Manual Book)",
    category: "manual",
    icon: <BookOpen className="h-4 w-4" />,
    badge: "Panduan Pokok",
    fileName: "MANUAL_BOOK.md",
    description: "Setup Akun, POS Kasir, Shift Staf Kasir, HPP Resep & Laporan Keuangan",
  },
  {
    id: "fnb",
    title: "Modul Kuliner & Resto (F&B)",
    category: "industry",
    icon: <UtensilsCrossed className="h-4 w-4" />,
    badge: "F&B Pack",
    fileName: "INDUSTRI_KULINER.md",
    description: "Manajemen Meja, QR Dine-in, Split Bill & Kitchen Display Slip",
  },
  {
    id: "coffeeshop",
    title: "Modul Kedai Kopi & Cafe",
    category: "industry",
    icon: <Coffee className="h-4 w-4" />,
    badge: "Coffee Pack",
    fileName: "INDUSTRI_COFFEESHOP.md",
    description: "Layar Antrian Barista, Kartu Stempel Digital Loyalty & Resep Kopi HPP",
  },
  {
    id: "retail",
    title: "Modul Retail & Minimarket",
    category: "industry",
    icon: <ShoppingBag className="h-4 w-4" />,
    badge: "Retail Pack",
    fileName: "INDUSTRI_RETAIL.md",
    description: "Barcode Scanner Kamera/USB, Diskon Grosir & Alert Expired",
  },
  {
    id: "salon",
    title: "Modul Salon & Barbershop",
    category: "industry",
    icon: <Scissors className="h-4 w-4" />,
    badge: "Salon Pack",
    fileName: "INDUSTRI_SALON.md",
    description: "Booking Stylist, Jadwal Kapster & Kalkulator Komisi Staf",
  },
  {
    id: "laundry",
    title: "Modul Laundry Kiloan & Satuan",
    category: "industry",
    icon: <Shirt className="h-4 w-4" />,
    badge: "Laundry Pack",
    fileName: "INDUSTRI_LAUNDRY.md",
    description: "Timbangan Desimal, Tracking 5 Status Cuci s/d Antar & Label Rak",
  },
  {
    id: "printer",
    title: "Panduan Printer Struk Thermal",
    category: "hardware",
    icon: <Printer className="h-4 w-4" />,
    badge: "Perangkat Keras",
    fileName: "PANDUAN_PRINTER_THERMAL.md",
    description: "Koneksi Bluetooth & USB (58mm/80mm) di Android, iOS, Windows & Mac",
  },
  {
    id: "debts",
    title: "Panduan Buku Kasbon & Piutang",
    category: "manual",
    icon: <Receipt className="h-4 w-4" />,
    badge: "Finansial",
    fileName: "PANDUAN_KASBON_HUTANG.md",
    description: "Mencatat Hutang Pelanggan & Menerima Pelunasan Cicilan Bertahap",
  },
  {
    id: "index",
    title: "Indeks & Direktori Dokumen",
    category: "manual",
    icon: <Layers className="h-4 w-4" />,
    badge: "Direktori",
    fileName: "INDEX.md",
    description: "Daftar seluruh berkas dokumentasi panduan sistem",
  },
];

const CATEGORIES = [
  { key: "all", label: "Semua Dokumen" },
  { key: "feature", label: "⚙️ Fitur Sistem" },
  { key: "offer", label: "💼 Penawaran & Bisnis" },
  { key: "industry", label: "🏢 6 Industri" },
  { key: "manual", label: "📖 Panduan Pokok" },
  { key: "hardware", label: "🖨️ Hardware" },
];

export default function DocsPage() {
  const [activeDocId, setActiveDocId] = useState<string>("fitur-kasir");
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [docContent, setDocContent] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const activeDoc = DOC_ITEMS.find((d) => d.id === activeDocId) || DOC_ITEMS[0];

  useEffect(() => {
    async function loadDoc() {
      try {
        setIsLoading(true);
        const res = await fetch(`/docs/${activeDoc.fileName}`);
        if (!res.ok) throw new Error("Gagal mengambil berkas panduan");
        const text = await res.text();
        setDocContent(text);
      } catch (err) {
        setDocContent(
          `# ${activeDoc.title}\n\nDokumen panduan sedang disiapkan. Anda dapat membaca berkas langsung di \`/docs/${activeDoc.fileName}\`.`
        );
      } finally {
        setIsLoading(false);
      }
    }

    loadDoc();
  }, [activeDoc]);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(text);
    toast.success("Berhasil disalin ke papan klip!");
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const filteredDocs = DOC_ITEMS.filter((d) => {
    const matchesCategory = activeCategory === "all" || d.category === activeCategory;
    const matchesQuery =
      d.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.badge.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesQuery;
  });

  return (
    <DashboardLayout>
      <div className="space-y-4 sm:space-y-6">
        
        {/* Top Header Banner */}
        <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-br from-slate-900 via-slate-950 to-emerald-950 p-5 sm:p-7 text-white shadow-md border border-slate-800">
          <div className="absolute top-0 right-0 -mt-10 -mr-10 h-44 w-44 rounded-full bg-emerald-500/15 blur-3xl pointer-events-none" />
          
          <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 px-3 py-0.5 text-xs font-bold text-emerald-400">
                <BookOpen className="h-3.5 w-3.5" />
                <span>Pusat Dokumentasi, Fitur & Proposal Resmi</span>
              </div>
              <h1 className="text-xl sm:text-3xl font-black tracking-tight text-white">
                Dokumentasi & Pusat Penawaran POS UMKM Pro
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
                Kumpulan dokumen spesifikasi fitur lengkap, proposal digitalisasi usaha, paket harga langganan, dan manual book operasional.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <a
                href={`/docs/${activeDoc.fileName}`}
                target="_blank"
                rel="noopener noreferrer"
                download
              >
                <Button
                  variant="outline"
                  size="sm"
                  className="h-10 text-xs font-bold border-slate-700 bg-slate-900/80 text-slate-200 hover:bg-slate-800 gap-1.5 cursor-pointer"
                >
                  <Download className="h-3.5 w-3.5 text-emerald-400" />
                  <span>Download .MD</span>
                </Button>
              </a>
              <a
                href={`/docs/${activeDoc.fileName}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button
                  size="sm"
                  className="h-10 text-xs font-black bg-emerald-500 hover:bg-emerald-600 text-slate-950 gap-1.5 cursor-pointer shadow-sm"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  <span>Buka File Raw</span>
                </Button>
              </a>
            </div>
          </div>
        </div>

        {/* Filter Categories and Search */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.key}
                type="button"
                onClick={() => setActiveCategory(cat.key)}
                className={`text-xs font-bold px-3 py-1.5 rounded-xl border transition-all whitespace-nowrap cursor-pointer ${
                  activeCategory === cat.key
                    ? "bg-emerald-600 border-emerald-600 text-white shadow-xs"
                    : "bg-white border-slate-200 text-slate-600 hover:bg-slate-100"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Search Bar */}
          <div className="relative w-full md:w-80 shrink-0">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari fitur, harga, proposal, HPP..."
              className="pl-10 h-10 bg-white border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 shadow-2xs"
            />
          </div>
        </div>

        {/* Main 2-Column Documentation Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Sidebar: Navigation List (4 cols) */}
          <div className="lg:col-span-4 space-y-2">
            <span className="text-[11px] font-black uppercase tracking-wider text-slate-500 px-1 block">
              Daftar Berkas ({filteredDocs.length})
            </span>

            <div className="space-y-1.5 max-h-[750px] overflow-y-auto pr-1">
              {filteredDocs.map((doc) => {
                const isActive = doc.id === activeDocId;
                return (
                  <button
                    key={doc.id}
                    type="button"
                    onClick={() => setActiveDocId(doc.id)}
                    className={`touch-press w-full text-left p-3 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 ${
                      isActive
                        ? "bg-emerald-50 border-emerald-500/40 text-emerald-950 shadow-xs ring-1 ring-emerald-500/20"
                        : "bg-white border-slate-200 hover:bg-slate-50 text-slate-800 shadow-2xs"
                    }`}
                  >
                    <div
                      className={`h-9 w-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                        isActive
                          ? "bg-emerald-500 text-slate-950 font-black shadow-xs"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {doc.icon}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-1">
                        <h4 className="text-xs font-bold truncate text-slate-900">
                          {doc.title}
                        </h4>
                        <span
                          className={`text-[9px] font-black uppercase px-1.5 py-0.2 rounded-md shrink-0 ${
                            isActive
                              ? "bg-emerald-200/80 text-emerald-900"
                              : "bg-slate-100 text-slate-600"
                          }`}
                        >
                          {doc.badge}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-500 line-clamp-1 mt-0.5">
                        {doc.description}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Reader Area: Rich Rendered Markdown Layout (8 cols) */}
          <div className="lg:col-span-8 bg-white border border-slate-200 rounded-3xl p-5 sm:p-8 shadow-xs min-h-[600px] text-slate-900">
            
            {/* Top Doc Header */}
            <div className="pb-4 mb-6 border-b border-slate-100 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 min-w-0">
                <div className="h-10 w-10 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold shadow-2xs shrink-0">
                  {activeDoc.icon}
                </div>
                <div className="min-w-0">
                  <h2 className="text-base sm:text-lg font-black text-slate-900 truncate">
                    {activeDoc.title}
                  </h2>
                  <span className="text-[11px] font-mono text-slate-400 block truncate">
                    public/docs/{activeDoc.fileName}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => handleCopy(docContent)}
                  className="h-8 px-2.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-600 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                  title="Salin isi dokumen"
                >
                  {copiedCode === docContent ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-emerald-600" />
                      <span className="text-emerald-700">Tersalin</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" />
                      <span>Salin Semua</span>
                    </>
                  )}
                </button>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-xl border border-emerald-200">
                  {activeDoc.badge}
                </span>
              </div>
            </div>

            {/* Content Display using ReactMarkdown */}
            {isLoading ? (
              <div className="py-20 flex flex-col items-center justify-center gap-3 text-slate-400">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-emerald-600 border-t-transparent" />
                <span className="text-xs font-semibold">Memuat dokumen panduan...</span>
              </div>
            ) : (
              <div className="markdown-content space-y-4 text-slate-800 leading-relaxed text-sm">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    h1: ({ node, ...props }) => (
                      <h1
                        className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight pb-3 mb-4 border-b border-slate-200 flex items-center gap-2"
                        {...props}
                      />
                    ),
                    h2: ({ node, ...props }) => (
                      <h2
                        className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight mt-6 mb-3 pt-3 border-t border-slate-100 flex items-center gap-2 text-emerald-950"
                        {...props}
                      />
                    ),
                    h3: ({ node, ...props }) => (
                      <h3
                        className="text-sm sm:text-base font-bold text-slate-900 mt-4 mb-2"
                        {...props}
                      />
                    ),
                    p: ({ node, ...props }) => (
                      <p className="text-slate-700 leading-relaxed my-2.5" {...props} />
                    ),
                    ul: ({ node, ...props }) => (
                      <ul className="list-disc list-inside space-y-1.5 my-3 pl-1 text-slate-700" {...props} />
                    ),
                    ol: ({ node, ...props }) => (
                      <ol className="list-decimal list-inside space-y-1.5 my-3 pl-1 text-slate-700 font-medium" {...props} />
                    ),
                    li: ({ node, ...props }) => (
                      <li className="leading-relaxed text-slate-700 marker:text-emerald-600" {...props} />
                    ),
                    strong: ({ node, ...props }) => (
                      <strong className="font-extrabold text-slate-900" {...props} />
                    ),
                    em: ({ node, ...props }) => (
                      <em className="italic text-slate-800" {...props} />
                    ),
                    blockquote: ({ node, ...props }) => (
                      <blockquote
                        className="p-4 my-4 rounded-2xl bg-emerald-50/70 border-l-4 border-emerald-500 text-emerald-950 text-xs sm:text-sm font-medium shadow-2xs"
                        {...props}
                      />
                    ),
                    hr: () => <hr className="my-6 border-slate-200" />,
                    table: ({ node, ...props }) => (
                      <div className="overflow-x-auto my-4 rounded-xl border border-slate-200">
                        <table className="min-w-full divide-y divide-slate-200 text-xs sm:text-sm" {...props} />
                      </div>
                    ),
                    thead: ({ node, ...props }) => (
                      <thead className="bg-slate-100 font-bold text-slate-900" {...props} />
                    ),
                    tbody: ({ node, ...props }) => (
                      <tbody className="divide-y divide-slate-100 bg-white" {...props} />
                    ),
                    tr: ({ node, ...props }) => (
                      <tr className="hover:bg-slate-50/80 transition-colors" {...props} />
                    ),
                    th: ({ node, ...props }) => (
                      <th className="px-4 py-2.5 text-left font-bold text-slate-900" {...props} />
                    ),
                    td: ({ node, ...props }) => (
                      <td className="px-4 py-2.5 text-slate-700" {...props} />
                    ),
                    code: ({ node, className, children, ...props }: any) => {
                      const isInline = !className && typeof children === "string" && !children.includes("\n");
                      if (isInline) {
                        return (
                          <code
                            className="font-mono text-[11px] sm:text-xs bg-emerald-50 text-emerald-800 border border-emerald-200/80 px-1.5 py-0.5 rounded-md font-semibold"
                            {...props}
                          >
                            {children}
                          </code>
                        );
                      }
                      return (
                        <div className="relative group my-3">
                          <pre className="overflow-x-auto bg-slate-900 text-slate-100 p-4 rounded-2xl text-xs font-mono leading-relaxed border border-slate-800">
                            <code {...props}>{children}</code>
                          </pre>
                          <button
                            type="button"
                            onClick={() => handleCopy(String(children))}
                            className="absolute top-2.5 right-2.5 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-800 hover:bg-slate-700 text-slate-200 text-[10px] font-bold px-2 py-1 rounded-md border border-slate-700 flex items-center gap-1 cursor-pointer"
                          >
                            <Copy className="h-3 w-3" />
                            <span>Salin</span>
                          </button>
                        </div>
                      );
                    },
                    a: ({ node, href, children, ...props }) => (
                      <a
                        href={href}
                        target={href?.startsWith("http") ? "_blank" : undefined}
                        rel={href?.startsWith("http") ? "noopener noreferrer" : undefined}
                        className="text-emerald-600 hover:text-emerald-700 font-bold underline inline-flex items-center gap-1"
                        {...props}
                      >
                        <span>{children}</span>
                        {href?.startsWith("http") && <ExternalLink className="h-3 w-3 inline" />}
                      </a>
                    ),
                  }}
                >
                  {docContent}
                </ReactMarkdown>
              </div>
            )}

            {/* Bottom Navigation Helper */}
            <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
              <div className="flex items-center gap-1.5">
                <HelpCircle className="h-4 w-4 text-emerald-600" />
                <span>Dokumentasi resmi POS UMKM Pro by Omnifit Cloud.</span>
              </div>
              <a
                href="https://umkm.omnifit.cloud"
                target="_blank"
                rel="noreferrer"
                className="font-bold text-emerald-600 hover:underline"
              >
                umkm.omnifit.cloud
              </a>
            </div>

          </div>

        </div>

      </div>
    </DashboardLayout>
  );
}
