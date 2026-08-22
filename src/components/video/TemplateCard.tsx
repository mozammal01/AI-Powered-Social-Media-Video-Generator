import Image from "next/image";
import { Clock, Layers } from "lucide-react";
import { cn } from "@/lib/utils";
import type { TemplateId, TemplateMetadata } from "@/remotion/templates";

interface TemplateCardProps {
  template: TemplateMetadata;
  /** Visual selected state (editor selector). */
  selected?: boolean;
  /** Called when the card is clicked (editor selector). */
  onSelect?: (templateId: TemplateId) => void;
  /** When provided, the card renders as a link instead of a button (gallery). */
  href?: string;
  className?: string;
}

function formatDuration(frames: number, fps: number): string {
  return `${Math.round(frames / fps)}s`;
}

/**
 * Presentational template card showing name, description,
 * supported aspect ratios, duration, and a preview thumbnail.
 *
 * Used by both the editor's TemplateSelector (selectable) and
 * the dashboard templates gallery (linked).
 */
export function TemplateCard({
  template,
  selected = false,
  onSelect,
  href,
  className,
}: TemplateCardProps) {
  const inner = (
    <>
      {/* Preview thumbnail */}
      <div className="relative w-full aspect-[16/10] overflow-hidden bg-slate-950">
        <Image
          src={template.thumbnailUrl}
          alt={`${template.name} preview`}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        {/* Category badge */}
        <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-black/55 text-white border border-white/15 backdrop-blur-sm">
          {template.category}
        </span>

        {/* Selected indicator */}
        {selected && (
          <span className="absolute top-2.5 right-2.5 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-primary text-primary-foreground shadow">
            <Layers className="w-3 h-3" />
            Selected
          </span>
        )}

        {/* Meta strip */}
        <div className="absolute bottom-2 left-2.5 right-2.5 flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 flex-wrap">
            {template.supportedAspectRatios.map((ratio) => (
              <span
                key={ratio}
                className={cn(
                  "px-1.5 py-0.5 rounded text-[10px] font-mono font-medium border",
                  ratio === template.defaultAspectRatio
                    ? "bg-white/20 text-white border-white/30"
                    : "bg-black/45 text-white/70 border-white/10"
                )}
              >
                {ratio}
              </span>
            ))}
          </div>
          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium bg-black/55 text-white/85">
            <Clock className="w-3 h-3" />
            {formatDuration(template.durationInFrames, template.fps)}
          </span>
        </div>
      </div>

      {/* Text content */}
      <div className="p-4 space-y-1.5">
        <h3 className="font-semibold text-sm tracking-tight leading-snug">
          {template.name}
        </h3>
        <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
          {template.description}
        </p>
      </div>
    </>
  );

  const baseClassName = cn(
    "group block w-full text-left rounded-xl border bg-card overflow-hidden transition-all",
    "hover:border-primary/40 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
    selected
      ? "border-primary ring-2 ring-primary/25 shadow-md"
      : "border-border",
    className
  );

  if (href) {
    return (
      <a href={href} className={baseClassName}>
        {inner}
      </a>
    );
  }

  if (onSelect) {
    return (
      <button
        type="button"
        onClick={() => onSelect(template.id)}
        aria-pressed={selected}
        className={cn(baseClassName, "cursor-pointer")}
      >
        {inner}
      </button>
    );
  }

  return <div className={baseClassName}>{inner}</div>;
}