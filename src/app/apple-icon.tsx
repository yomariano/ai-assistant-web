import { ImageResponse } from "next/og";

export const runtime = "edge";

export const size = {
  width: 180,
  height: 180,
};

export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 40,
          background: "linear-gradient(135deg, #1D4ED8 0%, #10B981 100%)",
        }}
      >
        <svg width="120" height="120" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M166 172L256 318L346 172" stroke="white" strokeWidth="44" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M94 186C60 222 60 290 94 326" stroke="white" strokeOpacity="0.55" strokeWidth="14" strokeLinecap="round" />
          <path d="M418 186C452 222 452 290 418 326" stroke="white" strokeOpacity="0.55" strokeWidth="14" strokeLinecap="round" />
          <circle cx="256" cy="356" r="10" fill="white" fillOpacity="0.9" />
        </svg>
      </div>
    ),
    size
  );
}

