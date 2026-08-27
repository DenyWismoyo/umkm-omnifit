"use client";

import React, { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import {
  BookOpen,
  Search,
  Download,
  ExternalLink,
  ChevronRight,
  FileText,
  UtensilsCrossed,
  Coffee,
  ShoppingBag,
  Scissors,
  Shirt,
  Printer,
  Receipt,
  Sparkles,
  Layers,
  ArrowLeft,
  Store,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface DocItem {
  id: string;
  title: string;
  category: "manual" | "industry" | "hardware";
  icon: React.ReactNode;
  badge: string;
  fileName: string;
  description: string;
}

const DOC_ITEMS: DocItem[] = [
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
    title: "Indeks & Sitemap Panduan",
    category: "manual",
    icon: <Layers className="h-4 w-4" />,
    badge: "Direktori",
    fileName: "INDEX.md",
    description: "Daftar seluruh berkas dokumentasi panduan sistem",
  },
];

export default function DocsPage() {
  const [activeDocId, setActiveDocId] = useState<string>("manual");
  const [docContent, setDocContent] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>("");

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

  const filteredDocs = DOC_ITEMS.filter(
    (d) =>
      d.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
                <span>Pusat Panduan & Manual Book Resmi</span>
              </div>
              <h1 className="text-xl sm:text-3xl font-black tracking-tight text-white">
                Buku Panduan & Dokumentasi POS UMKM Pro
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
                Pelajari langkah-langkah praktis mengoperasikan modul kasir, alur 6 industri bisnis, printer thermal, dan perhitungan HPP resep.
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
                  className="h-10 text-xs font-bold border-slate-700 bg-slate-900/80 text-slate-200 hover:bg-slate-800 gap-1.5"
                >
                  <Download className="h-3.5 w-3.5 text-emerald-400" />
                  <span>Download .md</span>
                </Button>
              </a>
              <a
                href={`/docs/${activeDoc.fileName}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button
                  size="sm"
                  className="h-10 text-xs font-black bg-emerald-500 hover:bg-emerald-600 text-slate-950 gap-1.5"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  <span>Buka Tab Baru</span>
                </Button>
              </a>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari topik panduan (misal: barcode, printer, HPP, kasbon)..."
            className="pl-10 h-11 bg-white border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 shadow-2xs"
          />
        </div>

        {/* Main 2-Column Documentation Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Sidebar: Navigation List (4 cols) */}
          <div className="lg:col-span-4 space-y-2">
            <span className="text-[11px] font-black uppercase tracking-wider text-slate-500 px-1 block">
              Daftar Dokumen ({filteredDocs.length})
            </span>

            <div className="space-y-1.5 max-h-[680px] overflow-y-auto pr-1">
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

          {/* Right Reader Area: Formatted Markdown Reader (8 cols) */}
          <div className="lg:col-span-8 bg-white border border-slate-200 rounded-3xl p-5 sm:p-8 shadow-xs min-h-[600px] text-slate-900">
            
            {/* Top Doc Header */}
            <div className="pb-4 mb-6 border-b border-slate-100 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
                  {activeDoc.icon}
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-black text-slate-900">
                    {activeDoc.title}
                  </h2>
                  <span className="text-[11px] font-mono text-slate-400">
                    public/docs/{activeDoc.fileName}
                  </span>
                </div>
              </div>

              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-xl border border-emerald-200">
                {activeDoc.badge}
              </span>
            </div>

            {/* Content Display */}
            {isLoading ? (
              <div className="py-20 flex flex-col items-center justify-center gap-3 text-slate-400">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-emerald-600 border-t-transparent" />
                <span className="text-xs font-semibold">Memuat dokumen...</span>
              </div>
            ) : (
              <div className="prose prose-slate prose-sm sm:prose-base max-w-none space-y-4">
                <pre className="whitespace-pre-wrap font-sans text-xs sm:text-sm text-slate-700 leading-relaxed bg-slate-50/70 p-4 sm:p-6 rounded-2xl border border-slate-200/80 font-normal">
                  {docContent}
                </pre>
              </div>
            )}

            {/* Bottom Navigation Helper */}
            <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span>Butuh bantuan lebih lanjut? Hubungi tim support Omnifit.</span>
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
