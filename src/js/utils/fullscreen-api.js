import { document } from './server-safe-globals.js';

export const fullscreenApi = {
  enter: 'requestFullscreen',
  exit: 'exitFullscreen',
  rootEvents: ['fullscreenchange'],
  mediaEvents: [],
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
  fullscreenApi.rootEvents = ['webkitfullscreenchange'];
  fullscreenApi.mediaEvents = ['webkitbeginfullscreen', 'webkitendfullscreen'],
  fullscreenApi.element = 'webkitFullscreenElement';
  fullscreenApi.error = 'webkitfullscreenerror';
  fullscreenApi.enabled = 'webkitFullscreenEnabled';
}
