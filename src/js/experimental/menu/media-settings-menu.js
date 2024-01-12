import { globalThis } from '../../utils/server-safe-globals.js';
import { getMediaController } from '../../utils/element-utils.js';
import { InvokeEvent } from '../../utils/events.js';
import { MediaChromeMenu } from './media-chrome-menu.js';

/** @typedef {import('./media-chrome-menu-item.js').MediaChromeMenuItem} MediaChromeMenuItem */

const template = document.createElement('template');
template.innerHTML = MediaChromeMenu.template.innerHTML + /*html*/`
  <style>
    #container {
      flex-direction: var(--media-settings-menu-flex-direction, column);
      align-items: var(--media-settings-menu-align-items, flex-start);
      padding-block: 0;
      overflow: hidden;
    }
  </style>
`;

/**
 * @cssproperty --media-settings-menu-flex-direction - `flex-direction` of the container.
 * @cssproperty --media-settings-menu-align-items - `align-items` of the container.
 */
class MediaSettingsMenu extends MediaChromeMenu {
  static template = template;

  constructor() {
    super();
    this.addEventListener('toggle', this);
  }

  handleEvent(event) {
    super.handleEvent(event);

    switch (event.type) {
      case 'toggle':
        this.#handleToggle(event);
        break;
    }
  }

  #handleToggle(event) {
    // Only handle events of submenus.
    if (event.target === this) return;

    /** @type {MediaChromeMenuItem[]} */
    const invokers = Array.from(
      this.querySelectorAll('[role="menuitem"][aria-haspopup]')
    );

    // Close all other open submenus.
    for (const item of invokers) {
      if (item.invokeTargetElement == event.target) continue;

      if (
        event.newState == 'open' &&
        item.getAttribute('aria-expanded') == 'true' &&
        !item.invokeTargetElement.hidden
      ) {
        item.invokeTargetElement.dispatchEvent(
          new InvokeEvent({ relatedTarget: item })
        );
      }
    }
  }

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
