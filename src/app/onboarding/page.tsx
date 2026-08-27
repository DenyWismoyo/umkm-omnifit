"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { BusinessSelector } from "@/components/shared/business/BusinessSelector";
import { saveShopProfile } from "@/services/firestore";
import { IndustryPack } from "@/types";
import { toast } from "sonner";
import { Store, Loader2, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function OnboardingPage() {
  const router = useRouter();
  const { user, storeOwnerUid, shopProfile, loading, signOut, completeOnboarding } = useAuth();
  const [selectedIndustry, setSelectedIndustry] = useState<IndustryPack | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [user, loading, router]);

  // If already has industry, they shouldn't be here
  useEffect(() => {
    if (shopProfile?.industry) {
      router.replace("/dashboard");
    }
  }, [shopProfile, router]);

  const handleContinue = async () => {
    if (!selectedIndustry || !storeOwnerUid) return;

    try {
      setIsSubmitting(true);
      
      // Save profile, update subscription, and sync cookie via completeOnboarding
      await completeOnboarding(selectedIndustry);

      toast.success("Berhasil mengatur jenis usaha!");
      
      // Force hard refresh to dashboard so that layout and proxy pickup new cookie
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

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center py-12 px-4 sm:px-6">
      <div className="w-full max-w-4xl space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-emerald-100 text-emerald-600 mb-4 shadow-sm">
            <Store className="h-8 w-8" />
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            Pilih Jenis Usaha Anda
          </h1>
          <p className="text-slate-600 max-w-lg mx-auto">
            Bantu kami menyesuaikan tampilan dan fitur POS UMKM agar paling pas dengan kebutuhan operasional bisnis Anda.
          </p>
        </div>

        {/* Business Selector */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200">
          <BusinessSelector 
            onSelect={setSelectedIndustry} 
            selectedIndustry={selectedIndustry}
            isLoading={isSubmitting}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col-reverse sm:flex-row items-center justify-between gap-4 pt-4">
          <Button 
            variant="ghost" 
            className="text-slate-500"
            onClick={signOut}
            disabled={isSubmitting}
          >
            <LogOut className="h-4 w-4 mr-2" />
            Keluar Akun
          </Button>

          <Button 
            size="lg"
            className="w-full sm:w-auto min-w-[200px] h-14 text-base font-bold bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-600/20"
            onClick={handleContinue}
            disabled={!selectedIndustry || isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                Menyiapkan...
              </>
            ) : (
              "Lanjutkan ke Dashboard"
            )}
          </Button>
        </div>

      </div>
    </div>
  );
}
