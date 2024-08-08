import { globalThis, document } from '../utils/server-safe-globals.js';
import { MediaUIAttributes } from '../constants.js';
import { nouns, tooltipLabels } from '../labels/labels.js';
import { MediaChromeMenuButton } from './media-chrome-menu-button.js';
import { AttributeTokenList } from '../utils/attribute-token-list.js';
import {
  getNumericAttr,
  setNumericAttr,
  getMediaController,
} from '../utils/element-utils.js';

export const Attributes = {
  RATES: 'rates',
};

export const DEFAULT_RATES = [1, 1.2, 1.5, 1.7, 2];
export const DEFAULT_RATE = 1;

const slotTemplate: HTMLTemplateElement = document.createElement('template');
slotTemplate.innerHTML = /*html*/ `
  <style>
    :host {
      min-width: 5ch;
      padding: var(--media-button-padding, var(--media-control-padding, 10px 5px));
    }
    
    :host([aria-expanded="true"]) slot[name=tooltip] {
      display: none;
    }
  </style>
  <slot name="icon"></slot>
`;

/**
 * @attr {string} rates - Set custom playback rates for the user to choose from.
 * @attr {string} mediaplaybackrate - (read-only) Set to the media playback rate.
 *
 * @cssproperty [--media-playback-rate-menu-button-display = inline-flex] - `display` property of button.
 */
class MediaPlaybackRateMenuButton extends MediaChromeMenuButton {
  static get observedAttributes(): string[] {
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

  constructor(options = {}) {
    super({
      slotTemplate,
      tooltipContent: tooltipLabels.PLAYBACK_RATE,
      ...options,
    });
    this.container = this.shadowRoot.querySelector('slot[name="icon"]');
    this.container.innerHTML = `${DEFAULT_RATE}x`;
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
      this.setAttribute('aria-label', nouns.PLAYBACK_RATE({ playbackRate }));
    }
  }

  /**
   * Returns the element with the id specified by the `invoketarget` attribute.
   */
  get invokeTargetElement(): HTMLElement | null {
    if (this.invokeTarget != undefined) return super.invokeTargetElement;
    return getMediaController(this).querySelector('media-playback-rate-menu');
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
}

if (!globalThis.customElements.get('media-playback-rate-menu-button')) {
  globalThis.customElements.define(
    'media-playback-rate-menu-button',
    MediaPlaybackRateMenuButton
  );
}

export { MediaPlaybackRateMenuButton };
export default MediaPlaybackRateMenuButton;
