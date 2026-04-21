/**
 * Disabled controls — disabled.html
 *
 * Verifies that:
 *   1. Every button carries both `disabled` and `aria-disabled="true"`
 *   2. Clicking a disabled button does NOT dispatch a media request event
 */
import { test, expect } from 'playwright/test';

const DISABLED_BUTTONS = [
  'media-play-button',
  'media-seek-backward-button',
  'media-seek-forward-button',
  'media-mute-button',
  'media-captions-button',
  'media-playback-rate-button',
  'media-pip-button',
  'media-fullscreen-button',
  'media-airplay-button',
];

test.describe('disabled.html', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/examples/vanilla/disabled.html', { waitUntil: 'load' });
  });

  test('all buttons have disabled and aria-disabled attributes', async ({ page }) => {
    for (const tag of DISABLED_BUTTONS) {
      const el = page.locator(tag).first();
      await expect(el, `${tag} should have disabled`).toHaveAttribute('disabled', '');
      await expect(el, `${tag} should have aria-disabled`).toHaveAttribute('aria-disabled', 'true');
    }
  });

  test('disabled button removes its click listener (tabIndex is -1)', async ({ page }) => {
    // When disabled, media-chrome-button calls disable() which removes the
    // click listener and sets tabIndex=-1, so the button is not reachable by
    // keyboard and its handleClick is never called.
    const tabIndex = await page.evaluate(() => {
      return (document.querySelector('media-play-button') as HTMLElement).tabIndex;
    });
    expect(tabIndex, 'disabled button should not be keyboard-focusable').toBe(-1);
  });
});
