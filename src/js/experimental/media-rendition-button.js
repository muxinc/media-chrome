import { MediaChromeButton } from '../media-chrome-button.js';
import { window, document } from '../utils/server-safe-globals.js';
import { stringifyRenditionList, parseRenditionList } from '../utils/utils.js';
import { MediaUIAttributes } from '../constants.js';

const getRenditionListAttr = (el, attrName) => {
  const attrVal = el.getAttribute(attrName);
  if (!attrVal) return [];

  return parseRenditionList(attrVal);
}

const setRenditionListAttr = (el, attrName, list) => {
  // null, undefined, and empty arrays are treated as "no value" here
  if (!list?.length) {
    el.removeAttribute(attrName);
    return;
  }

  // don't set if the new value is the same as existing
  const newValStr = stringifyRenditionList(list);
  const oldVal = el.getAttribute(attrName);
  if (oldVal === newValStr) return;

  el.setAttribute(attrName, newValStr);
}

const renditionIcon = `<svg aria-hidden="true" viewBox="0 0 24 24">
  <path d="M13.5 2.5h2v6h-2v-2h-11v-2h11v-2Zm4 2h4v2h-4v-2Zm-12 4h2v6h-2v-2h-3v-2h3v-2Zm4 2h12v2h-12v-2Zm1 4h2v6h-2v-2h-8v-2h8v-2Zm4 2h7v2h-7v-2Z" />
</svg>`;

const slotTemplate = document.createElement('template');
slotTemplate.innerHTML = /*html*/`
  <slot name="icon">${renditionIcon}</slot>
`;

/**
 * @attr {string} mediarenditionsenabled - (read-only) Set to the enabled rendition.
 * @attr {string} mediarenditionactive - (read-only) Set to the current active rendition.
 *
 * @cssproperty [--media-rendition-button-display = inline-flex] - `display` property of button.
 */
class MediaRenditionButton extends MediaChromeButton {
  static get observedAttributes() {
    return [
      ...super.observedAttributes,
      MediaUIAttributes.MEDIA_RENDITIONS_ENABLED,
      MediaUIAttributes.MEDIA_RENDITION_ACTIVE,
    ];
  }

  constructor() {
    super({ slotTemplate });
  }

  get mediaRenditionsEnabled() {
    return getRenditionListAttr(this, MediaUIAttributes.MEDIA_RENDITIONS_ENABLED);
  }

  set mediaRenditionsEnabled(list) {
    setRenditionListAttr(this, MediaUIAttributes.MEDIA_RENDITIONS_ENABLED, list);
  }

  get mediaRenditionActive() {
    return getRenditionListAttr(this, MediaUIAttributes.MEDIA_RENDITION_ACTIVE);
  }

  set mediaRenditionActive(list) {
    setRenditionListAttr(this, MediaUIAttributes.MEDIA_RENDITION_ACTIVE, list);
  }
}

if (!window.customElements.get('media-rendition-button')) {
  window.customElements.define('media-rendition-button', MediaRenditionButton);
}

export default MediaRenditionButton;
