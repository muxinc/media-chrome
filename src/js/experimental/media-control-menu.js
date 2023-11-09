import { globalThis, document } from '../utils/server-safe-globals.js';
import { getActiveElement, containsComposedNode } from '../utils/element-utils.js';

const template = document.createElement('template');
template.innerHTML = /*html*/`
  <style>
    :host {
      --media-button-justify-content: start;
      --media-button-padding: 10px;
      --media-listbox-display: flex;
      --media-selectmenu-listbox-position: static;
      --media-selectmenu-listbox-hidden-opacity: 1;
      --media-selectmenu-listbox-hidden-max-height: 0;
      --media-selectmenu-transform-in: none;
      --media-selectmenu-transform-out: none;
      --media-selectmenu-transition-in: visibility 0s, max-height .2s ease-in-out;
      --media-selectmenu-transition-out: visibility .2s ease-in-out, max-height .2s ease-in-out;

      position: relative;
      align-self: end;
      line-height: 0;
      min-width: 110px;
      height: 100%;
      overflow: hidden;
      flex-direction: var(--media-control-menu-flex-direction, column);
      justify-content: end;
      pointer-events: none !important;
    }

    :host(:not([hidden])) {
      display: flex;
    }

    ::slotted(*) {
      pointer-events: all;
      flex-direction: column;
      overflow: hidden;
      transition: max-height 0s .15s ease-out;
      max-height: 100%;
    }

    slot.has-expanded::slotted(:not([aria-expanded=true])) {
      transition: max-height 0s;
      max-height: 0;
    }
  </style>
  <slot></slot>
`;

class MediaControlMenu extends globalThis.HTMLElement {
  static observedAttributes = ['hidden'];

  #slot;
  #previouslyFocused;

  constructor() {
    super();

    if (!this.shadowRoot) {
      // Set up the Shadow DOM if not using Declarative Shadow DOM.
      this.attachShadow({ mode: 'open' });
      this.shadowRoot.appendChild(template.content.cloneNode(true));
    }

    this.#slot = this.shadowRoot.querySelector('slot');

    this.addEventListener('beforetoggle', this);
    this.addEventListener('focusout', this);
  }

  handleEvent(event) {
    switch (event.type) {
      case 'focusout':
        if (!containsComposedNode(this, event.relatedTarget)) {
          this.#previouslyFocused.focus();
        }
        break;
      case 'beforetoggle':
        this.#handleBeforeToggle(event);
        break;
    }
  }

  #handleBeforeToggle(event) {
    this.#slot.classList.toggle('has-expanded', event.newState === 'open');
  }

  connectedCallback() {
    if (!this.hasAttribute('role')) {
      this.setAttribute('role', 'menu');
    }
  }

  attributeChangedCallback(attrName) {
    if (attrName === 'hidden') {
      if (!this.hidden) {
        this.focus();
      }
    }
  }

  focus() {
    this.#previouslyFocused = getActiveElement();

    const focusable = this.querySelectorAll('button, [href], input, select, [tabindex]:not([tabindex="-1"])');
    focusable?.[0]?.focus();
  }
}

if (!globalThis.customElements.get('media-control-menu')) {
  globalThis.customElements.define('media-control-menu', MediaControlMenu);
}

export { MediaControlMenu };
export default MediaControlMenu;
