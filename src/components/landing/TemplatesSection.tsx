import { templateList } from "@/remotion/templates";
import { TemplateCard } from "@/components/video/TemplateCard";
import { GradientText, SectionHeading } from "./SectionHeading";

export function TemplatesSection() {
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
          description="Every template is a real Remotion composition — five choreographed scenes with AI copy baked in. Pick one and make it yours."
        />

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {templateList.map((template) => (
            <TemplateCard
              key={template.id}
              template={template}
              href={`/create-video?template=${template.id}`}
            />
          ))}
        </div>

        <p className="mt-10 text-center text-sm text-muted-foreground">
          New templates ship every week — all fully customizable in the editor.
        </p>
      </div>
    </section>
  );
}