// Snowpack Configuration File
// See all supported options: https://www.snowpack.dev/reference/configuration

/** @type {import("snowpack").SnowpackUserConfig } */
module.exports = {
  extends: './snowpack.common.config.js',
  mount: {
    'src/js': { url: '/' },
  },
  optimize: {
    bundle: false,
    minify: false,
    target: 'es2019',
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
    out: './dist'
  },
};
