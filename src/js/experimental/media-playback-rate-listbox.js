import {
  MediaChromeListbox,
  createOption,
  createIndicator,
} from './media-chrome-listbox.js';
import './media-chrome-option.js';
import { DEFAULT_RATES, DEFAULT_RATE } from '../media-playback-rate-button.js';
import { MediaUIAttributes, MediaUIEvents } from '../constants.js';
import { globalThis } from '../utils/server-safe-globals.js';
import { getNumericAttr, setNumericAttr } from '../utils/element-utils.js';
import { AttributeTokenList } from '../utils/attribute-token-list.js';

export const Attributes = {
  RATES: 'rates',
};

/**
 * @attr {string} rates - Set custom playback rates for the user to choose from.
 * @attr {string} mediaplaybackrate - (read-only) Set to the media playback rate.
 */
class MediaPlaybackRateListbox extends MediaChromeListbox {
  static get observedAttributes() {
    return [
      ...super.observedAttributes,
      'aria-multiselectable',
      MediaUIAttributes.MEDIA_PLAYBACK_RATE,
      Attributes.RATES,
    ];
  }

  #rates = new AttributeTokenList(this, Attributes.RATES, {
    defaultValue: DEFAULT_RATES,
  });

  constructor() {
    super();

    this.#render();
  }

  attributeChangedCallback(attrName, oldValue, newValue) {
    super.attributeChangedCallback(attrName, oldValue, newValue);

    if (
      attrName === MediaUIAttributes.MEDIA_PLAYBACK_RATE &&
      oldValue != newValue
    ) {
      this.value = newValue;
    } else if (attrName === Attributes.RATES && oldValue != newValue) {
      this.#rates.value = newValue;
      this.#render();
    }
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
    this.#render();
  }

  /**
   * @type {number} The current playback rate
   */
  get mediaPlaybackRate() {
    return getNumericAttr(
      this,
      MediaUIAttributes.MEDIA_PLAYBACK_RATE,
      DEFAULT_RATE
    );
  }

  set mediaPlaybackRate(value) {
    setNumericAttr(this, MediaUIAttributes.MEDIA_PLAYBACK_RATE, value);
  }

  connectedCallback() {
    super.connectedCallback();
    this.addEventListener('change', this.#onChange);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.removeEventListener('change', this.#onChange);
  }

  #render() {
    const container = this.shadowRoot.querySelector('#container');
    container.textContent = '';

    for (const rate of this.rates) {
      /** @type {HTMLOptionElement} */
      const option = createOption(
        this.formatOptionText(`${rate}x`, rate),
        rate,
        this.mediaPlaybackRate == rate
      );
      option.prepend(createIndicator(this, 'select-indicator'));
      container.append(option);
    }
  }

  #onChange() {
    if (!this.value) return;

    const event = new globalThis.CustomEvent(
      MediaUIEvents.MEDIA_PLAYBACK_RATE_REQUEST,
      {
        composed: true,
        bubbles: true,
        detail: this.value,
      }
    );
    this.dispatchEvent(event);
  }
}

if (!globalThis.customElements.get('media-playback-rate-listbox')) {
  globalThis.customElements.define(
    'media-playback-rate-listbox',
    MediaPlaybackRateListbox
  );
}

export { MediaPlaybackRateListbox };
export default MediaPlaybackRateListbox;
