import { MediaChromeButton } from './media-chrome-button.js';
import { window, document } from './utils/server-safe-globals.js';
import { MediaUIEvents, MediaUIAttributes } from './constants.js';
import { nouns } from './labels/labels.js';
import { getNumericAttr, setNumericAttr } from './utils/element-utils.js';
import { AttributeTokenList } from './utils/attribute-token-list.js';

export const Attributes = {
  RATES: 'rates',
};

export const DEFAULT_RATES = [1, 1.25, 1.5, 1.75, 2];
export const DEFAULT_RATE = 1;

const slotTemplate = document.createElement('template');
slotTemplate.innerHTML = `
  <span id="container"></span>
`;

/**
 * @attr {string} rates - Set custom playback rates for the user to choose from.
 * @attr {string} mediaplaybackrate - (read-only) Set to the media playback rate.
 *
 * @cssproperty [--media-playback-rate-button-display = inline-flex] - `display` property of button.
 */
class MediaPlaybackRateButton extends MediaChromeButton {
  static get observedAttributes() {
    return [
      ...super.observedAttributes,
      MediaUIAttributes.MEDIA_PLAYBACK_RATE,
      Attributes.RATES,
    ];
  }

  #rates = new AttributeTokenList(this, Attributes.RATES, { defaultValue: DEFAULT_RATES });

  constructor(options = {}) {
    super({ slotTemplate, ...options });
    this.container = this.shadowRoot.querySelector('#container');
    this.container.innerHTML = `${DEFAULT_RATE}x`;
  }

  attributeChangedCallback(attrName, oldValue, newValue) {
    if (attrName === Attributes.RATES) {
      this.#rates.value = newValue;
    }
    if (attrName === MediaUIAttributes.MEDIA_PLAYBACK_RATE) {
      const newPlaybackRate = newValue ? +newValue : Number.NaN;
      const playbackRate = !Number.isNaN(newPlaybackRate)
        ? newPlaybackRate
        : DEFAULT_RATE;
      this.container.innerHTML = `${playbackRate}x`;
      this.setAttribute('aria-label', nouns.PLAYBACK_RATE({ playbackRate }));
      return;
    }
    super.attributeChangedCallback(attrName, oldValue, newValue);
  }

  /**
   * @type { AttributeTokenList | Array<number> | undefined} Will return a DOMTokenList.
   * Setting a value will accept an array of numbers.
   */
  get rates() {
    return this.#rates;
  }

  set rates(value) {
    if (!value) {
      this.#rates.value = '';
    } else if (Array.isArray(value)) {
      this.#rates.value = value.join(' ');
    }
  }

  /**
   * @type {number} The current playback rate
   */
  get mediaPlaybackRate() {
    return (
      getNumericAttr(this, MediaUIAttributes.MEDIA_PLAYBACK_RATE) ??
      DEFAULT_RATE
    );
  }

  set mediaPlaybackRate(value) {
    setNumericAttr(this, MediaUIAttributes.MEDIA_PLAYBACK_RATE, value);
  }

  handleClick() {
    const availableRates = Array.from(this.rates.values(), str => +str).sort();
    const detail =
      availableRates.find((r) => r > this.mediaPlaybackRate) ??
      availableRates[0] ??
      DEFAULT_RATE;
    const evt = new window.CustomEvent(
      MediaUIEvents.MEDIA_PLAYBACK_RATE_REQUEST,
      { composed: true, bubbles: true, detail }
    );
    this.dispatchEvent(evt);
  }
}

if (!window.customElements.get('media-playback-rate-button')) {
  window.customElements.define(
    'media-playback-rate-button',
    MediaPlaybackRateButton
  );
}

export default MediaPlaybackRateButton;
