import { AcademyArticle } from "../types";

export const pricingArticles: AcademyArticle[] = [
  {
    id: "seni-pricing-cost-plus-vs-value",
    title: "Seni Pricing: Cost-Plus, Value-Based & Psikologi Angka (Charm Pricing)",
    categoryId: "pricing",
    categoryLabel: "Strategi Harga",
    readTime: "7 Menit Baca",
    level: "Pemula",
    iconName: "Tag",
    summary:
      "Cara menentukan harga jual yang tepat agar tidak terjebak perang harga murah dan mampu menghasilkan margin keuntungan yang tebal dan berkelas.",
    keyTakeaways: [
      "Cost-Plus Pricing: Modal HPP dibagi (1 - Target Margin %), bukan hanya ditambah margin tipis.",
      "Value-Based Pricing: Menetapkan harga berdasarkan nilai kepuasan, kenyamanan, atau gengsi yang dirasakan pembeli.",
      "Charm Pricing (angka 9 / 900) terbukti secara psikologis menaikkan konversi hingga 24%.",
    ],
    caseStudy: {
      title: "Studi Kasus: Es Cokelat Premium Mbak Rina",
      scenario:
        "Mbak Rina membuat es cokelat kental dengan HPP Rp 7.000. Kompetitor menjual Rp 10.000 (margin hanya Rp 3.000). Mbak Rina mengganti gelas cup bening biasa dengan gelas tebal berstiker estetik, menambahkan 1 pcs roti sobek panggang, dan menjualnya Rp 18.000.",
      calculation:
        "HPP baru (minuman + roti + cup stiker) = Rp 9.500. Harga Jual = Rp 18.000. Keuntungan per porsi = Rp 8.500 (naik hampir 3x lipat dibanding jika perang harga Rp 10.000!).",
      lesson:
        "Pelanggan tidak hanya membeli bahan baku, tetapi membeli pengalaman dan kemasan. Tingkatkan persepsi nilai agar bisa menjual dengan margin tebal.",
    },
    content: `
### 3 Metode Menentukan Harga Jual:

#### 1. Cost-Plus Pricing (Berdasarkan HPP):
Gunakan rumus markup target margin yang benar:
$$\\text{Harga Jual} = \\frac{\\text{Total HPP per Porsi}}{1 - \\text{Target Margin (misal 50%)}} = \\frac{\\text{HPP}}{0.5} = \\text{HPP} \\times 2$$
Jika HPP bahan + kemasan Anda Rp 10.000, dengan target margin 50%, harga jual ideal adalah **Rp 20.000**.

#### 2. Value-Based Pricing (Berdasarkan Nilai):
Jika tempat Anda ber-AC, memiliki wifi kencang, tempat duduk nyaman, dan kemasan higienis, Anda dapat menetapkan harga di atas rata-rata pasar karena pelanggan membayar kenyamanan.

#### 3. Psikologi Angka (Charm Pricing):
Otak manusia membaca angka dari kiri ke kanan.
- Harga **Rp 19.900** dirasakan sebagai harga belasan ribu (murah), padahal hanya selisih Rp 100 dari **Rp 20.000**.
- Gunakan angka ganjil (9, 7, 5) untuk menu reguler guna meningkatkan daya tarik visual.
    `,
    actionLink: {
      label: "Buka Kalkulator HPP & Margin",
      href: "/hpp",
    },
  },

  {
    id: "rumus-promo-ojol-tanpa-boncos",
    title: "Rumus Diskon & Komisi Aplikasi Ojol (GoFood/Grab/ShopeeFood) Tanpa Boncos",
    categoryId: "pricing",
    categoryLabel: "Strategi Harga",
    readTime: "6 Menit Baca",
    level: "Menengah",
    iconName: "Percent",
    summary:
      "Kenapa ikut promo diskon 25% atau komisi merchant 20% seringkali membuat pengusaha tekor? Pelajari formula mark-up harga khusus aplikasi online.",
    keyTakeaways: [
      "Aplikasi ojek online mengenakan komisi merchant rata-rata 20% dari harga jual aplikasi.",
      "Harga jual di aplikasi online wajib di-markup sebesar 25% dari harga dine-in agar keuntungan bersih sama.",
      "Diskon promo tanpa perhitungan volume penjualan yang matang akan langsung memangkas 50-70% laba bersih Anda.",
    ],
    caseStudy: {
      title: "Studi Kasus: Warung Ayam Geprek Mas Agus",
      scenario:
        "Harga dine-in Rp 20.000 (HPP Rp 12.000, profit Rp 8.000). Mas Agus memasang harga yang sama persis Rp 20.000 di GoFood dengan komisi 20% dan diskon promo 10%.",
      calculation:
        "Harga setelah diskon = Rp 18.000. Dipotong komisi 20% (Rp 3.600), uang yang diterima Mas Agus hanya Rp 14.400. Setelah dipotong HPP Rp 12.000, sisa profit Mas Agus hanya Rp 2.400 (turun 70%!). Mas Agus harus menggoreng 3,3x lipat ayam lebih banyak untuk mendapatkan keuntungan yang sama!",
      lesson:
        "Selalu gunakan harga khusus aplikasi online (Mark-up 25%) sebelum menerapkan promo diskon merchant.",
    },
    content: `
### Rumus Mark-Up Harga Aplikasi Online (Komisi 20%):
Agar Anda menerima uang bersih yang sama dengan harga kasir toko (dine-in):
$$\\text{Harga Online} = \\frac{\\text{Harga Dine-in}}{1 - 0.20} = \\frac{\\text{Harga Dine-in}}{0.80} = \\text{Harga Dine-in} \\times 1.25$$

**Contoh:**
- Harga Kasir Toko: Rp 20.000
- Harga di Menu Aplikasi: $\\text{Rp } 20.000 \\times 1.25 =$ **Rp 25.000**
- Saat dipotong komisi 20% (Rp 5.000), Anda tetap menerima **Rp 20.000 bersih** ke rekening toko!
    `,
    actionLink: {
      label: "Uji di Simulator Promo",
      href: "/academy",
    },
  },

  {
    id: "trik-decoy-pricing",
    title: "Trik Decoy Pricing: Mengarahkan Pembeli Memilih Ukuran Jumbo / Large",
    categoryId: "pricing",
    categoryLabel: "Strategi Harga",
    readTime: "5 Menit Baca",
    level: "Mahir",
    iconName: "TrendingUp",
    summary:
      "Bagaimana bioskop dan kedai kopi waralaba membuat pelanggan rela membeli ukuran Large dengan trik harga umpan (Decoy Effect).",
    keyTakeaways: [
      "Decoy Pricing adalah strategi memasang opsi perantara yang sengaja dibuat kurang bernilai agar opsi paling mahal terlihat sangat murah.",
      "Biaya penambahan ukuran dari Regular ke Large biasanya hanya cup dan sedikit es (HPP bertambah sangat sedikit, tapi harga jual naik signifikan).",
      "Menaikkan porsi penjualan ukuran Large melipatgandakan margin bersih toko.",
    ],
    caseStudy: {
      title: "Studi Kasus: Kedai Kopi Kenangan Manis",
      scenario:
        "Awalnya hanya ada 2 ukuran: Small (Rp 15.000) dan Large (Rp 25.000). 85% pembeli memilih Small.",
      calculation:
        "Pemilik menambahkan ukuran Medium seharga Rp 22.000 sebagai 'Decoy'. Pelanggan berpikir: 'Cuma tambah Rp 3.000 dapat yang Large jumbo!'. Hasilnya: 70% pembeli beralih ke Large Rp 25.000. Omzet naik 35% tanpa menambah jumlah pengunjung.",
      lesson:
        "Pelanggan tidak tahu nilai absolut suatu barang, mereka selalu membandingkan opsi yang disajikan di depan mata.",
    },
    content: `
### Cara Menerapkan Decoy Pricing pada Menu Anda:
1. **Opsi Small (Ukuran Standar):** Rp 15.000 (HPP Rp 6.000).
2. **Opsi Medium (Umpan / Decoy):** Rp 22.000 (HPP Rp 7.500) -> sengaja dipasang dekat dengan harga Large.
3. **Opsi Large (Target Jual Utama):** Rp 25.000 (HPP Rp 8.000).
    `,
    actionLink: {
      label: "Buka HPP & Simulasi Menu",
      href: "/hpp",
    },
  },
];
