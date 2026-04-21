/**
 * Themes — all six theme examples
 *
 * Verifies that for each theme:
 *   1. The theme custom element is registered
 *   2. The media slot is filled with a media element
 *   3. For themes backed by a native <video>, clicking the play button
 *      dispatches a mediaplayrequest (controls are wired up)
 *
 * Note: theme elements are loaded from CDN (@player.style/*). These tests
 * require network access and will be skipped automatically if the CDN script
 * fails to register the element.
 */
import { test, expect } from 'playwright/test';
import { injectSyntheticStream } from '../helpers.js';

const THEMES: Array<{
  file: string;
  element: string;
  hasNativeVideo: boolean;
}> = [
  { file: 'themes/youtube-theme.html',        element: 'media-theme-yt',            hasNativeVideo: true  },
  // minimal and microvideo themes use media-live-button (live-stream UI) instead
  // of media-play-button, so the play-request test is not applicable to them.
  { file: 'themes/minimal-theme.html',         element: 'media-theme-minimal',       hasNativeVideo: false },
  { file: 'themes/winamp-theme.html',          element: 'media-theme-winamp',        hasNativeVideo: true  },
  { file: 'themes/microvideo-theme.html',      element: 'media-theme-microvideo',    hasNativeVideo: false },
  { file: 'themes/tailwind-audio-theme.html',  element: 'media-theme-tailwind-audio', hasNativeVideo: true },
  { file: 'themes/demuxed-2022-theme.html',    element: 'media-theme-demuxed-2022',  hasNativeVideo: false },
];

let nonDefinedThemes = 0;
for (const { file, element, hasNativeVideo } of THEMES) {
  test.describe(`${file}`, () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`/examples/vanilla/${file}`, { waitUntil: 'load' });
    });

    test(`${element} is registered as a custom element`, async ({ page }) => {
      const defined = await page.evaluate(
        (tag) => !!customElements.get(tag),
        element
      );

      if (!defined) {
        nonDefinedThemes++;
        
        if (nonDefinedThemes === THEMES.length) {
          test.fail(true, "Themes are not defined");
        } else {
          // CDN unavailable — skip rather than fail
          test.skip();
        }
        return;
      }

      expect(defined).toBe(true);
    });

    test('media slot is filled', async ({ page }) => {
      const slotted = await page.evaluate(
        (tag) => !!document.querySelector(`${tag} [slot="media"]`),
        element
      );
      expect(slotted, `${element} should have a [slot=media] child`).toBe(true);
    });

    if (hasNativeVideo) {
      test('play button dispatches mediaplayrequest', async ({ page }) => {
        const defined = await page.evaluate(
          (tag) => !!customElements.get(tag),
          element
        );
        if (!defined) { test.skip(); return; }

        // Replace the external video src with a synthetic stream so the
        // media-error-dialog (triggered by a failed network load) doesn't
        // block the play button click.
        await injectSyntheticStream(page);

        await page.evaluate(() => {
          (window as any).__fired = false;
          document.addEventListener('mediaplayrequest', () => {
            (window as any).__fired = true;
          }, { once: true, capture: true });
        });

        // Use a deep shadow-DOM traversal to find and click the play button.
        // Playwright's standard locator can fail when the button is nested in
        // multiple shadow roots (theme → media-controller → media-play-button).
        const clicked = await page.evaluate((themeTag) => {
          function deepFind(root: Element | ShadowRoot, sel: string): Element | null {
            const found = root.querySelector(sel);
            if (found) return found;
            for (const el of Array.from(root.querySelectorAll('*'))) {
              const sr = (el as HTMLElement).shadowRoot;
              if (sr) {
                const res = deepFind(sr, sel);
                if (res) return res;
              }
            }
            return null;
          }
          const theme = document.querySelector(themeTag);
          // Start from the theme's shadow root so deepFind can traverse into it.
          const searchRoot = theme?.shadowRoot ?? theme;
          const btn = searchRoot ? deepFind(searchRoot as unknown as Element, 'media-play-button') : null;
          if (btn) { (btn as HTMLElement).click(); return true; }
          return false;
        }, element);
        expect(clicked, `media-play-button should be present in ${element}`).toBe(true);

        expect(
          await page.evaluate(() => (window as any).__fired),
          'mediaplayrequest should be dispatched when play button is clicked'
        ).toBe(true);
      });
    }
  });
}
