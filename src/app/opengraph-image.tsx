import { ImageResponse } from "next/og";

export const runtime = "edge";

// Image metadata
export const alt = "POS UMKM Pro - Aplikasi Kasir Online & Manajemen Usaha Multi-Industri";
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "space-between",
          backgroundColor: "#090d16",
          backgroundImage:
            "radial-gradient(circle at 25px 25px, #1e293b 2%, transparent 0%), radial-gradient(circle at 75px 75px, #064e3b 30%, transparent 70%), linear-gradient(135deg, #022c22 0%, #090d16 50%, #0f172a 100%)",
          padding: "60px 70px",
          fontFamily: "system-ui, -apple-system, sans-serif",
          color: "#ffffff",
        }}
      >
        {/* Top Header Branding */}
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "72px",
              height: "72px",
              borderRadius: "20px",
              background: "linear-gradient(135deg, #10b981, #0d9488)",
              boxShadow: "0 10px 25px -5px rgba(16, 185, 129, 0.4)",
            }}
          >
            {/* Store Icon */}
            <svg
              width="44"
              height="44"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#ffffff"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span
              style={{
                fontSize: "36px",
                fontWeight: 900,
                letterSpacing: "-1px",
                color: "#ffffff",
              }}
            >
              POS UMKM <span style={{ color: "#34d399" }}>Pro</span>
            </span>
            <span
              style={{
                fontSize: "16px",
                fontWeight: 600,
                color: "#94a3b8",
                letterSpacing: "1px",
                textTransform: "uppercase",
              }}
            >
              by Omnifit Cloud • umkm.omnifit.cloud
            </span>
          </div>
        </div>

        {/* Center Main Value Proposition */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px", maxWidth: "950px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              backgroundColor: "rgba(16, 185, 129, 0.15)",
              border: "1px solid rgba(52, 211, 153, 0.3)",
              padding: "6px 16px",
              borderRadius: "50px",
              width: "max-content",
            }}
          >
            <span style={{ fontSize: "14px", fontWeight: 800, color: "#6ee7b7" }}>
              ⚡ TRIAL PRO 30 HARI GRATIS • MULTI-INDUSTRI
            </span>
          </div>

          <h1
            style={{
              fontSize: "52px",
              fontWeight: 900,
              lineHeight: 1.15,
              letterSpacing: "-1.5px",
              color: "#ffffff",
              margin: 0,
            }}
          >
            Sistem Kasir Modern, Stok & HPP Otomatis untuk UMKM
          </h1>

          <p
            style={{
              fontSize: "22px",
              color: "#cbd5e1",
              margin: 0,
              lineHeight: 1.4,
            }}
          >
            Kelola penjualan, struk QRIS, kasbon pelanggan & printer thermal langsung dari HP & PC.
          </p>
        </div>

        {/* Bottom 6 Industry Pills */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            width: "100%",
            paddingTop: "20px",
            borderTop: "1px solid rgba(255, 255, 255, 0.1)",
          }}
        >
          {[
            { label: "🍽️ F&B Resto" },
            { label: "☕ Coffee Shop" },
            { label: "🛒 Retail Grosir" },
            { label: "✂️ Barbershop" },
            { label: "🧺 Laundry" },
            { label: "🏢 Universal" },
          ].map((item, idx) => (
            <div
              key={idx}
              style={{
                display: "flex",
                alignItems: "center",
                backgroundColor: "rgba(255, 255, 255, 0.08)",
                padding: "8px 18px",
                borderRadius: "12px",
                fontSize: "16px",
                fontWeight: 700,
                color: "#e2e8f0",
                border: "1px solid rgba(255, 255, 255, 0.08)",
              }}
            >
              {item.label}
            </div>
          ))}
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
