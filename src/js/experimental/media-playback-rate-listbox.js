import MediaChromeListbox from './media-chrome-listbox.js';
import './media-chrome-listitem.js';
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

const compareTracks = (a, b) => {
  return a.label === b.label && a.language === b.language;
}

class MediaPlaybackrateListbox extends MediaChromeListbox {
  #offOption;

  static get observedAttributes() {
    return [
      ...super.observedAttributes,
      'aria-multiselectable'
    ];
  }

  constructor() {
    super({slotTemplate});

    const offOption = document.createElement('media-chrome-listitem');

    offOption.part.add('listitem');
    offOption.value = 'off';
    offOption.textContent = 'Off';
    this.#offOption = offOption;

    this.#render();
  }

  attributeChangedCallback(attrName, oldValue, newValue) {
    if (attrName === 'aria-multiselectable') {
      // diallow aria-multiselectable
      this.removeAttribute('aria-multiselectable');
      console.warn("Captions List doesn't currently support multiple selections. You can enable multiple items via the media.textTrack API.");
    }

    super.attributeChangedCallback(attrName, oldValue, newValue);
  }

  connectedCallback() {
    this.#render();

    this.addEventListener('change', this.#onChange);

    super.connectedCallback();
  }

  disconnectedCallback() {
    this.removeEventListener('change', this.#onChange);

    super.disconnectedCallback();
  }

  #render() {
    const container = this.shadowRoot.querySelector('ul slot');
    if (!container.contains(this.#offOption)) {
      container.append(this.#offOption);
    }
  }

  #onChange() {
    const selectedOption = this.selectedOptions[0]?.value;

    console.log(selectedOption);

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
