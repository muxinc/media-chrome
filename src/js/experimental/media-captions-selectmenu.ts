import { MediaChromeSelectMenu } from './media-chrome-selectmenu.js';
import '../media-captions-button.js';
import './media-captions-listbox.js';
import { globalThis, document } from '../utils/server-safe-globals.js';

/**
 * @csspart button - The default button that's in the shadow DOM.
 * @csspart listbox - The default listbox that's in the shadow DOM.
 * @csspart option - A part that targets each option of the listbox.
 */
class MediaCaptionsSelectMenu extends MediaChromeSelectMenu {
  init() {
    const captionsButton = document.createElement('media-captions-button');
    captionsButton.part.add('button');
    captionsButton.preventClick = true;

    const captionsListbox = document.createElement('media-captions-listbox');
    captionsListbox.part.add('listbox');
    captionsListbox.setAttribute(
      'exportparts',
      'option, option-selected, indicator'
    );

    const buttonSlot = this.shadowRoot.querySelector('slot[name=button]');
    const listboxSlot = this.shadowRoot.querySelector('slot[name=listbox]');

    buttonSlot.textContent = '';
    listboxSlot.textContent = '';

    buttonSlot.append(captionsButton);
    listboxSlot.append(captionsListbox);
  }
}

if (!globalThis.customElements.get('media-captions-selectmenu')) {
  globalThis.customElements.define(
    'media-captions-selectmenu',
    MediaCaptionsSelectMenu
  );
}

export { MediaCaptionsSelectMenu };
export default MediaCaptionsSelectMenu;
