import { globalThis, document } from '../utils/server-safe-globals.js';
import { MediaChromeMenu } from './media-chrome-menu.js';
import { getMediaController } from '../utils/element-utils.js';

const template: HTMLTemplateElement = document.createElement('template');
// prettier-ignore
template.innerHTML = MediaChromeMenu.template.innerHTML + /*html*/`
  <style>
    :host {
      background: var(--media-settings-menu-background,
        var(--media-menu-background,
        var(--media-control-background,
        var(--media-secondary-color, rgb(20 20 30 / .8)))));
      min-width: var(--media-settings-menu-min-width, 170px);
      border-radius: 2px 2px 0 0;
      overflow: hidden;
    }

    :host([role="menu"]) {
      ${/* Bottom fix setting menu items for animation when the height expands. */ ''}
      justify-content: end;
    }

    slot:not([name]) {
      justify-content: var(--media-settings-menu-justify-content);
      flex-direction: var(--media-settings-menu-flex-direction, column);
      overflow: visible;
    }

    #container.has-expanded {
      --media-settings-menu-item-opacity: 0;
    }
  </style>
`;

/**
 * @extends {MediaChromeMenu}
 *
 * @cssproperty --media-settings-menu-justify-content - `justify-content` of the menu.
 */
class MediaSettingsMenu extends MediaChromeMenu {
  static template = template;

  /**
   * Returns the anchor element when it is a floating menu.
   */
  get anchorElement() {
    if (this.anchor !== 'auto') return super.anchorElement;
    return getMediaController(this).querySelector<HTMLElement>('media-settings-menu-button');
  }
}

if (!globalThis.customElements.get('media-settings-menu')) {
  globalThis.customElements.define('media-settings-menu', MediaSettingsMenu);
}

export { MediaSettingsMenu };
export default MediaSettingsMenu;
