import { staticFile } from 'remotion';

/**
 * Resolves a content URL for Remotion rendering.
 * Absolute http(s) URLs pass through; relative paths use staticFile().
 */
export function resolveAssetUrl(url?: string): string | undefined {
  if (!url) return undefined;
  if (
    url.startsWith('http://') ||
    url.startsWith('https://') ||
    url.startsWith('data:') ||
    url.startsWith('blob:')
  ) {
    return url;
  }
  const normalized = url.startsWith('/') ? url.slice(1) : url;
  return staticFile(normalized);
}
