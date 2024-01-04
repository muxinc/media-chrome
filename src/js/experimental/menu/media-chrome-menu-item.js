import { globalThis, document } from '../../utils/server-safe-globals.js';

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
    padding: .4em .5em;
    transition: var(--media-menu-item-transition);
    outline: var(--media-menu-item-outline, 0);
    outline-offset: var(--media-menu-item-outline-offset, -1px);
  }

  :host(:focus-visible) {
    box-shadow: var(--media-menu-item-focus-shadow, inset 0 0 0 2px rgb(27 127 204 / .9));
    outline: var(--media-menu-item-hover-outline, 0);
    outline-offset: var(--media-menu-item-hover-outline-offset,  var(--media-menu-item-outline-offset, -1px));
  }

  :host(:hover) {
    cursor: pointer;
    background: var(--media-menu-item-hover-background, rgb(82 82 122 / .8));
    outline: var(--media-menu-item-hover-outline);
    outline-offset: var(--media-menu-item-hover-outline-offset,  var(--media-menu-item-outline-offset, -1px));
  }

  :host([aria-checked="true"]) {
    background: var(--media-menu-item-checked-background);
  }

  :host([disabled]) {
    pointer-events: none;
    color: rgba(255, 255, 255, .3);
  }
</style>
<slot></slot>
`;

export const Attributes = {
  TYPE: 'type',
  VALUE: 'value',
  CHECKED: 'checked',
  DISABLED: 'disabled',
};

/**
 * @slot - Default slotted elements.
 *
 * @attr {(''|'radio'|'checkbox')} type - This attribute indicates the kind of command, and can be one of three values.
 * @attr {boolean} disabled - The Boolean disabled attribute makes the element not mutable or focusable.
 *
 * @cssproperty --media-menu-item-transition - `transition` of menu-item.
 * @cssproperty --media-menu-item-checked-background - `background` of checked menu-item.
 * @cssproperty --media-menu-item-outline - `outline` menu-item.
 * @cssproperty --media-menu-item-outline-offset - `outline-offset` of menu-item.
 * @cssproperty --media-menu-item-hover-background - `background` of hovered menu-item.
 * @cssproperty --media-menu-item-hover-outline - `outline` of hovered menu-item.
 * @cssproperty --media-menu-item-hover-outline-offset - `outline-offset` of hovered menu-item.
 * @cssproperty --media-menu-item-focus-shadow - `box-shadow` of the :focus-visible state
 */
class MediaChromeMenuItem extends globalThis.HTMLElement {
  static get observedAttributes() {
    return [
      Attributes.TYPE,
      Attributes.DISABLED,
      Attributes.CHECKED,
      Attributes.VALUE,
    ];
  }

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

  get type() {
    return this.getAttribute(Attributes.TYPE) ?? '';
  }

  set type(val) {
    this.setAttribute(Attributes.TYPE, `${val}`);
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

  get checked() {
    return this.getAttribute('aria-checked') === 'true';
  }

  set checked(value) {
    this.#dirty = true;
    // Firefox doesn't support the property .ariaChecked.
    this.setAttribute('aria-checked', value ? 'true' : 'false');

    if (value) {
      this.part.add('checked');
    } else {
      this.part.remove('checked');
    }
  }

  enable() {
    if (!this.hasAttribute('tabindex')) {
      this.setAttribute('tabindex', -1);
    }
    if (!this.hasAttribute('aria-checked')) {
      this.setAttribute('aria-checked', 'false');
    }
  }

  disable() {
    this.removeAttribute('tabindex');
  }

  attributeChangedCallback(attrName, oldValue, newValue) {

    if (attrName === Attributes.CHECKED && !this.#dirty) {
      this.setAttribute('aria-checked', newValue != null ? 'true' : 'false');
    }
    else if (attrName === Attributes.TYPE && newValue !== oldValue) {
      this.setAttribute('role', 'menuitem' + newValue);
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

    this.setAttribute('role', 'menuitem' + this.type);

    this.#ownerElement = closestMenuItemsContainer(this, this.parentNode);
    this.#reset();
  }

  disconnectedCallback() {
    this.disable();

    this.#reset();
    this.#ownerElement = null;
  }

  #reset() {
    const items = this.#ownerElement?.radioGroupItems;
    if (!items) return;

    // Default to the last aria-checked element if there isn't an active element already.
    let checkedItem = items.filter(item => item.getAttribute('aria-checked') === 'true').pop();

    // If there isn't an active element or a checked element, default to the first element.
    if (!checkedItem) checkedItem = items[0];

    for (const item of items) {
      item.setAttribute('tabindex', '-1');
      item.setAttribute('aria-checked', 'false')
    }

    checkedItem?.setAttribute('tabindex', '0');
    checkedItem?.setAttribute('aria-checked', 'true');
  }

  handleClick() {}
}

function closestMenuItemsContainer(childNode, parentNode) {
  if (!childNode) return null;

  const { host } = childNode.getRootNode();
  if (!parentNode && host) return closestMenuItemsContainer(childNode, host);

  if (parentNode?.items) return parentNode;

  return closestMenuItemsContainer(parentNode, parentNode?.parentNode);
}

if (!globalThis.customElements.get('media-chrome-menu-item')) {
  globalThis.customElements.define('media-chrome-menu-item', MediaChromeMenuItem);
}

export { MediaChromeMenuItem };
export default MediaChromeMenuItem;
