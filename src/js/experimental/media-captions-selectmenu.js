import MediaChromeSelectMenu from './media-chrome-selectmenu.js';
import '../media-captions-button.js';
import './media-captions-listbox.js';
import { window, document, } from '../utils/server-safe-globals.js';

class MediaCaptionsSelectMenu extends MediaChromeSelectMenu {
  constructor() {
    super();
  }

  init() {
   const captionsButton = document.createElement('media-captions-button');
    captionsButton.setAttribute('part', 'button');

    captionsButton.preventClick = true;

    if (this.hasAttribute('default-showing')) {
      captionsButton.setAttribute('default-showing', '');
    }

    const captionsListbox = document.createElement('media-captions-listbox');
    captionsListbox.setAttribute('part', 'listbox');

    const buttonSlot = this.shadowRoot.querySelector('slot[name=button]');
    const listboxSlot = this.shadowRoot.querySelector('slot[name=listbox]');

    buttonSlot.textContent = '';
    listboxSlot.textContent = '';

    buttonSlot.append(captionsButton);
    listboxSlot.append(captionsListbox);
  }
}

if (!window.customElements.get('media-captions-selectmenu')) {
  window.customElements.define('media-captions-selectmenu', MediaCaptionsSelectMenu);
}

export default MediaCaptionsSelectMenu;
