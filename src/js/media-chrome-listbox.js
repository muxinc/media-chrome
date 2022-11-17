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
</style>
<ul tabindex="0" role="listbox">
  <slot></slot>
</ul>
`;

class MediaChromeListbox extends window.HTMLElement {
  #keysSoFar = '';
  #clearKeysTimeout = null;
  #slot;
  #assignedElements;

  static get observedAttributes() {
    return ['disabled', MediaUIAttributes.MEDIA_CONTROLLER];
  }

  constructor(options = {}) {
    super();

    const shadow = this.attachShadow({ mode: 'open' });

    const listboxHTML = template.content.cloneNode(true);
    this.nativeEl = listboxHTML;

    shadow.appendChild(listboxHTML);

    this.#slot = this.shadowRoot.querySelector('slot');

    this.#slot.addEventListener('slotchange', () => {
      this.#assignedElements = this.#slot.assignedElements();
      const els = this.#items;
      const activeEls = els.some(el => el.getAttribute('tabindex') === '0');

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

  get #items() {
    return this.#assignedElements.filter(el => !el.hasAttribute('disabled'));
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
  }

  disable() {
    this.removeEventListener('click', this.#clickListener);
    this.removeEventListener('keyup', this.#keyupListener);
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

  #getItem(e) {
    if (e.target === this) return;

    const composedPath = e.composedPath();
    const slotIndex = composedPath.findIndex(el => el.nodeName === 'SLOT');

    return composedPath[slotIndex - 1];
  }

  handleSelection(e) {
    const item = this.#getItem(e);

    if (!item) return;

    const selected = item.getAttribute('aria-selected') === 'true';

    if (this.getAttribute('aria-multiselectable') !== 'true') {
      this.#assignedElements.forEach(el => el.setAttribute('aria-selected', 'false'));
    }

    if (selected) {
      item.setAttribute('aria-selected', 'false');
    } else {
      item.setAttribute('aria-selected', 'true');
    }
  }

  handleMovement(e) {
    const { key } = e;
    const els = this.#items;

    let currentOption = this.#getItem(e);
    if (!currentOption) {
      currentOption = els.filter(el => el.getAttribute('tabindex') === '0')[0];
    }

    let nextOption;
    
    switch (key) {
      case 'ArrowDown':
        nextOption = currentOption.nextElementSibling;

        if (nextOption.hasAttribute('disabled')) {
          nextOption = nextOption.nextElementSibling;
        }

        break;
      case 'ArrowUp':
        nextOption = currentOption.previousElementSibling;

        if (nextOption.hasAttribute('disabled')) {
          nextOption = nextOption.previousElementSibling;
        }

        break;
      case 'Home':
        nextOption = els[0];
        break;
      case 'End':
        nextOption = els[els.length - 1];
        break;
      default:
        nextOption = this.#searchItem(key);
        break;
    }

    if (nextOption) {
      els.forEach(el => el.setAttribute('tabindex', '-1'));
      nextOption.setAttribute('tabindex', '0');
      nextOption.focus();
    }
  }

  handleClick(e) {
    const item = this.#getItem(e);

    if (!item) return;

    els.forEach(el => el.setAttribute('tabindex', '-1'));
    item.setAttribute('tabindex', '0');

    this.handleSelection(e);
  }

  #searchItem(key) {
    this.#keysSoFar += key;

    this.#clearKeysOnDelay();

    const els = this.#items;
    const activeIndex = els.findIndex(el => el.getAttribute('tabindex') === '0');

    const after = els.slice(activeIndex).filter(el => el.textContent.startsWith(this.#keysSoFar));
    const before = els.slice(0, activeIndex - 1).filter(el => el.textContent.startsWith(this.#keysSoFar));

    return [...after, ...before][0];
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
