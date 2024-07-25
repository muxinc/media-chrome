import { document } from './server-safe-globals.js';

export const fullscreenApi = {
  enter:
    'requestFullscreen' in document
      ? 'requestFullscreen'
      : 'webkitRequestFullScreen' in document
      ? 'webkitRequestFullScreen'
      : undefined,
  exit:
    'exitFullscreen' in document
      ? 'exitFullscreen'
      : 'webkitExitFullscreen' in document
      ? 'webkitExitFullscreen'
      : 'webkitCancelFullScreen' in document
      ? 'webkitCancelFullScreen'
      : undefined,
  element:
    'fullscreenElement' in document
      ? 'fullscreenElement'
      : 'webkitFullscreenElement' in document
      ? 'webkitFullscreenElement'
      : undefined,
  error:
    'fullscreenerror' in document
      ? 'fullscreenerror'
      : 'webkitfullscreenerror' in document
      ? 'webkitfullscreenerror'
      : undefined,
  enabled:
    'fullscreenEnabled' in document
      ? 'fullscreenEnabled'
      : 'webkitFullscreenEnabled' in document
      ? 'webkitFullscreenEnabled'
      : undefined,
};
