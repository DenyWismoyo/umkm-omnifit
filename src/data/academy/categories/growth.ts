import { AcademyArticle } from "../types";

export const growthArticles: AcademyArticle[] = [
  {
    id: "panduan-buka-cabang-baru-standarisasi-sop",
    title: "Kapan Waktu Tepat Buka Cabang Baru? & Checklist Standarisasi SOP",
    categoryId: "growth",
    categoryLabel: "Ekspansi & Skala Usaha",
    readTime: "7 Menit Baca",
    level: "Mahir",
    iconName: "TrendingUp",
    summary:
      "Membuka cabang baru bisa melipatgandakan keuntungan atau justru menyeret cabang pertama ikut bangkrut jika SOP dan arus kas belum teruji matang.",
    keyTakeaways: [
      "Buka cabang kedua HANYA JIKA cabang pertama sudah stabil membukukan laba konsisten minimal 6-12 bulan berturut-turut.",
      "Pastikan cabang pertama bisa berjalan mandiri tanpa kehadiran fisik pemilik setiap hari.",
      "Modal buka cabang kedua harus berasal dari akumulasi laba atau dana khusus ekspansi, bukan menguras kas operasional cabang 1.",
    ],
    caseStudy: {
      title: "Studi Kasus: Kedai Martabak & Terang Bulan Mas Ilham",
      scenario:
        "Cabang 1 ramai di bulan ke-2, Mas Ilham langsung meminjam uang untuk membuka cabang 2 di lokasi seberang. Karena belum ada SOP takaran adonan dan kasir terlatih, rasa martabak di cabang 2 berbeda dan kasir sering tekor. Cabang 2 merugi dan menguras modal cabang 1.",
      calculation:
        "Pelajaran: Standarisasi bumbu premix instan dan sistem POS cloud multi-store mutlak disiapkan terlebih dahulu sebelum menambah gerai baru.",
      lesson:
        "Ekspansi yang terburu-buru tanpa fondasi SOP yang kuat adalah jebakan terbesar pengusaha pemula.",
    },
    content: `
### 4 Syarat Wajib Sebelum Membuka Cabang Baru:
1. **Bukti Profit Konsisten:** Cabang 1 menghasilkan laba bersih minimal 20% selama 6 bulan terakhir.
2. **SOP Resep Teruji (Central Kitchen / Premix):** Adonan dan bumbu utama diracik terpusat agar cita rasa cabang 1 dan cabang 2 identik 100%.
3. **Sistem Kasir & Stok Terpusat:** Menggunakan POS yang mencatat transaksi dan stok real-time dari jarak jauh.
4. **Kader Pemimpin (Leader Cabang):** Memiliki minimal 1 staf senior terpercaya dari cabang 1 yang siap ditugaskan menjadi kepala toko di cabang baru.
    `,
    actionLink: {
      label: "Cek Laporan Laba/Rugi Cabang",
      href: "/reports",
    },
  },

  {
    id: "tips-pengajuan-pinjaman-kur-bank",
    title: "Tips Lolos Pengajuan Kredit Usaha Rakyat (KUR Bank) Bunga Rendah 6%",
    categoryId: "growth",
    categoryLabel: "Ekspansi & Skala Usaha",
    readTime: "6 Menit Baca",
    level: "Menengah",
    iconName: "DollarSign",
    summary:
      "Bagaimana merapikan mutasi rekening bank dan laporan keuangan digital dari POS agar pengajuan pinjaman modal usaha KUR disetujui pihak bank.",
    keyTakeaways: [
      "KUR (Kredit Usaha Rakyat) memiliki suku bunga sangat rendah yang disubsidi pemerintah (hanya 6% per tahun).",
      "Pihak bank mewajibkan usaha sudah berjalan aktif minimal 6 bulan, memiliki NIB, dan catatan keuangan rapi.",
      "Hindari pinjol ilegal atau paylater macet karena BI Checking (SLIK OJK) akan dicek secara ketat oleh analis kredit bank.",
    ],
    caseStudy: {
      title: "Studi Kasus: Bengkel & Cuci Motor Berkah",
      scenario:
        "Pemilik mengajukan pinjaman KUR Rp 50.000.000 untuk menambah mesin hidrolik baru. Berkat menunjukkan riwayat transaksi POS rapi selama 8 bulan dan mutasi rekening QRIS aktif, pengajuan disetujui dalam 3 hari kerja tanpa jaminan sertifikat rumah.",
      calculation:
        "Cicilan KUR Rp 50 Juta tenor 3 tahun bunga 6% = Rp 1.520.000/bulan (sangat terjangkau dibanding pinjol yang bunganya 24-36% per tahun!).",
      lesson:
        "Pencatatan keuangan digital adalah aset tak ternilai untuk membuka akses permodalan perbankan formal.",
    },
    content: `
### Dokumen Wajib untuk Pengajuan KUR:
1. **Identitas Diri:** KTP, Kartu Keluarga (KK), dan NPWP.
2. **Legalitas Usaha:** NIB (Nomor Induk Berusaha) dari oss.go.id.
3. **Rekening Koran:** Mutasi bank 3-6 bulan terakhir (biasakan semua hasil penjualan kasir disetor ke rekening bank resmi).
4. **Laporan Keuangan Toko:** Cetak ringkasan Laba/Rugi dan Penjualan dari sistem POS UMKM Anda.
    `,
    actionLink: {
      label: "Buka Laporan Finansial",
      href: "/reports",
    },
  },
];
