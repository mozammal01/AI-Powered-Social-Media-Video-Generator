import { PenLine, Rocket, WandSparkles } from "lucide-react";
import type { ComponentType } from "react";
import { GradientText, SectionHeading } from "./SectionHeading";

interface Step {
  number: string;
  icon: ComponentType<{ className?: string }>;
  title: string;
  description: string;
}

const steps: Step[] = [
  {
    number: "01",
    icon: PenLine,
    title: "Describe your product",
    description:
      "Paste a link, drop in product details, or type a rough idea. The AI turns it into a structured video brief in seconds.",
  },
  {
    number: "02",
    icon: WandSparkles,
    title: "Let AI build the scenes",
    description:
      "VividAI writes the script, picks a template, and choreographs spring animations, captions, and CTAs automatically.",
  },
  {
    number: "03",
    icon: Rocket,
    title: "Render & share everywhere",
    description:
      "Export a crisp MP4 sized for TikTok, Reels, Shorts, and feeds — then download it or publish straight away.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="relative scroll-mt-24 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeading
          eyebrow="How It Works"
          title={
            <>
              From prompt to post in <GradientText>three steps</GradientText>
            </>
          }
          description="A complete video pipeline without a single timeline. Describe, generate, ship."
        />

        <div className="relative mt-16">
          {/* Connector line (desktop only) */}
          <div
            aria-hidden
            className="absolute inset-x-24 top-14 hidden border-t-2 border-dashed border-border/60 lg:block"
          />

          <div className="grid gap-6 md:grid-cols-3">
            {steps.map((step) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.number}
                  className="group relative rounded-2xl border border-border/70 bg-card/50 p-8 backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-xl hover:shadow-black/20"
                >
                  <span className="absolute right-6 top-6 font-mono text-sm font-semibold text-muted-foreground/40 transition-colors group-hover:text-primary/50">
                    {step.number}
                  </span>

                  <span className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500/15 to-fuchsia-500/15 text-primary ring-1 ring-inset ring-primary/25 transition-all duration-300 group-hover:from-indigo-500/30 group-hover:to-fuchsia-500/30">
                    <Icon className="h-5 w-5" />
                  </span>

                  <h3 className="text-lg font-semibold tracking-tight">
                    {step.title}
                  </h3>
                  <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">
                    {step.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}