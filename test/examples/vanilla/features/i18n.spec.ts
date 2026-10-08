/**
 * Internationalization — basic-i18n.html, internationalization.html
 *
 * Verifies that:
 *   - Controls use the locale set via the `lang` attribute (aria-labels match
 *     the loaded translation strings)
 *   - Dynamically switching the `lang` attribute updates aria-labels in place
 */
import { test, expect } from 'playwright/test';

// ── basic-i18n.html ───────────────────────────────────────────────────────────

test.describe('basic-i18n.html', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/examples/vanilla/basic-i18n.html', { waitUntil: 'load' });
  });

  test('media-controller has lang="fr"', async ({ page }) => {
    await expect(page.locator('media-controller').first()).toHaveAttribute('lang', 'fr');
  });

  test('play button aria-label is the French translation', async ({ page }) => {
    // French translation for "play" is "lire" (dist/lang/fr.js)
    await expect(page.locator('media-play-button').first()).toHaveAttribute('aria-label', 'lire');
  });

  test('mute button aria-label is the French translation', async ({ page }) => {
    // French translation for "mute" is "désactiver le son"
    await expect(page.locator('media-mute-button').first()).toHaveAttribute('aria-label', 'désactiver le son');
  });
});

// ── internationalization.html ─────────────────────────────────────────────────

test.describe('internationalization.html', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/examples/vanilla/internationalization.html', { waitUntil: 'load' });
  });

  test('default language is English', async ({ page }) => {
    await expect(page.locator('#mc')).toHaveAttribute('lang', 'en');
    await expect(page.locator('media-play-button').first()).toHaveAttribute('aria-label', 'play');
  });

  test('clicking a language button updates the controller lang attribute', async ({ page }) => {
    await page.getByRole('button', { name: /Switch to French/i }).click();
    await expect(page.locator('#mc')).toHaveAttribute('lang', 'fr');
  });

  test('switching language updates play button aria-label', async ({ page }) => {
    await page.getByRole('button', { name: /Switch to French/i }).click();
    await expect(page.locator('media-play-button').first()).toHaveAttribute('aria-label', 'lire');
  });
});
