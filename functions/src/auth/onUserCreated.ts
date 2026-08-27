import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

const db = admin.firestore();

/**
 * Trigger otomatis saat user baru terdaftar di Firebase Authentication (Google Login).
 * Bertugas menginisialisasi Profil Toko, Kode Toko Unik, dan Hak Akses TRIAL 30 HARI secara server-side.
 */
export const onUserCreated = functions.region("asia-southeast1").auth.user().onCreate(async (user) => {
  const uid = user.uid;
  const email = user.email || "";
  const displayName = user.displayName || "Pemilik Toko";
  const now = new Date();
  const trialEndsAt = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000); // 30 Hari penuh

  try {
    const userRef = db.collection("users").doc(uid);
    const userSnap = await userRef.get();

    // 1. Generate unique 6-digit Store Code
    let storeCode = `TOKO-${Math.floor(1000 + Math.random() * 9000)}`;
    let isCodeUnique = false;
    let attempts = 0;

    while (!isCodeUnique && attempts < 5) {
      const codeCheck = await db.collection("storeCodes").doc(storeCode).get();
      if (!codeCheck.exists) {
        isCodeUnique = true;
      } else {
        storeCode = `TOKO-${Math.floor(1000 + Math.random() * 9000)}`;
        attempts++;
      }
    }

    // 2. Set Up Shop Profile if not exists
    if (!userSnap.exists) {
      await userRef.set({
        userId: uid,
        ownerName: displayName,
        email: email,
        shopName: "Toko Baru",
        phoneNumber: user.phoneNumber || "",
        storeCode: storeCode,
        currency: "IDR",
        taxPercentage: 0,
        paperSize: "58mm",
        brandThemePreset: "emerald",
        createdAt: now.toISOString(),
        updatedAt: now.toISOString(),
      }, { merge: true });
    }

    // 3. Register Store Code Mapping for Cashier Login
    await db.collection("storeCodes").doc(storeCode).set({
      code: storeCode,
      ownerUid: uid,
      shopName: "Toko Baru",
      ownerName: displayName,
      isActive: true,
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    }, { merge: true });

    // 4. Secure Server-Side 30-Day Trial Subscription Document
    const subRef = userRef.collection("subscription").doc("current");
    const subSnap = await subRef.get();

    if (!subSnap.exists) {
      await subRef.set({
        id: "current",
        userId: uid,
        status: "trial",
        tier: "pro",
        industry: "fnb",
        planId: "fnb_pro_monthly",
        trialStartsAt: now.toISOString(),
        trialEndsAt: trialEndsAt.toISOString(),
        isTrial: true,
        currentPeriodStart: now.toISOString(),
        currentPeriodEnd: trialEndsAt.toISOString(),
        cancelAtPeriodEnd: false,
        createdAt: now.toISOString(),
        updatedAt: now.toISOString(),
      });
    }

    // 5. Seed default categories if empty
    const categoriesCol = userRef.collection("categories");
    const catSnap = await categoriesCol.limit(1).get();
    if (catSnap.empty) {
      const defaultCats = [
        { name: "Makanan", color: "amber", createdAt: now.toISOString() },
        { name: "Minuman", color: "blue", createdAt: now.toISOString() },
        { name: "Snack & Cemilan", color: "orange", createdAt: now.toISOString() },
        { name: "Sembako", color: "emerald", createdAt: now.toISOString() },
        { name: "Jasa / Layanan", color: "purple", createdAt: now.toISOString() },
        { name: "Lain-lain", color: "slate", createdAt: now.toISOString() },
      ];

      const batch = db.batch();
      for (const cat of defaultCats) {
        const newDoc = categoriesCol.doc();
        batch.set(newDoc, cat);
      }
      await batch.commit();
    }

    functions.logger.info(`User ${uid} successfully initialized with 30-day trial and store code ${storeCode}`);
  } catch (error) {
    functions.logger.error(`Failed to initialize new user ${uid}:`, error);
  }
});
