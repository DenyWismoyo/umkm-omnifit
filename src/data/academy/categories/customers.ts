import { AcademyArticle } from "../types";

export const customersArticles: AcademyArticle[] = [
  {
    id: "sop-kasbon-piutang-pelanggan-sehat",
    title: "SOP Kasbon Pelanggan yang Sehat & Template Tagihan Sopan",
    categoryId: "customers",
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

  {
    id: "program-loyalitas-pelanggan-sederhana",
    title: "Program Loyalitas Pelanggan: Stamp Card Sederhana Bikin Pelanggan Balik Lagi",
    categoryId: "customers",
    categoryLabel: "Pelanggan & Piutang",
    readTime: "5 Menit Baca",
    level: "Pemula",
    iconName: "Sparkles",
    summary:
      "Biaya mencari pelanggan baru 5x lebih mahal daripada mempertahankan pelanggan lama. Pelajari cara membuat sistem reward loyalitas yang simpel dan disukai pembeli.",
    keyTakeaways: [
      "Pelanggan setia menyumbang 65% omzet berulang bagi usaha kuliner dan ritel.",
      "Program Stamp Card (misal: Beli 9 Kopi Gratis 1) secara psikologis mendorong pelanggan menuntaskan kartu capnya.",
      "Selalu minta nomor WhatsApp pelanggan untuk mengirim promo khusus ulang tahun atau menu baru.",
    ],
    caseStudy: {
      title: "Studi Kasus: Barbershop & Cuci Sepatu Mas Dedi",
      scenario:
        "Mas Dedi membagikan kartu cap stempel sederhana: '5x Cuci Sepatu Gratis 1x Deep Clean'.",
      calculation:
        "Sebelum ada kartu: Pelanggan datang rata-rata 1x per 3 bulan. Setelah ada kartu: Frekuensi kedatangan naik menjadi 1x per bulan. Omzet bulanan naik 75% dari pelanggan yang sama.",
      lesson:
        "Beri alasan yang menyenangkan bagi pelanggan untuk selalu memilih toko Anda daripada kompetitor.",
    },
    content: `
### 3 Mekanisme Program Loyalitas yang Terbukti Berhasil:
1. **Digital / Kartu Stamp Cap:** Berikan 1 cap setiap transaksi minimal Rp 20.000. Cap ke-10 mendapatkan produk gratis dengan HPP rendah (misal: Es Teh Jumbo atau Kentang Goreng).
2. **Promo Ulang Tahun Pelanggan:** Kirim ucapan selamat dan voucher diskon 20% lewat WhatsApp pada hari ulang tahun pelanggan yang tersimpan di data kasir.
3. **Sapaan Personal Kasir:** Latih kasir untuk mengingat nama dan pesanan favorit pelanggan langganan.
    `,
    actionLink: {
      label: "Cek Data Pelanggan Toko",
      href: "/debts",
    },
  },
];
