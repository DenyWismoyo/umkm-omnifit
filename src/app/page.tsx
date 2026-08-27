"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import {
  Store,
  Coffee,
  UtensilsCrossed,
  ShoppingBag,
  Scissors,
  Shirt,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  ChevronRight,
  ShieldCheck,
  TrendingUp,
  Printer,
  Calculator,
  Users,
  QrCode,
  Crown,
  HelpCircle,
  Smartphone,
  Laptop,
  Zap,
  Star,
  ChevronDown,
  Lock,
  Layers,
  BarChart3,
  Receipt,
  Clock,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface IndustryFeature {
  id: string;
  name: string;
  badge: string;
  icon: React.ReactNode;
  headline: string;
  description: string;
  highlights: string[];
  gradient: string;
  previewCard: {
    title: string;
    metrics: string;
    tag: string;
    sampleItem: string;
  };
}

const INDUSTRIES: IndustryFeature[] = [
  {
    id: "fnb",
    name: "Kuliner & Resto",
    badge: "F&B Pack",
    icon: <UtensilsCrossed className="h-5 w-5" />,
    headline: "Kelola Meja, Dapur & Transaksi Makan di Tempat",
    description:
      "Didesain khusus untuk restoran, rumah makan, warung makan, dan kafe keluarga. Cetak struk pesanan langsung ke dapur dan kasir.",
    highlights: [
      "Manajemen Meja & QR Dine-in Pelanggan",
      "Split Bill & Pemisahan Struk Dapur / Bar",
      "Pilihan Layanan Dine-in, Takeaway & Delivery",
      "Kalkulator HPP Porsi Makanan Otomatis",
    ],
    gradient: "from-amber-500/20 via-orange-500/10 to-transparent",
    previewCard: {
      title: "Resto Sate Khas Solo",
      metrics: "32 Meja Terisi (88%)",
      tag: "Meja 08 • Dine-in",
      sampleItem: "1x Nasi Goreng Spesial + 1x Es Teh Manis",
    },
  },
  {
    id: "coffeeshop",
    name: "Kedai Kopi & Cafe",
    badge: "Coffee Pack",
    icon: <Coffee className="h-5 w-5" />,
    headline: "Live Antrian Barista & Kartu Stempel Digital",
    description:
      "Pantau pesanan racikan kopi secara real-time. Pelanggan semakin loyal dengan kartu stempel digital 'Beli 9 Gratis 1' tanpa kertas.",
    highlights: [
      "Layar Antrian Barista Live (Less Sugar, Ice, Topping)",
      "Kartu Stempel Loyalty Digital Berbasis Scan QR",
      "Kalkulator HPP Kopi Presisi (Gram Espresso & Sirup)",
      "Peringatan Stok Biji Kopi & Susu Menipis",
    ],
    gradient: "from-amber-600/20 via-yellow-600/10 to-transparent",
    previewCard: {
      title: "Kopi Senja Utama",
      metrics: "Antrian 12 Cup Live",
      tag: "Barista Display • #ORD-104",
      sampleItem: "2x Aren Latte (Less Ice, 50% Sugar, Oatmilk)",
    },
  },
  {
    id: "retail",
    name: "Retail & Minimarket",
    badge: "Retail Pack",
    icon: <ShoppingBag className="h-5 w-5" />,
    headline: "Scan Barcode Cepat & Diskon Grosir Bertingkat",
    description:
      "Transaksi super kilat untuk minimarket, toko kelontong, frozen food, dan toko sembako dengan scan kamera HP atau barcode scanner USB.",
    highlights: [
      "Barcode Scanner Kilat (Kamera HP & Scanner Laser)",
      "Harga Grosir Bertingkat Berdasarkan Jumlah Beli",
      "Peringatan Stok Minimum & Tanggal Kadaluarsa",
      "Kategori Sembako & Cetak Label Rak",
    ],
    gradient: "from-emerald-500/20 via-teal-500/10 to-transparent",
    previewCard: {
      title: "Toko Sembako Berkah",
      metrics: "542 SKU Aktif",
      tag: "Scan Cepat • Kasir 1",
      sampleItem: "3x Beras Premium 5kg (Diskon Grosir Aktif)",
    },
  },
  {
    id: "salon",
    name: "Salon & Barbershop",
    badge: "Salon Pack",
    icon: <Scissors className="h-5 w-5" />,
    headline: "Booking Stylist, Jadwal & Perhitungan Komisi",
    description:
      "Atur jadwal kapster, booking antrian pelanggan salon, dan hitung bagi hasil jasa staf secara otomatis dan transparan.",
    highlights: [
      "Manajemen Booking & Antrian Stylist / Kapster",
      "Kalkulator Komisi Staf & Tips Kasir Otomatis",
      "Paket Layanan Treatment & Penjualan Produk Haircare",
      "Riwayat Perawatan & Preferensi Pelanggan",
    ],
    gradient: "from-rose-500/20 via-pink-500/10 to-transparent",
    previewCard: {
      title: "Gentleman Barbershop",
      metrics: "8 Booking Hari Ini",
      tag: "Slot 14:00 • Kapster Dimas",
      sampleItem: "1x Gentleman Cut + Pomade Styling",
    },
  },
  {
    id: "laundry",
    name: "Laundry Kiloan",
    badge: "Laundry Pack",
    icon: <Shirt className="h-5 w-5" />,
    headline: "Timbangan Desimal Presisi & Tracking Status Cuci",
    description:
      "Hitung tarif kiloan akurat (misal: 3.75 kg) dan pantau status cucian mulai dari cuci, kering, setrika hingga siap antar.",
    highlights: [
      "Kalkulator Timbangan Desimal (Tarif per 0.1 kg)",
      "Pelacakan Status: Cuci -> Kering -> Setrika -> Siap",
      "Cetak Nota Struk Mini & Label Rak Penyimpanan",
      "Catatan Parfum & Layanan Antar-Jemput",
    ],
    gradient: "from-blue-500/20 via-cyan-500/10 to-transparent",
    previewCard: {
      title: "Clean & Fresh Laundry",
      metrics: "18 Nota Proses Cuci",
      tag: "Rak A3 • Kiloan Ekspres",
      sampleItem: "3.85 Kg Cuci Setrika (Parfum Lavender)",
    },
  },
  {
    id: "universal",
    name: "Universal UMKM",
    badge: "Universal Pack",
    icon: <Store className="h-5 w-5" />,
    headline: "Kasir Serbaguna untuk Segala Jenis Toko & Jasa",
    description:
      "Solusi kasir lengkap dengan pembukuan kasbon pelanggan, cetak struk thermal, laporan laba rugi, dan transaksi QRIS instan.",
    highlights: [
      "Buku Kasbon & Catatan Piutang Pelanggan",
      "Cetak Struk Thermal Bluetooth 58mm & 80mm",
      "Laporan Omzet, Laba Bersih & Pengeluaran Harian",
      "Akses Multi-Device (Android, iOS, Windows, Mac)",
    ],
    gradient: "from-purple-500/20 via-indigo-500/10 to-transparent",
    previewCard: {
      title: "Usaha Mandiri Jaya",
      metrics: "Omzet Rp 3.450.000 Hari Ini",
      tag: "Sesi Kasir Aktif",
      sampleItem: "Pembayaran QRIS Terverifikasi Instan",
    },
  },
];

