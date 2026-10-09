"use client";

import { useScrollReveal } from "@/hooks/useScrollReveal";
import { Hero } from "@/components/features/home/Hero";
import { AboutPreview } from "@/components/features/home/AboutPreview";
import { SejarahPreview } from "@/components/features/home/SejarahPreview";
import { DocumentationPreview } from "@/components/features/home/DocumentationPreview";
import { ScrollProgressWidget } from "@/components/ui/ScrollProgressWidget";

export default function HomePage() {
  const revealRef = useScrollReveal();

  return (
    <div className="w-full page-transition relative" ref={revealRef}>
      {/* Hero — always visible */}
      <Hero />


      {/* About & Mandate Feature */}
      <div data-reveal="section" className="scroll-reveal delay-1">
        <AboutPreview />
      </div>

      {/* Interactive Milestone Timeline */}
      <div data-reveal="section" className="scroll-reveal delay-1">
        <SejarahPreview />
      </div>

      {/* Documentation & Field Gallery */}
      <div data-reveal="section" className="scroll-reveal delay-2">
        <DocumentationPreview />
      </div>

      <ScrollProgressWidget />
    </div>
  );
}
