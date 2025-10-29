import { globalThis } from '../utils/server-safe-globals.js';
import { MediaChromeMenuItem } from './media-chrome-menu-item.js';

function getTemplateHTML(_attrs: Record<string, string>) {
  return /*html*/ `
    ${MediaChromeMenuItem.getTemplateHTML.call(this, _attrs)}
    <style>
      slot:not([name="submenu"]) {
        opacity: var(--media-settings-menu-item-opacity, var(--media-menu-item-opacity));
      }

      :host([aria-expanded="true"]:hover) {
        background: transparent;
      }
    </style>
  `;
}

function getSuffixSlotInnerHTML(_attrs: Record<string, string>) {
  return /*html*/ `
    <svg aria-hidden="true" viewBox="0 0 20 24">
      <path d="m8.12 17.585-.742-.669 4.2-4.665-4.2-4.666.743-.669 4.803 5.335-4.803 5.334Z"/>
    </svg>
  `;
}

/**
 * @extends {MediaChromeMenuItem}
 *
 * @cssproperty --media-settings-menu-item-opacity - `opacity` of settings menu item.
 */
class MediaSettingsMenuItem extends MediaChromeMenuItem {
  static shadowRootOptions = { mode: 'open' as ShadowRootMode };
  static getTemplateHTML = getTemplateHTML;
  static getSuffixSlotInnerHTML = getSuffixSlotInnerHTML;
}

if (!globalThis.customElements.get('media-settings-menu-item')) {
  globalThis.customElements.define(
    'media-settings-menu-item',
    MediaSettingsMenuItem
  );
}

export { MediaSettingsMenuItem };
export default MediaSettingsMenuItem;
