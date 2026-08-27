import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

const db = admin.firestore();

/**
 * Scheduled Cron Job: Berjalan setiap hari pada pukul 00:00 WIB (17:00 UTC)
 * Memeriksa akun trial yang sudah melewati 30 hari atau paket aktif yang habis masa berlakunya.
 */
export const checkTrialExpiryCron = functions
  .region("asia-southeast1")
  .pubsub.schedule("0 17 * * *") // Daily at midnight WIB
  .timeZone("Asia/Jakarta")
  .onRun(async (context) => {
    const nowIso = new Date().toISOString();
    functions.logger.info(`Running Trial & Subscription Expiry Check at ${nowIso}`);

    try {
      // 1. Periksa akun trial yang kadaluarsa
      const trialSnap = await db
        .collectionGroup("subscription")
        .where("status", "==", "trial")
        .where("trialEndsAt", "<=", nowIso)
        .get();

      if (!trialSnap.empty) {
        const batch = db.batch();
        trialSnap.docs.forEach((doc) => {
          batch.update(doc.ref, {
            status: "expired",
            tier: "basic",
            updatedAt: nowIso,
          });
        });
        await batch.commit();
        functions.logger.info(`Expired ${trialSnap.size} trial accounts.`);
      }

      // 2. Periksa akun aktif yang habis masa periodenya
      const activeSnap = await db
        .collectionGroup("subscription")
        .where("status", "==", "active")
        .where("currentPeriodEnd", "<=", nowIso)
        .get();

      if (!activeSnap.empty) {
        const batch = db.batch();
        activeSnap.docs.forEach((doc) => {
          batch.update(doc.ref, {
            status: "expired",
            tier: "basic",
            updatedAt: nowIso,
          });
        });
        await batch.commit();
        functions.logger.info(`Expired ${activeSnap.size} active subscription accounts.`);
      }

      return null;
    } catch (error) {
      functions.logger.error("Error in checkTrialExpiryCron:", error);
      return null;
    }
  });
