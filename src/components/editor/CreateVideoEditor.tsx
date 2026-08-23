"use client";

import { useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  Building2,
  Package,
  Megaphone,
  Settings2,
  Clapperboard,
  RotateCcw,
  Play,
  Film,
  CheckCircle2,
  AlertCircle,
  Download,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FormField, TextInput, TextArea } from "@/components/editor/FormField";
import { SectionCard } from "@/components/editor/SectionCard";
import { ImageUpload } from "@/components/editor/ImageUpload";
import { VideoPreview } from "@/components/editor/VideoPreview";
import { OptionToggle } from "@/components/editor/OptionToggle";
import { TemplateSelector } from "@/components/editor/TemplateSelector";
import { AiCopyPanel } from "@/components/editor/AiCopyPanel";
import type { GeneratedCopy } from "@/lib/ai/copy-schema";
import {
  getTemplateDefinition,
  isTemplateId,
  type TemplateId,
} from "@/remotion/templates";
import {
  ASPECT_OPTIONS,
  DURATION_OPTIONS,
  defaultEditorValues,
  parseEditorForm,
  type EditorFieldErrors,
  type EditorFormValues,
} from "@/components/editor/editor-schema";
import { toVideoContent } from "@/components/editor/toVideoContent";
import {
  startRender,
  type RenderClientResult,
} from "@/lib/render/render-client";

