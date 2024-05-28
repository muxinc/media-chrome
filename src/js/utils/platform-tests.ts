import { fullscreenApi } from "./fullscreen-api.js";
import { document, globalThis } from "./server-safe-globals.js";
import { delay } from "./utils.js";

/**
 * Test element
 */
let testMediaEl: HTMLVideoElement;
export const getTestMediaEl = (): HTMLVideoElement => {
  if (testMediaEl) return testMediaEl;
  testMediaEl = document?.createElement?.("video");
  return testMediaEl;
};

/**
 * Test for volume support
 *
 * @param mediaEl - The media element to test
 */
export const hasVolumeSupportAsync = async (
  mediaEl: HTMLVideoElement = getTestMediaEl()
): Promise<boolean> => {
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
const isSafari: boolean = /.*Version\/.*Safari\/.*/.test(
  globalThis.navigator.userAgent
);
/**
 * Test for PIP support
 *
 * @param mediaEl - The media element to test
 */
export const hasPipSupport = (
  mediaEl: HTMLVideoElement = getTestMediaEl()
): boolean => {
  // NOTE: PWAs for Apple that rely on Safari don't support picture in picture but still have `requestPictureInPicture()`
  // (which will result in a failed promise). Checking for those conditions here (CJP).
  // This should still work for macOS PWAs installed using Chrome, where PiP is supported.
  if (globalThis.matchMedia("(display-mode: standalone)").matches && isSafari)
    return false;
  return typeof mediaEl?.requestPictureInPicture === "function";
};

/**
 * Test for Fullscreen support
 *
 * @param mediaEl - The media element to test
 */
export const hasFullscreenSupport = (
  mediaEl: HTMLVideoElement = getTestMediaEl()
): boolean => {
  let fullscreenEnabled = document[fullscreenApi.enabled];

  if (!fullscreenEnabled && mediaEl) {
    fullscreenEnabled = "webkitSupportsFullscreen" in mediaEl;
  }

  return fullscreenEnabled;
};

export const fullscreenSupported: boolean = hasFullscreenSupport();
export const pipSupported: boolean = hasPipSupport();
export const airplaySupported: boolean =
  !!globalThis.WebKitPlaybackTargetAvailabilityEvent;
export const castSupported: boolean = !!globalThis.chrome;
