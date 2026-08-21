// See all configuration options: https://remotion.dev/docs/config
// Each option also is available as a CLI flag: https://remotion.dev/docs/cli

// Note: When using the Node.JS APIs, the config file doesn't apply. Instead, pass options directly to the APIs

import path from 'path';
import { Config } from '@remotion/cli/config';
import { enableTailwind } from '@remotion/tailwind-v4';

Config.setRspack(true);
Config.setVideoImageFormat('jpeg');
Config.setOverwriteOutput(true);
Config.overrideBundlerConfig((config) => {
  const withTailwind = enableTailwind(config);
  withTailwind.resolve = withTailwind.resolve ?? {};
  withTailwind.resolve.alias = {
    ...(withTailwind.resolve.alias as Record<string, string> | undefined),
    '@': path.resolve(process.cwd(), 'src'),
  };
  return withTailwind;
});
