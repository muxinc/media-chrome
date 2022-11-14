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
  #keysSoFar = '';
  #clearKeysTimeout = null;

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

      const activeEls = els.some(el => el.getAttribute('tabindex') === '0');

      console.log(els, activeEls);

      // if the user set an element as active, we should use that
      // rather than assume a default
      if (activeEls) {
        return;
      }

      // default to the aria-selected element if there isn't an
      // active element already
      let elToSelect = els.filter(el => el.getAttribute('aria-selected') === 'true')[0];

      // if there isn't an active element or a selected element,
      // default to the first element
      if (!elToSelect) {
        elToSelect = els[0];
      }
      
      elToSelect.setAttribute('tabindex', 0);
    });
  }

  #clickListener = (e) => {
    this.handleClick(e);
  }

  // NOTE: There are definitely some "false positive" cases with multi-key pressing,
  // but this should be good enough for most use cases.
  #keyupListener = (e) => {
    const { key } = e;
    // only cancel on Escape
    if (key === 'Escape') {
      this.removeEventListener('keyup', this.#keyupListener);
      return;
    }

    if (key === 'Enter' || key === ' ') {
      this.handleSelection(e);
    } else {
      this.handleMovement(e);
    }
  }

  #keydownListener = (e) => {
    const { metaKey, altKey, key } = e;
    if (metaKey || altKey) {
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
    return ['Enter', ' ', 'ArrowDown', 'ArrowUp', 'Home', 'End'];
  }

  handleSelection(e) {
    if (e.target === this) return;

    const selected = e.target.getAttribute('aria-selected') === 'true';

    const slot = this.shadowRoot.querySelector('slot');

    if (this.getAttribute('aria-multiselectable') !== 'true') {
      slot.assignedElements().forEach(el => el.removeAttribute('aria-selected'));
    }

    if (selected) {
      e.target.removeAttribute('aria-selected');
    } else {
      e.target.setAttribute('aria-selected', 'true');
    }
  }

  handleMovement(e) {
    const { key } = e;

    let currentOption = e.target;
    if (e.target === this) {
      const slot = this.shadowRoot.querySelector('slot');
      currentOption = slot.assignedElements()
        .filter(el => el.getAttribute('tabindex') === '0')[0];
    }

    let nextOption;
    
    switch (key) {
      case 'ArrowDown':
        nextOption = currentOption.nextElementSibling;
        break;
      case 'ArrowUp':
        nextOption = currentOption.previousElementSibling;
        break;
      case 'Home':
        nextOption = this.shadowRoot.querySelector('slot').assignedElements().shift();
        break;
      case 'End':
        nextOption = this.shadowRoot.querySelector('slot').assignedElements().pop();
        break;
      default:
        nextOption = this.#searchItem(key);
        break;
    }

    if (nextOption) {
      const slot = this.shadowRoot.querySelector('slot');
      slot.assignedElements().forEach(el => el.setAttribute('tabindex', '-1'));
      nextOption.setAttribute('tabindex', '0');
      nextOption.focus();
    }
  }

  handleClick(e) {
    const slot = this.shadowRoot.querySelector('slot');
    if (e.target !== this) {
      slot.assignedElements().forEach(el => el.setAttribute('tabindex', '-1'));
      e.target.setAttribute('tabindex', '0');
    }

    this.handleSelection(e);
  }

  #searchItem(key) {
    this.#keysSoFar += key;

    this.#clearKeysOnDelay();

    const slot = this.shadowRoot.querySelector('slot');
    return slot.assignedElements().filter(el => el.textContent.startsWith(this.#keysSoFar))[0];
  }

  #clearKeysOnDelay() {
    window.clearTimeout(this.#clearKeysTimeout);
    this.#clearKeysTimeout = null;

    this.#clearKeysTimeout = window.setTimeout(() => {
      this.#keysSoFar = '';
      this.#clearKeysTimeout = null;
    }, 500);
  }
}

defineCustomElement('media-chrome-listbox', MediaChromeListbox);

export default MediaChromeListbox;
