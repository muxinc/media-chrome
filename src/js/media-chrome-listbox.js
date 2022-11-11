import { MediaUIAttributes } from './constants.js';
import { defineCustomElement } from './utils/defineCustomElement.js';
import {
  Window as window,
  Document as document,
} from './utils/server-safe-globals.js';

const template = document.createElement('template');

template.innerHTML = `
<style>
  :host ul {
    list-style: none;
  }
  ::slotted([tabindex="0"]) {
    background-color: lightgrey;
  }
</style>
<ul tabindex="0" role="listbox">
  <slot></slot>
</ul>
`;

class MediaChromeListbox extends window.HTMLElement {
  static get observedAttributes() {
    return ['disabled', MediaUIAttributes.MEDIA_CONTROLLER];
  }

  constructor(options = {}) {
    super();

    const shadow = this.attachShadow({ mode: 'open' });

    const listboxHTML = template.content.cloneNode(true);
    this.nativeEl = listboxHTML;

    shadow.appendChild(listboxHTML);

    const slot = this.shadowRoot.querySelector('slot');

    slot.addEventListener('slotchange', () => {
      const els = slot.assignedElements();
      els[0].setAttribute('tabindex', 0);
      console.log(slot.assignedElements());
    });
  }

  #clickListener = (e) => {
    this.handleClick(e);
  }

  // NOTE: There are definitely some "false positive" cases with multi-key pressing,
  // but this should be good enough for most use cases.
  #keyupListener = (e) => {
    const { key } = e;
    console.log(key);
    if (!this.keysUsed.includes(key)) {
      this.removeEventListener('keyup', this.#keyupListener);
      return;
    }

    this.handleKeyUp(e);
  }

  #keydownListener = (e) => {
    const { metaKey, altKey, key } = e;
    if (metaKey || altKey || !this.keysUsed.includes(key)) {
      this.removeEventListener('keyup', this.#keyupListener);
      return;
    }
    this.addEventListener('keyup', this.#keyupListener, {once: true});
  }

  enable() {
    this.addEventListener('click', this.#clickListener);
    this.addEventListener('keydown', this.#keydownListener);
    this.setAttribute('tabindex', 0);
  }

  disable() {
    this.removeEventListener('click', this.#clickListener);
    this.removeEventListener('keyup', this.#keyupListener);
    this.removeAttribute('tabindex');
  }

  attributeChangedCallback(attrName, oldValue, newValue) {
    if (attrName === MediaUIAttributes.MEDIA_CONTROLLER) {
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

    this.setAttribute('role', 'listbox');

    const mediaControllerId = this.getAttribute(
      MediaUIAttributes.MEDIA_CONTROLLER
    );
    if (mediaControllerId) {
      const mediaControllerEl = document.getElementById(mediaControllerId);
      mediaControllerEl?.associateElement?.(this);
    }
  }

  disconnectedCallback() {
    this.disable();

    const mediaControllerId = this.getAttribute(
      MediaUIAttributes.MEDIA_CONTROLLER
    );
    if (mediaControllerId) {
      const mediaControllerEl = document.getElementById(mediaControllerId);
      mediaControllerEl?.unassociateElement?.(this);
    }
  }

  get keysUsed() {
    return ['Enter', ' ', 'ArrowDown', 'ArrowUp'];
  }

  handleKeyUp(e) {
    const { key } = e;
    console.log(e.target);

    let currentOption = e.target;
    if (e.target === this) {
      const slot = this.shadowRoot.querySelector('slot');
      currentOption = slot.assignedElements()
        .filter(el => el.getAttribute('tabindex') === '0')[0];
    }

    let nextOption;

    if (key === 'ArrowDown') nextOption = currentOption.nextElementSibling;
    if (key === 'ArrowUp') nextOption = currentOption.previousElementSibling;

    if (nextOption) {
      const slot = this.shadowRoot.querySelector('slot');
      slot.assignedElements().forEach(el => el.setAttribute('tabindex', '-1'));
      nextOption.setAttribute('tabindex', '0');
      nextOption.focus();
    }
  }

  handleClick(e) {
    console.log('click', e.target);

    const slot = this.shadowRoot.querySelector('slot');
    if (e.target !== this) {
      slot.assignedElements().forEach(el => el.setAttribute('tabindex', '-1'));
      e.target.setAttribute('tabindex', '0');
    }
  }
}

defineCustomElement('media-chrome-listbox', MediaChromeListbox);

export default MediaChromeListbox;
