# 🛒 Panduan Modul Industri Retail, Minimarket & Grosir

Panduan operasional POS UMKM Pro untuk Minimarket, Toko Kelontong, Toko Sembako, Frozen Food, Toko Fashion, dan Grosir.

---

## 🌟 Fitur Unggulan Modul Retail
1. **Barcode Scanner Cepat**: Memindai barcode produk EAN-13, UPC, atau Code-128 langsung melalui kamera smartphone atau scanner barcode USB laser.
2. **Harga Grosir Bertingkat (Tiered Pricing)**: Penyesuaian harga jual otomatis berdasarkan jumlah kuantitas beli (contoh: Beli 1 pcs Rp 10.000, Beli >= 10 pcs Rp 9.000, Beli >= 1 dus Rp 8.200).
3. **Peringatan Stok Minimum & Kadaluarsa (Expired Alert)**: Notifikasi real-time untuk mencegah kehabisan barang dagangan laris dan memantau tanggal kadaluarsa makanan.

---

## 📋 Langkah Penggunaan

### 1. Mendaftarkan Barcode Produk di Inventori (`/inventory`)
1. Buka menu **Inventori** (`/inventory`) lalu klik **Tambah Produk**.
2. Masukkan nama barang (misal: *Minyak Goreng 2L*).
3. Klik ikon kamera barcode di sebelah kolom Barcode SKU, lalu arahkan kamera ke barcode kemasan produk untuk input otomatis.
4. Simpan produk.

### 2. Transaksi Kasir Menggunakan Barcode Scanner (`/pos`)
1. Di layar POS, tekan tombol **"Scan Barcode"** atau langsung tembakkan scanner USB/Bluetooth ke kemasan barang.
2. Produk akan langsung masuk ke keranjang belanja dengan suara konfirmasi bip.
3. Tambahkan kuantitas barang; jika kuantitas memenuhi syarat harga grosir, harga per unit akan terdiskon otomatis.

### 3. Memeriksa Laporan Stok Menipis & Kadaluarsa
1. Masuk ke tab **Stok Kritis** pada menu Inventori.
2. Sistem akan menampilkan daftar produk yang stok fisiknya berada di bawah batas minimum (*Reorder Point*) agar Anda dapat segera memesan ulang ke pemasok (supplier).
