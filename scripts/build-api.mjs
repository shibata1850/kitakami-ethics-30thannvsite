import * as esbuild from 'esbuild';
import fs from 'fs';

// Clean up old files
if (fs.existsSync('api/index.mjs')) fs.unlinkSync('api/index.mjs');
if (fs.existsSync('api/index.js')) fs.unlinkSync('api/index.js');

console.log('[build-api] Starting bundle...');

// Build the API handler with all dependencies bundled
// Output as .mjs to ensure ESM is used (Vercel respects file extensions)
await esbuild.build({
  entryPoints: ['src/api-handler.ts'],
  bundle: true,
  platform: 'node',
  target: 'node18',
  format: 'esm',
  outfile: 'api/index.mjs',
  // Don't externalize anything - bundle everything
  external: [],
  // Handle node: prefix imports and provide CommonJS compatibility
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
  // Don't minify for easier debugging
  minify: false,
  // Tree shaking
  treeShaking: true,
  // Log level for debugging
  logLevel: 'info',
});

// Verify output
const stats = fs.statSync('api/index.mjs');
console.log(`[build-api] Bundle created: api/index.mjs (${(stats.size / 1024 / 1024).toFixed(2)} MB)`);

// List files in api directory
console.log('[build-api] Files in api/:', fs.readdirSync('api'));
