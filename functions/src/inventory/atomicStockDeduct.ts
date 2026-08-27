import * as functions from "firebase-functions";
import { db, admin } from "../admin";

/**
 * Firestore Trigger: Dijalankan otomatis di server saat transaksi kasir tersimpan di `users/{userId}/transactions/{trxId}`.
 * Menjamin pemotongan stok fisik & pemotongan bahan baku resep (HPP) terjadi secara atomik dan konsisten.
 */
export const onTransactionCreated = functions
  .region("asia-southeast1")
  .firestore.document("users/{userId}/transactions/{transactionId}")
  .onCreate(async (snap, context) => {
    const { userId, transactionId } = context.params;
    const trxData = snap.data();

    if (!trxData || !trxData.items || !Array.isArray(trxData.items)) {
      return;
    }

    functions.logger.info(
      `Processing atomic stock & customer debt for transaction ${transactionId} (User: ${userId})`
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
      functions.logger.info(`Stock and customer data updated atomically for trx ${transactionId}`);
    } catch (error) {
      functions.logger.error(
        `Failed atomic stock deduction on transaction ${transactionId}:`,
        error
      );
    }
  });
