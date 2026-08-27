import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  writeBatch,
  increment,
  serverTimestamp,
  onSnapshot,
  Unsubscribe,
  arrayUnion,
} from "firebase/firestore";
import { db, functions } from "@/lib/firebase";
import { httpsCallable } from "firebase/functions";
import {
  ShopProfile,
  Product,
  Category,
  Transaction,
  Expense,
  Customer,
  DebtPayment,
  DashboardSummary,
  HppRecipe,
  Cashier,
  StoreCodeMapping,
  UserSubscription,
  PaymentTransaction,
  SubscriptionPlanId,
  RawMaterial,
  RawMaterialCategory,
  RawMaterialDeduction,
  IncomingOrder,
  OrderStatus,
  IncomingOrderItem,
} from "@/types";

/* -------------------------------------------------------------
 * HELPER: SANITIZE OBJECT TO STRIP UNDEFINED VALUES
 * ------------------------------------------------------------- */
function sanitizeForFirestore<T extends Record<string, any>>(obj: T): T {
  const result: Record<string, any> = {};
  for (const [key, value] of Object.entries(obj)) {
    if (value !== undefined) {
      if (value !== null && typeof value === "object" && !Array.isArray(value)) {
        result[key] = sanitizeForFirestore(value);
      } else if (Array.isArray(value)) {
        result[key] = value.map((item) =>
          typeof item === "object" && item !== null ? sanitizeForFirestore(item) : item
        );
      } else {
        result[key] = value;
      }
    }
  }
  return result as T;
}

/* -------------------------------------------------------------
 * SHOP PROFILE & SETTINGS
 * ------------------------------------------------------------- */
export async function getShopProfile(uid: string): Promise<ShopProfile | null> {
  if (!uid) return null;
  const docRef = doc(db, "users", uid);
  const snap = await getDoc(docRef);
  if (snap.exists()) {
    return { id: snap.id, ...snap.data() } as ShopProfile;
  }
  return null;
}

export async function saveShopProfile(
  uid: string,
  profileData: Partial<ShopProfile>
): Promise<void> {
  if (!uid) return;
  const docRef = doc(db, "users", uid);
  const payload = sanitizeForFirestore({
    ...profileData,
    userId: uid,
    updatedAt: new Date().toISOString(),
  });
  await setDoc(docRef, payload, { merge: true });
}

/* -------------------------------------------------------------
 * CATEGORIES
 * ------------------------------------------------------------- */
