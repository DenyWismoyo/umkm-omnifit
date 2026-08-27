import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

const db = admin.firestore();

export const paymentWebhook = functions
  .region("asia-southeast1")
  .https.onRequest(async (req, res) => {
    // Only accept POST requests
    if (req.method !== "POST") {
      res.status(405).send("Method Not Allowed");
      return;
    }

    try {
      const payload = req.body;
      functions.logger.info("Received Payment Webhook Payload:", JSON.stringify(payload));

      /**
       * Expected Mayar Webhook format:
       * payload.event === "payment.received" || payload.status === "SUCCESS"
       * payload.customer.email or payload.metadata.userId
       */
      const userId = payload?.metadata?.userId || payload?.extraData?.userId;
      const planId = payload?.metadata?.planId || payload?.extraData?.planId || "fnb_pro_monthly";
      const amount = payload?.amount || payload?.data?.amount || 0;
      const status = payload?.status || payload?.event;

      if (!userId) {
        functions.logger.warn("Webhook missing userId in metadata");
        res.status(400).json({ error: "Missing userId in metadata" });
        return;
      }

      const isPaymentSuccess =
        status === "SUCCESS" ||
        status === "PAID" ||
        status === "payment.received" ||
        payload?.event === "payment.successful";

      if (isPaymentSuccess) {
        const now = new Date();
        const isYearly = planId.includes("yearly") || planId.includes("tahunan");
        const periodDays = isYearly ? 365 : 30;
        const periodEnd = new Date(now.getTime() + periodDays * 24 * 60 * 60 * 1000);

        // Derive industry from planId (e.g. fnb_pro_monthly -> fnb)
        const industry = planId.split("_")[0] || "fnb";
        const tier = planId.includes("enterprise") ? "enterprise" : "pro";

        const batch = db.batch();

        // 1. Update Subscription Document
        const subRef = db
          .collection("users")
          .doc(userId)
          .collection("subscription")
          .doc("current");

        batch.set(
          subRef,
          {
            id: "current",
            userId: userId,
            status: "active",
            tier: tier,
            industry: industry,
            planId: planId,
            isTrial: false,
            currentPeriodStart: now.toISOString(),
            currentPeriodEnd: periodEnd.toISOString(),
            cancelAtPeriodEnd: false,
            updatedAt: now.toISOString(),
          },
          { merge: true }
        );

        // 2. Record Payment Transaction History
        const paymentRef = db
          .collection("users")
          .doc(userId)
          .collection("paymentTransactions")
          .doc();

        batch.set(paymentRef, {
          id: paymentRef.id,
          userId: userId,
          planId: planId,
          amount: Number(amount) || 0,
          paymentMethod: payload?.paymentMethod || "qris",
          provider: "mayar",
          status: "SUCCESS",
          payloadReference: payload?.id || payload?.transactionId || "",
          createdAt: now.toISOString(),
        });

        await batch.commit();

        functions.logger.info(`User ${userId} upgraded to ${tier} (${industry}) via Mayar webhook.`);
        res.status(200).json({ status: "success", message: "Subscription upgraded successfully" });
        return;
      }

      res.status(200).json({ status: "ignored", message: "Event not a success payment" });
    } catch (error: any) {
      functions.logger.error("Error processing payment webhook:", error);
      res.status(500).json({ error: error.message || "Internal Server Error" });
    }
  });
