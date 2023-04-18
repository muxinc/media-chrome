import MediaChromeSelectMenu from './media-chrome-selectmenu.js';
import '../media-captions-button.js';
import './media-captions-listbox.js';
import { window, document, } from '../utils/server-safe-globals.js';

export const Attributes = {
  DEFAULT_SHOWING: 'defaultshowing',
};

class MediaCaptionsSelectMenu extends MediaChromeSelectMenu {
  constructor() {
    super();
  }

  init() {
    const captionsButton = document.createElement('media-captions-button');
    captionsButton.part.add('button');

    captionsButton.preventClick = true;

    /** @TODO This should probably be an observedAttribute and updated in attributeChangedCallback() (CJP) */
    if (this.hasAttribute(Attributes.DEFAULT_SHOWING)) {
      captionsButton.setAttribute(Attributes.DEFAULT_SHOWING, '');
    }

    const captionsListbox = document.createElement('media-captions-listbox');
    captionsListbox.part.add('listbox');
    captionsListbox.setAttribute('exportparts', 'listitem');

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
