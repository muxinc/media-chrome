import { MediaChromeButton } from '../media-chrome-button.js';
import { globalThis } from '../utils/server-safe-globals.js';
import { InvokeEvent } from '../utils/events.js';
import { getDocumentOrShadowRoot } from '../utils/element-utils.js';

/**
 * @attr {string} invoketarget - The id of the element to invoke when clicked.
 */
class MediaChromeMenuButton extends MediaChromeButton {
  connectedCallback(): void {
    super.connectedCallback();

    if (this.invokeTargetElement) {
      this.setAttribute('aria-haspopup', 'menu');
    }
  }

  get invokeTarget(): string | null {
    return this.getAttribute('invoketarget');
  }

  set invokeTarget(value: string | null) {
    this.setAttribute('invoketarget', `${value}`);
  }

  /**
   * Returns the element with the id specified by the `invoketarget` attribute.
   * @return {HTMLElement | null}
   */
  get invokeTargetElement(): HTMLElement | null {
    if (this.invokeTarget) {
      return getDocumentOrShadowRoot(this)?.querySelector(
        `#${this.invokeTarget}`
      ) as HTMLElement | null;
    }
    return null;
  }

  handleClick() {
    this.invokeTargetElement?.dispatchEvent(
      new InvokeEvent({ relatedTarget: this })
    );
  }
}

if (!globalThis.customElements.get('media-chrome-menu-button')) {
  globalThis.customElements.define(
    'media-chrome-menu-button',
    MediaChromeMenuButton
  );
}

export { MediaChromeMenuButton };
export default MediaChromeMenuButton;
