import { onDocumentCreated } from "firebase-functions/v2/firestore";
import * as logger from "firebase-functions/logger";
import { db } from "../admin";

/**
 * Cloud Function v2: Otomatis mengunci dan menginisialisasi Trial 30 Hari & Store Code saat dokumen user dibuat di Firestore.
 */
export const onUserCreated = onDocumentCreated("users/{userId}", async (event) => {
  const snap = event.data;
  if (!snap) return;

  const userId = event.params.userId;
  const userData = snap.data();
  const now = new Date();
  const trialEndsAt = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000); // 30 Hari penuh

  try {
    const userRef = db.collection("users").doc(userId);

    // 1. Generate unique 6-digit Store Code if missing
    let storeCode = userData.storeCode;
    if (!storeCode) {
      storeCode = `TOKO-${Math.floor(1000 + Math.random() * 9000)}`;
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

      await userRef.update({
        storeCode: storeCode,
        updatedAt: now.toISOString(),
      });
    }

    // 2. Register Store Code Mapping for Cashier Login
    await db.collection("storeCodes").doc(storeCode).set({
      code: storeCode,
      ownerUid: userId,
      shopName: userData.shopName || "Toko Baru",
      ownerName: userData.ownerName || "Pemilik Toko",
      isActive: true,
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    }, { merge: true });

    // 3. Secure Server-Side 30-Day Trial Subscription Document
    const subRef = userRef.collection("subscription").doc("current");
    const subSnap = await subRef.get();

    if (!subSnap.exists) {
      await subRef.set({
        id: "current",
        userId: userId,
        status: "trial",
        tier: "pro",
        industry: userData.industry || "fnb",
        trialStartedAt: now.toISOString(),
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

    logger.info(`User ${userId} v2 successfully provisioned with 30-day trial & store code ${storeCode}`);
  } catch (error) {
    logger.error(`Failed v2 provisioning for user ${userId}:`, error);
  }
});
