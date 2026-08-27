"use client";

import React, { useEffect, useState, useMemo, useRef, use } from "react";
import {
  getStoreByCode,
  getShopProfile,
  subscribeIncomingOrders,
} from "@/services/firestore";
import { IncomingOrder, ShopProfile, StoreCodeMapping } from "@/types";
import { resolveBrandColors } from "@/data/brandingThemes";
import {
  Tv,
  ChefHat,
  BellRing,
  Volume2,
  VolumeX,
  Maximize,
  Clock,
  Sparkles,
  Utensils,
  Store,
  CheckCircle2,
  RotateCcw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function TvQueueDisplayPage({
  params,
}: {
  params: Promise<{ storeCode: string }>;
}) {
  const resolvedParams = use(params);
  const rawStoreCode = resolvedParams.storeCode;
  const storeCode = decodeURIComponent(rawStoreCode).toUpperCase().trim();

  const [storeMapping, setStoreMapping] = useState<StoreCodeMapping | null>(null);
  const [shopProfile, setShopProfile] = useState<ShopProfile | null>(null);
  const [orders, setOrders] = useState<IncomingOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [currentTime, setCurrentTime] = useState<string>("");

  const prevReadyOrderIds = useRef<Set<string>>(new Set());

  // Clock Ticker
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString("id-ID", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
      );
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Text to Speech Voice Announcer (Bahasa Indonesia)
  const speakAnnouncement = (text: string) => {
    if (!soundEnabled || typeof window === "undefined" || !("speechSynthesis" in window))
      return;

    try {
      window.speechSynthesis.cancel(); // Stop any pending speech
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "id-ID";
      utterance.rate = 0.92;
      utterance.pitch = 1.05;

      // Try finding Indonesian voice
      const voices = window.speechSynthesis.getVoices();
      const idVoice = voices.find(
        (v) => v.lang.startsWith("id") || v.name.toLowerCase().includes("indonesia")
      );
      if (idVoice) utterance.voice = idVoice;

      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn("Speech synthesis error:", e);
    }
  };

  // Play Bell Chime Audio
  const playBellChime = () => {
    if (!soundEnabled) return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(587.33, ctx.currentTime);
      osc.frequency.setValueAtTime(880, ctx.currentTime + 0.15);
      gain.gain.setValueAtTime(0.4, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.65);
    } catch (e) {
      console.warn("Audio chime error:", e);
    }
  };

  // Fetch Store Info
  useEffect(() => {
    async function loadStore() {
      try {
        setLoading(true);
        const mapping = await getStoreByCode(storeCode);
        if (!mapping || !mapping.isActive) {
          setStoreMapping(null);
          setLoading(false);
          return;
        }

        setStoreMapping(mapping);
        const profile = await getShopProfile(mapping.ownerUid);
        setShopProfile(profile);
      } catch (err) {
        console.error("Error loading store for TV display:", err);
      } finally {
        setLoading(false);
      }
    }
    loadStore();
  }, [storeCode]);

  // Subscribe to Live Orders
  useEffect(() => {
    if (!storeMapping?.ownerUid) return;

    const unsub = subscribeIncomingOrders(storeMapping.ownerUid, (orderList) => {
      setOrders(orderList);

      // Check for newly ready orders to trigger voice announcement
      const currentReadyOrders = orderList.filter((o) => o.status === "READY");
      currentReadyOrders.forEach((o) => {
        if (!prevReadyOrderIds.current.has(o.id) && prevReadyOrderIds.current.size > 0) {
          playBellChime();
          setTimeout(() => {
            const rawNum = o.orderNumber.replace("ORD-", "");
            speakAnnouncement(
              `Nomor pesanan ${rawNum}, untuk ${o.tableNumber}, pesanan siap disajikan.`
            );
          }, 400);
        }
      });

      prevReadyOrderIds.current = new Set(orderList.map((o) => o.id));
    });

    return () => unsub();
  }, [storeMapping, soundEnabled]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  // Filter Active Orders
  const cookingOrders = useMemo(() => {
    return orders.filter((o) => o.status === "PENDING" || o.status === "COOKING" || o.status === "ACCEPTED");
  }, [orders]);

  const readyOrders = useMemo(() => {
    return orders.filter((o) => o.status === "READY");
  }, [orders]);

  const brand = useMemo(() => resolveBrandColors(shopProfile), [shopProfile]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent mb-4" />
        <h2 className="text-lg font-black tracking-wide">Menghubungkan Layar Antrean TV...</h2>
      </div>
    );
  }

  if (!storeMapping) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white p-6 text-center">
        <Store className="h-16 w-16 text-rose-400 mb-4" />
        <h1 className="text-2xl font-black">Kode Toko &quot;{storeCode}&quot; Tidak Ditemukan</h1>
        <p className="text-sm text-slate-400 max-w-md mt-2">
          Pastikan kode toko telah dibuat di menu Pengaturan aplikasi POS.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col overflow-hidden select-none font-sans">
      {/* TV Header Bar with Dynamic Brand Colors */}
      <header
        className="px-6 py-4 border-b border-slate-800 flex items-center justify-between shrink-0 shadow-lg"
        style={{
          background: `linear-gradient(135deg, ${brand.darkBg} 0%, #090d16 100%)`,
        }}
      >
        <div className="flex items-center gap-3">
          <div
            className="flex h-11 w-11 items-center justify-center rounded-2xl text-white font-black shadow-md"
            style={{ backgroundColor: brand.primary }}
          >
            <Utensils className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-black text-white tracking-tight">
              {shopProfile?.shopName || storeMapping.shopName}
            </h1>
            <p
              className="text-xs font-bold uppercase tracking-wider"
              style={{ color: brand.secondary }}
            >
              {shopProfile?.tagline || "Layar Antrean Pesanan & Dapur (Live)"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Realtime Digital Clock */}
          <div className="hidden sm:flex items-center gap-2 bg-slate-900 border border-slate-800 px-4 py-1.5 rounded-2xl">
            <Clock className="h-4 w-4 animate-pulse" style={{ color: brand.secondary }} />
            <span className="font-mono font-black text-base text-white tracking-widest">
              {currentTime || "--:--:--"}
            </span>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setSoundEnabled(!soundEnabled);
                toast.info(soundEnabled ? "Suara panggilan dinonaktifkan" : "Suara panggilan diaktifkan");
              }}
              className={`p-2.5 rounded-xl border transition-all ${
                soundEnabled
                  ? "bg-emerald-600 text-white border-emerald-500 shadow-xs"
                  : "bg-slate-900 text-slate-400 border-slate-800"
              }`}
              title={soundEnabled ? "Matikan Panggilan Suara" : "Aktifkan Panggilan Suara"}
            >
              {soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
            </button>

            <button
              type="button"
              onClick={() => {
                playBellChime();
                setTimeout(() => {
                  speakAnnouncement("Uji coba suara panggilan antrean restoran siap digunakan.");
                }, 300);
              }}
              className="px-3 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-bold rounded-xl text-slate-300 hidden md:block"
            >
              Test Suara
            </button>

            <button
              type="button"
              onClick={toggleFullscreen}
              className="p-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 rounded-xl"
              title="Layar Penuh (Fullscreen)"
            >
              <Maximize className="h-4 w-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Dual Column TV Grid */}
      <main className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 p-4 sm:p-6 overflow-hidden">
        {/* COLUMN 1: SEDANG DISIAPKAN (COOKING) */}
        <section className="bg-gradient-to-b from-slate-900/90 to-slate-950/90 border border-amber-500/30 rounded-3xl p-5 flex flex-col shadow-2xl overflow-hidden">
          <div className="flex items-center justify-between pb-3 border-b border-amber-500/20 shrink-0">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-500 text-slate-950 font-black shadow-md">
                <ChefHat className="h-5 w-5 animate-pulse" />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-black text-amber-300">
                  SEDANG DISIAPKAN
                </h2>
                <p className="text-xs text-amber-200/70">
                  Dalam proses masak di dapur ({cookingOrders.length})
                </p>
              </div>
            </div>
            <span className="h-3 w-3 rounded-full bg-amber-400 animate-ping" />
          </div>

          <div className="flex-1 overflow-y-auto pt-4 space-y-3 no-scrollbar">
            {cookingOrders.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-20 text-slate-600">
                <ChefHat className="h-16 w-16 mb-2 opacity-30" />
                <p className="font-bold text-sm text-slate-500">Dapur Sedang Santai</p>
                <p className="text-xs text-slate-600">Tidak ada antrean pesanan.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {cookingOrders.map((o) => (
                  <div
                    key={o.id}
                    className="p-4 rounded-2xl bg-slate-900 border border-amber-500/30 hover:border-amber-400 transition-all flex items-center justify-between shadow-lg space-y-1"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-black text-lg text-amber-300">
                          #{o.orderNumber}
                        </span>
                        <span className="text-xs font-black bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded-lg">
                          {o.tableNumber}
                        </span>
                      </div>
                      <p className="text-xs font-medium text-slate-300 truncate max-w-[150px] mt-1">
                        {o.customerName} • {o.totalQty} Item
                      </p>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] font-bold text-amber-400 block">
                        ⏳ Dimasak
                      </span>
                      <span className="text-[11px] text-slate-500 font-mono">
                        {new Date(o.createdAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* COLUMN 2: SIAP DISAJIKAN / DIAMBIL (READY) */}
        <section className="bg-gradient-to-b from-slate-900/90 to-emerald-950/40 border border-emerald-500/40 rounded-3xl p-5 flex flex-col shadow-2xl overflow-hidden">
          <div className="flex items-center justify-between pb-3 border-b border-emerald-500/20 shrink-0">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-500 text-slate-950 font-black shadow-md shadow-emerald-500/20">
                <BellRing className="h-5 w-5 animate-bounce" />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-black text-emerald-400">
                  SIAP DIAMBIL / DISAJIKAN
                </h2>
                <p className="text-xs text-emerald-300/70">
                  Pesanan selesai disiapkan ({readyOrders.length})
                </p>
              </div>
            </div>
            <span className="h-3 w-3 rounded-full bg-emerald-400 animate-ping" />
          </div>

          <div className="flex-1 overflow-y-auto pt-4 space-y-3 no-scrollbar">
            {readyOrders.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-20 text-slate-600">
                <Utensils className="h-16 w-16 mb-2 opacity-30" />
                <p className="font-bold text-sm text-slate-500">Belum Ada Pesanan Siap</p>
                <p className="text-xs text-slate-600">Pesanan yang selesai akan tampil di sini.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {readyOrders.map((o) => (
                  <div
                    key={o.id}
                    className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/80 to-slate-900 border-2 border-emerald-500/60 shadow-xl flex items-center justify-between animate-in zoom-in-95 duration-300"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-black text-xl text-white">
                          #{o.orderNumber}
                        </span>
                        <span className="text-xs font-black bg-emerald-500 text-slate-950 px-2 py-0.5 rounded-lg shadow-xs">
                          {o.tableNumber}
                        </span>
                      </div>
                      <p className="text-xs font-bold text-emerald-300 truncate max-w-[150px] mt-1">
                        👤 {o.customerName}
                      </p>
                    </div>

                    <div className="text-right">
                      <span className="text-xs font-black bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 px-2 py-0.5 rounded-full inline-block animate-pulse">
                        🍽️ SIAP SAJI
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>

      {/* Bottom Running Marquee */}
      <footer className="px-6 py-2.5 bg-slate-950 border-t border-slate-900 text-center text-xs text-slate-400 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <span
            className="h-2 w-2 rounded-full animate-pulse"
            style={{ backgroundColor: brand.primary }}
          />
          <span className="font-medium text-slate-400">
            {shopProfile?.hideWatermark
              ? `${shopProfile?.shopName || "Restoran"} Smart Kitchen Display`
              : "Powered by POS UMKM Smart Kitchen Engine"}
          </span>
        </div>
        <span className="text-[11px] text-slate-400 font-mono">
          Kode Toko: <strong>{storeCode}</strong>
        </span>
      </footer>
    </div>
  );
}
