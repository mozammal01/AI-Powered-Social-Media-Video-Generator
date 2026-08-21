"use client";

import { Player } from "@remotion/player";
import { ProductAdvertisement } from "@/remotion/compositions/ProductAdvertisement";
import type { ProductAdvertisementProps } from "@/remotion/compositions/schema";
import type { AspectRatio } from "@/types";
import { ASPECT_RATIO_DIMENSIONS } from "@/types";

interface VideoPreviewProps {
  inputProps: ProductAdvertisementProps;
  aspectRatio: AspectRatio;
  durationInFrames: number;
  fps?: number;
}

export function VideoPreview({
  inputProps,
  aspectRatio,
  durationInFrames,
  fps = 30,
}: VideoPreviewProps) {
  const { width, height } = ASPECT_RATIO_DIMENSIONS[aspectRatio];

  return (
    <div className="flex justify-center">
      <Player
        key={`${aspectRatio}-${durationInFrames}`}
        component={ProductAdvertisement}
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
