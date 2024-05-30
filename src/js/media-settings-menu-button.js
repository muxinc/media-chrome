import { MediaChromeMenuButton } from './media-chrome-menu-button.js';
import { globalThis, document } from './utils/server-safe-globals.js';
import { getMediaController } from './utils/element-utils.js';
import { nouns } from './labels/labels.js';

const slotTemplate = document.createElement('template');
slotTemplate.innerHTML = /*html*/ `
  <slot name="icon">
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <path d="M4.5 14.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Zm7.5 0a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Zm7.5 0a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z"/>
    </svg>
  </slot>
`;

/**
 * @attr {string} target - CSS id selector for the element to be targeted by the button.
 */
class MediaSettingsMenuButton extends MediaChromeMenuButton {
  static get observedAttributes() {
    return [...super.observedAttributes, 'target'];
  }

  constructor() {
    super({ slotTemplate });
  }

  connectedCallback() {
    super.connectedCallback();
    this.setAttribute('aria-label', nouns.SETTINGS());
  }

  /**
   * Returns the element with the id specified by the `invoketarget` attribute.
   * @return {HTMLElement | null}
   */
  get invokeTargetElement() {
    if (this.invokeTarget != undefined) return super.invokeTargetElement;
    return getMediaController(this).querySelector('media-settings-menu');
  }
}

if (!globalThis.customElements.get('media-settings-menu-button')) {
  globalThis.customElements.define(
    'media-settings-menu-button',
    MediaSettingsMenuButton
  );
}

export { MediaSettingsMenuButton };
export default MediaSettingsMenuButton;
