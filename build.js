const _ = require('lodash');
const chokidar = require('chokidar');
const esbuild = require('esbuild');
const glob = require('tiny-glob');
const serveHandler = require('serve-handler');
const http = require('http');

const args = process.argv;
const PORT = 3001;

async function build(opts = {}) {
  const start = Date.now();

  await esbuild.build({
    entryPoints: ['./index.js'],
    bundle: true,
    outfile: './dist/index.js',
  });

  let entryPoints = await glob('./src/js/media-*.js');
  await esbuild.build({
    entryPoints,
    outdir: 'dist',
    loader: { '.svg': 'text' },
    ...opts,
  });

  console.log(`👏 Built ${entryPoints.length} files in ${Date.now() - start}ms`);
};

if (args.includes('--dev')) {
  const server = http.createServer((request, response) => {
    // You pass two more arguments for config and middleware
    // More details here: https://github.com/vercel/serve-handler#options
    return serveHandler(request, response);
  })

  server.listen(PORT, () => {
    console.log(`💫 Preview server running at http://localhost:${PORT}`);
  });

  const watcher = chokidar.watch('./src', {
    ignored: /(^|[\/\\])\../, // ignore dotfiles
    persistent: true
  });

  watcher.on('all', _.throttle(async (event, path) => {
    await build();
  }, 250, { trailing: false }));
} else {
  build({ minify: true });
}
