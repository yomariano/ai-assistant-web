import { Metadata } from "next";
import { generatePageMetadata } from "@/lib/seo/metadata";
import Header from "@/components/voicefleet/Header";
import Footer from "@/components/voicefleet/Footer";
import DemoPage from "@/components/demo/DemoPage";

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
