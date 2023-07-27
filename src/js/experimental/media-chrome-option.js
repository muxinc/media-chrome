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
    transition: var(--media-option-transition);
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
  SELECTED: 'selected',
  DISABLED: 'disabled',
};

/**
 * @slot - Default slotted elements.
 *
 * @attr {boolean} disabled - The Boolean disabled attribute makes the element not mutable or focusable.
 *
 * @cssproperty --media-option-selected-background - `background` of selected listbox item.
 * @cssproperty --media-option-hover-background - `background` of hovered listbox item.
 * @cssproperty --media-option-hover-outline - `outline` of hovered listbox item.
 */
class MediaChromeOption extends globalThis.HTMLElement {
  static get observedAttributes() {
    return [
      Attributes.DISABLED,
      Attributes.SELECTED,
      Attributes.VALUE,
    ];
  }

  /** @see https://html.spec.whatwg.org/multipage/form-elements.html#concept-option-dirtiness */
  #dirty = false;

  constructor() {
    super();

    if (!this.shadowRoot) {
      // Set up the Shadow DOM if not using Declarative Shadow DOM.
      this.attachShadow({ mode: 'open' });
      this.shadowRoot.appendChild(template.content.cloneNode(true));
    }
  }

  set value(value) {
    this.setAttribute(Attributes.VALUE, value);
  }

  get value() {
    return this.getAttribute(Attributes.VALUE);
  }

  set selected(value) {
    this.#dirty = true;
    this.ariaSelected = value ? 'true' : 'false';
  }

  get selected() {
    return this.ariaSelected === 'true';
  }

  enable() {
    if (!this.hasAttribute('tabindex')) {
      this.setAttribute('tabindex', -1);
    }
    if (!this.ariaSelected) {
      this.ariaSelected = 'false';
    }
  }

  disable() {
    this.removeAttribute('tabindex');
  }

  attributeChangedCallback(attrName, oldValue, newValue) {

    if (attrName === Attributes.SELECTED && !this.#dirty) {
      this.ariaSelected = newValue != null ? 'true' : 'false';
    }

    else if (attrName === Attributes.DISABLED && newValue !== oldValue) {
      if (newValue == null) {
        this.enable();
      } else {
        this.disable();
      }
    }
  }

  connectedCallback() {
    if (!this.hasAttribute(Attributes.DISABLED)) {
      this.enable();
    }

    this.setAttribute('role', 'option');
  }

  disconnectedCallback() {
    this.disable();
  }

  handleClick() {}
}

if (!globalThis.customElements.get('media-chrome-option')) {
  globalThis.customElements.define('media-chrome-option', MediaChromeOption);
}

export { MediaChromeOption };
export default MediaChromeOption;
