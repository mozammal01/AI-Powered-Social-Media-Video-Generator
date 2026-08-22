import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    // Template preview thumbnails are trusted, first-party SVGs in /public.
    dangerouslyAllowSVG: true,
    contentDispositionType: "inline",
  },
  // Remotion's Node-side rendering stack must be required at runtime instead
  // of bundled by Turbopack/webpack (native binaries, esbuild platform
  // packages, and dynamic requires break when bundled).
  serverExternalPackages: [
    "@remotion/bundler",
    "@remotion/renderer",
    "@remotion/tailwind-v4",
    "esbuild",
  ],
};

export default nextConfig;