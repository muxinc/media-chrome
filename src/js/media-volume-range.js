import { Window as window } from './utils/server-safe-globals.js';
import MediaChromeRange from './media-chrome-range.js';
import { defineCustomElement } from './utils/defineCustomElement.js';
import { MediaUIAttributes, MediaUIEvents } from './constants.js';

const toVolume = (el) => {
  const muted = el.getAttribute(MediaUIAttributes.MEDIA_MUTED) != null;
  if (muted) return 0;

  const volume = +(el.getAttribute(MediaUIAttributes.MEDIA_VOLUME) ?? 1);
  return Math.round(volume * 1000);
};

class MediaVolumeRange extends MediaChromeRange {

  static get observedAttributes() {
    return [...super.observedAttributes, MediaUIAttributes.MEDIA_VOLUME, MediaUIAttributes.MEDIA_MUTED];
  }

  constructor() {
    super();

    this.range.addEventListener('input', () => {
      const newVolume = this.range.value / 1000;
      const detail = newVolume;
      const evt = new window.CustomEvent(MediaUIEvents.MEDIA_VOLUME_REQUEST, { composed: true, bubbles: true, detail });
      this.dispatchEvent(evt);
    });
  }

  connectedCallback() {
    this.setAttribute(MediaUIAttributes.MEDIA_CHROME_ATTRIBUTES, this.constructor.observedAttributes.join(' '));
    super.connectedCallback();
  }

  attributeChangedCallback(attrName, oldValue, newValue) {
    if (attrName === MediaUIAttributes.MEDIA_VOLUME || attrName === MediaUIAttributes.MEDIA_MUTED) {
      const newVolume = toVolume(this);
      this.range.value = newVolume;
      this.updateBar();
    }
    super.attributeChangedCallback(attrName, oldValue, newValue);
  }
}

defineCustomElement('media-volume-range', MediaVolumeRange);

export default MediaVolumeRange;
