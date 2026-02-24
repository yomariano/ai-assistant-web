"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Phone, ArrowRight, CheckCircle2 } from "lucide-react";

const DemoSection = () => {
  const [formData, setFormData] = useState({
    email: "",
    company: "",
    volume: "",
    useCase: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const emailInputId = "demo-email";
  const companyInputId = "demo-company";
  const volumeSelectId = "demo-volume";
  const useCaseSelectId = "demo-use-case";

  const volumeOptions = [
    "5,000 - 10,000",
    "10,000 - 25,000",
    "25,000 - 50,000",
    "50,000 - 100,000",
    "100,000+",
  ];

  const useCaseOptions = [
    "Inbound Support",
    "Appointment Scheduling",
    "Order Status",
    "Payment Processing",
    "Lead Qualification",
    "Outbound Campaigns",
    "Other",
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setFormData({ email: "", company: "", volume: "", useCase: "" });
    setTimeout(() => setSubmitted(false), 3000);
  };

  const benefits = [
    "See real AI conversations in action",
    "Get custom ROI analysis for your operation",
    "Learn about implementation timeline",
    "No commitment required",
  ];

  return (
    <section id="demo" className="py-20 lg:py-28 bg-gradient-hero relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_70%,rgba(255,255,255,0.1),transparent)]" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Content */}
          <div className="text-primary-foreground">
            <h2 className="text-3xl lg:text-4xl font-heading font-bold mb-4">
              See VoiceFleet in Action
            </h2>
            <p className="text-lg text-primary-foreground/80 mb-8">
              30-minute demo. See real calls. Get custom ROI analysis.
            </p>

            <ul className="space-y-4 mb-8">
              {benefits.map((benefit, i) => (
                <li key={i} className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0" />
                  <span className="text-primary-foreground/90">{benefit}</span>
                </li>
              ))}
            </ul>

            {process.env.NEXT_PUBLIC_DEMO_PHONE_NUMBER && (
              <div className="flex items-center gap-3 p-4 bg-primary-foreground/10 rounded-xl backdrop-blur-sm">
                <Phone className="w-6 h-6 text-accent" />
                <div>
                  <p className="text-sm text-primary-foreground/70">Prefer to talk now?</p>
                  <a href={`tel:${process.env.NEXT_PUBLIC_DEMO_PHONE_NUMBER}`} className="text-lg font-semibold hover:underline">
                    {process.env.NEXT_PUBLIC_DEMO_PHONE_NUMBER}
                  </a>
                </div>
              </div>
            )}
          </div>

          {/* Form */}
          <div className="bg-card rounded-2xl p-8 shadow-xl">
            <h3 className="text-xl font-heading font-bold text-foreground mb-6">
              Book Your Demo
            </h3>

            {submitted ? (
              <div className="text-center py-8">
                <CheckCircle2 className="w-12 h-12 text-accent mx-auto mb-4" />
                <h4 className="text-lg font-semibold text-foreground mb-2">Demo request received!</h4>
                <p className="text-muted-foreground">Our team will contact you within 24 hours.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label htmlFor={emailInputId} className="block text-sm font-medium text-foreground mb-2">
                    Work Email *
                  </label>
                  <input
                    id={emailInputId}
                    name="email"
                    aria-label="Work email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                    placeholder="name at company dot com"
                  />
                </div>

                <div>
                  <label htmlFor={companyInputId} className="block text-sm font-medium text-foreground mb-2">
                    Company *
                  </label>
                  <input
                    id={companyInputId}
                    name="company"
                    aria-label="Company"
                    type="text"
                    required
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                    placeholder="Your company name"
                  />
                </div>

                <div>
                  <label htmlFor={volumeSelectId} className="block text-sm font-medium text-foreground mb-2">
                    Monthly Call Volume
                  </label>
                  <select
                    id={volumeSelectId}
                    name="volume"
                    aria-label="Monthly call volume"
                    value={formData.volume}
                    onChange={(e) => setFormData({ ...formData, volume: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                  >
                    <option value="">Select volume</option>
                    {volumeOptions.map((option) => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor={useCaseSelectId} className="block text-sm font-medium text-foreground mb-2">
                    Primary Use Case
                  </label>
                  <select
                    id={useCaseSelectId}
                    name="useCase"
                    aria-label="Primary use case"
                    value={formData.useCase}
                    onChange={(e) => setFormData({ ...formData, useCase: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                  >
                    <option value="">Select use case</option>
                    {useCaseOptions.map((option) => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </div>

                <Button type="submit" variant="hero" size="xl" className="w-full">
                  Book Your Demo
                  <ArrowRight className="w-5 h-5" />
                </Button>

                <p className="text-xs text-muted-foreground text-center">
                  By submitting, you agree to our Privacy Policy and Terms of Service.
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default DemoSection;
