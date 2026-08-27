import * as admin from "firebase-admin";
import { setGlobalOptions } from "firebase-functions/v2";

if (!admin.apps.length) {
  admin.initializeApp();
}

// Global configuration for all v2 Cloud Functions (2nd Gen)
setGlobalOptions({
  region: "asia-southeast1",
  maxInstances: 10,
});

export const db = admin.firestore();
export const auth = admin.auth();
export { admin };
