import Image from "next/image";

const pressLogos = [
  { src: "/press/producthunt.svg", alt: "Product Hunt", width: 160 },
  { src: "/press/devto.svg", alt: "DEV.to", width: 120 },
  { src: "/press/medium.svg", alt: "Medium", width: 130 },
];

const AsSeenOnSection = () => {
  if (process.env.NEXT_PUBLIC_SHOW_PRESS_SECTION !== "true") {
    return null;
  }

  return (
    <section className="py-8 lg:py-10 bg-muted/30 border-y border-border/50">
      <div className="container mx-auto px-4">
        <p className="text-center text-xs font-medium uppercase tracking-widest text-muted-foreground mb-6">
          As Seen On
        </p>
        <div className="flex flex-wrap justify-center items-center gap-8 lg:gap-12">
          {pressLogos.map((logo) => (
            <div
              key={logo.alt}
              className="flex items-center justify-center h-10 grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all duration-300"
            >
              <Image
                src={logo.src}
                alt={logo.alt}
                width={logo.width}
                height={40}
                className="object-contain h-8 w-auto"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AsSeenOnSection;
