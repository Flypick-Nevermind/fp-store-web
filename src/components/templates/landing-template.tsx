"use client";

import {
  HeroFlightBanner,
  HowItWorksSection,
  IntakeTabs,
} from "@/components/organisms";

export function LandingTemplate() {
  return (
    <div className="py-8 sm:py-12 space-y-16">
      <HeroFlightBanner />
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <IntakeTabs />
      </section>
      <HowItWorksSection />
    </div>
  );
}
