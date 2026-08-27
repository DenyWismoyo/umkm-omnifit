import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const rawBody = await request.text();
    let payload: any = {};
    try {
      payload = JSON.parse(rawBody);
    } catch (e) {
      payload = {};
    }

    console.log("📥 [MAYAR WEBHOOK RECEIVED]:", JSON.stringify(payload));

    // Testing / Ping Event from Mayar Dashboard
    if (payload.event === "testing" || payload.event === "ping") {
      return NextResponse.json({
        status: "success",
        message: "Webhook connection test successful",
      });
    }

    const mayarData = payload.data ? payload.data : payload;
    const currentStatus = String(mayarData.status || "").toUpperCase();
    const transactionStatus = String(mayarData.transactionStatus || "").toUpperCase();
    const eventType = String(payload.event || "").toLowerCase();

    const isPaymentSuccess =
      ["SUCCESS", "SETTLED", "PAID", "COMPLETED"].includes(currentStatus) ||
      ["PAID", "SETTLED", "SUCCESS"].includes(transactionStatus);

    const isSuccessEvent =
      !eventType ||
      eventType.includes("success") ||
      eventType.includes("paid") ||
      eventType.includes("settled") ||
      eventType.includes("completed") ||
      eventType.includes("payment.received");

    if (!isPaymentSuccess || !isSuccessEvent) {
      console.log(
        `[MAYAR WEBHOOK] Ignored non-success event. Status: ${currentStatus} / ${transactionStatus}`
      );
      return NextResponse.json({ status: "ignored", message: "Non-payment event" });
    }

    const transactionId =
      mayarData.reference_id ||
      mayarData.referenceId ||
      mayarData.customField ||
      mayarData.custom_field ||
      payload.reference_id;

    console.log(`[MAYAR WEBHOOK] ✅ Payment confirmed for transaction: ${transactionId}`);

    return NextResponse.json({
      status: "success",
      message: "Webhook processed successfully",
      transactionId,
    });
  } catch (error: any) {
    console.error("Webhook processing error:", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
