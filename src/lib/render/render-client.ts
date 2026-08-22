"use client";

import type { RenderRequest, RenderStreamEvent } from "./render-request";

export interface RenderClientCallbacks {
  /** Coarse phase changes (bundling, rendering, …). */
  onStage?: (message: string) => void;
  /** Frame-render progress, 0 → 1. */
  onProgress?: (progress: number) => void;
}

export interface RenderClientResult {
  fileId: string;
  url: string;
  downloadUrl: string;
  sizeBytes: number;
  durationMs: number;
}

const NEWLINE = String.fromCharCode(10);

/**
 * Starts a server-side render and consumes its NDJSON progress stream.
 *
 * The UI stays responsive: this is a plain async function — the caller
 * decides how to reflect progress/state.
 *
 * @throws Error with a user-facing message when the render fails.
 */
export async function startRender(
  request: RenderRequest,
  callbacks: RenderClientCallbacks = {},
  signal?: AbortSignal
): Promise<RenderClientResult> {
  const response = await fetch("/api/render", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(request),
    signal,
  });

  if (!response.ok || !response.body) {
    // Non-streaming failure (validation errors return JSON).
    let message = `Render request failed (HTTP ${response.status}).`;
    try {
      const data = await response.json();
      if (typeof data?.error === "string") message = data.error;
    } catch {
      /* keep default message */
    }
    throw new Error(message);
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  let result: RenderClientResult | null = null;

  const handleEvent = (event: RenderStreamEvent) => {
    switch (event.type) {
      case "stage":
        callbacks.onStage?.(event.message);
        break;
      case "progress":
        callbacks.onProgress?.(event.progress);
        break;
      case "done":
        result = {
          fileId: event.fileId,
          url: event.url,
          downloadUrl: event.downloadUrl,
          sizeBytes: event.sizeBytes,
          durationMs: event.durationMs,
        };
        break;
      case "error":
        throw new Error(event.message);
    }
  };

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split(NEWLINE);
    buffer = lines.pop() ?? "";

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed) continue;
      handleEvent(JSON.parse(trimmed) as RenderStreamEvent);
    }
  }

  const remaining = buffer.trim();
  if (remaining) {
    handleEvent(JSON.parse(remaining) as RenderStreamEvent);
  }

  if (!result) {
    throw new Error("The render stream ended without a result.");
  }
  return result;
}