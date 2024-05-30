import { globalThis } from './utils/server-safe-globals.js';
import { MediaUIAttributes, MediaUIEvents } from './constants.js';
import {
  getMediaController,
  getStringAttr,
  setStringAttr,
} from './utils/element-utils.js';
import { parseRenditionList } from './utils/utils.js';
import {
  MediaChromeMenu,
  createMenuItem,
  createIndicator,
} from './media-chrome-menu.js';

/**
 * @extends {MediaChromeMenu}
 *
 * @slot - Default slotted elements.
 * @slot header - An element shown at the top of the menu.
 * @slot checked-indicator - An icon element indicating a checked menu-item.
 *
 * @attr {string} mediarenditionselected - (read-only) Set to the selected rendition id.
 * @attr {string} mediarenditionlist - (read-only) Set to the rendition list.
 */
class MediaRenditionMenu extends MediaChromeMenu {
  static get observedAttributes() {
    return [
      ...super.observedAttributes,
      MediaUIAttributes.MEDIA_RENDITION_LIST,
      MediaUIAttributes.MEDIA_RENDITION_SELECTED,
      MediaUIAttributes.MEDIA_RENDITION_UNAVAILABLE,
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

  /**
   * Returns the anchor element when it is a floating menu.
   * @return {HTMLElement}
   */
  get anchorElement() {
    if (this.anchor !== 'auto') return super.anchorElement;
    return getMediaController(this).querySelector(
      'media-rendition-menu-button'
    );
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

    this.defaultSlot.textContent = '';

    let isAuto = !this.mediaRenditionSelected;

    for (const rendition of renditionList) {
      const text = this.formatMenuItemText(
        `${Math.min(rendition.width, rendition.height)}p`,
        rendition
      );

      const item = createMenuItem({
        type: 'radio',
        text,
        value: `${rendition.id}`,
        checked: rendition.selected && !isAuto,
      });
      item.prepend(createIndicator(this, 'checked-indicator'));
      this.defaultSlot.append(item);
    }

    const item = createMenuItem({
      type: 'radio',
      text: this.formatMenuItemText('Auto'),
      value: 'auto',
      checked: isAuto,
    });
    item.prepend(createIndicator(this, 'checked-indicator'));
    this.defaultSlot.append(item);
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

if (!globalThis.customElements.get('media-rendition-menu')) {
  globalThis.customElements.define('media-rendition-menu', MediaRenditionMenu);
}

export { MediaRenditionMenu };
export default MediaRenditionMenu;
