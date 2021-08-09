import { Window as window } from './utils/server-safe-globals.js';
import MediaChromeRange from './media-chrome-range.js';
import { defineCustomElement } from './utils/defineCustomElement.js';
import { MediaUIAttributes, MediaUIEvents } from './constants.js';
import { nouns } from './labels/labels.js';

const DEFAULT_MAX_VOLUME = 100;

const toVolume = (el) => {
  const muted = el.getAttribute(MediaUIAttributes.MEDIA_MUTED) != null;
  if (muted) return 0;

  const volume = +(el.getAttribute(MediaUIAttributes.MEDIA_VOLUME) ?? 1);
  return Math.round(volume * el.range.max);
};

class MediaVolumeRange extends MediaChromeRange {

  static get observedAttributes() {
    return [MediaUIAttributes.MEDIA_VOLUME, MediaUIAttributes.MEDIA_MUTED];
  }

  constructor() {
    super();

    this.range.max = DEFAULT_MAX_VOLUME;

    this.range.addEventListener('input', () => {
      const newVolume = this.range.value / this.range.max;
      const detail = newVolume;
      const evt = new window.CustomEvent(MediaUIEvents.MEDIA_VOLUME_REQUEST, { composed: true, bubbles: true, detail });
      this.dispatchEvent(evt);
    });
  }

  connectedCallback() {
    this.range.setAttribute('aria-label', nouns.VOLUME());
    this.setAttribute(MediaUIAttributes.MEDIA_CHROME_ATTRIBUTES, this.constructor.observedAttributes.join(' '));
  }

  attributeChangedCallback(_attrName, _oldValue, _newValue) {
    const newVolume = toVolume(this);
    this.range.value = newVolume;
    this.updateBar();
  }
}

defineCustomElement('media-volume-range', MediaVolumeRange);

export default MediaVolumeRange;
