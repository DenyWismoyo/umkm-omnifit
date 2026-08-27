---
name: industry-fnb
description: >
  Panduan pengembangan modul FnB (Food & Beverage) untuk POS UMKM Pro.
  Gunakan skill ini saat membangun atau memodifikasi halaman dan komponen
  spesifik untuk industri Kuliner, Café, Resto, Warung, dan Ghost Kitchen.
---

# Industry Skill: FnB (Kuliner, Café & Resto)

## 1. Profil Industri

**Target Bisnis:** Kafe, Warteg, Resto, Angkringan, Kopi Susu, Bakery, Kedai Makanan, Ghost Kitchen

**Pain Points Utama:**
- Pesanan ramai di jam makan siang/malam — butuh sistem antrian dapur
- Biaya bahan baku (food cost) tidak terkontrol → HPP wajib ada
- Stok bahan habis di jam sibuk, malu ke pelanggan
- Susah hitung untung-rugi karena banyak menu dengan biaya bahan berbeda

**Alur Kerja Kasir FnB:**
1. Kasir terima pesanan (dine-in / take-away / bungkus)
2. Input menu ke POS → otomatis teruskan ke Kitchen Display / `/orders`
3. Dapur proses → update status pesanan
4. Kasir konfirmasi bayar → cetak struk

---

## 2. Rute & Fitur FnB

### Rute Shared (tersedia untuk FnB, sudah implementasi):
| Route | Status | Keterangan |
|---|---|---|
| `/pos` | ✅ Done | POS kasir dengan catatan pesanan khusus |
| `/products` | ✅ Done | Kategori menu: Makanan, Minuman, Topping |
| `/hpp` | ✅ Done | Kalkulator HPP bahan + 111 template resep |
| `/inventory` | ✅ Done | Stok bahan baku + pengurangan otomatis |

### Rute FnB-Spesifik (target pengembangan):
| Route | Tier | Prioritas |
|---|---|---|
| `/orders` | PRO | 🔴 Tinggi — inti bisnis FnB |

### Fitur Basic FnB:
- Kategori Menu Makanan, Minuman & Topping
- Kalkulator HPP Standar (Bahan & Porsi)
- Catatan Khusus Pesanan (Pedas, Less Sugar, dll)

### Fitur Pro FnB:
- Kalkulator HPP Cerdas + 111+ Template Resep Siap Pakai
- Sistem Antrean Pesanan Dapur Live (`/orders`)
- Layar Antrean Pelanggan / Kitchen Display (`/display`)
- Buku Menu Digital QR Meja Pelanggan (`/menu`)
- Manajemen Bahan Baku & Pengurangan Stok Otomatis
- Diagnosa Margin Profit & Analisa Biaya Kemasan/Overhead

---

## 3. Firestore Schema FnB

```
users/{ownerUid}/
  ├── products/{id}              # Menu utama
  │     ├── name, price, category, imageUrl
  │     ├── hppPerPortion        # HPP per porsi (dari kalkulator HPP)
  │     └── estimatedStock       # Estimasi stok porsi tersisa
  │
  ├── rawMaterials/{id}          # Bahan baku dapur
  │     ├── name, unit (gram/liter/pcs)
  │     ├── stockQty, alertThreshold
  │     └── pricePerUnit
  │
  ├── recipes/{id}               # Resep per produk
  │     ├── productId
  │     └── ingredients[]: { materialId, qty, unit }
  │
  └── orders/{id}                # Antrian pesanan dapur
        ├── tableNumber, type (dine-in/takeaway)
        ├── items[]: { productId, name, qty, notes }
        ├── status: "pending" | "cooking" | "ready" | "served"
        └── createdAt, updatedAt
```

---

## 4. SOP Pembuatan `/orders` (Antrian Dapur)

### Komponen yang perlu dibuat:
```
src/components/fnb/orders/
├── OrderCard.tsx          # Card satu pesanan (status, item list, timer)
├── OrderStatusBadge.tsx   # Badge status: Pending/Masak/Siap/Selesai
└── KitchenDisplay.tsx     # Grid tampilan full-screen untuk layar dapur
```

### `page.tsx` pattern:
- Real-time listener Firestore (`onSnapshot`) bukan `getDocs` — pesanan harus update otomatis
- Group orders by status (Pending → Masak → Siap → Selesai)
- Tampilan grid card, bukan tabel — kasir/chef lihat sekilas
- Tombol update status dengan konfirmasi minimal (satu tap, tidak perlu dialog)

### Business Logic:
- Pesanan baru otomatis `status: "pending"`
- Chef tap → `status: "cooking"`
- Chef tap selesai → `status: "ready"` + kirim notifikasi ke kasir
- Kasir konfirmasi diambil → `status: "served"` + trigger pengurangan stok

---

## 5. Checklist Sebelum Rilis Modul FnB

- [ ] `FeatureGate` terpasang dengan `requiredTier="pro"` dan `requiredIndustry={["fnb", "universal"]}`
- [ ] Real-time Firestore listener (`onSnapshot`) untuk `/orders`
- [ ] HPP dihitung otomatis dari resep saat transaksi
- [ ] Stok bahan dikurangi otomatis setelah pesanan `served`
- [ ] Catatan pesanan ("level pedas", "tanpa MSG") masuk ke kitchen display
