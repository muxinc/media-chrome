import MediaChromeListbox from './media-chrome-listbox.js';
import { globalThis, document } from '../utils/server-safe-globals.js';
import { MediaUIAttributes, MediaUIEvents } from '../constants.js';

const slotTemplate = document.createElement('template');
slotTemplate.innerHTML = /*html*/`
  <style>
    media-chrome-listitem {
      white-space: var(--media-playback-rate-listbox-white-space, nowrap);
    }
  </style>
`;

/**
 * @attr {string} mediaplaybackrate - (read-only) Set to the media playback rate.
 *
 * @cssproperty --media-playback-rate-listbox-white-space - `white-space` of playback rate list item.
 */
class MediaPlaybackrateListbox extends MediaChromeListbox {
  static get observedAttributes() {
    return [
      ...super.observedAttributes,
      'aria-multiselectable',
      MediaUIAttributes.MEDIA_PLAYBACK_RATE
    ];
  }

  constructor() {
    super({slotTemplate});
  }

  attributeChangedCallback(attrName, oldValue, newValue) {
    if (attrName === MediaUIAttributes.MEDIA_PLAYBACK_RATE && oldValue !== newValue) {
      this.value = newValue;
    } else if (attrName === 'aria-multiselectable') {
      // diallow aria-multiselectable
      this.removeAttribute('aria-multiselectable');
      console.warn("Playback rate listbox doesn't support multiple selections.");
    }

    super.attributeChangedCallback(attrName, oldValue, newValue);
  }

  connectedCallback() {
    this.addEventListener('change', this.#onChange);

    super.connectedCallback();
  }

  disconnectedCallback() {
    this.removeEventListener('change', this.#onChange);

    super.disconnectedCallback();
  }

  #onChange() {
    const selectedOption = this.selectedOptions[0]?.value;

    if (!selectedOption) return;

    const event = new globalThis.CustomEvent(
      MediaUIEvents.MEDIA_PLAYBACK_RATE_REQUEST,
      {
        composed: true,
        bubbles: true,
        detail: selectedOption,
      }
    );
    this.dispatchEvent(event);
  }
}

if (!globalThis.customElements.get('media-playback-rate-listbox')) {
  globalThis.customElements.define('media-playback-rate-listbox', MediaPlaybackrateListbox);
}

export default MediaPlaybackrateListbox;
