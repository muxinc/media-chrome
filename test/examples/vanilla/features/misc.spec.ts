/**
 * Miscellaneous — state-change-events-demo.html, tooltips.html, pwa.html
 *
 * state-change-events-demo: verifies the live state table is pre-populated with
 *   a row per media state attribute on page load, and updates when state changes.
 *
 * tooltips: verifies that media-play-button has a tooltip element with text
 *   content, confirming tooltips are configured (not just rendered empty).
 *
 * pwa/index.html: verifies the player structure is present — media-controller
 *   wrapping a video with the expected controls.
 */
import { test, expect } from 'playwright/test';
import { injectSyntheticStream } from '../helpers.js';

// ── state-change-events-demo.html ─────────────────────────────────────────────

test.describe('state-change-events-demo.html', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/examples/vanilla/state-change-events-demo.html', { waitUntil: 'load' });
  });

  test('states table is pre-populated with one row per media state attribute', async ({ page }) => {
    // The script adds a <tr> per MediaStateChangeEvent on page load
    const rows = page.locator('#states-list tr');
    // 1 header row + at least one state rowbr
    await expect(rows).not.toHaveCount(1);
    const count = await rows.count();
    expect(count, 'should have header + state rows').toBeGreaterThan(5);
  });

  test('table has the expected column headers', async ({ page }) => {
    const headers = page.locator('#states-list th');
    await expect(headers).toHaveCount(3);
    await expect(headers.nth(0)).toHaveText('Attribute Name');
    await expect(headers.nth(1)).toHaveText('State Value');
    await expect(headers.nth(2)).toHaveText('Event Type');
  });

  test('muting updates the mediavolumelevel row in the table', async ({ page }) => {
    await injectSyntheticStream(page);

    // The demo video has `muted` in the HTML, so explicitly unmute it first
    // via JS so the store sees a "high" volume level before we test muting.
    await page.evaluate(() => {
      const video = document.querySelector('video') as HTMLVideoElement;
      if (video) video.muted = false;
    });

    // Find the row for mediavolumelevel state changes.
    // Row IDs are the event-type strings from MediaStateChangeEvents, which are
    // propName.toLowerCase() — so 'mediaVolumeLevel' → 'mediavolumelevel'.
    const row = page.locator('#mediavolumelevel');

    // Wait until the row reflects an unmuted state before muting
    await expect(row.locator('td').nth(1)).not.toHaveText('off');

    // Mute via the button — the row should update to 'off'
    await page.locator('media-mute-button').click();
    await expect(row.locator('td').nth(1)).toHaveText('off');
  });
});

// ── tooltips.html ─────────────────────────────────────────────────────────────

test.describe('tooltips.html', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/examples/vanilla/tooltips.html', { waitUntil: 'load' });
  });

  test('media-play-button has a tooltip element with text content', async ({ page }) => {
    const tooltipText = await page.evaluate(() => {
      const btn = document.querySelector('media-play-button') as HTMLElement;
      const shadow = btn?.shadowRoot;
      return shadow?.querySelector('media-tooltip')?.textContent?.trim() ?? '';
    });
    expect(tooltipText.length, 'tooltip should have non-empty text').toBeGreaterThan(0);
  });

  test('hovering the play button makes the tooltip visible', async ({ page }) => {
    const playBtn = page.locator('media-play-button').first();

    await playBtn.hover();

    const visible = await page.evaluate(() => {
      const btn = document.querySelector('media-play-button') as HTMLElement;
      const tooltip = btn?.shadowRoot?.querySelector('media-tooltip') as HTMLElement | null;
      if (!tooltip) return false;
      return getComputedStyle(tooltip).display !== 'none';
    });

    expect(visible, 'tooltip should be visible on hover').toBe(true);
  });
});

// ── pwa/index.html ────────────────────────────────────────────────────────────

test.describe('pwa/index.html', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/examples/vanilla/pwa/index.html', { waitUntil: 'load' });
  });

  test('media-controller contains a video element', async ({ page }) => {
    const video = page.locator('media-controller video[slot="media"]');
    await expect(video).toHaveCount(1);
  });

  test('essential controls are present', async ({ page }) => {
    await expect(page.locator('media-play-button')).not.toHaveCount(0);
    await expect(page.locator('media-fullscreen-button')).not.toHaveCount(0);
    await expect(page.locator('media-seek-forward-button')).not.toHaveCount(0);
  });

  test('play button dispatches mediaplayrequest', async ({ page }) => {
    await page.evaluate(() => {
      (window as any).__fired = false;
      document.addEventListener('mediaplayrequest', () => { (window as any).__fired = true; }, { once: true, capture: true });
    });

    await page.locator('media-play-button').first().click();

    expect(await page.evaluate(() => (window as any).__fired)).toBe(true);
  });
});
