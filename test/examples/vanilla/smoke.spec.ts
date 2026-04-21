/**
 * Smoke tests — scope: all example pages
 *
 * Checks that every page:
 *   1. Loads without uncaught JS errors
 *   2. Has all media-* custom elements properly registered
 *
 * This is the fastest / widest safety net. A failure here means a broken
 * import or missing component registration — the most common regression type.
 */
import { test, expect } from 'playwright/test';
import { findHtmlFiles, EXAMPLES_DIR } from './helpers.js';

test.describe.configure({ mode: 'parallel' });

const SKIPPED_FILES: Set<string> = new Set();
const EXPECTS_ERROR: Set<string> = new Set([
  // JW Player will log CORS errors until we have a dedicated asset.
  'media-elements/jwplayer.html', 
]);

const htmlFiles = findHtmlFiles(EXAMPLES_DIR);

for (const relPath of htmlFiles) {
  test(`vanilla/${relPath} - custom elements registered`, async ({ page }) => {
    test.skip(SKIPPED_FILES.has(relPath));
    const pageErrors: string[] = [];
    page.on('pageerror', (error) => pageErrors.push(error.message));

    await page.goto(`/examples/vanilla/${relPath}`, { waitUntil: 'load' });

    // Under parallel server load, module scripts can finish fetching slightly after
    // `waitUntil: 'load'`. Wait up to 5s for every media-* element to be defined
    // before asserting, so the check is not racy.
    const undefinedElements = await page.evaluate(async () => {
      const tagNames = new Set(
        [...document.querySelectorAll('*')]
          .map((el) => el.tagName.toLowerCase())
          .filter((tag) => tag.startsWith('media-'))
      );
      await Promise.race([
        Promise.all([...tagNames].map((tag) => customElements.whenDefined(tag))),
        new Promise<void>((resolve) => setTimeout(resolve, 5000)),
      ]);
      return [...tagNames].filter((tag) => !customElements.get(tag));
    });

    expect(
      undefinedElements,
      `Unregistered custom elements: ${undefinedElements.join(', ')}`
    ).toHaveLength(0);

    if (EXPECTS_ERROR.has(relPath)){
      return; // Exit test to avoid failure
    }
    expect(pageErrors, `Page errors: ${pageErrors.join('; ')}`).toHaveLength(0);
  });
}
