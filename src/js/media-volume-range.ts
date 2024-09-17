import { globalThis } from './utils/server-safe-globals.js';
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

const DEFAULT_VOLUME = 1;

const toVolume = (el: any): number => {
  if (el.mediaMuted) return 0;
  return el.mediaVolume;
};

const formatAsPercentString = (value: number): string => `${Math.round(value * 100)}%`;

/**
 * @attr {string} mediavolume - (read-only) Set to the media volume.
 * @attr {boolean} mediamuted - (read-only) Set to the media muted state.
 * @attr {string} mediavolumeunavailable - (read-only) Set if changing volume is unavailable.
 *
 * @cssproperty [--media-volume-range-display = inline-block] - `display` property of range.
 */
class MediaVolumeRange extends MediaChromeRange {
  static get observedAttributes(): string[] {
    return [
      ...super.observedAttributes,
      MediaUIAttributes.MEDIA_VOLUME,
      MediaUIAttributes.MEDIA_MUTED,
      MediaUIAttributes.MEDIA_VOLUME_UNAVAILABLE,
    ];
  }

  constructor() {
    super();

    this.range.addEventListener('input', () => {
      const detail = this.range.value;
      const evt = new globalThis.CustomEvent(
        MediaUIEvents.MEDIA_VOLUME_REQUEST,
        {
          composed: true,
          bubbles: true,
          detail,
        }
      );
      this.dispatchEvent(evt);
    });
  }

  connectedCallback(): void {
    super.connectedCallback();
    this.range.setAttribute('aria-label', nouns.VOLUME());
  }

  attributeChangedCallback(
    attrName: string,
    oldValue: string | null,
    newValue: string | null
  ): void {
    super.attributeChangedCallback(attrName, oldValue, newValue);

    if (
      attrName === MediaUIAttributes.MEDIA_VOLUME ||
      attrName === MediaUIAttributes.MEDIA_MUTED
    ) {
      this.range.valueAsNumber = toVolume(this);
      this.range.setAttribute(
        'aria-valuetext',
        formatAsPercentString(this.range.valueAsNumber)
      );
      this.updateBar();
    }
  }

  /**
   *
   */
  get mediaVolume(): number {
    return getNumericAttr(this, MediaUIAttributes.MEDIA_VOLUME, DEFAULT_VOLUME);
  }

  set mediaVolume(value: number) {
    setNumericAttr(this, MediaUIAttributes.MEDIA_VOLUME, value);
  }

  /**
   * Is the media currently muted
   */
  get mediaMuted(): boolean {
    return getBooleanAttr(this, MediaUIAttributes.MEDIA_MUTED);
  }

  set mediaMuted(value: boolean) {
    setBooleanAttr(this, MediaUIAttributes.MEDIA_MUTED, value);
  }

  /**
   * The volume unavailability state
   */
  get mediaVolumeUnavailable(): string | undefined {
    return getStringAttr(this, MediaUIAttributes.MEDIA_VOLUME_UNAVAILABLE);
  }

  set mediaVolumeUnavailable(value: string | undefined) {
    setStringAttr(this, MediaUIAttributes.MEDIA_VOLUME_UNAVAILABLE, value);
  }
}

if (!globalThis.customElements.get('media-volume-range')) {
  globalThis.customElements.define('media-volume-range', MediaVolumeRange);
}

export default MediaVolumeRange;
