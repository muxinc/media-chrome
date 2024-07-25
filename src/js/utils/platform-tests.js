import { globalThis, document } from './server-safe-globals.js';
import { delay } from './utils.js';
import { isFullscreenEnabled } from './fullscreen-api.js';

/**
 * Test element
 */
let testMediaEl;
export const getTestMediaEl = () => {
  if (testMediaEl) return testMediaEl;
  testMediaEl = document?.createElement?.('video');
  return testMediaEl;
};

/**
 * Test for volume support
 *
 * @param {HTMLMediaElement} mediaEl
 * @returns {Promise<boolean>}
 */
export const hasVolumeSupportAsync = async (mediaEl = getTestMediaEl()) => {
  if (!mediaEl) return false;
  const prevVolume = mediaEl.volume;
  mediaEl.volume = prevVolume / 2 + 0.1;
  await delay(0);
  return mediaEl.volume !== prevVolume;
};

// let volumeSupported;
// export const volumeSupportPromise = hasVolumeSupportAsync().then((supported) => {
//   volumeSupported = supported;
//   return volumeSupported;
// });

// NOTE: This also matches at least some non-Safari UAs on e.g. iOS, such as Chrome, perhaps since
// these browsers are built on top of the OS-level WebKit browser, so use accordingly (CJP).
// See, e.g.: https://www.whatismybrowser.com/guides/the-latest-user-agent/chrome
const isSafari = /.*Version\/.*Safari\/.*/.test(globalThis.navigator.userAgent);
/**
 * Test for PIP support
 *
 * @param {Partial<HTMLVideoElement>} mediaEl
 * @returns {boolean}
 */
export const hasPipSupport = (mediaEl = getTestMediaEl()) => {
  // NOTE: PWAs for Apple that rely on Safari don't support picture in picture but still have `requestPictureInPicture()`
  // (which will result in a failed promise). Checking for those conditions here (CJP).
  // This should still work for macOS PWAs installed using Chrome, where PiP is supported.
  if (globalThis.matchMedia('(display-mode: standalone)').matches && isSafari)
    return false;
  return typeof mediaEl?.requestPictureInPicture === 'function';
};

/**
 * Test for Fullscreen support
 *
 * @param {Partial<HTMLVideoElement>} mediaEl
 * @returns {boolean}
 */
export const hasFullscreenSupport = (mediaEl = getTestMediaEl()) => {
  return isFullscreenEnabled({ documentElement: document, media: mediaEl });
};

export const fullscreenSupported = hasFullscreenSupport();
export const pipSupported = hasPipSupport();
export const airplaySupported =
  !!globalThis.WebKitPlaybackTargetAvailabilityEvent;
export const castSupported = !!globalThis.chrome;
