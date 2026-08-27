# 🖨️ Panduan Menghubungkan Printer Struk Thermal

Panduan teknis konfigurasi printer struk Bluetooth & USB (kertas 58mm dan 80mm) di POS UMKM Pro.

---

## 📱 1. Menghubungkan Printer Bluetooth di Smartphone / Tablet (Android & iOS)

### Langkah Koneksi:
1. Nyalakan printer thermal Bluetooth Anda.
2. Masuk ke menu **Pengaturan Bluetooth** di smartphone Anda.
3. Cari perangkat baru (biasanya bernama *RPP02N, MPT-II, POS-58, Bluetooth Printer, dsb*).
4. Klik pasangkan (Pairing). Jika meminta PIN, masukkan `0000` atau `1234`.
5. Buka POS UMKM Pro di browser Google Chrome (Android) atau Safari (iOS).
6. Di menu Kasir POS, lakukan transaksi dan klik tombol **"Cetak Struk Thermal"**.
7. Dialog print browser akan terbuka, pilih printer thermal yang sudah terhubung, atur ukuran kertas ke **58mm** atau **80mm**, lalu klik **Cetak**.

---

## 💻 2. Menghubungkan Printer USB di Laptop / Komputer (Windows & macOS)

### Langkah Koneksi:
1. Hubungkan kabel USB printer thermal ke port USB laptop/PC Anda.
2. Install driver printer thermal bawaan (driver ESC/POS 58mm atau 80mm).
3. Buka **Control Panel > Devices and Printers** di Windows, pastikan printer terdeteksi sebagai *Default Printer* atau *POS Printer*.
4. Buka aplikasi POS UMKM Pro di Chrome / Edge.
5. Saat menekan tombol cetak struk:
   - Pilih nama printer thermal Anda.
   - Atur Margin: *None (Tanpa Margin)*.
   - Hapus centang pada *Headers and Footers*.
   - Klik **Print**.

---

## 💡 Tips & Solusi Masalah Printer:
- **Teks Struk Terpotong di Bagian Kanan**: Pastikan Anda memilih lebar kertas yang sesuai (58mm vs 80mm) di pengaturan printer.
- **Kertas Keluar Polos Tanpa Tulisan**: Pastikan rol kertas thermal tidak terpasang terbalik (sisi mengkilap harus menghadap ke head pemanas printer).
- **Hasil Cetak Buram**: Buka cover printer dan bersihkan bagian sensor pemanas (*thermal printhead*) menggunakan kapas alkohol secara perlahan.
