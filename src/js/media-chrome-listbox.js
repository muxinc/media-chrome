import { MediaStateReceiverAttributes } from './constants.js';
import { window, document } from './utils/server-safe-globals.js';

const template = document.createElement('template');

template.innerHTML = `
<style>
  :host ul {
    list-style: none;
    display: inline-flex;
    flex-direction: column;
    gap: 0.5em;
    margin: 0;
    padding: 0.5em;
    background-color: var(--media-control-background, rgba(10,10,15, .8));
    color: var(--media-text-color, white);
    font-family: Arial, sans-serif;
  }

  ::slotted(media-chrome-listitem[tabindex="0"]:focus-visible) {
    box-shadow: inset 0 0 0 2px rgba(27, 127, 204, 0.9);
    outline: 0;
  }

  ::slotted(media-chrome-listitem[aria-selected="true"]:not(:hover)) {
    background-color: var(--media-listbox-selected-background, rgba(122,122,184, .8));
  }

  ::slotted(media-chrome-listitem:hover) {
    background-color: var(--media-listbox-hover-background, rgba(82,82,122, .8));
  }
</style>
<ul tabindex="0">
  <slot></slot>
</ul>
`;

class MediaChromeListbox extends window.HTMLElement {
  #keysSoFar = '';
  #clearKeysTimeout = null;
  #slot;
  #assignedElements;

  static get observedAttributes() {
    return ['disabled', MediaStateReceiverAttributes.MEDIA_CONTROLLER];
  }

  constructor(options = {}) {
    super();

    const shadow = this.attachShadow({ mode: 'open' });

    const listboxHTML = template.content.cloneNode(true);
    this.nativeEl = listboxHTML;

    let slotTemplate = options.slotTemplate;

    if (!slotTemplate) {
      slotTemplate = document.createElement('template');
      slotTemplate.innerHTML = `<slot>${options.defaultContent || ''}</slot>`;
    }

    this.nativeEl.appendChild(slotTemplate.content.cloneNode(true));

    shadow.appendChild(listboxHTML);

    this.#slot = this.shadowRoot.querySelector('slot');

    this.#slot.addEventListener('slotchange', () => {
      this.#assignedElements = this.#slot.assignedElements();

      if (this.#assignedElements.length === 1 && this.#assignedElements[0].nodeName.toLowerCase() === 'slot') {
        this.#assignedElements = this.#assignedElements[0].assignedElements();
      }

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

      if (elToSelect) {
        elToSelect.setAttribute('tabindex', 0);
        elToSelect.setAttribute('aria-selected', 'true');
      }
    });
  }

  get #items() {
    return this.#assignedElements.filter(el => !el.hasAttribute('disabled'));
  }

  get selectedOptions() {
    return this.#items.filter(el => el.getAttribute('aria-selected') === 'true');
  }

  focus() {
    this.selectedOptions[0]?.focus();
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
    const { metaKey, altKey } = e;
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

    if (!this.hasAttribute('role')) {
      // set listbox role on the media-chrome-listbox element itself
      // this is to make sure that SRs announce listitems as being part
      // of a listbox when focused
      this.setAttribute('role', 'listbox');
    }

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

  get keysUsed() {
    return ['Enter', ' ', 'ArrowDown', 'ArrowUp', 'Home', 'End'];
  }

  #getItem(e) {
    if (e.target === this) return;

    const composedPath = e.composedPath();
    const index = composedPath.findIndex(el => el.nodeName === 'MEDIA-CHROME-LISTITEM');

    return composedPath[index];
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

    this.dispatchEvent(new Event('change'));
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

        if (nextOption?.hasAttribute('disabled')) {
          nextOption = nextOption.nextElementSibling;
        }

        break;
      case 'ArrowUp':
        nextOption = currentOption.previousElementSibling;

        if (nextOption?.hasAttribute('disabled')) {
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

    if (!item || item.hasAttribute('disabled')) return;

    this.#items.forEach(el => el.setAttribute('tabindex', '-1'));
    item.setAttribute('tabindex', '0');

    this.handleSelection(e);
  }

  #searchItem(key) {
    this.#clearKeysOnDelay();

    const els = this.#items;
    const activeIndex = els.findIndex(el => el.getAttribute('tabindex') === '0');

    // always accumulate the key
    this.#keysSoFar += key;

    // if the same key is pressed, assume it's a repeated key
    // to skip to the same item that begings with that key
    // until the user presses another key and a better choice is available
    const repeatedKey = this.#keysSoFar.split('').every(k => k === key);

    // if it's a repeat key, skip the current item
    const after = els.slice(activeIndex + (repeatedKey ? 1 : 0)).filter(el => el.textContent.toLowerCase().startsWith(this.#keysSoFar));
    const before = els.slice(0, activeIndex - (repeatedKey ? 1 : 0)).filter(el => el.textContent.toLowerCase().startsWith(this.#keysSoFar));

    let afterRepeated = [];
    let beforeRepeated = [];

    if (repeatedKey) {
      afterRepeated = els.slice(activeIndex + (repeatedKey ? 1 : 0)).filter(el => el.textContent.startsWith(key));
      beforeRepeated = els.slice(0, activeIndex - (repeatedKey ? 1 : 0)).filter(el => el.textContent.startsWith(key));
    }

    const returns = [...after, ...before, ...afterRepeated, ...beforeRepeated];

    return returns[0];
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

if (!window.customElements.get('media-chrome-listbox')) {
  window.customElements.define('media-chrome-listbox', MediaChromeListbox);
}

export default MediaChromeListbox;
