"use client";

import dynamic from "next/dynamic";

const StickyCTABar = dynamic(
  () => import("@/components/marketing/StickyCTABar"),
  { ssr: false }
);

const ExitIntentModal = dynamic(
  () => import("@/components/marketing/ExitIntentModal"),
  { ssr: false }
);

export default function CROWidgets() {
  return (
    <>
      <StickyCTABar />
      <ExitIntentModal />
    </>
  );
}
