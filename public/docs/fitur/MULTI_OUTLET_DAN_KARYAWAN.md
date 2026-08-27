# 🏢 Dokumen Fitur: Multi-Outlet, Cabang & Manajemen Hak Akses Karyawan

Bagi bisnis yang sedang berkembang membuka cabang baru atau memiliki beberapa tim kasir dan operasional, POS UMKM Pro menyediakan arsitektur multi-cabang terpusat dan sistem Role-Based Access Control (RBAC) yang aman.

---

## 🏬 1. Fitur Manajemen Multi-Outlet / Multi-Cabang

* **Satu Akun Pusat (Centralized Dashboard)**: Pemilik bisnis dapat memantau performa penjualan seluruh outlet dalam satu layar tanpa perlu login/logout bergantian.
* **Katalog Produk & Harga Fleksibel**:
  * Sinkronisasi master produk ke semua cabang secara instan.
  * Opsi penyesuaian harga khusus per cabang (misal: harga outlet di Mall vs ruko pinggir jalan).
* **Transfer Stok Antar Cabang (Stock Transfer)**:
  * Catat mutasi barang antar outlet dengan sistem *Surat Jalan* dan verifikasi penerimaan di cabang tujuan.
* **Laporan Konsolidasi & Komparasi**:
  * Bandingkan omset, jam ramai, dan produk terlaris antar cabang untuk mengevaluasi strategi bisnis.

---

## 🔐 2. Peran & Hak Akses Karyawan (RBAC Matrix)

Setiap staf memiliki hak akses yang dibatasi sesuai tugasnya demi mencegah manipulasi data kasir dan kerahasiaan keuangan toko:

| Peran (Role) | Akses POS Kasir | Lihat Laporan Keuangan & Laba | Edit Harga & Produk | Buka Laci Kas (Cash Drawer) | Stock Opname & Koreksi |
| :--- | :---: | :---: | :---: | :---: | :---: |
| **Owner (Pemilik)** | ✅ Penuh | ✅ Penuh | ✅ Penuh | ✅ Penuh | ✅ Penuh |
| **Manager Cabang** | ✅ Penuh | ✅ Laporan Cabang | ✅ Terbatas | ✅ Penuh | ✅ Penuh |
| **Kasir (Cashier)** | ✅ Transaksi & Shift | ❌ Tidak Bisa | ❌ Tidak Bisa | ✅ Saat Transaksi | ❌ Tidak Bisa |
| **Kitchen / Barista** | 📋 Layar Antrian Saja | ❌ Tidak Bisa | ❌ Tidak Bisa | ❌ Tidak Bisa | ❌ Tidak Bisa |
| **Kurir / Delivery** | 🚚 Status Antar Saja | ❌ Tidak Bisa | ❌ Tidak Bisa | ❌ Tidak Bisa | ❌ Tidak Bisa |

---

## ⏱️ 3. Audit Log & Keamanan Aktivitas Kasir

1. **Pencegahan Void / Hapus Item Sembarangan**:
   * Setiap penghapusan item yang sudah dimasukkan ke keranjang memerlukan otorisasi PIN Supervisor/Owner.
2. **Log Jejak Transaksi (Audit Trail)**:
   * Sistem mencatat siapa kasir yang melayani, jam transaksi, metode pembayaran, dan riwayat diskon yang diberikan.
3. **Perhitungan Komisi Staf Otomatis**:
   * Untuk industri salon/barbershop atau klinik kecantikan, sistem menghitung komisi layanan stylist per transaksi secara otomatis.

---

💡 *Dokumen ini merupakan bagian dari spesifikasi resmi modul POS UMKM Pro (umkm.omnifit.cloud).*
