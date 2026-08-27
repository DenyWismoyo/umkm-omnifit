# ☕ Panduan Modul Industri Kedai Kopi & Cafe (Coffee Shop)

Panduan operasional POS UMKM Pro untuk Kedai Kopi, Cafe, Minuman Kekinian (Boba/Tea), dan Dessert Bar.

---

## 🌟 Fitur Unggulan Modul Coffee Shop
1. **Layar Antrian Barista Real-Time (`/barista-queue`)**: Display khusus barista yang menampilkan rincian modifikasi minuman (*Level Sugar, Level Ice, Extra Shot, Oatmilk, Topping*).
2. **Kartu Stempel Digital Loyalty (`/loyalty`)**: Program reward "Beli 9 Cup Gratis 1 Cup" berbasis scan QR atau nomor WhatsApp tanpa kartu fisik.
3. **Kalkulator HPP Kopi Presisi (`/recipes`)**: Perhitungan modal biji kopi espresso (gram), susu UHT (ml), sirup perisa (pump/ml), dan packaging per cup.

---

## 📋 Langkah Penggunaan

### 1. Mengoperasikan Layar Antrian Barista (`/barista-queue`)
1. Tempatkan tablet atau smartphone kedua di meja racik barista dan buka menu **Antrian Barista** (`/barista-queue`).
2. Setiap pesanan baru dari kasir akan muncul seketika dengan status **"Menunggu Racik"**.
3. Barista menyentuh pesanan untuk mengubah status menjadi **"Sedang Diseduh"**, lalu **"Siap Disajikan"**.
4. Kasir atau pelayan dapat memanggil nomor antrian pesanan yang siap diambil.

### 2. Menggunakan Kartu Stempel Digital Loyalty (`/loyalty`)
1. Di menu POS, klik tombol **"Loyalty Stamp"** saat melayani pelanggan tetap.
2. Masukkan nomor WhatsApp pelanggan atau scan QR code loyalty miliknya.
3. Sistem secara otomatis menambahkan jumlah stempel (+1 stempel per cup minuman).
4. Saat stempel mencapai angka target (misal: 10 stempel), kasir dapat menekan tombol **"Klaim Minuman Gratis"**.

### 3. Mengatur Resep & Kalkulasi HPP Minuman
1. Buka menu **Resep Kopi** (`/recipes`).
2. Masukkan komponen bahan:
   - *House Blend Coffee Beans*: 18 gram @ Rp 250/gr = Rp 4.500
   - *Fresh Milk*: 120 ml @ Rp 20/ml = Rp 2.400
   - *Palm Sugar Syrup*: 25 ml @ Rp 30/ml = Rp 750
   - *Cup 14oz, Lid & Straw*: Rp 900
3. Sistem menghitung total HPP Modal = Rp 8.550.
4. Tentukan harga jual (misal Rp 18.000) untuk mendapatkan margin laba kotor 52.5%.
