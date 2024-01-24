import { globalThis } from '../../utils/server-safe-globals.js';
import { MediaChromeMenu } from './media-chrome-menu.js';
import { getMediaController } from '../../utils/element-utils.js';

const template = document.createElement('template');
// prettier-ignore
template.innerHTML = MediaChromeMenu.template.innerHTML + /*html*/`
  <style>
    :host {
      ${/* Bottom fix setting menu items for animation when the height expands. */ ''}
      justify-content: var(--media-settings-menu-justify-content, flex-end);
      border-radius: 2px 2px 0 0;
      overflow: hidden;
    }

    slot:not([name]) {
      overflow: visible;
    }

    #container.has-expanded {
      --media-settings-menu-item-opacity: 0;
    }
  </style>
`;

/**
 * @cssproperty --media-settings-menu-justify-content - `justify-content` of the menu.
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
