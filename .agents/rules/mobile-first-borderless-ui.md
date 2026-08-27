# Rule: Mobile-First Borderless & Tactile UI Standards

Aturan ini bersifat **WAJIB** untuk setiap pembuatan, modifikasi, dan penyempurnaan antarmuka (UI) di POS UMKM Pro pada seluruh industri, halaman, dan komponen pendukung.

---

## M1. Borderless & Soft Elevation Philosophy
- Pada layar mobile (`< 640px` / `sm`), **HINDARI** penggunaan border kaku `border border-slate-300` yang membuat antarmuka tampak seperti formulir birokrasi kaku.
- Gunakan surface cards borderless: `border border-slate-200/50 bg-white/90 backdrop-blur-md` dengan sudut melengkung modern `rounded-2xl` atau `rounded-3xl` dan soft shadow `shadow-2xs` / `shadow-sm`.
- Gunakan *background layering* yang kontras dan nyaman di mata (canvas `bg-slate-50/70` dipadukan dengan floating cards `bg-white` beraksen warna industri).

---

## M2. Thumb-Zone Ergonomics & Bottom Clearance
- Semua tombol aksi utama (*Primary Actions*) pada perangkat mobile HARUS berada dalam jangkauan satu jempol bawah (*bottom-anchored*).
- Elemen melayang (*Floating Action Bar / Cart Summary*) **WAJIB** menggunakan safe-area offset:
  `bottom-[calc(3.75rem+env(safe-area-inset-bottom)+0.625rem)]`
  agar melayang secara proporsional di atas `MobileBottomNav`.
- Main content container pada layout **WAJIB** menyertakan clearance padding:
  `pb-28 sm:pb-32 md:pb-8`
  sehingga kartu, tombol, maupun footer terbawah tidak pernah tertutup oleh navbar bawah.

---

## M3. Native Touch Interaction & Micro-Delights
- Setiap tombol, tab, kartu produk, dan link yang dapat disentuh **WAJIB** menggunakan class `.touch-press` (`active:scale-95 transition-transform duration-100 ease-out`).
- Dialog modal pada layar mobile **HARUS** bertransformasi menjadi `.bottom-sheet` melengkung anggun dari bawah layar dengan drag handle, bukan popup kaku di tengah layar.
- Navigasi kategori dan filter horizontal **WAJIB** berupa swipeable pill row (`.pill-nav` + `.pill-nav-item`) tanpa scrollbar yang mengganggu.

---

## M4. Vibrant Industry Branding & Micro-Typography
- Terapkan aksen warna tematik per industri yang hidup dan elegan:
  - **Coffee Shop & Cafe**: Warm Bronze & Amber (`amber-700` / `amber-800` / `#8B5E3C`)
  - **Kuliner / FnB**: Emerald Green & Saffron (`emerald-600` / `amber-500`)
  - **Retail & Minimarket**: Electric Blue & Indigo (`blue-600` / `indigo-600`)
  - **Salon & Barbershop**: Royal Purple & Rose (`purple-600` / `rose-500`)
  - **Laundry & Kiloan**: Fresh Cyan & Teal (`teal-600` / `cyan-600`)
  - **Universal**: Emerald & Slate (`emerald-600` / `slate-900`)
- Tampilkan badge status berbentuk pill rounded-full dengan background transparan lembut (misal `bg-emerald-500/10 text-emerald-700 border border-emerald-500/20`).
- Format mata uang selalu rapi dengan helper `formatRupiah()` dan angka tebal tegas (`font-black` / `font-extrabold`).
