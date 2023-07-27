import { MediaStateReceiverAttributes } from '../constants.js';
import { globalThis, document } from '../utils/server-safe-globals.js';

const template = document.createElement('template');

template.innerHTML = /*html*/`
<style>
  :host {
    cursor: pointer;
    display: block;
    line-height: revert;
    white-space: nowrap;
    white-space-collapse: collapse;
    text-wrap: nowrap;
    min-height: 1.2em;
    padding: .4em .5em;
  }

  :host(:focus-visible) {
    box-shadow: inset 0 0 0 2px rgb(27 127 204 / .9);
    outline: 0;
  }

  :host(:hover) {
    cursor: pointer;
    background: var(--media-option-hover-background, rgb(82 82 122 / .8));
    outline: var(--media-option-hover-outline, none);
  }

  :host([aria-selected="true"]) {
    background: var(--media-option-selected-background);
  }

  :host([disabled]) {
    pointer-events: none;
    color: rgba(255, 255, 255, .3);
  }
</style>
<slot></slot>
`;

export const Attributes = {
  VALUE: 'value',
};

/**
 * @slot - Default slotted elements.
 *
 * @attr {boolean} disabled - The Boolean disabled attribute makes the element not mutable or focusable.
 * @attr {string} mediacontroller - The element `id` of the media controller to connect to (if not nested within).
 *
 * @cssproperty --media-option-selected-background - `background` of selected listbox item.
 * @cssproperty --media-option-hover-background - `background` of hovered listbox item.
 * @cssproperty --media-option-hover-outline - `outline` of hovered listbox item.
 */
class MediaChromeOption extends globalThis.HTMLElement {
  static get observedAttributes() {
    return [
      'disabled',
      'aria-selected',
      Attributes.VALUE,
      MediaStateReceiverAttributes.MEDIA_CONTROLLER,
    ];
  }

  constructor() {
    super();

    if (!this.shadowRoot) {
      // Set up the Shadow DOM if not using Declarative Shadow DOM.
      const shadow = this.attachShadow({ mode: 'open' });

      const optionHTML = template.content.cloneNode(true);
      this.nativeEl = optionHTML;

      shadow.appendChild(optionHTML);
    }
  }

  set value(value) {
    this.setAttribute(Attributes.VALUE, value);
  }

  get value() {
    return this.getAttribute(Attributes.VALUE);
  }

  enable() {
    if (!this.hasAttribute('tabindex')) {
      this.setAttribute('tabindex', -1);
    }
    if (!this.hasAttribute('aria-selected')) {
      this.setAttribute('aria-selected', "false");
    }
  }

  disable() {
    this.removeAttribute('tabindex');
  }

  attributeChangedCallback(attrName, oldValue, newValue) {
    if (attrName === MediaStateReceiverAttributes.MEDIA_CONTROLLER) {
      if (oldValue) {
        const mediaControllerEl = document.getElementById(oldValue);
        mediaControllerEl?.unassociateElement?.(this);
      }
      if (newValue) {
        const mediaControllerEl = document.getElementById(newValue);
        mediaControllerEl?.associateElement?.(this);
      }
    } else if (attrName === 'disabled' && newValue !== oldValue) {
      if (newValue == null) {
        this.enable();
      } else {
        this.disable();
      }
    }
  }

  connectedCallback() {
    if (!this.hasAttribute('disabled')) {
      this.enable();
    }

    this.setAttribute('role', 'option');

    const mediaControllerId = this.getAttribute(
      MediaStateReceiverAttributes.MEDIA_CONTROLLER
    );
    if (mediaControllerId) {
      const mediaControllerEl = document.getElementById(mediaControllerId);
      mediaControllerEl?.associateElement?.(this);
    }
  }

  disconnectedCallback() {
    this.disable();

    const mediaControllerId = this.getAttribute(
      MediaStateReceiverAttributes.MEDIA_CONTROLLER
    );
    if (mediaControllerId) {
      const mediaControllerEl = document.getElementById(mediaControllerId);
      mediaControllerEl?.unassociateElement?.(this);
    }
  }

  handleClick() {}
}

if (!globalThis.customElements.get('media-chrome-option')) {
  globalThis.customElements.define('media-chrome-option', MediaChromeOption);
}

export { MediaChromeOption };
export default MediaChromeOption;
