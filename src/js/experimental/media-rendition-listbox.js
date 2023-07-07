import MediaChromeListbox from './media-chrome-listbox.js';
import './media-chrome-option.js';
import { window, document } from '../utils/server-safe-globals.js';
import { parseRenditionList } from '../utils/utils.js';
import { MediaUIAttributes, MediaUIEvents } from '../constants.js';

const slotTemplate = document.createElement('template');
slotTemplate.innerHTML = /*html*/`
  <style>
    media-chrome-option {
      white-space: var(--media-rendition-listbox-white-space, nowrap);
    }
  </style>
`;

/**
 * @attr {string} mediarenditionsenabled - (read-only) Set to the enabled rendition.
 * @attr {string} mediarenditionlist - (read-only) Set to the rendition list.
 *
 * @cssproperty --media-rendition-listbox-white-space - `white-space` of playback rate list item.
 */
class MediaRenditionListbox extends MediaChromeListbox {
  #autoOption;
  #renditionList = [];

  static get observedAttributes() {
    return [
      ...super.observedAttributes,
      MediaUIAttributes.MEDIA_RENDITION_LIST,
      MediaUIAttributes.MEDIA_RENDITIONS_ENABLED,
    ];
  }

  constructor() {
    super({ slotTemplate });

    const autoOption = document.createElement('media-chrome-option');

    autoOption.part.add('option');
    autoOption.value = 'auto';
    autoOption.textContent = 'Auto';
    this.#autoOption = autoOption;
  }

  attributeChangedCallback(attrName, oldValue, newValue) {

    if (attrName === MediaUIAttributes.MEDIA_RENDITIONS_ENABLED && oldValue !== newValue) {
      this.value = newValue;

    } else if (attrName === MediaUIAttributes.MEDIA_RENDITION_LIST && oldValue !== newValue) {

      this.#renditionList = parseRenditionList(newValue);
      this.#render();
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

  get mediaRenditionList() {
    return this.#renditionList;
  }

  set mediaRenditionList(list) {
    this.removeAttribute(MediaUIAttributes.MEDIA_RENDITION_LIST);

    this.#renditionList = list;
    this.#render();
  }

  get mediaRenditionsEnabled() {
    if (this.value) {
      return this.mediaRenditionList.filter(({ id }) => id == this.value);
    }
    return undefined;
  }

  set mediaRenditionsEnabled(list) {
    this.removeAttribute(MediaUIAttributes.MEDIA_RENDITIONS_ENABLED);

    this.value = list[0]?.id;
  }

  #render() {
    const renditionList = this.mediaRenditionList
      .sort((a, b) => b.height - a.height);

    const container = this.shadowRoot.querySelector('slot');
    container.textContent = '';

    if (!container.contains(this.#autoOption)) {
      container.append(this.#autoOption);
    }

    let isAuto = !this.mediaRenditionsEnabled;
    if (isAuto) {
      this.#autoOption.setAttribute('aria-selected', 'true');
      this.#autoOption.setAttribute('tabindex', '0');
    } else {
      this.#autoOption.setAttribute('aria-selected', 'false');
      this.#autoOption.setAttribute('tabindex', '-1');
    }

    for (const rendition of renditionList) {

      /** @type {HTMLOptionElement} */
      const option = document.createElement('media-chrome-option');
      option.part.add('option');
      option.value = `${rendition.id}`;
      option.textContent = `${Math.min(rendition.width, rendition.height)}p`;

      if (rendition.enabled && !isAuto) {
        option.setAttribute('aria-selected', 'true');
      } else {
        option.setAttribute('aria-selected', 'false');
      }

      container.append(option);
    }
  }

  #onChange() {
    const selectedOption = this.selectedOptions[0]?.value;

    if (selectedOption == null) return;

    const event = new window.CustomEvent(
      MediaUIEvents.MEDIA_RENDITION_REQUEST,
      {
        composed: true,
        bubbles: true,
        detail: selectedOption,
      }
    );
    this.dispatchEvent(event);
  }
}

if (!window.customElements.get('media-rendition-listbox')) {
  window.customElements.define('media-rendition-listbox', MediaRenditionListbox);
}

export default MediaRenditionListbox;
