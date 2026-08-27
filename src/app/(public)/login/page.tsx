"use client";

import React, { useState, useEffect } from "react";
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
      } else if (shopProfile && !shopProfile.industry) {
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
      // Redirect will be handled by useEffect above
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
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-900 text-slate-100 selection:bg-emerald-500 selection:text-white">
      {/* Left Showcase Banner */}
      <div className="relative flex flex-1 flex-col justify-between p-8 md:p-12 lg:p-16 overflow-hidden bg-gradient-to-br from-slate-900 via-slate-950 to-emerald-950">
        {/* Glow decoration */}
        <div className="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-emerald-500/15 blur-3xl" />
        <div className="absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-teal-500/15 blur-3xl" />

        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-slate-950 shadow-lg shadow-emerald-500/25">
              <Store className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-xl font-extrabold tracking-tight text-white">
                POS UMKM PRO
              </h1>
              <p className="text-xs text-emerald-400 font-medium">
                Sistem Kasir & Manajemen Usaha Mandiri
              </p>
            </div>
          </div>

          <div className="mt-12 md:mt-16 max-w-lg space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1 text-xs font-semibold text-emerald-400 backdrop-blur-sm">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Login Kasir Instan Tanpa Email</span>
            </div>

            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white leading-tight">
              Kelola Transaksi, Stok, dan Keuangan Usaha Anda dalam Satu Tempat.
            </h2>
            <p className="text-sm md:text-base text-slate-400 leading-relaxed">
              Kasir dapat langsung login di perangkat manapun dengan <strong>Kode Toko & PIN</strong> tanpa perlu akun Google/email, menjaga keamanan akun pribadi pemilik toko.
            </p>
          </div>
        </div>

        {/* Features highlights */}
        <div className="relative z-10 mt-12 grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl">
          <div className="flex items-start gap-3 rounded-2xl border border-slate-800 bg-slate-900/60 p-3.5 backdrop-blur-sm">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400">
              <Zap className="h-4 w-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-200">Kasir Cepat & Struk</h4>
              <p className="text-[11px] text-slate-400">Cetak struk thermal 58/80mm atau kirim via WhatsApp.</p>
            </div>
          </div>

          <div className="flex items-start gap-3 rounded-2xl border border-slate-800 bg-slate-900/60 p-3.5 backdrop-blur-sm">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-teal-500/20 text-teal-400">
              <TrendingUp className="h-4 w-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-200">Laporan Laba / Rugi</h4>
              <p className="text-[11px] text-slate-400">Hitung otomatis omzet, modal (HPP), dan laba bersih harian.</p>
            </div>
          </div>

          <div className="flex items-start gap-3 rounded-2xl border border-slate-800 bg-slate-900/60 p-3.5 backdrop-blur-sm">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-500/20 text-amber-400">
              <Users className="h-4 w-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-200">Buku Kasbon / Piutang</h4>
              <p className="text-[11px] text-slate-400">Catat hutang pelanggan dan pantau sisa pelunasan.</p>
            </div>
          </div>

          <div className="flex items-start gap-3 rounded-2xl border border-slate-800 bg-slate-900/60 p-3.5 backdrop-blur-sm">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-purple-500/20 text-purple-400">
              <ShieldCheck className="h-4 w-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-200">100% Data Terisolasi</h4>
              <p className="text-[11px] text-slate-400">Hanya Anda yang dapat mengakses data bisnis toko Anda.</p>
            </div>
          </div>
        </div>

        <div className="relative z-10 mt-8 pt-6 border-t border-slate-800/80 text-xs text-slate-500">
          © {new Date().getFullYear()} POS UMKM System. All rights reserved.
        </div>
      </div>

      {/* Right Login Card */}
      <div className="flex w-full md:w-[480px] lg:w-[540px] flex-col justify-center bg-white p-8 md:p-12 text-slate-900 shadow-2xl">
        <div className="w-full max-w-sm mx-auto space-y-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-600">
              Selamat Datang
            </span>
            <h3 className="mt-1 text-2xl font-black tracking-tight text-slate-900">
              Masuk ke POS UMKM
            </h3>
            <p className="mt-1.5 text-xs text-slate-500">
              Pilih peran Anda untuk mulai mengelola toko atau melayani kasir.
            </p>
          </div>

          {/* Role Tabs */}
          <Tabs
            value={loginTab}
            onValueChange={(v) => setLoginTab(v as any)}
            className="w-full"
          >
            <TabsList className="grid grid-cols-2 w-full h-11 rounded-xl bg-slate-100 p-1">
              <TabsTrigger
                value="owner"
                className="flex items-center gap-1.5 text-xs font-bold"
              >
                <Store className="h-4 w-4 text-emerald-600" />
                <span>Pemilik Toko</span>
              </TabsTrigger>
              <TabsTrigger
                value="cashier"
                className="flex items-center gap-1.5 text-xs font-bold"
              >
                <UserCheck className="h-4 w-4 text-amber-600" />
                <span>Login Kasir</span>
              </TabsTrigger>
            </TabsList>

            {/* TAB OWNER (GOOGLE LOGIN) */}
            <TabsContent value="owner" className="space-y-4 pt-4">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 space-y-2 text-xs text-slate-600">
                <div className="flex items-center gap-2 font-bold text-slate-900">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  <span>Akses Penuh Pemilik (Owner)</span>
                </div>
                <p className="text-slate-500 leading-relaxed pl-6">
                  Masuk dengan akun Google untuk membuka seluruh dashboard, kalkulator HPP, pengeluaran toko, laporan laba rugi, dan manajemen staf kasir.
                </p>
              </div>

              <Button
                type="button"
                onClick={handleGoogleLogin}
                disabled={signingIn}
                className="w-full h-12 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border-2 border-slate-200 hover:border-slate-300 shadow-sm flex items-center justify-center gap-3 text-sm font-semibold transition-all active:scale-[0.98]"
              >
                {signingIn ? (
                  <Loader2 className="h-5 w-5 animate-spin text-emerald-600" />
                ) : (
                  <svg className="h-5 w-5" viewBox="0 0 24 24">
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
                <span>{signingIn ? "Menghubungkan Akun..." : "Lanjutkan dengan Google"}</span>
              </Button>
            </TabsContent>

            {/* TAB CASHIER (ANONYMOUS LOGIN VIA KODE TOKO & PIN) */}
            <TabsContent value="cashier" className="space-y-4 pt-4">
              <div className="rounded-2xl border border-amber-200 bg-amber-50/60 p-3 text-xs text-amber-900 space-y-1">
                <p className="font-bold flex items-center gap-1.5">
                  <KeyRound className="h-4 w-4 text-amber-600" />
                  <span>Login Kasir (Tanpa Email)</span>
                </p>
                <p className="text-[11px] text-amber-800 leading-tight">
                  Masukkan <strong>Kode Toko</strong> dan <strong>PIN Kasir</strong> yang diberikan oleh pemilik toko untuk langsung melayani transaksi.
                </p>
              </div>

              {/* Form Input Kode Toko & PIN */}
              <form onSubmit={handleCashierLoginSubmit} className="space-y-3 text-xs">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Kode Toko (dari Pemilik Toko):
                  </label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      type="text"
                      value={storeCodeInput}
                      onChange={(e) => setStoreCodeInput(e.target.value.toUpperCase())}
                      placeholder="Contoh: TK-849201"
                      className="pl-9 h-10 font-mono font-bold tracking-wider uppercase text-slate-900 bg-slate-50 border-slate-300"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    PIN Kasir (4-6 Digit):
                  </label>
                  <Input
                    type="password"
                    maxLength={6}
                    value={pinInput}
                    onChange={(e) => setPinInput(e.target.value)}
                    placeholder="• • • •"
                    className="text-center text-xl tracking-[0.4em] font-mono font-bold h-11 bg-slate-50 border-emerald-400"
                  />
                </div>

                {/* Quick Keypad */}
                <div className="grid grid-cols-3 gap-1.5 max-w-[220px] mx-auto pt-1">
                  {["1", "2", "3", "4", "5", "6", "7", "8", "9"].map((num) => (
                    <Button
                      key={num}
                      type="button"
                      variant="outline"
                      onClick={() => handleKeypadPress(num)}
                      className="h-9 text-sm font-bold rounded-lg hover:bg-emerald-50 hover:text-emerald-800 border-slate-200"
                    >
                      {num}
                    </Button>
                  ))}
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={handleClear}
                    className="h-9 text-xs font-bold text-slate-400 hover:text-slate-700"
                  >
                    Clear
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => handleKeypadPress("0")}
                    className="h-9 text-sm font-bold rounded-lg hover:bg-emerald-50 hover:text-emerald-800 border-slate-200"
                  >
                    0
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={handleBackspace}
                    className="h-9 text-xs font-bold text-rose-500 hover:text-rose-700"
                  >
                    ⌫
                  </Button>
                </div>

                <Button
                  type="submit"
                  disabled={isVerifyingPin || !storeCodeInput.trim() || pinInput.length < 4}
                  className="w-full h-11 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/20 mt-2"
                >
                  {isVerifyingPin ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Memverifikasi Kode & PIN...</span>
                    </div>
                  ) : (
                    "Masuk ke Kasir POS"
                  )}
                </Button>
              </form>
            </TabsContent>
          </Tabs>

          <p className="text-center text-xs text-slate-400 pt-2">
            Dengan masuk, Anda menyetujui privasi isolasi data dan ketentuan penggunaan aplikasi POS UMKM.
          </p>
        </div>
      </div>
    </div>
  );
}
