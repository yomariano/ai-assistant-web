"use client";

import { Button } from "@/components/ui/button";
import { Phone, Menu, X } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { useRegion } from "@/hooks/useRegion";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { region, loading: regionLoading } = useRegion();
  const isArgentina = region === "AR";
  const countryLabel = region === "AR" ? "Argentina" : "Ireland";

  const navLinks = [
    { label: "Features", href: "/features" },
    { label: "Industries", href: "/for" },
    { label: "Integrations", href: "/connect" },
    { label: "Compare", href: "/compare" },
    { label: "Pricing", href: "/#pricing" },
    { label: "Blog", href: "/blog" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-card/80 backdrop-blur-lg border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-emerald-500 rounded-xl flex items-center justify-center shadow-md">
              <svg width="24" height="24" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M166 172L256 318L346 172" stroke="white" strokeWidth="52" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="256" cy="356" r="14" fill="white" fillOpacity="0.9" />
              </svg>
            </div>
            <div className="flex items-center gap-2.5">
              <span className="text-xl font-heading font-bold text-foreground">VoiceFleet</span>
              {!regionLoading && (
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-semibold leading-none transition-colors ${
                    isArgentina
                      ? "border-sky-200 bg-sky-50 text-sky-700"
                      : "border-emerald-200 bg-emerald-50 text-emerald-700"
                  }`}
                >
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${
                      isArgentina ? "bg-sky-500" : "bg-emerald-500"
                    }`}
                  />
                  {countryLabel}
                </span>
              )}
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) =>
              link.href.startsWith("#") ? (
                <a
                  key={link.label}
                  href={link.href}
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  {link.label}
                </a>
              ) : (
                <Link
                  key={link.label}
                  href={link.href}
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  {link.label}
                </Link>
              )
            )}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden lg:flex items-center gap-4">
            <a href="tel:+35312345678" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              +353 1 234 5678
            </a>
            <a
              href="https://calendly.com/voicefleet"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="default" size="default">
                Book a Demo
              </Button>
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 text-foreground"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden py-4 border-t border-border animate-fade-in">
            <nav className="flex flex-col gap-4">
              {navLinks.map((link) =>
                link.href.startsWith("#") ? (
                  <a
                    key={link.label}
                    href={link.href}
                    className="text-base font-medium text-muted-foreground hover:text-foreground transition-colors py-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {link.label}
                  </a>
                ) : (
                  <Link
                    key={link.label}
                    href={link.href}
                    className="text-base font-medium text-muted-foreground hover:text-foreground transition-colors py-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                )
              )}
              <div className="pt-4 border-t border-border space-y-3">
                <a
                  href="tel:+35312345678"
                  className="flex items-center justify-center gap-2 text-base font-medium text-muted-foreground hover:text-foreground transition-colors py-2"
                >
                  <Phone className="w-4 h-4" />
                  +353 1 234 5678
                </a>
                <a
                  href="https://calendly.com/voicefleet"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
                  <Button variant="default" size="lg" className="w-full">
                    Book a Demo
                  </Button>
                </a>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
