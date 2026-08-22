import "server-only";

import path from "node:path";
import fs from "node:fs";
import net from "node:net";
import crypto from "node:crypto";
import { enableTailwind } from "@remotion/tailwind-v4";
import { bundle } from "@remotion/bundler";
import type { WebpackOverrideFn } from "@remotion/bundler";
import {
  selectComposition,
  renderMedia,
  ensureBrowser,
  makeCancelSignal,
} from "@remotion/renderer";
import type { RenderRequest, RenderStage } from "./render-request";
import { ASPECT_RATIO_DIMENSIONS } from "@/types";
import { getTemplateDefinition } from "@/remotion/templates";

/**
 * Server-side Remotion rendering pipeline.
 *
 * Kept completely separate from UI code: the API route only validates input
 * and streams events; this module owns bundling, composition selection,
 * frame rendering, and MP4 encoding.
 *
 * Mirrors remotion.config.ts (which does NOT apply to the Node APIs):
 * Tailwind v4 is enabled and the `@/*` path alias is mapped manually.
 */

const RENDERS_DIR = path.join(process.cwd(), ".renders");
const ENTRY_POINT = path.join(process.cwd(), "src", "index.ts");

// ─────────────────────────────────────────────────────────────────────────────
// Bundling (cached per server process — bundling takes several seconds)
// ─────────────────────────────────────────────────────────────────────────────

let bundlePromise: Promise<string> | null = null;

function webpackOverride(config: Parameters<WebpackOverrideFn>[0]) {
  const withTailwind = enableTailwind(config);
  withTailwind.resolve = withTailwind.resolve ?? {};
  withTailwind.resolve.alias = {
    ...(withTailwind.resolve.alias as Record<string, string> | undefined),
    "@": path.resolve(process.cwd(), "src"),
  };
  return withTailwind;
}

async function getServeUrl(): Promise<string> {
  if (!bundlePromise) {
    const promise = bundle({
      entryPoint: ENTRY_POINT,
      webpackOverride,
      onProgress: () => {
        /* bundle progress is reported by the caller's stage events */
      },
    }).catch((error: unknown) => {
      // Allow a later request to retry after a failed bundle.
      bundlePromise = null;
      throw error;
    });
    bundlePromise = promise;
  }
  return bundlePromise;
}

/**
 * Picks a free high-range port for Remotion's internal asset server.
 *
 * We verify the port ourselves on both IPv4 and IPv6 loopback and then pass
 * it explicitly to selectComposition/renderMedia. Remotion's own auto-scan
 * starts at port 3000 and can misdetect availability when another dev server
 * (e.g. Next.js) is listening on a different interface, which makes Chrome
 * load the wrong page.
 */
function findFreeRenderPort(): Promise<number> {
  const isFreeOnHost = (port: number, host: string) =>
    new Promise<boolean>((resolve) => {
      const server = net.createServer();
      server.unref();
      server.once("error", () => resolve(false));
      server.listen({ port, host }, () => {
        server.close(() => resolve(true));
      });
    });

  return new Promise((resolve, reject) => {
    let attempts = 0;

    const tryNext = () => {
      attempts += 1;
      if (attempts > 25) {
        reject(new Error("Could not find a free port for the render server."));
        return;
      }

      // Ephemeral range — far away from common dev servers (3000–3999).
      // Server-side infrastructure only — never runs inside a composition.
      // eslint-disable-next-line @remotion/deterministic-randomness
      const port = 30000 + Math.floor(Math.random() * 20000);
      void Promise.all([
        isFreeOnHost(port, "127.0.0.1"),
        isFreeOnHost(port, "::1"),
      ]).then(([ipv4, ipv6]) => {
        if (ipv4 && ipv6) {
          resolve(port);
        } else {
          tryNext();
        }
      });
    };

    tryNext();
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// Public API
// ─────────────────────────────────────────────────────────────────────────────

export interface RenderServerCallbacks {
  onStage: (stage: RenderStage, message: string) => void;
  onProgress: (progress: number, renderedFrames: number) => void;
  /** AbortSignal from the HTTP request — cancels the render when the client disconnects. */
  signal?: AbortSignal;
}

export interface RenderServerResult {
  fileId: string;
  filePath: string;
  sizeBytes: number;
  durationMs: number;
}

/** Thrown for expected, user-facing failures (bad input, unsupported options). */
export class RenderValidationError extends Error {}

/**
 * Renders a video project to an MP4 file using the installed Remotion APIs.
 *
 * @returns Metadata about the written file (inside `.renders/`).
 */
export async function renderVideoToMp4(
  request: RenderRequest,
  callbacks: RenderServerCallbacks,
): Promise<RenderServerResult> {
  const startedAt = Date.now();

  // ── Validate against the registry ────────────────────────────────────────
  callbacks.onStage("validating", "Validating render settings…");
  const template = getTemplateDefinition(request.templateId);
  if (!template) {
    throw new RenderValidationError(
      `Unknown template "${request.templateId}".`
    );
  }
  if (!template.supportedAspectRatios.includes(request.aspectRatio)) {
    throw new RenderValidationError(
      `Template "${template.name}" does not support the ${request.aspectRatio} aspect ratio. Supported: ${template.supportedAspectRatios.join(", ")}.`
    );
  }

  // ── Prepare headless browser (downloads Chrome Headless Shell on first run) ──
  callbacks.onStage("preparing-browser", "Preparing headless browser…");
  await ensureBrowser();

  // ── Bundle the Remotion project ──────────────────────────────────────────
  callbacks.onStage("bundling", "Bundling Remotion project…");
  const serveUrl = await getServeUrl();

  // ── Select the composition and apply request overrides ───────────────────
  callbacks.onStage(
    "selecting-composition",
    `Selecting composition "${request.templateId}"…`
  );
  const renderPort = await findFreeRenderPort();

  const registered = await selectComposition({
    serveUrl,
    id: request.templateId,
    inputProps: request.content as unknown as Record<string, unknown>,
    port: renderPort,
  });

  const { width, height } = ASPECT_RATIO_DIMENSIONS[request.aspectRatio];
  const composition = {
    ...registered,
    width,
    height,
    durationInFrames: request.durationInFrames,
    fps: request.fps,
  };

  // ── Render frames + encode MP4 ───────────────────────────────────────────
  fs.mkdirSync(RENDERS_DIR, { recursive: true });
  const fileId = `${Date.now().toString(36)}-${crypto.randomBytes(4).toString("hex")}.mp4`;
  const filePath = path.join(RENDERS_DIR, fileId);

  callbacks.onStage("rendering", "Rendering frames…");

  const { cancelSignal, cancel } = makeCancelSignal();
  const onAbort = () => cancel();
  callbacks.signal?.addEventListener("abort", onAbort, { once: true });

  try {
    await renderMedia({
      composition,
      serveUrl,
      codec: "h264",
      outputLocation: filePath,
      inputProps: request.content as unknown as Record<string, unknown>,
      overwrite: true,
      logLevel: "error",
      cancelSignal,
      port: renderPort,
      onProgress: ({ progress, renderedFrames }) => {
        callbacks.onProgress(progress, renderedFrames);
      },
    });
  } finally {
    callbacks.signal?.removeEventListener("abort", onAbort);
  }

  callbacks.onStage("finalizing", "Finalizing video…");

  const stat = fs.statSync(filePath);
  if (!stat.isFile() || stat.size === 0) {
    throw new Error("Rendering finished but the output file is empty.");
  }

  return {
    fileId,
    filePath,
    sizeBytes: stat.size,
    durationMs: Date.now() - startedAt,
  };
}