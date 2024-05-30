import { globalThis, document } from '../utils/server-safe-globals.js';

const template = document.createElement('template');
template.innerHTML = /*html*/ `
<style>
  :host {
    cursor: pointer;
    display: block;
    line-height: revert;
    white-space: nowrap;
    white-space-collapse: collapse;
    text-wrap: nowrap;
    padding: .4em .5em;
    transition: var(--media-option-transition);
    outline: var(--media-option-outline, 0);
    outline-offset: var(--media-option-outline-offset, -1px);
  }

  :host(:focus-visible) {
    box-shadow: var(--media-option-focus-shadow, inset 0 0 0 2px rgb(27 127 204 / .9));
    outline: var(--media-option-hover-outline, 0);
    outline-offset: var(--media-option-hover-outline-offset,  var(--media-option-outline-offset, -1px));
  }

  :host(:hover) {
    cursor: pointer;
    background: var(--media-option-hover-background, rgb(82 82 122 / .8));
    outline: var(--media-option-hover-outline);
    outline-offset: var(--media-option-hover-outline-offset,  var(--media-option-outline-offset, -1px));
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
 * @cssproperty --media-option-outline - `outline` option.
 * @cssproperty --media-option-outline-offset - `outline-offset` of option.
 * @cssproperty --media-option-hover-background - `background` of hovered option.
 * @cssproperty --media-option-hover-outline - `outline` of hovered option.
 * @cssproperty --media-option-hover-outline-offset - `outline-offset` of hovered option.
 * @cssproperty --media-option-focus-shadow - `box-shadow` of the :focus-visible state
 */
class MediaChromeOption extends globalThis.HTMLElement {
  static get observedAttributes() {
    return [Attributes.DISABLED, Attributes.SELECTED, Attributes.VALUE];
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
    if (value) {
      this.part.add('option-selected');
    } else {
      this.part.remove('option-selected');
    }
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
    } else if (attrName === Attributes.DISABLED && newValue !== oldValue) {
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

    // Default to the last aria-selected element if there isn't an active element already.
    let selectedOption = options
      .filter((option) => option.getAttribute('aria-selected') === 'true')
      .pop();

    // If there isn't an active element or a selected element, default to the first element.
    if (!selectedOption) selectedOption = options[0];

    if (this.#ownerElement.getAttribute('aria-multiselectable') !== 'true') {
      options.forEach((option) => {
        option.setAttribute('tabindex', '-1');
        option.setAttribute('aria-selected', 'false');
      });
    }

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
