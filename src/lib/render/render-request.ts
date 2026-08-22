import { z } from "zod";
import { videoContentSchema } from "@/remotion/schema";
import { templateRegistry } from "@/remotion/templates";

/**
 * Shared contract between the client and the render API.
 * Imported by both sides — contains no Node-only or browser-only code.
 */

const TEMPLATE_IDS = Object.keys(templateRegistry) as [
  keyof typeof templateRegistry,
  ...(keyof typeof templateRegistry)[]
];

export const renderRequestSchema = z.object({
  /** Registered template to render. */
  templateId: z.enum(TEMPLATE_IDS),
  aspectRatio: z.enum(["9:16", "1:1", "16:9"]),
  /** Total composition length in frames. */
  durationInFrames: z
    .number()
    .int("Duration must be a whole number of frames")
    .min(30, "Duration must be at least 30 frames (1s @ 30fps)")
    .max(3600, "Duration must be at most 3600 frames (2min @ 30fps)"),
  fps: z.union([z.literal(24), z.literal(30), z.literal(60)]),
  /** The VideoContent driving the composition. */
  content: videoContentSchema,
});

export type RenderRequest = z.infer<typeof renderRequestSchema>;

/** Coarse render phases reported before/around frame rendering. */
export type RenderStage =
  | "validating"
  | "preparing-browser"
  | "bundling"
  | "selecting-composition"
  | "rendering"
  | "finalizing";

/** Server-sent events (NDJSON, one JSON object per line). */
export type RenderStreamEvent =
  | { type: "stage"; stage: RenderStage; message: string }
  | { type: "progress"; progress: number; renderedFrames: number }
  | {
      type: "done";
      fileId: string;
      url: string;
      downloadUrl: string;
      sizeBytes: number;
      durationMs: number;
    }
  | { type: "error"; message: string };