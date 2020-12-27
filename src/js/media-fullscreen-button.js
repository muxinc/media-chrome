import MediaChromeButton from "./media-chrome-button.js";
import { defineCustomElement } from './utils/defineCustomElement.js';

import enterFullscreenIcon from '../svgs/fullscreen.svg';
import exitFullscreenIcon from '../svgs/fullscreen_exit.svg';

class MediaFullscreenButton extends MediaChromeButton {
  constructor() {
    super();

    this.icon = enterFullscreenIcon;

    this.addEventListener("click", e => {
      const media = this.media;

      if (this.mediaChrome == document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        if (document.pictureInPictureElement) {
          // Should be async
          document.exitPictureInPicture();
        }

        this.mediaChrome.requestFullscreen();
      }
    });

    document.addEventListener("fullscreenchange", () => {
      if (this.mediaChrome == document.fullscreenElement) {
        this.icon = exitFullscreenIcon;
      } else {
        this.icon = enterFullscreenIcon;
      }
    });
  }
}

defineCustomElement('media-fullscreen-button', MediaFullscreenButton);

export default MediaFullscreenButton;
