import { AcademyArticle } from "../types";

export const financeArticles: AcademyArticle[] = [
  {
    id: "memisahkan-rekening-gaji-owner",
    title: "Cara Memisahkan Rekening Usaha vs Pribadi & Menentukan Gaji Owner",
    categoryId: "finance",
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
    categoryId: "finance",
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

  {
    id: "memahami-laporan-arus-kas-vs-laba-rugi",
    title: "Mengapa Toko Untung Besar Tapi Kasnya Kosong? (Profit vs Cashflow)",
    categoryId: "finance",
    categoryLabel: "Manajemen Keuangan",
    readTime: "6 Menit Baca",
    level: "Menengah",
    iconName: "TrendingUp",
    summary:
      "Banyak pemilik usaha bingung kenapa laporan laba rugi menunjukkan keuntungan Rp 10 Juta, tapi di rekening bank hanya tersisa Rp 500 ribu. Pahami jebakan arus kas tertahan.",
    keyTakeaways: [
      "Profit adalah angka di atas kertas; Cashflow adalah uang tunai nyata di tangan.",
      "Uang kas sering tertahan di 2 tempat utama: Stok barang mati di gudang dan Kasbon pelanggan yang belum dibayar.",
      "Selalu pantau perputaran kas (Cash Conversion Cycle) agar bisnis tidak terkena krisis likuiditas.",
    ],
    caseStudy: {
      title: "Studi Kasus: Toko Grosir Plastik & Bahan Kue",
      scenario:
        "Omzet bulanan Rp 50 Juta dengan laba tercatat Rp 12 Juta. Namun saat jatuh tempo sewa ruko Rp 8 Juta, toko tidak bisa membayar.",
      calculation:
        "Setelah diaudit: Rp 7 Juta kas tertahan di pelanggan yang kasbon, dan Rp 5 Juta tertahan dalam bentuk stok plastik yang dibeli terlalu banyak karena tergiur diskon suplier.",
      lesson:
        "Jangan biarkan kas Anda mengendap menjadi tumpukan barang yang lambat terjual atau kasbon macet.",
    },
    content: `
### 3 Penyebab Utama 'Laba di Atas Kertas Tapi Uangnya Gaib':
1. **Stok Berlebih (Dead Stock):** Membeli bahan terlalu banyak di awal mengunci uang tunai Anda di rak gudang.
2. **Piutang Kasbon Macet:** Barang sudah keluar dan tercatat sebagai penjualan, tapi uang fisiknya belum masuk ke kasir.
3. **Cicilan Alat & Modal Awal:** Pembayaran cicilan pokok mesin kasir/kulkas tidak masuk ke laporan laba rugi operasional bulanan, tetapi langsung memotong kas riil bank Anda.
    `,
    actionLink: {
      label: "Cek Laporan Laba Rugi",
      href: "/reports",
    },
  },
];
