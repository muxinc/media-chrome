import { MediaChromeMenu } from './media-chrome-menu.js';

class MediaContextMenu extends MediaChromeMenu {
  #showNativeMenu: boolean = false;
  #controllers: Element[] = [];

  constructor() {
    super();
    this.hidden = true;
  }

  connectedCallback(): void {
    super.connectedCallback();
    this.#addVideoListeners();
    this.addEventListener('click', this.#onMenuClick);
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this.#removeVideoListeners();
    this.removeEventListener('click', this.#onMenuClick);
    document.removeEventListener('mousedown', this.#onDocumentClick);
    document.removeEventListener('keydown', this.#onKeyDown);
  }

  #addVideoListeners(): void {
    this.#removeVideoListeners();
    this.#controllers = Array.from(
      document.querySelectorAll('media-controller')
    );
    this.#controllers.forEach((controller) => {
      controller.addEventListener('contextmenu', this.#onControllerContextMenu);
    });
  }

  #removeVideoListeners(): void {
    if (this.#controllers) {
      this.#controllers.forEach((controller: Element) => {
        controller.removeEventListener(
          'contextmenu',
          this.#onControllerContextMenu
        );
      });
    }
    this.#controllers = [];
  }

  #onControllerContextMenu = (event: Event): void => {
    const target = event.target as HTMLElement;
    if (target?.nodeName === 'VIDEO') {
      if (this.#showNativeMenu) {
        this.#showNativeMenu = false;
        this.hidden = true;
        return;
      }
      event.preventDefault();
      this.#onContextMenu(event as MouseEvent);
    }
  };

  #onContextMenu(event: MouseEvent): void {
    this.style.position = 'fixed';
    this.style.left = `${event.clientX}px`;
    this.style.top = `${event.clientY}px`;
    this.hidden = false;
    this.#showNativeMenu = true;
    setTimeout(() => {
      document.addEventListener('mousedown', this.#onDocumentClick, {
        once: true,
      });
      document.addEventListener('keydown', this.#onKeyDown, { once: true });
    }, 0);
  }

  #onDocumentClick = (event: MouseEvent): void => {
    if (!this.contains(event.target as Node)) {
      this.hidden = true;
      this.#showNativeMenu = false;
    }
  };

  #onKeyDown = (event: KeyboardEvent): void => {
    if (event.key === 'Escape') {
      this.hidden = true;
      this.#showNativeMenu = false;
    }
  };

  #onMenuClick = (event: MouseEvent): void => {
    const target = event.target as HTMLElement;
    if (target.matches?.('button[invoke="copy"]')) {
      const input = target.closest('media-context-menu-item')?.querySelector('input[slot="copy"]') as HTMLInputElement | null;
      input && navigator.clipboard.writeText(input.value);
      event.stopPropagation();
    }
  };
}

if (!globalThis.customElements.get('media-context-menu')) {
  globalThis.customElements.define('media-context-menu', MediaContextMenu);
}

export { MediaContextMenu };
export default MediaContextMenu;
