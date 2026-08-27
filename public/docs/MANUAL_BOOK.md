# 📘 Buku Panduan Pengguna (Manual Book) POS UMKM Pro

Platform Kasir Point-of-Sale Modern, Manajemen Stok & Kalkulator HPP Cerdas Multi-Industri.

---

## 📑 Daftar Bab
1. [Bab 1: Registrasi & Pengaturan Identitas Toko](#bab-1-registrasi--pengaturan-identitas-toko)
2. [Bab 2: Pemilihan & Penggantian Modul Industri](#bab-2-pemilihan--penggantian-modul-industri)
3. [Bab 3: Manajemen Produk & Stok Inventori](#bab-3-manajemen-produk--stok-inventori)
4. [Bab 4: Penggunaan Mesin Kasir (POS) & Pembayaran](#bab-4-penggunaan-mesin-kasir-pos--pembayaran)
5. [Bab 5: Manajemen Staf Kasir & Shift Keuangan](#bab-5-manajemen-staf-kasir--shift-keuangan)
6. [Bab 6: Kalkulator HPP Resep & Manajemen Pengeluaran](#bab-6-kalkulator-hpp-resep--manajemen-pengeluaran)
7. [Bab 7: Laporan Keuangan & Ekspor Data](#bab-7-laporan-keuangan--ekspor-data)
8. [Bab 8: Masa Trial 30 Hari & Upgrade PRO](#bab-8-masa-trial-30-hari--upgrade-pro)

---

## Bab 1: Registrasi & Pengaturan Identitas Toko

### 1.1 Masuk Akun Pemilik (Owner)
1. Buka peramban (browser) di smartphone atau PC, lalu akses **`https://umkm.omnifit.cloud`**.
2. Klik tombol **"Masuk Akun"** atau **"Mulai Trial 30 Hari Gratis"**.
3. Pilih tab **"Pemilik Toko"** dan klik tombol **"Lanjutkan dengan Google"**.
4. Pilih akun Google Anda. Sistem akan mengautentikasi dan mengarahkan Anda ke halaman **Onboarding**.

### 1.2 Mengisi Formulir Identitas Usaha
Pada halaman Onboarding:
- **Nama Pemilik**: Masukkan nama lengkap penanggung jawab bisnis.
- **Nomor WhatsApp**: Digunakan untuk kontak notifikasi dan pengiriman nota digital.
- **Nama Toko / Bisnis**: Nama yang akan tercetak di bagian atas struk kasir.
- **Alamat Toko**: Lokasi gerai atau toko Anda.

---

## Bab 2: Pemilihan & Penggantian Modul Industri

### 2.1 Memilih Modul Industri Usaha
Pilih salah satu dari 6 modul industri yang tersedia:
1. **Kuliner & Resto (F&B)**: Rumah makan, kafe makanan, warung makan, catering.
2. **Kedai Kopi & Cafe**: Kedai kopi susu, boba, artisan coffee, dessert bar.
3. **Retail & Minimarket**: Toko kelontong, sembako, minimarket, fashion/apparel.
4. **Salon & Barbershop**: Barbershop pria, salon kecantikan, nail art, spa.
5. **Laundry Kiloan**: Laundry kiloan ekspres, cuci satuan, cuci sepatu/karpet.
6. **Universal UMKM**: Toko jasa umum, bengkel, toko ATK, aksesoris.

### 2.2 Modal Konfirmasi & Persetujuan
- Centang kotak pernyataan: *"Saya menyetujui konfigurasi identitas toko dan modul usaha di atas"*.
- Klik **"Konfirmasi & Mulai"**. Sistem akan mengaktifkan seluruh menu sesuai industri Anda.

### 2.3 Mengganti Modul Industri di Kemudian Hari
- Anda dapat mengubah modul usaha kapan saja dengan mengklik foto profil toko di pojok kanan atas, lalu memilih opsi **"Ganti Modul Usaha"** (`/onboarding?edit=true`).

---

## Bab 3: Manajemen Produk & Stok Inventori

### 3.1 Menambahkan Produk Baru
1. Buka menu **Inventori / Produk** (`/inventory`).
2. Klik tombol **"+ Tambah Produk"**.
3. Isi informasi produk:
   - Nama Produk (misal: *Kopi Susu Gula Aren*)
   - Kategori Produk
   - Harga Jual (Rp)
   - Harga Modal / HPP (Rp)
   - Jumlah Stok Awal & Batas Minimum Stok
   - Barcode SKU (opsional untuk retail)
4. Klik **Simpan**.

### 3.2 Pemotongan Stok Atomik Real-time
Setiap kali transaksi diselesaikan di menu POS kasir, sistem serverless **Google Cloud Functions v2** secara otomatis mengurangi jumlah stok produk dan bahan baku secara akurat.

---

## Bab 4: Penggunaan Mesin Kasir (POS) & Pembayaran

### 4.1 Melayani Transaksi Penjualan
1. Buka menu **Kasir POS** (`/pos`).
2. Klik atau sentuh produk untuk memasukkannya ke keranjang belanja.
3. Gunakan fitur pencarian cepat atau scan barcode untuk menemukan barang.
4. Tentukan diskon produk atau diskon nota jika ada.

### 4.2 Metode Pembayaran
- **Tunai (Cash)**: Masukkan jumlah uang tunai yang diterima, sistem akan menghitung uang kembalian secara otomatis.
- **QRIS Dinamis / Statis**: Tampilkan QR code pembayaran QRIS di layar untuk di-scan oleh pembeli.
- **Buku Kasbon / Piutang**: Masukkan nama pelanggan untuk mencatat transaksi belum lunas.
- **Transfer Bank**: Konfirmasi penerimaan mutasi rekening.

### 4.3 Mencetak Struk Kasir
Setelah transaksi sukses, klik tombol **"Cetak Struk Thermal"** (Bluetooth / USB) atau kirim struk digital via **WhatsApp**.

---

## Bab 5: Manajemen Staf Kasir & Shift Keuangan

### 5.1 Kode Toko & PIN Staf
1. Pemilik toko dapat melihat **Kode Toko** unik (contoh: `TK-928410`) di menu Profil atau Pengaturan Staf (`/settings`).
2. Tentukan **PIN Kasir 6-digit** untuk staf kasir Anda.

### 5.2 Alur Kerja Staf Kasir
- Kasir membuka `https://umkm.omnifit.cloud/login`, memilih tab **"Login Kasir"**, memasukkan Kode Toko dan PIN.
- Kasir hanya memiliki akses ke layar transaksi POS, antrian pesanan, dan pencatatan kas shift tanpa bisa melihat laporan laba bersih rahasia pemilik.

---

## Bab 6: Kalkulator HPP Resep & Manajemen Pengeluaran

### 6.1 Menghitung HPP Resep Dinamis
1. Buka menu **Kalkulator HPP** (`/hpp`).
2. Masukkan bahan-bahan baku penyusun produk beserta harga belinya (misal: Biji Kopi 18 gr, Susu UHT 120 ml, Gula Aren 20 ml, Cup & Straw).
3. Sistem secara instan menampilkan:
   - **Total Modal Resep (HPP)**
   - **Saran Harga Jual** berdasarkan target margin profit (misal: Margin 60%).
   - **Estimasi Laba Bersih per Porsi**.

### 6.2 Mencatat Biaya Operasional Toko
- Masukkan pengeluaran harian seperti sewa tempat, listrik, air, gaji harian, dan pembelian kantong plastik di menu **Pengeluaran** (`/expenses`).

---

## Bab 7: Laporan Keuangan & Ekspor Data

1. Buka menu **Laporan & Analitik** (`/reports`).
2. Pilih rentang waktu: Hari Ini, 7 Hari Terakhir, Bulan Ini, atau Kustom.
3. Pantau metrik vital:
   - Total Omzet Kotor & Laba Bersih
   - Produk Terlaris (Best Seller)
   - Metode Pembayaran Terbanyak (Tunai vs QRIS)
4. Klik **Ekspor CSV / PDF** untuk pembukuan akuntansi eksternal.

---

## Bab 8: Masa Trial 30 Hari & Upgrade PRO

- Seluruh akun baru otomatis menikmati **Trial 30 Hari Penuh** dengan akses fitur tak terbatas.
- Setelah masa trial berakhir, Anda dapat melanjutkan menggunakan **Paket PRO** (mulai dari Rp 39.000/bulan) melalui menu **Upgrade Akun** (`/upgrade`) dengan gateway pembayaran QRIS & Virtual Account Mayar.id.
