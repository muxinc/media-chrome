import { MediaChromeSelectMenu } from './media-chrome-selectmenu.js';
import './media-rendition-button.js';
import './media-rendition-listbox.js';
import { MediaUIAttributes } from '../constants.js';
import { globalThis, document } from '../utils/server-safe-globals.js';

/**
 * @attr {string} mediarenditionselected - (read-only) Set to the selected rendition id.
 * @attr {(unavailable|unsupported)} mediarenditionunavailable - (read-only) Set if rendition selection is unavailable.
 *
 * @csspart button - The default button that's in the shadow DOM.
 * @csspart listbox - The default listbox that's in the shadow DOM.
 * @csspart option - A part that targets each option of the listbox.
 */
class MediaRenditionSelectMenu extends MediaChromeSelectMenu {
  static get observedAttributes() {
    return [
      ...super.observedAttributes,
      MediaUIAttributes.MEDIA_RENDITION_SELECTED,
      MediaUIAttributes.MEDIA_RENDITION_UNAVAILABLE,
    ];
  }

  init() {
    const renditionButton = document.createElement('media-rendition-button');
    renditionButton.part.add('button');
    renditionButton.preventClick = true;

    const renditionListbox = document.createElement('media-rendition-listbox');
    renditionListbox.part.add('listbox');
    renditionListbox.setAttribute(
      'exportparts',
      'option, option-selected, indicator'
    );

    const buttonSlot = this.shadowRoot.querySelector('slot[name=button]');
    const listboxSlot = this.shadowRoot.querySelector('slot[name=listbox]');

    buttonSlot.textContent = '';
    listboxSlot.textContent = '';

    buttonSlot.append(renditionButton);
    listboxSlot.append(renditionListbox);
  }
}

if (!globalThis.customElements.get('media-rendition-selectmenu')) {
  globalThis.customElements.define(
    'media-rendition-selectmenu',
    MediaRenditionSelectMenu
  );
}

export { MediaRenditionSelectMenu };
export default MediaRenditionSelectMenu;
