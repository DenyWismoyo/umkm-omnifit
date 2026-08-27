import { AcademyArticle } from "../types";

export const hrArticles: AcademyArticle[] = [
  {
    id: "skema-gaji-dan-bonus-omzet-kasir",
    title: "Skema Gaji Pokok + Bonus Omzet yang Bikin Staf Kasir & Barista Loyal",
    categoryId: "hr",
    categoryLabel: "SDM & Karyawan",
    readTime: "6 Menit Baca",
    level: "Menengah",
    iconName: "Users",
    summary:
      "Cara menyusun struktur kompensasi yang adil agar karyawan termotivasi aktif menawarkan upselling produk dan tidak sering resign.",
    keyTakeaways: [
      "Kombinasikan Gaji Pokok Tetap dengan Bonus Insentif Target Omzet Harian / Bulanan.",
      "Berikan komisi kecil (misal Rp 500/cup) untuk setiap menu tambahan yang berhasil di-upsell kasir.",
      "Transparansi pencatatan kasir via POS digital membangun kepercayaan tim kerja.",
    ],
    caseStudy: {
      title: "Studi Kasus: Outlet Minuman Segar Ceria",
      scenario:
        "Karyawan hanya digaji flat dan bersikap pasif, tidak pernah menawarkan topping atau ukuran besar kepada pembeli.",
      calculation:
        "Diterapkan skema bonus: Gaji Pokok Rp 2.000.000 + Bonus Rp 500 per cup ukuran Large yang terjual. Dalam 1 bulan, penjualan cup Large naik 400 cup. Toko mendapat ekstra profit kotor Rp 2.800.000, staf senang mendapat bonus tambahan Rp 200.000.",
      lesson:
        "Insentif yang selaras dengan profit toko menciptakan hubungan kerja yang saling menguntungkan (win-win solution).",
    },
    content: `
### Formula Struktur Gaji UMKM yang Sehat:
1. **Gaji Pokok (60-70%):** Memenuhi kebutuhan dasar harian staf.
2. **Uang Kehadiran / Disiplin (15-20%):** Diberikan penuh jika tidak pernah terlambat atau absen tanpa keterangan.
3. **Insentif Performa / Target Omzet (15-20%):**
   - *Target Harian Tercapai:* Bonus Rp 15.000 - Rp 25.000 per orang per hari jika omzet menembus target minimal.
   - *Komisi Upselling:* Bonus langsung untuk setiap menu promo khusus yang laku terjual.
    `,
    actionLink: {
      label: "Kelola Akun Kasir Toko",
      href: "/settings",
    },
  },

  {
    id: "sop-training-karyawan-baru-3-hari",
    title: "SOP Training Kilat Karyawan Baru dalam 3 Hari Siap Jaga Toko",
    categoryId: "hr",
    categoryLabel: "SDM & Karyawan",
    readTime: "5 Menit Baca",
    level: "Pemula",
    iconName: "CheckSquare",
    summary:
      "Bagaimana melatih karyawan baru dengan modul tertulis yang jelas agar operasional toko tetap konsisten tanpa pemilik harus menunggu toko seharian.",
    keyTakeaways: [
      "Hari 1: Pengenalan menu, takaran resep standar, dan standar kebersihan.",
      "Hari 2: Simulasi mesin kasir POS, penerimaan pembayaran QRIS/Tunai, dan cetak struk.",
      "Hari 3: Pelayanan langsung didampingi senior dengan checklist evaluasi.",
    ],
    caseStudy: {
      title: "Studi Kasus: Kemitraan Roti Bakar Bandung",
      scenario:
        "Setiap kali karyawan lama keluar, pemilik pusing karena karyawan baru sering salah membuat resep dan salah mencatat kembalian.",
      calculation:
        "Dibuat lembar panduan resep bergambar dan SOP kasir 3 langkah. Waktu orientasi karyawan baru terpangkas dari 2 minggu menjadi hanya 3 hari dengan tingkat komplain pelanggan 0%.",
      lesson:
        "Sistem yang rapi membuat bisnis Anda tidak bergantung pada orang tertentu dan mudah direplikasi.",
    },
    content: `
### Kurikulum Training 3 Hari:
- **Hari 1 (Produk & Dapur):** Hafalkan nama menu, takaran timbangan bumbu, dan letak penyimpanan bahan FIFO.
- **Hari 2 (Kasir & POS):** Cara login kasir anonim via Kode Toko & PIN, input transaksi, catat kasbon, dan hitung uang kembalian.
- **Hari 3 (Hospitality & Closing):** Senyum-Sapa-Salam, penanganan komplain, dan SOP rekonsiliasi kas sebelum tutup toko.
    `,
    actionLink: {
      label: "Buka Mesin Kasir POS",
      href: "/pos",
    },
  },
];
