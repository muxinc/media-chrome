import MediaChromeMenuButton from './media-chrome-menu-button.js';
import './media-captions-listbox.js';
import { MediaUIAttributes, MediaStateReceiverAttributes } from '../constants.js';
import { window, document, } from '../utils/server-safe-globals.js';
import { closestComposedNode } from '../utils/element-utils.js';
import { isCCOn, toggleSubsCaps } from '../utils/captions.js';

class MediaCaptionsMenuButton extends MediaChromeMenuButton {
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

if (!window.customElements.get('media-captions-menu-button')) {
  window.customElements.define('media-captions-menu-button', MediaCaptionsMenuButton);
}

export default MediaCaptionsMenuButton;
