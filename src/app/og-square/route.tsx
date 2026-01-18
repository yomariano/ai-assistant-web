import { ImageResponse } from "next/og";

export const runtime = "edge";

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background:
            "radial-gradient(900px 900px at 25% 20%, rgba(29,78,216,0.24), transparent 60%), radial-gradient(900px 900px at 80% 35%, rgba(16,185,129,0.22), transparent 60%), linear-gradient(180deg, #F8FAFC 0%, #F1F5F9 100%)",
          fontFamily:
            "ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial",
          color: "#0B1220",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 26,
          }}
        >
          <div
            style={{
              width: 360,
              height: 360,
              borderRadius: 96,
              background: "linear-gradient(135deg, #1D4ED8 0%, #10B981 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 30px 80px rgba(11,18,32,0.18)",
            }}
          >
            <svg
              width="240"
              height="240"
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

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 10,
            }}
          >
            <div style={{ fontSize: 68, fontWeight: 900, letterSpacing: -1.5 }}>
              VoiceFleet
            </div>
            <div
              style={{
                fontSize: 28,
                color: "rgba(11,18,32,0.78)",
                textAlign: "center",
                maxWidth: 860,
              }}
            >
              AI voice receptionist for phone calls. Book appointments, answer
              FAQs, and escalate urgent calls.
            </div>
          </div>
        </div>
      </div>
    ),
    { width: 1200, height: 1200 }
  );
}

