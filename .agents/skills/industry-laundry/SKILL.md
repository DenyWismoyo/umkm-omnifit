---
name: industry-laundry
description: >
  Panduan pengembangan modul Laundry & Dry Cleaning untuk POS UMKM Pro.
  Gunakan skill ini saat membangun atau memodifikasi halaman dan komponen
  spesifik untuk industri Laundry Kiloan, Satuan, Cuci Sepatu, dan Karpet.
---

# Industry Skill: Laundry & Dry Cleaning

## 1. Profil Industri

**Target Bisnis:** Laundry Kiloan, Laundry Satuan, Cuci Sepatu, Cuci Karpet, Stroller, Helm

**Pain Points Utama:**
- Pelanggan tidak tahu cuciannya sudah selesai → telepon terus
- Banyak cucian masuk bersamaan, susah tracking mana yang sudah/belum
- Hitungan kiloan tidak presisi → sering ada selisih harga
- Biaya deterjen, pewangi, gas tidak diperhitungkan → keuntungan tipis tanpa disadari

**Alur Kerja Kasir Laundry:**
1. Pelanggan datang → timbang cucian → input ke `/weight-pricing` untuk kalkulasi harga
2. Buat tiket masuk cucian → struk tanda terima dicetak
3. Update status saat diproses (Diterima → Dicuci → Disetrika → Selesai)
4. WhatsApp otomatis ke pelanggan saat "Selesai Siap Ambil"
5. Pelanggan ambil → konfirmasi bayar di POS

---

## 2. Rute & Fitur Laundry

### Rute Laundry-Spesifik:
| Route | Tier | Status | Prioritas |
|---|---|---|---|
| `/weight-pricing` | PRO | 🟡 Folder ada, page kosong | 🔴 Tinggi |
| `/pickup-delivery` | PRO | ❌ Belum ada | 🟠 Sedang |

### Fitur Basic Laundry:
- Pilihan Satuan: Kiloan, Satuan & Meteran
- Catatan Khusus Cucian (Noda, Parfum, Lipat/Gantung)
- Format Struk Tanda Terima Cuci Lengkap

### Fitur Pro Laundry:
- Kalkulator HPP Biaya Deterjen, Pewangi, Gas & Plastik
- Status Tracking Order (Diterima → Dicuci → Disetrika → Selesai → Diambil)
- Notifikasi WhatsApp Otomatis "Cucian Selesai Siap Ambil"
- Manajemen Stok Sabun, Softener, Hanger & Parfum
- Laporan Berat Kiloan Harian & Efisiensi Bahan

---

## 3. Firestore Schema Laundry

```
users/{ownerUid}/
  ├── laundryOrders/{id}         # Order masuk (bukan transaksi POS biasa)
  │     ├── ticketNumber         # Nomor tiket: LAU-YYYYMMDD-001
  │     ├── customerId, customerName, customerPhone
  │     ├── orderType: "kiloan" | "satuan" | "express"
  │     ├── weightKg             # Berat actual (untuk kiloan)
  │     ├── items[]: {           # Item satuan (untuk satuan)
  │     │     type: "baju" | "celana" | "sepatu" | "karpet"
  │     │     qty, notes
  │     │   }
  │     ├── totalPrice           # Harga final (dari kalkulator)
  │     ├── status: "received" | "washing" | "drying" | "ironing" | "done" | "picked_up"
  │     ├── specialNotes         # Catatan: noda darah, parfum lavender, lipat
  │     ├── estimatedDoneAt      # Estimasi selesai
  │     ├── whatsappSentAt       # Timestamp WA terkirim
  │     └── createdAt, updatedAt
  │
  └── laundryPricing/{id}        # Harga per layanan
        ├── type: "kiloan" | "satuan"
        ├── itemType             # "baju biasa", "sepatu", "karpet 3x4m"
        ├── pricePerKg | pricePerUnit
        └── expressMultiplier    # Lipatan harga express (misal 1.5x)
```

---

## 4. SOP Pembuatan `/weight-pricing`

### Fungsi Halaman:
Kalkulator harga sebelum dan saat transaksi — kasir input berat timbangan, sistem otomatis hitung harga berdasarkan tarif kiloan/satuan yang sudah dikonfigurasi owner.

### Komponen yang perlu dibuat:
```
src/components/laundry/weight-pricing/
├── WeightCalculator.tsx       # Komponen utama: input berat → tampil harga
├── PricingConfigTab.tsx       # Tab konfigurasi tarif per layanan (owner only)
└── LaundryTicketCard.tsx      # Preview struk tanda terima sebelum cetak
```

### `page.tsx` pattern:
- **Tab 1 — Kalkulator**: Input berat → pilih jenis layanan → tampil total → buat tiket
- **Tab 2 — Daftar Tiket**: List semua order aktif dengan status tracking
- **Tab 3 — Konfigurasi Tarif** (owner only): Set harga per kg/satuan per jenis item

### Business Logic:
```
Harga Kiloan = weightKg × pricePerKg
Harga Express = Harga Normal × expressMultiplier
Harga Minimal = ada harga minimum (misal min. 2 kg)
```

---

## 5. SOP Pembuatan `/pickup-delivery`

### Komponen:
```
src/components/laundry/pickup-delivery/
├── DeliveryScheduleForm.tsx   # Form jadwal antar-jemput
├── CourierMapView.tsx         # (Opsional) Peta area delivery
└── DeliveryStatusCard.tsx     # Card status per order delivery
```

### Business Logic:
- Owner/supervisor set zona delivery dan ongkos antar
- Pelanggan request via WA → kasir input ke sistem
- Status tracking: `scheduled` → `picked_up_from_customer` → `at_store` → `delivered_back`

---

## 6. Checklist Sebelum Rilis Modul Laundry

- [ ] `FeatureGate` dengan `requiredIndustry={["laundry"]}` terpasang
- [ ] Nomor tiket auto-generate format `LAU-YYYYMMDD-NNN`
- [ ] Status tracking bisa update dari kasir maupun pemilik
- [ ] WhatsApp template untuk notifikasi "cucian selesai" tersedia
- [ ] Struk tanda terima memuat: tiket, nama, item, estimasi selesai, harga
- [ ] HPP bahan (deterjen, gas) terhitung di laporan
