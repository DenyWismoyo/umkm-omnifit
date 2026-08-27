---
name: industry-retail
description: >
  Panduan pengembangan modul Retail, Grosir & Toko Kelontong untuk POS UMKM Pro.
  Gunakan skill ini saat membangun atau memodifikasi halaman dan komponen
  spesifik untuk industri Minimarket, Toko Fashion, dan Toko Grosir.
---

# Industry Skill: Retail, Grosir & Toko Kelontong

## 1. Profil Industri

**Target Bisnis:** Toko Sembako, Minimarket, Butik Fashion, Toko Bangunan, Toko Aksesoris, Grosiran

**Pain Points Utama:**
- Ribuan SKU produk — pencarian manual sangat lambat di kasir
- Stok tidak akurat karena tidak ada opname yang teratur
- Pembelian ke supplier tidak tercatat → tidak ada histori harga beli
- Margin per produk tidak diketahui karena HPP tidak terhitung

**Alur Kerja Kasir Retail:**
1. Kasir scan barcode produk → otomatis masuk ke keranjang POS
2. Konfirmasi total → proses bayar (tunai/transfer/QRIS)
3. Stok otomatis berkurang saat transaksi berhasil
4. Alert muncul jika stok di bawah threshold

---

## 2. Rute & Fitur Retail

### Rute Retail-Spesifik (semua perlu dibangun):
| Route | Tier | Status | Prioritas |
|---|---|---|---|
| `/barcode-scanner` | Basic+ | ❌ Belum ada | 🔴 Tinggi |
| `/purchase-orders` | PRO | ❌ Belum ada | 🟠 Sedang |

### Fitur Basic Retail:
- Input Barcode / SKU Manual & Cepat
- Pengelompokan Kategori Barang
- Alert Stok Menipis Otomatis

### Fitur Pro Retail:
- Integrasi Barcode Scanner Kamera & Hardware
- Manajemen Multi-Kategori & Rak Penyimpanan
- Laporan Produk Terlaris & Dead Stock
- Audit Opname Stok & Riwayat Penyesuaian Barang
- Cetak Label Barcode & Label Harga Rak
- Kalkulator HPP Pembelian Grosir & Margin Toko

---

## 3. Firestore Schema Retail

```
users/{ownerUid}/
  ├── products/{id}              # SKU produk retail
  │     ├── name, barcode (EAN-13/SKU manual)
  │     ├── category, brand
  │     ├── price (harga jual), buyPrice (HPP/harga beli)
  │     ├── stockQty, alertThreshold
  │     ├── unit: "pcs" | "kg" | "liter" | "pack"
  │     └── shelfLocation        # Lokasi rak (opsional)
  │
  └── purchaseOrders/{id}        # Pembelian ke supplier
        ├── poNumber             # PO-YYYYMMDD-001
        ├── supplierId, supplierName
        ├── items[]: {
        │     productId, productName
        │     qty, buyPrice, totalCost
        │   }
        ├── status: "draft" | "ordered" | "received" | "cancelled"
        ├── totalCost
        └── orderedAt, receivedAt
```

---

## 4. SOP Pembuatan `/barcode-scanner`

### Fungsi: Scan produk menggunakan kamera HP atau hardware scanner → langsung cari produk di katalog.

### Komponen:
```
src/components/retail/barcode-scanner/
├── CameraScanner.tsx          # Kamera scan menggunakan browser API
├── ManualBarcodeInput.tsx     # Fallback: input manual barcode
└── ScanResultCard.tsx         # Preview produk ditemukan + tombol tambah ke keranjang
```

### Library yang digunakan:
```bash
npm install @zxing/library      # ZXing untuk decode barcode dari kamera
# atau
npm install quagga2             # Alternatif barcode scanner library
```

### `page.tsx` pattern:
- Mode kamera aktif → real-time scan frame video stream
- Saat barcode terdeteksi → cari di Firestore → tampilkan `ScanResultCard`
- Jika tidak ditemukan → opsi "Tambah Produk Baru dengan Barcode Ini"
- Riwayat scan session hari ini (bisa langsung ke POS)

### Business Logic:
- Barcode adalah field unik di `products` — validasi duplikasi saat input
- Scan di `/barcode-scanner` bisa mode "Opname Stok" (hitung stok fisik) atau "Tambah ke POS"

---

## 5. SOP Pembuatan `/purchase-orders`

### Komponen:
```
src/components/retail/purchase-orders/
├── POFormDialog.tsx           # Form buat/edit Purchase Order
├── POStatusBadge.tsx          # Badge: Draft/Dipesan/Diterima/Dibatalkan
├── POReceiveDialog.tsx        # Dialog konfirmasi terima barang (update stok)
└── SupplierSelect.tsx         # Select supplier dengan autocomplete
```

### `page.tsx` pattern:
- **Tab 1 — PO Aktif**: List PO yang sedang berjalan (draft & ordered)
- **Tab 2 — Riwayat PO**: Semua PO yang sudah received/cancelled
- **Filter** by supplier, status, tanggal

### Business Logic:
- Saat PO di-"Terima" → stok produk bertambah otomatis sesuai `qty` di PO
- `buyPrice` di PO menjadi `buyPrice` terbaru di `products` → HPP otomatis update
- PO "Draft" tidak mempengaruhi stok

---

## 6. Checklist Sebelum Rilis Modul Retail

- [ ] `FeatureGate` dengan `requiredIndustry={["retail"]}` terpasang
- [ ] `/barcode-scanner` tersedia di tier Basic (`allowedTiers: ["basic", "pro", "enterprise"]`)
- [ ] Barcode field unique di `products`, validasi duplikasi saat input
- [ ] Terima PO → stok otomatis bertambah
- [ ] Alert stok menipis muncul di dashboard dan di POS
- [ ] HPP produk otomatis update dari harga beli terakhir di PO
