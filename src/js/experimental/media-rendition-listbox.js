import {
  MediaChromeListbox,
  createOption,
  createIndicator,
} from './media-chrome-listbox.js';
import './media-chrome-option.js';
import { globalThis } from '../utils/server-safe-globals.js';
import { getStringAttr, setStringAttr } from '../utils/element-utils.js';
import { parseRenditionList } from '../utils/utils.js';
import { MediaUIAttributes, MediaUIEvents } from '../constants.js';

/**
 * @attr {string} mediarenditionselected - (read-only) Set to the selected rendition id.
 * @attr {string} mediarenditionlist - (read-only) Set to the rendition list.
 */
class MediaRenditionListbox extends MediaChromeListbox {
  static get observedAttributes() {
    return [
      ...super.observedAttributes,
      MediaUIAttributes.MEDIA_RENDITION_LIST,
      MediaUIAttributes.MEDIA_RENDITION_SELECTED,
    ];
  }

  #renditionList = [];
  #prevState;

  attributeChangedCallback(attrName, oldValue, newValue) {
    super.attributeChangedCallback(attrName, oldValue, newValue);

    if (
      attrName === MediaUIAttributes.MEDIA_RENDITION_SELECTED &&
      oldValue !== newValue
    ) {
      this.value = newValue ?? 'auto';
    } else if (
      attrName === MediaUIAttributes.MEDIA_RENDITION_LIST &&
      oldValue !== newValue
    ) {
      this.#renditionList = parseRenditionList(newValue);
      this.#render();
    }
  }

  connectedCallback() {
    super.connectedCallback();
    this.addEventListener('change', this.#onChange);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.removeEventListener('change', this.#onChange);
  }

  get mediaRenditionList() {
    return this.#renditionList;
  }

  set mediaRenditionList(list) {
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

    const renditionList = this.mediaRenditionList.sort(
      (a, b) => b.height - a.height
    );

    const container = this.shadowRoot.querySelector('#container');
    container.textContent = '';

    let isAuto = !this.mediaRenditionSelected;

    for (const rendition of renditionList) {
      const text = this.formatOptionText(
        `${Math.min(rendition.width, rendition.height)}p`,
        rendition
      );

      /** @type {HTMLOptionElement} */
      const option = createOption(
        text,
        `${rendition.id}`,
        rendition.selected && !isAuto
      );
      option.prepend(createIndicator(this, 'select-indicator'));

      container.append(option);
    }

    const option = createOption(this.formatOptionText('Auto'), 'auto', isAuto);
    option.prepend(createIndicator(this, 'select-indicator'));
    container.append(option);
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
  globalThis.customElements.define(
    'media-rendition-listbox',
    MediaRenditionListbox
  );
}

export { MediaRenditionListbox };
export default MediaRenditionListbox;
