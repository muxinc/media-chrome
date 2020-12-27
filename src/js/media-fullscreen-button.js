/*
  <media-fullscreen-button media="#myVideo" fullscreen-element="#myContainer">

  The fullscreen-element attribute can be used to say which element
  to make fullscreen.
  If none, the button will look for the closest media-chrome element to the media.
  If none, the button will make the media fullscreen.
*/
import MediaChromeButton from "./media-chrome-button.js";
import { defineCustomElement } from './utils/defineCustomElement.js';

import enterFullscreenIcon from '../svgs/fullscreen.svg';
import exitFullscreenIcon from '../svgs/fullscreen_exit.svg';

const api = {
  enter: "requestFullscreen",
  exit: "exitFullscreen",
  event: "fullscreenchange",
  element: "fullscreenElement",
  error: "fullscreenerror",
};

if (document.fullscreenElement === undefined) {
  api.enter = "webkitRequestFullScreen";
  api.exit = document.webkitExitFullscreen != null ? "webkitExitFullscreen" : "webkitCancelFullScreen";
  api.event = "webkitfullscreenchange";
  api.element = "webkitFullscreenElement";
  api.error = "webkitfullscreenerror";
}

class MediaFullscreenButton extends MediaChromeButton {
  constructor() {
    super();
    this.icon = enterFullscreenIcon;

    document.addEventListener(api.event, () => {
      if (this.isFullscreen) {
        this.icon = exitFullscreenIcon;
      } else {
        this.icon = enterFullscreenIcon;
      }
    });
  }

  static get observedAttributes() {
    return ['fullscreen-element'].concat(super.observedAttributes || []);
  }

  get isFullscreen() {
    const el = this.fullscreenElement;

    if (!el) return false;

    return el.getRootNode()[api.element] == el;
  }

  get fullscreenElement() {
    return this._fullscreenElement
      || (this.media && this.media.closest('media-chrome'))
      || this.media;
  }

  set fullscreenElement(val) {
    this._fullscreenElement = document.querySelector(val);
  }

  onClick() {
    if (this.isFullscreen) {
      document[api.exit]();
    } else {
      if (document.pictureInPictureElement) {
        // Should be async
        document.exitPictureInPicture();
      }

      this.fullscreenElement && this.fullscreenElement[api.enter]();
    }
  }
}

defineCustomElement('media-fullscreen-button', MediaFullscreenButton);

export default MediaFullscreenButton;
