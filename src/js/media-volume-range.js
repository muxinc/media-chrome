import MediaChromeRange from './media-chrome-range.js';
import { defineCustomElement } from './utils/defineCustomElement.js';
import { MediaUIAttributes, MediaUIEvents } from './constants.js';

const toVolume = (el) => {
  const muted = el.getAttribute(MediaUIAttributes.MEDIA_MUTED) != null;
  if (muted) return 0;

  const volume = +(el.getAttribute(MediaUIAttributes.MEDIA_VOLUME) ?? 0.085);
  return Math.round(volume * 1000);
};

class MediaVolumeRange extends MediaChromeRange {

  static get observedAttributes() {
    return [MediaUIAttributes.MEDIA_VOLUME, MediaUIAttributes.MEDIA_MUTED];
  }

  constructor() {
    super();

    this.range.addEventListener('input', () => {
      const newVolume = this.range.value / 1000;
      const evt = new Event(MediaUIEvents.MEDIA_VOLUME_REQUEST, { composed: true, bubbles: true });
      evt.detail = newVolume;
      this.dispatchEvent(evt);
    });
  }

  connectedCallback() {
    /** Option 1 */
    const evt = new Event(MediaUIEvents.MEDIA_CHROME_ELEMENT_CONNECTED, { composed: true, bubbles: true });
    evt.details = this.constructor.observedAttributes;
    this.dispatchEvent(evt);
    /** Option 2 */
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
