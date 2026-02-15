import { Metadata } from "next";
import dynamic from "next/dynamic";
import { generatePageMetadata } from "@/lib/seo/metadata";
import Header from "@/components/voicefleet/Header";
import Footer from "@/components/voicefleet/Footer";

const DemoPage = dynamic(() => import("@/components/demo/DemoPage"), {
  ssr: false,
});

export const metadata: Metadata = {
  ...generatePageMetadata({
    title: "Interactive Demo - See AI Booking in Action",
    description:
      "Try VoiceFleet's AI receptionist live. Pick your industry, set your availability, and watch the AI book appointments on your calendar in real-time.",
    path: "/demo",
  }),
  alternates: {
    canonical: "https://voicefleet.ai/demo",
  },
};

export default function DemoRoute() {
  return (
    <>
      <Header />
      <DemoPage />
      <Footer />
    </>
  );
}
