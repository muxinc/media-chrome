import esbuild from 'esbuild';
import http from 'http';
import fs from 'fs';
import path from 'path';
import os from 'os';

const interfaces = os.networkInterfaces();

async function serve() {
  const port = await getFreePort(8000);

  console.log('');
  console.log(` > Local:   http://localhost:${port}/examples/`);
  console.log(` > Network: http://${getNetworkAddress()}:${port}/examples/`);

  // Start esbuild's server on local port 8010
  esbuild
    .serve(
      {
        servedir: '.',
        port: 0, // port zero makes it find an unused port
      },
      {
        entryPoints: [...walkSync('src/js/')].filter((entry) =>
          entry.endsWith('.js')
        ),
        outdir: 'dist',
        target: 'es2019',
      }
    )
    .then((result) => {
      // The result tells us where esbuild's local server is
      // Then start a proxy server on port 8000
      http
        .createServer((req, res) => {
          const options = {
            hostname: result.host,
            port: result.port,
            path: req.url,
            method: req.method,
            headers: req.headers,
          };

          // Forward each incoming request to esbuild
          const proxyReq = http.request(options, (proxyRes) => {
            // If esbuild returns "not found", send a custom 404 page
            if (proxyRes.statusCode === 404) {
              res.writeHead(404, { 'Content-Type': 'text/html' });
              res.end('<h1>404 Page Not Found</h1>');
              return;
            }

            if (proxyRes.req.path === '/') {
              res.writeHead(302, { Location: '/examples' });
              res.end();
              return;
            }

            // Otherwise, forward the response from esbuild to the client
            res.writeHead(proxyRes.statusCode, proxyRes.headers);
            proxyRes.pipe(res, { end: true });
          });

          // Forward the body of the request to esbuild
          req.pipe(proxyReq, { end: true });
        })
        .listen(port);
    });
}

function* walkSync(dir) {
  const files = fs.readdirSync(dir, { withFileTypes: true });
  for (const file of files) {
    if (file.isDirectory()) {
      yield* walkSync(path.join(dir, file.name));
    } else {
      yield path.join(dir, file.name);
    }
  }
}

function getNetworkAddress() {
  for (const name of Object.keys(interfaces)) {
    for (const ifc of interfaces[name]) {
      const { address, family, internal } = ifc;
      if (family === 'IPv4' && !internal) {
        return address;
      }
    }
  }
}

async function getFreePort(base = 8000) {
  for (let port = base; port < base + 100; port++) {
    if (await isPortAvailable(port)) return port;
  }
}

function isPortAvailable(port) {
  return new Promise((resolve) => {
    const tester = http
      .createServer()
      .once('error', () => resolve(false))
      .once('listening', () =>
        tester.once('close', () => resolve(true)).close()
      )
      .listen(port);
  });
}

serve();
