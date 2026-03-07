import Link from "next/link";
import {
  UtensilsCrossed,
  Stethoscope,
  Scissors,
  PawPrint,
  Dumbbell,
  Wrench,
} from "lucide-react";

const verticals = [
  { label: "Restaurants", href: "/directory/restaurants", icon: UtensilsCrossed },
  { label: "Dentists", href: "/directory/dentists", icon: Stethoscope },
  { label: "Hair Salons", href: "/directory/salons", icon: Scissors },
  { label: "Vets", href: "/directory/vets", icon: PawPrint },
  { label: "Gyms", href: "/directory/gyms", icon: Dumbbell },
  { label: "Mechanics", href: "/directory/mechanics", icon: Wrench },
];

const DirectoryCTASection = () => {
  return (
    <section className="py-20 lg:py-28 bg-muted/50">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-heading font-bold text-foreground mb-4">
            Find Businesses{" "}
            <span className="text-gradient-primary">Near You</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Browse 4,500+ Irish &amp; Argentine businesses across 15 industries
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {verticals.map((v) => (
            <Link
              key={v.href}
              href={v.href}
              className="group relative bg-card rounded-xl border border-border p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 flex items-center gap-4"
            >
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                <v.icon className="w-6 h-6 text-primary" />
              </div>
              <span className="text-lg font-heading font-bold text-foreground">
                {v.label}
              </span>
            </Link>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link
            href="/directory"
            className="inline-flex items-center gap-2 text-sm font-semibold text-accent hover:text-accent/80 transition-colors"
          >
            View all industries &rarr;
          </Link>
        </div>
      </div>
    </section>
  );
};

export default DirectoryCTASection;
