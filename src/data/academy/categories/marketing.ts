import { AcademyArticle } from "../types";

export const marketingArticles: AcademyArticle[] = [
  {
    id: "optimasi-google-maps-lokal-umkm",
    title: "Optimasi Google Maps (Google Business Profile) untuk Menarik Pelanggan Sekitar",
    categoryId: "marketing",
    categoryLabel: "Pemasaran & Promosi",
    readTime: "6 Menit Baca",
    level: "Pemula",
    iconName: "Globe",
    summary:
      "80% orang mencari tempat makan atau toko terdekat lewat Google Maps. Cara gratis membuat toko Anda muncul di peringkat atas pencarian lokal tanpa biaya iklan.",
    keyTakeaways: [
      "Daftarkan lokasi usaha secara gratis di Google Business Profile dengan nama jelas dan kategori tepat.",
      "Kumpulkan minimal 20 ulasan bintang 5 dari pelanggan setia dengan menyertakan foto menu.",
      "Upload foto produk berkualitas tinggi dan perbarui jam buka toko secara rutin.",
    ],
    caseStudy: {
      title: "Studi Kasus: Laundry Kiloan Berkah Cepat",
      scenario:
        "Toko berada di dalam gang sempit dan sepi pelanggan baru yang lewat di jalan raya utama.",
      calculation:
        "Setelah mendaftarkan Google Maps dengan nama 'Laundry Kiloan Terdekat & Cuci Sepatu Berkah', melengkapi foto mesin, dan mengumpulkan 35 ulasan bintang 5: Pencarian lokal meningkat 400% dan mendapat 15-20 orderan baru setiap hari dari anak kos sekitar.",
      lesson:
        "Visibilitas digital di peta lokal adalah mesin pengalir pelanggan gratis terbaik untuk toko fisik.",
    },
    content: `
### 4 Langkah Menguasai Google Maps Lokal:
1. **Nama Bisnis yang Mengandung Kata Kunci:**
   - Gunakan format: *[Nama Usaha] - [Jenis Produk/Layanan]*
   - Contoh: *Kedai Kopi Senja - Coffee Shop & Tempat Nongkrong Wifi*
2. **Kategori Usaha Primer yang Tepat:** Pastikan memilih kategori yang paling spesifik (misal: *Restoran Makanan Cepat Saji* alih-alih hanya *Restoran*).
3. **Minta Ulasan Bintang 5:** Cetak QR Code yang mengarah langsung ke link ulasan Google Maps di meja kasir. Berikan diskon Rp 2.000 atau es teh gratis bagi pelanggan yang memberikan ulasan berfoto!
4. **Respon Semua Ulasan:** Balas ulasan pelanggan dengan ramah dan sebutkan nama menu favorit mereka.
    `,
    actionLink: {
      label: "Buka Pengaturan Toko",
      href: "/settings",
    },
  },

  {
    id: "strategi-konten-video-pendek-tiktok-reels",
    title: "Strategi Konten Video Pendek (TikTok & Reels) yang Bikin Produk Viral",
    categoryId: "marketing",
    categoryLabel: "Pemasaran & Promosi",
    readTime: "5 Menit Baca",
    level: "Menengah",
    iconName: "TrendingUp",
    summary:
      "Jangan hanya posting foto brosur kaku. Pelajari format video 'Behind The Scenes' dan proses memasak yang disukai algoritma media sosial.",
    keyTakeaways: [
      "Video proses pembuatan (ASMR masak, potong daging, tuang sirup kental) mendapatkan engagement 3x lebih tinggi daripada foto statis.",
      "Gunakan 3 detik pertama (Hook) yang memancing rasa penasaran atau menggugah selera.",
      "Sertakan lokasi toko dan ajakan mampir (Call to Action) di akhir video.",
    ],
    caseStudy: {
      title: "Studi Kasus: Sambal Cumi Juara Mas Fajar",
      scenario:
        "Membuat video 15 detik merekam lelehan minyak cabai merah segar dituang di atas nasi panas dengan suara gemericik wajan.",
      calculation:
        "Video ditonton 250.000 kali di TikTok. Dalam 48 jam, pesanan dine-in dan takeaway melonjak 300% dan stok ludes dalam 2 jam buka.",
      lesson:
        "Konten visual yang menggugah panca indera adalah media promosi kuliner paling ampuh di era sekarang.",
    },
    content: `
### 3 Ide Konten Video yang Selalu Menarik Penonton:
1. **Behind The Scenes (Di Balik Dapur):** Tunjukkan bagaimana Anda memilih bahan segar di pasar jam 4 pagi atau proses membersihkan dapur yang higienis.
2. **Porsi Melimpah / Keju Meleleh:** Rekam momen dramatis saat membelah burger keju meleleh, menyiram saus lava pedas, atau menuang boba kenyal.
3. **Kisah Perjuangan Usaha:** Ceritakan alasan Anda merintis usaha ini dan tekad memberikan rasa terbaik untuk pelanggan.
    `,
    actionLink: {
      label: "Cek Katalog Produk Toko",
      href: "/products",
    },
  },
];
