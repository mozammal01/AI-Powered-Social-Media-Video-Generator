import type { Metadata } from "next";
import { Layers, Star } from "lucide-react";
import { TemplateCard } from "@/components/video/TemplateCard";
import {
  featuredTemplates,
  otherTemplates,
  templateList,
} from "@/remotion/templates";

export const metadata: Metadata = {
  title: "Video Templates | VividAI",
  description:
    "Browse the registered Remotion video templates and start a new project from any of them.",
};

function TemplateGrid({
  templates,
  href,
}: {
  templates: typeof templateList;
  href: (id: string) => string;
}) {
  if (templates.length === 0) {
    return (
      <div className="border border-dashed border-border rounded-xl p-12 text-center bg-card/30 space-y-3">
        <p className="text-sm text-muted-foreground">No templates in this section.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {templates.map((template) => (
        <TemplateCard
          key={template.id}
          template={template}
          href={href(template.id)}
        />
      ))}
    </div>
  );
}

export default function TemplatesPage() {
  return (
    <div className="space-y-10">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight">Video Templates</h1>
        <p className="text-muted-foreground text-sm">
          Choose from professionally designed Remotion layouts. Every template
          uses the same content model — pick one to open it in the editor.
        </p>
      </div>

      {templateList.length === 0 ? (
        <div className="border border-dashed border-border rounded-xl p-16 text-center bg-card/30 space-y-4">
          <div className="mx-auto w-12 h-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
            <Layers className="w-6 h-6" />
          </div>
          <div className="space-y-2 max-w-md mx-auto">
            <h3 className="font-semibold text-lg">No templates yet</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Register a template in{" "}
              <code className="font-mono text-xs">remotion/templates/registry.ts</code>{" "}
              and it will appear here automatically.
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-10">
          {featuredTemplates.length > 0 && (
            <section className="space-y-4">
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 text-primary" />
                <h2 className="text-lg font-semibold tracking-tight">
                  Featured Templates
                </h2>
              </div>
              <TemplateGrid
                templates={featuredTemplates}
                href={(id) => `/create-video?template=${id}`}
              />
            </section>
          )}

          {otherTemplates.length > 0 && (
            <section className="space-y-4">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-muted-foreground" />
                <h2 className="text-lg font-semibold tracking-tight">
                  Other Templates
                </h2>
              </div>
              <TemplateGrid
                templates={otherTemplates}
                href={(id) => `/create-video?template=${id}`}
              />
            </section>
          )}
        </div>
      )}
    </div>
  );
}
