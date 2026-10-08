/**
 * Playback tests — scope: pages with native <video> or <audio>
 *
 * Checks that each example's media element can actually start playing.
 * Uses a synthetic stream (canvas / AudioContext) instead of a real network
 * source so tests are fast and reliable in CI.
 *
 * Pages with only third-party custom media elements (mux-video, hls-video,
 * etc.) are auto-skipped at runtime because we cannot inject a synthetic
 * source into them.
 */
import { test, expect } from 'playwright/test';
import { findHtmlFiles, EXAMPLES_DIR, SKIP_PLAY_TEST, injectSyntheticStream } from './helpers.js';

test.describe.configure({ mode: 'parallel' });

const htmlFiles = findHtmlFiles(EXAMPLES_DIR);

for (const relPath of htmlFiles) {
  test(`vanilla/${relPath} - media plays`, async ({ page }) => {
    test.skip(SKIP_PLAY_TEST.has(relPath));

    await page.goto(`/examples/vanilla/${relPath}`, { waitUntil: 'load' });

    // Skip if no native element found (only custom media elements present)
    const hasNativeMedia = await page.evaluate(() => {
      const mediaEl = document.querySelector('video, audio') as HTMLMediaElement | null;
      return !!mediaEl && !mediaEl.tagName.includes('-');
    });

    if (!hasNativeMedia) {
      test.skip();
      return;
    }

    await injectSyntheticStream(page);

    const result = await page.evaluate(async () => {
      const mediaEl = document.querySelector(
        'video, audio'
      ) as HTMLVideoElement | HTMLAudioElement | null;

      try {
        await mediaEl!.play();
      } catch (err) {
        return { playing: false, error: String(err) };
      }

      return { playing: !mediaEl!.paused };
    });

    expect(
      result.playing,
      `Media did not start playing${result.error ? `: ${result.error}` : ''}`
    ).toBe(true);
  });
}
