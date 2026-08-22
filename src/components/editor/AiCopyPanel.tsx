"use client";

import { useState } from "react";
import { Loader2, Sparkles, CheckCircle2, AlertCircle } from "lucide-react";
import { SectionCard } from "@/components/editor/SectionCard";
import { FormField, TextInput, TextArea } from "@/components/editor/FormField";
import { OptionToggle } from "@/components/editor/OptionToggle";
import {
  MARKETING_TONES,
  TONE_LABELS,
  generateCopyRequestSchema,
  type GeneratedCopy,
  type MarketingTone,
} from "@/lib/ai/copy-schema";

interface AiCopyPanelProps {
  /** Prefills Product Name / Description from the current editor form. */
  initialProductName: string;
  initialProductDescription: string;
  /** Called with validated AI copy when generation succeeds. */
  onApply: (copy: GeneratedCopy) => void;
}

interface ToneOption {
  value: MarketingTone;
  label: string;
}

const TONE_OPTIONS: ToneOption[] = MARKETING_TONES.map((tone) => ({
  value: tone,
  label: TONE_LABELS[tone],
}));

/**
 * Optional AI-assisted copy panel (Google Gemini via a secure server route).
 *
 * AI is never required — every field it fills can also be edited manually
 * in the sections below, and the editor works fully without this panel.
 */
export function AiCopyPanel({
  initialProductName,
  initialProductDescription,
  onApply,
}: AiCopyPanelProps) {
  const [productName, setProductName] = useState(initialProductName);
  const [productDescription, setProductDescription] = useState(
    initialProductDescription
  );
  const [targetAudience, setTargetAudience] = useState("");
  const [tone, setTone] = useState<MarketingTone>("professional");

  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle"
  );
  const [error, setError] = useState<string | null>(null);
  const [fieldError, setFieldError] = useState<string | null>(null);

  const handleGenerate = async () => {
    // Client-side validation mirrors the server contract.
    const parsed = generateCopyRequestSchema.safeParse({
      productName,
      productDescription: productDescription.trim() || undefined,
      targetAudience: targetAudience.trim() || undefined,
      tone,
    });

    if (!parsed.success) {
      const issue = parsed.error.issues[0];
      setFieldError(issue ? issue.message : "Please check the inputs.");
      return;
    }
    setFieldError(null);
    setError(null);
    setStatus("loading");

    try {
      const response = await fetch("/api/generate-copy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });

      const data = (await response.json()) as {
        copy?: GeneratedCopy;
        error?: string;
      };

      if (!response.ok || !data.copy) {
        setError(data.error ?? "AI generation failed. Please try again.");
        setStatus("error");
        return;
      }

      onApply(data.copy);
      setStatus("success");
    } catch {
      setError("Could not reach the AI service. Please try again.");
      setStatus("error");
    }
  };

  return (
    <SectionCard
      title="AI copy assistant"
      description="Optional — generate marketing copy with Gemini and fill the fields below. Everything stays manually editable."
      icon={<Sparkles className="w-4 h-4" />}
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField
          label="Product Name"
          htmlFor="aiProductName"
          error={fieldError && !productName.trim() ? fieldError : undefined}
        >
          <TextInput
            id="aiProductName"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            placeholder="e.g. NovaSpark Pro"
            hasError={Boolean(fieldError) && !productName.trim()}
          />
        </FormField>

        <FormField label="Target Audience" htmlFor="aiTargetAudience">
          <TextInput
            id="aiTargetAudience"
            value={targetAudience}
            onChange={(e) => setTargetAudience(e.target.value)}
            placeholder="e.g. startup founders"
          />
        </FormField>
      </div>

      <FormField label="Product Description" htmlFor="aiDescription">
        <TextArea
          id="aiDescription"
          rows={2}
          value={productDescription}
          onChange={(e) => setProductDescription(e.target.value)}
          placeholder="Optional context to guide the AI (1–2 sentences)"
        />
      </FormField>

      <OptionToggle
        label="Marketing Tone"
        value={tone}
        options={TONE_OPTIONS}
        onChange={setTone}
      />

      <div className="flex items-center gap-3 flex-wrap">
        <button
          type="button"
          onClick={handleGenerate}
          disabled={status === "loading"}
          className="inline-flex items-center gap-1.5 h-9 px-4 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
        >
          {status === "loading" ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Generating…
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              Generate Copy
            </>
          )}
        </button>

        {status === "success" && (
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-600">
            <CheckCircle2 className="w-4 h-4" />
            Fields updated below — edit them freely.
          </span>
        )}
      </div>

      {error && (
        <div
          className={
            error.includes("GEMINI_API_KEY")
              ? "flex items-start gap-2.5 rounded-lg border border-amber-500/30 bg-amber-500/5 p-3 text-sm text-amber-700"
              : "flex items-start gap-2.5 rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive"
          }
        >
          <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
          <p className="text-xs leading-relaxed">{error}</p>
        </div>
      )}
    </SectionCard>
  );
}