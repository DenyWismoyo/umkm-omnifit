import { AcademyArticle } from "../types";

export const legalArticles: AcademyArticle[] = [
  {
    id: "pajak-pph-final-umkm-dan-nib-oss",
    title: "Panduan Pajak UMKM 0.5% (PP 55/2022), NIB OSS & Sertifikasi Halal Gratis",
    categoryId: "legal",
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
        "Warung Makan Bu Dewi memiliki omzet Rp 35.000.000/bulan (Total Omzet Setahun = Rp 420.000.000). Bu Dewi khawatir akan dikenakan pajak puluhan juta rupiah.",
      calculation:
        "Karena total omzet setahun (Rp 420 Juta) masih di bawah batasan Rp 500 Juta, Bu Dewi **TIDAK PERLU MEMBAYAR PPH FINAL (Pajak = Rp 0)**. Bu Dewi hanya wajib melaporkan SPT Tahunan nihil.",
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

  {
    id: "izin-pirt-dan-label-kemasan-bpom",
    title: "Syarat Izin Edar P-IRT & Standar Informasi Label Kemasan Produk Makanan",
    categoryId: "legal",
    categoryLabel: "Legalitas & Pajak",
    readTime: "6 Menit Baca",
    level: "Menengah",
    iconName: "FileText",
    summary:
      "Langkah mengurus izin P-IRT di Dinas Kesehatan / PTSP setempat agar produk kemasan kering atau frozen food Anda bisa masuk ke supermarket dan minimarket modern.",
    keyTakeaways: [
      "P-IRT (Pangan Industri Rumah Tangga) wajib untuk produk makanan/minuman dalam kemasan yang masa simpannya > 7 hari.",
      "Label kemasan wajib memuat 7 unsur: Nama produk, Komposisi, Berat Bersih, Nama & Alamat Produsen, Nomor P-IRT, Tanggal Kadaluarsa, dan Kode Produksi.",
      "Izin P-IRT meningkatkan kepercayaan konsumen dan membuka pintu distribusi ke toko oleh-oleh ternama.",
    ],
    caseStudy: {
      title: "Studi Kasus: Keripik Singkong Renyah Bu Ani",
      scenario:
        "Bu Ani ingin memasukkan keripik singkongnya ke 20 minimarket lokal, namun ditolak karena belum memiliki nomor izin P-IRT dan label kemasannya hanya berupa plastik polos tanpa informasi kadaluarsa.",
      calculation:
        "Setelah mengikuti penyuluhan keamanan pangan (PKP) dan mendapatkan nomor P-IRT, kemasannya diperbarui dengan stiker lengkap. Produknya diterima di 15 minimarket dan omzet naik dari Rp 5 Juta menjadi Rp 38 Juta/bulan.",
      lesson:
        "Legalitas izin edar adalah jembatan utama yang mengubah bisnis rumahan menjadi industri skala ritel.",
    },
    content: `
### 7 Informasi Wajib pada Label Kemasan Produk:
1. **Nama Produk & Varian Rasa:** Jelas dan tidak menyesatkan.
2. **Daftar Bahan Baku / Komposisi:** Ditulis urut dari persentase terbanyak ke paling sedikit.
3. **Berat Bersih (Netto):** Satuan gram (g) atau mililiter (ml).
4. **Nama & Alamat Produsen:** Kota tempat produksi.
5. **Nomor Izin P-IRT / BPOM & Halal.**
6. **Tanggal & Tahun Kedaluwarsa (Best Before / Expired Date).**
7. **Petunjuk Penyimpanan:** (Contoh: *Simpan di tempat sejuk dan kering, hindarkan dari sinar matahari langsung*).
    `,
    actionLink: {
      label: "Buka Data Produk & Stok",
      href: "/products",
    },
  },
];
