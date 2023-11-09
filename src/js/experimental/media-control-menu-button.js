import { MediaChromeButton } from '../media-chrome-button.js';
import { globalThis, document } from '../utils/server-safe-globals.js';
import { closestComposedNode } from '../utils/element-utils.js';
import { MediaStateReceiverAttributes } from '../constants.js';

/** @typedef {import('./media-control-menu.js').MediaControlMenu} MediaControlMenu */

const slotTemplate = document.createElement('template');
slotTemplate.innerHTML = /*html*/`
  <slot name="icon">
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <path d="M4.5 14.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Zm7.5 0a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Zm7.5 0a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z"/>
    </svg>
  </slot>
`;

/**
 * @attr {string} target - CSS id selector for the element to be targeted by the button.
 */
class MediaControlMenuButton extends MediaChromeButton {
  static get observedAttributes() {
    return [
      ...super.observedAttributes,
      'target',
    ];
  }

  constructor() {
    super({ slotTemplate });
  }

  connectedCallback() {
    super.connectedCallback();
    this.setAttribute('aria-haspopup', 'menu');
  }

  get target() {
    return this.getAttribute('target')
  }

  set target(value) {
    this.setAttribute('target', value);
  }

  handleClick() {
    const container = getMediaControllerElement(this)
      ?? /** @type {ShadowRoot|Document} */ (this.getRootNode());

    const target = /** @type {MediaControlMenu} */ (/** @type {unknown} */ (
      container.querySelector(this.target ? `#${this.target}` : 'media-control-menu')
    ));

    const hidden = this.getAttribute('aria-expanded') === 'true';
    this.setAttribute('aria-expanded', `${!hidden}`);
    target.hidden = hidden;
  }
}

function getMediaControllerElement(host) {
  const mediaControllerId = host.getAttribute(
    MediaStateReceiverAttributes.MEDIA_CONTROLLER
  );
  if (mediaControllerId) {
    return host.getRootNode()?.getElementById(mediaControllerId);
  }
  return closestComposedNode(host, 'media-controller');
}

if (!globalThis.customElements.get('media-control-menu-button')) {
  globalThis.customElements.define('media-control-menu-button', MediaControlMenuButton);
}

export { MediaControlMenuButton };
export default MediaControlMenuButton;
