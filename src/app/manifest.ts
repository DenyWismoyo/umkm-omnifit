import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "POS UMKM Pro - Kasir & Manajemen Usaha",
    short_name: "POS UMKM",
    description: "Aplikasi POS Kasir Modern, Manajemen Stok & Kalkulator HPP Cerdas untuk UMKM",
    start_url: "/dashboard",
    display: "standalone",
    background_color: "#0f172a",
    theme_color: "#059669",
    orientation: "portrait-primary",
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
        purpose: "any",
      },
      {
        src: "/icons/icon-512x512.svg",
        sizes: "512x512",
        type: "image/svg+xml",
        purpose: "maskable",
      },
    ],
    categories: ["business", "finance", "productivity"],
    shortcuts: [
      {
        name: "Buka Kasir POS",
        short_name: "Kasir",
        description: "Buka mesin kasir POS langsung",
        url: "/pos",
        icons: [{ src: "/icons/icon-192x192.svg", sizes: "192x192" }],
      },
      {
        name: "Kalkulator HPP",
        short_name: "HPP",
        description: "Hitung harga pokok produksi & resep",
        url: "/hpp",
        icons: [{ src: "/icons/icon-192x192.svg", sizes: "192x192" }],
      },
    ],
  };
}
