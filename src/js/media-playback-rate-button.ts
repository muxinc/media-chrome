import { MediaChromeButton } from './media-chrome-button.js';
import { globalThis } from './utils/server-safe-globals.js';
import { MediaUIEvents, MediaUIAttributes } from './constants.js';
import { AttributeTokenList } from './utils/attribute-token-list.js';
import { getNumericAttr, setNumericAttr } from './utils/element-utils.js';
import { t } from './utils/i18n.js';

export const Attributes = {
  RATES: 'rates',
};

export const DEFAULT_RATES = [1, 1.2, 1.5, 1.7, 2];
export const DEFAULT_RATE = 1;

function getSlotTemplateHTML(attrs: Record<string, string>) {
  return /*html*/ `
    <style>
      :host {
        min-width: 5ch;
        padding: var(--media-button-padding, var(--media-control-padding, 10px 5px));
      }
    </style>
    <slot name="icon">${attrs['mediaplaybackrate'] || DEFAULT_RATE}x</slot>
  `;
}

function getTooltipContentHTML() {
  return t('Playback rate');
}

/**
 * @attr {string} rates - Set custom playback rates for the user to choose from.
 * @attr {string} mediaplaybackrate - (read-only) Set to the media playback rate.
 *
 * @cssproperty [--media-playback-rate-button-display = inline-flex] - `display` property of button.
 */
class MediaPlaybackRateButton extends MediaChromeButton {
  static getSlotTemplateHTML = getSlotTemplateHTML;
  static getTooltipContentHTML = getTooltipContentHTML;

  static get observedAttributes() {
    return [
      ...super.observedAttributes,
      MediaUIAttributes.MEDIA_PLAYBACK_RATE,
      Attributes.RATES,
    ];
  }

  #rates = new AttributeTokenList(this, Attributes.RATES, {
    defaultValue: DEFAULT_RATES,
  });

  container: HTMLSlotElement;

  constructor() {
    super();
    this.container = this.shadowRoot.querySelector('slot[name="icon"]');
    this.container.innerHTML = `${this.mediaPlaybackRate ?? DEFAULT_RATE}x`;
  }

  attributeChangedCallback(
    attrName: string,
    oldValue: string | null,
    newValue: string | null
  ): void {
    super.attributeChangedCallback(attrName, oldValue, newValue);

    if (attrName === Attributes.RATES) {
      this.#rates.value = newValue;
    }
    if (attrName === MediaUIAttributes.MEDIA_PLAYBACK_RATE) {
      const newPlaybackRate = newValue ? +newValue : Number.NaN;
      const playbackRate = !Number.isNaN(newPlaybackRate)
        ? newPlaybackRate
        : DEFAULT_RATE;
      this.container.innerHTML = `${playbackRate}x`;
      this.setAttribute(
        'aria-label',
        t('Playback rate {playbackRate}', { playbackRate })
      );
    }
  }

  /**
   * Get the playback rates for the button.
   */
  get rates(): AttributeTokenList | ArrayLike<number> | null | undefined {
    return this.#rates;
  }

  /**
   * Set the playback rates for the button.
   * For React 19+ compatibility, accept a string of space-separated rates.
   */
  set rates(value: ArrayLike<number> | string | null | undefined) {
    if (!value) {
      this.#rates.value = '';
    } else if (Array.isArray(value)) {
      this.#rates.value = value.join(' ');
    } else if (typeof value === 'string') {
      this.#rates.value = value;
    }
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

  handleClick() {
    const availableRates = Array.from(this.#rates.values(), (str) => +str).sort(
      (a, b) => a - b
    );

    const detail =
      availableRates.find((r) => r > this.mediaPlaybackRate) ??
      availableRates[0] ??
      DEFAULT_RATE;
    const evt = new globalThis.CustomEvent(
      MediaUIEvents.MEDIA_PLAYBACK_RATE_REQUEST,
      { composed: true, bubbles: true, detail }
    );
    this.dispatchEvent(evt);
  }
}

if (!globalThis.customElements.get('media-playback-rate-button')) {
  globalThis.customElements.define(
    'media-playback-rate-button',
    MediaPlaybackRateButton
  );
}

export default MediaPlaybackRateButton;
