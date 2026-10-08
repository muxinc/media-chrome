import { test, expect } from 'playwright/test';

test('examples index page loads', async ({ page }) => {
  await page.goto('/examples/vanilla/');
  await expect(page).toHaveTitle('Media Chrome Examples');
});
