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
      </style>
    `;
}

class MediaContextMenu extends MediaChromeMenu {
  static getTemplateHTML = getTemplateHTML;
  #isContextMenuOpen: boolean = false;

  constructor() {
    super();
    this.#updateVisibility();
  }

  #updateVisibility() {
    this.hidden = !this.#isContextMenuOpen;
  }

  connectedCallback(): void {
    super.connectedCallback();
    getMediaController(this).addEventListener(
      'contextmenu',
      this.#onControllerContextMenu
    );
    this.addEventListener('click', this.#onMenuClick);
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    getMediaController(this).removeEventListener(
      'contextmenu',
      this.#onControllerContextMenu
    );
    this.removeEventListener('click', this.#onMenuClick);
    document.removeEventListener('mousedown', this.#onDocumentClick);
    document.removeEventListener('keydown', this.#onKeyDown);
  }

  #onControllerContextMenu = (event: MouseEvent): void => {
    const target = event.target as HTMLElement;
    if (target?.nodeName === 'VIDEO') {
      if (!this.#isContextMenuOpen) {
        this.#onContextMenu(event);
      } else {
        this.#isContextMenuOpen = false;
        this.#updateVisibility();
      }
    }
  };

  #onContextMenu(event: MouseEvent): void {
    event.preventDefault();
    this.#isContextMenuOpen = true;

    this.style.position = 'fixed';
    this.style.left = `${event.clientX}px`;
    this.style.top = `${event.clientY}px`;
    this.#updateVisibility();

    document.addEventListener('mousedown', this.#onDocumentClick, {
      once: true,
    });
    document.addEventListener('keydown', this.#onKeyDown, { once: true });
  }

  #onDocumentClick = (event: MouseEvent): void => {
    const target = event.target as HTMLElement;
    const isRightClick = event.button === 2;
    const isVideo = target?.nodeName === 'VIDEO';
    const isInsideMenu = this.contains(target);

    if (!isInsideMenu && !(isRightClick && isVideo)) {
      this.#isContextMenuOpen = false;
      this.#updateVisibility();
    }
  };

  #onKeyDown = (event: KeyboardEvent): void => {
    if (event.key === 'Escape') {
      this.#isContextMenuOpen = false;
      this.#updateVisibility();
    }
  };

  #onMenuClick = (event: MouseEvent): void => {
    const target = event.target as HTMLElement;

    if (target.matches?.('button[invoke="copy"]')) {
      const input = target
        .closest('media-context-menu-item')
        ?.querySelector('input[slot="copy"]') as HTMLInputElement | null;
      input && navigator.clipboard.writeText(input.value);
    }
    
    this.#isContextMenuOpen = false;
    this.#updateVisibility();
  };
}

if (!globalThis.customElements.get('media-context-menu')) {
  globalThis.customElements.define('media-context-menu', MediaContextMenu);
}

export { MediaContextMenu };
export default MediaContextMenu;
