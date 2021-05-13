import MediaChromeButton from './media-chrome-button.js';
import { defineCustomElement } from './utils/defineCustomElement.js';
import { mediaUIEvents } from './media-chrome-html-element.js';

/*
  <media-playback-rate-button rates="1,1.5,2">
*/

const DEFAULT_RATES = [1, 1.25, 1.5, 1.75, 2];

class MediaPlaybackRateButton extends MediaChromeButton {
  constructor() {
    super();
    this._rates = DEFAULT_RATES;

    // Default
    this.mediaPlaybackRateSet(1);
  }

  static get observedAttributes() {
    return ['rates'].concat(super.observedAttributes || []);
  }

  // String of comma separated values, to match attribute
  set rates(rates) {
    if (!rates) {
      this._rates = DEFAULT_RATES;
    } else {
      if (typeof rates == 'string') {
        rates = rates.split(/,\s?/)
      }

      this._rates = rates;
    }
  }

  get rates() {
    return this._rates;
  }

  handleClick(e) {
    const currentRate = this.mediaPlaybackRate;
    let newRate = this.rates.find(r => r > currentRate);

    if (!newRate) newRate = this.rates[0];

    this.dispatchMediaEvent(mediaUIEvents.MEDIA_PLAYBACK_RATE_REQUEST, {
      detail: newRate
    })
  }

  mediaPlaybackRateSet(rate) {
    this.nativeEl.innerHTML = `${rate}x`;
  }
}

defineCustomElement('media-playback-rate-button', MediaPlaybackRateButton);

export default MediaPlaybackRateButton;
