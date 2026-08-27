---
name: industry-salon
description: >
  Panduan pengembangan modul Salon, Barbershop & Spa untuk POS UMKM Pro.
  Gunakan skill ini saat membangun atau memodifikasi halaman dan komponen
  spesifik untuk industri Barbershop, Salon Kecantikan, Nail Art, dan Spa.
---

# Industry Skill: Salon, Barbershop & Spa

## 1. Profil Industri

**Target Bisnis:** Barbershop, Salon Rambut, Nail Art, Klinik Kecantikan, Pijat Refleksi, Spa

**Pain Points Utama:**
- Booking bertabrakan → double booking kapster yang sama
- Komisi kapster dihitung manual di akhir bulan → sering ada selisih
- Riwayat treatment pelanggan tidak tercatat → kapster pengganti tidak tahu preferensi
- Stok produk (obat rambut, cat, nail polish) habis tidak ketahuan

**Alur Kerja Salon:**
1. Pelanggan datang/booking → kasir assign ke kapster yang tersedia
2. Kapster lakukan treatment → catat produk yang digunakan
3. Kasir input transaksi ke POS → komisi kapster otomatis dihitung
4. Riwayat treatment tersimpan di profil pelanggan

---

## 2. Rute & Fitur Salon

### Rute Salon-Spesifik (semua perlu dibangun):
| Route | Tier | Status | Prioritas |
|---|---|---|---|
| `/services` | Basic | ❌ Belum ada | 🔴 Tinggi |
| `/appointments` | PRO | ❌ Belum ada | 🔴 Tinggi |
| `/stylists` | PRO | ❌ Belum ada | 🟠 Sedang |

### Fitur Basic Salon:
- Daftar Layanan & Paket Treatment Dasar
- Pencatatan Nama Kapster / Stylist Kasir
- Input Diskon Khusus Pelanggan

### Fitur Pro Salon:
- Kalkulator HPP Biaya Jasa, Produk Obat & Durasi Treatment
- Pencatatan Komisi Stylist/Kapster per Layanan
- Database Riwayat Treatment & Preferensi Pelanggan
- Manajemen Stok Bahan Kimia, Obat Rambut & Skincare
- Laporan Performa Stylist & Jam Sibuk Salon

---

## 3. Firestore Schema Salon

```
users/{ownerUid}/
  ├── services/{id}              # Katalog layanan
  │     ├── name, category       # "Potong Rambut", "Creambath", "Nail Art"
  │     ├── price, duration (menit)
  │     ├── commissionType: "fixed" | "percent"
  │     ├── commissionValue      # Rp 10.000 atau 15%
  │     └── hppCost              # Biaya bahan + overhead
  │
  ├── stylists/{id}              # Data kapster/stylist
  │     ├── name, phone, avatar
  │     ├── specialties[]        # ["Coloring", "Keratin", "Nail Art"]
  │     ├── isActive
  │     └── commissionSummary    # Cached: total komisi bulan ini
  │
  ├── appointments/{id}          # Booking jadwal
  │     ├── customerId, customerName, customerPhone
  │     ├── stylistId, stylistName
  │     ├── services[]: { serviceId, serviceName, price }
  │     ├── scheduledAt          # Timestamp waktu booking
  │     ├── duration             # Total menit estimasi
  │     ├── status: "scheduled" | "in_progress" | "done" | "cancelled"
  │     ├── notes                # Preferensi khusus pelanggan
  │     └── createdAt
  │
  └── treatmentHistory/{id}      # Riwayat per pelanggan
        ├── customerId, stylistId
        ├── services[], totalPrice
        ├── productsUsed[]       # Produk bahan yang dipakai
        └── notes, createdAt
```

---

## 4. SOP Pembuatan `/services` (Katalog Layanan)

### Fungsi: Daftar semua layanan beserta harga, durasi, dan komisi kapster.

### Komponen:
```
src/components/salon/services/
├── ServiceFormDialog.tsx      # Form tambah/edit layanan
├── ServiceCard.tsx            # Card display satu layanan
└── CommissionSummary.tsx      # Rekap komisi per layanan
```

### `page.tsx` pattern:
- Grid card per layanan (bukan tabel) — lebih visual dan mudah dikelola
- Group by kategori (Rambut, Kecantikan, Nail, Body)
- Filter dan search layanan
- Toggle aktif/nonaktif layanan tanpa hapus data

---

## 5. SOP Pembuatan `/appointments` (Jadwal Booking)

### Komponen:
```
src/components/salon/appointments/
├── AppointmentFormDialog.tsx  # Form buat/edit booking
├── AppointmentCalendar.tsx    # Tampilan kalender harian/mingguan
├── StylistTimeline.tsx        # Timeline availability per kapster
└── AppointmentCard.tsx        # Card booking dengan status & aksi
```

### `page.tsx` pattern:
- **View Mode Toggle**: Tampilan Kalender ↔ Tampilan List
- Tampilkan slot yang sudah booked per kapster per hari
- Konflik jadwal (double booking) dideteksi otomatis → peringatan
- Dari booking, bisa langsung "Mulai Layanan" → buat transaksi POS

### Business Logic:
- Cek overlap: `scheduledAt` sampai `scheduledAt + duration` tidak boleh tumpang tindih per kapster
- Walk-in (tanpa booking) langsung assign ke kapster yang `isAvailable`
- Notifikasi H-1 booking via WhatsApp (jika nomor tersedia)

---

## 6. SOP Pembuatan `/stylists` (Manajemen Kapster)

### Komponen:
```
src/components/salon/stylists/
├── StylistFormDialog.tsx      # Form tambah/edit kapster
├── StylistCard.tsx            # Card profil kapster dengan komisi summary
└── CommissionReport.tsx       # Laporan komisi bulanan per kapster
```

### Business Logic:
- Komisi dihitung otomatis per transaksi berdasarkan `commissionType` di setiap layanan
- Summary komisi bisa dilihat per periode (mingguan/bulanan)
- Kapster nonaktif tidak muncul di pilihan assignment booking

---

## 7. Checklist Sebelum Rilis Modul Salon

- [ ] `FeatureGate` dengan `requiredIndustry={["salon"]}` terpasang
- [ ] Konflik jadwal double-booking terdeteksi otomatis
- [ ] Komisi kapster terhitung otomatis per transaksi
- [ ] Riwayat treatment pelanggan tersimpan di Firestore
- [ ] `/services` dapat diakses di tier Basic (sesuai routePermissions)
- [ ] HPP layanan (produk + overhead) terhitung di laporan
