import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "POS UMKM Pro - Aplikasi Kasir Multi-Industri",
    short_name: "POS UMKM",
    description: "Aplikasi POS Kasir Modern, Manajemen Stok & Kalkulator HPP Cerdas untuk UMKM",
    start_url: "/",
    display: "standalone",
    background_color: "#0f172a",
    theme_color: "#059669",
    orientation: "portrait",
    categories: ["business", "finance", "productivity"],
    icons: [
      {
        src: "/icons/icon-192x192.svg",
        sizes: "192x192",
        type: "image/svg+xml",
        purpose: "any",
      },
      {
        src: "/icons/icon-512x512.svg",
        sizes: "512x512",
        type: "image/svg+xml",
        purpose: "maskable",
      },
    ],
  };
}
