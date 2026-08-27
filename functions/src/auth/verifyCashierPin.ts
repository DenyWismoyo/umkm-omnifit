import { onCall, HttpsError } from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
import { db } from "../admin";

interface VerifyPinRequest {
  storeCode: string;
  pin: string;
}

/**
 * Cloud Function v2: Verifikasi PIN Kasir secara terenkripsi dan terisolasi di server.
 */
export const verifyCashierPin = onCall<VerifyPinRequest>(async (request) => {
  const { storeCode, pin } = request.data || {};

  if (!storeCode || !pin) {
    throw new HttpsError(
      "invalid-argument",
      "Kode Toko dan PIN Kasir wajib diisi."
    );
  }

  const cleanCode = storeCode.toUpperCase().trim();
  const cleanPin = pin.trim();

  try {
    // 1. Cari pemilik toko berdasarkan Kode Toko
    const codeDoc = await db.collection("storeCodes").doc(cleanCode).get();
    if (!codeDoc.exists) {
      throw new HttpsError(
        "not-found",
        "Kode Toko tidak ditemukan. Pastikan kode toko sudah benar."
      );
    }

    const codeData = codeDoc.data();
    if (!codeData?.isActive) {
      throw new HttpsError(
        "permission-denied",
        "Akses toko sedang dinonaktifkan."
      );
    }

    const ownerUid = codeData.ownerUid;

    // 2. Cari kasir yang memiliki PIN cocok di subkoleksi cashiers milik owner
    const cashierSnap = await db
      .collection("users")
      .doc(ownerUid)
      .collection("cashiers")
      .where("pin", "==", cleanPin)
      .where("isActive", "==", true)
      .limit(1)
      .get();

    if (cashierSnap.empty) {
      throw new HttpsError(
        "unauthenticated",
        "PIN Kasir salah atau akun kasir tidak aktif."
      );
    }

    const cashierDoc = cashierSnap.docs[0];
    const cashierData = cashierDoc.data();

    // Update last active
    await cashierDoc.ref.update({
      lastActiveAt: new Date().toISOString(),
    });

    return {
      success: true,
      ownerUid,
      shopName: codeData.shopName || "POS UMKM",
      cashier: {
        id: cashierDoc.id,
        name: cashierData.name,
        role: cashierData.role || "cashier",
        isActive: cashierData.isActive,
      },
    };
  } catch (error: any) {
    if (error instanceof HttpsError) {
      throw error;
    }
    logger.error("Error verifying cashier PIN (v2):", error);
    throw new HttpsError(
      "internal",
      "Terjadi kesalahan saat memverifikasi PIN kasir."
    );
  }
});
