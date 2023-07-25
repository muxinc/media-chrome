import { MediaChromeButton } from '../media-chrome-button.js';
import { globalThis, document } from '../utils/server-safe-globals.js';
import { stringifyRendition, parseRendition } from '../utils/utils.js';
import { MediaUIAttributes } from '../constants.js';

const renditionIcon = /*html*/`<svg aria-hidden="true" viewBox="0 0 24 24">
  <path d="M13.5 2.5h2v6h-2v-2h-11v-2h11v-2Zm4 2h4v2h-4v-2Zm-12 4h2v6h-2v-2h-3v-2h3v-2Zm4 2h12v2h-12v-2Zm1 4h2v6h-2v-2h-8v-2h8v-2Zm4 2h7v2h-7v-2Z" />
</svg>`;

const slotTemplate = document.createElement('template');
slotTemplate.innerHTML = /*html*/`
  <slot name="icon">${renditionIcon}</slot>
`;

/**
 * @attr {string} mediarenditionselected - (read-only) Set to the enabled rendition index.
 *
 * @cssproperty [--media-rendition-button-display = inline-flex] - `display` property of button.
 */
class MediaRenditionButton extends MediaChromeButton {
  static get observedAttributes() {
    return [
      ...super.observedAttributes,
      MediaUIAttributes.MEDIA_RENDITION_SELECTED,
    ];
  }

  constructor() {
    super({ slotTemplate });
  }

  get mediaRenditionSelected() {
    const attrVal = this.getAttribute(MediaUIAttributes.MEDIA_RENDITION_SELECTED);
    if (!attrVal) return null;

    return parseRendition(attrVal);
  }

  set mediaRenditionSelected(rendition) {
    // null, undefined, and empty arrays are treated as "no value" here
    if (!rendition) {
      this.removeAttribute(MediaUIAttributes.MEDIA_RENDITION_SELECTED);
      return;
    }

    // don't set if the new value is the same as existing
    const newValStr = stringifyRendition(rendition);
    const oldVal = this.getAttribute(MediaUIAttributes.MEDIA_RENDITION_SELECTED);
    if (oldVal === newValStr) return;

    this.setAttribute(MediaUIAttributes.MEDIA_RENDITION_SELECTED, newValStr);
  }
}

if (!globalThis.customElements.get('media-rendition-button')) {
  globalThis.customElements.define('media-rendition-button', MediaRenditionButton);
}

export default MediaRenditionButton;
