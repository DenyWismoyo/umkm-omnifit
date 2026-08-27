"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { BusinessSelector } from "@/components/shared/business/BusinessSelector";
import { IndustryPack } from "@/types";
import { toast } from "sonner";
import {
  Store,
  User,
  Phone,
  MapPin,
  Loader2,
  LogOut,
  Sparkles,
  CheckCircle2,
  ShieldCheck,
  Crown,
  ChevronRight,
  ArrowLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { INDUSTRY_METADATA } from "@/data/subscriptionPlans";

function OnboardingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isEditMode = searchParams.get("edit") === "true";

  const {
    user,
    storeOwnerUid,
    shopProfile,
    loading,
    signOut,
    completeOnboarding,
  } = useAuth();

  // Profile Form State
  const [ownerName, setOwnerName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [shopName, setShopName] = useState("");
  const [address, setAddress] = useState("");
  const [selectedIndustry, setSelectedIndustry] = useState<IndustryPack | null>(null);

  // Flow State
  const [currentStep, setCurrentStep] = useState<1 | 2>(1);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isAgreed, setIsAgreed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [user, loading, router]);

  // Pre-fill existing data if available
  useEffect(() => {
    if (user || shopProfile) {
      setOwnerName(shopProfile?.ownerName || user?.displayName || "");
      setPhoneNumber(shopProfile?.phoneNumber || "");
      setShopName(shopProfile?.shopName || "");
      setAddress(shopProfile?.address || "");
      if (shopProfile?.industry) {
        setSelectedIndustry(shopProfile.industry);
      }
    }
  }, [user, shopProfile]);

  // If already has industry and not edit mode, redirect to dashboard
  useEffect(() => {
    if (!loading && shopProfile?.industry && shopProfile?.shopName && !isEditMode) {
      router.replace("/dashboard");
    }
  }, [shopProfile, loading, isEditMode, router]);

  const handleStep1Next = (e: React.FormEvent) => {
    e.preventDefault();
    if (!shopName.trim()) {
      toast.error("Nama Toko / Usaha wajib diisi!");
      return;
    }
    if (!ownerName.trim()) {
      toast.error("Nama Pemilik Usaha wajib diisi!");
      return;
    }
    setCurrentStep(2);
  };

  const handleOpenConfirm = () => {
    if (!selectedIndustry) {
      toast.error("Pilih salah satu jenis usaha terlebih dahulu!");
      return;
    }
    setIsAgreed(false);
    setIsConfirmModalOpen(true);
  };

  const handleFinalSubmit = async () => {
    if (!selectedIndustry || !storeOwnerUid || !isAgreed) return;

    try {
      setIsSubmitting(true);
      
      await completeOnboarding(selectedIndustry, {
        shopName: shopName.trim(),
        ownerName: ownerName.trim(),
        phoneNumber: phoneNumber.trim(),
        address: address.trim(),
        email: user?.email || "",
      });

      toast.success("Pengaturan profil & jenis usaha berhasil disimpan!");
      setIsConfirmModalOpen(false);
      
      // Redirect to dashboard
      window.location.href = "/dashboard";
    } catch (error: any) {
      console.error(error);
      toast.error("Terjadi kesalahan: " + (error.message || "Silakan coba lagi"));
      setIsSubmitting(false);
    }
  };

  if (loading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  const selectedMeta = selectedIndustry ? INDUSTRY_METADATA[selectedIndustry] : null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-slate-100/50 to-slate-50 flex flex-col items-center py-8 sm:py-12 px-4 sm:px-6">
      <div className="w-full max-w-4xl space-y-6 sm:space-y-8">
        
        {/* Header Branding */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center h-14 w-14 sm:h-16 sm:w-16 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white mb-2 shadow-md shadow-emerald-500/20">
            <Store className="h-7 w-7 sm:h-8 sm:w-8" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            {isEditMode ? "Ubah Pengaturan Usaha & Profil" : "Setup Awal POS UMKM Pro"}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto">
            {currentStep === 1
              ? "Lengkapi identitas diri dan informasi usaha Anda untuk struk dan invoice kasir."
              : "Pilih modul industri yang paling sesuai agar menu dan alur kasir disesuaikan secara otomatis."}
          </p>

          {/* Stepper Pill Indicator */}
          <div className="flex items-center justify-center gap-2 pt-2">
            <span
              className={`text-xs font-black px-3 py-1 rounded-full transition-all ${
                currentStep === 1
                  ? "bg-emerald-600 text-white shadow-xs"
                  : "bg-emerald-100 text-emerald-800"
              }`}
            >
              1. Identitas Usaha
            </span>
            <span className="text-slate-300">──</span>
            <span
              className={`text-xs font-black px-3 py-1 rounded-full transition-all ${
                currentStep === 2
                  ? "bg-emerald-600 text-white shadow-xs"
                  : "bg-slate-200 text-slate-600"
              }`}
            >
              2. Jenis Industri
            </span>
          </div>
        </div>

        {/* STEP 1: IDENTITAS PEMILIK & USAHA */}
        {currentStep === 1 && (
          <form
            onSubmit={handleStep1Next}
            className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/80 space-y-5 animate-in fade-in duration-200"
          >
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <User className="h-5 w-5 text-emerald-600" />
              <h2 className="text-base font-bold text-slate-900">
                Informasi Pemilik & Toko
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 block">
                  Nama Pemilik Usaha <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    required
                    value={ownerName}
                    onChange={(e) => setOwnerName(e.target.value)}
                    placeholder="Contoh: Deny Wismoyo"
                    className="pl-10 h-11"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 block">
                  Nomor WhatsApp / HP Aktif <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    required
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="081234567890"
                    className="pl-10 h-11"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 block">
                  Nama Toko / Outlet <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Store className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-emerald-600" />
                  <Input
                    required
                    value={shopName}
                    onChange={(e) => setShopName(e.target.value)}
                    placeholder="Contoh: Kopi Kulo Kenangan"
                    className="pl-10 h-11 font-semibold"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 block">
                  Alamat Lengkap Toko / Lokasi (Opsional)
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Contoh: Jl. Diponegoro No. 18, Bandung"
                    className="pl-10 h-11"
                  />
                </div>
              </div>
            </div>

            <div className="pt-4 flex items-center justify-between border-t border-slate-100">
              <Button
                type="button"
                variant="ghost"
                className="text-slate-500 hover:text-slate-700"
                onClick={signOut}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Keluar
              </Button>

              <Button
                type="submit"
                size="lg"
                className="h-12 px-6 font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-md shadow-emerald-600/20"
              >
                <span>Lanjut Pilih Jenis Usaha</span>
                <ChevronRight className="h-4 w-4 ml-1.5" />
              </Button>
            </div>
          </form>
        )}

        {/* STEP 2: PILIHAN INDUSTRI BISNIS */}
        {currentStep === 2 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200">
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
                <div>
                  <h2 className="text-base font-bold text-slate-900">
                    Pilih Kategori Bisnis Anda
                  </h2>
                  <p className="text-xs text-slate-500">
                    Tampilan dashboard, menu kasir, dan fitur operasional akan disesuaikan otomatis.
                  </p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentStep(1)}
                  className="rounded-xl text-xs gap-1"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  <span>Ubah Identitas</span>
                </Button>
              </div>

              <BusinessSelector 
                onSelect={setSelectedIndustry} 
                selectedIndustry={selectedIndustry}
                isLoading={isSubmitting}
              />
            </div>

            {/* Action Bottom Bar */}
            <div className="flex flex-col-reverse sm:flex-row items-center justify-between gap-4 pt-2">
              <Button 
                type="button"
                variant="ghost" 
                className="text-slate-500"
                onClick={() => setCurrentStep(1)}
                disabled={isSubmitting}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Kembali ke Data Usaha
              </Button>

              <Button 
                type="button"
                size="lg"
                className="w-full sm:w-auto min-w-[220px] h-13 text-base font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-600/25 rounded-2xl"
                onClick={handleOpenConfirm}
                disabled={!selectedIndustry || isSubmitting}
              >
                <span>Konfirmasi & Simpan</span>
                <ChevronRight className="h-5 w-5 ml-2" />
              </Button>
            </div>
          </div>
        )}

      </div>

      {/* MODAL KONFIRMASI PEMILIHAN DENGAN CHECKBOX PERSETUJUAN */}
      <Dialog open={isConfirmModalOpen} onOpenChange={setIsConfirmModalOpen}>
        <DialogContent className="sm:max-w-md bg-white border-slate-200 rounded-3xl p-6 shadow-2xl">
          <DialogHeader className="text-left space-y-1.5">
            <div className="flex items-center gap-2 text-emerald-600">
              <ShieldCheck className="h-6 w-6" />
              <DialogTitle className="text-lg font-black text-slate-900">
                Konfirmasi Pengaturan Usaha
              </DialogTitle>
            </div>
            <DialogDescription className="text-xs text-slate-500">
              Pastikan data identitas dan jenis usaha Anda sudah sesuai sebelum memulai.
            </DialogDescription>
          </DialogHeader>

          {/* Summary Card */}
          <div className="rounded-2xl bg-slate-50 border border-slate-200/80 p-4 space-y-3 my-2 text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200/60">
              <span className="text-slate-500">Nama Toko:</span>
              <span className="font-bold text-slate-900 text-right">{shopName}</span>
            </div>
            <div className="flex items-center justify-between pb-2 border-b border-slate-200/60">
              <span className="text-slate-500">Pemilik & WhatsApp:</span>
              <span className="font-semibold text-slate-800 text-right">
                {ownerName} ({phoneNumber})
              </span>
            </div>
            {address && (
              <div className="flex items-start justify-between pb-2 border-b border-slate-200/60">
                <span className="text-slate-500">Alamat:</span>
                <span className="font-medium text-slate-700 text-right max-w-[200px] truncate">
                  {address}
                </span>
              </div>
            )}
            <div className="flex items-center justify-between pt-1">
              <span className="text-slate-500">Modul Industri:</span>
              <span className="font-black text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <span>{selectedMeta?.icon}</span>
                <span>{selectedMeta?.name || selectedIndustry}</span>
              </span>
            </div>
          </div>

          {/* Trial Benefit Notice */}
          <div className="flex items-center gap-2.5 bg-amber-50 border border-amber-200 rounded-xl p-3 text-amber-950 text-xs">
            <Crown className="h-5 w-5 text-amber-600 shrink-0" />
            <p className="leading-snug text-[11.5px]">
              <strong>Trial PRO 30 Hari Aktif:</strong> Anda mendapatkan akses penuh tanpa batas ke seluruh fitur eksklusif modul <strong>{selectedMeta?.name}</strong>.
            </p>
          </div>

          {/* Agreement Checkbox */}
          <div className="pt-2">
            <label className="flex items-start gap-3 cursor-pointer select-none group">
              <input
                type="checkbox"
                checked={isAgreed}
                onChange={(e) => setIsAgreed(e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded text-emerald-600 border-slate-300 focus:ring-emerald-500 cursor-pointer"
              />
              <span className="text-xs font-semibold text-slate-700 group-hover:text-slate-900 leading-snug">
                Saya menyetujui konfigurasi identitas toko dan modul usaha di atas untuk memulai operasional POS UMKM.
              </span>
            </label>
          </div>

          <DialogFooter className="mt-4 pt-3 border-t border-slate-100 flex flex-col-reverse sm:flex-row gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsConfirmModalOpen(false)}
              disabled={isSubmitting}
              className="w-full sm:w-auto rounded-xl font-semibold text-xs"
            >
              Batal / Koreksi
            </Button>
            <Button
              type="button"
              disabled={!isAgreed || isSubmitting}
              onClick={handleFinalSubmit}
              className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md shadow-emerald-600/20 text-xs"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Menyimpan Profil...
                </>
              ) : (
                <>
                  <CheckCircle2 className="mr-1.5 h-4 w-4" />
                  Konfirmasi & Mulai
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default function OnboardingPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-slate-50">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
        </div>
      }
    >
      <OnboardingContent />
    </Suspense>
  );
}

