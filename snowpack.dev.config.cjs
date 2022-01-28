// Snowpack Configuration File
// See all supported options: https://www.snowpack.dev/reference/configuration

/** @type {import("snowpack").SnowpackUserConfig } */
module.exports = {
  extends: './snowpack.common.config.cjs',
  mount: {
    'src/js': { url: '/dist' },
    // Mount "public" to the root URL path ("/*") and serve files with zero transformations:
    examples: { url: '/examples', static: true, resolve: false },
  },
  routes: [
    {
      match: 'routes',
      src: '/',
      dest: (_req, resp) => {
        resp.statusCode = 302;
        resp.setHeader('Location', '/examples/index.html');
        return resp.end();
      },
    },
  ],
  plugins: [
    /* ... */
  ],
  packageOptions: {
    /* ... */
  },
  devOptions: {
    openUrl: '/examples/index.html',
  },
  buildOptions: {},
};
