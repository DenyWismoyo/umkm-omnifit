# 🚀 POS UMKM Pro - Sistem Kasir & Manajemen Usaha Multi-Industri

[![Website](https://img.shields.io/badge/Production-umkm.omnifit.cloud-059669?style=for-the-badge&logo=google-chrome&logoColor=white)](https://umkm.omnifit.cloud)
[![Next.js](https://img.shields.io/badge/Next.js-15.1-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![Firebase Functions v2](https://img.shields.io/badge/Firebase_Functions-v2_(2nd_Gen)-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)](https://firebase.google.com/docs/functions)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![PWA Ready](https://img.shields.io/badge/PWA-Installable-purple?style=for-the-badge&logo=pwa)](https://umkm.omnifit.cloud)

> **POS UMKM Pro** adalah platform kasir point-of-sale (POS) modern, cepat, dan terintegrasi yang dirancang khusus untuk memajukan Usaha Mikro, Kecil, dan Menengah (UMKM) di Indonesia. Dilengkapi antarmuka *mobile-first* borderless yang elegan, dukungan printer thermal, kalkulator HPP resep otomatis, kasbon pelanggan, serta integrasi gateway pembayaran QRIS & Mayar.id.

🌐 **Akses Aplikasi Live**: [https://umkm.omnifit.cloud](https://umkm.omnifit.cloud)

---

## 🌟 Fitur Unggulan 6 Industri Bisnis

Aplikasi ini secara dinamis menyesuaikan menu, alur kasir, dan fitur operasional sesuai industri yang dipilih:

```
                  ┌──────────────────────────────────────────────────────────┐
                  │                 POS UMKM Pro Multi-Industry              │
                  └─────────────────────────────┬────────────────────────────┘
                                                │
       ┌──────────────┬──────────────┬──────────┴───┬──────────────┬──────────────┐
       ▼              ▼              ▼              ▼              ▼              ▼
 🍽️ Kuliner     ☕ Coffee Shop   🛒 Retail      ✂️ Salon       🧺 Laundry     🏢 Universal
 (F&B Resto)    (Cafe & Barista) (Minimarket)   (Barbershop)   (Kiloan/Satuan)(Toko Umum)
 - QR Meja      - Live Barista   - Barcode Scan - Appointment - Timbangan     - Kasbon Buku
 - Split Bill   - Kartu Stempel  - Batch Expired- Komisi Staf  - Tracking Cuci - Thermal Print
 - Dapur KDS    - Resep Kopi HPP - Grosir Level - Paket Jasa   - Antar-Jemput - Rekap Omzet
```

### 1. 🍽️ Kuliner & F&B Resto
- **Manajemen Meja & QR Dine-in**: Generate QR Code meja unik untuk pemesanan mandiri pelanggan.
- **Split Bill & Kitchen Display (KDS)**: Pisahkan struk dapur dan bar secara otomatis.
- **Alur Kasir Cepat**: Mendukung pesanan *Dine-in*, *Takeaway*, dan *Delivery*.

### 2. ☕ Coffee Shop, Cafe & Boba
- **Live Antrian Barista (`/barista-queue`)**: Layar antrean real-time untuk barista meracik kopi dengan indikator tingkat kemanisan, es, dan topping.
- **Kartu Stempel Loyalty Digital (`/loyalty`)**: Program loyalitas "Beli 9 Gratis 1" berbasis scan QR atau nomor HP.
- **Kalkulator HPP Kopi & Sirup**: Menghitung biaya modal per cup secara presisi hingga satuan mililiter dan gram.

### 3. 🛒 Retail, Toko Kelontong & Grosir
- **Barcode Scanner Cerdas**: Scan barcode produk instan menggunakan kamera smartphone atau barcode scanner laser USB.
- **Harga Bertingkat / Grosir**: Pengaturan diskon otomatis berdasarkan kuantitas pembelian.
- **Peringatan Minimum Stok & Kadaluarsa**: Notifikasi real-time saat stok menipis.

### 4. ✂️ Salon, Barbershop & Nail Art
- **Jadwal & Reservasi Stylist (`/appointments`)**: Manajemen booking pelanggan berdasarkan waktu dan kapster pilihan.
- **Kalkulator Komisi Staf**: Perhitungan bagi hasil jasa dan tips staf kasir secara transparan.

### 5. 🧺 Laundry Kiloan & Satuan
- **Kalkulator Timbangan Desimal (`/weight-pricing`)**: Perhitungan tarif kiloan presisi (misal: 3.45 kg).
- **Pelacakan Status Cucian (`/pickup-delivery`)**: Alur status dari *Terima -> Cuci -> Kering -> Setrika -> Siap Diambil / Diantar*.
- **Cetak Nota & Label Rak**: Format nota struk mini dengan estimasi tanggal selesai.

### 6. 🏢 Universal UMKM & Fitur Inti
- **Buku Kasbon & Hutang Pelanggan (`/debts`)**: Catat kasbon pelanggan dan terima cicilan pelunasan bertahap.
- **Kalkulator HPP Resep Dinamis (`/hpp`)**: Pantau margin keuntungan bersih secara akurat.
- **Cetak Struk Kasir Thermal Bluetooth & USB**: Kompatibel dengan printer kertas 58mm dan 80mm.
- **Sistem Kasir Staf & Shift Kasir**: Login kasir terisolasi menggunakan Kode Toko & PIN 6-digit.

---

## 🛡️ Arsitektur Keamanan Backend (Firebase Cloud Functions v2)

Seluruh logika bisnis sensitif dieksekusi di serverless backend **Google Cloud Run (Cloud Functions 2nd Generation)** di region `asia-southeast1`:

| Cloud Function (v2) | Trigger | Deskripsi Keamanan |
| :--- | :--- | :--- |
| **`verifyCashierPin`** | Callable HTTPS (`onCall`) | Validasi PIN kasir terisolasi tanpa mengunduh data PIN ke browser. |
| **`paymentWebhook`** | HTTPS Request (`onRequest`) | Menerima webhook pembayaran Mayar.id & QRIS untuk upgrade tier PRO. |
| **`onUserCreated`** | Firestore Create Trigger | Mengunci masa Trial 30 Hari penuh & men-generate Store Code unik. |
| **`checkTrialExpiryScheduled`**| Cloud Scheduler Cron | Cron job harian otomatis memeriksa dan memperbarui status masa trial. |
| **`onTransactionCreated`** | Firestore Create Trigger | Pengurangan stok produk fisik dan bahan baku secara atomik. |

---

## 🛠️ Panduan Instalasi Lokal

### 1. Prasyarat
- Node.js versi 20 atau lebih baru
- Firebase CLI (`npm install -g firebase-tools`)

### 2. Clone & Install Dependensi
```bash
git clone https://github.com/DenyWismoyo/umkm-omnifit.git
cd umkm-omnifit

# Install dependensi frontend Next.js
npm install

# Install dependensi Cloud Functions v2
cd functions
npm install
cd ..
```

### 3. Konfigurasi Environment Variables (`.env.local`)
Buat file `.env.local` di direktori utama:
```env
NEXT_PUBLIC_APP_URL=https://umkm.omnifit.cloud

# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id

# Mayar Payment Gateway Configuration
MAYAR_API_KEY=your_mayar_api_key
MAYAR_WEBHOOK_TOKEN=your_mayar_webhook_token
```

### 4. Menjalankan Server Development
```bash
npm run dev
```
Buka browser di [http://localhost:3000](http://localhost:3000).

---

## 🚢 Panduan Deployment ke Custom Domain

### Deploy Cloud Functions (Backend v2)
```bash
firebase deploy --only functions
```

### Deploy Frontend Next.js ke Firebase Hosting (Asia-Southeast1)
```bash
npm run build
firebase deploy --only hosting
```

Custom domain `umkm.omnifit.cloud` dikonfigurasi melalui Firebase Hosting Custom Domain Management dengan SSL otomatis.

---

## 📄 Struktur Proyek

```
pos-umkm/
├── functions/                    # 🛡️ Firebase Cloud Functions 2nd Gen (v2)
│   ├── src/
│   │   ├── admin.ts              # Inisialisasi Firebase Admin & Global v2 Options
│   │   ├── auth/                 # onUserCreated & verifyCashierPin
│   │   ├── subscriptions/        # paymentWebhook & checkTrialExpiryScheduled
│   │   └── inventory/            # onTransactionCreated (Atomic Stock Deduct)
├── src/
│   ├── app/                      # 🌐 Next.js 15 App Router
│   │   ├── (app)/                # Rute Terproteksi (Dashboard, POS, Settings, dll)
│   │   ├── (public)/             # Rute Publik (Landing Page, Login, Upgrade)
│   │   ├── layout.tsx            # Root Layout, SEO Metadata & JSON-LD Schema
│   │   ├── robots.ts             # Directives Googlebot & Sitemap
│   │   └── sitemap.ts            # Dynamic XML Sitemap Generator
│   ├── components/               # 🎨 UI Primitives & Komponen Multi-Industri
│   ├── context/                  # 🔐 AuthContext & Sesi Kasir/Owner
│   ├── data/                     # 📋 Paket Langganan & Data Industri
│   ├── lib/                      # ⚙️ Firebase Init, Print Utils & Route Permissions
│   └── types/                    # 📐 Definisi TypeScript
├── firebase.json                 # Konfigurasi Hosting & Cloud Functions
└── README.md                     # Dokumentasi Proyek
```

---

## 📚 Pusat Panduan Pengguna & Manual Book (`public/docs/`)

Panduan operasional lengkap untuk pemilik toko dan staf kasir:
- 📘 **[Buku Panduan Utama (Manual Book)](./public/docs/MANUAL_BOOK.md)**: Setup Akun, POS Kasir, Shift Staf & Laporan Keuangan.
- 🍽️ **[Panduan Modul Kuliner & Resto](./public/docs/INDUSTRI_KULINER.md)**: Meja QR Dine-in, Split Bill & Struk Dapur.
- ☕ **[Panduan Modul Kedai Kopi & Cafe](./public/docs/INDUSTRI_COFFEESHOP.md)**: Antrian Barista, Kartu Stempel & Resep Kopi HPP.
- 🛒 **[Panduan Modul Retail & Minimarket](./public/docs/INDUSTRI_RETAIL.md)**: Barcode Scanner, Grosir Bertingkat & Expired Alert.
- ✂️ **[Panduan Modul Salon & Barbershop](./public/docs/INDUSTRI_SALON.md)**: Booking Stylist & Kalkulator Komisi Staf.
- 🧺 **[Panduan Modul Laundry Kiloan](./public/docs/INDUSTRI_LAUNDRY.md)**: Timbangan Desimal & Tracking Status Cucian.
- 🖨️ **[Panduan Printer Thermal](./public/docs/PANDUAN_PRINTER_THERMAL.md)**: Koneksi Bluetooth & USB (58mm/80mm).
- 📖 **[Panduan Buku Kasbon & Hutang](./public/docs/PANDUAN_KASBON_HUTANG.md)**: Catat Piutang Pelanggan & Pelunasan Cicilan.

---

## 📞 Dukungan & Lisensi

Dikelola dan dikembangkan oleh tim **Omnifit Cloud**.  
Untuk pertanyaan kemitraan atau dukungan teknis, kunjungi [https://umkm.omnifit.cloud](https://umkm.omnifit.cloud).

© 2026 POS UMKM Pro by Omnifit Cloud. Hak Cipta Dilindungi Undang-Undang.
