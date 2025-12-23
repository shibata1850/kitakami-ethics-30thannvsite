import * as esbuild from 'esbuild';

// Build the API handler with all dependencies bundled
await esbuild.build({
  entryPoints: ['src/api-handler.ts'],
  bundle: true,
  platform: 'node',
  target: 'node18',
  format: 'esm',
  outfile: 'api/index.mjs',
  // Only externalize Node.js built-in modules
  external: [
    'node:*',
    // Vercel will provide these at runtime
    '@vercel/node',
  ],
  // Handle node: prefix imports
  banner: {
    js: `
import { createRequire } from 'module';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
const require = createRequire(import.meta.url);
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
`,
  },
  // Ensure source maps for debugging
  sourcemap: false,
  // Minify for smaller bundle size
  minify: false,
  // Tree shaking
  treeShaking: true,
});

console.log('API bundle built successfully: api/index.mjs');
