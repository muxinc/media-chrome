/**
 * Layout & Responsive — responsive-attribute.html, portrait.html, slots-demo.html, wrapper.html
 *
 * Verifies layout-specific features:
 *   - responsive-attribute: controller sets breakpoint attributes based on its width
 *   - portrait: the player renders in a portrait (9:16) aspect ratio
 *   - slots-demo: toggling a checkbox shows/hides the corresponding slot content
 *   - wrapper: controls placed outside the controller via `mediacontroller` attribute
 *     are properly wired up
 */
import { test, expect } from 'playwright/test';

// ── responsive-attribute.html ─────────────────────────────────────────────────

test.describe('responsive-attribute.html', () => {
  test('below sm breakpoint: no breakpoint attrs set on controller', async ({ page }) => {
    await page.setViewportSize({ width: 300, height: 600 });
    await page.goto('/examples/vanilla/responsive-attribute.html', { waitUntil: 'load' });

    const controller = page.locator('media-controller');
    // At 300px the controller is narrower than the 384px sm threshold
    await expect(controller).not.toHaveAttribute('breakpointsm');
    await expect(controller).not.toHaveAttribute('breakpointmd');
  });

  test('above md breakpoint: breakpointsm and breakpointmd are both set', async ({ page }) => {
    await page.setViewportSize({ width: 800, height: 600 });
    await page.goto('/examples/vanilla/responsive-attribute.html', { waitUntil: 'load' });

    const controller = page.locator('media-controller');
    await expect(controller).toHaveAttribute('breakpointsm', '');
    await expect(controller).toHaveAttribute('breakpointmd', '');
  });

  test('between sm and md: only breakpointsm is set', async ({ page }) => {
    await page.setViewportSize({ width: 480, height: 600 });
    await page.goto('/examples/vanilla/responsive-attribute.html', { waitUntil: 'load' });

    const controller = page.locator('media-controller');
    await expect(controller).toHaveAttribute('breakpointsm', '');
    await expect(controller).not.toHaveAttribute('breakpointmd');
  });
});

// ── portrait.html ─────────────────────────────────────────────────────────────

test.describe('portrait.html', () => {
  test('media-controller renders taller than wide (portrait orientation)', async ({ page }) => {
    await page.goto('/examples/vanilla/portrait.html', { waitUntil: 'load' });

    const box = await page.locator('media-controller').boundingBox();
    expect(box, 'media-controller should be in the DOM').not.toBeNull();
    expect(box!.height, 'portrait player should be taller than wide').toBeGreaterThan(box!.width);
  });
});

// ── slots-demo.html ───────────────────────────────────────────────────────────

test.describe('slots-demo.html', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/examples/vanilla/slots-demo.html', { waitUntil: 'load' });
  });

  test('top-chrome elements are visible by default', async ({ page }) => {
    const topChrome = page.locator("media-controller > [slot='top-chrome']").first();
    await expect(topChrome).toBeVisible();
  });

  test('unchecking the top-chrome checkbox hides its slot content', async ({ page }) => {
    await page.locator('#topChromeCheckbox').uncheck();
    const topChrome = page.locator("media-controller > [slot='top-chrome']").first();
    await expect(topChrome).toHaveClass(/hidden/);
  });

  test('unchecking centered-chrome hides its slot content', async ({ page }) => {
    await page.locator('#centeredChromeCheckbox').uncheck();
    const centeredChrome = page.locator("media-controller > [slot='centered-chrome']");
    await expect(centeredChrome).toHaveClass(/hidden/);
  });
});

// ── wrapper.html ──────────────────────────────────────────────────────────────

test.describe('wrapper.html', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/examples/vanilla/wrapper.html', { waitUntil: 'load' });
  });

  test('media-controller targets the wrapper element for fullscreen', async ({ page }) => {
    await expect(page.locator('media-controller')).toHaveAttribute('fullscreenelement', 'wrapper');
  });

  test('external controls reference the controller via mediacontroller attribute', async ({ page }) => {
    await expect(page.locator('media-control-bar')).toHaveAttribute('mediacontroller', 'controller');
  });

  test('external play button dispatches mediaplayrequest to the controller', async ({ page }) => {
    await page.evaluate(() => {
      (window as any).__fired = false;
      document.addEventListener('mediaplayrequest', () => { (window as any).__fired = true; }, { once: true, capture: true });
    });

    // The play button lives outside the media-controller, wired via mediacontroller="controller"
    await page.locator('media-control-bar media-play-button').click();

    expect(await page.evaluate(() => (window as any).__fired)).toBe(true);
  });
});
