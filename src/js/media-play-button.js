import MediaChromeButton from './media-chrome-button.js';
import { defineCustomElement } from './utils/defineCustomElement.js';

const playIcon =
  '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path class="icon" d="M8 5v14l11-7z"/><path d="M0 0h24v24H0z" fill="none"/></svg>';
const pauseIcon =
  '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path class="icon" d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/><path d="M0 0h24v24H0z" fill="none"/></svg>';

class MediaPlayButton extends MediaChromeButton {
  constructor() {
    super();
    this.icon = playIcon;
    this._playing = false;
  }

  static get observedAttributes() {
    return ['playing'].concat(super.observedAttributes || []);
  }

  get playing() {
    return this._playing;
  }

  set playing(val) {
    this._playing = !!val;

    if (val) {
      this.icon = pauseIcon;
    } else {
      this.icon = playIcon;
    }
  }

  onClick(e) {
    const media = this.media;

    // If not using media detection, onClick should be overridden
    if (!media) {
      throw new Error(
        'No media was found and an alternative onClick handler was not set.'
      );
    }

    if (media.paused) {
      media.play();
    } else {
      media.pause();
    }
  }

  mediaSetCallback(media) {
    media.addEventListener('play', () => {
      this.playing = true;
    });

    media.addEventListener('pause', () => {
      this.playing = false;
    });
  }
}

defineCustomElement('media-play-button', MediaPlayButton);

export default MediaPlayButton;
