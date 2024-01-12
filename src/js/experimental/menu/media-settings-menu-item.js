import { globalThis } from '../../utils/server-safe-globals.js';
import { MediaChromeMenuItem } from './media-chrome-menu-item.js';

const template = document.createElement('template');
template.innerHTML = MediaChromeMenuItem.template.innerHTML + /*html*/`
  <style>
    :host {
      padding: 0;
      max-height: 100%;
      flex-direction: column;
      align-items: stretch;
    }

    slot:not([name]):not(.empty) {
      display: block;
      padding: .3em .7em;
    }

    :host(:hover) slot:not([name]):not(.empty) {
      cursor: pointer;
      background: var(--media-menu-item-hover-background, rgb(82 82 122 / .8));
      outline: var(--media-menu-item-hover-outline);
      outline-offset: var(--media-menu-item-hover-outline-offset,  var(--media-menu-item-outline-offset, -1px));
    }

    ::slotted(*) {
      background: none;
    }

    :host(:hover) {
      background: none;
    }
  </style>
`;

/**
 */
class MediaSettingsMenuItem extends MediaChromeMenuItem {
  static template = template;


}

if (!globalThis.customElements.get('media-settings-menu-item')) {
  globalThis.customElements.define('media-settings-menu-item', MediaSettingsMenuItem);
}

export { MediaSettingsMenuItem };
export default MediaSettingsMenuItem;
