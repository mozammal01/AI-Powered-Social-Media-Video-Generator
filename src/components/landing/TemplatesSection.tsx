"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Clock,
  Eye,
  Layers,
  MonitorSmartphone,
  X,
} from "lucide-react";
import { AnimatePresence, motion, type Variants } from "framer-motion";
import { Button } from "@/components/ui/button";
import { GradientText, SectionHeading } from "./SectionHeading";
import {
  templateList,
  type TemplateMetadata,
} from "@/remotion/templates";

/* ─── Scroll-reveal choreography ────────────────────────────────────────── */

const EASE_OUT: [number, number, number, number] = [0.21, 0.47, 0.32, 0.98];

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

const cardReveal: Variants = {
  hidden: { opacity: 0, y: 32 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: EASE_OUT },
  },
};

/* ─── Section ───────────────────────────────────────────────────────────── */

const HOME_TEMPLATE_LIMIT = 6;

export function TemplatesSection() {
  const [active, setActive] = useState<TemplateMetadata | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  const displayedTemplates = templateList.slice(0, HOME_TEMPLATE_LIMIT);
  const hasMore = templateList.length > HOME_TEMPLATE_LIMIT;

  // Escape-to-close + body scroll lock + initial focus while modal is open.
  // biome-ignore lint/correctness/useExhaustiveDependencies: active toggles effect
  useState(() => {
    if (!active) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setActive(null);
    };
    document.addEventListener("keydown", onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  });

  return (
    <section id="templates" className="relative scroll-mt-24 py-24 sm:py-32">
      {/* Ambient tint */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div className="absolute left-1/2 top-1/2 h-[420px] w-[720px] max-w-full -translate-x-1/2 -translate-y-1/2 rounded-full bg-purple-600/[0.07] blur-[120px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6">
        <SectionHeading
          eyebrow="Templates"
          title={
            <>
              Start from a <GradientText>proven format</GradientText>
            </>
          }
          description="Five signature formats, each a fully choreographed Remotion composition. Preview one to see it in action."
        />

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {displayedTemplates.map((template) => (
            <motion.button
              key={template.id}
              type="button"
              variants={cardReveal}
              onClick={() => setActive(template)}
              aria-haspopup="dialog"
              aria-label={`Preview ${template.name} template`}
              className="group block w-full cursor-pointer overflow-hidden rounded-xl border border-border bg-card text-left shadow-md shadow-black/8 transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-lg hover:shadow-black/12 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {/* Artwork */}
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-950">
                <img
                  src={template.thumbnailUrl}
                  alt={`${template.name} preview`}
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                {/* Scene bars */}
                <div
                  aria-hidden
                  className="absolute inset-x-5 bottom-4 space-y-1.5"
                >
                  <span className="block h-1.5 w-3/4 rounded-full bg-white/30" />
                  <span className="block h-1.5 w-1/2 rounded-full bg-white/20" />
                  <span className="block h-1.5 w-2/3 rounded-full bg-white/15" />
                </div>
                {/* Soft glow */}
                <div
                  aria-hidden
                  className="absolute -right-8 -top-8 h-36 w-36 rounded-full bg-white/15 blur-2xl"
                />
                {/* Centered icon */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15 text-white ring-1 ring-inset ring-white/25 backdrop-blur-sm transition-transform duration-300 group-hover:scale-110">
                    <Layers className="h-6 w-6" />
                  </span>
                </div>
                {/* Category badge */}
                <span className="absolute left-3 top-3 rounded-full border border-white/20 bg-black/40 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur-sm">
                  {template.category}
                </span>
                {/* Hover preview affordance */}
                <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors duration-300 group-hover:bg-black/35">
                  <span className="inline-flex translate-y-2 items-center gap-1.5 rounded-full border border-white/25 bg-black/55 px-3.5 py-1.5 text-xs font-semibold text-white opacity-0 backdrop-blur transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                    <Eye className="h-3.5 w-3.5" />
                    Quick Preview
                  </span>
                </div>
              </div>

              {/* Text content */}
              <div className="space-y-1.5 p-4">
                <h3 className="text-sm font-semibold leading-snug tracking-tight">
                  {template.name}
                </h3>
                <p className="line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                  {template.description}
                </p>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 pt-1.5 text-[11px] text-muted-foreground">
                  <span className="inline-flex items-center gap-1">
                    <MonitorSmartphone className="h-3 w-3" />
                    {template.supportedAspectRatios.join(" · ")}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {Math.round(template.durationInFrames / template.fps)}s
                  </span>
                </div>
              </div>
            </motion.button>
          ))}
        </motion.div>

        {hasMore && (
          <div className="mt-10 flex justify-center">
            <Link href="/dashboard/templates">
              <Button
                variant="outline"
                size="sm"
                className="gap-2 text-xs transition-all duration-200 hover:shadow-md hover:shadow-black/10 hover:-translate-y-0.5"
              >
                See More Templates
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>
        )}

        <p className="mt-10 text-center text-sm text-muted-foreground">
          New formats ship every week — all fully customizable in the editor.
        </p>
      </div>

      {/* ── Preview modal ─────────────────────────────────────────────── */}
      <AnimatePresence>
        {active && (
          <motion.div
            key="preview-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setActive(null)}
            className="fixed inset-0 z-[60] flex items-center justify-center overflow-y-auto bg-black/70 p-4 backdrop-blur-sm sm:p-6"
          >
            <motion.div
              key="preview-panel"
              role="dialog"
              aria-modal="true"
              aria-label={`${active.name} template preview`}
              initial={{ opacity: 0, scale: 0.95, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 16 }}
              transition={{ type: "spring", stiffness: 320, damping: 28 }}
              onClick={(event) => event.stopPropagation()}
              className="relative my-auto w-full max-w-lg overflow-hidden rounded-2xl border border-border bg-card shadow-xl shadow-black/25 backdrop-blur"
            >
              {/* Header artwork */}
              <div className="relative h-44 w-full overflow-hidden bg-slate-950">
                <img
                  src={active.thumbnailUrl}
                  alt={`${active.name} preview`}
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div
                  aria-hidden
                  className="absolute -right-10 -top-10 h-44 w-44 rounded-full bg-white/15 blur-2xl"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="flex h-20 w-20 items-center justify-center rounded-3xl bg-white/15 text-white ring-1 ring-inset ring-white/25 backdrop-blur-sm">
                    <Layers className="h-9 w-9" />
                  </span>
                </div>
                <span className="absolute left-4 top-4 rounded-full border border-white/20 bg-black/40 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur-sm">
                  {active.category}
                </span>
              </div>

              {/* Close */}
              <button
                ref={closeButtonRef}
                type="button"
                onClick={() => setActive(null)}
                aria-label="Close preview"
                className="absolute right-3.5 top-3.5 inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-black/45 text-white backdrop-blur transition-colors hover:bg-black/65"
              >
                <X className="h-4 w-4" />
              </button>

              {/* Body */}
              <div className="space-y-5 p-6">
                <div>
                  <h3 className="text-xl font-bold tracking-tight">
                    {active.name}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {active.description}
                  </p>
                </div>

                {/* Meta stats */}
                <dl className="grid grid-cols-3 divide-x divide-border/60 rounded-xl border border-border/60 bg-background/60 py-3 text-center">
                  <div>
                    <dt className="text-[10px] uppercase tracking-wider text-muted-foreground">
                      Duration
                    </dt>
                    <dd className="mt-0.5 text-sm font-semibold">
                      {Math.round(active.durationInFrames / active.fps)}s
                    </dd>
                  </div>
                  <div>
                    <dt className="text-[10px] uppercase tracking-wider text-muted-foreground">
                      Ratios
                    </dt>
                    <dd className="mt-0.5 text-sm font-semibold">
                      {active.supportedAspectRatios.length}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-[10px] uppercase tracking-wider text-muted-foreground">
                      FPS
                    </dt>
                    <dd className="mt-0.5 text-sm font-semibold">
                      {active.fps}
                    </dd>
                  </div>
                </dl>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5">
                  {active.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-border/70 bg-muted/50 px-2.5 py-1 text-[11px] font-medium text-muted-foreground"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Footer actions */}
                <div className="flex flex-col gap-2 border-t border-border/60 pt-5 sm:flex-row">
                  <Link
                    href={`/create-video?template=${active.id}`}
                    className="flex-1"
                    onClick={() => setActive(null)}
                  >
                    <Button className="w-full gap-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-fuchsia-500 text-white shadow-md shadow-purple-500/30 hover:opacity-90">
                      Use This Template
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    onClick={() => setActive(null)}
                    className="sm:w-28"
                  >
                    Close
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
