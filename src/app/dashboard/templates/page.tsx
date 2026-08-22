import type { Metadata } from "next";
import { Layers } from "lucide-react";
import { TemplateCard } from "@/components/video/TemplateCard";
import { templateList } from "@/remotion/templates";

export const metadata: Metadata = {
  title: "Video Templates | VividAI",
  description:
    "Browse the registered Remotion video templates and start a new project from any of them.",
};

export default function TemplatesPage() {
  return (
    <div className="space-y-6">
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {templateList.map((template) => (
            <TemplateCard
              key={template.id}
              template={template}
              href={`/create-video?template=${template.id}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}