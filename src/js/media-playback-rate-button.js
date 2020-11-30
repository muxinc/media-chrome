import MediaChromeButton from './media-chrome-button.js';
import { defineCustomElement } from './utils/defineCustomElement.js';

/*
  <media-playback-rate-button rates="1,1.5,2">
*/

const DEFAULT_RATES = [1, 1.25, 1.5, 1.75, 2];

class MediaPlaybackRateButton extends MediaChromeButton {
  constructor() {
    super();
    this._rates = DEFAULT_RATES;
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

  onClick(e) {
    const media = this.media;

    if (!media) return;

    const currentRate = media.playbackRate;
    let newRate = this.rates.find(r => r > currentRate);

    if (!newRate) newRate = this.rates[0];

    media.playbackRate = newRate;
  }

  mediaSetCallback(media) {
    this._rateChangeHandler = () => {
      const newRate = media.playbackRate.toString().substring(0,4);
      this.shadowRoot.querySelector('button').innerHTML = `${newRate}x`;
    };

    media.addEventListener('ratechange', this._rateChangeHandler);
    this._rateChangeHandler();
  }

  mediaUnsetCallback(media) {
    if (!media) return;
    media.removeEventListener('ratechange', this._rateChangeHandler);
  }
}

defineCustomElement('media-playback-rate-button', MediaPlaybackRateButton);

export default MediaPlaybackRateButton;
