import { MediaUIAttributes } from '../constants.js';
import { MediaChromeMenuButton } from './media-chrome-menu-button.js';
import { globalThis } from '../utils/server-safe-globals.js';
import {
  getStringAttr,
  setStringAttr,
  getMediaController,
  getNumericAttr,
  setNumericAttr,
} from '../utils/element-utils.js';
import { t } from '../utils/i18n.js';

const renditionIcon = /*html*/ `<svg aria-hidden="true" viewBox="0 0 24 24">
  <path d="M13.5 2.5h2v6h-2v-2h-11v-2h11v-2Zm4 2h4v2h-4v-2Zm-12 4h2v6h-2v-2h-3v-2h3v-2Zm4 2h12v2h-12v-2Zm1 4h2v6h-2v-2h-8v-2h8v-2Zm4 2h7v2h-7v-2Z" />
</svg>`;

function getSlotTemplateHTML() {
  return /*html*/ `
    <style>
      :host([aria-expanded="true"]) slot[name=tooltip] {
        display: none;
      }
    </style>
    <slot name="icon">${renditionIcon}</slot>
  `;
}

function getTooltipContentHTML() {
  return t('Quality');
}

/**
 * @attr {string} mediarenditionselected - (read-only) Set to the selected rendition id.
 * @attr {(unavailable|unsupported)} mediarenditionunavailable - (read-only) Set if rendition selection is unavailable.
 *
 * @cssproperty [--media-rendition-menu-button-display = inline-flex] - `display` property of button.
 */
class MediaRenditionMenuButton extends MediaChromeMenuButton {
  static getSlotTemplateHTML = getSlotTemplateHTML;
  static getTooltipContentHTML = getTooltipContentHTML;

  static get observedAttributes() {
    return [
      ...super.observedAttributes,
      MediaUIAttributes.MEDIA_RENDITION_SELECTED,
      MediaUIAttributes.MEDIA_RENDITION_UNAVAILABLE,
      MediaUIAttributes.MEDIA_HEIGHT,
    ];
  }

  connectedCallback(): void {
    super.connectedCallback();
    this.setAttribute('aria-label', t('quality'));
  }

  /**
   * Returns the element with the id specified by the `invoketarget` attribute.
   */
  get invokeTargetElement(): HTMLElement | null {
    if (this.invokeTarget != undefined) return super.invokeTargetElement;
    return getMediaController(this).querySelector('media-rendition-menu');
  }

  /**
   * Get selected rendition id.
   */
  get mediaRenditionSelected(): string {
    return getStringAttr(this, MediaUIAttributes.MEDIA_RENDITION_SELECTED);
  }

  set mediaRenditionSelected(id: string) {
    setStringAttr(this, MediaUIAttributes.MEDIA_RENDITION_SELECTED, id);
  }

  get mediaHeight(): number {
    return getNumericAttr(this, MediaUIAttributes.MEDIA_HEIGHT);
  }

  set mediaHeight(height: number) {
    setNumericAttr(this, MediaUIAttributes.MEDIA_HEIGHT, height);
  }
}

if (!globalThis.customElements.get('media-rendition-menu-button')) {
  globalThis.customElements.define(
    'media-rendition-menu-button',
    MediaRenditionMenuButton
  );
}

export { MediaRenditionMenuButton };
export default MediaRenditionMenuButton;
