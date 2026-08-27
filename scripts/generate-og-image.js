const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

async function generateAssets() {
  console.log("Generating OpenGraph & PWA PNG assets...");

  // 1. 1200x630 High-Resolution OpenGraph Banner SVG
  const ogSvg = `
  <svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#022c22" />
        <stop offset="40%" stop-color="#090d16" />
        <stop offset="100%" stop-color="#0f172a" />
      </linearGradient>

      <linearGradient id="primaryGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#10b981" />
        <stop offset="100%" stop-color="#0d9488" />
      </linearGradient>

      <linearGradient id="glowGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#34d399" stop-opacity="0.35" />
        <stop offset="100%" stop-color="#10b981" stop-opacity="0" />
      </linearGradient>

      <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="16" stdDeviation="20" flood-color="#000000" flood-opacity="0.6" />
      </filter>
    </defs>

    <!-- Background -->
    <rect width="1200" height="630" fill="url(#bgGrad)" />

    <!-- Ambient Glowing Circles -->
    <circle cx="150" cy="150" r="280" fill="url(#glowGrad)" filter="blur(60px)" />
    <circle cx="1050" cy="480" r="320" fill="url(#glowGrad)" filter="blur(80px)" />

    <!-- Top Left Brand Badge -->
    <g transform="translate(80, 60)">
      <!-- Logo Icon Box -->
      <rect width="68" height="68" rx="18" fill="url(#primaryGrad)" filter="url(#shadow)" />
      <!-- Store Roof/Door Icon -->
      <g transform="translate(18, 16) scale(1.4)" stroke="#ffffff" stroke-width="2.2" fill="none" stroke-linecap="round" stroke-linejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </g>
      
      <!-- Brand Name -->
      <text x="88" y="44" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="34" font-weight="900" fill="#ffffff" letter-spacing="-0.5">
        POS UMKM <tspan fill="#34d399">Pro</tspan>
      </text>
      <text x="88" y="66" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="14" font-weight="700" fill="#94a3b8" letter-spacing="1.5">
        BY OMNIFIT CLOUD • UMKM.OMNIFIT.CLOUD
      </text>
    </g>

    <!-- Top Right 30 Days Trial Pill -->
    <g transform="translate(820, 68)">
      <rect width="300" height="48" rx="24" fill="#064e3b" stroke="#10b981" stroke-width="1.5" />
      <text x="150" y="30" text-anchor="middle" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="14" font-weight="800" fill="#6ee7b7">
        ⚡ FREE TRIAL PRO 30 HARI
      </text>
    </g>

    <!-- Main Value Headline -->
    <g transform="translate(80, 200)">
      <text font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="52" font-weight="900" fill="#ffffff" letter-spacing="-1.5">
        <tspan x="0" y="40">Aplikasi Kasir Online dan</tspan>
        <tspan x="0" y="102" fill="#34d399">Manajemen Usaha Multi-Industri</tspan>
      </text>

      <text x="0" y="156" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="22" font-weight="500" fill="#cbd5e1">
        Kelola pesanan kasir, kalkulator HPP resep, buku kasbon pelanggan dan struk QRIS dari HP / PC.
      </text>
    </g>

    <!-- Bottom 6 Industry Badges Grid -->
    <g transform="translate(80, 480)">
      <!-- Divider line -->
      <line x1="0" y1="-30" x2="1040" y2="-30" stroke="#334155" stroke-width="1.5" />

      <!-- Pills -->
      <!-- FnB -->
      <g transform="translate(0, 0)">
        <rect width="160" height="52" rx="14" fill="#1e293b" stroke="#334155" stroke-width="1" />
        <text x="80" y="32" text-anchor="middle" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="16" font-weight="700" fill="#f8fafc">
          🍽️ Kuliner FnB
        </text>
      </g>

      <!-- Coffee -->
      <g transform="translate(175, 0)">
        <rect width="165" height="52" rx="14" fill="#1e293b" stroke="#334155" stroke-width="1" />
        <text x="82" y="32" text-anchor="middle" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="16" font-weight="700" fill="#f8fafc">
          ☕ Coffee Shop
        </text>
      </g>

      <!-- Retail -->
      <g transform="translate(355, 0)">
        <rect width="165" height="52" rx="14" fill="#1e293b" stroke="#334155" stroke-width="1" />
        <text x="82" y="32" text-anchor="middle" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="16" font-weight="700" fill="#f8fafc">
          🛒 Retail Grosir
        </text>
      </g>

      <!-- Salon -->
      <g transform="translate(535, 0)">
        <rect width="160" height="52" rx="14" fill="#1e293b" stroke="#334155" stroke-width="1" />
        <text x="80" y="32" text-anchor="middle" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="16" font-weight="700" fill="#f8fafc">
          ✂️ Barbershop
        </text>
      </g>

      <!-- Laundry -->
      <g transform="translate(710, 0)">
        <rect width="155" height="52" rx="14" fill="#1e293b" stroke="#334155" stroke-width="1" />
        <text x="77" y="32" text-anchor="middle" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="16" font-weight="700" fill="#f8fafc">
          🧺 Laundry
        </text>
      </g>

      <!-- Universal -->
      <g transform="translate(880, 0)">
        <rect width="160" height="52" rx="14" fill="#064e3b" stroke="#10b981" stroke-width="1" />
        <text x="80" y="32" text-anchor="middle" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="16" font-weight="700" fill="#6ee7b7">
          🏢 Universal
        </text>
      </g>
    </g>
  </svg>
  `;

  // Write og-image.png (Optimized for WhatsApp under 200KB)
  await sharp(Buffer.from(ogSvg))
    .png({ quality: 90, compressionLevel: 8 })
    .toFile(path.join(__dirname, "../public/og-image.png"));
  console.log("✓ Created public/og-image.png (1200x630)");

  // 2. 512x512 App Icon PNG
  const icon512Svg = `
  <svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="pwaGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#059669" />
        <stop offset="45%" stop-color="#0d9488" />
        <stop offset="100%" stop-color="#0f172a" />
      </linearGradient>
    </defs>
    <rect width="512" height="512" rx="118" fill="url(#pwaGrad)" />
    <g transform="translate(106, 106) scale(12.5)" stroke="#ffffff" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
      <line x1="3" y1="9" x2="21" y2="9" stroke="#34d399" stroke-width="2" />
    </g>
  </svg>
  `;

  await sharp(Buffer.from(icon512Svg))
    .resize(512, 512)
    .png()
    .toFile(path.join(__dirname, "../public/icons/icon-512x512.png"));
  console.log("✓ Created public/icons/icon-512x512.png");

  await sharp(Buffer.from(icon512Svg))
    .resize(192, 192)
    .png()
    .toFile(path.join(__dirname, "../public/icons/icon-192x192.png"));
  console.log("✓ Created public/icons/icon-192x192.png");

  console.log("All assets generated successfully!");
}

generateAssets().catch(console.error);
