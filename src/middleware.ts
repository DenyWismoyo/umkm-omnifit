import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { checkRouteAccess, isPublicPath } from "@/lib/routePermissions";

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, manifest.webmanifest, sitemap.xml
     * - static image/asset extensions (.png, .jpg, .jpeg, .svg, .webp, .ico)
     */
    "/((?!_next/static|_next/image|favicon.ico|manifest.webmanifest|.*\\.(?:png|jpg|jpeg|svg|webp|ico)$).*)",
  ],
};

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Baca cookie sesi Firebase & Plan langganan
  const sessionCookie = request.cookies.get("__session")?.value;
  const planCookie = request.cookies.get("__plan")?.value;

  // 2. Jika user sudah login dan mengakses /login atau root /, langsung arahkan ke dashboard
  if (sessionCookie && (pathname === "/login" || pathname === "/")) {
    let targetPath = "/dashboard";
    if (planCookie) {
      try {
        const decoded = decodeURIComponent(planCookie);
        const plan = JSON.parse(decoded);
        if (plan.role === "cashier") targetPath = "/pos";
      } catch {
        // use default /dashboard
      }
    }
    return NextResponse.redirect(new URL(targetPath, request.url));
  }

  // 3. Lewati rute publik murni lainnya (Menu pelanggan, Display, Checkout receipt, Pricing)
  if (isPublicPath(pathname)) {
    return NextResponse.next();
  }

  // 4. Jika rute privat tapi tidak ada sesi, redirect ke halaman login
  if (!sessionCookie) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 4. Parse data plan dari cookie (ringan & cepat di edge/server tanpa query DB)
  let planData: any = {
    role: "owner",
    tier: "basic",
    isTrial: true, // Default toleran saat transisi awal
    isActive: true,
  };

  if (planCookie) {
    try {
      const decoded = decodeURIComponent(planCookie);
      planData = { ...planData, ...JSON.parse(decoded) };
    } catch {
      // Abaikan parsing error, gunakan default aman
    }
  }

  // Default fallback jika tetap kosong (misal saat berada di /onboarding)
  if (!planData.industry) {
    planData.industry = "universal";
  }

  // 5. Evaluasi hak akses rute menggunakan matrix permission
  const accessResult = checkRouteAccess({
    pathname,
    role: planData.role,
    tier: planData.tier,
    industry: planData.industry,
    isTrial: planData.isTrial,
    isActiveSubscription: planData.isActive,
  });

  // 6. Hanya lakukan hard redirect jika peran kasir tidak sah (role_unauthorized)
  if (!accessResult.allowed && accessResult.reason === "role_unauthorized" && accessResult.redirectUrl) {
    const targetUrl = new URL(accessResult.redirectUrl, request.url);
    return NextResponse.redirect(targetUrl);
  }

  // Catatan: Jika 'upgrade_required' atau 'industry_mismatch', biarkan request masuk ke page
  // agar dirender di dalam DashboardLayout dengan komponen FeatureGate (Icon Gembok 🔒) yang elegan.

  // 7. Security Headers untuk response
  const response = NextResponse.next();
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Robots-Tag", "noindex, nofollow");
  
  // Custom context headers untuk layout rendering
  if (planData.industry) response.headers.set("X-Active-Industry", planData.industry);
  if (planData.tier) response.headers.set("X-Active-Tier", planData.tier);
  if (planData.role) response.headers.set("X-Active-Role", planData.role);

  return response;
}

export default middleware;
