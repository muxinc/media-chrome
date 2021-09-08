import MediaChromeButton from './media-chrome-button.js';
import { defineCustomElement } from './utils/defineCustomElement.js';
import { Window as window } from './utils/server-safe-globals.js';
import { MediaUIEvents, MediaUIAttributes } from './constants.js';

/*
  <media-playback-rate-button rates="1,1.5,2">
*/

const DEFAULT_RATES = [1, 1.25, 1.5, 1.75, 2];
const DEFAULT_RATE = 1;

class MediaPlaybackRateButton extends MediaChromeButton {

  static get observedAttributes() {
    return [...super.observedAttributes, MediaUIAttributes.MEDIA_PLAYBACK_RATE, 'rates'];
  }

  constructor() {
    super();
    this._rates = DEFAULT_RATES;
    this.nativeEl.innerHTML = `${DEFAULT_RATE}x`;
  }

  connectedCallback() {
    this.setAttribute(MediaUIAttributes.MEDIA_CHROME_ATTRIBUTES, this.constructor.observedAttributes.join(' '));
    super.connectedCallback();
  }

  attributeChangedCallback(attrName, oldValue, newValue) {
    if (attrName === 'rates') {
      // This will:
      // 1. parse the space-separated attribute string (standard for representing lists as HTML/CSS values) into an array (of strings)
      // 2. convert that list into numbers (including potentially NaN)
      // 3. filter out all NaNs for invalid values
      // 4. sort the array of numbers to ensure the expected toggle-through order for playback rate.
      const newRates = (newValue ?? '').split(/,\s?/).map(str => str ? +str : Number.NaN).filter(num => !Number.isNaN(num)).sort();
      this._rates = newRates.length ? newRates : DEFAULT_RATES;
      return;
    }
    if (attrName === MediaUIAttributes.MEDIA_PLAYBACK_RATE) {
      const newRate = newValue ? +newValue : Number.NaN;
      const rate = !Number.isNaN(newRate) ? newRate : DEFAULT_RATE;
      this.nativeEl.innerHTML = `${rate}x`;
      /** @TODO Implement real version of this (CJP) */
      this.setAttribute('aria-label', `${rate}x`);
      return;
    }
    super.attributeChangedCallback(attrName, oldValue, newValue);
  }

  handleClick(_e) {
    const currentRate = (+this.getAttribute(MediaUIAttributes.MEDIA_PLAYBACK_RATE) || DEFAULT_RATE);
    const detail = this._rates.find(r => r > currentRate) ?? this._rates[0] ?? DEFAULT_RATE;
    const evt = new window.CustomEvent(MediaUIEvents.MEDIA_PLAYBACK_RATE_REQUEST, { composed: true, bubbles: true, detail });
    this.dispatchEvent(evt);
  }
}

defineCustomElement('media-playback-rate-button', MediaPlaybackRateButton);

export default MediaPlaybackRateButton;
