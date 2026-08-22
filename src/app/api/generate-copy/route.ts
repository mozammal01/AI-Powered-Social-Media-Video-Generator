import {
  GeminiApiError,
  GeminiConfigError,
  GeminiParseError,
  generateMarketingCopy,
} from "@/lib/ai/gemini";
import { generateCopyRequestSchema } from "@/lib/ai/copy-schema";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * POST /api/generate-copy
 *
 * Secure server-side proxy for the Gemini API:
 * - The GEMINI_API_KEY lives only in environment variables on the server.
 * - Input is validated with Zod before reaching the AI service.
 * - The AI response is validated with Zod before being returned.
 *
 * Responses:
 *   200 { copy: GeneratedCopy }
 *   400 { error }            — invalid input
 *   503 { error, code }      — Gemini not configured (missing/invalid key)
 *   502 { error }            — Gemini upstream or parse failure
 */
export async function POST(request: Request) {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return Response.json(
      { error: "Request body must be valid JSON." },
      { status: 400 }
    );
  }

  const parsed = generateCopyRequestSchema.safeParse(payload);
  if (!parsed.success) {
    const firstIssue = parsed.error.issues[0];
    return Response.json(
      {
        error: firstIssue
          ? `${firstIssue.path.join(".") || "input"}: ${firstIssue.message}`
          : "Invalid request.",
      },
      { status: 400 }
    );
  }

  try {
    const copy = await generateMarketingCopy(parsed.data);
    return Response.json({ copy });
  } catch (error) {
    if (error instanceof GeminiConfigError) {
      return Response.json(
        { error: error.message, code: "missing_api_key" },
        { status: 503 }
      );
    }
    if (error instanceof GeminiParseError) {
      return Response.json({ error: error.message }, { status: 502 });
    }
    if (error instanceof GeminiApiError) {
      console.error("[/api/generate-copy] Gemini error:", error.message);
      return Response.json({ error: error.message }, { status: 502 });
    }
    console.error("[/api/generate-copy] Unexpected error:", error);
    return Response.json(
      { error: "An unexpected error occurred while generating copy." },
      { status: 500 }
    );
  }
}