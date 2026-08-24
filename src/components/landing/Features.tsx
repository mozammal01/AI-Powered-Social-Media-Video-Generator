import {
  Gauge,
  Layers,
  MonitorSmartphone,
  Palette,
  WandSparkles,
  Zap,
} from "lucide-react";
import type { ComponentType } from "react";
import { GradientText, SectionHeading } from "./SectionHeading";

interface Feature {
  icon: ComponentType<{ className?: string }>;
  title: string;
  description: string;
}

const features: Feature[] = [
  {
    icon: WandSparkles,
    title: "AI script & copywriting",
    description:
      "Headlines, body copy, and CTAs written for conversion — generated from plain product notes in seconds.",
  },
  {
    icon: Layers,
    title: "Composable templates",
    description:
      "Every template is a real Remotion composition with five choreographed scenes you can tweak end-to-end.",
  },
  {
    icon: MonitorSmartphone,
    title: "Every aspect ratio",
    description:
      "One click re-flows your video for 9:16 stories, 1:1 feeds, and 16:9 landscape — no manual reframing.",
  },
  {
    icon: Zap,
    title: "Physics-based motion",
    description:
      "Spring animations tuned per scene give every cut a premium, hand-crafted feel — never robotic.",
  },
  {
    icon: Palette,
    title: "Brand kit aware",
    description:
      "Your logo, colors, and voice carry through every scene automatically for a consistent identity.",
  },
  {
    icon: Gauge,
    title: "Cloud-fast rendering",
    description:
      "Distributed renders finish in seconds and stream progress straight back to your dashboard.",
  },
];

export function Features() {
  return (
    <section id="features" className="relative scroll-mt-24 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeading
          eyebrow="Features"
          title={
            <>
              Everything you need to{" "}
              <GradientText>ship video fast</GradientText>
            </>
          }
          description="Built on the Remotion rendering engine, wrapped in an AI workflow that removes the busywork."
        />

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="group rounded-2xl border border-border/70 bg-card/50 p-7 backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-xl hover:shadow-black/20"
              >
                <span className="mb-5 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500/15 to-fuchsia-500/15 text-primary ring-1 ring-inset ring-primary/25 transition-all duration-300 group-hover:from-indigo-500/30 group-hover:to-fuchsia-500/30">
                  <Icon className="h-5 w-5" />
                </span>

                <h3 className="text-base font-semibold tracking-tight">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}