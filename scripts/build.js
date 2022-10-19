import esbuild from 'esbuild';
import globby from 'globby';

const baseConfig = {
  target: 'es2019',
  logLevel: 'info',
};

// ESM
await esbuild.build({
  ...baseConfig,
  entryPoints: await globby(['src/js/**/*.js']),
  format: 'esm',
  outdir: 'dist',
});

// CJS
await esbuild.build({
  ...baseConfig,
  entryPoints: await globby(['src/js/**/*.js']),
  format: 'cjs',
  outdir: 'dist/cjs',
});

// IIFE
await esbuild.build({
  ...baseConfig,
  entryPoints: ['src/js/index.js'],
  format: 'iife',
  bundle: true,
  minify: true,
  sourcemap: true,
  outdir: 'dist/iife',
  globalName: 'MediaChrome',
});

// ESM Module
await esbuild.build({
  ...baseConfig,
  entryPoints: ['src/js/index.js'],
  format: 'esm',
  bundle: true,
  sourcemap: true,
  outfile: 'dist/media-chrome.mjs',
});
