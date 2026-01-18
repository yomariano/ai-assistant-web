import { ImageResponse } from "next/og";

export const runtime = "edge";

function LogoMark({ sizePx }: { sizePx: number }) {
  const outerRadius = Math.round(sizePx * 0.28);
  return (
    <div
      style={{
        width: sizePx,
        height: sizePx,
        borderRadius: outerRadius,
        background: "linear-gradient(135deg, #1D4ED8 0%, #10B981 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <svg
        width={Math.round(sizePx * 0.7)}
        height={Math.round(sizePx * 0.7)}
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
          d="M124 210C102 232 102 280 124 302"
          stroke="white"
          strokeOpacity="0.9"
          strokeWidth="18"
          strokeLinecap="round"
        />
        <path
          d="M94 186C60 222 60 290 94 326"
          stroke="white"
          strokeOpacity="0.55"
          strokeWidth="14"
          strokeLinecap="round"
        />
        <path
          d="M388 210C410 232 410 280 388 302"
          stroke="white"
          strokeOpacity="0.9"
          strokeWidth="18"
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
          padding: 92,
          background:
            "radial-gradient(1200px 800px at 18% 12%, rgba(29,78,216,0.22), transparent 60%), radial-gradient(1200px 800px at 82% 28%, rgba(16,185,129,0.18), transparent 60%), linear-gradient(180deg, #F8FAFC 0%, #F1F5F9 100%)",
          color: "#0B1220",
          fontFamily:
            "ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
          <LogoMark sizePx={132} />
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 60, fontWeight: 850, letterSpacing: -1 }}>
              VoiceFleet
            </div>
            <div style={{ fontSize: 24, color: "rgba(11,18,32,0.72)" }}>
              AI voice receptionist for SMBs
            </div>
          </div>
        </div>

        <div style={{ maxWidth: 1200 }}>
          <div style={{ fontSize: 78, fontWeight: 900, lineHeight: 1.03, letterSpacing: -1.7 }}>
            Answer every call.
            <span style={{ color: "#1D4ED8" }}> Book more appointments.</span>
          </div>
          <div style={{ marginTop: 22, fontSize: 34, lineHeight: 1.28, color: "rgba(11,18,32,0.78)" }}>
            Handles bookings, FAQs, and urgent escalations—plus calendar and booking integrations.
          </div>
        </div>

        <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
          {["24/7 phone coverage", "Appointments & reservations", "Instant summaries", "Integrations"].map((label) => (
            <div
              key={label}
              style={{
                padding: "14px 18px",
                borderRadius: 999,
                background: "rgba(255,255,255,0.75)",
                border: "1px solid rgba(148,163,184,0.6)",
                fontSize: 22,
                fontWeight: 650,
                color: "rgba(11,18,32,0.78)",
              }}
            >
              {label}
            </div>
          ))}
        </div>
      </div>
    ),
    { width: 1600, height: 900 }
  );
}
