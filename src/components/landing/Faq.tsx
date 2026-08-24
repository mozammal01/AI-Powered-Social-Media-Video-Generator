import Link from "next/link";
import { ChevronDown, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GradientText, SectionHeading } from "./SectionHeading";

const faqs = [
  {
    question: "Do I need any video editing experience?",
    answer:
      "None at all. You describe your product and pick a template — VividAI handles scripting, scene design, animation timing, and rendering. The editor is there only if you want to fine-tune.",
  },
  {
    question: "How does the AI write my script?",
    answer:
      "The copy generator turns your product name, description, pricing, and call-to-action into scene-by-scene copy: a hook headline, benefit-driven body text, and a conversion-focused CTA. You can regenerate or edit any line before rendering.",
  },
  {
    question: "Which platforms and aspect ratios are supported?",
    answer:
      "Templates support 9:16 for TikTok, Reels, and Shorts; 1:1 for feed posts; and 16:9 for YouTube and landscape placements. Switching ratios re-flows the composition automatically.",
  },
  {
    question: "How long does a render take?",
    answer:
      "A 10-second 1080×1920 video typically renders in around ten seconds on our distributed cloud workers. Progress streams live to your dashboard, and finished MP4s are ready to download instantly.",
  },
  {
    question: "Can I customize a template after it is generated?",
    answer:
      "Yes. Every template is a real Remotion composition, so you can adjust scenes, swap brand colors and logos, edit copy, and change animations before exporting your final video.",
  },
  {
    question: "Is there a free plan?",
    answer:
      "You can create and preview projects for free — no credit card required. Paid plans unlock unlimited cloud renders, higher resolutions, and priority processing.",
  },
];

export function Faq() {
  return (
    <section id="faq" className="relative scroll-mt-24 py-24 sm:py-32">
      {/* Ambient tint */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div className="absolute -left-40 top-1/3 h-96 w-96 rounded-full bg-indigo-600/[0.07] blur-[120px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.5fr] lg:gap-16">
          {/* Left: heading + support card */}
          <div>
            <SectionHeading
              align="left"
              eyebrow="FAQ"
              title={
                <>
                  Questions,{" "}
                  <GradientText>answered</GradientText>
                </>
              }
              description="Everything you need to know about creating videos with VividAI."
            />

            <div className="mt-8 rounded-2xl border border-border/70 bg-card/50 p-6 backdrop-blur">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500/15 to-fuchsia-500/15 text-primary ring-1 ring-inset ring-primary/25">
                <MessageCircle className="h-4.5 w-4.5" />
              </span>
              <h3 className="mt-4 font-semibold tracking-tight">
                Still have questions?
              </h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                Our team is happy to walk you through the studio and help you
                plan your first campaign.
              </p>
              <Link href="/dashboard" className="mt-4 inline-block">
                <Button variant="outline" size="sm" className="gap-2">
                  Contact Support
                </Button>
              </Link>
            </div>
          </div>

          {/* Right: accordion */}
          <div className="space-y-3">
            {faqs.map((faq) => (
              <details
                key={faq.question}
                className="group rounded-xl border border-border/70 bg-card/50 px-5 backdrop-blur transition-colors open:border-primary/30 open:bg-card/80 [&_summary::-webkit-details-marker]:hidden"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-4 text-left text-sm font-semibold tracking-tight sm:text-base">
                  {faq.question}
                  <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200 group-open:rotate-180" />
                </summary>
                <p className="pb-5 pr-8 text-sm leading-relaxed text-muted-foreground">
                  {faq.answer}
                </p>
              </details>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}