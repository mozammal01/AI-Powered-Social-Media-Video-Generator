import fs from "node:fs";
import path from "node:path";
import { Readable } from "node:stream";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const RENDERS_DIR = path.join(process.cwd(), ".renders");

/**
 * Only allow file names that the render API itself generates.
 * Blocks path traversal (e.g. `?id=..%2F..%2Fpackage.json`).
 */
const FILE_ID_PATTERN = /^[a-z0-9]+-[a-f0-9]{8}\.mp4$/i;

/**
 * GET /api/render/file?id=<fileId>[&download=1]
 *
 * Streams a rendered MP4 from the server's `.renders/` directory.
 * Supports HTTP Range requests so the <video> element can seek.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id") ?? "";

  if (!FILE_ID_PATTERN.test(id)) {
    return Response.json({ error: "Invalid file id." }, { status: 400 });
  }

  const filePath = path.join(RENDERS_DIR, id);
  if (!fs.existsSync(filePath)) {
    return Response.json(
      { error: "Rendered video not found. It may have been removed." },
      { status: 404 }
    );
  }

  const stat = fs.statSync(filePath);
  if (!stat.isFile()) {
    return Response.json({ error: "Invalid file." }, { status: 400 });
  }

  const download = searchParams.get("download") === "1";
  const disposition = download
    ? `attachment; filename="video-${id}"`
    : "inline";

  const baseHeaders: Record<string, string> = {
    "Content-Type": "video/mp4",
    "Content-Disposition": disposition,
    "Accept-Ranges": "bytes",
    "Cache-Control": "private, max-age=3600",
  };

  // ── Range request (video seeking) ────────────────────────────────────────
  const rangeHeader = request.headers.get("range");
  if (rangeHeader) {
    const match = /bytes=(\d*)-(\d*)/.exec(rangeHeader);
    if (match) {
      const start = match[1] ? Number.parseInt(match[1], 10) : 0;
      const end = match[2]
        ? Number.parseInt(match[2], 10)
        : stat.size - 1;

      if (
        Number.isNaN(start) ||
        Number.isNaN(end) ||
        start > end ||
        start >= stat.size
      ) {
        return new Response(null, {
          status: 416,
          headers: { "Content-Range": `bytes */${stat.size}` },
        });
      }

      const safeEnd = Math.min(end, stat.size - 1);
      const stream = Readable.toWeb(
        fs.createReadStream(filePath, { start, end: safeEnd })
      ) as unknown as ReadableStream<Uint8Array>;

      return new Response(stream, {
        status: 206,
        headers: {
          ...baseHeaders,
          "Content-Range": `bytes ${start}-${safeEnd}/${stat.size}`,
          "Content-Length": String(safeEnd - start + 1),
        },
      });
    }
  }

  // ── Full file ────────────────────────────────────────────────────────────
  const stream = Readable.toWeb(
    fs.createReadStream(filePath)
  ) as unknown as ReadableStream<Uint8Array>;

  return new Response(stream, {
    status: 200,
    headers: {
      ...baseHeaders,
      "Content-Length": String(stat.size),
    },
  });
}