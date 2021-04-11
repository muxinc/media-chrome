import MediaChromeButton from './media-chrome-button.js';
import { defineCustomElement } from './utils/defineCustomElement.js';
import { MEDIA_PLAY_REQUEST, MEDIA_PAUSE_REQUEST } from './media-ui-events.js';
import { Window as window } from './utils/server-safe-globals.js';

const playIcon =
  '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path class="icon" d="M8 5v14l11-7z"/><path d="M0 0h24v24H0z" fill="none"/></svg>';
const pauseIcon =
  '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path class="icon" d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/><path d="M0 0h24v24H0z" fill="none"/></svg>';

class MediaPlayButton extends MediaChromeButton {
  constructor() {
    super();

    // TODO: Move to supporting icon slots to allow overriding default icons
    this.icon = playIcon;

    // False unless media-paused attr exists
    this._mediaPaused = false;
  }

  static get observedAttributes() {
    return ['media-paused', 'media-controller'].concat(super.observedAttributes || []);
  }

  get mediaPaused() {
    return this._mediaPaused;
  }

  set mediaPaused(paused) {
    this._mediaPaused = !!paused;

    if (paused) {
      this.icon = playIcon;
    } else {
      this.icon = pauseIcon;
    }
  }

  handleClick(e) {
    const paused = this.mediaPaused;
    const eventName = (paused) ? MEDIA_PLAY_REQUEST : MEDIA_PAUSE_REQUEST;

    // Allow for `oneventname` props on el like in native HTML
    const cancelled = (this[`on${eventName}`] && this[`on${eventName}`](e)) === false;

    if (!cancelled) {
      this.dispatchEvent(new window.CustomEvent(eventName, { bubbles: true }));
    }
  }
}

defineCustomElement('media-play-button', MediaPlayButton);

export default MediaPlayButton;
