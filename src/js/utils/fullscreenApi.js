import { Document as document } from './server-safe-globals.js';

export const fullscreenApi = {
  enter: "requestFullscreen",
  exit: "exitFullscreen",
  event: "fullscreenchange",
  element: "fullscreenElement",
  error: "fullscreenerror",
};

if (document.fullscreenElement === undefined) {
  fullscreenApi.enter = document.webkitExitFullscreen != null ? "webkitEnterFullScreen" : "webkitRequestFullScreen";
  fullscreenApi.exit = document.webkitExitFullscreen != null ? "webkitExitFullscreen" : "webkitCancelFullScreen";
  fullscreenApi.event = "webkitfullscreenchange";
  fullscreenApi.element = "webkitFullscreenElement";
  fullscreenApi.error = "webkitfullscreenerror";
}