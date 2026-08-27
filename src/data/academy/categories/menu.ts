import { AcademyArticle } from "../types";

export const menuArticles: AcademyArticle[] = [
  {
    id: "trik-menu-engineering-bundling",
    title: "Trik Menu Engineering: Bundling & Upselling untuk Menaikkan AOV 30%",
    categoryId: "menu",
    categoryLabel: "Menu & Penjualan",
    readTime: "7 Menit Baca",
    level: "Menengah",
    iconName: "ShoppingBag",
    summary:
      "Tingkatkan omzet harian toko bukan dengan mencari ribuan pelanggan baru, melainkan dengan menaikkan nominal belanja per transaksi (Average Order Value) lewat paket hemat cerdas.",
    keyTakeaways: [
      "Kombinasikan Produk Margin Rendah (Favorit Pelanggan) dengan Produk Margin Tinggi (Minuman / Pelengkap).",
      "Pelatih kasir untuk menawarkan upselling kalimat positif (misal: 'Tambah es teh jumbo hanya tambah Rp 3.000 kak?').",
      "Paket bundling menciptakan ilusi hemat di mata pelanggan sekaligus melipatgandakan margin kotor toko.",
    ],
    caseStudy: {
      title: "Studi Kasus: Kedai Mie Pedas Barokah",
      scenario:
        "Rata-rata pelanggan hanya membeli 1 porsi Mie Pedas seharga Rp 15.000 (HPP Rp 9.000, profit Rp 6.000). Rata-rata transaksi = Rp 15.000.",
      calculation:
        "Dibuat Menu Paket Hemat: Mie Pedas + Pangsit Goreng + Es Lemon Tea seharga Rp 24.000. HPP total = Rp 12.000, profit = Rp 12.000 (naik 100%!). 60% pelanggan memilih paket hemat, menaikkan AOV harian dari Rp 15.000 menjadi Rp 21.000.",
      lesson:
        "Bundling memindahkan fokus pelanggan dari harga satuan ke persepsi kelengkapan paket yang menguntungkan kedua belah pihak.",
    },
    content: `
### Cara Menerapkan Paket Bundling Juara:
1. **Analisis Menu Anda:**
   - **Menu Magnet (Penyumbang Omzet):** Biasanya makanan berat dengan margin sedang (30-40%).
   - **Menu Profit (Penyumbang Laba):** Minuman, gorengan, side-dish dengan margin sangat tinggi (60-80%).
2. **Gabungkan Keduanya Menjadi 1 Paket Menarik:**
   - Contoh: Burger (Rp 20.000) + Kentang (Rp 12.000) + Soda (Rp 8.000) = Total normal Rp 40.000.
   - Buat Paket Combo: **Rp 34.000** (Pelanggan merasa hemat Rp 6.000, namun toko berhasil menjual 3 barang sekaligus dalam 1 struk!).
3. **Teknik Upselling Kasir yang Efektif:**
   - Jangan tanya: *"Mau minum apa?"* (Jawaban sering: *"Air putih saja"*).
   - Tanyakan: *"Makanannya mau dipaketkan dengan Es Jeruk Manis segar kak? Cuma selisih Rp 4.000 saja."*
    `,
    actionLink: {
      label: "Kelola Produk & Paket di POS",
      href: "/products",
    },
  },

  {
    id: "matriks-menu-stars-plowhorses-dogs",
    title: "Matriks Menu Engineering: Membedah Menu Bintang (Stars) & Menu Beban (Dogs)",
    categoryId: "menu",
    categoryLabel: "Menu & Penjualan",
    readTime: "6 Menit Baca",
    level: "Mahir",
    iconName: "PieChart",
    summary:
      "Gunakan Matrix Boston Consulting Group (BCG) untuk mengkategorikan menu toko Anda: mana yang harus dipertahankan, mana yang harus dinaikkan harganya, dan mana yang harus dihapus.",
    keyTakeaways: [
      "Stars (Laris & Margin Tinggi): Pertahankan kualitas dan jadikan menu unggulan nomor 1.",
      "Plowhorses (Laris tapi Margin Tipis): Naikkan harga sedikit atau kurangi porsi takaran agar margin membaik.",
      "Puzzles (Kurang Laris tapi Margin Tinggi): Promosikan lebih gencar di kasir dan sosmed.",
      "Dogs (Kurang Laris & Margin Tipis): Hapus segera dari buku menu untuk memangkas modal bahan mati.",
    ],
    caseStudy: {
      title: "Studi Kasus: Resto Bakmi & Dimsum",
      scenario:
        "Memiliki 45 menu yang membingungkan pengunjung dan membuat stok bahan dapur sering busuk.",
      calculation:
        "Setelah dianalisis di POS: 12 menu 'Dogs' yang hanya terjual 2 porsi/bulan dihapus. Biaya bahan baku dapur turun 18% dan kecepatan pelayanan dapur meningkat 2x lipat.",
      lesson:
        "Buku menu yang terlalu tebal bukan tanda resto hebat, melainkan sumber pemborosan stok dan keraguan pembeli.",
    },
    content: `
### 4 Kuadran Matriks Menu:
1. **Stars ⭐ (Bintang):** Popularitas Tinggi + Margin Laba Tinggi. (Contoh: Kopi Susu Gula Aren, Es Teh Manis).
2. **Plowhorses 🐴 (Kuda Pekerja):** Popularitas Tinggi + Margin Laba Rendah. (Contoh: Nasi Ayam Goreng dada utuh).
3. **Puzzles 🧩 (Teka-Teki):** Popularitas Rendah + Margin Laba Tinggi. (Contoh: Minuman Mocktail Spesial).
4. **Dogs 🐶 (Beban):** Popularitas Rendah + Margin Laba Rendah. (Hapus segera!).
    `,
    actionLink: {
      label: "Cek Laporan Penjualan Produk",
      href: "/reports",
    },
  },
];
