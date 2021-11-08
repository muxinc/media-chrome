// Snowpack Configuration File
// See all supported options: https://www.snowpack.dev/reference/configuration

/** @type {import("snowpack").SnowpackUserConfig } */
module.exports = {
  extends: './snowpack.dev.config.cjs',
  mount: {
    '__tests__/setup': { url: '/dist/test-setup' },
  },
  packageOptions: {
    /* ... */
    polyfillNode: true,
  },
  testOptions: {
    files: ['__tests__/@(unit|integration)/**/*.@(test|spec).js', '__tests__/setup/**/*'],
  },
  alias: {
    'graceful-fs': 'memfs',
  },
};
