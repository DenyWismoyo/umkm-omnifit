# 🧺 Panduan Modul Industri Laundry & Dry Cleaning

Panduan operasional POS UMKM Pro untuk Laundry Kiloan, Cuci Satuan (Bedcover, Jas, Gaun), Cuci Sepatu, dan Karpet.

---

## 🌟 Fitur Unggulan Modul Laundry
1. **Kalkulator Timbangan Desimal (`/weight-pricing`)**: Perhitungan tarif kiloan presisi hingga 2 digit di belakang koma (misal: 3.45 kg @ Rp 7.000/kg = Rp 24.150).
2. **Pelacakan 5 Tahap Status Cucian (`/pickup-delivery`)**:
   - *1. Diterima (Received)*
   - *2. Sedang Dicuci (Washing)*
   - *3. Sedang Dikeringkan (Drying)*
   - *4. Sedang Disetrika (Ironing)*
   - *5. Selesai & Siap Diambil / Diantar (Ready / Done)*
3. **Cetak Nota Struk Mini & Label Rak**: Menghasilkan nomor nota unik, estimasi tanggal selesai, catatan wangi parfum, dan posisi rak penyimpanan.

---

## 📋 Langkah Penggunaan

### 1. Menerima Cucian Kiloan di Kasir (`/pos`)
1. Pilih item layanan kiloan (misal: *Cuci Komplit Reguler 2 Hari*).
2. Masukkan berat timbangan aktual (contoh: *4.35 kg*). Sistem langsung mengalikan tarif secara presisi.
3. Pilih opsi parfum (misal: *Lavender / Sakura*) dan catatan khusus pakaian sensitif.
4. Masukkan nama pelanggan dan nomor WhatsApp.

### 2. Mencetak Nota Cucian
1. Selesaikan transaksi (dapat dibayar lunas di awal atau bayar saat cucian selesai diambil).
2. Cetak struk tanda terima untuk pelanggan dan tempelkan salinan nomor nota ke kantong plastik cucian.

### 3. Memperbarui Status Pengerjaan & Serah Terima (`/pickup-delivery`)
1. Buka menu **Status Cucian** (`/pickup-delivery`).
2. Tim produksi menggeser status pakaian dari *Proses Cuci* ke *Setrika* hingga *Siap Diambil*.
3. Saat cucian selesai, kirim pesan WhatsApp otomatis ke pelanggan bahwa cucian siap diambil.
4. Ketika pelanggan mengambil cucian, klik **"Serahkan ke Pelanggan"** dan terima sisa pelunasan jika belum lunas di awal.
