import { onDocumentCreated } from "firebase-functions/v2/firestore";
import * as logger from "firebase-functions/logger";
import { db, admin } from "../admin";

/**
 * Cloud Function v2: Trigger saat transaksi kasir tersimpan di `users/{userId}/transactions/{transactionId}`.
 * Memotong stok produk fisik dan memperbarui buku kasbon pelanggan secara atomik.
 */
export const onTransactionCreated = onDocumentCreated(
  "users/{userId}/transactions/{transactionId}",
  async (event) => {
    const snap = event.data;
    if (!snap) return;

    const { userId, transactionId } = event.params;
    const trxData = snap.data();

    if (!trxData || !trxData.items || !Array.isArray(trxData.items)) {
      return;
    }

    logger.info(
      `Processing v2 atomic stock & customer debt for trx ${transactionId} (User: ${userId})`
    );

    try {
      const batch = db.batch();

      // 1. Pengurangan Stok Produk Fisik
      for (const item of trxData.items) {
        if (item.productId && item.quantity > 0) {
          const productRef = db
            .collection("users")
            .doc(userId)
            .collection("products")
            .doc(item.productId);

          batch.update(productRef, {
            stock: admin.firestore.FieldValue.increment(-item.quantity),
            updatedAt: new Date().toISOString(),
          });
        }
      }

      // 2. Update Pelanggan (Total Belanja / Kasbon Hutang)
      if (trxData.customerId) {
        const customerRef = db
          .collection("users")
          .doc(userId)
          .collection("customers")
          .doc(trxData.customerId);

        const custSnap = await customerRef.get();
        if (custSnap.exists) {
          const isDebt = trxData.status === "debt" || trxData.paymentMethod === "debt";
          const updatePayload: Record<string, any> = {
            totalSpent: admin.firestore.FieldValue.increment(trxData.totalAmount || 0),
            updatedAt: new Date().toISOString(),
          };

          if (isDebt) {
            updatePayload.totalDebt = admin.firestore.FieldValue.increment(
              trxData.totalAmount || 0
            );
          }

          batch.update(customerRef, updatePayload);
        }
      }

      await batch.commit();
      logger.info(`Stock and customer debt updated atomically (v2) for trx ${transactionId}`);
    } catch (error) {
      logger.error(
        `Failed v2 atomic stock deduction on trx ${transactionId}:`,
        error
      );
    }
  }
);
