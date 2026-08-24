"use client";

import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Play,
  Sparkles,
  WandSparkles,
} from "lucide-react";
import { MotionConfig, motion, type Variants } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

/* ─── Entrance choreography ─────────────────────────────────────────────── */

const EASE_OUT: [number, number, number, number] = [0.21, 0.47, 0.32, 0.98];

const textContainer: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.05 } },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: EASE_OUT },
  },
};

const riseIn = (delay: number) => ({
  initial: { opacity: 0, y: 28 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, delay, ease: EASE_OUT },
});

const timelineScenes = [
  { label: "Intro", duration: "0:00 – 0:02", width: "20%", color: "from-indigo-500 to-indigo-400" },
  { label: "Headline", duration: "0:02 – 0:05", width: "30%", color: "from-purple-500 to-purple-400" },
  { label: "Features", duration: "0:05 – 0:09", width: "40%", color: "from-fuchsia-500 to-fuchsia-400" },
  { label: "CTA", duration: "0:09 – 0:10", width: "10%", color: "from-pink-500 to-pink-400" },
];

export function Hero() {
  return (
    <MotionConfig reducedMotion="user">
      <section className="relative overflow-hidden">
        {/* Ambient background: glows + grid */}
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div className="absolute -top-48 left-1/2 h-[520px] w-[860px] max-w-full -translate-x-1/2 rounded-full bg-indigo-600/20 blur-[130px]" />
          <div className="absolute top-64 -left-40 h-96 w-96 rounded-full bg-fuchsia-600/10 blur-[110px]" />
          <div className="absolute top-80 -right-40 h-96 w-96 rounded-full bg-purple-600/10 blur-[110px]" />
          <div
            className="absolute inset-0 [mask-image:radial-gradient(ellipse_70%_60%_at_50%_0%,black_35%,transparent_75%)]"
            style={{
              backgroundImage:
                "linear-gradient(to right, rgb(255 255 255 / 0.045) 1px, transparent 1px), linear-gradient(to bottom, rgb(255 255 255 / 0.045) 1px, transparent 1px)",
              backgroundSize: "56px 56px",
            }}
          />
        </div>

        <div className="relative mx-auto max-w-7xl px-6 pb-24 pt-36 sm:pt-40 lg:pb-28 lg:pt-44">
          {/* Copy */}
          <motion.div
            variants={textContainer}
            initial="hidden"
            animate="show"
            className="mx-auto max-w-3xl text-center"
          >
            <motion.span
              variants={fadeUp}
              className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-4 py-1.5 text-xs font-semibold tracking-wide text-primary backdrop-blur"
            >
              <Sparkles className="h-3.5 w-3.5" />
              AI-powered video studio
            </motion.span>

            <motion.h1
              variants={fadeUp}
              className="mt-6 text-balance text-4xl font-bold leading-[1.06] tracking-tight sm:text-5xl lg:text-6xl"
            >
              Turn ideas into{" "}
              <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-fuchsia-400 bg-clip-text text-transparent">
                scroll-stopping videos
              </span>
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="mx-auto mt-5 max-w-xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg"
            >
              VividAI scripts, designs, and renders platform-ready videos for
              TikTok, Reels & Shorts — in seconds, no editing required.
            </motion.p>

            {/* CTAs */}
            <motion.div
              variants={fadeUp}
              className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row"
            >
              <Link href="/create-video">
                <Button
                  size="lg"
                  className="w-full gap-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-fuchsia-500 text-base text-white shadow-lg shadow-purple-500/30 hover:opacity-90 sm:w-auto"
                >
                  Start Creating Free
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <a
                href="#how-it-works"
                className={cn(
                  buttonVariants({ variant: "outline", size: "lg" }),
                  "w-full gap-2 border-border/70 bg-card/50 text-base backdrop-blur hover:bg-card sm:w-auto"
                )}
              >
                <Play className="h-4 w-4 fill-current" />
                See How It Works
              </a>
            </motion.div>
          </motion.div>

          {/* Studio dashboard mockup */}
          <div className="relative mx-auto mt-16 max-w-4xl lg:mt-20">
            <div
              aria-hidden
              className="absolute -inset-x-6 -top-8 bottom-8 rounded-[2rem] bg-gradient-to-r from-indigo-600/15 via-purple-600/15 to-fuchsia-600/15 blur-2xl"
            />

            <motion.div
              {...riseIn(0.45)}
              className="relative overflow-hidden rounded-2xl border border-border/80 bg-card/70 shadow-2xl shadow-black/40 backdrop-blur"
            >
              {/* Window chrome */}
              <div className="flex items-center gap-2 border-b border-border/60 px-4 py-3">
                <span className="flex gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-red-500/70" />
                  <span className="h-2.5 w-2.5 rounded-full bg-yellow-500/70" />
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/70" />
                </span>
                <span className="mx-auto rounded-md border border-border/60 bg-muted/50 px-3 py-1 font-mono text-[11px] text-muted-foreground">
                  vividai.studio/create
                </span>
                <span className="hidden w-14 sm:block" aria-hidden />
              </div>

              <div className="grid gap-5 p-4 sm:p-6 md:grid-cols-[210px_1fr] md:gap-6">
                {/* Phone preview */}
                <motion.div
                  {...riseIn(0.65)}
                  className="relative mx-auto w-full max-w-[210px]"
                >
                  <div className="relative aspect-[9/16] overflow-hidden rounded-xl border border-primary/25 bg-slate-950 shadow-inner">
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/25 via-transparent to-fuchsia-600/25" />
                    {/* Slow ambient pulse over the screen */}
                    <motion.div
                      aria-hidden
                      className="absolute inset-0 bg-gradient-to-t from-fuchsia-600/30 via-transparent to-indigo-600/30"
                      animate={{ opacity: [0.35, 0.7, 0.35] }}
                      transition={{
                        duration: 6,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    />
                    <div className="relative flex h-full flex-col justify-between p-3.5">
                      {/* brand row */}
                      <div className="flex items-center gap-1.5">
                        <span className="h-4 w-4 rounded bg-gradient-to-br from-indigo-400 to-fuchsia-400" />
                        <span className="text-[10px] font-semibold text-white/85">
                          NovaSpark
                        </span>
                      </div>
                      {/* headline */}
                      <div className="space-y-1.5">
                        <p className="text-sm font-bold leading-tight text-white">
                          Launch Smarter.
                          <br />
                          Grow Faster.
                        </p>
                        <span className="block h-1 w-14 rounded-full bg-gradient-to-r from-indigo-400 to-fuchsia-400" />
                      </div>
                      {/* feature pills */}
                      <div className="space-y-1.5">
                        <div className="rounded-md bg-white/10 px-2 py-1.5 text-[9px] font-medium text-white/80 backdrop-blur-sm">
                          AI campaign automation
                        </div>
                        <div className="rounded-md bg-white/10 px-2 py-1.5 text-[9px] font-medium text-white/80 backdrop-blur-sm">
                          Real-time analytics
                        </div>
                      </div>
                      {/* CTA */}
                      <div className="rounded-full bg-gradient-to-r from-indigo-500 to-fuchsia-500 py-2 text-center text-[10px] font-bold text-white">
                        Start Free Trial
                      </div>
                    </div>
                    {/* play overlay */}
                    <button
                      type="button"
                      tabIndex={-1}
                      aria-label="Play preview video"
                      className="absolute inset-0 m-auto flex h-12 w-12 cursor-default items-center justify-center rounded-full border border-white/25 bg-black/45 backdrop-blur-md transition-colors hover:bg-black/60"
                    >
                      <Play className="ml-0.5 h-5 w-5 fill-white text-white" />
                    </button>
                  </div>
                </motion.div>

                {/* Right column: script + timeline + render */}
                <div className="min-w-0 space-y-4">
                  {/* AI script card (existing Card primitive) */}
                  <motion.div {...riseIn(0.75)}>
                    <Card className="bg-background/60 p-4 backdrop-blur">
                      <div className="mb-2.5 flex items-center justify-between gap-2">
                        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-foreground">
                          <WandSparkles className="h-3.5 w-3.5 text-primary" />
                          AI Script
                        </span>
                        <span className="rounded-full border border-emerald-500/25 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-400">
                          Ready
                        </span>
                      </div>
                      <p className="text-xs leading-relaxed text-muted-foreground">
                        &ldquo;Meet NovaSpark Pro — the AI growth suite that
                        runs your campaigns while you build. Launch smarter,
                        grow faster.&rdquo;
                      </p>
                    </Card>
                  </motion.div>

                  {/* Timeline (existing Card primitive) */}
                  <motion.div {...riseIn(0.85)}>
                    <Card className="bg-background/60 p-4 backdrop-blur">
                      <div className="mb-3 flex items-center justify-between">
                        <span className="text-xs font-semibold">
                          Scene Timeline
                        </span>
                        <span className="font-mono text-[10px] text-muted-foreground">
                          00:10 / 00:10
                        </span>
                      </div>
                      <div className="relative flex h-7 w-full overflow-hidden rounded-md border border-border/50">
                        {timelineScenes.map((scene) => (
                          <div
                            key={scene.label}
                            style={{ width: scene.width }}
                            className={cn(
                              "flex items-center justify-center bg-gradient-to-r text-[9px] font-semibold text-white/95 first:rounded-l-[5px] last:rounded-r-[5px]",
                              scene.color
                            )}
                          >
                            <span className="truncate px-1">{scene.label}</span>
                          </div>
                        ))}
                        {/* Playback playhead sweep */}
                        <motion.div
                          aria-hidden
                          className="absolute inset-y-0 w-px bg-white/90 shadow-[0_0_8px_rgba(255,255,255,0.9)]"
                          initial={{ left: "0%" }}
                          animate={{ left: ["0%", "100%"] }}
                          transition={{
                            duration: 10,
                            repeat: Infinity,
                            ease: "linear",
                            delay: 1.6,
                          }}
                        />
                      </div>
                      <div className="mt-2 hidden justify-between font-mono text-[9px] text-muted-foreground sm:flex">
                        {timelineScenes.map((scene) => (
                          <span key={scene.label}>{scene.duration}</span>
                        ))}
                      </div>
                    </Card>
                  </motion.div>

                  {/* Render status (existing Card primitive) */}
                  <motion.div {...riseIn(0.95)}>
                    <Card className="bg-background/60 p-4 backdrop-blur">
                      <div className="mb-2.5 flex items-center justify-between text-xs">
                        <span className="font-semibold">Rendering</span>
                        <span className="font-mono text-muted-foreground">
                          1080×1920 · 30fps · MP4
                        </span>
                      </div>
                      <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                        <motion.div
                          className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-fuchsia-500"
                          initial={{ width: "12%" }}
                          animate={{ width: "78%" }}
                          transition={{
                            duration: 2.2,
                            delay: 1.3,
                            ease: EASE_OUT,
                          }}
                        />
                      </div>
                    </Card>
                  </motion.div>
                </div>
              </div>
            </motion.div>

            {/* Floating chips */}
            <motion.div
              {...riseIn(1.1)}
              className="absolute -right-3 top-12 hidden lg:block"
            >
              <motion.div
                animate={{ y: [0, -7, 0] }}
                transition={{
                  duration: 3.2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="flex items-center gap-2 rounded-full border border-border/80 bg-card/90 px-3.5 py-2 text-xs font-medium shadow-lg backdrop-blur"
              >
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                Auto captions burned in
              </motion.div>
            </motion.div>
            <motion.div
              {...riseIn(1.25)}
              className="absolute -left-3 bottom-16 hidden lg:block"
            >
              <motion.div
                animate={{ y: [0, 7, 0] }}
                transition={{
                  duration: 3.6,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.6,
                }}
                className="flex items-center gap-2 rounded-full border border-border/80 bg-card/90 px-3.5 py-2 text-xs font-medium shadow-lg backdrop-blur"
              >
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                Brand kit applied
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>
    </MotionConfig>
  );
}