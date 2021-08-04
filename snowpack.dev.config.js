// Snowpack Configuration File
// See all supported options: https://www.snowpack.dev/reference/configuration

/** @type {import("snowpack").SnowpackUserConfig } */
module.exports = {
  extends: './snowpack.common.config.js',
  mount: {
    'src/js': { url: '/dist' },
    // Mount "public" to the root URL path ("/*") and serve files with zero transformations:
    examples: { url: '/examples', static: true, resolve: false },
  },
  plugins: [
    /* ... */
  ],
  packageOptions: {
    /* ... */
  },
  devOptions: {
    /* ... */
  },
  buildOptions: {
  },
};
