import { window } from './utils/server-safe-globals.js';
import { MediaChromeRange } from './media-chrome-range.js';
import { MediaUIAttributes, MediaUIEvents } from './constants.js';
import { nouns } from './labels/labels.js';
import {
  getBooleanAttr,
  getNumericAttr,
  getStringAttr,
  setBooleanAttr,
  setNumericAttr,
  setStringAttr,
} from './utils/element-utils.js';

const DEFAULT_MAX_VOLUME = 100;
const DEFAULT_VOLUME = 1;

const toVolume = (el) => {
  if (el.mediaMuted) return 0;
  return Math.round(el.mediaVolume * el.range.max);
};

const formatAsPercentString = ({ value, max }) =>
  `${Math.round((value / max) * 100)}%`;

/**
 * @attr {string} mediavolume - (read-only) Set to the media volume.
 * @attr {boolean} mediamuted - (read-only) Set to the media muted state.
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

  /**
   * @type {number}
   */
  get mediaVolume() {
    return (
      getNumericAttr(this, MediaUIAttributes.MEDIA_VOLUME) ?? DEFAULT_VOLUME
    );
  }

  set mediaVolume(value) {
    setNumericAttr(this, MediaUIAttributes.MEDIA_VOLUME, value);
  }

  /**
   * @type {boolean} Is the media currently muted
   */
  get mediaMuted() {
    return getBooleanAttr(this, MediaUIAttributes.MEDIA_MUTED);
  }

  set mediaMuted(value) {
    setBooleanAttr(this, MediaUIAttributes.MEDIA_MUTED, value);
  }

  /**
   * @type {string | undefined} The volume unavailability state
   */
  get mediaVolumeUnavailable() {
    return getStringAttr(this, MediaUIAttributes.MEDIA_VOLUME_UNAVAILABLE);
  }

  set mediaVolumeUnavailable(value) {
    setStringAttr(this, MediaUIAttributes.MEDIA_VOLUME_UNAVAILABLE, value);
  }
}

if (!window.customElements.get('media-volume-range')) {
  window.customElements.define('media-volume-range', MediaVolumeRange);
}

export default MediaVolumeRange;
