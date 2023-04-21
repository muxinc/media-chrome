import { MediaStateReceiverAttributes } from '../constants.js';
import { window, document } from '../utils/server-safe-globals.js';

const template = document.createElement('template');

template.innerHTML = /*html*/`
<style>
  :host {
    display: list-item;
    line-height: 1em;
    padding: 0.5em;
    margin: 0em;
    cursor: pointer;
  }

  ::slotted:not(:focus-visible) {
    outline: none;
  }
</style>
<li>
  <slot></slot>
</li>
`;

export const Attributes = {
  VALUE: 'value',
};

class MediaChromeListitem extends window.HTMLElement {
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

      const listitemHTML = template.content.cloneNode(true);
      this.nativeEl = listitemHTML;

      shadow.appendChild(listitemHTML);
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

if (!window.customElements.get('media-chrome-listitem')) {
  window.customElements.define('media-chrome-listitem', MediaChromeListitem);
}

export default MediaChromeListitem;
