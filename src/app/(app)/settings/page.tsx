"use client";

import React, { useState, useEffect, useRef } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useAuth } from "@/context/AuthContext";
import {
  saveShopProfile,
  createCashier,
  deleteCashier,
  getCashiers,
} from "@/services/firestore";
import { Cashier, UserRole, BrandThemePreset } from "@/types";
import { storage } from "@/lib/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/common/PageHeader";
import { QrTableModal } from "@/components/common/QrTableModal";
import { WhiteLabelSettingsCard } from "@/components/settings/WhiteLabelSettingsCard";
import { PaymentTab } from "@/components/settings/tabs/PaymentTab";
import { ProfileTab } from "@/components/settings/tabs/ProfileTab";
import { StaffTab } from "@/components/settings/tabs/StaffTab";
import { ReceiptQrTab } from "@/components/settings/tabs/ReceiptQrTab";
import {
  Store,
  Save,
  ShieldCheck,
  Printer,
  QrCode,
  Users,
  Palette,
} from "lucide-react";
import { toast } from "sonner";

export default function SettingsPage() {
  const {
    user,
    shopProfile,
    cashiers,
    refreshShopProfile,
    refreshCashiers,
    generateNewStoreCode,
  } = useAuth();
  
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingQris, setIsUploadingQris] = useState(false);
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);

  // Cashier form state
  const [newCashierName, setNewCashierName] = useState("");
  const [newCashierPin, setNewCashierPin] = useState("");
  const [newCashierRole, setNewCashierRole] = useState<UserRole>("cashier");
  const [isAddingCashier, setIsAddingCashier] = useState(false);
  const [showPins, setShowPins] = useState<Record<string, boolean>>({});

  // Store code management
  const [customStoreCode, setCustomStoreCode] = useState("");
  const [isGeneratingCode, setIsGeneratingCode] = useState(false);
  const [showCustomCodeInput, setShowCustomCodeInput] = useState(false);
  const [isCopiedCode, setIsCopiedCode] = useState(false);

  const [formData, setFormData] = useState({
    shopName: "",
    ownerName: "",
    phoneNumber: "",
    address: "",
    receiptFooter: "Terima kasih atas kunjungan Anda!",
    taxPercentage: 0,
    paperSize: "58mm" as "58mm" | "80mm",
    qrisImageUrl: "",
    qrisNmid: "",
    qrisMerchantName: "",
    bankName: "BCA",
    bankAccountNumber: "",
    bankAccountName: "",
    brandThemePreset: "emerald" as BrandThemePreset,
    brandColorPrimary: "#059669",
    brandColorSecondary: "#10b981",
    tagline: "",
    bannerUrl: "",
    instagram: "",
    hideWatermark: false,
  });

  useEffect(() => {
    if (shopProfile) {
      setFormData({
        shopName: shopProfile.shopName || "",
        ownerName: shopProfile.ownerName || "",
        phoneNumber: shopProfile.phoneNumber || "",
        address: shopProfile.address || "",
        receiptFooter: shopProfile.receiptFooter || "Terima kasih atas kunjungan Anda!",
        taxPercentage: shopProfile.taxPercentage || 0,
        paperSize: shopProfile.paperSize || "58mm",
        qrisImageUrl: shopProfile.qrisImageUrl || "",
        qrisNmid: shopProfile.qrisNmid || "",
        qrisMerchantName: shopProfile.qrisMerchantName || "",
        bankName: shopProfile.bankName || "BCA",
        bankAccountNumber: shopProfile.bankAccountNumber || "",
        bankAccountName: shopProfile.bankAccountName || "",
        brandThemePreset: (shopProfile.brandThemePreset || "emerald") as BrandThemePreset,
        brandColorPrimary: shopProfile.brandColorPrimary || "#059669",
        brandColorSecondary: shopProfile.brandColorSecondary || "#10b981",
        tagline: shopProfile.tagline || "",
        bannerUrl: shopProfile.bannerUrl || "",
        instagram: shopProfile.instagram || "",
        hideWatermark: !!shopProfile.hideWatermark,
      });
    }
  }, [shopProfile]);

  const handleQrisFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    if (file.size > 3 * 1024 * 1024) {
      toast.error("Ukuran file gambar QRIS maksimal 3MB!");
      return;
    }
    try {
      setIsUploadingQris(true);
      toast.loading("Mengunggah gambar QRIS...", { id: "upload-qris" });
      try {
        const fileExt = file.name.split(".").pop() || "png";
        const storageRef = ref(storage, `users/${user.uid}/qris_${Date.now()}.${fileExt}`);
        const snap = await uploadBytes(storageRef, file);
        const downloadUrl = await getDownloadURL(snap.ref);
        setFormData((prev) => ({ ...prev, qrisImageUrl: downloadUrl }));
        toast.success("Foto QRIS berhasil diunggah!", { id: "upload-qris" });
      } catch (storageErr) {
        console.warn("Storage upload failed, falling back to base64 encoding", storageErr);
        const reader = new FileReader();
        reader.onload = (event) => {
          const base64 = event.target?.result as string;
          setFormData((prev) => ({ ...prev, qrisImageUrl: base64 }));
          toast.success("Foto QRIS berhasil dimuat!", { id: "upload-qris" });
        };
        reader.readAsDataURL(file);
      }
    } catch (err: any) {
      toast.error("Gagal mengunggah QRIS: " + err.message, { id: "upload-qris" });
    } finally {
      setIsUploadingQris(false);
    }
  };

  const handleRemoveQris = () => {
    setFormData((prev) => ({ ...prev, qrisImageUrl: "" }));
    toast.info("Gambar QRIS dihapus. Klik 'Simpan Pengaturan' untuk menyimpan perubahan.");
  };

  const handleAddCashier = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (!newCashierName.trim()) { toast.error("Nama kasir tidak boleh kosong!"); return; }
    if (!newCashierPin || newCashierPin.length < 4) { toast.error("PIN Kasir minimal 4 digit angka!"); return; }
    try {
      setIsAddingCashier(true);
      await createCashier(user.uid, {
        name: newCashierName.trim(),
        pin: newCashierPin.trim(),
        role: newCashierRole,
        isActive: true,
        notes: "Akun kasir aktif",
      });
      toast.success(`✨ Akun kasir "${newCashierName}" berhasil ditambahkan!`);
      setNewCashierName("");
      setNewCashierPin("");
      await refreshCashiers();
    } catch (err: any) {
      toast.error("Gagal menambah kasir: " + err.message);
    } finally {
      setIsAddingCashier(false);
    }
  };

  const handleDeleteCashier = async (id: string, name: string) => {
    if (!user) return;
    if (confirm(`Hapus akun kasir "${name}"?`)) {
      try {
        await deleteCashier(user.uid, id);
        toast.success(`Akun kasir "${name}" dihapus.`);
        await refreshCashiers();
      } catch (err: any) {
        toast.error("Gagal menghapus kasir: " + err.message);
      }
    }
  };

  const toggleShowPin = (id: string) => {
    setShowPins((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleCopyStoreCode = () => {
    if (!shopProfile?.storeCode) return;
    navigator.clipboard.writeText(shopProfile.storeCode);
    setIsCopiedCode(true);
    toast.success(`Kode Toko "${shopProfile.storeCode}" berhasil disalin!`);
    setTimeout(() => setIsCopiedCode(false), 2000);
  };

  const handleGenerateStoreCode = async (custom?: string) => {
    try {
      setIsGeneratingCode(true);
      const code = await generateNewStoreCode(custom);
      toast.success(`✨ Kode Akses Toko berhasil diperbarui: ${code}`);
      setShowCustomCodeInput(false);
      setCustomStoreCode("");
    } catch (err: any) {
      toast.error("Gagal membuat kode toko: " + err.message);
    } finally {
      setIsGeneratingCode(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (!formData.shopName.trim()) {
      toast.error("Nama toko tidak boleh kosong!");
      return;
    }
    try {
      setIsSaving(true);
      await saveShopProfile(user.uid, {
        shopName: formData.shopName.trim(),
        ownerName: formData.ownerName.trim(),
        phoneNumber: formData.phoneNumber.trim(),
        address: formData.address.trim(),
        receiptFooter: formData.receiptFooter.trim(),
        taxPercentage: Number(formData.taxPercentage) || 0,
        paperSize: formData.paperSize,
        qrisImageUrl: formData.qrisImageUrl,
        qrisNmid: formData.qrisNmid.trim(),
        qrisMerchantName: formData.qrisMerchantName.trim() || formData.shopName.trim(),
        bankName: formData.bankName.trim(),
        bankAccountNumber: formData.bankAccountNumber.trim(),
        bankAccountName: formData.bankAccountName.trim(),
        brandThemePreset: formData.brandThemePreset,
        brandColorPrimary: formData.brandColorPrimary,
        brandColorSecondary: formData.brandColorSecondary,
        tagline: formData.tagline.trim(),
        bannerUrl: formData.bannerUrl.trim(),
        instagram: formData.instagram.trim(),
        hideWatermark: formData.hideWatermark,
        email: user.email || "",
      });
      await refreshShopProfile();
      toast.success("Pengaturan profil toko, branding & metode pembayaran berhasil disimpan!");
    } catch (err: any) {
      toast.error("Gagal menyimpan pengaturan: " + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  type SettingsTabId = "branding" | "payment" | "profile" | "staff" | "receipt_qr";
  const [activeTab, setActiveTab] = useState<SettingsTabId>("branding");

  const SETTING_TABS: {
    id: SettingsTabId;
    label: string;
    shortLabel: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: string;
    badgeColor?: string;
    badgeCount?: number;
  }[] = [
    { id: "branding", label: "Branding & Tema", shortLabel: "Branding", icon: Palette, badge: "PRO", badgeColor: "bg-indigo-100 text-indigo-900 border-indigo-200" },
    { id: "payment", label: "QRIS & Pembayaran", shortLabel: "Pembayaran", icon: QrCode },
    { id: "profile", label: "Profil & Alamat", shortLabel: "Profil", icon: Store },
    { id: "staff", label: "Akun Kasir (Shift)", shortLabel: "Kasir", icon: Users, badgeCount: cashiers.length },
    { id: "receipt_qr", label: "Struk & QR Meja", shortLabel: "Struk & QR", icon: Printer },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-5 max-w-4xl pb-12">
        <PageHeader
          title="Pengaturan Toko & Kasir"
          description="Kelola kustomisasi merek, barcode QRIS, akun kasir shift, dan format struk printer."
          actions={
            <Button
              type="button"
              disabled={isSaving}
              onClick={handleSave as any}
              size="sm"
              className="gap-2 shadow-md shadow-emerald-600/20 px-5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold h-9 rounded-xl hidden sm:flex"
            >
              <Save className="h-4 w-4" />
              <span>{isSaving ? "Menyimpan..." : "Simpan Pengaturan"}</span>
            </Button>
          }
        />

        <div className="flex items-center p-1.5 bg-slate-100/90 border border-slate-200/90 rounded-2xl gap-1 overflow-x-auto no-scrollbar shadow-2xs">
          {SETTING_TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`touch-press flex items-center justify-center gap-2 py-2.5 px-3.5 rounded-xl text-xs font-bold transition-all shrink-0 sm:flex-1 ${
                  isActive
                    ? "bg-white text-slate-950 shadow-xs border border-slate-200/80 font-black ring-1 ring-black/5"
                    : "text-slate-500 hover:text-slate-800 hover:bg-white/50"
                }`}
              >
                <Icon className={`h-4 w-4 ${isActive ? "text-emerald-600" : "text-slate-400"}`} />
                <span className="hidden sm:inline">{tab.label}</span>
                <span className="inline sm:hidden">{tab.shortLabel}</span>
                {tab.badge && <span className={`text-[9px] font-black px-1.5 py-0.2 rounded-md border ${tab.badgeColor}`}>{tab.badge}</span>}
                {typeof tab.badgeCount === "number" && <span className="text-[10px] font-black bg-slate-200 text-slate-700 px-1.5 py-0.2 rounded-full">{tab.badgeCount}</span>}
              </button>
            );
          })}
        </div>

        <form onSubmit={handleSave} className="space-y-6">
          {activeTab === "branding" && (
            <div className="animate-in fade-in duration-200 space-y-6">
              <WhiteLabelSettingsCard formData={formData} onChange={(fields) => setFormData((prev) => ({ ...prev, ...fields }))} />
            </div>
          )}
          {activeTab === "payment" && (
            <PaymentTab formData={formData} setFormData={setFormData} handleQrisFileChange={handleQrisFileChange} handleRemoveQris={handleRemoveQris} isUploadingQris={isUploadingQris} />
          )}
          {activeTab === "profile" && (
            <ProfileTab formData={formData} setFormData={setFormData} />
          )}
          {activeTab === "staff" && (
            <StaffTab
              cashiers={cashiers}
              shopProfile={shopProfile}
              handleCopyStoreCode={handleCopyStoreCode}
              isCopiedCode={isCopiedCode}
              showCustomCodeInput={showCustomCodeInput}
              setShowCustomCodeInput={setShowCustomCodeInput}
              customStoreCode={customStoreCode}
              setCustomStoreCode={setCustomStoreCode}
              isGeneratingCode={isGeneratingCode}
              handleGenerateStoreCode={handleGenerateStoreCode}
              newCashierName={newCashierName}
              setNewCashierName={setNewCashierName}
              newCashierPin={newCashierPin}
              setNewCashierPin={setNewCashierPin}
              newCashierRole={newCashierRole}
              setNewCashierRole={setNewCashierRole}
              handleAddCashier={handleAddCashier}
              isAddingCashier={isAddingCashier}
              showPins={showPins}
              toggleShowPin={toggleShowPin}
              handleDeleteCashier={handleDeleteCashier}
            />
          )}
          {activeTab === "receipt_qr" && (
            <ReceiptQrTab formData={formData} setFormData={setFormData} shopProfile={shopProfile} setIsQrModalOpen={setIsQrModalOpen} />
          )}

          <div className="rounded-2xl border border-emerald-200 bg-gradient-to-r from-emerald-50/60 to-teal-50/60 p-4 text-xs space-y-1.5">
            <div className="flex items-center gap-2 font-bold text-emerald-950">
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
              <span>Keamanan & Isolasi Data Multi-Tenant</span>
            </div>
            <p className="text-slate-600 leading-relaxed">
              Akun Anda terhubung dengan Google UID: <code className="font-mono bg-white px-1 py-0.5 rounded border border-emerald-200 text-[11px] text-emerald-800">{user?.uid}</code>.
              Semua data profil toko, file QRIS, produk, transaksi, pengeluaran, dan kasbon terisolasi aman untuk toko Anda sendiri.
            </p>
          </div>

          <div className="flex items-center justify-between pt-2">
            <span className="text-xs text-slate-400 italic hidden sm:block">Perubahan pada tab aktif akan tersimpan saat Anda menekan tombol di samping ➡️</span>
            <Button type="submit" disabled={isSaving} size="lg" className="gap-2 shadow-md shadow-emerald-600/20 px-8 bg-emerald-600 hover:bg-emerald-700 text-white font-bold w-full sm:w-auto">
              <Save className="h-4 w-4" />
              <span>{isSaving ? "Menyimpan..." : "Simpan Semua Pengaturan"}</span>
            </Button>
          </div>
        </form>

        <QrTableModal isOpen={isQrModalOpen} onClose={() => setIsQrModalOpen(false)} />
      </div>
    </DashboardLayout>
  );
}
