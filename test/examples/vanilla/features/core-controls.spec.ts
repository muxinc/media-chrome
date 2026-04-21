/**
 * Core controls — basic-video.html, basic-audio.html, basic.html, components.html
 *
 * Validates that the fundamental control interactions work: play state
 * reflected on the button, mute toggle, multi-controller page wiring,
 * and that all individual components render with non-zero dimensions.
 */
import { test, expect } from 'playwright/test';
import { injectSyntheticStream } from '../helpers.js';

// ── basic-video.html ──────────────────────────────────────────────────────────

test.describe('basic-video.html', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/examples/vanilla/basic-video.html', { waitUntil: 'load' });
    await injectSyntheticStream(page);
  });

  test('play button aria-label reflects paused/playing state', async ({ page }) => {
    const playBtn = page.locator('media-play-button').first();

    // Initially paused — aria-label should indicate "play" action
    await expect(playBtn).toHaveAttribute('aria-label', 'play');

    // Start playback via JS so we don't depend on autoplay policy
    await page.evaluate(() =>
      (document.querySelector('video') as HTMLVideoElement).play()
    );

    // While playing the button should switch to "pause"
    await expect(playBtn).toHaveAttribute('aria-label', 'pause');
  });

  test('mute button toggles mediavolumelevel between high and off', async ({ page }) => {
    const muteBtn = page.locator('media-mute-button').first();

    await expect(muteBtn).not.toHaveAttribute('mediavolumelevel', 'off');
    await muteBtn.click();
    await expect(muteBtn).toHaveAttribute('mediavolumelevel', 'off');
    await muteBtn.click();
    await expect(muteBtn).not.toHaveAttribute('mediavolumelevel', 'off');
  });

  test('playback rate button dispatches mediaplaybackraterequest on click', async ({ page }) => {
    // Listen for the request event before clicking
    await page.evaluate(() => {
      (window as any).__rateRequested = null;
      document.addEventListener(
        'mediaplaybackraterequest',
        (e: Event) => { (window as any).__rateRequested = (e as CustomEvent).detail; },
        { once: true, capture: true }
      );
    });

    await page.locator('media-playback-rate-button').first().click();

    const requested = await page.evaluate(() => (window as any).__rateRequested);
    expect(requested, 'clicking rate button should dispatch rate request').not.toBeNull();
    expect(requested, 'requested rate should differ from default (1)').not.toBe(1);
  });
});

// ── basic-audio.html ──────────────────────────────────────────────────────────

test.describe('basic-audio.html', () => {
  test('media-controller has audio attribute', async ({ page }) => {
    await page.goto('/examples/vanilla/basic-audio.html', { waitUntil: 'load' });

    // The audio controller uses the `audio` layout mode
    const controller = page.locator('media-controller').first();
    await expect(controller).toHaveAttribute('audio', '');
  });

  test('play button dispatches mediaplayrequest for audio element', async ({ page }) => {
    await page.goto('/examples/vanilla/basic-audio.html', { waitUntil: 'load' });

    // Inject a silent oscillator so the store has no error code
    await page.evaluate(async () => {
      const audio = document.querySelector('audio') as HTMLAudioElement;
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const dst = ctx.createMediaStreamDestination();
      osc.frequency.value = 0;
      osc.connect(dst);
      osc.start();
      audio.srcObject = dst.stream;
      await new Promise<void>((res) => {
        audio.addEventListener('loadedmetadata', () => res(), { once: true });
        setTimeout(res, 1000);
      });
    });

    await page.evaluate(() => {
      (window as any).__fired = false;
      document.addEventListener('mediaplayrequest', () => { (window as any).__fired = true; }, { once: true, capture: true });
    });

    await page.locator('media-play-button').first().click();
    const mediaPlayFired = await page.evaluate(() => (window as any).__fired)
    expect(mediaPlayFired).toBe(true);
  });
});

// ── basic.html ────────────────────────────────────────────────────────────────

test.describe('basic.html', () => {
  test('page contains three media-controllers', async ({ page }) => {
    await page.goto('/examples/vanilla/basic.html', { waitUntil: 'load' });
    await expect(page.locator('media-controller')).toHaveCount(3);
  });

  test('first two controllers are in audio mode', async ({ page }) => {
    await page.goto('/examples/vanilla/basic.html', { waitUntil: 'load' });
    const controllers = page.locator('media-controller');
    await expect(controllers.nth(0)).toHaveAttribute('audio', '');
    await expect(controllers.nth(1)).toHaveAttribute('audio', '');
  });
});

// ── components.html ───────────────────────────────────────────────────────────

test.describe('components.html', () => {
  test('all individual control components are visible with non-zero width', async ({ page }) => {
    await page.goto('/examples/vanilla/components.html', { waitUntil: 'load' });

    const components = [
      // 'media-airplay-button' is intentionally excluded: it is hidden by CSS
      // (`display:none`) when AirPlay is unavailable, so boundingBox() returns null.
      // It is also hard to emulate AirPlay avaialbility reliably.
      'media-captions-button',
      'media-cast-button',
      'media-chrome-button',
      'media-chrome-range',
      'media-duration-display',
      'media-fullscreen-button',
      'media-mute-button',
      'media-pip-button',
      'media-play-button',
      'media-playback-rate-button',
      'media-seek-backward-button',
      'media-seek-forward-button',
      'media-time-display',
      'media-time-range',
      'media-volume-range',
    ];

    for (const tag of components) {
      const el = page.locator(tag).first();
      const box = await el.boundingBox();
      expect(box, `${tag} should be visible`).not.toBeNull();
      expect(box!.width, `${tag} should have non-zero width`).toBeGreaterThan(0);
    }
  });
});
