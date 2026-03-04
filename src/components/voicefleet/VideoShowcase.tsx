"use client";

import { useState } from "react";
import { Play } from "lucide-react";

const VIDEO_ID = "XrPhV1WfluI";
const THUMBNAIL = `https://img.youtube.com/vi/${VIDEO_ID}/maxresdefault.jpg`;

export default function VideoShowcase() {
  const [playing, setPlaying] = useState(false);

  return (
    <section className="py-12 lg:py-16 bg-background">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-xl sm:text-2xl font-heading font-bold text-foreground mb-2">
          See How It Works
        </h2>
        <p className="text-sm text-muted-foreground mb-8">
          Watch a quick walkthrough of VoiceFleet in action.
        </p>

        {/*
          The source video is a vertical screen recording with large black bars.
          We use a 16:9 container, scale the iframe up 2.5x, and clip overflow
          so only the center content (the onboarding UI) is visible.
        */}
        <div className="mx-auto max-w-4xl">
          <div
            className="relative rounded-2xl overflow-hidden shadow-2xl ring-1 ring-border bg-card"
            style={{ aspectRatio: '16 / 9' }}
          >
            {/* Decorative glow */}
            <div className="absolute -inset-2 bg-gradient-to-br from-primary/15 via-accent/10 to-primary/15 rounded-3xl blur-2xl -z-10" />

            {playing ? (
              <div className="absolute inset-0 overflow-hidden bg-black">
                {/* Scale the iframe to zoom into the center content */}
                <iframe
                  className="absolute top-1/2 left-1/2"
                  style={{
                    width: '200%',
                    height: '200%',
                    transform: 'translate(-50%, -50%)',
                  }}
                  src={`https://www.youtube.com/embed/${VIDEO_ID}?autoplay=1&rel=0&modestbranding=1`}
                  title="How VoiceFleet Works"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            ) : (
              <button
                onClick={() => setPlaying(true)}
                className="group absolute inset-0 w-full h-full cursor-pointer"
                aria-label="Play video"
              >
                {/* Zoomed thumbnail — crop to the interesting center part */}
                <div className="absolute inset-0 overflow-hidden">
                  <img
                    src={THUMBNAIL}
                    alt="VoiceFleet walkthrough video thumbnail"
                    className="w-full h-full object-cover scale-[2] object-center"
                  />
                </div>

                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/50 group-hover:from-black/30 group-hover:via-black/10 group-hover:to-black/40 transition-colors" />

                {/* Play button */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-20 h-20 rounded-full bg-white/90 group-hover:bg-white group-hover:scale-110 transition-all flex items-center justify-center shadow-2xl">
                    <Play className="w-9 h-9 text-primary ml-1" fill="currentColor" />
                  </div>
                </div>

                {/* Bottom label */}
                <div className="absolute bottom-0 inset-x-0 p-5 bg-gradient-to-t from-black/80 to-transparent">
                  <p className="text-white text-base font-semibold">
                    Set Up Your AI Receptionist in 5 Minutes
                  </p>
                  <p className="text-white/70 text-sm mt-1">Click to play</p>
                </div>
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
