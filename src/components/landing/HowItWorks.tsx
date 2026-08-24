"use client";

import { Download, Layers, MonitorPlay, PenLine } from "lucide-react";
import type { ComponentType } from "react";
import { motion, type Variants } from "framer-motion";
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
    title: "Enter Content",
    description:
      "Paste a link or drop in product details — name, features, pricing, and your call-to-action.",
  },
  {
    number: "02",
    icon: Layers,
    title: "Choose Template",
    description:
      "Pick a proven format sized for stories, feed posts, or landscape placements.",
  },
  {
    number: "03",
    icon: MonitorPlay,
    title: "Live Preview",
    description:
      "Watch AI copy and spring animations assemble every scene in real time before you commit.",
  },
  {
    number: "04",
    icon: Download,
    title: "Export Video",
    description:
      "Render a crisp MP4 in seconds and download it ready to publish anywhere.",
  },
];

/* ─── Scroll-reveal choreography ────────────────────────────────────────── */

const EASE_OUT: [number, number, number, number] = [0.21, 0.47, 0.32, 0.98];

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.14 } },
};

const cardReveal: Variants = {
  hidden: { opacity: 0, y: 32 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: EASE_OUT },
  },
};

export function HowItWorks() {
  return (
    <section id="how-it-works" className="relative scroll-mt-24 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeading
          eyebrow="How It Works"
          title={
            <>
              From prompt to post in{" "}
              <GradientText>four steps</GradientText>
            </>
          }
          description="A complete video pipeline without a single timeline. Enter, choose, preview, export."
        />

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          className="relative mt-16"
        >
          {/* Connector line (desktop only) */}
          <div
            aria-hidden
            className="absolute inset-x-16 top-14 hidden border-t-2 border-dashed border-border/60 lg:block"
          />

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={step.number}
                  variants={cardReveal}
                  className="group relative rounded-2xl border border-border/70 bg-card/50 p-7 backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-xl hover:shadow-black/20"
                >
                  <span className="absolute right-5 top-5 font-mono text-sm font-semibold text-muted-foreground/40 transition-colors group-hover:text-primary/50">
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
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
}