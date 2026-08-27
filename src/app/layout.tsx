import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { PwaProvider } from "@/components/common/PwaInstallPrompt";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  themeColor: "#059669",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://umkm.omnifit.cloud"),
  title: {
    default: "POS UMKM Pro - Aplikasi Kasir Online & Manajemen Usaha Multi-Industri",
    template: "%s | POS UMKM Pro",
  },
  description:
    "Aplikasi POS Kasir Online Modern Multi-Industri untuk UMKM Indonesia: F&B Resto, Kedai Kopi & Cafe, Retail Minimarket, Salon/Barbershop, dan Laundry Kiloan. Dilengkapi manajemen stok, kalkulator HPP resep, kasbon pelanggan, struk QRIS & printer thermal.",
  keywords: [
    "POS UMKM",
    "Aplikasi Kasir Online",
    "Software POS Indonesia",
    "Aplikasi Kasir Cafe",
    "Aplikasi Kasir Resto",
    "Aplikasi Kasir Toko Retail",
    "Aplikasi Kasir Laundry",
    "Aplikasi Kasir Barbershop",
    "Kalkulator HPP Usaha",
    "Sistem Kasir QRIS",
    "Omnifit Cloud",
    "POS UMKM Pro",
  ],
  authors: [{ name: "Omnifit Cloud Team", url: "https://umkm.omnifit.cloud" }],
  creator: "Omnifit Cloud",
  publisher: "Omnifit Cloud",
  applicationName: "POS UMKM Pro",
  alternates: {
    canonical: "https://umkm.omnifit.cloud",
  },
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: "https://umkm.omnifit.cloud",
    title: "POS UMKM Pro - Aplikasi Kasir Online & Manajemen Usaha Multi-Industri",
    description:
      "Aplikasi Kasir Modern & Kalkulator HPP Cerdas untuk UMKM: F&B, Coffee Shop, Retail, Salon, dan Laundry. Coba Gratis Trial 30 Hari penuh!",
    siteName: "POS UMKM Pro",
    images: [
      {
        url: "https://umkm.omnifit.cloud/og-image.png",
        secureUrl: "https://umkm.omnifit.cloud/og-image.png",
        width: 1200,
        height: 630,
        type: "image/png",
        alt: "POS UMKM Pro Preview Banner",
      },
      {
        url: "https://umkm.omnifit.cloud/icons/icon-512x512.png",
        secureUrl: "https://umkm.omnifit.cloud/icons/icon-512x512.png",
        width: 512,
        height: 512,
        type: "image/png",
        alt: "POS UMKM Pro App Icon",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "POS UMKM Pro - Aplikasi Kasir Online Multi-Industri",
    description:
      "Aplikasi Kasir Modern untuk Kuliner, Coffee Shop, Retail, Salon, dan Laundry di Indonesia. Gratis Trial 30 Hari!",
    images: ["https://umkm.omnifit.cloud/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "POS UMKM",
  },
  icons: {
    icon: "/icons/icon-192x192.svg",
    apple: "/icons/icon-192x192.svg",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "POS UMKM Pro",
  operatingSystem: "Web, Android, iOS, Windows, macOS",
  applicationCategory: "BusinessApplication",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "IDR",
    description: "Trial 30 Hari Akses Fitur PRO Penuh",
  },
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.9",
    ratingCount: "128",
  },
  description:
    "Aplikasi POS Kasir Online & Manajemen Usaha Multi-Industri untuk F&B, Coffee Shop, Retail, Salon, dan Laundry.",
  url: "https://umkm.omnifit.cloud",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <meta property="og:image" content="https://umkm.omnifit.cloud/og-image.png" />
        <meta property="og:image:secure_url" content="https://umkm.omnifit.cloud/og-image.png" />
        <meta property="og:image:type" content="image/png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="POS UMKM Pro - Aplikasi Kasir Online" />
        <meta name="twitter:image" content="https://umkm.omnifit.cloud/og-image.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-slate-50 text-slate-900 selection:bg-emerald-500 selection:text-white">
        <AuthProvider>
          <PwaProvider>
            {children}
            <Toaster position="top-right" richColors closeButton />
          </PwaProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
