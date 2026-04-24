/**
 * Smoke tests — scope: React example pages
 *
 * Checks that every page:
 *   1. Loads without uncaught JS errors
 *   2. Renders non-empty content
 *   3. (react-wrappers only) media-* custom elements are registered
 */
import { test, expect } from 'playwright/test';
import { VITE_PORT, NEXT_PORT } from '../../ports.js';

test.describe.configure({ mode: 'parallel' });

// MUI + Emotion always produces a hydration mismatch in Next.js dev mode due to
// server-rendered <style> tags differing from the client. Known limitation of the example.
const KNOWN_ERRORS: Map<string, { patterns: string[] }> = new Map(
  [['nextjs/material-ui-player-chrome',
    {
      patterns: ["Hydration failed because the server rendered HTML didn't match the client."]
    }]]
);

type Route = { url: string; label: string; checkMediaElements?: true };

const ROUTES: Route[] = [
  {
    url: `http://localhost:${VITE_PORT}/`,
    label: 'vite-react',
  },
  {
    url: `http://localhost:${NEXT_PORT}/`,
    label: 'nextjs/index',
  },
  {
    url: `http://localhost:${NEXT_PORT}/react-wrappers`,
    label: 'nextjs/react-wrappers',
    checkMediaElements: true,
  },
  {
    url: `http://localhost:${NEXT_PORT}/media-store-hooks`,
    label: 'nextjs/media-store-hooks',
  },
  {
    url: `http://localhost:${NEXT_PORT}/material-ui-player-chrome`,
    label: 'nextjs/material-ui-player-chrome',
  },
];

for (const route of ROUTES) {
  test(`${route.label} - renders without errors`, async ({ page }) => {
    const pageErrors: string[] = [];
    page.on('pageerror', (error) => pageErrors.push(error.message));

    await page.goto(route.url, { waitUntil: 'load' });

    const hasContent = await page.evaluate(
      () => document.body.innerHTML.trim().length > 0
    );
    expect(hasContent, 'Page body should have content').toBe(true);

    if (route.checkMediaElements) {
      const undefinedElements = await page.evaluate(() => {
        const tagNames = new Set(
          [...document.querySelectorAll('*')]
            .map((el) => el.tagName.toLowerCase())
            .filter((tag) => tag.startsWith('media-'))
        );
        return [...tagNames].filter((tag) => !customElements.get(tag));
      });
      expect(
        undefinedElements,
        `Unregistered custom elements: ${undefinedElements.join(', ')}`
      ).toHaveLength(0);
    }

    if (KNOWN_ERRORS.has(route.label)) {
      const known = KNOWN_ERRORS.get(route.label)!.patterns;
      pageErrors.forEach(error => {
        expect(
          known.some(k => error.includes(k)),
          `Unexpected error (not in KNOWN_ERRORS): ${error}`
        ).toBe(true);
      });
    } else {
      expect(pageErrors, `Page errors: ${pageErrors.join('; ')}`).toHaveLength(0);
    }
  });
}