export function CreateVideoEditor() {
  const searchParams = useSearchParams();
  const queryTemplate = searchParams.get("template");

  type RenderStatus = "idle" | "rendering" | "success" | "error";

  const [values, setValues] = useState<EditorFormValues>(() => ({
    ...defaultEditorValues,
    // Deep-link support: /create-video?template=<id> preselects a template.
    ...(queryTemplate && isTemplateId(queryTemplate)
      ? { templateId: queryTemplate satisfies TemplateId }
      : {}),
  }));
  const [errors, setErrors] = useState<EditorFieldErrors>({});
  const [status, setStatus] = useState<"idle" | "preview">("idle");
  const previewRef = useRef<HTMLDivElement>(null);

  // ── Server render state ────────────────────────────────────────────────
  const [renderStatus, setRenderStatus] = useState<RenderStatus>("idle");
  const [renderProgress, setRenderProgress] = useState(0);
  const [renderStage, setRenderStage] = useState("");
  const [renderError, setRenderError] = useState<string | null>(null);
  const [renderResult, setRenderResult] =
    useState<RenderClientResult | null>(null);

  const activeTemplate = getTemplateDefinition(values.templateId);

  const updateField = <K extends keyof EditorFormValues>(
    key: K,
    value: EditorFormValues[K]
  ) => {
    setValues((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => {
      if (!prev[key]) return prev;
      const next = { ...prev };
      delete next[key];
      return next;
    });
    setStatus("idle");
  };

  const validate = (): boolean => {
    const result = parseEditorForm(values);
    setErrors(result.errors);
    return result.success;
  };

  const handleGeneratePreview = () => {
    if (!validate()) return;
    setStatus("preview");
    previewRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  /** Kicks off a server-side MP4 render and tracks streamed progress.
   *  The UI stays interactive — this is fully asynchronous. */
  const handleGenerateVideo = async () => {
    if (!validate()) return;

    setRenderStatus("rendering");
    setRenderProgress(0);
    setRenderStage("Starting render…");
    setRenderError(null);
    setRenderResult(null);

    try {
      const result = await startRender(
        {
          templateId: values.templateId,
          aspectRatio: values.aspectRatio,
          durationInFrames: durationFrames,
          fps: 30,
          content: inputProps,
        },
        {
          onStage: setRenderStage,
          onProgress: setRenderProgress,
        }
      );
      setRenderResult(result);
      setRenderStatus("success");
      previewRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    } catch (error) {
      setRenderError(
        error instanceof Error
          ? error.message
          : "An unexpected error occurred while rendering."
      );
      setRenderStatus("error");
    }
  };

  /** Fills the existing editor fields with AI-generated copy.
   *  All fields remain fully editable afterwards — AI is only a helper. */
  const handleApplyAiCopy = (copy: GeneratedCopy) => {
    setValues((prev) => ({
      ...prev,
      tagline: copy.tagline,
      description: copy.shortDescription,
      feature1: copy.features[0] ?? "",
      feature2: copy.features[1] ?? "",
      feature3: copy.features[2] ?? "",
      discount: copy.discountText,
      ctaText: copy.ctaText,
    }));
    setStatus("idle");
  };

  /** Switches templates; falls back to the template's default ratio when
   *  the current aspect ratio isn't supported by the newly selected template. */
  const handleSelectTemplate = (templateId: TemplateId) => {
    setValues((prev) => {
      const template = getTemplateDefinition(templateId);
      if (!template) return prev;

      const next: EditorFormValues = { ...prev, templateId };
      if (!template.supportedAspectRatios.includes(prev.aspectRatio)) {
        next.aspectRatio = template.defaultAspectRatio;
      }
      return next;
    });
    setStatus("idle");
  };

  const handleReset = () => {
    setValues(defaultEditorValues);
    setErrors({});
    setStatus("idle");
    setRenderStatus("idle");
    setRenderError(null);
    setRenderResult(null);
    setRenderProgress(0);
  };

  const inputProps = useMemo(() => toVideoContent(values), [values]);
  const durationFrames =
    DURATION_OPTIONS.find((option) => option.value === values.duration)
      ?.frames ?? 300;
  const errorCount = Object.keys(errors).length;
  const aspectOptions = ASPECT_OPTIONS.filter((option) =>
    activeTemplate?.supportedAspectRatios.includes(option.value)
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-2">
          <Link href="/dashboard">
            <Button
              variant="ghost"
              size="sm"
              className="gap-1 text-muted-foreground hover:text-foreground -ml-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Create Video</h1>
            <p className="text-muted-foreground text-sm">
              Enter your product details and watch the Remotion composition
              update live.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleReset}
            className="gap-1.5"
            type="button"
          >
            <RotateCcw className="w-4 h-4" />
            Reset
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={handleGeneratePreview}
            className="gap-1.5"
            type="button"
          >
            <Play className="w-4 h-4" />
            Generate Preview
          </Button>
          <Button
            size="sm"
            onClick={handleGenerateVideo}
            className="gap-1.5"
            type="button"
            disabled={renderStatus === "rendering"}
          >
            {renderStatus === "rendering" ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Rendering…
              </>
            ) : (
              <>
                <Film className="w-4 h-4" />
                Generate Video
              </>
            )}
          </Button>
        </div>
      </div>

      {errorCount > 0 && (
        <div className="flex items-start gap-2.5 rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
          <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
          <div>
            <p className="font-medium">Please fix the following errors:</p>
            <ul className="list-disc list-inside mt-1 space-y-0.5 text-xs">
              {Object.entries(errors).map(([key, message]) => (
                <li key={key}>{message}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {status === "preview" && errorCount === 0 && (
        <div className="flex items-center gap-2 rounded-lg border border-emerald-500/30 bg-emerald-500/5 p-3 text-sm text-emerald-700">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          Preview is using the current form data. The player on the right stays
          in sync as you edit.
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1.05fr)_minmax(320px,0.95fr)] gap-6 items-start">
        <form
          className="space-y-5"
          onSubmit={(event) => {
            event.preventDefault();
            handleGeneratePreview();
          }}
        >
          <TemplateSelector
            value={values.templateId}
            onChange={handleSelectTemplate}
          />

          <AiCopyPanel
            initialProductName={values.productName}
            initialProductDescription={values.description}
            onApply={handleApplyAiCopy}
          />

          <SectionCard
            title="Video settings"
            description={`Output format for the live preview. Duration scales ${activeTemplate?.name ?? "the composition"}'s scenes.`}
            icon={<Clapperboard className="w-4 h-4" />}
          >
            <OptionToggle
              label="Aspect Ratio"
              value={values.aspectRatio}
              options={
                aspectOptions.length > 0 ? aspectOptions : ASPECT_OPTIONS
              }
              onChange={(value) => updateField("aspectRatio", value)}
              error={errors.aspectRatio}
            />
            <OptionToggle
              label="Duration"
              value={values.duration}
              options={DURATION_OPTIONS}
              onChange={(value) => updateField("duration", value)}
              error={errors.duration}
            />
          </SectionCard>

          <SectionCard
            title="Brand"
            description="Shown in the intro and closing CTA scenes."
            icon={<Building2 className="w-4 h-4" />}
          >
            <FormField
              label="Brand Name"
              htmlFor="brandName"
              error={errors.brandName}
            >
              <TextInput
                id="brandName"
                value={values.brandName}
                onChange={(e) => updateField("brandName", e.target.value)}
                placeholder="e.g. NovaSpark"
                hasError={Boolean(errors.brandName)}
              />
            </FormField>

            <FormField label="Tagline" htmlFor="tagline" error={errors.tagline}>
              <TextInput
                id="tagline"
                value={values.tagline}
                onChange={(e) => updateField("tagline", e.target.value)}
                placeholder="e.g. Ignite Your Growth"
                hasError={Boolean(errors.tagline)}
              />
            </FormField>

            <FormField
              label="Website URL"
              htmlFor="websiteUrl"
              error={errors.websiteUrl}
            >
              <TextInput
                id="websiteUrl"
                type="url"
                value={values.websiteUrl}
                onChange={(e) => updateField("websiteUrl", e.target.value)}
                placeholder="https://example.com"
                hasError={Boolean(errors.websiteUrl)}
              />
            </FormField>

            <ImageUpload
              label="Brand logo"
              value={values.brandLogoUrl}
              onChange={(value) => updateField("brandLogoUrl", value)}
              error={errors.brandLogoUrl}
            />
          </SectionCard>

          <SectionCard
            title="Product"
            description="Copy and media used in the product, features, and pricing scenes."
            icon={<Package className="w-4 h-4" />}
          >
            <FormField
              label="Product Name"
              htmlFor="productName"
              error={errors.productName}
            >
              <TextInput
                id="productName"
                value={values.productName}
                onChange={(e) => updateField("productName", e.target.value)}
                placeholder="e.g. NovaSpark Pro"
                hasError={Boolean(errors.productName)}
              />
            </FormField>

            <FormField
              label="Description"
              htmlFor="description"
              error={errors.description}
              hint={`${values.description.length}/160 characters`}
            >
              <TextArea
                id="description"
                rows={3}
                value={values.description}
                onChange={(e) => updateField("description", e.target.value)}
                placeholder="Short marketing description (1–2 sentences)"
                hasError={Boolean(errors.description)}
              />
            </FormField>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField label="Price" htmlFor="price" error={errors.price}>
                <TextInput
                  id="price"
                  value={values.price}
                  onChange={(e) => updateField("price", e.target.value)}
                  placeholder="$49 / mo"
                  hasError={Boolean(errors.price)}
                />
              </FormField>

              <FormField
                label="Discount"
                htmlFor="discount"
                error={errors.discount}
              >
                <TextInput
                  id="discount"
                  value={values.discount}
                  onChange={(e) => updateField("discount", e.target.value)}
                  placeholder="30% OFF"
                  hasError={Boolean(errors.discount)}
                />
              </FormField>
            </div>

            <ImageUpload
              label="Product image"
              value={values.productImageUrl}
              onChange={(value) => updateField("productImageUrl", value)}
              error={errors.productImageUrl}
            />
          </SectionCard>

          <SectionCard
            title="Key features"
            description="Up to three selling points, revealed sequentially."
            icon={<Settings2 className="w-4 h-4" />}
          >
            {(["feature1", "feature2", "feature3"] as const).map(
              (key, index) => (
                <FormField
                  key={key}
                  label={`Feature ${index + 1}`}
                  htmlFor={key}
                  error={errors[key]}
                >
                  <TextInput
                    id={key}
                    value={values[key]}
                    onChange={(e) => updateField(key, e.target.value)}
                    placeholder={`Feature ${index + 1}`}
                    hasError={Boolean(errors[key])}
                  />
                </FormField>
              )
            )}
          </SectionCard>

          <SectionCard
            title="Call to action"
            description="Button label shown in the final scene."
            icon={<Megaphone className="w-4 h-4" />}
          >
            <FormField
              label="CTA Text"
              htmlFor="ctaText"
              error={errors.ctaText}
            >
              <TextInput
                id="ctaText"
                value={values.ctaText}
                onChange={(e) => updateField("ctaText", e.target.value)}
                placeholder="e.g. Start Free Trial"
                hasError={Boolean(errors.ctaText)}
              />
            </FormField>
          </SectionCard>
        </form>

        <div ref={previewRef} className="xl:sticky xl:top-6 space-y-4">
          <Card>
            <CardContent className="p-5 space-y-4">
              <div className="flex items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <h2 className="font-semibold text-sm tracking-tight">
                    Live preview
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    {activeTemplate?.name} · {values.aspectRatio} ·{" "}
                    {values.duration}s · 30 fps
                  </p>
                </div>
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-600 border border-emerald-500/15">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Live
                </span>
              </div>

              <div className="rounded-xl overflow-hidden border border-border/60 bg-slate-950">
                <VideoPreview
                  templateId={values.templateId}
                  inputProps={inputProps}
                  aspectRatio={values.aspectRatio}
                  durationInFrames={durationFrames}
                  fps={30}
                />
              </div>
            </CardContent>
          </Card>

          {/* ── Render panel: progress / result / error ── */}
          <Card>
            <CardContent className="p-5 space-y-4">
              <div className="flex items-center justify-between gap-3">
                <h2 className="font-semibold text-sm tracking-tight">
                  Rendered video
                </h2>
                {renderStatus === "rendering" && (
                  <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-500/10 text-blue-600 border border-blue-500/15">
                    <Loader2 className="w-3 h-3 animate-spin" />
                    {Math.round(renderProgress * 100)}%
                  </span>
                )}
              </div>

              {renderStatus === "idle" && (
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Click <span className="font-medium">Generate Video</span> to
                  render the current composition to an MP4 file on the server.
                </p>
              )}

              {renderStatus === "rendering" && (
                <div className="space-y-2">
                  <div
                    role="progressbar"
                    aria-label="Render progress"
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-valuenow={Math.round(renderProgress * 100)}
                    className="h-2 w-full overflow-hidden rounded-full bg-muted"
                  >
                    <div
                      className="h-full rounded-full bg-primary transition-all duration-300"
                      style={{ width: `${Math.max(4, renderProgress * 100)}%` }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                    <Loader2 className="w-3 h-3 animate-spin shrink-0" />
                    {renderStage || "Rendering…"} ({Math.round(renderProgress * 100)}%)
                  </p>
                  <p className="text-[10px] text-muted-foreground/70">
                    The first render may take longer while the headless browser
                    and bundle are prepared.
                  </p>
                </div>
              )}

              {renderStatus === "success" && renderResult && (
                <div className="space-y-3">
                  {/* Plain HTML5 player for the finished MP4 — this panel is
                      not part of a Remotion composition/timeline. */}
                  {/* eslint-disable-next-line @remotion/warn-native-media-tag */}
                  <video
                    key={renderResult.fileId}
                    src={renderResult.url}
                    controls
                    playsInline
                    className="w-full rounded-lg border border-border/60 bg-black"
                    style={{ maxHeight: 420 }}
                  />
                  <div className="flex items-center justify-between gap-3 flex-wrap">
                    <p className="text-xs text-muted-foreground">
                      {(renderResult.sizeBytes / (1024 * 1024)).toFixed(1)} MB ·
                      rendered in{" "}
                      {Math.round(renderResult.durationMs / 1000)}s
                    </p>
                    <a href={renderResult.downloadUrl}>
                      <Button size="sm" className="gap-1.5" type="button">
                        <Download className="w-4 h-4" />
                        Download MP4
                      </Button>
                    </a>
                  </div>
                </div>
              )}

              {renderStatus === "error" && (
                <div className="space-y-3">
                  <div className="flex items-start gap-2.5 rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
                    <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                    <div>
                      <p className="font-medium">Render failed</p>
                      <p className="text-xs mt-0.5 leading-relaxed">
                        {renderError}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleGenerateVideo}
                    className="gap-1.5"
                    type="button"
                  >
                    <RotateCcw className="w-4 h-4" />
                    Try again
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
