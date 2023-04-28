import { window } from './utils/server-safe-globals.js';
import MediaChromeRange from './media-chrome-range.js';
import { MediaUIAttributes, MediaUIEvents } from './constants.js';
import { nouns } from './labels/labels.js';

const DEFAULT_MAX_VOLUME = 100;

const toVolume = (el) => {
  const muted = el.getAttribute(MediaUIAttributes.MEDIA_MUTED) != null;
  if (muted) return 0;

  const volume = +(el.getAttribute(MediaUIAttributes.MEDIA_VOLUME) ?? 1);
  return Math.round(volume * el.range.max);
};

const formatAsPercentString = ({ value, max }) =>
  `${Math.round((value / max) * 100)}%`;

/**
 * @attr {string} mediavolume - (read-only) Set to the media volume.
 * @attr {string} mediamuted - (read-only) Set to the media muted state.
 * @attr {string} mediavolumeunavailable - (read-only) Set if changing volume is unavailable.
 *
 * @cssproperty [--media-volume-range-display = inline-block] - `display` property of range.
 */
class MediaVolumeRange extends MediaChromeRange {
  static get observedAttributes() {
    return [
      ...super.observedAttributes,
      MediaUIAttributes.MEDIA_VOLUME,
      MediaUIAttributes.MEDIA_MUTED,
      MediaUIAttributes.MEDIA_VOLUME_UNAVAILABLE,
    ];
  }

  constructor() {
    super();

    this.range.max = DEFAULT_MAX_VOLUME;

    this.range.addEventListener('input', () => {
      const newVolume = this.range.value / this.range.max;
      const detail = newVolume;
      const evt = new window.CustomEvent(MediaUIEvents.MEDIA_VOLUME_REQUEST, {
        composed: true,
        bubbles: true,
        detail,
      });
      this.dispatchEvent(evt);
    });
  }

  connectedCallback() {
    this.range.setAttribute('aria-label', nouns.VOLUME());
    super.connectedCallback();
  }

  attributeChangedCallback(attrName, oldValue, newValue) {
    if (
      attrName === MediaUIAttributes.MEDIA_VOLUME ||
      attrName === MediaUIAttributes.MEDIA_MUTED
    ) {
      const newVolume = toVolume(this);
      this.range.value = newVolume;
      this.range.setAttribute(
        'aria-valuetext',
        formatAsPercentString(this.range)
      );
      this.updateBar();
    }
    super.attributeChangedCallback(attrName, oldValue, newValue);
  }
}

if (!window.customElements.get('media-volume-range')) {
  window.customElements.define('media-volume-range', MediaVolumeRange);
}

export default MediaVolumeRange;
