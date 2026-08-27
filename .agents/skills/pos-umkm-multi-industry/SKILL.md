---
name: pos-umkm-multi-industry
description: >
  Panduan arsitektur dan pengembangan untuk sistem POS UMKM Pro multi-bisnis.
  Gunakan skill ini kapanpun melakukan perubahan pada routing, komponen shared,
  menambah industri baru, atau memodifikasi permission matrix. Mencakup konvensi
  kode, pola proxy, dan checklist eksekusi fitur.
---

# POS UMKM Pro — Multi-Industry Development Skill

## 1. Konteks Sistem

POS UMKM Pro adalah aplikasi **Next.js 16 App Router + Firebase** yang mendukung
berbagai model bisnis UMKM. Setiap pengguna dikategorikan berdasarkan:

| Dimensi | Nilai | File Referensi |
|---|---|---|
| **Role** | `owner \| cashier \| supervisor` | `src/types/index.ts` |
| **Tier** | `basic \| pro \| enterprise` | `src/types/index.ts` |
| **Industry** | `fnb \| retail \| salon \| laundry \| universal` | `src/types/index.ts` |
| **Status** | `trial \| active \| expired` | `src/types/index.ts` |

Kombinasi ketiganya menentukan **apa yang bisa diakses** baik di routing (proxy.ts)
maupun di UI (FeatureGate component).

---

## 2. Arsitektur Routing

### 2.1 Proxy (Edge Middleware)

File: `src/proxy.ts`
Dipanggil oleh `middleware.ts` (atau langsung sebagai default export).

**Alur keputusan proxy:**
```
Request Masuk
    |
    +-- Static asset? -> NEXT (skip)
    |
    +-- User sudah login (ada __session)?
    |   +-- Path = /login atau / -> redirect ke /dashboard (atau /pos untuk cashier)
    |   +-- Tidak ada __plan.industry -> redirect ke /onboarding
    |   +-- Lanjut ke access check
    |
    +-- isPublicPath? -> NEXT (skip)
    |
    +-- Tidak ada __session -> redirect /login?redirect={pathname}
    |
    +-- Parse __plan cookie -> {role, tier, industry, isTrial, isActive}
    |
    +-- checkRouteAccess() -> {allowed, reason}
    |   +-- role_unauthorized -> hard redirect
    |   +-- upgrade_required / industry_mismatch -> let pass (FeatureGate di UI)
    |
    +-- Set security headers -> NEXT
```

**Cookie yang digunakan:**
- `__session` — Firebase ID token (httpOnly, set via `/api/auth/session`)
- `__plan` — JSON terenkode berisi `{role, tier, industry, isTrial, isActive}`

### 2.2 Route Groups (App Router)

Gunakan route groups Next.js untuk mengisolasi layout tanpa mempengaruhi URL:

```
app/
+-- (public)/          # Layout tanpa AppNavbar/Sidebar
|   +-- login/
|   +-- pricing/
|   +-- menu/
|
+-- (app)/             # Layout dengan DashboardLayout
|   +-- layout.tsx     # <- DashboardLayout wrapping di sini
|   +-- dashboard/
|   +-- pos/
|   +-- ...
|
+-- onboarding/        # Di luar kedua group, layout minimal
    +-- page.tsx
```

> **PENTING:** Route group `(app)` dan `(public)` menggunakan parentheses —
> **tidak mempengaruhi URL**. `/app/login` bukan URL yang valid; URL tetap `/login`.

### 2.3 Rute Shared vs Industri-Spesifik

**Rute Shared** (tersedia semua industri, dikontrol oleh Tier):
- `/dashboard`, `/pos`, `/products`, `/reports`, `/expenses`, `/debts`, `/settings`, `/academy`

**Rute Industri-Spesifik** (dikontrol Tier + Industry):

| Rute | Industri | Tier |
|---|---|---|
| `/orders` | `fnb`, `universal` | `pro`, `enterprise` |
| `/tables` | `fnb`, `coffeeshop` | `pro`, `enterprise` |
| `/inventory` | `fnb`, `laundry`, `universal` | `pro`, `enterprise` |
| `/hpp` | `fnb`, `salon`, `laundry` | `pro`, `enterprise` |
| `/appointments` | `salon` | `pro`, `enterprise` |
| `/weight-pricing` | `laundry` | `pro`, `enterprise` |
| `/barcode-scanner` | `retail` | `basic+` |

---

