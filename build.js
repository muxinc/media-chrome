import _ from 'lodash';
import chokidar from 'chokidar';
import esbuild from 'esbuild';
import glob from 'tiny-glob';
import serveHandler from 'serve-handler';
import http from 'http';

const args = process.argv;

async function build(opts = {}) {
  const start = Date.now();

  let entryPoints = await glob('./src/js/media-*.js');
  await esbuild.build({
    entryPoints,
    bundle: true,
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

  server.listen(3000, () => {
    console.log('💫 Preview server running at http://localhost:3000');
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
