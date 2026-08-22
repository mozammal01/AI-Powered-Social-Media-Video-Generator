import {
  renderVideoToMp4,
  RenderValidationError,
} from "@/lib/render/render-server";
import {
  renderRequestSchema,
  type RenderStreamEvent,
} from "@/lib/render/render-request";

// Rendering uses Node-only APIs (@remotion/renderer) — never run in an edge runtime.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const NEWLINE = String.fromCharCode(10);

/**
 * POST /api/render
 *
 * Accepts a VideoProject render request and responds with a stream of
 * NDJSON events (one JSON object per line):
 *
 *   {"type":"stage","stage":"bundling","message":"…"}
 *   {"type":"progress","progress":0.42,"renderedFrames":126}
 *   {"type":"done","fileId":"…","url":"/api/render/file?id=…", …}
 *   {"type":"error","message":"…"}
 *
 * The UI stays interactive while this runs; closing the connection cancels
 * the in-flight render via the request's AbortSignal.
 */
export async function POST(request: Request) {
  // ── Validate input safely before touching the renderer ──────────────────
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return Response.json(
      { error: "Request body must be valid JSON." },
      { status: 400 }
    );
  }

  const parsed = renderRequestSchema.safeParse(payload);
  if (!parsed.success) {
    const firstIssue = parsed.error.issues[0];
    return Response.json(
      {
        error: firstIssue
          ? `${firstIssue.path.join(".") || "input"}: ${firstIssue.message}`
          : "Invalid render request.",
        issues: parsed.error.issues.map((issue) => ({
          path: issue.path.join("."),
          message: issue.message,
        })),
      },
      { status: 400 }
    );
  }

  const encoder = new TextEncoder();

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      let closed = false;

      const send = (event: RenderStreamEvent) => {
        if (closed) return;
        try {
          controller.enqueue(
            encoder.encode(JSON.stringify(event) + NEWLINE)
          );
        } catch {
          closed = true;
        }
      };

      try {
        const result = await renderVideoToMp4(parsed.data, {
          onStage: (stage, message) => send({ type: "stage", stage, message }),
          onProgress: (progress, renderedFrames) =>
            send({ type: "progress", progress, renderedFrames }),
          signal: request.signal,
        });

        const params = new URLSearchParams({ id: result.fileId });
        send({
          type: "done",
          fileId: result.fileId,
          url: `/api/render/file?${params.toString()}`,
          downloadUrl: `/api/render/file?${params.toString()}&download=1`,
          sizeBytes: result.sizeBytes,
          durationMs: result.durationMs,
        });
      } catch (error) {
        if (request.signal.aborted) {
          send({ type: "error", message: "Render cancelled." });
        } else if (error instanceof RenderValidationError) {
          send({ type: "error", message: error.message });
        } else {
          console.error("[/api/render] Render failed:", error);
          const message =
            error instanceof Error
              ? error.message
              : "An unexpected error occurred while rendering.";
          send({ type: "error", message });
        }
      } finally {
        closed = true;
        try {
          controller.close();
        } catch {
          /* already closed */
        }
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "application/x-ndjson; charset=utf-8",
      "Cache-Control": "no-store, no-transform",
      Connection: "keep-alive",
    },
  });
}