import "server-only";

import {
  generatedCopySchema,
  type GenerateCopyRequest,
  type GeneratedCopy,
} from "./copy-schema";

/**
 * Isolated server-side Gemini service.
 *
 * - The API key is read from the GEMINI_API_KEY environment variable and is
 *   NEVER sent to the client or embedded in client-side code.
 * - The only entry point is generateMarketingCopy(), which returns
 *   Zod-validated structured copy or throws a typed error.
 */

const NEWLINE = String.fromCharCode(10);
const DEFAULT_MODEL = "gemini-3.6-flash";
const API_BASE = "https://generativelanguage.googleapis.com/v1beta/models";
const TIMEOUT_MS = 30_000;

/** Thrown when GEMINI_API_KEY is not configured. */
export class GeminiConfigError extends Error {
  constructor() {
    super(
      "Gemini API key is not configured. Set GEMINI_API_KEY in your .env file to enable AI generation."
    );
    this.name = "GeminiConfigError";
  }
}

/** Thrown when the Gemini API itself fails (network, quota, upstream error). */
export class GeminiApiError extends Error {
  constructor(message: string) {
    super(`Gemini request failed: ${message}`);
    this.name = "GeminiApiError";
  }
}

/** Thrown when Gemini's response cannot be parsed into valid copy. */
export class GeminiParseError extends Error {
  constructor(message: string) {
    super(`Could not parse the AI response: ${message}`);
    this.name = "GeminiParseError";
  }
}

function getApiKey(): string {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey.trim().length === 0) {
    throw new GeminiConfigError();
  }
  return apiKey.trim();
}

function getModel(): string {
  const model = process.env.GEMINI_MODEL;
  return model && model.trim().length > 0 ? model.trim() : DEFAULT_MODEL;
}

function buildPrompt(request: GenerateCopyRequest): string {
  const lines: string[] = [
    "You are a senior social-media marketing copywriter.",
    "Write punchy, on-brand marketing copy for a short vertical video ad.",
    "",
    `Product name: ${request.productName}`,
  ];

  if (request.productDescription?.trim()) {
    lines.push(`Product context: ${request.productDescription.trim()}`);
  }
  if (request.targetAudience?.trim()) {
    lines.push(`Target audience: ${request.targetAudience.trim()}`);
  }

  lines.push(
    `Marketing tone: ${request.tone}.`,
    "",
    "Rules:",
    "- tagline: one memorable headline line (max 60 characters).",
    "- shortDescription: one-sentence value proposition (max 120 characters).",
    "- features: exactly 3 concrete selling points (max 40 characters each).",
    "- discountText: a short offer label such as '20% OFF' or 'Limited Time' (max 16 characters), or an empty string if none fits.",
    "- ctaText: one call-to-action button label (max 24 characters).",
    "- Keep every string plain text — no markdown, no quotes around values.",
    "",
    'Respond with ONLY a JSON object with keys: "tagline", "shortDescription", "features", "discountText", "ctaText".'
  );

  return lines.join(NEWLINE);
}

/** Strips optional ```json fences some models add despite JSON mime type. */
function extractJsonBlock(text: string): unknown {
  const fenced = /```(?:json)?\s*([\s\S]*?)```/.exec(text);
  const candidate = fenced ? fenced[1] : text;
  try {
    return JSON.parse(candidate);
  } catch {
    throw new GeminiParseError("the response was not valid JSON.");
  }
}

interface GeminiCandidate {
  content?: {
    parts?: Array<{ text?: string }>;
  };
}

export async function generateMarketingCopy(
  request: GenerateCopyRequest,
): Promise<GeneratedCopy> {
  const apiKey = getApiKey();
  const model = getModel();

  let response: Response;
  try {
    response = await fetch(
      `${API_BASE}/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(apiKey)}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: buildPrompt(request) }] }],
          generationConfig: {
            temperature: 0.8,
            responseMimeType: "application/json",
          },
        }),
        signal: AbortSignal.timeout(TIMEOUT_MS),
      }
    );
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "unknown network error";
    throw new GeminiApiError(message);
  }

  if (!response.ok) {
    let detail = `HTTP ${response.status}`;
    try {
      const body = (await response.json()) as { error?: { message?: string } };
      if (body.error?.message) detail = body.error.message;
    } catch {
      /* keep status-based detail */
    }
    if (response.status === 401 || response.status === 403) {
      throw new GeminiConfigError();
    }
    throw new GeminiApiError(detail);
  }

  const payload = (await response.json()) as {
    candidates?: GeminiCandidate[];
  };
  const text = payload.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) {
    throw new GeminiParseError("the response contained no text.");
  }

  const result = generatedCopySchema.safeParse(extractJsonBlock(text));
  if (!result.success) {
    const issue = result.error.issues[0];
    throw new GeminiParseError(
      issue ? `${issue.path.join(".")}: ${issue.message}` : "unexpected shape."
    );
  }

  return result.data;
}