## 3. Cara Menambah Industri Baru

Saat menambah industri baru (misalnya `coffeeshop`), ikuti 7 langkah ini secara berurutan:

### Step 1 — Tambah tipe di `src/types/index.ts`
```typescript
export type IndustryPack = "fnb" | "retail" | "salon" | "laundry" | "universal" | "coffeeshop";
```

### Step 2 — Tambah metadata di `src/data/subscriptionPlans.ts`
```typescript
export const INDUSTRY_METADATA: Record<IndustryPack, IndustryMeta> = {
  // ... existing entries
  coffeeshop: {
    id: "coffeeshop",
    name: "Coffee Shop & Cafe",
    shortName: "Coffee Shop",
    tagline: "Khusus Kedai Kopi, Boba, Minuman Kekinian",
    icon: "☕",
    color: "text-amber-800",
    accentBg: "bg-amber-700",
    badgeBg: "bg-amber-100 text-amber-900 border-amber-300",
    targetBusiness: "Kedai Kopi, Boba Tea, Minuman Kekinian, Dessert Bar",
  },
};
```

### Step 3 — Tambah nav config di `src/lib/industryConfig.ts`
```typescript
export const INDUSTRY_NAV_CONFIG: Record<IndustryPack, NavSection[]> = {
  // ... existing
  coffeeshop: [
    { section: "Utama", items: ["dashboard", "pos", "products"] },
    { section: "Coffee Shop", items: ["barista-queue", "recipes", "loyalty"] },
    { section: "Keuangan", items: ["reports", "expenses", "debts"] },
  ],
};
```

### Step 4 — Tambah permissions di `src/lib/routePermissions.ts`
```typescript
"/barista-queue": {
  requiresAuth: true,
  allowedRoles: ["owner", "supervisor", "cashier"],
  allowedTiers: ["pro", "enterprise"],
  allowedIndustries: ["coffeeshop"],
  featureName: "Antrian Barista",
  featureDescription: "Sistem antrian minuman real-time untuk barista",
},
```

### Step 5 — Tambah subscription plans di `subscriptionPlans.ts`
Ikuti pola existing plans dengan prefix `coffeeshop-` pada planId.

### Step 6 — Buat rute di `src/app/(app)/(coffeeshop)/`
```
app/(app)/(coffeeshop)/
+-- barista-queue/
|   +-- page.tsx
+-- recipes/
|   +-- page.tsx
+-- loyalty/
    +-- page.tsx
```

### Step 7 — Tambah card di halaman `/onboarding`
Tambah opsi baru di `BusinessSelector` component dengan metadata dari Step 2.

---

## 4. Konvensi Komponen Shared

Semua komponen yang digunakan lebih dari 1 industri harus di `src/components/shared/`.

### 4.1 Struktur Shared Components

```
components/shared/
+-- data-display/
|   +-- DataTable.tsx        # Universal table dengan sort/filter/pagination
|   +-- MetricCard.tsx       # KPI card tunggal
|   +-- StatsGrid.tsx        # Grid 2-4 kartu statistik
|   +-- EmptyState.tsx       # Empty state dengan ilustrasi & CTA
|
+-- forms/
|   +-- FormWizard.tsx       # Multi-step form wizard
|   +-- ImageUpload.tsx      # Drag-drop + kompresi otomatis
|   +-- CurrencyInput.tsx    # IDR formatted input (e.g. Rp 150.000)
|   +-- SearchableSelect.tsx # Select dengan async search
|
+-- feedback/
|   +-- ConfirmDialog.tsx    # "Apakah yakin menghapus?" dialog
|   +-- LoadingOverlay.tsx   # Skeleton / spinner overlay
|   +-- ErrorBoundary.tsx    # React error boundary wrapper
|
+-- navigation/
|   +-- Breadcrumb.tsx       # Dynamic breadcrumb
|   +-- TabsNav.tsx          # Tabs navigasi halaman
|
+-- business/
    +-- BusinessSelector.tsx # Onboarding industry picker card grid
    +-- IndustryBadge.tsx    # Badge/chip industri aktif
    +-- PlanStatusBar.tsx    # Trial countdown / status plan
```

### 4.2 Aturan Wajib Shared Component

1. **DILARANG** import `useAuth` langsung — terima data via props
2. **DILARANG** hardcode warna industri — gunakan CSS variable atau prop `accentColor`
3. **WAJIB** export TypeScript interface untuk props
4. **WAJIB** punya `data-testid` pada elemen interaktif utama
5. **WAJIB** handle tiga state: loading, empty, dan error

