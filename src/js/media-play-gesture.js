import MediaChromeGesture from './media-chrome-gesture.js';
import {
  Window as window,
} from './utils/server-safe-globals.js';
import { defineCustomElement } from './utils/defineCustomElement.js';
import { MediaUIEvents, MediaUIAttributes } from './constants.js';

class MediaPlayGesture extends MediaChromeGesture {
  static get observedAttributes() {
    return [...super.observedAttributes, MediaUIAttributes.MEDIA_PAUSED];
  }

  constructor(options = {}) {
    super({ ...options });
  }

  attributeChangedCallback(attrName, oldValue, newValue) {
    super.attributeChangedCallback(attrName, oldValue, newValue);
  }

  handleClick(_e) {
    const eventName =
      this.getAttribute(MediaUIAttributes.MEDIA_PAUSED) != null
        ? MediaUIEvents.MEDIA_PLAY_REQUEST
        : MediaUIEvents.MEDIA_PAUSE_REQUEST;
    this.dispatchEvent(
      new window.CustomEvent(eventName, { composed: true, bubbles: true })
    );
  }
}

defineCustomElement('media-play-gesture', MediaPlayGesture);

export default MediaPlayGesture;
