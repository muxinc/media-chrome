import { readdirSync, statSync } from 'fs';
import { join, relative, dirname } from 'path';
import { fileURLToPath } from 'url';
import type { Page } from 'playwright/test';

const __dirname = dirname(fileURLToPath(import.meta.url));
export const EXAMPLES_DIR = join(__dirname, '../../../examples/vanilla');

export function findHtmlFiles(dir: string, base = dir): string[] {
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

export type SYNTH_STREAM_RES = 'skipped' | 'timeout' | 'playing'
/**
 * Replaces the first native <video> or <audio> element's source with a
 * synthetic stream (canvas or AudioContext) so tests run without network
 * requests and without a mediaErrorCode in the store.
 *
 * The store blocks all state-change requests when mediaErrorCode is non-null,
 * which happens when the external video URL fails to load in CI.
 */
export async function injectSyntheticStream(page: Page): Promise<SYNTH_STREAM_RES> {
  return await page.evaluate(async () => {
    const mediaEl = document.querySelector(
      'video, audio'
    ) as HTMLVideoElement | HTMLAudioElement | null;

    if (!mediaEl || mediaEl.tagName.includes('-')) return 'skipped';

    if (mediaEl.tagName === 'AUDIO') {
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const dst = ctx.createMediaStreamDestination();
      osc.frequency.value = 0; // silent
      osc.connect(dst);
      osc.start();
      mediaEl.srcObject = dst.stream;
    } else {
      const canvas = document.createElement('canvas');
      canvas.width = 2;
      canvas.height = 2;
      canvas.getContext('2d')!.fillRect(0, 0, 2, 2);
      (mediaEl as HTMLVideoElement).srcObject = canvas.captureStream();
    }

    return await new Promise<SYNTH_STREAM_RES>((resolve) => {
      if (mediaEl.readyState >= 1) { resolve('playing'); return; }
      mediaEl.addEventListener('loadedmetadata', () => resolve('playing'), { once: true });
      setTimeout(() => resolve('timeout'), 2000);
    });
  });
}

/**
 * Pages excluded from play testing:
 * - No media elements (index, memory-leak-tester, media-chrome-menu)
 * - Not a real page (iframe embeds another example)
 * - Intentionally shows error states (media-error-dialog)
 * - JWPlayer media element - CDN fails sometimes, external to this repo
 */
export const SKIP_PLAY_TEST = new Set([
  'index.html',
  'memory-leak-tester.html',
  'iframe.html',
  'control-elements/media-chrome-menu.html',
  'control-elements/media-error-dialog.html',
  'media-elements/jwplayer.html',
]);
