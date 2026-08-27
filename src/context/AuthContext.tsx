"use client";

import React, { createContext, useContext, useEffect, useState, useMemo, useCallback } from "react";
import {
  User,
  signInWithPopup,
  signInAnonymously,
  signOut as firebaseSignOut,
  onAuthStateChanged,
} from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebase";
import {
  getShopProfile,
  saveShopProfile,
  seedDefaultCategoriesIfEmpty,
  getCashiers,
  seedDefaultCashierIfEmpty,
  generateStoreCodeForOwner,
  verifyCashierLoginByStoreCode,
  getUserSubscription,
  updateUserIndustry,
} from "@/services/firestore";
import {
  ShopProfile,
  Cashier,
  UserRole,
  UserSubscription,
  IndustryPack,
  SubscriptionTier,
} from "@/types";
import { UpgradeProModal } from "@/components/subscription/UpgradeProModal";
import { TrialWelcomeModal } from "@/components/subscription/TrialWelcomeModal";

interface AuthContextType {
  user: User | null;
  storeOwnerUid: string; // Active database UID (Owner's UID)
  shopProfile: ShopProfile | null;
  cashiers: Cashier[];
  activeCashier: Cashier | null;
  activeRole: UserRole;
  activeIndustry: IndustryPack;
  activeTier: SubscriptionTier;
  isAnonymousCashier: boolean;
  loading: boolean;
  subscription: UserSubscription | null;
  isPro: boolean;
  isTrialActive: boolean;
  trialDaysLeft: number;
  isUpgradeModalOpen: boolean;
  openUpgradeModal: () => void;
  closeUpgradeModal: () => void;
  refreshSubscription: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  loginWithStoreCodeAndPin: (
    storeCode: string,
    pin: string
  ) => Promise<{ success: boolean; message: string }>;
  generateNewStoreCode: (customCode?: string) => Promise<string>;
  signOut: () => Promise<void>;
  refreshShopProfile: () => Promise<void>;
  refreshCashiers: () => Promise<void>;
  completeOnboarding: (
    industry: IndustryPack,
    profileData?: Partial<ShopProfile>
  ) => Promise<void>;
  loginCashierWithPin: (pin: string, cashierId?: string) => Promise<boolean>;
  logoutCashier: () => void;
  switchRoleToOwner: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [targetStoreOwnerUid, setTargetStoreOwnerUid] = useState<string | null>(null);
  const [shopProfile, setShopProfile] = useState<ShopProfile | null>(null);
  const [cashiers, setCashiers] = useState<Cashier[]>([]);
  const [activeCashier, setActiveCashier] = useState<Cashier | null>(null);
  const [activeRole, setActiveRole] = useState<UserRole>("owner");
  const [isAnonymousCashier, setIsAnonymousCashier] = useState(false);
  const [subscription, setSubscription] = useState<UserSubscription | null>(null);
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Effective Owner UID for scoping Firestore queries
  const storeOwnerUid =
    activeRole === "cashier" && targetStoreOwnerUid
      ? targetStoreOwnerUid
      : user?.uid || "";

  // Subscription Calculations
  const isPro = useMemo(() => {
    if (!subscription) return true; // Default permissive while initial load
    return subscription.status === "active" || subscription.status === "trial";
  }, [subscription]);

  const isTrialActive = useMemo(() => {
    if (!subscription || subscription.status !== "trial") return false;
    if (!subscription.trialEndsAt) return true;
    return new Date(subscription.trialEndsAt).getTime() > Date.now();
  }, [subscription]);

  const trialDaysLeft = useMemo(() => {
    if (!subscription?.trialEndsAt) return 30;
    const diff = new Date(subscription.trialEndsAt).getTime() - Date.now();
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  }, [subscription]);

  // Derived Industry & Tier
  const activeIndustry: IndustryPack = useMemo(() => {
    return subscription?.industry || "fnb";
  }, [subscription]);

  const activeTier: SubscriptionTier = useMemo(() => {
    if (subscription?.tier) return subscription.tier;
    if (isTrialActive || subscription?.status === "active") return "pro";
    return "basic";
  }, [subscription, isTrialActive]);

