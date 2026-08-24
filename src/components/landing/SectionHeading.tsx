import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  eyebrow: string;
  title: ReactNode;
  description?: string;
  align?: "center" | "left";
}

/**
 * Shared section header: eyebrow pill, gradient-accented title,
 * and optional supporting copy. Used by every landing section.
 */
export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
}: SectionHeadingProps) {
  return (
    <div className={cn("max-w-2xl", align === "center" && "mx-auto text-center")}>
      <span className="inline-flex items-center rounded-full border border-primary/25 bg-primary/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-primary">
        {eyebrow}
      </span>
      <h2 className="mt-4 text-balance text-3xl font-bold tracking-tight sm:text-4xl">
        {title}
      </h2>
      {description && (
        <p className="mt-4 text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
          {description}
        </p>
      )}
    </div>
  );
}

/** Gradient highlight span for use inside titles. */
export function GradientText({ children }: { children: ReactNode }) {
  return (
    <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-fuchsia-400 bg-clip-text text-transparent">
      {children}
    </span>
  );
}