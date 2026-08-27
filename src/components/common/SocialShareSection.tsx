"use client";

import React, { useState } from "react";
import {
  Share2,
  Copy,
  Check,
  ExternalLink,
  MessageCircle,
  Send,
  Sparkles,
  QrCode,
  Globe,
  Smartphone,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export function SocialShareSection() {
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedPromo, setCopiedPromo] = useState(false);

  const baseShareUrl = "https://umkm.omnifit.cloud/?share=wa";
  const promoText = `🚀 *POS UMKM Pro - Aplikasi Kasir Online & HPP Resep Multi-Industri*

Kelola usaha Anda lebih praktis dari HP & PC:
✅ Mesin Kasir POS & Cetak Struk Bluetooth
✅ Kalkulator HPP Otomatis (111+ Resep UMKM)
✅ 6 Modul Industri (Resto, Coffee Shop, Retail, Salon, Laundry)
✅ Buku Kasbon & Piutang Pelanggan
✅ QRIS Dinamis & Real-time Cloud Backup

🎉 *Coba Gratis Trial 30 Hari Penuh Tanpa Syarat!*
👉 Klik tautan: ${baseShareUrl}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(baseShareUrl);
    setCopiedLink(true);
    toast.success("Tautan share berhasil disalin ke papan klip!");
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleCopyPromo = () => {
    navigator.clipboard.writeText(promoText);
    setCopiedPromo(true);
    toast.success("Teks pesan promosi WhatsApp berhasil disalin!");
    setTimeout(() => setCopiedPromo(false), 2500);
  };

  const shareTargets = [
    {
      name: "WhatsApp",
      icon: <MessageCircle className="h-5 w-5" />,
      color: "bg-[#25D366] hover:bg-[#20bd5a] text-white shadow-[#25D366]/30",
      url: `https://api.whatsapp.com/send?text=${encodeURIComponent(promoText)}`,
    },
    {
      name: "Telegram",
      icon: <Send className="h-5 w-5" />,
      color: "bg-[#229ED9] hover:bg-[#1e8cc0] text-white shadow-[#229ED9]/30",
      url: `https://t.me/share/url?url=${encodeURIComponent("https://umkm.omnifit.cloud/?share=tg")}&text=${encodeURIComponent("POS UMKM Pro - Aplikasi Kasir Online & Manajemen Usaha Modern")}`,
    },
    {
      name: "Facebook",
      icon: (
        <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
      ),
      color: "bg-[#1877F2] hover:bg-[#1465d2] text-white shadow-[#1877F2]/30",
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent("https://umkm.omnifit.cloud/?share=fb")}`,
    },
    {
      name: "Twitter / X",
      icon: (
        <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      ),
      color: "bg-slate-900 hover:bg-black text-white border border-slate-700 shadow-slate-900/30",
      url: `https://twitter.com/intent/tweet?url=${encodeURIComponent("https://umkm.omnifit.cloud/?share=tw")}&text=${encodeURIComponent("Kelola usaha makin mudah dengan POS UMKM Pro. Kasir online, stok, HPP & struk QRIS.")}`,
    },
    {
      name: "LinkedIn",
      icon: (
        <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
        </svg>
      ),
      color: "bg-[#0A66C2] hover:bg-[#08529c] text-white shadow-[#0A66C2]/30",
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent("https://umkm.omnifit.cloud/?share=li")}`,
    },
  ];

  return (
    <section id="share" className="py-16 sm:py-24 relative overflow-hidden">
      {/* Glow Ambient background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-96 w-96 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-10">
        
        {/* Section Header */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 text-xs font-bold text-emerald-400">
            <Share2 className="h-3.5 w-3.5" />
            <span>Bagikan Aplikasi & Ajak Rekan Bisnis</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            Bagikan POS UMKM Pro ke Media Sosial
          </h2>
          <p className="text-xs sm:text-sm text-slate-300">
            Preview banner gambar resolusi tinggi dan deskripsi resmi otomatis muncul saat link dibagikan di WhatsApp, Telegram, Facebook, dan Twitter.
          </p>
        </div>

        {/* 2-Column Layout: OpenGraph Live Preview & 1-Click Action Buttons */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left: OpenGraph Live Card Preview Mockup (7 cols) */}
          <div className="lg:col-span-7 space-y-3">
            <div className="flex items-center justify-between px-1">
              <span className="text-[11px] font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Globe className="h-3.5 w-3.5 text-emerald-400" />
                <span>Live OpenGraph Social Card Preview</span>
              </span>
              <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
                1200 x 630 HD Banner
              </span>
            </div>

            {/* Social Card Box */}
            <div className="rounded-3xl border border-slate-700 bg-slate-900/90 shadow-2xl overflow-hidden group hover:border-emerald-500/50 transition-all">
              {/* Banner Image Preview */}
              <div className="relative aspect-[1200/630] w-full bg-slate-950 overflow-hidden border-b border-slate-800">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/og-image.png"
                  alt="POS UMKM Pro OpenGraph Banner Preview"
                  className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute bottom-3 right-3 bg-slate-950/80 backdrop-blur-md px-2.5 py-1 rounded-lg border border-slate-700 text-[10px] font-mono text-slate-300">
                  og-image.png (91KB)
                </div>
              </div>

              {/* Text Card Info */}
              <div className="p-5 sm:p-6 space-y-2 bg-gradient-to-b from-slate-900 to-slate-950">
                <span className="text-[11px] font-mono text-emerald-400 tracking-wide uppercase font-bold block">
                  umkm.omnifit.cloud
                </span>
                <h3 className="text-base sm:text-lg font-black text-white leading-snug">
                  POS UMKM Pro - Aplikasi Kasir Online & Manajemen Usaha Multi-Industri
                </h3>
                <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                  Aplikasi Kasir Modern & Kalkulator HPP Cerdas untuk UMKM: F&B Resto, Kedai Kopi, Retail, Salon, dan Laundry. Coba Gratis Trial 30 Hari Penuh!
                </p>
              </div>
            </div>
          </div>

          {/* Right: 1-Click Share & Copy Actions (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Quick Share Buttons Grid */}
            <div className="space-y-2.5">
              <span className="text-[11px] font-black uppercase tracking-wider text-slate-400 block px-1">
                Kirim Langsung 1-Klik:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {shareTargets.map((item) => (
                  <a
                    key={item.name}
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`touch-press flex items-center justify-center gap-2 px-4 py-3 rounded-2xl font-bold text-xs shadow-md transition-all hover:scale-102 cursor-pointer ${item.color}`}
                  >
                    {item.icon}
                    <span>Share ke {item.name}</span>
                  </a>
                ))}
              </div>
            </div>

            {/* Copy Share Link Input Bar */}
            <div className="space-y-2 rounded-2xl bg-slate-900/80 border border-slate-800 p-4">
              <label className="text-[11px] font-bold text-slate-300 flex items-center justify-between">
                <span>Tautan Resmi Share (Auto OpenGraph):</span>
                <span className="text-[10px] text-emerald-400 font-mono">Query Param ?share=wa</span>
              </label>
              
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={baseShareUrl}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono text-slate-200 select-all focus:outline-none focus:border-emerald-500"
                />
                <Button
                  type="button"
                  onClick={handleCopyLink}
                  size="sm"
                  className={`h-9 px-3.5 text-xs font-black shrink-0 transition-all cursor-pointer ${
                    copiedLink
                      ? "bg-emerald-500 text-slate-950"
                      : "bg-emerald-600 hover:bg-emerald-500 text-slate-950 shadow-md"
                  }`}
                >
                  {copiedLink ? (
                    <>
                      <Check className="h-3.5 w-3.5 mr-1" />
                      <span>Tersalin</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5 mr-1" />
                      <span>Salin Link</span>
                    </>
                  )}
                </Button>
              </div>
            </div>

            {/* Copy Full WhatsApp Broadcast Message */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MessageCircle className="h-4 w-4 text-[#25D366]" />
                  <span className="text-xs font-bold text-white">
                    Format Pesan Broadcast Siap Kirim
                  </span>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleCopyPromo}
                  className="h-7 text-[11px] font-bold border-slate-700 bg-slate-800 text-slate-200 hover:bg-slate-700 gap-1 cursor-pointer"
                >
                  {copiedPromo ? (
                    <>
                      <Check className="h-3 w-3 text-emerald-400" />
                      <span className="text-emerald-400">Tersalin</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3 w-3" />
                      <span>Salin Teks Lengkap</span>
                    </>
                  )}
                </Button>
              </div>

              <p className="text-[11px] text-slate-400 line-clamp-3 bg-slate-950/80 p-2.5 rounded-xl border border-slate-850 font-mono">
                {promoText}
              </p>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
