import { AcademyArticle } from "../types";

export const operationsArticles: AcademyArticle[] = [
  {
    id: "mengendalikan-penyusutan-yield-resep",
    title: "Mengendalikan Penyusutan Bahan Baku (Yield Factor) & SOP Dapur",
    categoryId: "operations",
    categoryLabel: "Operasional & Dapur",
    readTime: "6 Menit Baca",
    level: "Menengah",
    iconName: "Layers",
    summary:
      "Daging menyusut saat digoreng, sayur terbuang saat disiangi, minyak terserap makanan. Pelajari cara menghitung Yield Factor agar kalkulasi HPP tidak meleset.",
    keyTakeaways: [
      "Yield Factor adalah persentase berat bersih bahan yang benar-benar bisa disajikan setelah proses pembersihan dan pemasakan.",
      "Selalu hitung HPP berdasarkan berat matang siap saji, bukan berat kotor belanja di pasar.",
      "Gunakan sendok takar, jigger, dan timbangan digital mini di area kasir/barista untuk mencegah kebocoran porsi.",
    ],
    caseStudy: {
      title: "Studi Kasus: Bebek Goreng Kremes Cak Ali",
      scenario:
        "Cak Ali membeli 1 ekor bebek mentah berat 1.200 gram seharga Rp 48.000. Setelah dibersihkan bulu, jeroan, lemak, dan diungkep matang, berat bersih siap goreng menyusut menjadi 720 gram (Yield = 60%).",
      calculation:
        "Jika dibagi 4 porsi: HPP daging per porsi bukan Rp 48.000 / 4 = Rp 12.000, melainkan harus memperhitungkan bumbu ungkep Rp 4.000 + minyak goreng serap Rp 2.000 = HPP riil Rp 18.000 per porsi.",
      lesson:
        "Mengabaikan penyusutan membuat harga jual Anda kemurahan dan keuntungan bisnis bocor tanpa disadari.",
    },
    content: `
### Rumus Menghitung Yield Factor:
$$\\text{Yield Factor (\\%)} = \\left( \\frac{\\text{Berat Bersih Matang Siap Saji}}{\\text{Berat Kotor Saat Beli di Pasar}} \\right) \\times 100\\%$$

### Standar Penyusutan Umum di Industri Kuliner:
- **Daging Ayam / Sapi:** Rata-rata Yield 70% - 75% (menyusut 25-30% saat dimasak/daging melepas air).
- **Sayuran Hijau (Kangkung/Bayam):** Rata-rata Yield 60% - 65% (tangkai tua dan daun layu dibuang).
- **Minyak Goreng Deep Fry:** Rata-rata terserap ke makanan 10% - 15% dari volume penggorengan.

### SOP Mencegah Kebocoran Stok:
1. **Sendok Takar Standar:** Gula cair, sirup, dan saus wajib menggunakan pompa (*pump dispenser*) dengan takaran presisi 10ml atau sendok takar berlabel.
2. **Kartu Stok Bahan Kritis:** Hitung sisa cup, daging, dan bahan utama setiap pergantian shift kasir.
    `,
    actionLink: {
      label: "Cek 101 Template Resep HPP",
      href: "/hpp",
    },
  },

  {
    id: "sop-fifo-manajemen-gudang",
    title: "SOP FIFO (First-In, First-Out) & Cara Mengatasi Kerusakan Barang Kadaluarsa",
    categoryId: "operations",
    categoryLabel: "Operasional & Dapur",
    readTime: "5 Menit Baca",
    level: "Pemula",
    iconName: "ShieldAlert",
    summary:
      "Metode sederhana mengatur rak stok agar bahan baku lama keluar lebih dahulu, meminimalkan kerugian akibat bahan basi atau kadaluarsa.",
    keyTakeaways: [
      "Prinsip FIFO: Barang yang masuk gudang lebih dulu harus digunakan atau dipajang lebih awal.",
      "Tempel stiker tanggal penerimaan barang di setiap wadah / box penyimpanan.",
      "Atur rak dengan menaruh stok baru di baris belakang dan stok lama di baris depan.",
    ],
    caseStudy: {
      title: "Studi Kasus: Bakery Roti Manis Fresh",
      scenario:
        "Toko roti sering membuang 5 kaleng selai dan 3 sak tepung terigu setiap bulan karena kadaluarsa terselip di sudut gudang gelap.",
      calculation:
        "Kerugian terbuang = Rp 850.000/bulan. Setelah menerapkan SOP FIFO dengan stiker warna tanggal masuk, kerugian bahan baku basi turun menjadi Rp 0.",
      lesson:
        "Kedisiplinan tata letak gudang menyelamatkan jutaan rupiah modal kerja usaha Anda.",
    },
    content: `
### 3 Langkah Menerapkan FIFO di Toko:
1. **Labeling Tanggal Masuk:** Tulis tanggal pembelian dengan spidol permanen atau stiker barcode saat barang tiba.
2. **Posisi Depan-Belakang:** Saat merestok, tarik barang lama ke baris depan rak, lalu letakkan barang yang baru dibeli di bagian paling belakang.
3. **Audit Mingguan:** Buat jadwal rutin setiap hari Senin pagi untuk memeriksa masa simpan dan kesegaran bahan baku.
    `,
    actionLink: {
      label: "Cek Stok Produk Toko",
      href: "/products",
    },
  },
];
