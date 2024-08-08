import { globalThis, document } from '../utils/server-safe-globals.js';
import { MediaChromeMenuItem } from './media-chrome-menu-item.js';

const template: HTMLTemplateElement = document.createElement('template');
template.innerHTML =
  MediaChromeMenuItem.template.innerHTML +
  /*html*/ `
  <style>
    slot:not([name="submenu"]) {
      opacity: var(--media-settings-menu-item-opacity, var(--media-menu-item-opacity));
    }

    :host([aria-expanded="true"]:hover) {
      background: transparent;
    }
  </style>
`;

if (template.content?.querySelector) {
  template.content.querySelector('slot[name="suffix"]').innerHTML = /*html*/ `
    <svg aria-hidden="true" viewBox="0 0 20 24">
      <path d="m8.12 17.585-.742-.669 4.2-4.665-4.2-4.666.743-.669 4.803 5.335-4.803 5.334Z"/>
    </svg>
  `;
}

class MediaSettingsMenuItem extends MediaChromeMenuItem {
  static template = template;
}

if (!globalThis.customElements.get('media-settings-menu-item')) {
  globalThis.customElements.define(
    'media-settings-menu-item',
    MediaSettingsMenuItem
  );
}

export { MediaSettingsMenuItem };
export default MediaSettingsMenuItem;