export async function getCategories(uid: string): Promise<Category[]> {
  if (!uid) return [];
  const colRef = collection(db, "users", uid, "categories");
  const q = query(colRef, orderBy("name", "asc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Category));
}

export async function createCategory(
  uid: string,
  data: Omit<Category, "id">
): Promise<Category> {
  const colRef = collection(db, "users", uid, "categories");
  const res = await addDoc(colRef, {
    ...data,
    createdAt: new Date().toISOString(),
  });
  return { id: res.id, ...data };
}

export async function deleteCategory(uid: string, id: string): Promise<void> {
  await deleteDoc(doc(db, "users", uid, "categories", id));
}

export async function seedDefaultCategoriesIfEmpty(uid: string): Promise<void> {
  const categories = await getCategories(uid);
  if (categories.length === 0) {
    const defaultCats = [
      { name: "Makanan", color: "amber" },
      { name: "Minuman", color: "blue" },
      { name: "Snack & Cemilan", color: "orange" },
      { name: "Sembako", color: "emerald" },
      { name: "Jasa / Layanan", color: "purple" },
      { name: "Lain-lain", color: "slate" },
    ];
    for (const cat of defaultCats) {
      await createCategory(uid, cat);
    }
  }
}

/* -------------------------------------------------------------
 * PRODUCTS & INVENTORY
 * ------------------------------------------------------------- */
export async function getProducts(uid: string): Promise<Product[]> {
  if (!uid) return [];
  const colRef = collection(db, "users", uid, "products");
  const q = query(colRef, orderBy("name", "asc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Product));
}

export async function createProduct(
  uid: string,
  data: Omit<Product, "id">
): Promise<Product> {
  const colRef = collection(db, "users", uid, "products");
  const now = new Date().toISOString();
  const res = await addDoc(colRef, {
    ...data,
    stock: Number(data.stock) || 0,
    costPrice: Number(data.costPrice) || 0,
    sellingPrice: Number(data.sellingPrice) || 0,
    minStockAlert: Number(data.minStockAlert) || 5,
    createdAt: now,
    updatedAt: now,
  });
  return { id: res.id, ...data };
}

export async function updateProduct(
  uid: string,
  id: string,
  data: Partial<Product>
): Promise<void> {
  const docRef = doc(db, "users", uid, "products", id);
  const updatePayload: Record<string, any> = {
    ...data,
    updatedAt: new Date().toISOString(),
  };
  if (data.stock !== undefined) updatePayload.stock = Number(data.stock);
  if (data.costPrice !== undefined) updatePayload.costPrice = Number(data.costPrice);
  if (data.sellingPrice !== undefined) updatePayload.sellingPrice = Number(data.sellingPrice);
  if (data.minStockAlert !== undefined) updatePayload.minStockAlert = Number(data.minStockAlert);

  await updateDoc(docRef, updatePayload);
}

export async function deleteProduct(uid: string, id: string): Promise<void> {
  await deleteDoc(doc(db, "users", uid, "products", id));
}

/* -------------------------------------------------------------
 * TRANSACTIONS & POS CHECKOUT
 * ------------------------------------------------------------- */
export async function createTransaction(
  uid: string,
  trx: Omit<Transaction, "id">
): Promise<Transaction> {
  const batch = writeBatch(db);
  const trxRef = doc(collection(db, "users", uid, "transactions"));

  const now = new Date().toISOString();
  const fullTrx: Transaction = {
    ...trx,
    id: trxRef.id,
    date: trx.date || now,
    createdAt: now,
  };

  const sanitizedTrx = sanitizeForFirestore(fullTrx);

  // 1. Simpan Transaksi
  batch.set(trxRef, sanitizedTrx);

  // 2. Kurangi stok produk secara atomik
  for (const item of trx.items) {
    if (item.productId) {
      const prodRef = doc(db, "users", uid, "products", item.productId);
      batch.update(prodRef, {
        stock: increment(-Number(item.quantity)),
        updatedAt: now,
      });
    }
  }

  // 3. Jika metode kasbon/debt dan ada pelanggan, update piutang pelanggan
  if (trx.paymentMethod === "debt" && trx.customerId) {
    const custRef = doc(db, "users", uid, "customers", trx.customerId);
    batch.update(custRef, {
      totalDebt: increment(trx.totalAmount),
      totalSpent: increment(trx.totalAmount),
    });
  } else if (trx.customerId) {
    const custRef = doc(db, "users", uid, "customers", trx.customerId);
    batch.update(custRef, {
      totalSpent: increment(trx.totalAmount),
    });
  }

  await batch.commit();
  return fullTrx;
}

export async function getTransactions(
  uid: string,
  limitCount = 100
): Promise<Transaction[]> {
  if (!uid) return [];
  const colRef = collection(db, "users", uid, "transactions");
  const q = query(colRef, orderBy("date", "desc"), limit(limitCount));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Transaction));
}

/* -------------------------------------------------------------
 * EXPENSES (PENGELUARAN USAHA)
 * ------------------------------------------------------------- */
export async function getExpenses(uid: string): Promise<Expense[]> {
  if (!uid) return [];
  const colRef = collection(db, "users", uid, "expenses");
  const q = query(colRef, orderBy("date", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Expense));
}

export async function createExpense(
  uid: string,
  data: Omit<Expense, "id">
): Promise<Expense> {
  const colRef = collection(db, "users", uid, "expenses");
  const now = new Date().toISOString();
  const res = await addDoc(colRef, {
    ...data,
    amount: Number(data.amount) || 0,
    createdAt: now,
  });
  return { id: res.id, ...data };
}

export async function deleteExpense(uid: string, id: string): Promise<void> {
  await deleteDoc(doc(db, "users", uid, "expenses", id));
}

/* -------------------------------------------------------------
 * CUSTOMERS & DEBTS (PELANGGAN & KASBON / PIUTANG)
 * ------------------------------------------------------------- */
export async function getCustomers(uid: string): Promise<Customer[]> {
  if (!uid) return [];
  const colRef = collection(db, "users", uid, "customers");
  const q = query(colRef, orderBy("name", "asc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Customer));
}

export async function createCustomer(
  uid: string,
  data: Omit<Customer, "id">
): Promise<Customer> {
  const colRef = collection(db, "users", uid, "customers");
  const res = await addDoc(colRef, {
    ...data,
    totalDebt: Number(data.totalDebt) || 0,
    totalSpent: Number(data.totalSpent) || 0,
    createdAt: new Date().toISOString(),
  });
  return { id: res.id, ...data };
}

export async function settleCustomerDebt(
  uid: string,
  customerId: string,
  customerName: string,
  amount: number,
  paymentMethod: "cash" | "transfer" | "qris",
  notes?: string
): Promise<DebtPayment> {
  const batch = writeBatch(db);
  const now = new Date().toISOString();

  // 1. Simpan rekaman pembayaran piutang
  const payRef = doc(collection(db, "users", uid, "debt_payments"));
  const paymentRecord: DebtPayment = {
    id: payRef.id,
    customerId,
    customerName,
    amount: Number(amount),
    date: now,
    paymentMethod,
    notes: notes || "Pelunasan Kasbon",
    createdAt: now,
  };
  batch.set(payRef, paymentRecord);

  // 2. Kurangi sisa kasbon pada data pelanggan
  const custRef = doc(db, "users", uid, "customers", customerId);
  batch.update(custRef, {
    totalDebt: increment(-Number(amount)),
  });

  await batch.commit();
  return paymentRecord;
}

export async function getDebtPayments(uid: string): Promise<DebtPayment[]> {
  if (!uid) return [];
  const colRef = collection(db, "users", uid, "debt_payments");
  const q = query(colRef, orderBy("date", "desc"), limit(50));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as DebtPayment));
}

/* -------------------------------------------------------------
 * DASHBOARD & FINANCIAL SUMMARY
 * ------------------------------------------------------------- */
export async function getDashboardData(uid: string): Promise<DashboardSummary> {
  if (!uid) {
    return {
      todayRevenue: 0,
      todayProfit: 0,
      todayTransactions: 0,
      monthRevenue: 0,
      monthProfit: 0,
      monthExpenses: 0,
      netProfit: 0,
      totalProducts: 0,
      lowStockCount: 0,
      totalReceivables: 0,
    };
  }

  const todayStr = new Date().toISOString().slice(0, 10);
  const currentMonthStr = new Date().toISOString().slice(0, 7);

  // Fetch all needed entities
  const [products, transactions, expenses, customers] = await Promise.all([
    getProducts(uid),
    getTransactions(uid, 500),
    getExpenses(uid),
    getCustomers(uid),
  ]);

  let todayRevenue = 0;
  let todayProfit = 0;
  let todayTransactions = 0;
  let monthRevenue = 0;
  let monthProfit = 0;

  for (const trx of transactions) {
    const trxDate = trx.date ? trx.date.slice(0, 10) : "";
    const trxMonth = trx.date ? trx.date.slice(0, 7) : "";

    if (trxDate === todayStr) {
      todayRevenue += trx.totalAmount || 0;
      todayProfit += trx.grossProfit || 0;
      todayTransactions += 1;
    }

    if (trxMonth === currentMonthStr) {
      monthRevenue += trx.totalAmount || 0;
      monthProfit += trx.grossProfit || 0;
    }
  }

  let monthExpenses = 0;
  for (const exp of expenses) {
    const expMonth = exp.date ? exp.date.slice(0, 7) : "";
    if (expMonth === currentMonthStr) {
      monthExpenses += exp.amount || 0;
    }
  }

  const lowStockCount = products.filter(
    (p) => p.stock <= (p.minStockAlert || 5)
  ).length;

  const totalReceivables = customers.reduce(
    (acc, curr) => acc + (curr.totalDebt > 0 ? curr.totalDebt : 0),
    0
  );

  return {
    todayRevenue,
    todayProfit,
    todayTransactions,
    monthRevenue,
    monthProfit,
    monthExpenses,
    netProfit: monthProfit - monthExpenses,
    totalProducts: products.length,
    lowStockCount,
    totalReceivables,
  };
}

/* -------------------------------------------------------------
 * HPP RECIPES & SMART PRICING INTELLIGENCE
 * ------------------------------------------------------------- */
export async function getHppRecipes(uid: string): Promise<HppRecipe[]> {
  if (!uid) return [];
  const colRef = collection(db, "users", uid, "hpp_recipes");
  const q = query(colRef, orderBy("name", "asc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as HppRecipe));
}

export async function saveHppRecipe(
  uid: string,
  recipeData: Omit<HppRecipe, "id">,
  existingId?: string
): Promise<HppRecipe> {
  const colRef = collection(db, "users", uid, "hpp_recipes");
  const now = new Date().toISOString();

  if (existingId) {
    const docRef = doc(db, "users", uid, "hpp_recipes", existingId);
    await setDoc(
      docRef,
      {
        ...recipeData,
        updatedAt: now,
      },
      { merge: true }
    );
    return { id: existingId, ...recipeData, updatedAt: now };
  } else {
    const res = await addDoc(colRef, {
      ...recipeData,
      createdAt: now,
      updatedAt: now,
    });
    return { id: res.id, ...recipeData, createdAt: now, updatedAt: now };
  }
}

export async function deleteHppRecipe(uid: string, id: string): Promise<void> {
  await deleteDoc(doc(db, "users", uid, "hpp_recipes", id));
}

export async function applyHppToProduct(
  uid: string,
  name: string,
  costPrice: number,
  sellingPrice: number,
  categoryName?: string,
  unit?: string,
  existingProductId?: string
): Promise<Product> {
  const now = new Date().toISOString();
  if (existingProductId) {
    const docRef = doc(db, "users", uid, "products", existingProductId);
    await updateDoc(docRef, {
      name,
      costPrice: Number(costPrice),
      sellingPrice: Number(sellingPrice),
      categoryName: categoryName || "Umum",
      unit: unit || "Pcs",
      updatedAt: now,
    });
    const snap = await getDoc(docRef);
    return { id: existingProductId, ...snap.data() } as Product;
  } else {
    const colRef = collection(db, "users", uid, "products");
    const res = await addDoc(colRef, {
      name,
      costPrice: Number(costPrice),
      sellingPrice: Number(sellingPrice),
      categoryName: categoryName || "Umum",
      unit: unit || "Pcs",
      stock: 50,
      minStockAlert: 10,
      createdAt: now,
      updatedAt: now,
    });
    return {
      id: res.id,
      name,
      costPrice,
      sellingPrice,
      categoryName,
      unit: unit || "Pcs",
      stock: 50,
      minStockAlert: 10,
    };
  }
}

/* -------------------------------------------------------------
 * CASHIERS & STAFF MANAGEMENT
 * ------------------------------------------------------------- */
export async function getCashiers(uid: string): Promise<Cashier[]> {
  if (!uid) return [];
  const colRef = collection(db, "users", uid, "cashiers");
  const q = query(colRef, orderBy("name", "asc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Cashier));
}

export async function createCashier(
  uid: string,
  data: Omit<Cashier, "id">
): Promise<Cashier> {
  const colRef = collection(db, "users", uid, "cashiers");
  const now = new Date().toISOString();
  const res = await addDoc(colRef, {
    ...data,
    isActive: data.isActive !== undefined ? data.isActive : true,
    createdAt: now,
    updatedAt: now,
  });
  return { id: res.id, ...data, isActive: data.isActive !== undefined ? data.isActive : true };
}

export async function updateCashier(
  uid: string,
  id: string,
  data: Partial<Cashier>
): Promise<void> {
  const docRef = doc(db, "users", uid, "cashiers", id);
  await updateDoc(docRef, {
    ...data,
    updatedAt: new Date().toISOString(),
  });
}

export async function deleteCashier(uid: string, id: string): Promise<void> {
  await deleteDoc(doc(db, "users", uid, "cashiers", id));
}

export async function seedDefaultCashierIfEmpty(
  uid: string,
  ownerName?: string
): Promise<void> {
  const cashiers = await getCashiers(uid);
  if (cashiers.length === 0) {
    await createCashier(uid, {
      name: ownerName ? `Kasir ${ownerName}` : "Kasir Utama",
      pin: "1234",
      role: "cashier",
      isActive: true,
      notes: "Akun kasir bawaan",
    });
  }
}

/* -------------------------------------------------------------
 * STORE CODES (MAPPING FOR ANONYMOUS CASHIER LOGIN)
 * ------------------------------------------------------------- */
export async function getStoreByCode(
  code: string
): Promise<StoreCodeMapping | null> {
  if (!code) return null;
  const cleanCode = code.toUpperCase().trim();
  const docRef = doc(db, "store_codes", cleanCode);
  const snap = await getDoc(docRef);
  if (snap.exists()) {
    return snap.data() as StoreCodeMapping;
  }
  return null;
}

export async function generateStoreCodeForOwner(
  ownerUid: string,
  shopName: string,
  ownerName?: string,
  customCode?: string
): Promise<string> {
  let targetCode = customCode
    ? customCode.toUpperCase().trim()
    : `TK-${Math.floor(100000 + Math.random() * 900000)}`;

  const now = new Date().toISOString();
  const storeData: StoreCodeMapping = {
    code: targetCode,
    ownerUid,
    shopName: shopName || "Toko UMKM",
    ownerName: ownerName || "Pemilik Toko",
    isActive: true,
    createdAt: now,
    updatedAt: now,
  };

  // Simpan mapping kode toko global
  const docRef = doc(db, "store_codes", targetCode);
  await setDoc(docRef, storeData);

  // Simpan kode toko ke profil toko pemilik
  await saveShopProfile(ownerUid, { storeCode: targetCode });

  return targetCode;
}

export async function verifyCashierLoginByStoreCode(
  storeCode: string,
  pin: string
): Promise<{
  ownerUid: string;
  cashier: Cashier;
  shopProfile: ShopProfile | null;
} | null> {
  const cleanCode = storeCode.toUpperCase().trim();
  const cleanPin = pin.trim();

  // 1. Coba verifikasi melalui Serverless Cloud Function (Aman & Terisolasi)
  try {
    const verifyPinCallable = httpsCallable<
      { storeCode: string; pin: string },
      {
        success: boolean;
        ownerUid: string;
        shopName: string;
        cashier: Cashier;
      }
    >(functions, "verifyCashierPin");

    const result = await verifyPinCallable({ storeCode: cleanCode, pin: cleanPin });
    if (result.data && result.data.success) {
      const profile = await getShopProfile(result.data.ownerUid);
      return {
        ownerUid: result.data.ownerUid,
        cashier: result.data.cashier,
        shopProfile: profile,
      };
    }
  } catch (fnErr: any) {
    console.warn("Cloud Functions verifyCashierPin fallback to Firestore direct check:", fnErr?.message || fnErr);
  }

  // 2. Fallback Direct Firestore Check
  const storeMapping = await getStoreByCode(cleanCode);
  if (!storeMapping || !storeMapping.isActive) {
    return null;
  }

  const ownerUid = storeMapping.ownerUid;
  const [cashierList, profile] = await Promise.all([
    getCashiers(ownerUid),
    getShopProfile(ownerUid),
  ]);

  const targetCashier = cashierList.find(
    (c) => c.pin === cleanPin && c.isActive
  );

  if (!targetCashier) {
    return null;
  }

  return {
    ownerUid,
    cashier: targetCashier,
    shopProfile: profile,
  };
}

/* -------------------------------------------------------------
 * SUBSCRIPTION & IN-APP PURCHASE MANAGEMENT (30-DAY TRIAL & PRO)
 * ------------------------------------------------------------- */
export async function getUserSubscription(uid: string): Promise<UserSubscription | null> {
  if (!uid) return null;
  const docRef = doc(db, "users", uid, "subscription", "current");
  const snap = await getDoc(docRef);

  if (!snap.exists()) {
    // If no subscription record exists yet, initialize a 30-Day Free Trial!
    return await initTrialSubscription(uid);
  }

  const sub = snap.data() as UserSubscription;

  // Check if trial has expired or needs migration to 30-day policy
  if (sub.status === "trial") {
    const startTime = sub.trialStartedAt ? new Date(sub.trialStartedAt).getTime() : new Date().getTime();
    const endTime = sub.trialEndsAt ? new Date(sub.trialEndsAt).getTime() : startTime;
    const durationDays = (endTime - startTime) / (1000 * 60 * 60 * 24);

    // Auto-migrate legacy 3-day trial accounts (< 25 days duration) to full 30 days
    if (durationDays < 25) {
      const newTrialEnd = new Date(startTime + 30 * 24 * 60 * 60 * 1000);
      sub.trialEndsAt = newTrialEnd.toISOString();
      sub.planName = "Trial Gratis (30 Hari) + Akses HPP";
      sub.tier = "pro";
      await setDoc(docRef, { 
        trialEndsAt: sub.trialEndsAt, 
        planName: sub.planName,
        tier: "pro",
        updatedAt: new Date().toISOString()
      }, { merge: true });
    }

    const trialEnd = new Date(sub.trialEndsAt).getTime();
    if (Date.now() > trialEnd) {
      const expiredSub: UserSubscription = {
        ...sub,
        status: "expired",
        updatedAt: new Date().toISOString(),
      };
      await setDoc(docRef, expiredSub, { merge: true });
      return expiredSub;
    }
  }

  // Check if active subscription has expired
  if (sub.status === "active" && sub.validUntil && !sub.isLifetime) {
    const validEnd = new Date(sub.validUntil).getTime();
    if (Date.now() > validEnd) {
      const expiredSub: UserSubscription = {
        ...sub,
        status: "expired",
        updatedAt: new Date().toISOString(),
      };
      await setDoc(docRef, expiredSub, { merge: true });
      return expiredSub;
    }
  }

  return sub;
}

export async function initTrialSubscription(uid: string): Promise<UserSubscription> {
  const now = new Date();
  const trialEnd = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000); // 30 Days Free Trial

  const trialSub: UserSubscription = {
    status: "trial",
    planId: "trial",
    planName: "Trial Gratis (30 Hari) + Akses HPP",
    industry: "" as any,
    tier: "pro",
    trialStartedAt: now.toISOString(),
    trialEndsAt: trialEnd.toISOString(),
    updatedAt: now.toISOString(),
  };

  const docRef = doc(db, "users", uid, "subscription", "current");
  await setDoc(docRef, trialSub, { merge: true });
  return trialSub;
}

export async function activateProSubscription(
  uid: string,
  planId: SubscriptionPlanId,
  txId?: string,
  amount?: number
): Promise<UserSubscription> {
  const now = new Date();
  let days = 30;
  let isLifetime = false;
  let planName = "Paket Bulanan PRO";

  if (planId === "yearly") {
    days = 365;
    planName = "Paket Tahunan PRO";
  } else if (planId === "lifetime") {
    days = 3650;
    isLifetime = true;
    planName = "Paket Lifetime PRO";
  }

  const validUntil = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);

  const activeSub: UserSubscription = {
    status: "active",
    planId,
    planName,
    trialStartedAt: now.toISOString(),
    trialEndsAt: now.toISOString(),
    validUntil: validUntil.toISOString(),
    isLifetime,
    lastPaymentId: txId,
    lastPaymentAmount: amount,
    updatedAt: now.toISOString(),
  };

  const docRef = doc(db, "users", uid, "subscription", "current");
  await setDoc(docRef, activeSub, { merge: true });
  return activeSub;
}

export async function updateUserIndustry(uid: string, industry: string): Promise<void> {
  const docRef = doc(db, "users", uid, "subscription", "current");
  await setDoc(docRef, { industry, updatedAt: new Date().toISOString() }, { merge: true });
}


export async function createPaymentTransaction(tx: PaymentTransaction): Promise<void> {
  const docRef = doc(db, "payment_transactions", tx.id);
  await setDoc(docRef, tx);
}

export async function getPaymentTransaction(txId: string): Promise<PaymentTransaction | null> {
  if (!txId) return null;
  const docRef = doc(db, "payment_transactions", txId);
  const snap = await getDoc(docRef);
  if (!snap.exists()) return null;
  return snap.data() as PaymentTransaction;
}

export async function updatePaymentTransaction(
  txId: string,
  updates: Partial<PaymentTransaction>
): Promise<void> {
  const docRef = doc(db, "payment_transactions", txId);
  await updateDoc(docRef, {
    ...updates,
    updatedAt: new Date().toISOString(),
  });
}

/* -------------------------------------------------------------
 * RAW MATERIALS & INVENTORY MANAGEMENT (STOK BAHAN BAKU & KEMASAN)
 * ------------------------------------------------------------- */
export async function getRawMaterials(uid: string): Promise<RawMaterial[]> {
  if (!uid) return [];
  const colRef = collection(db, "users", uid, "raw_materials");
  const q = query(colRef, orderBy("name", "asc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as RawMaterial));
}

export async function saveRawMaterial(
  uid: string,
  material: Partial<RawMaterial>
): Promise<string> {
  if (!uid) throw new Error("UID wajib ada");
  const now = new Date().toISOString();
  const colRef = collection(db, "users", uid, "raw_materials");

  if (material.id) {
    const docRef = doc(colRef, material.id);
    const sanitized = sanitizeForFirestore({
      ...material,
      updatedAt: now,
    });
    await setDoc(docRef, sanitized, { merge: true });
    return material.id;
  } else {
    const sanitized = sanitizeForFirestore({
      name: material.name || "Bahan Baru",
      category: material.category || "Bahan Baku",
      stock: Number(material.stock || 0),
      unit: material.unit || "Pcs",
      costPerUnit: Number(material.costPerUnit || 0),
      minStockAlert: Number(material.minStockAlert || 10),
      sku: material.sku || "",
      notes: material.notes || "",
      createdAt: now,
      updatedAt: now,
    });
    const newDoc = await addDoc(colRef, sanitized);
    return newDoc.id;
  }
}

export async function deleteRawMaterial(uid: string, materialId: string): Promise<void> {
  if (!uid || !materialId) return;
  const docRef = doc(db, "users", uid, "raw_materials", materialId);
  await deleteDoc(docRef);
}

export async function restockRawMaterial(
  uid: string,
  materialId: string,
  addedStock: number,
  totalCost?: number,
  recordExpense: boolean = true
): Promise<void> {
  if (!uid || !materialId || addedStock <= 0) return;
  const docRef = doc(db, "users", uid, "raw_materials", materialId);
  const snap = await getDoc(docRef);
  if (!snap.exists()) return;

  const mat = snap.data() as RawMaterial;
  const newStock = (mat.stock || 0) + addedStock;
  const newCostPerUnit = totalCost && totalCost > 0 ? totalCost / addedStock : mat.costPerUnit;

  await updateDoc(docRef, {
    stock: newStock,
    costPerUnit: newCostPerUnit,
    updatedAt: new Date().toISOString(),
  });

  // Catat otomatis ke buku pengeluaran jika diinginkan
  if (recordExpense && totalCost && totalCost > 0) {
    await createExpense(uid, {
      category: "Belanja Bahan Baku",
      amount: totalCost,
      description: `Restock ${mat.name}: +${addedStock} ${mat.unit}`,
      date: new Date().toISOString().slice(0, 10),
    });
  }
}

export async function importHppRecipeToRawMaterials(
  uid: string,
  recipe: HppRecipe
): Promise<number> {
  if (!uid || !recipe) return 0;
  const existingList = await getRawMaterials(uid);
  let importedCount = 0;

  // 1. Import Bahan Baku dari Resep
  for (const ing of recipe.ingredients || []) {
    const found = existingList.find(
      (m) => m.name.toLowerCase().trim() === ing.name.toLowerCase().trim()
    );
    if (!found) {
      const costPerUnit = ing.packageQty > 0 ? ing.packagePrice / ing.packageQty : ing.cost;
      await saveRawMaterial(uid, {
        name: ing.name,
        category: "Bahan Baku",
        stock: ing.packageQty || 1000,
        unit: ing.packageUnit || ing.usedUnit || "Gram",
        costPerUnit: costPerUnit,
        minStockAlert: (ing.packageQty || 1000) * 0.2, // 20% buffer
        notes: `Diimpor otomatis dari Resep ${recipe.name}`,
      });
      importedCount++;
    }
  }

  // 2. Import Kemasan dari Resep
  for (const pack of recipe.packagings || []) {
    const found = existingList.find(
      (m) => m.name.toLowerCase().trim() === pack.name.toLowerCase().trim()
    );
    if (!found) {
      await saveRawMaterial(uid, {
        name: pack.name,
        category: "Kemasan",
        stock: 100,
        unit: "Pcs",
        costPerUnit: pack.unitPrice || pack.cost,
        minStockAlert: 20,
        notes: `Kemasan diimpor dari Resep ${recipe.name}`,
      });
      importedCount++;
    }
  }

  return importedCount;
}

export async function deductRawMaterialsForTransaction(
  uid: string,
  items: Array<{ productId: string; quantity: number }>
): Promise<Array<{ materialName: string; remainingStock: number; isLow: boolean }>> {
  if (!uid || !items || items.length === 0) return [];

  const [products, rawMaterials] = await Promise.all([
    getProducts(uid),
    getRawMaterials(uid),
  ]);

  const lowStockWarnings: Array<{ materialName: string; remainingStock: number; isLow: boolean }> = [];
  const batch = writeBatch(db);
  let hasUpdates = false;

  for (const item of items) {
    const product = products.find((p) => p.id === item.productId);
    if (!product || !product.rawMaterialDeductions || product.rawMaterialDeductions.length === 0) {
      continue;
    }

    for (const deduction of product.rawMaterialDeductions) {
      const targetMat = rawMaterials.find(
        (m) => m.id === deduction.materialId || m.name.toLowerCase().trim() === deduction.materialName.toLowerCase().trim()
      );

      if (targetMat) {
        const totalDeducted = deduction.amount * item.quantity;
        const newStock = Math.max(0, (targetMat.stock || 0) - totalDeducted);
        targetMat.stock = newStock; // update local

        const docRef = doc(db, "users", uid, "raw_materials", targetMat.id);
        batch.update(docRef, {
          stock: newStock,
          updatedAt: new Date().toISOString(),
        });
        hasUpdates = true;

        if (newStock <= (targetMat.minStockAlert || 10)) {
          lowStockWarnings.push({
            materialName: targetMat.name,
            remainingStock: newStock,
            isLow: true,
          });
        }
      }
    }
  }

  if (hasUpdates) {
    await batch.commit();
  }

  return lowStockWarnings;
}

/* -------------------------------------------------------------
 * INCOMING DIGITAL ORDERS & LIVE KITCHEN HUB (100% IN-APP)
 * ------------------------------------------------------------- */
export async function createIncomingOrder(
  storeCode: string,
  orderData: {
    ownerUid: string;
    customerName: string;
    orderType: "dine-in" | "takeaway";
    tableNumber: string;
    items: IncomingOrderItem[];
    totalAmount: number;
    totalQty: number;
    generalNotes?: string;
  }
): Promise<{ id: string; orderNumber: string }> {
  if (!orderData.ownerUid) throw new Error("Owner UID wajib ada");

  const now = new Date().toISOString();
  const rawNum = Math.floor(100 + Math.random() * 900);
  const orderNumber = `ORD-${rawNum}`;

  const colRef = collection(db, "users", orderData.ownerUid, "incoming_orders");
  const payload: Omit<IncomingOrder, "id"> = {
    orderNumber,
    storeCode: storeCode.toUpperCase().trim(),
    ownerUid: orderData.ownerUid,
    customerName: orderData.customerName || "Pelanggan",
    orderType: orderData.orderType || "dine-in",
    tableNumber: orderData.tableNumber || "Meja 01",
    items: orderData.items || [],
    totalAmount: Number(orderData.totalAmount || 0),
    totalQty: Number(orderData.totalQty || 0),
    generalNotes: orderData.generalNotes || "",
    status: "PENDING",
    createdAt: now,
    updatedAt: now,
  };

  const docRef = await addDoc(colRef, sanitizeForFirestore(payload));
  return { id: docRef.id, orderNumber };
}

export function subscribeIncomingOrders(
  ownerUid: string,
  callback: (orders: IncomingOrder[]) => void
): Unsubscribe {
  if (!ownerUid) {
    callback([]);
    return () => {};
  }

  const colRef = collection(db, "users", ownerUid, "incoming_orders");
  const q = query(colRef, orderBy("createdAt", "desc"), limit(50));

  return onSnapshot(
    q,
    (snapshot) => {
      const orders = snapshot.docs.map(
        (doc) => ({ id: doc.id, ...doc.data() } as IncomingOrder)
      );
      callback(orders);
    },
    (err) => {
      console.warn("Failed to listen to incoming orders:", err);
    }
  );
}

export async function updateOrderStatus(
  ownerUid: string,
  orderId: string,
  status: OrderStatus
): Promise<void> {
  if (!ownerUid || !orderId) return;
  const docRef = doc(db, "users", ownerUid, "incoming_orders", orderId);
  await updateDoc(docRef, {
    status,
    updatedAt: new Date().toISOString(),
  });
}

export function subscribeSingleOrder(
  ownerUid: string,
  orderId: string,
  callback: (order: IncomingOrder | null) => void
): Unsubscribe {
  if (!ownerUid || !orderId) {
    callback(null);
    return () => {};
  }

  const docRef = doc(db, "users", ownerUid, "incoming_orders", orderId);

  return onSnapshot(
    docRef,
    (snap) => {
      if (!snap.exists()) {
        callback(null);
      } else {
        callback({ id: snap.id, ...snap.data() } as IncomingOrder);
      }
    },
    (err) => {
      console.warn("Failed to listen to single order:", err);
    }
  );
}






// ----------------------------------------------------------------------
// COFFEESHOP LOYALTY FUNCTIONS
// ----------------------------------------------------------------------

export async function fetchLoyaltyCard(ownerUid: string, customerId: string) {
  if (!ownerUid || !customerId) return null;
  const docRef = doc(db, "users", ownerUid, "loyalty_cards", customerId);
  const snap = await getDoc(docRef);
  if (snap.exists()) {
    return { id: snap.id, ...snap.data() };
  }
  return null;
}

export function subscribeLoyaltyCards(
  ownerUid: string,
  callback: (cards: any[]) => void
) {
  if (!ownerUid) {
    callback([]);
    return () => {};
  }
  const q = query(
    collection(db, "users", ownerUid, "loyalty_cards"),
    orderBy("updatedAt", "desc")
  );
  return onSnapshot(
    q,
    (snap) => {
      const cards = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      callback(cards);
    },
    (err) => console.error("Failed to fetch loyalty cards", err)
  );
}

export async function addLoyaltyStamp(
  ownerUid: string,
  customerId: string,
  customerName: string,
  stampsToAdd: number,
  customerPhone?: string
) {
  if (!ownerUid || !customerId || stampsToAdd <= 0) return;
  const docRef = doc(db, "users", ownerUid, "loyalty_cards", customerId);
  const snap = await getDoc(docRef);
  const now = new Date().toISOString();

  if (snap.exists()) {
    const data = snap.data();
    let current = data.stampsCurrentCard + stampsToAdd;
    let total = data.stampsTotal + stampsToAdd;
    let redeemed = data.redeemedAt || [];

    // Auto-redeem check could be handled in UI, but here we just store raw count
    // A card typically has 10 stamps.

    await updateDoc(docRef, {
      stampsCurrentCard: current,
      stampsTotal: total,
      lastVisit: now,
      updatedAt: now,
    });
  } else {
    await setDoc(docRef, {
      customerName,
      customerPhone: customerPhone || "",
      stampsTotal: stampsToAdd,
      stampsCurrentCard: stampsToAdd,
      lastVisit: now,
      redeemedAt: [],
      createdAt: now,
      updatedAt: now,
    });
  }
}

export async function redeemLoyaltyCard(ownerUid: string, customerId: string) {
  if (!ownerUid || !customerId) return;
  const docRef = doc(db, "users", ownerUid, "loyalty_cards", customerId);
  const snap = await getDoc(docRef);
  if (snap.exists()) {
    const data = snap.data();
    if (data.stampsCurrentCard >= 10) {
      await updateDoc(docRef, {
        stampsCurrentCard: data.stampsCurrentCard - 10,
        redeemedAt: arrayUnion(new Date().toISOString()),
        updatedAt: new Date().toISOString(),
      });
    } else {
      throw new Error("Stempel tidak cukup untuk ditukar.");
    }
  }
}

// ----------------------------------------------------------------------
// LAUNDRY FUNCTIONS
// ----------------------------------------------------------------------
export function subscribeLaundryOrders(
  ownerUid: string,
  callback: (orders: any[]) => void
) {
  if (!ownerUid) {
    callback([]);
    return () => {};
  }
  const q = query(
    collection(db, "users", ownerUid, "laundry_orders"),
    orderBy("createdAt", "desc"),
    limit(100)
  );
  return onSnapshot(
    q,
    (snap) => {
      const data = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      callback(data);
    },
    (err) => console.error("Failed to fetch laundry orders", err)
  );
}

export async function updateLaundryStatus(
  ownerUid: string,
  orderId: string,
  status: string
) {
  if (!ownerUid || !orderId) return;
  const docRef = doc(db, "users", ownerUid, "laundry_orders", orderId);
  await updateDoc(docRef, {
    status,
    updatedAt: new Date().toISOString(),
  });
}

// ----------------------------------------------------------------------
// SALON FUNCTIONS
// ----------------------------------------------------------------------
export function subscribeAppointments(
  ownerUid: string,
  callback: (appts: any[]) => void
) {
  if (!ownerUid) {
    callback([]);
    return () => {};
  }
  const q = query(
    collection(db, "users", ownerUid, "salon_appointments"),
    orderBy("scheduledAt", "asc")
  );
  return onSnapshot(
    q,
    (snap) => {
      const data = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      callback(data);
    },
    (err) => console.error("Failed to fetch appointments", err)
  );
}

export function subscribeStylists(
  ownerUid: string,
  callback: (stylists: any[]) => void
) {
  if (!ownerUid) {
    callback([]);
    return () => {};
  }
  const q = collection(db, "users", ownerUid, "salon_stylists");
  return onSnapshot(
    q,
    (snap) => {
      const data = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      callback(data);
    },
    (err) => console.error("Failed to fetch stylists", err)
  );
}

// ----------------------------------------------------------------------
// RETAIL FUNCTIONS
// ----------------------------------------------------------------------
export function subscribePurchaseOrders(
  ownerUid: string,
  callback: (pos: any[]) => void
) {
  if (!ownerUid) {
    callback([]);
    return () => {};
  }
  const q = query(
    collection(db, "users", ownerUid, "retail_pos"),
    orderBy("createdAt", "desc")
  );
  return onSnapshot(
    q,
    (snap) => {
      const data = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      callback(data);
    },
    (err) => console.error("Failed to fetch POs", err)
  );
}

export async function receivePurchaseOrder(
  ownerUid: string,
  poId: string,
  items: any[]
) {
  if (!ownerUid || !poId) return;
  
  const batch = writeBatch(db);
  const poRef = doc(db, "users", ownerUid, "retail_pos", poId);
  
  batch.update(poRef, {
    status: "received",
    receivedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });

  // Update stock for each product
  for (const item of items) {
    if (item.productId) {
      const prodRef = doc(db, "users", ownerUid, "products", item.productId);
      batch.update(prodRef, {
        stock: increment(item.qty),
        costPrice: item.buyPrice, // Update HPP
        updatedAt: new Date().toISOString(),
      });
    }
  }

  await batch.commit();
}

// ----------------------------------------------------------------------
// RESTAURANT TABLES (FnB)
// ----------------------------------------------------------------------
export function subscribeTables(
  ownerUid: string,
  onUpdate: (tables: any[]) => void
) {
  if (!ownerUid) return () => {};
  const q = query(collection(db, "users", ownerUid, "fnb_tables"), orderBy("tableNumber", "asc"));
  return onSnapshot(q, (snap) => {
    onUpdate(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
  });
}

export async function addTable(ownerUid: string, tableData: any) {
  if (!ownerUid) return;
  const colRef = collection(db, "users", ownerUid, "fnb_tables");
  await addDoc(colRef, {
    ...tableData,
    createdAt: new Date().toISOString(),
  });
}

export async function updateTableStatus(
  ownerUid: string,
  tableId: string,
  updates: any
) {
  if (!ownerUid || !tableId) return;
  const ref = doc(db, "users", ownerUid, "fnb_tables", tableId);
  await updateDoc(ref, updates);
}

// ----------------------------------------------------------------------
// PICKUP & DELIVERY (LAUNDRY)
// ----------------------------------------------------------------------
export function subscribePickupDeliveries(
  ownerUid: string,
  onUpdate: (orders: any[]) => void
) {
  if (!ownerUid) return () => {};
  const q = query(
    collection(db, "users", ownerUid, "laundry_deliveries"),
    orderBy("pickupTime", "asc")
  );
  return onSnapshot(q, (snap) => {
    onUpdate(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
  });
}

export async function addPickupDelivery(ownerUid: string, data: any) {
  if (!ownerUid) return;
  const colRef = collection(db, "users", ownerUid, "laundry_deliveries");
  await addDoc(colRef, {
    ...data,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });
}

export async function updatePickupDeliveryStatus(
  ownerUid: string,
  orderId: string,
  status: string
) {
  if (!ownerUid || !orderId) return;
  const ref = doc(db, "users", ownerUid, "laundry_deliveries", orderId);
  await updateDoc(ref, {
    status,
    updatedAt: new Date().toISOString(),
  });
}

