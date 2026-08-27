# 🖨️ Dokumen Fitur: Dukungan Hardware, PWA & Cetak Struk Bluetooth

POS UMKM Pro dirancang dengan teknologi Progressive Web App (PWA) modern yang menjamin fleksibilitas perangkat tanpa perlu membeli hardware kasir mahal yang mengunci vendor (*vendor lock-in*).

---

## 📱 1. Arsitektur Progressive Web App (PWA)

* **Install Tanpa Google Play Store / App Store**: Cukup buka website `https://umkm.omnifit.cloud` di Google Chrome, Safari, atau Edge, lalu klik *"Install App"* / *"Add to Home Screen"*.
* **Tampilan Fullscreen Layaknya Native App**: Aplikasi berjalan tanpa address bar browser, memberikan pengalaman kasir yang mulus, cepat, dan responsif.
* **Offline-Resilient Mode**: Saat internet tiba-tiba tidak stabil, kasir tetap dapat memproses pesanan dan data akan tersinkronisasi otomatis begitu koneksi internet pulih.
* **Ringan & Hemat Memori**: Tidak membebani kapasitas memori HP/Tablet kasir (ukuran cache < 15MB).

---

## 🖨️ 2. Dukungan Hardware & Printer Thermal

```
┌────────────────────────────────────────────────────────┐
│                   POS UMKM Pro Core                    │
└─────────────────────────┬──────────────────────────────┘
                          │
       ┌──────────────────┼──────────────────┐
       ▼                  ▼                  ▼
┌──────────────┐   ┌──────────────┐   ┌──────────────┐
│  Bluetooth   │   │  USB / OTG   │   │  Direct ESC  │
│ 58mm & 80mm  │   │ Barcode/Print│   │  POS Protocol│
└──────────────┘   └──────────────┘   └──────────────┘
```

1. **Bluetooth Thermal Printer (Kertas 58mm & 80mm)**:
   * Langsung terhubung via Web Bluetooth API di Chrome/Android atau dialog cetak sistem di iOS/Windows.
   * Kompatibel dengan semua merk printer thermal mini (misal: Panda, Iware, Eppos, VSC, Mini POS 5802, dsb).
2. **Barcode Scanner (Kamera & USB/Laser)**:
   * **Kamera Bawaan**: Gunakan kamera smartphone atau webcam tablet untuk memindai barcode EAN-13, UPC, Code 128, dan QR Code.
   * **USB / Wireless Barcode Scanner Gun**: Plug and Play tanpa perlu install driver tambahan.
3. **Laci Kas Otomatis (RJ11 Cash Drawer)**:
   * Terbuka otomatis (*auto-kick*) setiap transaksi selesai saat terhubung ke printer thermal via kabel RJ11.

---

## 🧾 3. Kustomisasi Desain Struk Belanja

Pemilik toko dapat mempersonalisasi format struk yang dicetak:
* **Header Struk**: Logo toko, nama usaha, alamat cabang, nomor telepon, dan akun Instagram.
* **Body Struk**: Rincian item, jumlah, harga satuan, variasi pesanan, diskon item, dan subtotal.
* **Footer Struk**: Pesan terima kasih, ketentuan retur barang, info password Wi-Fi toko, dan QR Code website/Instagram.
* **Mode Struk Dapur / Kitchen Slip**: Cetak pesanan tanpa mencantumkan harga khusus untuk kru barista / koki di dapur.

---

💡 *Dokumen ini merupakan bagian dari spesifikasi resmi modul POS UMKM Pro (umkm.omnifit.cloud).*
