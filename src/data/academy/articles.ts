export interface AcademyArticle {
  id: string;
  title: string;
  category: "finance" | "pricing" | "menu" | "operations" | "customers" | "legal";
  categoryLabel: string;
  readTime: string; // e.g. "5 Menit Baca"
  level: "Pemula" | "Menengah" | "Mahir";
  iconName: string;
  summary: string;
  keyTakeaways: string[];
  caseStudy?: {
    title: string;
    scenario: string;
    calculation: string;
    lesson: string;
  };
  content: string; // Detailed guide content
  actionLink?: {
    label: string;
    href: string;
  };
}

export const ACADEMY_ARTICLES: AcademyArticle[] = [
  // =========================================================================
  // PILAR 1: MANAJEMEN FINANSIAL & ARUS KAS
  // =========================================================================
  {
    id: "memisahkan-rekening-gaji-owner",
    title: "Cara Memisahkan Rekening Usaha vs Pribadi & Menentukan Gaji Owner",
    category: "finance",
    categoryLabel: "Manajemen Keuangan",
    readTime: "5 Menit Baca",
    level: "Pemula",
    iconName: "Wallet",
    summary:
      "Kesalahan fatal 80% UMKM pemula adalah mencampur aduk uang kasir dengan dompet pribadi. Pelajari cara menetapkan gaji pemilik yang sehat tanpa mengorbankan arus kas operasional.",
    keyTakeaways: [
      "Buka rekening bank terpisah khusus untuk seluruh transaksi penjualan dan belanja bahan toko.",
      "Tentukan nominal gaji tetap untuk Anda sendiri setiap bulan, bukan mengambil uang kasir secara sporadis.",
      "Laba bersih yang tersisa adalah milik toko untuk cadangan modal, bukan uang saku pribadi.",
    ],
    caseStudy: {
      title: "Studi Kasus: Warung Kopi Mas Budi",
      scenario:
        "Mas Budi punya omzet Rp 20.000.000/bulan. Karena tidak menggaji diri sendiri, ia sering mengambil uang laci kasir Rp 100.000 - Rp 200.000 setiap hari untuk keperluan rumah tangga. Di akhir bulan, uang belanja bahan baku habis dan ia merasa bisnisnya tidak menghasilkan apa-apa.",
      calculation:
        "Pengambilan acak Rp 150.000/hari = Rp 4.500.000/bulan (tanpa tercatat!). Setelah diubah: Mas Budi menetapkan gaji resmi Rp 3.000.000/bulan yang ditransfer setiap tanggal 1. Toko memiliki surplus kas Rp 1.500.000/bulan untuk modal ekspansi.",
      lesson:
        "Menggaji diri sendiri dengan nominal tetap memberikan kejelasan finansial bagi rumah tangga sekaligus menyehatkan arus kas toko.",
    },
    content: `
### Mengapa Pemisahan Rekening Itu Mutlak?
Banyak pengusaha UMKM merasa tokonya selalu ramai tetapi uangnya selalu habis. Setelah ditelusuri, penyebab utamanya adalah **uang toko dipakai untuk belanja dapur pribadi**, membayar cicilan pribadi, atau jajan keluarga tanpa pembukuan.

### 3 Langkah Praktis Membenahi Keuangan:
1. **Gunakan 2 Rekening Bank Berbeda:**
   - **Rekening Operasional Toko:** Khusus menerima pembayaran QRIS/Transfer pelanggan dan membayar suplier/belanja bahan.
   - **Rekening Pribadi:** Khusus menerima transferan gaji bulanan Anda untuk kebutuhan hidup sehari-hari.
2. **Tentukan Gaji Pemilik Usaha (Owner's Salary):**
   - Hitung kebutuhan hidup minimal bulanan Anda (misal: Rp 3.500.000).
   - Pastikan nominal ini tidak melebihi 20-30% dari rata-rata laba kotor toko.
   - Catat gaji ini sebagai **Beban Pengeluaran Resmi (Gaji Karyawan/Owner)** di menu Pengeluaran Toko.
3. **Disiplin Kasir 100%:**
   - Jika Anda ingin makan/minum produk dari toko sendiri, bayar seperti pelanggan biasa atau catat sebagai kasbon/biaya operasional agar stok dan pencatatan akurat.
    `,
    actionLink: {
      label: "Catat Gaji di Pengeluaran Toko",
      href: "/expenses",
    },
  },

  {
    id: "mengelola-dana-darurat-runway",
    title: "Mengelola Dana Darurat & Menghitung Cash Runway UMKM",
    category: "finance",
    categoryLabel: "Manajemen Keuangan",
    readTime: "6 Menit Baca",
    level: "Menengah",
    iconName: "ShieldCheck",
    summary:
      "Bagaimana memastikan usaha Anda tetap mampu bertahan saat terjadi penurunan omzet drastis atau masa sepi (low season) dengan cadangan kas darurat yang terukur.",
    keyTakeaways: [
      "Standar ideal dana darurat UMKM adalah 3 hingga 6 bulan biaya operasional tetap (Fixed Opex).",
      "Cash Runway mengukur berapa bulan usaha Anda bisa bernapas jika terjadi nol pemasukan.",
      "Sisihkan 10-15% dari laba bersih bulanan secara konsisten ke rekening cadangan darurat.",
    ],
    caseStudy: {
      title: "Studi Kasus: Kafe Mahasiswa Saat Libur Semester",
      scenario:
        "Kafe 'Sahabat' memiliki biaya tetap Rp 6.000.000/bulan (sewa + listrik + 1 staf). Saat libur kampus 2 bulan, omzet anjlok 70% dan kafe defisit Rp 3.500.000/bulan.",
      calculation:
        "Karena memiliki Dana Darurat Rp 18.000.000 (setara 3 bulan Opex), kafe mampu menutupi defisit Rp 7.000.000 selama 2 bulan libur tanpa harus meminjam pinjol berbunga tinggi.",
      lesson:
        "Dana darurat adalah penyelamat kelangsungan hidup bisnis di masa krisis atau musim sepi.",
    },
    content: `
### Apa itu Cash Runway?
Cash Runway adalah durasi (dalam bulan) sebuah bisnis dapat terus beroperasi tanpa ada pemasukan baru sama sekali. Rumusnya:
$$\\text{Cash Runway} = \\frac{\\text{Total Saldo Kas Cadangan}}{\\text{Beban Operasional Tetap per Bulan}}$$

### Cara Membangun Dana Darurat dari Nol:
1. **Hitung Biaya Hidup Usaha (Burn Rate):** Jumlahkan biaya sewa tempat per bulan, gaji staf, tagihan listrik, air, dan internet.
2. **Alokasi Otomatis:** Setiap kali membukukan laba di akhir bulan, transfer 10-20% ke rekening terpisah yang tidak terhubung dengan kartu ATM belanja.
3. **Kapan Dana Darurat Boleh Dipakai?** Hanya untuk keadaan darurat operasional (kerusakan alat produksi utama, renovasi darurat, atau kompensasi saat omzet drop drastis), bukan untuk belanja modal barang yang belum terbukti laku.
    `,
    actionLink: {
      label: "Cek Runway di Simulator",
      href: "/academy",
    },
  },

  // =========================================================================
  // PILAR 2: STRATEGI PENETAPAN HARGA & MARGIN
  // =========================================================================
  {
    id: "seni-pricing-cost-plus-vs-value",
    title: "Seni Pricing: Cost-Plus, Value-Based & Psikologi Angka (Charm Pricing)",
    category: "pricing",
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
    category: "pricing",
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

  // =========================================================================
  // PILAR 3: MENU ENGINEERING & STRATEGI BUNDLING
  // =========================================================================
  {
    id: "trik-menu-engineering-bundling",
    title: "Trik Menu Engineering: Bundling & Upselling untuk Menaikkan AOV 30%",
    category: "menu",
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
      label: "Kelola Katalog Produk di POS",
      href: "/products",
    },
  },

  // =========================================================================
  // PILAR 4: YIELD, STANDARISASI RESEP & SOP DAPUR
  // =========================================================================
  {
    id: "mengendalikan-penyusutan-yield-resep",
    title: "Mengendalikan Penyusutan Bahan Baku (Yield Factor) & SOP Dapur",
    category: "operations",
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

  // =========================================================================
  // PILAR 5: MANAJEMEN KASBON & LOYALITAS PELANGGAN
  // =========================================================================
  {
    id: "sop-kasbon-piutang-pelanggan-sehat",
    title: "SOP Kasbon Pelanggan yang Sehat & Template Tagihan Sopan",
    category: "customers",
    categoryLabel: "Pelanggan & Piutang",
    readTime: "5 Menit Baca",
    level: "Pemula",
    iconName: "Users",
    summary:
      "Kasbon yang tidak dikontrol adalah pembunuh arus kas toko nomor satu. Terapkan batas plafon, jatuh tempo, dan cara menagih lewat WhatsApp tanpa merusak hubungan baik.",
    keyTakeaways: [
      "Batasi total kasbon maksimal 10% dari total omzet bulanan toko Anda.",
      "Terapkan batas plafon maksimal per orang (misal Rp 200.000) dan tenor maksimal 14-30 hari (saat gajian).",
      "Kirim pengingat WhatsApp otomatis sebelum hutang menumpuk terlalu besar.",
    ],
    caseStudy: {
      title: "Studi Kasus: Toko Sembako Bu Ratna",
      scenario:
        "Bu Ratna merasa sungkan menagih kasbon tetangga hingga total piutang menembus Rp 8.500.000. Saat harus kulakan beras dan minyak, Bu Ratna tidak punya uang tunai dan terpaksa meminjam modal berbunga.",
      calculation:
        "Setelah menggunakan fitur Buku Kasbon & Reminder WA di POS UMKM, Bu Ratna membatasi kasbon maksimal Rp 150.000 per tetangga dan menagih dengan template ramah saat tanggal gajian. Dalam 3 minggu, 85% piutang berhasil dicairkan kembali menjadi kas tunai.",
      lesson:
        "Sikap profesional dan sistem pencatatan digital menghilangkan rasa sungkan dalam menagih hak usaha Anda.",
    },
    content: `
### 3 Aturan Emas Kasbon Toko:
1. **Jangan Berikan Kasbon ke Pelanggan Baru:** Kasbon hanya untuk pelanggan tetap yang sudah dikenal domisili dan reputasi pembayarannya.
2. **Plafon & Jatuh Tempo Jelas:** Tentukan batas maksimal nominal (misal Rp 200.000) dan tanggal pelunasan (misal setiap tanggal 25 atau 1).
3. **Template WhatsApp Penagihan Ramah & Sopan:**

> *"Halo Kak [Nama], selamat siang 😊 Menginfokan catatan kasbon belanja di [Nama Toko] saat ini tercatat sebesar [Rp Nominal]. Apabila berkenan, pelunasan dapat ditransfer ke rekening [Bank & No Rekening] atau tunai saat berkunjung kembali. Terima kasih banyak atas kepercayaannya berbelanja di toko kami 🙏"*
    `,
    actionLink: {
      label: "Buka Buku Kasbon & Pelanggan",
      href: "/debts",
    },
  },

  // =========================================================================
  // PILAR 6: LEGALITAS, PAJAK UMKM & PERIZINAN
  // =========================================================================
  {
    id: "pajak-pph-final-umkm-dan-nib-oss",
    title: "Panduan Pajak UMKM 0.5% (PP 55/2022), NIB OSS & Sertifikasi Halal Gratis",
    category: "legal",
    categoryLabel: "Legalitas & Pajak",
    readTime: "7 Menit Baca",
    level: "Menengah",
    iconName: "Building",
    summary:
      "Ketahui hak istimewa bebas pajak untuk omzet di bawah Rp 500 Juta/tahun, cara daftar NIB gratis lewat OSS, dan sertifikasi Halal SEHATI untuk memperluas pasar usaha Anda.",
    keyTakeaways: [
      "Berdasarkan UU HPP & PP 55/2022, Wajib Pajak Orang Pribadi UMKM dengan omzet di bawah Rp 500 Juta per tahun BEBAS PAJAK (Pajak 0%).",
      "Omzet di atas Rp 500 Juta/tahun hanya dikenakan PPh Final 0.5% dari selisih kelebihannya.",
      "NIB (Nomor Induk Berusaha) dapat dibuat gratis dalam 10 menit melalui oss.go.id.",
    ],
    caseStudy: {
      title: "Studi Kasus: Simulasi Pajak Warung Makan Bu Dewi",
      scenario:
        "Warung Makan Bu Dewi memiliki omzet Rp 35.000.000/bulan (Total Omzet Setahun = Rp 420.000.000). Bu Dewi khawatir akan dikenakan pajak ratusan juta rupiah.",
      calculation:
        "Karena total omzet setahun (Rp 420 Juta) masih di bawah batas batasan Rp 500 Juta, Bu Dewi **TIDAK PERLU MEMBAYAR PPH FINAL (Pajak = Rp 0)**. Bu Dewi hanya wajib melaporkan SPT Tahunan nihil.",
      lesson:
        "Pemerintah memberikan perlindungan pajak yang sangat ringan bagi UMKM. Jangan takut melegalkan usaha Anda.",
    },
    content: `
### 1. Ketentuan Pajak PPh Final UMKM 0.5%:
- **Omzet s.d. Rp 500 Juta / Tahun:** Bebas Pajak (Tarif 0%).
- **Omzet > Rp 500 Juta / Tahun:** Dikenakan PPh Final 0.5% hanya atas bagian omzet di atas Rp 500 Juta.
- *Contoh:* Omzet setahun Rp 600 Juta. Pajak terutang = $(\\text{Rp } 600 \\text{ Jt} - \\text{Rp } 500 \\text{ Jt}) \\times 0.5\\% = \\text{Rp } 100 \\text{ Jt} \\times 0.5\\% =$ **Rp 500.000 per tahun**.

### 2. Cara Membuat NIB (Nomor Induk Berusaha) Gratis:
1. Siapkan KTP dan NPWP pemilik.
2. Buka portal resmi **oss.go.id** ➡️ Pilih *Usaha Mikro & Kecil (UMK)*.
3. Masukkan data usaha dan pilih Klasifikasi KBLI yang sesuai (misal: Kedai Makanan KBLI 56102).
4. Unduh dokumen NIB resmi ber-barcode yang berlaku seumur hidup sebagai legalitas operasional dan syarat pengajuan kredit usaha bank (KUR).

### 3. Sertifikasi Halal Gratis (SEHATI BPJPH):
UMKM makanan dan minuman berhak mendapatkan fasilitasi Sertifikasi Halal Gratis jalur *Self-Declare* melalui ptsp.halal.go.id.
    `,
    actionLink: {
      label: "Cek Laporan Laba Rugi Toko",
      href: "/reports",
    },
  },
];
