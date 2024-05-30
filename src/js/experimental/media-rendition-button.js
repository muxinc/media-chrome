import { MediaChromeButton } from '../media-chrome-button.js';
import { globalThis, document } from '../utils/server-safe-globals.js';
import { getStringAttr, setStringAttr } from '../utils/element-utils.js';
import { MediaUIAttributes } from '../constants.js';

const renditionIcon = /*html*/ `<svg aria-hidden="true" viewBox="0 0 24 24">
  <path d="M13.5 2.5h2v6h-2v-2h-11v-2h11v-2Zm4 2h4v2h-4v-2Zm-12 4h2v6h-2v-2h-3v-2h3v-2Zm4 2h12v2h-12v-2Zm1 4h2v6h-2v-2h-8v-2h8v-2Zm4 2h7v2h-7v-2Z" />
</svg>`;

const slotTemplate = document.createElement('template');
slotTemplate.innerHTML = /*html*/ `
  <slot name="icon">${renditionIcon}</slot>
`;

/**
 * @attr {string} mediarenditionselected - (read-only) Set to the selected rendition id.
 * @attr {(unavailable|unsupported)} mediarenditionunavailable - (read-only) Set if rendition selection is unavailable.
 *
 * @cssproperty [--media-rendition-button-display = inline-flex] - `display` property of button.
 */
class MediaRenditionButton extends MediaChromeButton {
  static get observedAttributes() {
    return [
      ...super.observedAttributes,
      MediaUIAttributes.MEDIA_RENDITION_SELECTED,
      MediaUIAttributes.MEDIA_RENDITION_UNAVAILABLE,
    ];
  }

  constructor() {
    super({ slotTemplate });
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
}

if (!globalThis.customElements.get('media-rendition-button')) {
  globalThis.customElements.define(
    'media-rendition-button',
    MediaRenditionButton
  );
}

export { MediaRenditionButton };
export default MediaRenditionButton;
