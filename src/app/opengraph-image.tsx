import { ImageResponse } from "next/og";

export const runtime = "edge";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

function LogoMark() {
  return (
    <div
      style={{
        width: 120,
        height: 120,
        borderRadius: 32,
        background: "linear-gradient(135deg, #1D4ED8 0%, #10B981 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <svg
        width="84"
        height="84"
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

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background:
            "radial-gradient(900px 600px at 20% 15%, rgba(29,78,216,0.20), transparent 60%), radial-gradient(900px 600px at 80% 25%, rgba(16,185,129,0.20), transparent 60%), linear-gradient(180deg, #F8FAFC 0%, #F1F5F9 100%)",
          color: "#0B1220",
          fontFamily:
            "ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <LogoMark />
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 52, fontWeight: 800, letterSpacing: -1 }}>
              VoiceFleet
            </div>
            <div style={{ fontSize: 22, color: "rgba(11,18,32,0.72)" }}>
              AI Voice Receptionist for SMBs
            </div>
          </div>
        </div>

        <div style={{ maxWidth: 980 }}>
          <div style={{ fontSize: 64, fontWeight: 850, lineHeight: 1.05, letterSpacing: -1.5 }}>
            Answer every call.
            <span style={{ color: "#1D4ED8" }}> Book more appointments.</span>
          </div>
          <div style={{ marginTop: 18, fontSize: 28, lineHeight: 1.3, color: "rgba(11,18,32,0.78)" }}>
            Forward your number to VoiceFleet. We handle bookings, FAQs, and urgent escalations—with integrations for calendars and booking systems.
          </div>
        </div>

        <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
          {[
            "24/7 call answering",
            "Appointments & reservations",
            "Instant call summaries",
            "Google Calendar + Outlook + booking tools",
          ].map((label) => (
            <div
              key={label}
              style={{
                padding: "12px 16px",
                borderRadius: 999,
                background: "rgba(255,255,255,0.75)",
                border: "1px solid rgba(148,163,184,0.6)",
                fontSize: 20,
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
    size
  );
}

