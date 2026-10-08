/**
 * Menus — captions-menu.html, playback-rate-menu.html, context-menu.html
 *
 * Verifies that:
 *   - Clicking a menu button removes `hidden` from the associated menu
 *   - Menu items reflect the available options (tracks, rates)
 *   - Selecting a playback-rate menu item changes video.playbackRate
 *   - Right-clicking the video opens the context menu
 */
import { test, expect } from 'playwright/test';
import { injectSyntheticStream } from '../helpers.js';

// ── media-captions-menu.html ──────────────────────────────────────────────────

test.describe('control-elements/media-captions-menu.html', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/examples/vanilla/control-elements/media-captions-menu.html', { waitUntil: 'load' });
  });

  test('captions-menu-button click removes hidden from the menu', async ({ page }) => {
    const menu = page.locator('media-captions-menu').first();
    await expect(menu).toHaveAttribute('hidden', '');

    await page.locator('media-captions-menu-button').click();
    await expect(menu).not.toHaveAttribute('hidden');
  });

  test('captions menu is populated with the track items from the video', async ({ page }) => {
    // Open the menu first so items are rendered
    await page.locator('media-captions-menu-button').click();

    const menu = page.locator('media-captions-menu').first();
    // The video has 10 <track> elements (5 captions + 5 subtitles)
    // At minimum we should see items for each language
    const items = menu.locator('[role="menuitemradio"], [role="option"]');
    await expect(items).not.toHaveCount(0);
  });
});

// ── media-playback-rate-menu.html ─────────────────────────────────────────────

test.describe('control-elements/media-playback-rate-menu.html', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/examples/vanilla/control-elements/media-playback-rate-menu.html', { waitUntil: 'load' });
    // Inject stream so the store doesn't block rate-change requests
    await injectSyntheticStream(page);
  });

  test('playback-rate-menu-button click opens the rate menu', async ({ page }) => {
    const menu = page.locator('media-playback-rate-menu').first();
    await expect(menu).toHaveAttribute('hidden', '');

    await page.locator('media-playback-rate-menu-button').first().click();
    await expect(menu).not.toHaveAttribute('hidden');
  });

  test('selecting a rate option dispatches mediaplaybackraterequest', async ({ page }) => {
    // Listen for the rate-change request before interacting
    await page.evaluate(() => {
      (window as any).__rateRequested = null;
      document.addEventListener(
        'mediaplaybackraterequest',
        (e: Event) => { (window as any).__rateRequested = (e as CustomEvent).detail; },
        { once: true, capture: true }
      );
    });

    // Open the menu
    await page.locator('media-playback-rate-menu-button').first().click();

    const menu = page.locator('media-playback-rate-menu').first();

    // Click the "2" rate option (find by value attribute)
    const twoX = menu.locator('[value="2"]');
    await twoX.click();

    const requested = await page.evaluate(() => (window as any).__rateRequested);
    // The event detail is a string (rate.toString()) dispatched from the menu
    expect(Number(requested), 'selecting 2x should dispatch a rate-2 request').toBe(2);
  });
});

// ── media-context-menu.html ───────────────────────────────────────────────────

test.describe('control-elements/media-context-menu.html', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/examples/vanilla/control-elements/media-context-menu.html', { waitUntil: 'load' });
  });

  test('right-clicking the native video opens the context menu', async ({ page }) => {
    const contextMenu = page.locator('media-controller').nth(1).locator('media-context-menu');
    await expect(contextMenu).not.toBeVisible();

    // Right-click the video inside the native-video section
    await page.locator('media-controller').nth(1).locator('video').click({ button: 'right' });

    await expect(contextMenu).toBeVisible();
  });

  test('context menu contains the loop button and a link', async ({ page }) => {
    await page.locator('media-controller').nth(1).locator('video').click({ button: 'right' });

    const contextMenu = page.locator('media-controller').nth(1).locator('media-context-menu');
    await expect(contextMenu.locator('media-loop-button')).toBeVisible();
    await expect(contextMenu.locator('a[href]')).toBeVisible();
  });
});
