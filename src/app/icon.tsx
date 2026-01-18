import { ImageResponse } from "next/og";

export const runtime = "edge";

export const size = {
  width: 64,
  height: 64,
};

export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 16,
          background: "linear-gradient(135deg, #1D4ED8 0%, #10B981 100%)",
        }}
      >
        <svg width="44" height="44" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M166 172L256 318L346 172" stroke="white" strokeWidth="52" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="256" cy="356" r="14" fill="white" fillOpacity="0.9" />
        </svg>
      </div>
    ),
    size
  );
}

