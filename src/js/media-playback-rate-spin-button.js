import MediaChromeButton from './media-chrome-button.js';
import { defineCustomElement } from './utils/defineCustomElement.js';
import { Window as window } from './utils/server-safe-globals.js';
import { MediaUIEvents, MediaUIAttributes } from './constants.js';
import { nouns } from './labels/labels.js';

/*
  <media-playback-rate-button rates="1,1.5,2">
*/

const DEFAULT_RATES = [1, 1.25, 1.5, 1.75, 2];
const DEFAULT_RATE = 1;

const SpinPressKeys = {
  ARROW_DOWN: 'ArrowDown',
  ARROW_UP: 'ArrowUp',
  HOME: 'Home',
  END: 'End',
};

const SpinPressKeyValues = Object.values(SpinPressKeys);

class MediaPlaybackRateSpinButton extends MediaChromeButton {

  static get observedAttributes() {
    return [...super.observedAttributes, MediaUIAttributes.MEDIA_PLAYBACK_RATE, 'rates'];
  }

  constructor() {
    super();
    this._rates = DEFAULT_RATES;
    this.nativeEl.innerHTML = `${DEFAULT_RATE}x`;
    this.addEventListener('keydown', (e) => {
      const { key } = e;
      if (!SpinPressKeyValues.includes(key)) return;

      const currentRate = (+this.getAttribute(MediaUIAttributes.MEDIA_PLAYBACK_RATE) || DEFAULT_RATE);
      let nextRate;
      if (key === SpinPressKeys.ARROW_UP) {
        nextRate = this._rates.find(r => r > currentRate) ?? this._rates[0] ?? DEFAULT_RATE;
      } else if (key === SpinPressKeys.ARROW_DOWN) {
        nextRate = [...this._rates].reverse().find(r => r < currentRate) ?? this._rates[this._rates.length - 1] ?? DEFAULT_RATE;
      } else if (key === SpinPressKeys.HOME) {
        nextRate = this._rates[0] ?? DEFAULT_RATE;
      } else if (key === SpinPressKeys.HOME) {
        nextRate = this._rates[this._rates.length - 1] ?? DEFAULT_RATE;
      }

      console.log('key', key);

      const evt = new window.CustomEvent(MediaUIEvents.MEDIA_PLAYBACK_RATE_REQUEST, { composed: true, bubbles: true, detail: nextRate });
      this.dispatchEvent(evt);
    });
  }

  connectedCallback() {
    super.connectedCallback();
    this.setAttribute('role', 'spinbutton');
    this.setAttribute('aria-label', 'playback rate');
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
      this.setAttribute('aria-valuemin', this._rates[0]);
      this.setAttribute('aria-valuemax', this._rates[this._rates.length - 1]);
      return;
    }
    if (attrName === MediaUIAttributes.MEDIA_PLAYBACK_RATE) {
      const newPlaybackRate = newValue ? +newValue : Number.NaN;
      const playbackRate = !Number.isNaN(newPlaybackRate) ? newPlaybackRate : DEFAULT_RATE;
      this.nativeEl.innerHTML = `${playbackRate}x`;
      this.setAttribute('aria-valuenow', playbackRate);
      this.setAttribute('aria-valuetext', `${playbackRate}x`);
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

defineCustomElement('media-playback-rate-spin-button', MediaPlaybackRateSpinButton);

export default MediaPlaybackRateSpinButton;
