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
    <div className="w-full" ref={revealRef}>
      <Hero />
      <AboutPreview />
      <SejarahPreview />
      <DocumentationPreview />
      <ScrollProgressWidget />
    </div>
  );
}
