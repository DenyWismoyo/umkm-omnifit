---
name: industry-coffeeshop
description: >
  Panduan pengembangan modul Coffee Shop & Cafe untuk POS UMKM Pro.
  Gunakan skill ini saat membangun atau memodifikasi halaman dan komponen
  spesifik untuk industri Kedai Kopi, Boba, Minuman Kekinian, dan Dessert Bar.
---

# Industry Skill: Coffee Shop & Cafe

## 1. Profil Industri

**Target Bisnis:** Kedai Kopi, Boba Tea, Minuman Kekinian, Dessert Bar, Es Krim

**Pain Points Utama:**
- Antrian panjang di jam sibuk — barista overwhelmed, pelanggan tidak tahu status
- Biaya per cup tidak terhitung (kopi, susu, topping, cup, sedotan = HPP tersembunyi)
- Pelanggan setia tidak ada reward → loyalty program manual tidak rapi
- Level minuman (es, gula, suhu) sering salah karena komunikasi lisan

**Alur Kerja Kasir Coffee Shop:**
1. Kasir terima pesanan → input ke POS dengan pilihan level (es, gula)
2. Otomatis muncul di **Barista Board** (`/barista-queue`) sebagai antrian
3. Barista buat minuman → tap "Selesai" di board
4. Kasir konfirmasi bayar → cetak label cup + struk

---

## 2. Rute & Fitur Coffee Shop

### Rute CoffeeShop-Spesifik (semua perlu dibangun):
| Route | Tier | Status | Prioritas |
|---|---|---|---|
| `/barista-queue` | PRO | 🟡 Folder ada, page kosong | 🔴 Tinggi |
| `/recipes` | PRO | ❌ Belum ada | 🟠 Sedang |
| `/loyalty` | PRO | ❌ Belum ada | 🟡 Rendah |

### Fitur Basic CoffeeShop:
- Kategori Menu Kopi, Non-Kopi & Snack
- Modul Takaran Cup (Reguler/Large)
- Cetak Struk Khusus Label Cup

### Fitur Pro CoffeeShop:
- Manajemen Resep & HPP per Cup
- Sistem Antrean Barista Board Live
- Loyalty Program & Stamp Digital
- Buku Menu Digital QR Meja Pelanggan
- Manajemen Bahan Baku & Pengurangan Stok Otomatis

---

## 3. Firestore Schema CoffeeShop

```
users/{ownerUid}/
  ├── products/{id}              # Menu minuman & makanan
  │     ├── name, price, category
  │     ├── availableLevels: {   # Level customisasi
  │     │     ice: ["normal", "less", "no"]
  │     │     sugar: ["normal", "less", "no", "extra"]
  │     │   }
  │     └── hppPerCup            # HPP per cup
  │
  ├── recipes/{id}               # Resep per minuman
  │     ├── productId, productName
  │     ├── cupSize: "regular" | "large"
  │     └── ingredients[]: { name, qty, unit, costPerUnit }
  │
  ├── baristaOrders/{id}         # Antrian barista board
  │     ├── orderNumber          # Nomor antrian (001, 002, ...)
  │     ├── customerName
  │     ├── items[]: {
  │     │     productId, name, qty
  │     │     iceLevel, sugarLevel, notes
  │     │   }
  │     ├── status: "queued" | "making" | "done"
  │     └── createdAt
  │
  └── loyaltyCards/{customerId}  # Kartu stempel digital
        ├── customerName, phone
        ├── stampsTotal, stampsCurrentCard (reset per 10)
        └── lastVisit, redeemedAt[]
```

---

## 4. SOP Pembuatan `/barista-queue`

### Komponen yang perlu dibuat:
```
src/components/coffeeshop/barista-queue/
├── BaristaOrderCard.tsx      # Card antrian: nomor, nama pelanggan, detail minuman
├── LevelBadge.tsx            # Badge level es/gula per item
└── BaristaBoard.tsx          # Grid full-screen board antrian (bisa dipakai di TV/tablet terpisah)
```

### `page.tsx` pattern:
- **Real-time listener** (`onSnapshot`) — antrian HARUS update otomatis tanpa refresh
- Tampilkan sebagai **kanban column**: Antrian → Sedang Dibuat → Selesai
- Tombol "Mulai Buat" dan "Selesai" satu tap, tidak perlu konfirmasi dialog
- Sound/visual alert saat pesanan baru masuk (opsional, pakai browser notification API)

### Business Logic:
- Nomor antrian: auto-increment per hari, reset ke 001 tiap hari baru
- Pesanan dari POS otomatis masuk ke `baristaOrders` dengan `status: "queued"`
- Barista tap "Mulai" → `status: "making"`
- Barista tap "Selesai" → `status: "done"` + pengurangan stok bahan
- Pesanan `done` otomatis tersembunyi setelah 5 menit (atau dapat diarsipkan manual)

---

## 5. SOP Pembuatan `/recipes`

### Komponen:
```
src/components/coffeeshop/recipes/
├── RecipeFormDialog.tsx      # Form tambah/edit resep
└── RecipeCostBreakdown.tsx   # Visual breakdown biaya per bahan → total HPP
```

### Business Logic:
- Resep terhubung ke `products` via `productId`
- Kalkulasi HPP otomatis: `sum(ingredient.qty * ingredient.costPerUnit)`
- Tampilkan perbandingan HPP vs Harga Jual → margin per cup
- Perubahan harga bahan baku otomatis recalculate semua resep terkait

---

## 6. SOP Pembuatan `/loyalty`

### Komponen:
```
src/components/coffeeshop/loyalty/
├── LoyaltyCardDisplay.tsx    # Tampilan kartu stempel (visual seperti kartu fisik)
├── StampAction.tsx           # Tombol +stamp saat transaksi
└── RedeemDialog.tsx          # Konfirmasi penukaran hadiah
```

### Business Logic:
- 1 transaksi = 1 stamp (atau N stamp sesuai nilai minimum transaksi)
- Setelah 10 stamp → pelanggan berhak redeem 1 minuman gratis (configurable)
- Stamp dicatat di `loyaltyCards/{customerId}` — tidak di `transactions`
- Kasir bisa tambah stamp manual dari halaman `/loyalty` atau otomatis dari `/pos`

---

## 7. Checklist Sebelum Rilis Modul CoffeeShop

- [ ] `FeatureGate` dengan `requiredIndustry={["coffeeshop"]}` terpasang
- [ ] Real-time listener aktif di `/barista-queue`
- [ ] Nomor antrian auto-reset setiap hari
- [ ] Level (es/gula) tampil jelas di barista card
- [ ] HPP per cup terhitung dari resep
- [ ] Loyalty stamp terintegrasi dengan POS
