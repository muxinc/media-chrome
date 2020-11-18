import MediaChromeButton from "./media-chrome-button.js";
import { defineCustomElement } from './utils/defineCustomElement.js';

const enterFullscreenIcon = `
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
  <path d="M0 0h24v24H0z" fill="none"/>
  <path class="icon" d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/>
</svg>
`;

const exitFullscreenIcon = `
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
  <path d="M0 0h24v24H0z" fill="none"/>
  <path class="icon" d="M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z"/>
</svg>
`;

class MediaFullscreenButton extends MediaChromeButton {
  constructor() {
    super();

    this.icon = enterFullscreenIcon;
  }

  onClick() {
    const api = this.getFullscreenApi(this.mediaChrome);

    if (this.mediaChrome == document[api.element]) {
      api.exit();
    } else {
      if (document.pictureInPictureElement) {
        // Should be async
        document.exitPictureInPicture();
      }

      api.enter();
    }
  }

  mediaSetCallback() {
    const api = this.getFullscreenApi(this.mediaChrome);
    
    document.addEventListener(api.event, () => {
      if (this.mediaChrome == document[api.element]) {
        this.icon = exitFullscreenIcon;
      } else {
        this.icon = enterFullscreenIcon;
      }
    });
  }

  getFullscreenApi(container) {
    const api = {};
    
    if (container.webkitRequestFullScreen != null) {
      api.enter = container.webkitRequestFullScreen.bind(container);
      api.exit = document.webkitExitFullscreen != null ? document.webkitExitFullscreen.bind(document) : document.webkitCancelFullScreen.bind(document);
      api.event = "webkitfullscreenchange";
      api.element = "webkitFullscreenElement";
      api.error = "webkitfullscreenerror";
    }
    else if (container.requestFullscreen != null) {
      api.enter = container.requestFullscreen.bind(container);
      api.exit = document.exitFullscreen != null ? document.exitFullscreen.bind(document) : document.cancelFullscreen.bind(document);
      api.event = "fullscreenchange";
      api.element = "fullscreenElement";
      api.error = "fullscreenerror";
    }
    else if (container.mozRequestFullScreen != null) {
      api.enter = container.mozRequestFullScreen.bind(container);
      api.exit = document.mozCancelFullScreen.bind(document);
      api.event = "mozfullscreenchange";
      api.element = "mozFullscreenElement";
      api.error = "mozfullscreenerror";
    }
    else if (container.msRequestFullscreen != null) {
      api.enter = container.msRequestFullscreen.bind(container);
      api.exit = document.msExitFullscreen.bind(document);
      api.event = "msfullscreenchange";
      api.element = "msFullscreenElement";
      api.error = "MSFullscreenError";
    }

    return api;
  }
}

defineCustomElement('media-fullscreen-button', MediaFullscreenButton);

export default MediaFullscreenButton;
