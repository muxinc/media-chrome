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

  #closeContextMenu(): void {
    this.#isContextMenuOpen = false;
    this.#updateVisibility();
    // Restore scrolling
    document.body.style.overflow = '';
  }

  #closeOtherContextMenus(): void {
    // Find all media-context-menu elements in the document
    const allContextMenus = document.querySelectorAll('media-context-menu');
    allContextMenus.forEach(menu => {
      if (menu !== this) {
        (menu as any).#closeContextMenu();
      }
    });
  }

  #isVideoContainer(element: HTMLElement | null): boolean {
    if (!element) return false;
    
    // Check if the element contains a video
    const hasVideoChild = element.querySelector('video') !== null;
    if (hasVideoChild) return true;
    
    // Check if it has a slot="media" attribute
    if (element.hasAttribute('slot') && element.getAttribute('slot') === 'media') {
      return true;
    }
    
    // Check if it's a custom element
    if (element.nodeName.includes('-') && element.tagName.includes('-')) {
      // Check if it has video-related attributes or contains video
      const hasVideoAttributes = element.hasAttribute('src') || 
                                element.hasAttribute('poster') || 
                                element.hasAttribute('preload') ||
                                element.hasAttribute('playsinline');
      return hasVideoAttributes || hasVideoChild;
    }
    
    return false;
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
    const isVideoElement = target?.nodeName === 'VIDEO';
    const isVideoContainer = this.#isVideoContainer(target);
    
      if (isVideoElement || isVideoContainer) {
        if (!this.#isContextMenuOpen) {
          this.#onContextMenu(event);
        } else {
          this.#closeContextMenu();
        }
      }
  };

  #onContextMenu(event: MouseEvent): void {
    event.preventDefault();
    this.#closeOtherContextMenus();
    this.#isContextMenuOpen = true;

    this.style.position = 'fixed';
    this.style.left = `${event.clientX}px`;
    this.style.top = `${event.clientY}px`;
    this.#updateVisibility();

    // Prevent scrolling when context menu is open
    document.body.style.overflow = 'hidden';

    document.addEventListener('mousedown', this.#onDocumentClick, {
      once: true,
    });
    document.addEventListener('keydown', this.#onKeyDown, { once: true });
  }

  #onDocumentClick = (event: MouseEvent): void => {
    const target = event.target as HTMLElement;
    const isRightClick = event.button === 2;
    const isVideo = target?.nodeName === 'VIDEO';
    const isVideoContainer = this.#isVideoContainer(target);
    const isInsideMenu = this.contains(target);

    if (!isInsideMenu && !(isRightClick && (isVideo || isVideoContainer))) {
      this.#closeContextMenu();
    }
  };

  #onKeyDown = (event: KeyboardEvent): void => {
    if (event.key === 'Escape') {
      this.#closeContextMenu();
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
    
    this.#closeContextMenu();
  };
}

if (!globalThis.customElements.get('media-context-menu')) {
  globalThis.customElements.define('media-context-menu', MediaContextMenu);
}

export { MediaContextMenu };
export default MediaContextMenu;
