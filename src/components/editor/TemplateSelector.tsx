"use client";

import { LayoutTemplate } from "lucide-react";
import { TemplateCard } from "@/components/video/TemplateCard";
import { templateList, type TemplateId } from "@/remotion/templates";

interface TemplateSelectorProps {
  value: TemplateId;
  onChange: (templateId: TemplateId) => void;
}

/**
 * Template picker shown at the top of the Create Video editor.
 * Renders one card per registered template; selecting a card switches
 * the Remotion composition used by the live preview.
 */
export function TemplateSelector({ value, onChange }: TemplateSelectorProps) {
  return (
    <section className="space-y-3" aria-label="Choose a template">
      <div className="flex items-center gap-2">
        <LayoutTemplate className="w-4 h-4 text-primary" />
        <h2 className="text-sm font-semibold tracking-tight">Template</h2>
        <span className="text-xs text-muted-foreground">
          Pick a layout — your content stays the same across all templates.
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {templateList.map((template) => (
          <TemplateCard
            key={template.id}
            template={template}
            selected={template.id === value}
            onSelect={onChange}
          />
        ))}
      </div>
    </section>
  );
}