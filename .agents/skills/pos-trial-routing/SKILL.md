---
name: pos-trial-routing
description: >
  Panduan teknis untuk sistem Trial 30 Hari di POS UMKM Pro.
  Gunakan skill ini saat memodifikasi logika akses trial, menambah/mengubah
  route permissions, atau membangun komponen terkait status trial.
---

# Skill: Trial Routing & Access Control (30 Hari)

## 1. Kebijakan Trial

- **Durasi**: 30 hari sejak registrasi pertama
- **Scope**: Akses seluruh fitur PRO dari **industri yang dipilih saat onboarding** saja
- **Batasan**: User trial TIDAK dapat akses fitur industri lain (industry-gated tetap berlaku)
- **Setelah expire**: Akses kembali ke Basic — hanya `/pos` dan `/products`

---

## 2. Cookie & State Trial

Cookie `__plan` berisi field:
```json
{
  "role": "owner",
  "tier": "basic",
  "industry": "laundry",
  "isTrial": true,
  "isActive": true,
  "trialStartedAt": 1724000000000,
  "trialEndsAt": 1726592000000
}
```

Di `AuthContext`, trial dihitung:
```typescript
const trialDaysLeft = isTrial
  ? Math.max(0, Math.ceil((trialEndsAt - Date.now()) / 86400000))
  : 0;
const isTrialExpired = isTrial && trialDaysLeft <= 0;
const isTrialActive = isTrial && trialDaysLeft > 0;
```

---

## 3. Logic Akses di checkRouteAccess()

Alur evaluasi yang benar untuk trial:

```typescript
// src/lib/routePermissions.ts

export interface RoutePermissionRule {
  isPublic?: boolean;
  requiresAuth?: boolean;
  allowedRoles?: UserRole[];
  allowedTiers?: SubscriptionTier[];
  allowedIndustries?: IndustryPack[];
  trialAllowed?: boolean;  // ← FIELD BARU: apakah fitur ini boleh diakses saat trial
  featureName?: string;
  featureDescription?: string;
}

export function checkRouteAccess({ pathname, role, tier, industry, isTrial, isActive }): AccessCheckResult {
  const rule = getRoutePermission(pathname);
  if (!rule) return { allowed: true };

  // 1. Cek role
  // ... (existing)

  // 2. Trial active → berikan akses PRO hanya untuk industri sendiri
  if (isTrial && rule.trialAllowed !== false) {
    // Trial masih bisa di-block oleh industry mismatch
    if (rule.allowedIndustries && !rule.allowedIndustries.includes(industry)) {
      return { allowed: false, reason: "industry_mismatch", ... };
    }
    return { allowed: true }; // Trial: lewati tier check, langsung allowed
  }

  // 3. Cek tier (untuk non-trial)
  // ... (existing)

  // 4. Cek industry (untuk non-trial non-enterprise)
  // ... (existing)
}
```

---

## 4. Trial Access Matrix (30 Hari)

Tambahkan field `trialAllowed: true` pada semua route PRO di `ROUTE_PERMISSIONS`:

| Route | `trialAllowed` | Keterangan |
|---|---|---|
| `/dashboard` | `true` | Boleh akses saat trial |
| `/reports` | `true` | Boleh akses saat trial |
| `/expenses` | `true` | Boleh akses saat trial |
| `/debts` | `true` | Boleh akses saat trial |
| `/academy` | `true` | Boleh akses saat trial |
| `/hpp` | `true` | Boleh akses saat trial |
| `/inventory` | `true` | Boleh akses saat trial (jika industri sesuai) |
| `/orders` | `true` | Boleh, tapi tetap industry-check FnB |
| `/barista-queue` | `true` | Boleh, tapi tetap industry-check CoffeeShop |
| `/appointments` | `true` | Boleh, tapi tetap industry-check Salon |
| `/weight-pricing` | `true` | Boleh, tapi tetap industry-check Laundry |
| `/purchase-orders` | `true` | Boleh, tapi tetap industry-check Retail |

---

## 5. Komponen UI Terkait Trial

### TrialCountdownBanner (wajib ada di AppSidebar atau TopBar)

```tsx
// src/components/common/TrialCountdownBanner.tsx
// Tampilkan sisa hari trial dengan visual yang jelas

interface TrialCountdownBannerProps {
  daysLeft: number;
}

// Tampilan saat daysLeft > 7: Info (biru)
// Tampilan saat daysLeft 1–7: Warning (amber)
// Tampilan saat daysLeft 0: Danger/Expired (merah) + CTA upgrade
```

### Lokasi pemasangan:
- Di `src/components/layout/AppSidebar.tsx` — bagian bawah sidebar
- Di `src/components/layout/DashboardLayout.tsx` — sebagai top banner (opsional)

---

## 6. Halaman Trial Expired (`/upgrade`)

Saat trial berakhir, user yang mencoba akses fitur PRO diarahkan ke `/upgrade` dengan params:

```
/upgrade?feature=Laporan+Keuangan&from=/reports&reason=trial_expired
```

Halaman `/upgrade` harus menampilkan:
1. Pesan yang relevan berdasarkan `feature` param
2. Harga dan opsi plan untuk industri user (`industry` dari cookie)
3. Tombol "Pilih Plan" yang langsung ke pembayaran

---

## 7. Checklist Implementasi Trial

- [ ] Field `trialAllowed` ditambahkan ke `RoutePermissionRule` interface
- [ ] `checkRouteAccess()` diupdate untuk handle trial logic
- [ ] Semua route PRO sudah memiliki `trialAllowed: true`
- [ ] `AuthContext` mengekspos `trialDaysLeft` dan `isTrialActive`
- [ ] `TrialCountdownBanner` terpasang di sidebar dengan 3 state visual
- [ ] Halaman `/upgrade` bisa terima param `?feature=...&reason=trial_expired`
- [ ] Cookie `__plan` menyertakan `trialEndsAt` saat user registrasi baru
