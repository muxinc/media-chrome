/**
 * Interaction tests — scope: targeted examples
 *
 * Verifies that controls are actually wired up and respond 
 * correctly to user input. Tests are written against specific
 * pages where the behaviour is unambiguous.
 *
 * Avoids full media-playback assertions (too flaky in CI). Instead it
 * validates event dispatch, state attribute changes, and DOM geometry.
 */
import { test, expect } from 'playwright/test';
import { injectSyntheticStream } from './helpers.js';

test.describe('standalone-controls.html', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/examples/vanilla/standalone-controls.html', {
      waitUntil: 'load',
    });
  });

  test('media-play-button dispatches play request when clicked', async ({
    page,
  }) => {
    await page.evaluate(() => {
      (window as any).__playRequestFired = false;
      document.addEventListener(
        'mediaplayrequest',
        () => { (window as any).__playRequestFired = true; },
        { once: true, capture: true }
      );
    });

    await page.locator('media-play-button').first().click();

    const fired = await page.evaluate(() => (window as any).__playRequestFired);
    expect(fired, 'mediaplayrequest event was not dispatched').toBe(true);
  });

  test('media-mute-button toggles mute state', async ({ page }) => {
    await injectSyntheticStream(page);

    const muteBtn = page.locator('media-mute-button').first();

    await expect(muteBtn).not.toHaveAttribute('mediavolumelevel', 'off');
    await muteBtn.click();
    await expect(muteBtn).toHaveAttribute('mediavolumelevel', 'off');
    await muteBtn.click();
    await expect(muteBtn).not.toHaveAttribute('mediavolumelevel', 'off');
  });

  test('media-time-range is rendered with measurable width', async ({
    page,
  }) => {
    const timeRange = page.locator('media-time-range').first();
    const box = await timeRange.boundingBox();

    expect(box, 'media-time-range is not visible').not.toBeNull();
    expect(box!.width, 'media-time-range has zero width').toBeGreaterThan(0);
  });
});
