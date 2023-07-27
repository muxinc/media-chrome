import { MediaStateReceiverAttributes } from '../constants.js';
import { globalThis, document } from '../utils/server-safe-globals.js';

const checkIcon = /*html*/`
<svg aria-hidden="true" viewBox="0 0 24 24">
  <path fill="currentColor" d="m10 15.17 9.193-9.191 1.414 1.414-10.606 10.606-6.364-6.364 1.414-1.414 4.95 4.95Z"/>
</svg>`;

export function createOption(text, value, selected) {
  const option = document.createElement('media-chrome-option');
  option.part.add('option');
  option.value = value;

  if (selected) {
    option.setAttribute('aria-selected', 'true');
  } else {
    option.setAttribute('aria-selected', 'false');
  }

  const label = document.createElement('span');
  label.textContent = text;
  option.append(label);

  return option;
}

const template = document.createElement('template');
template.innerHTML = /*html*/`
<style>
  :host {
    font: var(--media-font,
      var(--media-font-weight, normal)
      var(--media-font-size, 15px) /
      var(--media-text-content-height, var(--media-control-height, 24px))
      var(--media-font-family, helvetica neue, segoe ui, roboto, arial, sans-serif));
    color: var(--media-text-color, var(--media-primary-color, rgb(238 238 238)));
    background: var(--media-listbox-background, var(--media-control-background, var(--media-secondary-color, rgb(20 20 30 / .8))));
    display: inline-flex;
    gap: .5em;
    margin: 0;
    padding: .5em 0;
  }

  slot:not([name]) {
    display: block;
  }

  media-chrome-option {
    padding-inline: .7em 1.4em;
  }

  media-chrome-option > span {
    margin-inline: .5ch;
  }

  media-chrome-option > .indicator {
    fill: var(--media-icon-color, var(--media-primary-color, rgb(238 238 238)));
    height: var(--media-option-indicator-height, 1.25em);
    vertical-align: var(--media-option-indicator-vertical-align, text-top);
  }

  media-chrome-option > .selected-indicator {
    margin-top: -.06em;
  }

  media-chrome-option[aria-selected="false"] > .selected-indicator {
    visibility: hidden;
  }
</style>
<slot></slot>
<slot hidden name="selected-indicator">${checkIcon}</slot>
`;

/**
 * @extends {HTMLElement}
 *
 * @slot - Default slotted elements.
 *
 * @attr {boolean} disabled - The Boolean disabled attribute makes the element not mutable or focusable.
 * @attr {string} mediacontroller - The element `id` of the media controller to connect to (if not nested within).
 *
 * @cssproperty --media-primary-color - Default color of text.
 * @cssproperty --media-secondary-color - Default color of background.
 * @cssproperty --media-text-color - `color` of text.
 *
 * @cssproperty --media-control-background - `background` of control.
 * @cssproperty --media-listbox-background - `background` of listbox.
 *
 * @cssproperty --media-font - `font` shorthand property.
 * @cssproperty --media-font-weight - `font-weight` property.
 * @cssproperty --media-font-family - `font-family` property.
 * @cssproperty --media-font-size - `font-size` property.
 * @cssproperty --media-text-content-height - `line-height` of text.
 */
class MediaChromeListbox extends globalThis.HTMLElement {
  static get observedAttributes() {
    return ['disabled', MediaStateReceiverAttributes.MEDIA_CONTROLLER];
  }

  static formatOptionText(text) {
    return text;
  }

  #keysSoFar = '';
  #clearKeysTimeout = null;
  #slot;
  #metaPressed = false;

