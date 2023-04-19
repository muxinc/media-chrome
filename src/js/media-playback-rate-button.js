import MediaChromeButton from './media-chrome-button.js';
import { window, document } from './utils/server-safe-globals.js';
import { MediaUIEvents, MediaUIAttributes } from './constants.js';
import { nouns } from './labels/labels.js';

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
 * @extends {MediaChromeButton}
 *
 * @cssproperty --media-playback-rate-button-display
 * @cssproperty --media-control-display
 */
class MediaPlaybackRateButton extends MediaChromeButton {
  static get observedAttributes() {
    return [
      ...super.observedAttributes,
      MediaUIAttributes.MEDIA_PLAYBACK_RATE,
      Attributes.RATES,
    ];
  }

  // NOTE: Adding for TypeScript Errors. Followup should add correct getter/setter & private var (CJP)
  /** @type number[] | undefined */
  _rates;

  constructor(options = {}) {
    super({ slotTemplate, ...options });
    this.container = this.shadowRoot.querySelector('#container');
    this.container.innerHTML = `${DEFAULT_RATE}x`;
  }

  attributeChangedCallback(attrName, oldValue, newValue) {
    if (attrName === Attributes.RATES) {
      // This will:
      // 1. parse the space-separated attribute string (standard for representing lists as HTML/CSS values) into an array (of strings)
      //   The current regex allows for commas to be present between numbers to preserve legacy behavior
      // 2. convert that list into numbers (including potentially NaN)
      // 3. filter out all NaNs for invalid values
      // 4. sort the array of numbers to ensure the expected toggle-through order for playback rate.
      /** @type number[] */
      const newRates = (newValue ?? '')
        .trim()
        .split(/\s*,?\s+/)
        .map((str) => Number(str))
        .filter((num) => !Number.isNaN(num))
        .sort((a, b) => a - b);
      this._rates = newRates.length ? newRates : DEFAULT_RATES;
      return;
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

  handleClick() {
    const currentRate =
      +this.getAttribute(MediaUIAttributes.MEDIA_PLAYBACK_RATE) || DEFAULT_RATE;
    const detail =
      this._rates.find((r) => r > currentRate) ??
      this._rates[0] ??
      DEFAULT_RATE;
    const evt = new window.CustomEvent(
      MediaUIEvents.MEDIA_PLAYBACK_RATE_REQUEST,
      { composed: true, bubbles: true, detail }
    );
    this.dispatchEvent(evt);
  }
}

if (!window.customElements.get('media-playback-rate-button')) {
  window.customElements.define('media-playback-rate-button', MediaPlaybackRateButton);
}

export default MediaPlaybackRateButton;
