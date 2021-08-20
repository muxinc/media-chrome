const { version: PLAYER_VERSION } = require("./package.json");

// process.env.SNOWPACK_PUBLIC_PLAYER_VERSION = PLAYER_VERSION;

// Snowpack Configuration File
// See all supported options: https://www.snowpack.dev/reference/configuration

/** @type {import("snowpack").SnowpackUserConfig } */
module.exports = {
  mount: {
    /* ... */
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
    /* ... */
    env: {
      PLAYER_VERSION,
    },
  },
};
