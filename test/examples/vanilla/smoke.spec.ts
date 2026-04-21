import { test, expect } from 'playwright/test';
import { readdirSync, statSync } from 'fs';
import { join, relative, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const EXAMPLES_DIR = join(__dirname, '../../../examples/vanilla');

function findHtmlFiles(dir: string, base = dir): string[] {
  const files: string[] = [];
  for (const entry of readdirSync(dir)) {
    const fullPath = join(dir, entry);
    if (statSync(fullPath).isDirectory()) {
      files.push(...findHtmlFiles(fullPath, base));
    } else if (entry.endsWith('.html')) {
      files.push(relative(base, fullPath));
    }
  }
  return files.sort();
}

const htmlFiles = findHtmlFiles(EXAMPLES_DIR);

for (const relPath of htmlFiles) {
  test(`vanilla/${relPath} - custom elements registered`, async ({ page }) => {
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

    expect(pageErrors, `Page errors: ${pageErrors.join('; ')}`).toHaveLength(0);
  });
}