Contoh pattern yang **benar**:
```typescript
interface MetricCardProps {
  title: string;
  value: string | number;
  trend?: number;
  accentColor?: string;  // diambil dari INDUSTRY_METADATA[industry].color
  isLoading?: boolean;
}

export function MetricCard({ title, value, trend, accentColor, isLoading }: MetricCardProps) {
  // implementasi
}
```

Contoh pattern yang **salah**:
```typescript
// JANGAN LAKUKAN INI di shared component!
export function MetricCard() {
  const { activeIndustry } = useAuth(); // Coupling yang berlebihan
  const color = activeIndustry === 'fnb' ? 'amber' : 'blue'; // Hardcode
}
```

---

## 5. Pattern AuthContext & Industry-Aware UI

### Mengakses data industri di komponen:
```typescript
const {
  activeIndustry,  // "fnb" | "retail" | "salon" | "laundry" | "universal"
  activeTier,      // "basic" | "pro" | "enterprise"
  activeRole,      // "owner" | "cashier" | "supervisor"
  isTrialActive,   // boolean
  storeOwnerUid,   // SELALU gunakan ini untuk Firestore, bukan user.uid
} = useAuth();
```

### Industri-aware rendering dengan metadata:
```typescript
import { INDUSTRY_METADATA } from "@/data/subscriptionPlans";

// Di dalam komponen page/layout:
const meta = INDUSTRY_METADATA[activeIndustry] ?? INDUSTRY_METADATA.universal;

return (
  <div className={meta.accentBg}>
    {meta.icon} {meta.name}
  </div>
);
```

### Menggunakan FeatureGate (di `src/components/common/FeatureGate.tsx`):
```typescript
// Gate berdasarkan tier saja
<FeatureGate requiredTier="pro" featureName="Laporan Laba/Rugi">
  <ReportPage />
</FeatureGate>

// Gate berdasarkan industri + tier
<FeatureGate
  requiredTier="pro"
  requiredIndustry={["fnb", "universal"]}
  featureName="Antrian Dapur"
  description="Kelola pesanan meja dan bungkus secara real-time"
>
  <KitchenQueue />
</FeatureGate>

// Sembunyikan saja tanpa upgrade prompt
<FeatureGate
  requiredTier="pro"
  featureName="Export"
  fallbackMode="hide"
>
  <ExportButton />
</FeatureGate>

// Banner kecil (inline)
<FeatureGate
  requiredTier="enterprise"
  featureName="API Webhook"
  fallbackMode="banner"
>
  <WebhookConfig />
</FeatureGate>
```

---

## 6. Onboarding Flow

### Kapan user diarahkan ke `/onboarding`:
- User baru yang baru Google Sign-In (belum ada `industry` di Firestore/cookie)
- `__plan` cookie ada tapi tidak punya field `industry`
- Proxy mendeteksi kondisi ini dan melakukan redirect

### Alur teknis di onboarding page:
1. Tampilkan `BusinessSelector` — grid card visual per industri
2. User klik salah satu industri
3. Simpan ke Firestore: `saveShopProfile(uid, { industry: selectedIndustry })`
4. Hit API `/api/auth/session` untuk refresh cookie `__plan` dengan industry baru
5. Redirect ke `/dashboard`

### Kode update `__plan` cookie setelah pilih industri:
```typescript
// Di onboarding/page.tsx
const handleSelectIndustry = async (industry: IndustryPack) => {
  setLoading(true);
  // 1. Simpan ke Firestore
  await saveShopProfile(storeOwnerUid, { industry });

  // 2. Refresh session cookie dengan industry baru
  await fetch('/api/auth/session', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ industry }),
  });

  // 3. Redirect ke dashboard
  router.replace('/dashboard');
};
```

---

## 7. Dynamic Sidebar Navigation

`AppSidebar.tsx` membaca nav items dari `INDUSTRY_NAV_CONFIG` berdasarkan `activeIndustry`.

