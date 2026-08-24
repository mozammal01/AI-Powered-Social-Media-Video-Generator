import type { Metadata } from "next";
import { Navbar } from "@/components/landing/Navbar";
import { Hero } from "@/components/landing/Hero";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { TemplatesSection } from "@/components/landing/TemplatesSection";
import { Features } from "@/components/landing/Features";
import { Faq } from "@/components/landing/Faq";
import { Footer } from "@/components/landing/Footer";

export const metadata: Metadata = {
  title: "VividAI — Turn Ideas Into Scroll-Stopping Videos",
  description:
    "VividAI is the AI-powered studio that turns product briefs into platform-ready social media videos for TikTok, Reels, and Shorts — scripted, animated, and rendered in seconds.",
};

/**
 * Marketing landing page.
 *
 * Lives at its own route so the existing app (root redirect to
 * /dashboard, dashboard, editor) stays untouched. The `dark` class
 * on the wrapper activates the dark theme design tokens from
 * globals.css for everything inside this page only.
 */
export default function LandingPage() {
  return (
    <div className="dark min-h-screen bg-background text-foreground antialiased selection:bg-primary/30 selection:text-foreground">
      <Navbar />
      <main>
        <Hero />
        <HowItWorks />
        <TemplatesSection />
        <Features />
        <Faq />
      </main>
      <Footer />
    </div>
  );
}