  constructor(options = {}) {
    super();

    if (!this.shadowRoot) {
      // Set up the Shadow DOM if not using Declarative Shadow DOM.
      this.attachShadow({ mode: 'open' });

      this.nativeEl = template.content.cloneNode(true);

      if (options.slotTemplate) {
        this.nativeEl.append(options.slotTemplate.content.cloneNode(true));
      }

      this.shadowRoot.append(this.nativeEl);
    }

    this.#slot = this.shadowRoot.querySelector('slot');

    this.#slot.addEventListener('slotchange', () => {
      const els = this.#options;
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
        elToSelect.setAttribute('tabindex', '0');
        elToSelect.setAttribute('aria-selected', 'true');
      }
    });
  }

  formatOptionText(text, data) {
    // @ts-ignore
    return this.constructor.formatOptionText(text, data);
  }

  getSlottedIndicator(name) {
    let indicator = this.querySelector(`:scope > [slot="${name}"]`);

    // Chaining slots
    if (indicator?.nodeName == 'SLOT')
      // @ts-ignore
      indicator = indicator.assignedElements({ flatten: true })[0];

    if (!indicator)
      indicator = this.shadowRoot.querySelector(`[name="${name}"] > svg`);

    indicator.removeAttribute('slot');
    indicator.classList.add('indicator', name);

    return indicator;
  }

  get #options() {
    // First query the light dom children for any options.

    /** @type NodeListOf<HTMLOptionElement> */
    let options = this.querySelectorAll('media-chrome-option');

    if (!options.length) {
      // Fallback to the options in the shadow dom.
      options = this.#slot.querySelectorAll('media-chrome-option');
    }

    return Array.from(options);
  }

  get selectedOptions() {
    return this.#options.filter(el => el.getAttribute('aria-selected') === 'true');
  }

  get value() {
    return this.selectedOptions[0]?.value || this.selectedOptions[0]?.textContent;
  }

  set value(newValue) {
    const item = this.#options.find(el => el.value === newValue || el.textContent === newValue);

    if (!item) return;

    this.#selectItem(item);
  }

  focus() {
    this.selectedOptions[0]?.focus();
  }

  #clickListener = (e) => {
    this.handleClick(e);
  }

  #handleKeyListener(e) {
    const { key } = e;

    if (key === 'Enter' || key === ' ') {
      this.handleSelection(e, this.hasAttribute('aria-multiselectable') && this.getAttribute('aria-multiselectable') === 'true');
    } else {
      this.handleMovement(e);
    }
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

    if (key === 'Meta') {
      this.#metaPressed = false;
      return;
    }

    this.#handleKeyListener(e);
  }

  #keydownListener = (e) => {
    const { key, altKey } = e;

    if (altKey) {
      this.removeEventListener('keyup', this.#keyupListener);
      return;
    }

    if (key === 'Meta') {
      this.#metaPressed = true;
      return;
    }

    // only prevent default on used keys
    if (this.keysUsed.includes(key)) {
      e.preventDefault();
    }

    if (this.#metaPressed && this.keysUsed.includes(key)) {
      this.#handleKeyListener(e);
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
      // this is to make sure that SRs announce options as being part
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
    const composedPath = e.composedPath();
    const index = composedPath.findIndex(el => el.nodeName === 'MEDIA-CHROME-OPTION');

    return composedPath[index];
  }

  handleSelection(e, toggle) {
    const item = this.#getItem(e);

    if (!item) return;

    this.#selectItem(item, toggle);
  }

  #selectItem(item, toggle) {
    if (!this.hasAttribute('aria-multiselectable') || this.getAttribute('aria-multiselectable') !== 'true') {
      this.#options.forEach(el => el.setAttribute('aria-selected', 'false'));
    }

    if (toggle) {
      const selected = item.getAttribute('aria-selected') === 'true';

      if (selected) {
        item.setAttribute('aria-selected', 'false');
      } else {
        item.setAttribute('aria-selected', 'true');
      }
    } else {
      item.setAttribute('aria-selected', 'true');
    }

    this.dispatchEvent(new Event('change'));
  }

  handleMovement(e) {
    const { key } = e;
    const els = this.#options;

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

    this.#options.forEach(el => el.setAttribute('tabindex', '-1'));
    item.setAttribute('tabindex', '0');

    this.handleSelection(e, this.hasAttribute('aria-multiselectable') && this.getAttribute('aria-multiselectable') === 'true');
  }

  #searchItem(key) {
    this.#clearKeysOnDelay();

    const els = this.#options;
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
    clearTimeout(this.#clearKeysTimeout);
    this.#clearKeysTimeout = null;

    this.#clearKeysTimeout = setTimeout(() => {
      this.#keysSoFar = '';
      this.#clearKeysTimeout = null;
    }, 500);
  }
}

if (!globalThis.customElements.get('media-chrome-listbox')) {
  globalThis.customElements.define('media-chrome-listbox', MediaChromeListbox);
}

export { MediaChromeListbox };
export default MediaChromeListbox;
