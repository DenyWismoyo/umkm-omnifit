import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = "https://umkm.omnifit.cloud";

  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/login", "/upgrade", "/onboarding", "/privacy", "/terms"],
        disallow: [
          "/api/",
          "/dashboard/",
          "/pos/",
          "/transactions/",
          "/inventory/",
          "/hpp/",
          "/customers/",
          "/debts/",
          "/expenses/",
          "/reports/",
          "/settings/",
          "/tables/",
          "/barista-queue/",
          "/loyalty/",
          "/weight-pricing/",
          "/appointments/",
          "/pickup-delivery/",
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