const FAQS = [
  {
    q: "Apakah POS UMKM Pro bisa digunakan di HP / Smartphone?",
    a: "Ya! POS UMKM Pro dirancang dengan konsep Mobile-First Progressive Web App (PWA). Anda dapat menggunakannya di smartphone Android, iPhone, tablet iPad, hingga laptop dan PC desktop tanpa perlu install aplikasi berat dari app store.",
  },
  {
    q: "Apakah printer struk thermal Bluetooth didukung?",
    a: "Sangat didukung. Anda dapat mencetak struk kasir ke printer thermal Bluetooth maupun USB dengan ukuran kertas standar 58mm dan 80mm secara instan.",
  },
  {
    q: "Bagaimana cara kerja Trial 30 Hari Gratis?",
    a: "Setiap pengguna yang mendaftar langsung mendapatkan akses penuh (Full PRO) selama 30 hari tanpa syarat kartu kredit. Anda dapat mencoba seluruh fitur kalkulator HPP, modul industri, dan kasbon secara leluasa.",
  },
  {
    q: "Bisakah saya mengganti jenis industri usaha saya nanti?",
    a: "Bisa kapan saja! Anda dapat menyesuaikan modul industri (misalnya dari F&B ke Kedai Kopi atau Retail) langsung melalui menu profil di pojok kanan atas atau pengaturan toko.",
  },
  {
    q: "Apakah kasir staf saya bisa login tanpa mengetahui password email pemilik?",
    a: "Ya. Pemilik toko cukup memberikan Kode Toko (contoh: TOKO-4829) dan PIN 6-digit kasir. Staf kasir dapat login secara terisolasi tanpa memiliki akses ke laporan laba bersih atau data rahasia pemilik.",
  },
];

