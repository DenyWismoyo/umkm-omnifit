import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      idToken,
      userId,
      role = "owner",
      tier = "basic",
      industry = "",
      isTrial = false,
      isActive = true,
      storeCode = "",
    } = body;

    const planPayload = {
      userId: userId || "",
      role: role || "owner",
      tier: isTrial ? "pro" : tier || "basic",
      industry: industry || "",
      isTrial: Boolean(isTrial),
      isActive: Boolean(isActive),
      storeCode: storeCode || "",
      updatedAt: Date.now(),
    };

    const encodedPlan = encodeURIComponent(JSON.stringify(planPayload));

    const response = NextResponse.json({ success: true, plan: planPayload });

    // Set __session cookie
    response.cookies.set("__session", idToken || "active-session", {
      httpOnly: false, // Accessible to client & server
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: "/",
    });

    // Set __plan cookie for fast edge / proxy.ts evaluation
    response.cookies.set("__plan", encodedPlan, {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30,
      path: "/",
    });

    return response;
  } catch (error: any) {
    console.error("Error setting session cookies:", error);
    return NextResponse.json(
      { error: error.message || "Failed to set session cookies" },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  const response = NextResponse.json({ success: true, message: "Logged out" });

  response.cookies.set("__session", "", {
    maxAge: 0,
    path: "/",
  });

  response.cookies.set("__plan", "", {
    maxAge: 0,
    path: "/",
  });

  return response;
}
