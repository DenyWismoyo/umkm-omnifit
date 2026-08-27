# POS UMKM Pro — Business Rules (Universal)

Aturan-aturan ini bersifat **WAJIB** dan berlaku di seluruh industri, komponen, dan halaman
tanpa pengecualian. Setiap perubahan kode harus mematuhi guardrail ini.

---

## R1. Harga Produk Selalu Fixed (Berbasis HPP)

**DILARANG** membuat input harga "open price" atau harga yang dapat diubah bebas oleh kasir saat transaksi berlangsung.

- Harga jual produk HARUS ditetapkan di menu `/products` oleh owner/supervisor.
- HPP (Harga Pokok Produksi) adalah dasar minimum penetapan harga; harga jual TIDAK boleh di bawah HPP.
- Kasir HANYA boleh memilih produk — tidak boleh mengubah harga di POS.
- Diskon dapat diberikan hanya jika fitur diskon diaktifkan oleh owner, dengan batas maksimum yang sudah ditetapkan.

---

## R2. Semua Fitur PRO Wajib Dibungkus FeatureGate

Setiap halaman atau komponen yang termasuk fitur PRO atau Enterprise **HARUS** dibungkus dengan `<FeatureGate>` dari `src/components/common/FeatureGate.tsx`.

```tsx
// BENAR
<FeatureGate requiredTier="pro" featureName="Laporan Laba/Rugi">
  <ReportsPage />
</FeatureGate>

// SALAH — langsung render tanpa gate
<ReportsPage />
```

Fitur industri-spesifik juga HARUS menyertakan `requiredIndustry`:

```tsx
<FeatureGate
  requiredTier="pro"
  requiredIndustry={["coffeeshop"]}
  featureName="Antrian Barista"
>
  <BaristaQueue />
</FeatureGate>
```

---

## R3. Semua Query Firestore Wajib Menggunakan storeOwnerUid

**DILARANG** menggunakan `user.uid` langsung untuk operasi Firestore. Selalu gunakan `storeOwnerUid` dari `useAuth()`.

```typescript
// BENAR
const { storeOwnerUid } = useAuth();
const data = await getProducts(storeOwnerUid);

// SALAH
const { user } = useAuth();
const data = await getProducts(user.uid); // Kasir akan mengakses data sendiri, bukan data owner
```

**Alasan:** Kasir login dengan akun anonymous/terpisah tetapi harus mengakses data toko milik owner.

---

## R4. Role Kasir — Hak Akses Terbatas

Kasir (`role: "cashier"`) HANYA boleh mengakses:
- `/pos` — Mesin kasir
- `/products` — Lihat produk (read-only)
- `/debts` — Catat kasbon pelanggan

Kasir **DILARANG** mengakses:
- `/reports`, `/expenses`, `/dashboard`, `/settings`, `/hpp`, `/academy`
- Semua halaman industri-spesifik yang membutuhkan role `owner` atau `supervisor`

---

## R5. Trial — 30 Hari, Dibatasi Industri Pilihan

Trial berlaku selama **30 hari** sejak registrasi, dengan ketentuan:

- User trial mendapat akses **seluruh fitur PRO** dari industri yang dipilih saat onboarding.
- User trial **TIDAK dapat** mengakses fitur industri lain (misalnya user laundry tidak bisa akses `/barista-queue`).
- Setelah trial berakhir, akses dikembalikan ke Basic (hanya `/pos` dan `/products`).
- Indikator sisa hari trial HARUS ditampilkan di sidebar atau header aplikasi.

---

## R6. Tidak Ada Perubahan Harga/Plan Tanpa Melalui subscriptionPlans.ts

Semua data pricing, feature list, dan plan metadata HARUS berasal dari:
- `src/data/subscriptionPlans.ts` — definisi plan dan harga
- `src/lib/routePermissions.ts` — matrix akses per route

**DILARANG** hardcode harga atau nama fitur di komponen UI secara langsung.

---

## R7. Standar Komponen Wajib

Semua halaman/modul HARUS menggunakan komponen shared berikut (bukan membuat ad-hoc):

| Kebutuhan | Komponen yang WAJIB digunakan |
|---|---|
| Tabel daftar data | `src/components/shared/data-display/DataTable.tsx` |
| Input nominal Rupiah | `src/components/common/CurrencyInput.tsx` |
| Form validation | `react-hook-form` + `zod` |
| Konfirmasi hapus | Dialog konfirmasi (bukan `window.confirm()`) |
| Notifikasi sukses/error | `sonner` toast (bukan `alert()`) |
| State loading | Skeleton atau spinner — TIDAK boleh blank white |

---

## R8. TypeScript Wajib Bersih

Jalankan `npx tsc --noEmit` sebelum menganggap suatu modul selesai. Tidak boleh ada `any` type tanpa komentar penjelasan yang valid.

---

## R9. Standar Route Grouping (Next.js)

Semua rute (URL) yang merupakan fitur spesifik untuk industri tertentu **WAJIB** ditempatkan di dalam folder Route Group industri tersebut di \src/app/(app)/(nama_industri)/[nama_rute]\.

- Contoh: \src/app/(app)/(fnb)/orders/page.tsx\
- Contoh: \src/app/(app)/(salon)/appointments/page.tsx\

Jika suatu fitur bisa diakses lintas industri (misalnya \/orders\ bisa diakses FnB dan Universal), rute tersebut tetap dikelompokkan di bawah **industri origin/utama**-nya.