### Nav Item Registry pattern:
```typescript
// src/lib/industryConfig.ts
export const NAV_ITEM_REGISTRY: Record<string, NavItemDef> = {
  dashboard: { href: "/dashboard", title: "Dashboard", icon: LayoutDashboard, badge: null },
  pos: { href: "/pos", title: "Mesin Kasir (POS)", icon: ShoppingCart, badge: "Utama" },
  orders: { href: "/orders", title: "Antrian Pesanan", icon: BellRing, badge: "Live" },
  // ... semua nav items
};

export const INDUSTRY_NAV_CONFIG: Record<IndustryPack, NavSection[]> = {
  fnb: [
    { section: "Utama", items: ["dashboard", "pos", "products"] },
    { section: "F&B Khusus", items: ["orders", "inventory", "hpp"] },
    { section: "Keuangan", items: ["reports", "expenses", "debts"] },
    { section: "Lainnya", items: ["academy", "settings"] },
  ],
  // ...
};
```

### Penggunaan di AppSidebar:
```typescript
const navSections = INDUSTRY_NAV_CONFIG[activeIndustry] ?? INDUSTRY_NAV_CONFIG.universal;

return navSections.map((section) => (
  <div key={section.section}>
    <p className="nav-section-label">{section.section}</p>
    {section.items.map((itemKey) => {
      const item = NAV_ITEM_REGISTRY[itemKey];
      if (!item) return null;
      const access = checkRouteAccess({ pathname: item.href, role, tier, industry, isTrial });
      return <NavLink key={itemKey} item={item} isLocked={!access.allowed} />;
    })}
  </div>
));
```

---

## 8. Library Stack

### Yang Sudah Ada (JANGAN duplikat):
- `recharts` — charts & grafik
- `date-fns` — manipulasi tanggal
- `lucide-react` — icons
- `sonner` — toast notifications
- `class-variance-authority` + `clsx` + `tailwind-merge` — styling utilities
- `@radix-ui/*` — headless UI primitives

### Yang Perlu Ditambahkan:
```bash
# Form management & validation
npm install react-hook-form @hookform/resolvers zod

# Server state management
npm install @tanstack/react-query @tanstack/react-query-devtools

# Client state management (cart, UI state)
npm install zustand

# Excel/CSV export
npm install xlsx

# Drag & drop (product ordering, table layout)
npm install @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities

# QR Code generation (untuk struk digital & table QR)
npm install qrcode
npm install --save-dev @types/qrcode
```

---

## 9. Checklist Pengembangan Fitur Baru

Sebelum submit PR untuk fitur baru:

**Routing & Permission:**
- [ ] Permission didefinisikan di `routePermissions.ts`
- [ ] Nav item ditambah ke `industryConfig.ts` jika perlu
- [ ] Industri yang diizinkan sudah di-set di `allowedIndustries`
- [ ] Route group yang tepat digunakan di `app/`

**Komponen:**
- [ ] Komponen shared di `components/shared/` (bukan di page-specific folder)
- [ ] Komponen industri-spesifik di folder industri yang sesuai
- [ ] Tidak ada coupling `useAuth` di shared component
- [ ] Loading state, empty state, dan error state sudah dihandle

**Data & State:**
- [ ] Firestore queries menggunakan `storeOwnerUid` bukan `user.uid`
- [ ] Data fetching via React Query (bukan useEffect + fetch mentah)
- [ ] Form menggunakan react-hook-form + zod schema
- [ ] Optimistic update jika UX membutuhkan

**UI/UX:**
- [ ] Mobile responsive (test di viewport 375px)
- [ ] `FeatureGate` terpasang untuk fitur berbayar
- [ ] Loading skeleton ada (bukan blank white)
- [ ] Toast sukses/error terpasang untuk aksi penting

---

## 10. Firestore Schema & Koleksi

```
users/{uid}                          # Document: ShopProfile + subscription
  └── categories/{id}               # Kategori produk
  └── products/{id}                 # Produk/menu
  └── transactions/{id}             # Transaksi POS
  └── expenses/{id}                 # Pengeluaran operasional
  └── customers/{id}                # Pelanggan & kasbon
  └── cashiers/{id}                 # Data kasir
  └── rawMaterials/{id}             # Bahan baku (fnb, laundry)
  └── recipes/{id}                  # Resep HPP
  └── orders/{id}                   # Antrian pesanan dapur (fnb)

storeCodes/{code}                    # Flat: mapping kode toko -> ownerUid
subscriptions/{uid}                  # Subscription data
paymentTransactions/{id}             # Riwayat pembayaran
```

> **ATURAN WAJIB:** Semua query Firestore harus scope ke `users/{storeOwnerUid}/...`
> bukan `users/{user.uid}/...`. Gunakan `storeOwnerUid` dari `useAuth()` karena
> kasir anonymous mengakses data milik owner, bukan data milik diri sendiri.

