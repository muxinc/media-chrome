import { globalThis, document } from './server-safe-globals.js';
import { delay } from './utils.js';
import { fullscreenApi } from './fullscreen-api.js';

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

/**
 * Test for PIP support
 * 
 * @param {HTMLVideoElement} mediaEl
 * @returns {boolean}
 */
export const hasPipSupport = (mediaEl = getTestMediaEl()) =>
  typeof mediaEl?.requestPictureInPicture === 'function';

/**
 * Test for Fullscreen support
 * 
 * @param {HTMLVideoElement} mediaEl
 * @returns {boolean}
 */
export const hasFullscreenSupport = (mediaEl = getTestMediaEl()) => {
  let fullscreenEnabled = document[fullscreenApi.enabled];

  if (!fullscreenEnabled && mediaEl) {
    fullscreenEnabled = 'webkitSupportsFullscreen' in mediaEl;
  }

  return fullscreenEnabled;
};

export const fullscreenSupported = hasFullscreenSupport();
export const pipSupported = hasPipSupport();
export const airplaySupported = !!globalThis.WebKitPlaybackTargetAvailabilityEvent;
export const castSupported = !!globalThis.chrome;
