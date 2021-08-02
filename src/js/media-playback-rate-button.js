import MediaChromeButton from './media-chrome-button.js';
import { defineCustomElement } from './utils/defineCustomElement.js';
import { MediaUIEvents, MediaUIAttributes } from './constants';

/*
  <media-playback-rate-button rates="1,1.5,2">
*/

const DEFAULT_RATES = [1, 1.25, 1.5, 1.75, 2];
const DEFAULT_RATE = 1;

class MediaPlaybackRateButton extends MediaChromeButton {

  static get observedAttributes() {
    return [MediaUIAttributes.MEDIA_PLAYBACK_RATE, 'rates'];
  }

  constructor() {
    super();
    this._rates = DEFAULT_RATES;
    this.nativeEl.innerHTML = `${DEFAULT_RATE}x`;
  }

  connectedCallback() {
    /** Option 1 */
    const evt = new Event(MediaUIEvents.MEDIA_CHROME_ELEMENT_CONNECTED, { composed: true, bubbles: true });
    evt.details = this.constructor.observedAttributes;
    this.dispatchEvent(evt);
    /** Option 2 */
    this.setAttribute(MediaUIAttributes.MEDIA_CHROME_ATTRIBUTES, this.constructor.observedAttributes.join(' '));
  }

  attributeChangedCallback(attrName, _oldValue, newValue) {
    if (attrName === 'rates') {
      const newRates = (newValue ?? '').split(/,\s?/).map(str => str ? +str : Number.NaN).filter(num => !Number.isNaN(num)).sort();
      this._rates = newRates.length ? newRates : DEFAULT_RATES;
      return;
    }
    if (attrName === MediaUIAttributes.MEDIA_PLAYBACK_RATE) {
      const newRate = newValue ? +newValue : Number.NaN;
      const rate = !Number.isNaN(newRate) ? newRate : DEFAULT_RATE;
      this.nativeEl.innerHTML = `${rate}x`;
      return;
    }
  }

  handleClick(_e) {
    const currentRate = (+this.getAttribute(MediaUIAttributes.MEDIA_PLAYBACK_RATE) || DEFAULT_RATE);
    const newRate = this._rates.find(r => r > currentRate) ?? this._rates[0] ?? DEFAULT_RATE;
    const evt = new Event(MediaUIEvents.MEDIA_PLAYBACK_RATE_REQUEST, { composed: true, bubbles: true });
    evt.detail = newRate;
    this.dispatchEvent(evt);
  }
}

defineCustomElement('media-playback-rate-button', MediaPlaybackRateButton);

export default MediaPlaybackRateButton;