---

## 11. Cookie & Session Management

Dua cookie yang dikelola sistem:

| Cookie | Tipe | Konten | Digunakan di |
|---|---|---|---|
| `__session` | httpOnly, secure | Firebase ID Token | API routes, proxy |
| `__plan` | readable, encoded | `{role, tier, industry, isTrial, isActive}` | proxy.ts (edge) |

**Cookie `__plan` wajib di-refresh saat:**
1. User login pertama kali (Google Sign-In)
2. User memilih industri di `/onboarding`
3. User upgrade plan berhasil
4. User switch mode owner ↔ cashier
5. Trial berakhir / plan expired

`__plan` cookie bukan sensitive data — tidak mengandung token auth.
Hanya berisi informasi plan untuk keputusan routing di edge.

---

## 12. Referensi File Utama

| File | Fungsi |
|---|---|
| `src/proxy.ts` | Edge middleware routing — pintu masuk utama |
| `src/lib/routePermissions.ts` | Permission matrix Role × Tier × Industry |
| `src/types/index.ts` | Semua TypeScript types termasuk IndustryPack |
| `src/data/subscriptionPlans.ts` | INDUSTRY_METADATA, plan pricing, fitur list |
| `src/context/AuthContext.tsx` | Global auth & subscription state |
| `src/services/firestore.ts` | Semua operasi Firestore |
| `src/components/common/FeatureGate.tsx` | UI-level access control |
| `src/components/layout/AppSidebar.tsx` | Navigasi sidebar (akan jadi dynamic) |
| `src/lib/industryConfig.ts` | *(NEW)* Nav config per industri |
| `src/app/onboarding/page.tsx` | *(NEW)* Halaman pemilihan jenis bisnis |
| `src/components/shared/` | *(NEW)* Semua shared components |

---

## 13. SOP Pembangunan Halaman/Modul Industri Spesifik

Saat membuat halaman fitur spesifik industri (misal: \/appointments\ untuk Salon, atau \/purchase-orders\ untuk Retail), **WAJIB** mengikuti arsitektur modular yang sama dengan modul inti (seperti \/expenses\ atau \/settings\).

### 1. Struktur Folder Modular
Jangan membuat file \page.tsx\ yang membengkak > 400 baris. Pecah menjadi struktur berikut:
\\\
app/(app)/(nama_industri)/[nama_fitur]/
+-- page.tsx                   # Hanya bertugas sebagai wrapper, Data Fetching (State), dan Tabs/Layout
\\\
\\\
src/components/[nama_industri]/[nama_fitur]/
+-- [Fitur]DataTable.tsx       # (Jika ada list) Render daftar data menggunakan shared DataTable
+-- [Fitur]Modals.tsx          # Berisi semua Modal Dialog (Add, Edit, Delete)
+-- tabs/[Nama]Tab.tsx         # (Jika menggunakan Tabs) Pemisahan UI per tab
\\\

### 2. Standar Form & Validasi
- **WAJIB** menggunakan \eact-hook-form\ dikombinasikan dengan \@hookform/resolvers/zod\.
- **WAJIB** menggunakan \zod\ untuk mendefinisikan skema validasi sebelum data dikirim ke state/Firebase.
- Input nominal finansial **WAJIB** menggunakan komponen \CurrencyInput\ dari \src/components/shared/forms/CurrencyInput.tsx\ untuk menjaga presisi angka dan format Rupiah.

### 3. Standar Tabel
- Gunakan komponen \DataTable\ dari \src/components/shared/data-display/DataTable.tsx\ untuk semua daftar data (tabel).
- Definisikan *columns* (bertipe \ColumnDef<T>\) di dalam komponen tabel secara terpisah dari \page.tsx\.

### 4. Standar State & Firestore
- Selalu gunakan \storeOwnerUid\ dari \useAuth()\ untuk setiap query Firebase.
- Pisahkan logika Firebase API (get, add, update, delete) ke dalam \src/services/firestore.ts\ jika dipakai secara global, atau buat file \src/services/[nama_industri]Firestore.ts\ khusus untuk fitur industri yang kompleks.

### 5. Pengecekan Akhir
- Jalankan \
px tsc --noEmit\ setiap kali selesai membuat halaman baru untuk memastikan tidak ada konflik tipe props atau skema data antar komponen.