export default function LandingPage() {
  const { user, loading } = useAuth();
  const [activeIndustryId, setActiveIndustryId] = useState("fnb");
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [isYearlyBilling, setIsYearlyBilling] = useState(false);

  const activeIndustry =
    INDUSTRIES.find((ind) => ind.id === activeIndustryId) || INDUSTRIES[0];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-emerald-500 selection:text-white font-sans overflow-x-hidden">
      
      {/* 1. STICKY TOP NAVBAR */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-slate-950/80 border-b border-slate-800/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between">
          
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="h-10 w-10 sm:h-11 sm:w-11 rounded-2xl bg-gradient-to-tr from-emerald-500 via-emerald-600 to-teal-400 flex items-center justify-center text-white shadow-lg shadow-emerald-500/25 group-hover:scale-105 transition-transform">
              <Store className="h-5 w-5 sm:h-6 sm:w-6" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg sm:text-xl font-black tracking-tight text-white flex items-center gap-1">
                POS UMKM <span className="text-emerald-400">Pro</span>
              </span>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                by Omnifit Cloud
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-300">
            <a href="#industri" className="hover:text-emerald-400 transition-colors">
              Modul Usaha
            </a>
            <a href="#fitur" className="hover:text-emerald-400 transition-colors">
              Fitur Unggulan
            </a>
            <a href="#harga" className="hover:text-emerald-400 transition-colors">
              Paket Harga
            </a>
            <a href="#faq" className="hover:text-emerald-400 transition-colors">
              FAQ
            </a>
          </nav>

          {/* Action CTAs */}
          <div className="flex items-center gap-2 sm:gap-3">
            {!loading && user ? (
              <Link href="/dashboard">
                <Button className="h-10 sm:h-11 px-4 sm:px-6 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black rounded-xl shadow-lg shadow-emerald-500/20 text-xs sm:text-sm">
                  <span>Ke Dashboard</span>
                  <ArrowRight className="h-4 w-4 ml-1.5" />
                </Button>
              </Link>
            ) : (
              <>
                <Link href="/login">
                  <Button
                    variant="ghost"
                    className="text-slate-300 hover:text-white hover:bg-slate-900 text-xs sm:text-sm font-bold px-3 sm:px-4"
                  >
                    Masuk Akun
                  </Button>
                </Link>
                <Link href="/login">
                  <Button className="h-9 sm:h-11 px-3 sm:px-5 bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-600 hover:to-teal-500 text-slate-950 font-black rounded-xl shadow-lg shadow-emerald-500/25 text-xs sm:text-sm">
                    <span>Coba 30 Hari Gratis</span>
                    <ChevronRight className="h-4 w-4 ml-1 hidden sm:inline-block" />
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* 2. HERO SECTION */}
      <section className="relative pt-12 sm:pt-20 pb-16 sm:pb-28 overflow-hidden">
        {/* Background Glowing Circles */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] sm:w-[900px] h-[400px] bg-gradient-to-tr from-emerald-600/20 via-teal-500/15 to-transparent blur-3xl pointer-events-none -z-10 rounded-full" />
        <div className="absolute top-1/2 right-10 w-72 h-72 bg-blue-600/10 blur-3xl pointer-events-none -z-10 rounded-full" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6 sm:space-y-8">
          
          {/* Top Pill */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs sm:text-sm font-bold shadow-inner">
            <Sparkles className="h-4 w-4" />
            <span>Sistem Kasir Cloud Multi-Industri #1 di Indonesia</span>
          </div>

          {/* Main Title */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight max-w-4xl mx-auto leading-[1.15]">
            Satu Aplikasi Kasir Pintar untuk{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-500">
              Segala Jenis Usaha UMKM
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-slate-300 text-sm sm:text-lg lg:text-xl max-w-2xl mx-auto font-normal leading-relaxed">
            Kelola transaksi kasir, pantau stok bahan baku, hitung modal resep HPP otomatis, buku kasbon pelanggan, hingga cetak struk thermal QRIS langsung dari HP & PC.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 sm:gap-4 pt-2">
            <Link href="/login" className="w-full sm:w-auto">
              <Button
                size="lg"
                className="w-full sm:w-auto h-13 sm:h-14 px-8 text-base font-black bg-gradient-to-r from-emerald-500 via-emerald-400 to-teal-400 hover:from-emerald-600 hover:to-teal-500 text-slate-950 rounded-2xl shadow-xl shadow-emerald-500/30 transition-all hover:scale-[1.02]"
              >
                <span>Mulai Trial 30 Hari Gratis</span>
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
            </Link>
            <Link href="/login" className="w-full sm:w-auto">
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto h-13 sm:h-14 px-7 text-base font-bold bg-slate-900/80 hover:bg-slate-800 text-slate-200 border-slate-700 rounded-2xl"
              >
                <QrCode className="h-4 w-4 mr-2 text-emerald-400" />
                <span>Masuk dengan Kode Toko</span>
              </Button>
            </Link>
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 pt-4 text-xs font-semibold text-slate-400">
            <div className="flex items-center gap-1.5 text-amber-400">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <span className="text-slate-300 font-bold ml-1">Rating 4.9/5</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              <span>Tanpa Kartu Kredit</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              <span>Setup Kurang dari 1 Menit</span>
            </div>
          </div>

          {/* Hero Visual Mockup */}
          <div className="pt-8 sm:pt-12 max-w-5xl mx-auto">
            <div className="relative rounded-3xl bg-gradient-to-b from-slate-800/80 to-slate-900/90 border border-slate-700/70 p-3 sm:p-6 shadow-2xl shadow-emerald-950/40 backdrop-blur-2xl">
              
              {/* Top Fake Window Bar */}
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800 px-2">
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full bg-rose-500/80" />
                  <span className="h-3 w-3 rounded-full bg-amber-500/80" />
                  <span className="h-3 w-3 rounded-full bg-emerald-500/80" />
                  <span className="text-xs text-slate-400 font-mono ml-2 hidden sm:inline">
                    https://umkm.omnifit.cloud/dashboard
                  </span>
                </div>
                <span className="text-[11px] font-black uppercase text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                  Live POS Cloud
                </span>
              </div>

              {/* Mockup Dashboard Content Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 sm:gap-4 text-left">
                
                {/* Card 1: Revenue */}
                <div className="bg-slate-950/80 rounded-2xl p-4 sm:p-5 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>Omzet Hari Ini</span>
                    <TrendingUp className="h-4 w-4 text-emerald-400" />
                  </div>
                  <div className="text-2xl sm:text-3xl font-black text-white">
                    Rp 4.850.000
                  </div>
                  <p className="text-[11px] text-emerald-400 font-semibold">
                    +18.4% dari kemarin • 48 Transaksi
                  </p>
                </div>

                {/* Card 2: Live Barista / Order */}
                <div className="bg-slate-950/80 rounded-2xl p-4 sm:p-5 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>Kasir & Antrian Aktif</span>
                    <Coffee className="h-4 w-4 text-amber-400" />
                  </div>
                  <div className="text-2xl sm:text-3xl font-black text-amber-400">
                    6 Pesanan
                  </div>
                  <p className="text-[11px] text-slate-400">
                    2x Kopi Susu Aren • 1x Croissant Butter
                  </p>
                </div>

                {/* Card 3: QRIS & Thermal */}
                <div className="bg-slate-950/80 rounded-2xl p-4 sm:p-5 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>Status Printer & QRIS</span>
                    <Printer className="h-4 w-4 text-blue-400" />
                  </div>
                  <div className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span>Thermal 58mm</span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Auto-print Struk & QRIS Terhubung
                  </p>
                </div>

              </div>

            </div>
          </div>

        </div>
      </section>

      {/* 3. MULTI-INDUSTRY SHOWCASE SECTION */}
      <section id="industri" className="py-16 sm:py-24 bg-slate-900/50 border-t border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="text-center space-y-3 max-w-3xl mx-auto">
            <span className="text-xs font-black uppercase tracking-widest text-emerald-400">
              6 Modul Industri Spesifik
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              Bukan Sekadar Kasir Biasa. Disesuaikan untuk Bisnis Anda.
            </h2>
            <p className="text-slate-400 text-sm sm:text-base">
              Setiap industri memiliki alur operasional unik. POS UMKM Pro menyediakan modul fitur khusus untuk menjawab kebutuhan nyata usaha Anda.
            </p>
          </div>

          {/* Industry Tabs Selector */}
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
            {INDUSTRIES.map((ind) => {
              const isActive = ind.id === activeIndustryId;
              return (
                <button
                  key={ind.id}
                  onClick={() => setActiveIndustryId(ind.id)}
                  className={`touch-press flex items-center gap-2 px-4 sm:px-5 py-2.5 sm:py-3 rounded-2xl font-bold text-xs sm:text-sm transition-all cursor-pointer ${
                    isActive
                      ? "bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/25 scale-105"
                      : "bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-700/60"
                  }`}
                >
                  {ind.icon}
                  <span>{ind.name}</span>
                </button>
              );
            })}
          </div>

          {/* Active Industry Detail Showcase Card */}
          <div className="bg-gradient-to-br from-slate-900 via-slate-900/90 to-slate-950 rounded-3xl p-6 sm:p-10 border border-slate-800 shadow-2xl relative overflow-hidden">
            <div
              className={`absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl ${activeIndustry.gradient} blur-3xl pointer-events-none -z-10`}
            />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              
              {/* Left Column Description */}
              <div className="lg:col-span-7 space-y-5 text-left">
                <span className="text-xs font-black uppercase px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  {activeIndustry.badge}
                </span>
                <h3 className="text-2xl sm:text-3xl font-black text-white leading-snug">
                  {activeIndustry.headline}
                </h3>
                <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                  {activeIndustry.description}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  {activeIndustry.highlights.map((h, i) => (
                    <div key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-200">
                      <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{h}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-4">
                  <Link href="/login">
                    <Button className="h-12 px-6 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black rounded-xl shadow-lg shadow-emerald-500/20">
                      <span>Gunakan Modul {activeIndustry.name}</span>
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Right Column Interactive Preview Card */}
              <div className="lg:col-span-5">
                <div className="rounded-2xl bg-slate-950 border border-slate-800 p-5 space-y-4 shadow-xl">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs">
                    <span className="font-bold text-slate-300">{activeIndustry.previewCard.title}</span>
                    <span className="text-emerald-400 font-mono font-black">{activeIndustry.previewCard.tag}</span>
                  </div>
                  <div className="space-y-2">
                    <span className="text-[11px] text-slate-400 uppercase tracking-wider block">Ringkasan Operasional</span>
                    <div className="text-lg font-black text-white">{activeIndustry.previewCard.metrics}</div>
                  </div>
                  <div className="bg-slate-900/90 rounded-xl p-3 text-xs text-slate-300 border border-slate-800/80">
                    <span className="text-slate-400 block text-[10px] uppercase font-bold mb-1">Item Terpilih</span>
                    {activeIndustry.previewCard.sampleItem}
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* 4. CORE FEATURES GRID */}
      <section id="fitur" className="py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="text-xs font-black uppercase tracking-widest text-emerald-400">
              Fitur Lengkap
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              Dirancang untuk Mempercepat Bisnis Anda
            </h2>
            <p className="text-slate-400 text-sm sm:text-base">
              Semua fitur penting yang Anda butuhkan untuk mencatat penjualan, mengontrol stok, dan membesarkan omzet bisnis.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
            
            {/* Feature 1 */}
            <div className="rounded-3xl bg-slate-900/60 border border-slate-800 p-6 sm:p-7 space-y-3.5 hover:border-emerald-500/50 transition-colors group">
              <div className="h-12 w-12 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20 group-hover:scale-110 transition-transform">
                <Calculator className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Kalkulator HPP & Resep Otomatis</h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                Hitung harga pokok penjualan (HPP) per porsi atau produk hingga ke mililiter sirup atau gram bumbu untuk margin laba maksimal.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="rounded-3xl bg-slate-900/60 border border-slate-800 p-6 sm:p-7 space-y-3.5 hover:border-emerald-500/50 transition-colors group">
              <div className="h-12 w-12 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center border border-amber-500/20 group-hover:scale-110 transition-transform">
                <Receipt className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Buku Kasbon & Piutang Pelanggan</h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                Catat piutang pelanggan tetap dengan rapi, terima pelunasan bertahap (cicilan), dan pantau total kasbon tanpa buku manual.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="rounded-3xl bg-slate-900/60 border border-slate-800 p-6 sm:p-7 space-y-3.5 hover:border-emerald-500/50 transition-colors group">
              <div className="h-12 w-12 rounded-2xl bg-blue-500/10 text-blue-400 flex items-center justify-center border border-blue-500/20 group-hover:scale-110 transition-transform">
                <Printer className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Cetak Struk Thermal & QRIS Dinamis</h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                Dukungan printer Bluetooth 58mm & 80mm. Tampilkan barcode QRIS langsung pada struk kasir untuk kemudahan pembayaran non-tunai.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="rounded-3xl bg-slate-900/60 border border-slate-800 p-6 sm:p-7 space-y-3.5 hover:border-emerald-500/50 transition-colors group">
              <div className="h-12 w-12 rounded-2xl bg-purple-500/10 text-purple-400 flex items-center justify-center border border-purple-500/20 group-hover:scale-110 transition-transform">
                <Users className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Staf Kasir & Shift Terisolasi</h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                Kasir login aman menggunakan Kode Toko & PIN 6-digit. Rekap kas awal, kas masuk, dan serah terima shift tercatat transparan.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="rounded-3xl bg-slate-900/60 border border-slate-800 p-6 sm:p-7 space-y-3.5 hover:border-emerald-500/50 transition-colors group">
              <div className="h-12 w-12 rounded-2xl bg-teal-500/10 text-teal-400 flex items-center justify-center border border-teal-500/20 group-hover:scale-110 transition-transform">
                <Smartphone className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Multi-Device PWA (HP, Tablet, PC)</h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                Akses dari perangkat apa pun secara fleksibel. Dapat di-install langsung ke layar utama ponsel (Home Screen) sebagai PWA cepat.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="rounded-3xl bg-slate-900/60 border border-slate-800 p-6 sm:p-7 space-y-3.5 hover:border-emerald-500/50 transition-colors group">
              <div className="h-12 w-12 rounded-2xl bg-rose-500/10 text-rose-400 flex items-center justify-center border border-rose-500/20 group-hover:scale-110 transition-transform">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Cloud Functions v2 & Realtime Backup</h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                Ditenagai serverless backend Google Cloud Run region Asia Tenggara. Data transaksi tersimpan aman dan terenkripsi real-time.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* 5. PRICING & TRIAL HIGHLIGHT */}
      <section id="harga" className="py-16 sm:py-24 bg-slate-900/40 border-t border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="text-xs font-black uppercase tracking-widest text-emerald-400">
              Biaya Berlangganan Transparan
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              Investasi Terjangkau untuk Pertumbuhan Bisnis
            </h2>
            <p className="text-slate-400 text-sm sm:text-base">
              Mulai gratis 30 hari penuh. Tingkatkan ke paket PRO kapan pun Anda siap.
            </p>

            {/* Monthly / Yearly Toggle */}
            <div className="pt-3 flex items-center justify-center gap-3">
              <span className={`text-xs font-bold ${!isYearlyBilling ? "text-white" : "text-slate-400"}`}>
                Bulanan
              </span>
              <button
                type="button"
                onClick={() => setIsYearlyBilling(!isYearlyBilling)}
                className="relative inline-flex h-6 w-11 items-center rounded-full bg-slate-800 border border-slate-700 cursor-pointer"
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-emerald-400 transition-transform ${
                    isYearlyBilling ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
              <span className={`text-xs font-bold ${isYearlyBilling ? "text-white" : "text-slate-400"}`}>
                Tahunan <span className="text-[10px] text-emerald-400 font-black bg-emerald-500/20 px-2 py-0.5 rounded-full ml-1">Hemat 20%</span>
              </span>
            </div>
          </div>

          {/* Pricing Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto text-left">
            
            {/* Plan 1: Free Trial 30 Hari */}
            <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6 sm:p-8 space-y-6 flex flex-col justify-between">
              <div className="space-y-4">
                <span className="text-xs font-black uppercase text-slate-400">Mulai Sekarang</span>
                <h3 className="text-xl font-black text-white">Trial 30 Hari</h3>
                <div className="text-3xl font-black text-emerald-400">
                  Rp 0 <span className="text-xs font-normal text-slate-400">/ 30 hari</span>
                </div>
                <p className="text-xs text-slate-400">
                  Akses penuh ke seluruh fitur modul industri tanpa batasan untuk mencoba sistem di bisnis Anda.
                </p>
                <div className="pt-2 space-y-2 text-xs text-slate-300">
                  <div className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-400" /><span>Akses 6 Modul Industri Lengkap</span></div>
                  <div className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-400" /><span>Cetak Struk Thermal & QRIS</span></div>
                  <div className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-400" /><span>Kalkulator HPP & Kasbon</span></div>
                  <div className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-400" /><span>Tanpa Kontrak & Tanpa Kartu Kredit</span></div>
                </div>
              </div>

              <Link href="/login" className="pt-6 block">
                <button
                  type="button"
                  className="w-full h-12 rounded-xl font-bold bg-slate-800/90 hover:bg-emerald-500/15 text-emerald-400 border border-emerald-500/40 hover:border-emerald-400 transition-all cursor-pointer shadow-sm text-sm"
                >
                  Coba Gratis Sekarang
                </button>
              </Link>
            </div>

            {/* Plan 2: PRO (Featured) */}
            <div className="rounded-3xl bg-gradient-to-b from-slate-900 via-slate-900 to-emerald-950/40 border-2 border-emerald-500/80 p-6 sm:p-8 space-y-6 flex flex-col justify-between relative shadow-2xl shadow-emerald-950/50">
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-black text-[10px] uppercase px-3 py-1 rounded-full shadow-md">
                Paling Populer
              </div>
              <div className="space-y-4">
                <span className="text-xs font-black uppercase text-emerald-400">Paket Profesional</span>
                <h3 className="text-xl font-black text-white">PRO UMKM</h3>
                <div className="text-3xl font-black text-white">
                  {isYearlyBilling ? "Rp 39.000" : "Rp 49.000"}
                  <span className="text-xs font-normal text-slate-400"> / bulan</span>
                </div>
                <p className="text-xs text-slate-300">
                  Solusi komplit tanpa batas produk dan transaksi untuk mendigitalkan seluruh operasional toko.
                </p>
                <div className="pt-2 space-y-2 text-xs text-slate-200">
                  <div className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-400" /><span>Semua Fitur Trial 30 Hari</span></div>
                  <div className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-400" /><span>Produk & Transaksi Tanpa Batas</span></div>
                  <div className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-400" /><span>Hingga 5 Akun Staf Kasir Terisolasi</span></div>
                  <div className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-400" /><span>Laporan Keuangan & Ekspor CSV/PDF</span></div>
                  <div className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-400" /><span>Dukungan Prioritas WhatsApp</span></div>
                </div>
              </div>

              <Link href="/login" className="pt-6 block">
                <button
                  type="button"
                  className="w-full h-12 rounded-xl font-black bg-gradient-to-r from-emerald-500 via-emerald-400 to-teal-400 hover:from-emerald-600 hover:to-teal-500 text-slate-950 shadow-lg shadow-emerald-500/30 transition-all hover:scale-[1.02] cursor-pointer text-sm"
                >
                  Langganan Paket PRO
                </button>
              </Link>
            </div>

            {/* Plan 3: Enterprise / Multi-Outlet */}
            <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6 sm:p-8 space-y-6 flex flex-col justify-between">
              <div className="space-y-4">
                <span className="text-xs font-black uppercase text-slate-400">Skala Besar</span>
                <h3 className="text-xl font-black text-white">Enterprise / Cabang</h3>
                <div className="text-3xl font-black text-white">
                  Rp 149.000 <span className="text-xs font-normal text-slate-400">/ bulan</span>
                </div>
                <p className="text-xs text-slate-400">
                  Cocok untuk pemilik bisnis dengan multi-cabang / waralaba yang membutuhkan sinkronisasi terpusat.
                </p>
                <div className="pt-2 space-y-2 text-xs text-slate-300">
                  <div className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-400" /><span>Semua Fitur Paket PRO</span></div>
                  <div className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-400" /><span>Multi-Outlet & Multi-Gudang</span></div>
                  <div className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-400" /><span>Kasir & Staf Tanpa Batas</span></div>
                  <div className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-400" /><span>Dedicated Account Manager</span></div>
                </div>
              </div>

              <Link href="/login" className="pt-6 block">
                <button
                  type="button"
                  className="w-full h-12 rounded-xl font-bold bg-slate-800/90 hover:bg-slate-750 text-slate-200 border border-slate-700 hover:border-slate-500 hover:bg-slate-700/60 transition-all cursor-pointer shadow-sm text-sm"
                >
                  Hubungi Tim Enterprise
                </button>
              </Link>
            </div>

          </div>

        </div>
      </section>

      {/* 6. FAQ ACCORDION */}
      <section id="faq" className="py-16 sm:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          
          <div className="text-center space-y-2">
            <span className="text-xs font-black uppercase tracking-widest text-emerald-400">
              Frequently Asked Questions
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              Pertanyaan yang Sering Diajukan
            </h2>
          </div>

          <div className="space-y-3 text-left">
            {FAQS.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div
                  key={idx}
                  className="rounded-2xl bg-slate-900/70 border border-slate-800 overflow-hidden transition-colors"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                    className="w-full px-5 sm:px-6 py-4 flex items-center justify-between text-left font-bold text-sm sm:text-base text-white hover:text-emerald-400 transition-colors cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      className={`h-4 w-4 text-slate-400 transition-transform ${
                        isOpen ? "transform rotate-180 text-emerald-400" : ""
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-5 sm:px-6 pb-4 pt-1 text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-slate-800/60 animate-in fade-in duration-150">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* 7. FINAL HIGH-CONVERSION CTA BANNER */}
      <section className="py-16 sm:py-20 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 p-8 sm:p-14 text-center text-slate-950 space-y-6 shadow-2xl shadow-emerald-600/30">
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-slate-950 tracking-tight">
            Siap Tingkatkan Omzet & Rapikan Finansial Usaha Anda?
          </h2>
          <p className="text-emerald-950 font-semibold text-sm sm:text-lg max-w-2xl mx-auto">
            Bergabunglah dengan ribuan pemilik bisnis kuliner, kedai kopi, retail, salon, dan laundry yang telah beralih ke POS UMKM Pro.
          </p>
          <div className="pt-2">
            <Link href="/login">
              <Button
                size="lg"
                className="h-14 px-8 text-base font-black bg-slate-950 hover:bg-slate-900 text-white rounded-2xl shadow-xl transition-all hover:scale-105"
              >
                <span>Daftar Sekarang • Gratis 30 Hari</span>
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* 8. FOOTER */}
      <footer className="border-t border-slate-850 bg-slate-950 py-12 text-slate-400 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-slate-950 font-black">
              <Store className="h-4 w-4" />
            </div>
            <div>
              <span className="font-bold text-slate-200">POS UMKM Pro</span>
              <span className="text-slate-500 ml-1.5">• umkm.omnifit.cloud</span>
            </div>
          </div>

          <div className="flex items-center gap-6 font-semibold">
            <a href="#industri" className="hover:text-emerald-400 transition-colors">Modul Usaha</a>
            <a href="#fitur" className="hover:text-emerald-400 transition-colors">Fitur</a>
            <a href="#harga" className="hover:text-emerald-400 transition-colors">Harga</a>
            <Link href="/login" className="hover:text-emerald-400 transition-colors">Login Kasir</Link>
          </div>

          <div className="text-center sm:text-right text-slate-500">
            © 2026 POS UMKM Pro by Omnifit Cloud. Hak Cipta Dilindungi.
          </div>
        </div>
      </footer>

    </div>
  );
}
