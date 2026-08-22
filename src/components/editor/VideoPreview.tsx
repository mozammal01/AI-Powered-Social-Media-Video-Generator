"use client";

import { Player } from "@remotion/player";
import type { VideoContentProps } from "@/remotion/schema";
import {
  getTemplateDimensions,
  resolveTemplateOrDefault,
  type TemplateId,
} from "@/remotion/templates";
import { getTemplateComponent } from "@/remotion/templates/components";
import type { AspectRatio } from "@/types";

interface VideoPreviewProps {
  /** Which registered template composition to play. */
  templateId: TemplateId;
  inputProps: VideoContentProps;
  aspectRatio: AspectRatio;
  durationInFrames: number;
  fps?: number;
}

/**
 * Live Remotion preview that plays the currently selected template.
 * The composition component and dimensions are resolved from the
 * template registry — adding a new template requires no changes here.
 */
export function VideoPreview({
  templateId,
  inputProps,
  aspectRatio,
  durationInFrames,
  fps = 30,
}: VideoPreviewProps) {
  const template = resolveTemplateOrDefault(templateId);
  const TemplateComponent = getTemplateComponent(template.id);
  const { width, height } = getTemplateDimensions(template, aspectRatio);

  return (
    <div className="flex justify-center">
      <Player
        key={`${template.id}-${aspectRatio}-${durationInFrames}`}
        component={TemplateComponent}
        inputProps={inputProps}
        durationInFrames={durationInFrames}
        fps={fps}
        compositionWidth={width}
        compositionHeight={height}
        style={{
          width: "100%",
          maxWidth: aspectRatio === "16:9" ? "100%" : 360,
          aspectRatio: `${width} / ${height}`,
          maxHeight: 640,
          borderRadius: 16,
          overflow: "hidden",
          backgroundColor: "#0a0a14",
        }}
        controls
        loop
        autoPlay
        acknowledgeRemotionLicense
        errorFallback={({ error }) => (
          <div className="flex h-full min-h-48 items-center justify-center p-4 text-center text-sm text-destructive">
            Preview failed: {error.message}
          </div>
        )}
      />
    </div>
  );
}