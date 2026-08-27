import { onSchedule } from "firebase-functions/v2/scheduler";
import * as logger from "firebase-functions/logger";
import { db } from "../admin";

/**
 * Cloud Function v2 Scheduled Cron: Berjalan setiap hari pukul 00:00 WIB (17:00 UTC)
 * Memeriksa akun trial yang sudah melewati 30 hari atau paket aktif yang habis masa berlakunya.
 */
export const checkTrialExpiryScheduled = onSchedule(
  {
    schedule: "0 17 * * *",
    timeZone: "Asia/Jakarta",
  },
  async (event) => {
    const nowIso = new Date().toISOString();
    logger.info(`Running Trial & Subscription Expiry Check (v2) at ${nowIso}`);

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
        logger.info(`Expired ${trialSnap.size} trial accounts (v2).`);
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
        logger.info(`Expired ${activeSnap.size} active subscription accounts (v2).`);
      }
    } catch (error) {
      logger.error("Error in checkTrialExpiryCron (v2):", error);
    }
  }
);
