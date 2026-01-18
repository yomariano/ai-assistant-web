import { ImageResponse } from "next/og";

export const runtime = "edge";

export const size = {
  width: 1200,
  height: 600,
};

export const contentType = "image/png";

export default function TwitterImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: 72,
          background:
            "radial-gradient(900px 600px at 20% 15%, rgba(29,78,216,0.22), transparent 60%), radial-gradient(900px 600px at 80% 35%, rgba(16,185,129,0.18), transparent 60%), linear-gradient(180deg, #F8FAFC 0%, #F1F5F9 100%)",
          color: "#0B1220",
          fontFamily:
            "ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 18, maxWidth: 760 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div
              style={{
                width: 88,
                height: 88,
                borderRadius: 24,
                background: "linear-gradient(135deg, #1D4ED8 0%, #10B981 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg width="60" height="60" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M166 172L256 318L346 172" stroke="white" strokeWidth="44" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M124 210C102 232 102 280 124 302" stroke="white" strokeOpacity="0.9" strokeWidth="18" strokeLinecap="round" />
                <path d="M388 210C410 232 410 280 388 302" stroke="white" strokeOpacity="0.9" strokeWidth="18" strokeLinecap="round" />
                <circle cx="256" cy="356" r="10" fill="white" fillOpacity="0.9" />
              </svg>
            </div>
            <div style={{ fontSize: 44, fontWeight: 850, letterSpacing: -1 }}>
              VoiceFleet
            </div>
          </div>

          <div style={{ fontSize: 58, fontWeight: 850, lineHeight: 1.05, letterSpacing: -1.4 }}>
            AI receptionist for phone calls.
          </div>
          <div style={{ fontSize: 26, lineHeight: 1.25, color: "rgba(11,18,32,0.78)" }}>
            Books appointments, answers FAQs, and escalates urgent calls for restaurants, dentists, gyms, plumbers, and more.
          </div>
        </div>

        <div
          style={{
            width: 320,
            height: 320,
            borderRadius: 64,
            background: "linear-gradient(135deg, rgba(29,78,216,0.14) 0%, rgba(16,185,129,0.14) 100%)",
            border: "1px solid rgba(148,163,184,0.6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              width: 240,
              height: 240,
              borderRadius: 72,
              background: "linear-gradient(135deg, #1D4ED8 0%, #10B981 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg width="150" height="150" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M166 172L256 318L346 172" stroke="white" strokeWidth="44" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M94 186C60 222 60 290 94 326" stroke="white" strokeOpacity="0.55" strokeWidth="14" strokeLinecap="round" />
              <path d="M418 186C452 222 452 290 418 326" stroke="white" strokeOpacity="0.55" strokeWidth="14" strokeLinecap="round" />
              <circle cx="256" cy="356" r="10" fill="white" fillOpacity="0.9" />
            </svg>
          </div>
        </div>
      </div>
    ),
    size
  );
}

