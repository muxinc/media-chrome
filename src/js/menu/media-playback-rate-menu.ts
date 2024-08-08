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
   * Will return a DOMTokenList.
   * Setting a value will accept an array of numbers.
   */
  get rates(): AttributeTokenList | number[] | undefined {
    return this.#rates;
  }

  set rates(value: AttributeTokenList | number[] | undefined) {
    if (!value) {
      this.#rates.value = '';
    } else if (Array.isArray(value)) {
      this.#rates.value = value.join(' ');
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

    for (const rate of this.rates) {
      const item = createMenuItem({
        type: 'radio',
        text: this.formatMenuItemText(`${rate}x`, rate),
        value: rate as string,
        checked: this.mediaPlaybackRate == rate,
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
