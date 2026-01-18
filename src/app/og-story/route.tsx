import { ImageResponse } from "next/og";

export const runtime = "edge";

function LogoMark() {
  return (
    <div
      style={{
        width: 168,
        height: 168,
        borderRadius: 48,
        background: "linear-gradient(135deg, #1D4ED8 0%, #10B981 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: "0 26px 70px rgba(11,18,32,0.18)",
      }}
    >
      <svg
        width="112"
        height="112"
        viewBox="0 0 512 512"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M166 172L256 318L346 172"
          stroke="white"
          strokeWidth="44"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M94 186C60 222 60 290 94 326"
          stroke="white"
          strokeOpacity="0.55"
          strokeWidth="14"
          strokeLinecap="round"
        />
        <path
          d="M418 186C452 222 452 290 418 326"
          stroke="white"
          strokeOpacity="0.55"
          strokeWidth="14"
          strokeLinecap="round"
        />
        <circle cx="256" cy="356" r="10" fill="white" fillOpacity="0.9" />
      </svg>
    </div>
  );
}

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 86,
          background:
            "radial-gradient(1200px 900px at 10% 10%, rgba(29,78,216,0.24), transparent 55%), radial-gradient(1200px 900px at 90% 25%, rgba(16,185,129,0.20), transparent 55%), linear-gradient(180deg, #F8FAFC 0%, #F1F5F9 100%)",
          color: "#0B1220",
          fontFamily:
            "ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 26 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
            <LogoMark />
            <div style={{ display: "flex", flexDirection: "column" }}>
              <div style={{ fontSize: 64, fontWeight: 900, letterSpacing: -1.2 }}>
                VoiceFleet
              </div>
              <div style={{ fontSize: 26, color: "rgba(11,18,32,0.72)" }}>
                AI voice receptionist
              </div>
            </div>
          </div>
          <div style={{ fontSize: 86, fontWeight: 950, lineHeight: 1.02, letterSpacing: -2 }}>
            Never miss a booking.
          </div>
          <div style={{ fontSize: 34, lineHeight: 1.25, color: "rgba(11,18,32,0.78)" }}>
            Answers calls 24/7, books appointments, and escalates urgent calls for any SMB.
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          {[
            "Restaurants • Dentists • Gyms",
            "Plumbers • Clinics • Salons",
            "Calendar + booking integrations",
            "Multilingual agents",
          ].map((line) => (
            <div
              key={line}
              style={{
                padding: "18px 22px",
                borderRadius: 24,
                background: "rgba(255,255,255,0.78)",
                border: "1px solid rgba(148,163,184,0.6)",
                fontSize: 28,
                fontWeight: 750,
                color: "rgba(11,18,32,0.82)",
              }}
            >
              {line}
            </div>
          ))}
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          <div style={{ fontSize: 26, fontWeight: 800, color: "rgba(11,18,32,0.78)" }}>
            voicefleet.ai
          </div>
          <div
            style={{
              padding: "16px 22px",
              borderRadius: 999,
              background: "#1D4ED8",
              color: "white",
              fontSize: 26,
              fontWeight: 850,
              letterSpacing: -0.2,
            }}
          >
            Try the live demo
          </div>
        </div>
      </div>
    ),
    { width: 1080, height: 1920 }
  );
}