  // Sync Server Cookies for Next.js 16 Proxy Smart Routing
  const syncSessionCookie = useCallback(
    async (
      idToken?: string,
      overrideRole?: UserRole,
      overrideSub?: UserSubscription | null,
      overrideProfile?: ShopProfile | null
    ) => {
      try {
        const sub = overrideSub !== undefined ? overrideSub : subscription;
        const prof = overrideProfile !== undefined ? overrideProfile : shopProfile;
        const currentRole = overrideRole || activeRole;
        const subTier = sub?.tier || (sub?.status === "active" || isTrialActive ? "pro" : "basic");
        const subIndustry = sub?.industry || prof?.industry || "";

        await fetch("/api/auth/session", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            idToken: idToken || user?.uid || "session-token",
            userId: storeOwnerUid || user?.uid || "",
            role: currentRole,
            tier: subTier,
            industry: subIndustry,
            isTrial: isTrialActive,
            isActive: sub?.status === "active" || isTrialActive,
            storeCode: prof?.storeCode || "",
          }),
        });
      } catch (err) {

        console.warn("Failed to sync session cookies:", err);
      }
    },
    [activeRole, subscription, isTrialActive, user, storeOwnerUid, shopProfile]
  );

  const fetchSubscription = async (uid: string) => {
    try {
      const sub = await getUserSubscription(uid);
      setSubscription(sub);
      syncSessionCookie(undefined, undefined, sub);
    } catch (err) {
      console.warn("Failed loading subscription:", err);
    }
  };

  const fetchProfileAndCashiers = async (ownerUid: string, isOwner = true) => {
    try {
      let profile = await getShopProfile(ownerUid);
      if (!profile && isOwner && user) {
        // Inisialisasi profil toko pertama kali jika belum ada
        const newProfile: Partial<ShopProfile> = {
          shopName: user.displayName ? `Toko ${user.displayName}` : "Toko Saya",
          ownerName: user.displayName || "Pemilik Toko",
          email: user.email || "",
          phoneNumber: user.phoneNumber || "",
          address: "Indonesia",
          receiptFooter: "Terima kasih atas kunjungan Anda!",
          taxPercentage: 0,
          currency: "IDR",
          paperSize: "58mm",
        };
        await saveShopProfile(ownerUid, newProfile);
        profile = await getShopProfile(ownerUid);
      }

      // Pastikan toko memiliki storeCode unik untuk login kasir
      if (profile && !profile.storeCode && isOwner) {
        const generatedCode = await generateStoreCodeForOwner(
          ownerUid,
          profile.shopName,
          profile.ownerName
        );
        profile.storeCode = generatedCode;
      }

      setShopProfile(profile);

      if (isOwner) {
        // Inisialisasi kategori & kasir bawaan jika akun baru
        await seedDefaultCategoriesIfEmpty(ownerUid);
        await seedDefaultCashierIfEmpty(ownerUid, profile?.ownerName);

        // Load cashiers & subscription
        const [cashierList] = await Promise.all([
          getCashiers(ownerUid),
          fetchSubscription(ownerUid),
        ]);
        setCashiers(cashierList);

        // Check saved cashier session in localStorage
        const savedCashierId = localStorage.getItem(`pos_cashier_id_${ownerUid}`);
        const savedRole = localStorage.getItem(`pos_active_role_${ownerUid}`) as UserRole;
        if (savedCashierId) {
          const found = cashierList.find((c) => c.id === savedCashierId);
          if (found) {
            setActiveCashier(found);
            setActiveRole(savedRole || "cashier");
          }
        } else {
          setIsAnonymousCashier(false);
        }
      }

      // Re-sync cookie in case shopProfile has the industry but subscription didn't load it in time
      if (profile) {
        syncSessionCookie(undefined, undefined, undefined, profile); // Pass explicit profile
      }
    } catch (err) {
      console.error("Error loading user shop profile & cashiers:", err);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        // Cek apakah ini sesi kasir anonim yang tersimpan
        const savedAnonOwnerUid = localStorage.getItem("pos_anon_owner_uid");
        const savedAnonCashierId = localStorage.getItem("pos_anon_cashier_id");

        if (currentUser.isAnonymous && savedAnonOwnerUid) {
          setIsAnonymousCashier(true);
          setTargetStoreOwnerUid(savedAnonOwnerUid);
          setActiveRole("cashier");

          const [profile, cashierList] = await Promise.all([
            getShopProfile(savedAnonOwnerUid),
            getCashiers(savedAnonOwnerUid),
            fetchSubscription(savedAnonOwnerUid),
          ]);
          setShopProfile(profile);
          const found = cashierList.find((c) => c.id === savedAnonCashierId);
          if (found) setActiveCashier(found);

          const token = await currentUser.getIdToken();
          syncSessionCookie(token, "cashier");
        } else if (!currentUser.isAnonymous) {
          setIsAnonymousCashier(false);
          setTargetStoreOwnerUid(null);
          await fetchProfileAndCashiers(currentUser.uid, true);
          const token = await currentUser.getIdToken();
          syncSessionCookie(token, "owner");
        }
      } else {
        setShopProfile(null);
        setCashiers([]);
        setActiveCashier(null);
        setActiveRole("owner");
        setTargetStoreOwnerUid(null);
        setIsAnonymousCashier(false);
        setSubscription(null);
        // Force clear backend session cookies when firebase user is logged out/deleted
        fetch("/api/auth/session", { method: "DELETE" }).catch(() => {});
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    try {
      setLoading(true);
      const res = await signInWithPopup(auth, googleProvider);
      if (res.user) {
        setIsAnonymousCashier(false);
        setTargetStoreOwnerUid(null);
        setActiveRole("owner");
        await fetchProfileAndCashiers(res.user.uid, true);
        const token = await res.user.getIdToken();
        syncSessionCookie(token, "owner");
      }
    } catch (error: any) {
      console.error("Error signing in with Google:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Login Kasir Anonim dengan Kode Toko & PIN
  const loginWithStoreCodeAndPin = async (
    storeCode: string,
    pin: string
  ): Promise<{ success: boolean; message: string }> => {
    try {
      setLoading(true);
      const cleanCode = storeCode.toUpperCase().trim();
      const cleanPin = pin.trim();

      // 1. Verifikasi kode toko dan PIN di database terlebih dahulu
      const verifyRes = await verifyCashierLoginByStoreCode(cleanCode, cleanPin);
      if (!verifyRes) {
        return {
          success: false,
          message: "Kode Toko tidak ditemukan atau PIN Kasir salah!",
        };
      }

      // 2. Lakukan Firebase Anonymous Sign-in jika belum memiliki auth token
      let authUser = auth.currentUser;
      if (!authUser) {
        const anonRes = await signInAnonymously(auth);
        authUser = anonRes.user;
      }

      // 3. Set state aktif ke mode Kasir terhubung dengan Owner Toko
      setIsAnonymousCashier(true);
      setTargetStoreOwnerUid(verifyRes.ownerUid);
      setActiveCashier(verifyRes.cashier);
      setActiveRole("cashier");
      setShopProfile(verifyRes.shopProfile);

      // 4. Simpan sesi ke localStorage
      localStorage.setItem("pos_anon_owner_uid", verifyRes.ownerUid);
      localStorage.setItem("pos_anon_cashier_id", verifyRes.cashier.id);
      localStorage.setItem("pos_anon_store_code", cleanCode);

      // Load kasir list toko untuk context
      const cashierList = await getCashiers(verifyRes.ownerUid);
      setCashiers(cashierList);

      const token = await authUser.getIdToken();
      syncSessionCookie(token, "cashier");

      return {
        success: true,
        message: `Selamat datang, ${verifyRes.cashier.name}! Berhasil masuk kasir ${verifyRes.shopProfile?.shopName || "Toko"}.`,
      };
    } catch (error: any) {
      console.error("Error logging in cashier anonymously:", error);
      return {
        success: false,
        message: error.message || "Terjadi kesalahan sistem saat login kasir.",
      };
    } finally {
      setLoading(false);
    }
  };

  const generateNewStoreCode = async (customCode?: string): Promise<string> => {
    if (!user) throw new Error("Pengguna belum login");
    const code = await generateStoreCodeForOwner(
      user.uid,
      shopProfile?.shopName || "Toko",
      shopProfile?.ownerName || user.displayName || "Pemilik",
      customCode
    );
    if (shopProfile) {
      setShopProfile({ ...shopProfile, storeCode: code });
    }
    return code;
  };

  const signOut = async () => {
    try {
      setLoading(true);
      // Bersihkan seluruh localStorage sesi kasir & owner
      localStorage.removeItem("pos_anon_owner_uid");
      localStorage.removeItem("pos_anon_cashier_id");
      localStorage.removeItem("pos_anon_store_code");
      if (user?.uid) {
        localStorage.removeItem(`pos_cashier_id_${user.uid}`);
        localStorage.removeItem(`pos_active_role_${user.uid}`);
      }

      // Bersihkan session cookies
      try {
        await fetch("/api/auth/session", { method: "DELETE" });
      } catch (err) {
        console.warn("Failed clearing session cookies:", err);
      }

      await firebaseSignOut(auth);
      setUser(null);
      setShopProfile(null);
      setCashiers([]);
      setActiveCashier(null);
      setActiveRole("owner");
      setTargetStoreOwnerUid(null);
      setIsAnonymousCashier(false);
      setSubscription(null);
    } catch (error) {
      console.error("Error signing out:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const refreshShopProfile = async () => {
    if (storeOwnerUid) {
      const profile = await getShopProfile(storeOwnerUid);
      setShopProfile(profile);
    }
  };

  const refreshCashiers = async () => {
    if (storeOwnerUid) {
      const list = await getCashiers(storeOwnerUid);
      setCashiers(list);
    }
  };

  const refreshSubscription = async () => {
    if (storeOwnerUid) {
      await fetchSubscription(storeOwnerUid);
    }
  };

  const loginCashierWithPin = async (pin: string, cashierId?: string): Promise<boolean> => {
    if (!storeOwnerUid) return false;
    let targetCashier: Cashier | undefined;

    if (cashierId) {
      targetCashier = cashiers.find((c) => c.id === cashierId);
    } else {
      targetCashier = cashiers.find((c) => c.pin === pin.trim());
    }

    if (targetCashier && targetCashier.pin === pin.trim() && targetCashier.isActive) {
      setActiveCashier(targetCashier);
      setActiveRole("cashier");
      localStorage.setItem(`pos_cashier_id_${storeOwnerUid}`, targetCashier.id);
      localStorage.setItem(`pos_active_role_${storeOwnerUid}`, "cashier");
      syncSessionCookie(undefined, "cashier");
      return true;
    }
    return false;
  };

  const logoutCashier = () => {
    setActiveCashier(null);
    setActiveRole("owner");
    if (storeOwnerUid) {
      localStorage.removeItem(`pos_cashier_id_${storeOwnerUid}`);
      localStorage.setItem(`pos_active_role_${storeOwnerUid}`, "owner");
    }
    syncSessionCookie(undefined, "owner");
  };

  const switchRoleToOwner = () => {
    setActiveRole("owner");
    if (storeOwnerUid) {
      localStorage.setItem(`pos_active_role_${storeOwnerUid}`, "owner");
    }
    syncSessionCookie(undefined, "owner");
  };

  const completeOnboarding = async (
    industry: IndustryPack,
    profileData?: Partial<ShopProfile>
  ) => {
    if (!storeOwnerUid || !user) return;
    
    // 1. Update shop profile in state and Firestore
    const newProfile: ShopProfile = {
      ...(shopProfile || ({} as ShopProfile)),
      ...profileData,
      userId: storeOwnerUid,
      industry,
      shopName: profileData?.shopName || shopProfile?.shopName || "Toko Baru",
      ownerName: profileData?.ownerName || shopProfile?.ownerName || user.displayName || "Pemilik Toko",
      email: profileData?.email || shopProfile?.email || user.email || "",
      phoneNumber: profileData?.phoneNumber || shopProfile?.phoneNumber || "",
      address: profileData?.address || shopProfile?.address || "",
    };
    
    setShopProfile(newProfile);
    try {
      await saveShopProfile(storeOwnerUid, newProfile);
    } catch (e) {
      console.warn("Could not save shop profile:", e);
    }
    
    // 2. Update subscription local state
    const updatedSub = { ...(subscription as any), industry };
    setSubscription(updatedSub);

    // 3. Update subscription doc in Firestore
    try {
      await updateUserIndustry(storeOwnerUid, industry);
    } catch (e) {
      console.warn("Could not update subscription doc:", e);
    }
    
    // 4. Re-sync cookie via API
    await syncSessionCookie(undefined, undefined, updatedSub, newProfile);
  };


  return (
    <AuthContext.Provider
      value={{
        user,
        storeOwnerUid,
        shopProfile,
        cashiers,
        activeCashier,
        activeRole,
        activeIndustry,
        activeTier,
        isAnonymousCashier,
        loading,
        subscription,
        isPro,
        isTrialActive,
        trialDaysLeft,
        isUpgradeModalOpen,
        openUpgradeModal: () => setIsUpgradeModalOpen(true),
        closeUpgradeModal: () => setIsUpgradeModalOpen(false),
        refreshSubscription,
        signInWithGoogle,
        loginWithStoreCodeAndPin,
        generateNewStoreCode,
        signOut,
        refreshShopProfile,
        refreshCashiers,
        completeOnboarding,
        loginCashierWithPin,
        logoutCashier,
        switchRoleToOwner,
      }}
    >
      {children}

      {/* Global Upgrade PRO Modal powered by Mayar.id */}
      <UpgradeProModal
        isOpen={isUpgradeModalOpen}
        onClose={() => setIsUpgradeModalOpen(false)}
      />

      {/* First-Time Login 3-Day Free Trial Welcome Modal */}
      <TrialWelcomeModal />
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
