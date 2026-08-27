import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { transactionId, amount, userEmail, userName } = body;

    const mayarApiKey = process.env.MAYAR_API_KEY;

    if (!mayarApiKey) {
      return NextResponse.json(
        { error: "MAYAR_API_KEY belum dikonfigurasi di server." },
        { status: 500 }
      );
    }

    // Call Mayar API to create Dynamic QRIS
    const response = await fetch("https://api.mayar.id/hl/v1/qrcode/create", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${mayarApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: Number(amount),
        reference_id: transactionId,
        referenceId: transactionId,
        customField: transactionId,
        custom_field: transactionId,
        email: userEmail || "owner@posumkm.id",
        name: userName || "Pelanggan POS UMKM",
      }),
    });

    const mayarData = await response.json();

    if (!response.ok || (mayarData.statusCode && mayarData.statusCode !== 200)) {
      console.error("Mayar QRIS Error:", mayarData);
      return NextResponse.json(
        { error: mayarData.message || "Gagal membuat QRIS Mayar." },
        { status: 400 }
      );
    }

    const qrUrl = mayarData.data?.url || mayarData.data?.qrcodeUrl || null;

    return NextResponse.json({
      success: true,
      transactionId,
      qrUrl,
    });
  } catch (error: any) {
    console.error("Payment QRIS API Error:", error);
    return NextResponse.json(
      { error: error.message || "Terjadi kesalahan server saat membuat QRIS." },
      { status: 500 }
    );
  }
}
