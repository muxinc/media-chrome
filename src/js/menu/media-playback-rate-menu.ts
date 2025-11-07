import { globalThis } from '../utils/server-safe-globals.js';
import { MediaUIAttributes, MediaUIEvents } from '../constants.js';
import { AttributeTokenList } from '../utils/attribute-token-list.js';
import {
  getNumericAttr,
  setNumericAttr,
  getMediaController,
} from '../utils/element-utils.js';
import { DEFAULT_RATES, DEFAULT_RATE } from '../media-playback-rate-button.js';
import {
  MediaChromeMenu,
  createMenuItem,
  createIndicator,
} from './media-chrome-menu.js';

export const Attributes = {
  RATES: 'rates',
};

/**
 * @extends {MediaChromeMenu}
 *
 * @slot - Default slotted elements.
 * @slot header - An element shown at the top of the menu.
 * @slot checked-indicator - An icon element indicating a checked menu-item.
 *
 * @attr {string} rates - Set custom playback rates for the user to choose from.
 * @attr {string} mediaplaybackrate - (read-only) Set to the media playback rate.
 */
class MediaPlaybackRateMenu extends MediaChromeMenu {
  static get observedAttributes(): string[] {
    return [
      ...super.observedAttributes,
      MediaUIAttributes.MEDIA_PLAYBACK_RATE,
      Attributes.RATES,
    ];
  }

  #rates: AttributeTokenList = new AttributeTokenList(this, Attributes.RATES, {
    defaultValue: DEFAULT_RATES,
  });

  constructor() {
    super();
    this.#render();
  }

  attributeChangedCallback(
    attrName: string,
    oldValue: string | null,
    newValue: string | null
  ): void {
    super.attributeChangedCallback(attrName, oldValue, newValue);

    if (
      attrName === MediaUIAttributes.MEDIA_PLAYBACK_RATE &&
      oldValue != newValue
    ) {
      this.value = newValue;
      this.#render();
    } else if (attrName === Attributes.RATES && oldValue != newValue) {
      this.#rates.value = newValue;
      this.#render();
    }
  }

  connectedCallback(): void {
    super.connectedCallback();
    this.addEventListener('change', this.#onChange);
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this.removeEventListener('change', this.#onChange);
  }

  /**
   * Returns the anchor element when it is a floating menu.
   */
  get anchorElement() {
    if (this.anchor !== 'auto') return super.anchorElement;
    return getMediaController(this).querySelector<HTMLElement>(
      'media-playback-rate-menu-button'
    );
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
    this.#render();
  }

  /**
   * The current playback rate
   */
  get mediaPlaybackRate(): number {
    return getNumericAttr(
      this,
      MediaUIAttributes.MEDIA_PLAYBACK_RATE,
      DEFAULT_RATE
    );
  }

  set mediaPlaybackRate(value: number) {
    setNumericAttr(this, MediaUIAttributes.MEDIA_PLAYBACK_RATE, value);
  }

  #render(): void {
    this.defaultSlot.textContent = '';

    const currentRate = this.mediaPlaybackRate;
    const ratesSet = new Set(Array.from(this.#rates).map(rate => Number(rate)));
    
    // If current rate is not in the list, add it to show it as selected
    if (currentRate > 0 && !ratesSet.has(currentRate)) {
      ratesSet.add(currentRate);
    }
    const sortedRates = Array.from(ratesSet).sort((a, b) => a - b);

    for (const rate of sortedRates) {
      const item = createMenuItem({
        type: 'radio',
        text: this.formatMenuItemText(`${rate}x`, rate),
        value: rate.toString(),
        checked: currentRate === rate,
      });
      item.prepend(createIndicator(this, 'checked-indicator'));
      this.defaultSlot.append(item);
    }
  }

  #onChange(): void {
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

if (!globalThis.customElements.get('media-playback-rate-menu')) {
  globalThis.customElements.define(
    'media-playback-rate-menu',
    MediaPlaybackRateMenu
  );
}

export { MediaPlaybackRateMenu };
export default MediaPlaybackRateMenu;
