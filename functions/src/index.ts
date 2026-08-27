import * as admin from "firebase-admin";

// Initialize Firebase Admin SDK
admin.initializeApp();

// Export Auth & Cashier Functions
export { onUserCreated } from "./auth/onUserCreated";
export { verifyCashierPin } from "./auth/verifyCashierPin";

// Export Subscriptions & Payment Functions
export { paymentWebhook } from "./subscriptions/paymentWebhook";
export { checkTrialExpiryCron } from "./subscriptions/checkTrialExpiry";

// Export Inventory & Transaction Triggers
export { onTransactionCreated } from "./inventory/atomicStockDeduct";
