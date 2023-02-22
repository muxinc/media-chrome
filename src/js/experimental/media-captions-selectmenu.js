import MediaChromeSelectmenu from './media-chrome-selectmenu.js';
import '../media-captions-button.js';
import './media-captions-listbox.js';
import { window, document, } from '../utils/server-safe-globals.js';

class MediaCaptionsSelectmenu extends MediaChromeSelectmenu {
  constructor() {
    super();

    const captionsButton = document.createElement('media-captions-button');
    const captionsListbox = document.createElement('media-captions-listbox');

    captionsButton.setAttribute('slot', 'button');
    captionsListbox.setAttribute('slot', 'listbox');

    if (this.hasAttribute('default-showing')) {
      captionsButton.setAttribute('default-showing', '');
    }

    this.append(captionsButton);
    this.append(captionsListbox);
  }

}

if (!window.customElements.get('media-captions-selectmenu')) {
  window.customElements.define('media-captions-selectmenu', MediaCaptionsSelectmenu);
}

export default MediaCaptionsSelectmenu;
