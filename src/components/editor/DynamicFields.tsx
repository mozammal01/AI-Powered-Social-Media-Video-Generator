"use client";

import { useMemo } from "react";
import { FormField, TextInput, TextArea } from "@/components/editor/FormField";
import { ImageUpload } from "@/components/editor/ImageUpload";
import { SectionCard } from "@/components/editor/SectionCard";
import type { EditorFormValues, EditorFieldErrors } from "./editor-schema";
import type { TemplateFieldDefinition } from "@/remotion/templates";
import { getTemplateFields } from "@/remotion/templates";

interface DynamicFieldsProps {
  values: EditorFormValues;
  errors: EditorFieldErrors;
  updateField: <K extends keyof EditorFormValues>(key: K, value: EditorFormValues[K]) => void;
}

/**
 * Renders editor fields dynamically based on the active template's
 * field configuration. Groups fields by `section` and renders the
 * appropriate input component for each field type.
 */
export function DynamicFields({ values, errors, updateField }: DynamicFieldsProps) {
  const fields = useMemo(() => getTemplateFields(values.templateId), [values.templateId]);

  const sections = useMemo(() => {
    const map = new Map<string, TemplateFieldDefinition[]>();
    for (const field of fields) {
      const section = field.section ?? "Other";
      if (!map.has(section)) map.set(section, []);
      map.get(section)!.push(field);
    }
    return Array.from(map.entries());
  }, [fields]);

  if (sections.length === 0) {
    return (
      <SectionCard
        title="Template content"
        description="This template uses static visuals — no data fields are required."
        icon={<TemplateIcon />}
      >
        <p className="text-xs text-muted-foreground">
          All visuals are generated automatically. Select a different template
          to customize text, images, and other data.
        </p>
      </SectionCard>
    );
  }

  return (
    <>
      {sections.map(([section, sectionFields]) => (
        <SectionCard
          key={section}
          title={section}
          description={`${sectionFields.length} field${sectionFields.length === 1 ? '' : 's'} for this template.`}
          icon={<TemplateIcon />}
        >
          {sectionFields.map((field) => (
            <FieldRenderer
              key={field.key}
              field={field}
              value={values[field.key]}
              error={errors[field.key]}
              onChange={(value) => updateField(field.key, value as EditorFormValues[typeof field.key])}
            />
          ))}
        </SectionCard>
      ))}
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────────────────────────────────────

function FieldRenderer({
  field,
  value,
  error,
  onChange,
}: {
  field: TemplateFieldDefinition;
  value: unknown;
  error?: string;
  onChange: (value: string | number) => void;
}) {
  if (field.type === "image") {
    return (
      <ImageUpload
        label={field.imageLabel ?? field.label}
        value={(value as string) ?? ""}
        onChange={(next) => onChange(next)}
        error={error}
      />
    );
  }

  if (field.type === "textarea") {
    return (
      <FormField
        label={field.label}
        htmlFor={field.key}
        error={error}
        hint={field.hint}
      >
        <TextArea
          id={field.key as string}
          rows={3}
          value={(value as string) ?? ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder={field.placeholder}
          hasError={Boolean(error)}
        />
      </FormField>
    );
  }

  if (field.type === "number") {
    return (
      <FormField
        label={field.label}
        htmlFor={field.key}
        error={error}
        hint={field.hint}
      >
        <TextInput
          id={field.key as string}
          type="number"
          value={typeof value === "number" ? String(value) : (value as string) ?? ""}
          onChange={(e) => {
            const raw = e.target.value;
            onChange(raw === "" ? 0 : Number(raw));
          }}
          placeholder={field.placeholder}
          hasError={Boolean(error)}
        />
      </FormField>
    );
  }

  return (
    <FormField
      label={field.label}
      htmlFor={field.key}
      error={error}
      hint={field.hint}
    >
      <TextInput
        id={field.key as string}
        value={(value as string) ?? ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder={field.placeholder}
        hasError={Boolean(error)}
      />
    </FormField>
  );
}

function TemplateIcon() {
  return (
    <svg
      className="w-4 h-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M3 9h18" />
      <path d="M9 21V9" />
    </svg>
  );
}
