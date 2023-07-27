import MediaChromeListbox from './media-chrome-listbox.js';
import './media-chrome-option.js';
import { globalThis, document } from '../utils/server-safe-globals.js';
import { getStringAttr, setStringAttr } from '../utils/element-utils.js';
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
 * @attr {string} mediarenditionselected - (read-only) Set to the selected rendition id.
 * @attr {string} mediarenditionlist - (read-only) Set to the rendition list.
 *
 * @cssproperty --media-rendition-listbox-white-space - `white-space` of playback rate list item.
 */
class MediaRenditionListbox extends MediaChromeListbox {
  #autoOption;
  #renditionList = [];
  #prevState;

  static get observedAttributes() {
    return [
      ...super.observedAttributes,
      MediaUIAttributes.MEDIA_RENDITION_LIST,
      MediaUIAttributes.MEDIA_RENDITION_SELECTED,
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

    if (attrName === MediaUIAttributes.MEDIA_RENDITION_SELECTED && oldValue !== newValue) {
      this.value = newValue ?? 'auto';

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

  /**
   * Get selected rendition id.
   * @return {string}
   */
  get mediaRenditionSelected() {
    return getStringAttr(this, MediaUIAttributes.MEDIA_RENDITION_SELECTED);
  }

  set mediaRenditionSelected(id) {
    setStringAttr(this, MediaUIAttributes.MEDIA_RENDITION_SELECTED, id);
  }

  #render() {
    if (this.#prevState === JSON.stringify(this.mediaRenditionList)) return;
    this.#prevState = JSON.stringify(this.mediaRenditionList);

    const renditionList = this.mediaRenditionList
      .sort((a, b) => b.height - a.height);

    const container = this.shadowRoot.querySelector('slot');
    container.textContent = '';

    if (!container.contains(this.#autoOption)) {
      container.append(this.#autoOption);
    }

    let isAuto = !this.mediaRenditionSelected;
    if (isAuto) {
      this.#autoOption.setAttribute('aria-selected', 'true');
    } else {
      this.#autoOption.setAttribute('aria-selected', 'false');
    }

    for (const rendition of renditionList) {

      /** @type {HTMLOptionElement} */
      const option = document.createElement('media-chrome-option');
      option.part.add('option');
      option.value = `${rendition.id}`;
      option.textContent = `${Math.min(rendition.width, rendition.height)}p`;

      if (rendition.selected && !isAuto) {
        option.setAttribute('aria-selected', 'true');
      } else {
        option.setAttribute('aria-selected', 'false');
      }

      container.append(option);
    }
  }

  #onChange() {
    if (this.value == null) return;

    const event = new globalThis.CustomEvent(
      MediaUIEvents.MEDIA_RENDITION_REQUEST,
      {
        composed: true,
        bubbles: true,
        detail: this.value,
      }
    );
    this.dispatchEvent(event);
  }
}

if (!globalThis.customElements.get('media-rendition-listbox')) {
  globalThis.customElements.define('media-rendition-listbox', MediaRenditionListbox);
}

export default MediaRenditionListbox;
