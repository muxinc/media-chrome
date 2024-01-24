import { globalThis } from '../../utils/server-safe-globals.js';
import { MediaChromeMenu } from './media-chrome-menu.js';
import { getMediaController } from '../../utils/element-utils.js';

/** @typedef {import('./media-chrome-menu-item.js').MediaChromeMenuItem} MediaChromeMenuItem */

const template = document.createElement('template');
// prettier-ignore
template.innerHTML = MediaChromeMenu.template.innerHTML + /*html*/`
  <style>
    :host {
      display: var(--media-settings-menu-display, inline-grid);
      overflow: hidden;
      border-radius: 2px 2px 0 0;
    }

    slot:not([name]) {
      justify-content: var(--media-settings-menu-justify-content, flex-end);
      overflow: visible;
    }

    #container.has-expanded {
      --media-settings-menu-item-opacity: 0;
    }
  </style>
`;

/**
 * @cssproperty --media-settings-menu-flex-direction - `flex-direction` of the container.
 * @cssproperty --media-settings-menu-align-items - `align-items` of the container.
 */
class MediaSettingsMenu extends MediaChromeMenu {
  static template = template;

  /**
   * Returns the anchor element when it is a floating menu.
   * @return {HTMLElement}
   */
  get anchorElement() {
    if (this.anchor != undefined) return super.anchorElement;
    return getMediaController(this).querySelector('media-settings-menu-button');
  }
}

if (!globalThis.customElements.get('media-settings-menu')) {
  globalThis.customElements.define('media-settings-menu', MediaSettingsMenu);
}

export { MediaSettingsMenu };
export default MediaSettingsMenu;
