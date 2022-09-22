import { Document as document } from './server-safe-globals.js';

export const fullscreenApi = {
  enter: 'requestFullscreen',
  exit: 'exitFullscreen',
  event: 'fullscreenchange',
  element: 'fullscreenElement',
  error: 'fullscreenerror',
  enabled: 'fullscreenEnabled',
};

if (document.fullscreenElement === undefined) {
  fullscreenApi.enter = 'webkitRequestFullScreen';
  fullscreenApi.exit =
    document.webkitExitFullscreen != null
      ? 'webkitExitFullscreen'
      : 'webkitCancelFullScreen';
  fullscreenApi.event = 'webkitfullscreenchange';
  fullscreenApi.element = 'webkitFullscreenElement';
  fullscreenApi.error = 'webkitfullscreenerror';
  fullscreenApi.enabled = 'webkitFullscreenEnabled';
}
