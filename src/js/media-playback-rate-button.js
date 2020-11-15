import MediaChromeButton from './media-chrome-button.js';
import { defineCustomElement } from './utils/defineCustomElement.js';

class MediaPlaybackRateButton extends MediaChromeButton {
  constructor() {
    super();
    this._rates = [1,1.25,1.5,1.75,2];
  }

  static get observedAttributes() {
    return ['rates'].concat(super.observedAttributes || []);
  }

  onClick(e) {
    const media = this.media;

    if (!media) return;

    const currentRate = media.playbackRate;
    let newRate = this._rates.find(r => r > currentRate);

    if (!newRate) newRate = this._rates[0];

    media.playbackRate = newRate;
  }

  mediaSetCallback(media) {
    if (!media) return;

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
