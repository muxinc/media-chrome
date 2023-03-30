import MediaChromeListbox from './media-chrome-listbox.js';
import { window, document } from '../utils/server-safe-globals.js';
import { MediaUIAttributes, MediaUIEvents } from '../constants.js';

const slotTemplate = document.createElement('template');
slotTemplate.innerHTML = `
  <style>
    media-chrome-listitem {
      white-space: var(--media-captions-listbox-white-space, nowrap);
    }

  </style>
`;

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
      console.warn("Captions List doesn't currently support multiple selections. You can enable multiple items via the media.textTrack API.");
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

    const event = new window.CustomEvent(
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

if (!window.customElements.get('media-playback-rate-listbox')) {
  window.customElements.define('media-playback-rate-listbox', MediaPlaybackrateListbox);
}

export default MediaPlaybackrateListbox;
