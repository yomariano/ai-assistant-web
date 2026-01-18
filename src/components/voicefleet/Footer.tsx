import { Phone, Mail } from "lucide-react";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="bg-gradient-dark text-primary-foreground">
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
          {/* Brand */}
          <div className="flex flex-col gap-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-primary-foreground/10 rounded-xl flex items-center justify-center">
                <Phone className="w-5 h-5 text-accent" />
              </div>
              <span className="text-xl font-heading font-bold">VoiceFleet</span>
            </Link>
            <p className="text-sm text-primary-foreground/70 max-w-xs">
              AI voice receptionist for small businesses. Answer calls, take messages, and book appointments.
            </p>
            <a
              href="mailto:hello@voicefleet.ai"
              className="flex items-center gap-2 text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors"
            >
              <Mail className="w-4 h-4" />
              hello@voicefleet.ai
            </a>
          </div>

          {/* Links */}
          <div className="flex flex-wrap gap-x-8 gap-y-4 text-sm">
            <Link href="/features" className="text-primary-foreground/70 hover:text-primary-foreground transition-colors">
              Features
            </Link>
            <Link href="/for" className="text-primary-foreground/70 hover:text-primary-foreground transition-colors">
              Industries
            </Link>
            <Link href="/connect" className="text-primary-foreground/70 hover:text-primary-foreground transition-colors">
              Integrations
            </Link>
            <Link href="/compare" className="text-primary-foreground/70 hover:text-primary-foreground transition-colors">
              Compare
            </Link>
            <a href="#pricing" className="text-primary-foreground/70 hover:text-primary-foreground transition-colors">
              Pricing
            </a>
            <Link href="/blog" className="text-primary-foreground/70 hover:text-primary-foreground transition-colors">
              Blog
            </Link>
            <Link href="/privacy" className="text-primary-foreground/70 hover:text-primary-foreground transition-colors">
              Privacy
            </Link>
            <Link href="/terms" className="text-primary-foreground/70 hover:text-primary-foreground transition-colors">
              Terms
            </Link>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-primary-foreground/10">
          <p className="text-sm text-primary-foreground/60 text-center">
            © {new Date().getFullYear()} VoiceFleet. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
