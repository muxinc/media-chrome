import { playwrightLauncher } from '@web/test-runner-playwright';

const config = {
  /** Test files to run */
  files: 'test/@(unit|integration)/**/*.@(test|spec).js',

  /** Resolve bare module imports */
  nodeResolve: true,

  /** Compile JS for older browsers. Requires @web/dev-server-esbuild plugin */
  // esbuildTarget: 'auto',

  /** Amount of test files per browser to test concurrently */
  // concurrency: 1,
};

if (process.argv.some((arg) => arg.includes('--all'))) {
  Object.assign(config, {
    concurrentBrowsers: 3,
    browsers: [
      playwrightLauncher({
        product: 'chromium',
        launchOptions: {
          channel: 'chrome',
        },
      }),
      playwrightLauncher({ product: 'firefox' }),
      playwrightLauncher({ product: 'webkit' }),
    ],
  });
}

export default /** @type {import("@web/test-runner").TestRunnerConfig} */ config;
