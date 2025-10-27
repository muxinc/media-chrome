import { globalThis } from '../utils/server-safe-globals.js';
import { MediaChromeMenu } from './media-chrome-menu.js';
import { getMediaController } from '../utils/element-utils.js';

function getTemplateHTML(_attrs: Record<string, string>) {
  return /*html*/ `
    ${MediaChromeMenu.getTemplateHTML(_attrs)}
    <style>
      :host {
        --_menu-bg: rgb(20 20 30 / .8);
        background: var(--media-settings-menu-background,
            var(--media-menu-background,
              var(--media-control-background,
                var(--media-secondary-color, var(--_menu-bg)))));
        min-width: var(--media-settings-menu-min-width, 170px);
        border-radius: 2px 2px 0 0;
        overflow: hidden;
      }

      @-moz-document url-prefix() {
        :host{
          --_menu-bg: rgb(20 20 30);
        }
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
}

/**
 * @extends {MediaChromeMenu}
 *
 * @cssproperty --media-settings-menu-justify-content - `justify-content` of the menu.
 * @cssproperty --media-settings-menu-background - `background` of settings menu.
 * @cssproperty --media-settings-menu-flex-direction - `flex-direction` of settings menu.
 * @cssproperty --media-settings-menu-min-width - `min-width` of settings menu.
 */
class MediaSettingsMenu extends MediaChromeMenu {
  static getTemplateHTML = getTemplateHTML;

  /**
   * Returns the anchor element when it is a floating menu.
   */
  get anchorElement() {
    if (this.anchor !== 'auto') return super.anchorElement;
    return getMediaController(this).querySelector<HTMLElement>(
      'media-settings-menu-button'
    );
  }
}

if (!globalThis.customElements.get('media-settings-menu')) {
  globalThis.customElements.define('media-settings-menu', MediaSettingsMenu);
}

export { MediaSettingsMenu };
export default MediaSettingsMenu;
