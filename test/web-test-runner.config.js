import process from 'node:process';
import { esbuildPlugin } from '@web/dev-server-esbuild';
import { playwrightLauncher } from '@web/test-runner-playwright';
import { chromeLauncher } from '@web/test-runner';

const config = {
  /** Test files to run */
  files: 'test/@(unit|integration)/**/*.@(test|spec).(ts|js)',

  /** Resolve bare module imports */
  nodeResolve: true,

  /** Compile JS for older browsers. Requires @web/dev-server-esbuild plugin */
  plugins: [esbuildPlugin({ ts: true, json: true })],

  /** Amount of test files per browser to test concurrently */
  // concurrency: 1,

  browsers: [chromeLauncher({ launchOptions: { args: ['--headless'] } })],
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
