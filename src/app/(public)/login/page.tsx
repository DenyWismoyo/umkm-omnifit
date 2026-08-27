"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Store,
  Sparkles,
  ShieldCheck,
  Zap,
  TrendingUp,
  Receipt,
  Users,
  CheckCircle2,
  Loader2,
  KeyRound,
  UserCheck,
  Building2,
  ArrowLeft,
  Lock,
  ChevronRight,
  Coffee,
  ShoppingBag,
  Scissors,
  Shirt,
  UtensilsCrossed,
  Calculator,
} from "lucide-react";
import { toast } from "sonner";

export default function LoginPage() {
  const {
    user,
    signInWithGoogle,
    loginWithStoreCodeAndPin,
    loading,
    activeRole,
    shopProfile,
  } = useAuth();
  const [signingIn, setSigningIn] = useState(false);
  const [loginTab, setLoginTab] = useState<"owner" | "cashier">("owner");

  // Cashier Anonymous Login state
  const [storeCodeInput, setStoreCodeInput] = useState<string>("");
  const [pinInput, setPinInput] = useState<string>("");
  const [isVerifyingPin, setIsVerifyingPin] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Load last used store code from localStorage for cashier convenience
    const savedLastCode = localStorage.getItem("pos_last_store_code");
    if (savedLastCode) {
      setStoreCodeInput(savedLastCode);
    }
  }, []);

  useEffect(() => {
    if (!loading && user) {
      if (activeRole === "cashier") {
        router.replace("/pos");
      } else if (!shopProfile || !shopProfile.industry || !shopProfile.shopName) {
        router.replace("/onboarding");
      } else {
        router.replace("/dashboard");
      }
    }
  }, [user, loading, activeRole, router, shopProfile]);

  const handleGoogleLogin = async () => {
    try {
      setSigningIn(true);
      await signInWithGoogle();
      toast.success("Login berhasil! Selamat datang di POS UMKM.");
    } catch (error: any) {
      console.error(error);
      if (error?.code !== "auth/popup-closed-by-user") {
        toast.error("Gagal masuk dengan Google: " + (error?.message || "Coba lagi"));
      }
    } finally {
      setSigningIn(false);
    }
  };

  const handleKeypadPress = (digit: string) => {
    if (pinInput.length < 6) {
      setPinInput((prev) => prev + digit);
    }
  };

  const handleBackspace = () => {
    setPinInput((prev) => prev.slice(0, -1));
  };

  const handleClear = () => {
    setPinInput("");
  };

  const handleCashierLoginSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!storeCodeInput.trim()) {
      toast.error("Masukkan Kode Toko yang diberikan pemilik toko!");
      return;
    }
    if (pinInput.length < 4) {
      toast.error("PIN Kasir minimal 4 digit angka!");
      return;
    }

    try {
      setIsVerifyingPin(true);
      const res = await loginWithStoreCodeAndPin(storeCodeInput, pinInput);
      if (res.success) {
        localStorage.setItem("pos_last_store_code", storeCodeInput.toUpperCase().trim());
        toast.success(res.message);
        router.push("/pos");
      } else {
        toast.error(res.message);
        setPinInput("");
      }
    } catch (err: any) {
      toast.error("Gagal masuk kasir: " + err.message);
    } finally {
      setIsVerifyingPin(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-400" />
          <p className="text-xs font-semibold text-slate-400">Memeriksa sesi pengguna...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen lg:h-screen lg:overflow-hidden flex flex-col lg:flex-row bg-slate-950 text-slate-100 selection:bg-emerald-500 selection:text-white font-sans">
      
      {/* LEFT SHOWCASE PANEL (Compact on Desktop, Informative & Synced with Homepage) */}
      <div className="relative flex-1 flex flex-col justify-between p-6 sm:p-8 lg:p-10 xl:p-12 overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950/70 border-b lg:border-b-0 lg:border-r border-slate-800/80">
        
        {/* Glow decoration */}
        <div className="absolute -top-24 -left-24 h-80 w-80 rounded-full bg-emerald-500/15 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 h-80 w-80 rounded-full bg-teal-500/15 blur-3xl pointer-events-none" />

        {/* Top Branding & Home Link */}
        <div className="relative z-10 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-slate-950 shadow-lg shadow-emerald-500/25 group-hover:scale-105 transition-transform">
              <Store className="h-5 w-5 sm:h-6 sm:w-6" />
            </div>
            <div>
              <span className="text-base sm:text-lg font-black tracking-tight text-white flex items-center gap-1">
                POS UMKM <span className="text-emerald-400">Pro</span>
              </span>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                by Omnifit Cloud
              </p>
            </div>
          </Link>

          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-emerald-400 transition-colors bg-slate-900/80 hover:bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-800"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Kembali ke Beranda</span>
          </Link>
        </div>

        {/* Center Pitch & Industry Badges */}
        <div className="relative z-10 my-auto py-6 sm:py-8 space-y-4 max-w-xl">
          
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-[11px] font-bold text-emerald-400 backdrop-blur-sm">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Sistem Kasir Cloud Multi-Industri</span>
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white leading-tight">
            Kelola Transaksi, Stok & HPP Usaha dalam Satu Tempat.
          </h2>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
            Solusi kasir lengkap untuk F&B, Coffee Shop, Retail, Salon, Laundry, dan Toko Umum. Kasir staf dapat login instan dengan <strong>Kode Toko & PIN</strong> tanpa perlu akun email pribadi pemilik.
          </p>

          {/* 6 Industry Pills */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            {[
              { name: "🍽️ F&B", color: "text-amber-300 bg-amber-500/10 border-amber-500/20" },
              { name: "☕ Coffee Shop", color: "text-yellow-300 bg-yellow-500/10 border-yellow-500/20" },
              { name: "🛒 Retail", color: "text-emerald-300 bg-emerald-500/10 border-emerald-500/20" },
              { name: "✂️ Salon", color: "text-rose-300 bg-rose-500/10 border-rose-500/20" },
              { name: "🧺 Laundry", color: "text-blue-300 bg-blue-500/10 border-blue-500/20" },
              { name: "🏢 Universal", color: "text-purple-300 bg-purple-500/10 border-purple-500/20" },
            ].map((ind, i) => (
              <span
                key={i}
                className={`text-[11px] font-bold px-2.5 py-1 rounded-lg border ${ind.color}`}
              >
                {ind.name}
              </span>
            ))}
          </div>

          {/* 4 Compact Features Cards (2x2 Grid) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-3">
            <div className="flex items-start gap-2.5 rounded-xl border border-slate-800/80 bg-slate-900/60 p-2.5 backdrop-blur-sm">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-500/15 text-emerald-400">
                <Zap className="h-4 w-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-200">Kasir Cepat & Struk</h4>
                <p className="text-[10px] text-slate-400">Cetak printer Bluetooth 58/80mm & QRIS dinamis.</p>
              </div>
            </div>

            <div className="flex items-start gap-2.5 rounded-xl border border-slate-800/80 bg-slate-900/60 p-2.5 backdrop-blur-sm">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-teal-500/15 text-teal-400">
                <Calculator className="h-4 w-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-200">Kalkulator HPP Resep</h4>
                <p className="text-[10px] text-slate-400">Hitung modal porsi & laba bersih harian.</p>
              </div>
            </div>

            <div className="flex items-start gap-2.5 rounded-xl border border-slate-800/80 bg-slate-900/60 p-2.5 backdrop-blur-sm">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-500/15 text-amber-400">
                <Receipt className="h-4 w-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-200">Buku Kasbon Piutang</h4>
                <p className="text-[10px] text-slate-400">Catat hutang pelanggan & terima cicilan.</p>
              </div>
            </div>

            <div className="flex items-start gap-2.5 rounded-xl border border-slate-800/80 bg-slate-900/60 p-2.5 backdrop-blur-sm">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-purple-500/15 text-purple-400">
                <ShieldCheck className="h-4 w-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-200">Trial 30 Hari & Keamanan</h4>
                <p className="text-[10px] text-slate-400">Akses penuh PRO & data terisolasi aman.</p>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom copyright */}
        <div className="relative z-10 pt-4 border-t border-slate-850 flex items-center justify-between text-[11px] text-slate-500">
          <span>© 2026 POS UMKM Pro • Omnifit Cloud</span>
          <span className="text-emerald-500/80 font-mono">v2.0 Asia-Southeast1</span>
        </div>
      </div>

      {/* RIGHT LOGIN CARD (Compact, 1 Screen Height on Desktop, Clean Dark Glassmorphic) */}
      <div className="flex w-full lg:w-[460px] xl:w-[500px] flex-col justify-center bg-slate-950 p-6 sm:p-8 lg:p-10 text-slate-100 shadow-2xl relative">
        
        <div className="w-full max-w-sm mx-auto space-y-5">
          
          {/* Header */}
          <div className="text-left space-y-1">
            <span className="text-[11px] font-black uppercase tracking-widest text-emerald-400">
              Gerbang Masuk Aplikasi
            </span>
            <h3 className="text-xl sm:text-2xl font-black tracking-tight text-white">
              Masuk ke POS UMKM
            </h3>
            <p className="text-xs text-slate-400">
              Pilih peran Anda untuk mulai mengelola toko atau melayani transaksi kasir.
            </p>
          </div>

          {/* Role Tabs */}
          <Tabs
            value={loginTab}
            onValueChange={(v) => setLoginTab(v as any)}
            className="w-full"
          >
            <TabsList className="grid grid-cols-2 w-full h-11 rounded-xl bg-slate-900 border border-slate-800 p-1">
              <TabsTrigger
                value="owner"
                className="flex items-center justify-center gap-1.5 text-xs font-bold rounded-lg data-[state=active]:bg-emerald-500 data-[state=active]:text-slate-950 text-slate-300 transition-all cursor-pointer"
              >
                <Store className="h-3.5 w-3.5" />
                <span>Pemilik Toko</span>
              </TabsTrigger>
              <TabsTrigger
                value="cashier"
                className="flex items-center justify-center gap-1.5 text-xs font-bold rounded-lg data-[state=active]:bg-amber-500 data-[state=active]:text-slate-950 text-slate-300 transition-all cursor-pointer"
              >
                <UserCheck className="h-3.5 w-3.5" />
                <span>Login Kasir</span>
              </TabsTrigger>
            </TabsList>

            {/* TAB OWNER (GOOGLE LOGIN) */}
            <TabsContent value="owner" className="space-y-4 pt-3 text-left">
              
              <div className="rounded-2xl border border-emerald-500/20 bg-emerald-950/20 p-3.5 space-y-1.5 text-xs text-slate-300">
                <div className="flex items-center gap-2 font-bold text-emerald-400">
                  <CheckCircle2 className="h-4 w-4 shrink-0" />
                  <span>Akses Penuh Pemilik (Owner)</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed pl-6">
                  Masuk dengan akun Google untuk membuka seluruh dashboard penjualan, HPP resep, modul industri, kasbon, dan pengaturan staf.
                </p>
              </div>

              {/* Google Login Button */}
              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={signingIn}
                className="w-full h-12 rounded-xl bg-slate-900 hover:bg-slate-850 text-white border border-slate-700 hover:border-slate-500 shadow-lg flex items-center justify-center gap-3 text-xs sm:text-sm font-bold transition-all active:scale-[0.98] cursor-pointer"
              >
                {signingIn ? (
                  <Loader2 className="h-5 w-5 animate-spin text-emerald-400" />
                ) : (
                  <svg className="h-5 w-5 shrink-0" viewBox="0 0 24 24">
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                      fill="#EA4335"
                    />
                  </svg>
                )}
                <span>{signingIn ? "Menghubungkan Akun Google..." : "Lanjutkan dengan Google"}</span>
              </button>

              <div className="text-center pt-2">
                <span className="text-[11px] text-slate-500">
                  Pengguna baru otomatis mendapatkan <strong className="text-emerald-400">Trial 30 Hari PRO Gratis</strong>.
                </span>
              </div>
            </TabsContent>

            {/* TAB CASHIER (ANONYMOUS LOGIN VIA KODE TOKO & PIN) */}
            <TabsContent value="cashier" className="space-y-3 pt-2 text-left">
              
              <div className="rounded-xl border border-amber-500/20 bg-amber-950/20 p-2.5 text-[11px] text-amber-300 space-y-0.5">
                <p className="font-bold flex items-center gap-1.5 text-amber-400">
                  <KeyRound className="h-3.5 w-3.5" />
                  <span>Login Kasir (Tanpa Akun Email)</span>
                </p>
                <p className="text-slate-400 leading-tight">
                  Masukkan <strong>Kode Toko</strong> & <strong>PIN Kasir</strong> dari pemilik untuk mulai transaksi.
                </p>
              </div>

              {/* Form Input Kode Toko & PIN */}
              <form onSubmit={handleCashierLoginSubmit} className="space-y-2.5 text-xs">
                <div>
                  <label className="font-bold text-slate-300 block mb-1 text-[11px]">
                    Kode Toko (dari Pemilik):
                  </label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-500" />
                    <Input
                      type="text"
                      value={storeCodeInput}
                      onChange={(e) => setStoreCodeInput(e.target.value.toUpperCase())}
                      placeholder="CONTOH: TK-849201"
                      className="pl-8 h-9 font-mono font-bold tracking-wider uppercase text-white bg-slate-900 border-slate-700 text-xs focus:border-amber-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-300 block mb-1 text-[11px]">
                    PIN Kasir (4-6 Digit):
                  </label>
                  <Input
                    type="password"
                    maxLength={6}
                    value={pinInput}
                    onChange={(e) => setPinInput(e.target.value)}
                    placeholder="• • • •"
                    className="text-center text-lg tracking-[0.4em] font-mono font-black h-10 bg-slate-900 border-amber-500/50 text-amber-400"
                  />
                </div>

                {/* Compact Keypad */}
                <div className="grid grid-cols-3 gap-1 max-w-[200px] mx-auto pt-0.5">
                  {["1", "2", "3", "4", "5", "6", "7", "8", "9"].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => handleKeypadPress(num)}
                      className="h-8 text-xs font-bold rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 transition-colors cursor-pointer active:scale-95"
                    >
                      {num}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={handleClear}
                    className="h-8 text-[10px] font-bold text-slate-400 hover:text-slate-200 rounded-lg bg-slate-900/50 cursor-pointer"
                  >
                    Clear
                  </button>
                  <button
                    type="button"
                    onClick={() => handleKeypadPress("0")}
                    className="h-8 text-xs font-bold rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 transition-colors cursor-pointer active:scale-95"
                  >
                    0
                  </button>
                  <button
                    type="button"
                    onClick={handleBackspace}
                    className="h-8 text-xs font-bold text-rose-400 hover:text-rose-300 rounded-lg bg-slate-900/50 cursor-pointer"
                  >
                    ⌫
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={isVerifyingPin || !storeCodeInput.trim() || pinInput.length < 4}
                  className="w-full h-10 text-xs font-black bg-amber-500 hover:bg-amber-600 disabled:opacity-50 disabled:cursor-not-allowed text-slate-950 rounded-xl shadow-md shadow-amber-500/20 mt-1 cursor-pointer transition-all flex items-center justify-center gap-2"
                >
                  {isVerifyingPin ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin text-slate-950" />
                      <span>Memverifikasi PIN...</span>
                    </>
                  ) : (
                    <span>Buka Kasir POS</span>
                  )}
                </button>
              </form>
            </TabsContent>
          </Tabs>

          <p className="text-center text-[11px] text-slate-500 pt-1">
            Data Anda terenkripsi aman di Google Cloud Platform.
          </p>

        </div>

      </div>

    </div>
  );
}
