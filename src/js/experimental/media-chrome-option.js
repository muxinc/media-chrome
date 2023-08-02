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
    outline: var(--media-option-hover-outline);
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
 * @cssproperty --media-option-transition - `transition` of option.
 * @cssproperty --media-option-selected-background - `background` of selected option.
 * @cssproperty --media-option-hover-background - `background` of hovered option.
 * @cssproperty --media-option-hover-outline - `outline` of hovered option.
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
  #ownerElement;

  constructor() {
    super();

    if (!this.shadowRoot) {
      // Set up the Shadow DOM if not using Declarative Shadow DOM.
      this.attachShadow({ mode: 'open' });
      this.shadowRoot.appendChild(template.content.cloneNode(true));
    }
  }

  get value() {
    return this.getAttribute(Attributes.VALUE) ?? this.text;
  }

  set value(val) {
    this.setAttribute(Attributes.VALUE, val);
  }

  get text() {
    return (this.textContent ?? '').trim();
  }

  get selected() {
    return this.getAttribute('aria-selected') === 'true';
  }

  set selected(value) {
    this.#dirty = true;
    // Firefox doesn't support the property .ariaSelected.
    this.setAttribute('aria-selected', value ? 'true' : 'false');
  }

  enable() {
    if (!this.hasAttribute('tabindex')) {
      this.setAttribute('tabindex', -1);
    }
    if (!this.hasAttribute('aria-selected')) {
      this.setAttribute('aria-selected', 'false');
    }
  }

  disable() {
    this.removeAttribute('tabindex');
  }

  attributeChangedCallback(attrName, oldValue, newValue) {

    if (attrName === Attributes.SELECTED && !this.#dirty) {
      this.setAttribute('aria-selected', newValue != null ? 'true' : 'false');
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

    this.#ownerElement = closestOptionsContainer(this, this.parentNode);
    this.#reset();
  }

  disconnectedCallback() {
    this.disable();

    this.#reset();
    this.#ownerElement = null;
  }

  #reset() {
    const options = this.#ownerElement?.options;
    if (!options) return;

    const hasActiveOption = options.some(option => option.getAttribute('tabindex') === '0');
    // If the user set an element as active, we should use that rather than assume a default.
    if (hasActiveOption) return;

    // Default to the aria-selected element if there isn't an active element already.
    let selectedOption = options.find(option => option.getAttribute('aria-selected') === 'true');

    // If there isn't an active element or a selected element, default to the first element.
    if (!selectedOption) selectedOption = options[0];

    selectedOption?.setAttribute('tabindex', '0');
    selectedOption?.setAttribute('aria-selected', 'true');
  }

  handleClick() {}
}

function closestOptionsContainer(childNode, parentNode) {
  if (!childNode) return null;

  const { host } = childNode.getRootNode();
  if (!parentNode && host) return closestOptionsContainer(childNode, host);

  if (parentNode?.options) return parentNode;

  return closestOptionsContainer(parentNode, parentNode?.parentNode);
}

if (!globalThis.customElements.get('media-chrome-option')) {
  globalThis.customElements.define('media-chrome-option', MediaChromeOption);
}

export { MediaChromeOption };
export default MediaChromeOption;
