# 📦 Dokumen Fitur: Kalkulator HPP Cerdas & Manajemen Stok Presisi

Kelemahan terbesar UMKM sering kali terletak pada ketidaktahuan atas Harga Pokok Penjualan (HPP) sebenarnya dari tiap produk yang dijual, serta kebocoran stok bahan baku. POS UMKM Pro menyediakan kalkulator HPP otomatis berbasis resep dan pelacakan inventori multi-satuan.

---

## 🍳 1. Fitur Kalkulator HPP Berbasis Resep (Recipe BoM)

* **Komposisi Bahan Baku Multi-Satuan**: Tentukan takaran bahan baku dalam gram, mililiter (ml), pcs, lembar, atau porsi (misal: 1 cup Kopi Susu Gula Aren = 18g Kopi Bubuk + 120ml Susu Segar + 25ml Sirup Aren + 1 Cup & Sedotan).
* **Kalkulasi Biaya Pokok Otomatis**: Sistem menghitung total modal per porsi secara riil berdasarkan harga beli bahan baku terbaru.
* **Rekomendasi Harga Jual & Margin**: Masukkan target persentase margin laba kotor (misal 60%), sistem akan menghitung harga jual optimal yang menguntungkan.
* **Simulasi Kenaikan Harga Bahan**: Jika harga susu atau kopi naik di pasaran, ubah harga beli bahan, dan HPP seluruh menu yang memakai bahan tersebut akan terupdate seketika.

---

## 📉 2. Manajemen Stok & Otomasi Potong Bahan Baku

1. **Auto-Deduct Saat Transaksi Kasir**:
   * Setiap kali menu terjual di kasir, stok bahan mentah yang menyusun resep menu tersebut akan terpotong secara otomatis di latar belakang (*real-time inventory deduction*).
2. **Peringatan Stok Menipis (Low Stock Alert)**:
   * Tentukan batas minimum stok (*reorder point*). Sistem akan memberikan notifikasi warna merah dan ringkasan bahan yang harus segera dibeli.
3. **Pencatatan Stok Masuk (Purchase Order / Stock-In)**:
   * Catat pembelian bahan baku dari supplier lengkap dengan harga beli, jumlah, tanggal, dan nama pemasok.
4. **Stock Opname & Penyesuaian Selisih**:
   * Fitur hitung fisik berkala untuk membandingkan stok fisik di gudang dengan catatan sistem, lengkap dengan alasan selisih (rusak, tumpah, kadaluarsa, susut).

---

## 📈 3. Analisis Laba Kotor & Efisiensi Bahan

| Fitur Analisis | Manfaat untuk Pemilik Bisnis |
| :--- | :--- |
| **Gross Profit Margin per Menu** | Mengetahui menu mana yang paling menyumbang laba terbesar (*Menu Engineering: Stars, Plowhorses, Puzzles, Dogs*). |
| **Laporan Pemakaian Bahan Baku** | Mengaudit estimasi pemakaian bahan vs riil untuk mencegah kecurangan atau pemborosan staf. |
| **Nilai Aset Inventori Berjalan** | Mengetahui total nilai rupiah modal yang sedang tertahan dalam bentuk stok di toko/gudang. |

---

## 💡 4. Contoh Studi Kasus: Menu Coffee Shop

```
Menu: Iced Caramel Macchiato (Harga Jual: Rp 28.000)
├── Espresso Blend (18g)    : Rp 3.200
├── Fresh Milk (150ml)      : Rp 3.750
├── Vanilla Syrup (15ml)    : Rp 1.100
├── Caramel Drizzle (10ml)  : Rp   900
└── Cup + Lid + Straw (1set): Rp 1.050
-----------------------------------------
Total HPP / Modal Bersih    : Rp 10.000
Laba Kotor (Gross Profit)   : Rp 18.000 (Margin 64.3%)
```

---

💡 *Dokumen ini merupakan bagian dari spesifikasi resmi modul POS UMKM Pro (umkm.omnifit.cloud).*
