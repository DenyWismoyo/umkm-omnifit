"use client";

import React, { useState, useEffect, createContext, useContext } from "react";
import { Download, Smartphone, X, CheckCircle2, Share, PlusSquare, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";

interface PwaContextType {
  isInstallable: boolean;
  isInstalled: boolean;
  isIos: boolean;
  promptInstall: () => Promise<void>;
  openIosGuide: () => void;
}

const PwaContext = createContext<PwaContextType>({
  isInstallable: false,
  isInstalled: false,
  isIos: false,
  promptInstall: async () => {},
  openIosGuide: () => {},
});

export const usePwaInstall = () => useContext(PwaContext);

export function PwaProvider({ children }: { children: React.ReactNode }) {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIos, setIsIos] = useState(false);
  const [showIosModal, setShowIosModal] = useState(false);
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // 1. Register Service Worker
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .then((reg) => {
          console.log("PWA Service Worker registered successfully", reg.scope);
        })
        .catch((err) => {
          console.warn("PWA Service Worker registration failed", err);
        });
    }

    // 2. Check if already installed / standalone mode
    if (typeof window !== "undefined") {
      const isStandalone =
        window.matchMedia("(display-mode: standalone)").matches ||
        (window.navigator as any).standalone ||
        document.referrer.includes("android-app://");

      if (isStandalone) {
        setIsInstalled(true);
      }

      // 3. Detect iOS device
      const userAgent = window.navigator.userAgent.toLowerCase();
      const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
      setIsIos(isIosDevice);

      // 4. Capture beforeinstallprompt event (Android / Chromium)
      const handleBeforeInstallPrompt = (e: Event) => {
        e.preventDefault();
        setDeferredPrompt(e);

        // Check if user dismissed banner recently
        const dismissedAt = localStorage.getItem("pwa_banner_dismissed_at");
        const hoursSinceDismiss = dismissedAt
          ? (Date.now() - Number(dismissedAt)) / (1000 * 60 * 60)
          : 999;

        if (hoursSinceDismiss > 48 && !isStandalone) {
          // Delay banner display slightly for smooth page load
          setTimeout(() => setShowBanner(true), 3000);
        }
      };

      window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

      window.addEventListener("appinstalled", () => {
        setIsInstalled(true);
        setDeferredPrompt(null);
        setShowBanner(false);
        toast.success("Aplikasi POS UMKM berhasil di-install!");
      });

      return () => {
        window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      };
    }
  }, []);

  const promptInstall = async () => {
    if (isIos) {
      setShowIosModal(true);
      return;
    }

    if (!deferredPrompt) {
      toast.info("Aplikasi sudah terpasang atau gunakan opsi menu browser 'Install App'.");
      return;
    }

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setIsInstalled(true);
      setShowBanner(false);
      toast.success("Memulai instalasi POS UMKM Pro...");
    }
    setDeferredPrompt(null);
  };

  const handleDismissBanner = () => {
    setShowBanner(false);
    localStorage.setItem("pwa_banner_dismissed_at", Date.now().toString());
  };

  return (
    <PwaContext.Provider
      value={{
        isInstallable: !!deferredPrompt || isIos,
        isInstalled,
        isIos,
        promptInstall,
        openIosGuide: () => setShowIosModal(true),
      }}
    >
      {children}

      {/* Floating Bottom Install Banner (Mobile & Desktop) */}
      {showBanner && !isInstalled && (
        <div className="fixed bottom-20 sm:bottom-6 left-3 right-3 sm:left-auto sm:right-6 z-50 max-w-md bg-gradient-to-r from-slate-900 to-emerald-950 text-white p-3.5 sm:p-4 rounded-2xl shadow-2xl border border-emerald-500/30 flex items-center justify-between gap-3 animate-in slide-in-from-bottom duration-300">
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-slate-950 font-black shrink-0 shadow-md">
              <Smartphone className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 leading-tight">
                <span className="font-extrabold text-xs sm:text-sm truncate">
                  Install POS UMKM Pro
                </span>
                <span className="bg-emerald-500/20 text-emerald-400 text-[9px] font-bold px-1.5 py-0.2 rounded-full border border-emerald-500/30">
                  Cepat
                </span>
              </div>
              <p className="text-[10px] sm:text-xs text-slate-300 truncate mt-0.5">
                Buka kasir instan tanpa browser & hemat kuota.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <Button
              size="sm"
              onClick={promptInstall}
              className="touch-press bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black text-xs h-8 px-3 rounded-xl shadow-xs"
            >
              <Download className="h-3.5 w-3.5 mr-1" />
              <span>Install</span>
            </Button>
            <button
              onClick={handleDismissBanner}
              className="touch-press p-1 text-slate-400 hover:text-white rounded-lg"
              title="Tutup"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* iOS Safari Add to Home Screen Instructions Modal */}
      <Dialog open={showIosModal} onOpenChange={setShowIosModal}>
        <DialogContent className="max-w-sm rounded-3xl p-5 bg-white border border-slate-200 shadow-2xl text-slate-900">
          <DialogTitle className="text-base font-black flex items-center gap-2 text-slate-900">
            <Smartphone className="h-5 w-5 text-emerald-600" />
            <span>Install di iPhone / iPad</span>
          </DialogTitle>

          <p className="text-xs text-slate-600 leading-relaxed mt-1">
            Untuk menginstall POS UMKM Pro di perangkat Apple iOS, ikuti 2 langkah mudah berikut:
          </p>

          <div className="space-y-3 mt-3 bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80 text-xs">
            <div className="flex items-start gap-2.5">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 text-emerald-800 font-black text-xs shrink-0">
                1
              </div>
              <div className="space-y-0.5">
                <span className="font-bold text-slate-800 flex items-center gap-1">
                  Ketuk tombol Bagikan <Share className="h-3.5 w-3.5 text-blue-600 inline" />
                </span>
                <p className="text-[11px] text-slate-500">
                  Di bilah bawah browser Safari Anda.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 text-emerald-800 font-black text-xs shrink-0">
                2
              </div>
              <div className="space-y-0.5">
                <span className="font-bold text-slate-800 flex items-center gap-1">
                  Pilih &quot;Tambah ke Layar Utama&quot; <PlusSquare className="h-3.5 w-3.5 text-slate-700 inline" />
                </span>
                <p className="text-[11px] text-slate-500">
                  Gulir ke bawah dan ketuk &quot;Add to Home Screen&quot;.
                </p>
              </div>
            </div>
          </div>

          <Button
            onClick={() => setShowIosModal(false)}
            className="w-full mt-3 bg-emerald-600 hover:bg-emerald-700 font-bold text-xs h-9 rounded-xl"
          >
            Mengerti, Siap Pasang!
          </Button>
        </DialogContent>
      </Dialog>
    </PwaContext.Provider>
  );
}
