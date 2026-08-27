import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      planId,
      planName,
      amount,
      userEmail,
      userName,
      userId,
      transactionId,
    } = body;

    const mayarApiKey = process.env.MAYAR_API_KEY;

    if (!mayarApiKey) {
      return NextResponse.json(
        { error: "MAYAR_API_KEY belum dikonfigurasi di server." },
        { status: 500 }
      );
    }

    const host = request.headers.get("host") || "localhost:3000";
    const protocol = host.includes("localhost") ? "http" : "https";
    const redirectUrl = `${protocol}://${host}/checkout/${transactionId}?status=success`;

    // Call Mayar API to create Single Payment Link
    const response = await fetch("https://api.mayar.id/hl/v1/payment/create", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${mayarApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: userName || "Pelanggan POS UMKM",
        email: userEmail || "owner@posumkm.id",
        amount: Number(amount),
        mobile: "089900000000",
        description: `Upgrade POS UMKM Pro: ${planName}`,
        redirectUrl: redirectUrl,
        expiredAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        customField: transactionId,
        custom_field: transactionId,
        reference_id: transactionId,
        referenceId: transactionId,
      }),
    });

    const mayarData = await response.json();

    if (!response.ok || (mayarData.statusCode && mayarData.statusCode !== 200)) {
      console.error("Mayar API Error:", mayarData);
      return NextResponse.json(
        { error: mayarData.message || "Gagal membuat link pembayaran Mayar." },
        { status: 400 }
      );
    }

    let paymentLink = mayarData.data?.link || null;
    const mayarTransactionId = mayarData.data?.id || null;

    return NextResponse.json({
      success: true,
      transactionId,
      mayarTransactionId,
      paymentLink,
    });
  } catch (error: any) {
    console.error("Payment Create API Error:", error);
    return NextResponse.json(
      { error: error.message || "Terjadi kesalahan server saat menghubungi Mayar." },
      { status: 500 }
    );
  }
}
