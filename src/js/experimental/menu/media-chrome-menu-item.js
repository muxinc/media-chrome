import { globalThis, document } from '../../utils/server-safe-globals.js';
import { InvokeEvent } from '../../utils/events.js';

const template = document.createElement('template');
template.innerHTML = /*html*/`
  <style>
    :host {
      transition: var(--media-menu-item-transition);
      outline: var(--media-menu-item-outline, 0);
      outline-offset: var(--media-menu-item-outline-offset, -1px);
      cursor: pointer;
      display: flex;
      align-items: center;
      width: 100%;
      line-height: revert;
      white-space: nowrap;
      white-space-collapse: collapse;
      text-wrap: nowrap;
      padding: .3em .5em;
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
  <slot name="submenu"></slot>
`;

export const Attributes = {
  TYPE: 'type',
  VALUE: 'value',
  CHECKED: 'checked',
  DISABLED: 'disabled',
};

/**
 * @extends {HTMLElement}
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
  static template = template;

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
      // @ts-ignore
      this.shadowRoot.append(this.constructor.template.content.cloneNode(true));
    }

    this.shadowRoot.addEventListener('slotchange', this);
  }

  enable() {
    if (!this.hasAttribute('tabindex')) {
      this.setAttribute('tabindex', '-1');
    }

    if (isCheckable(this) && !this.hasAttribute('aria-checked')) {
      this.setAttribute('aria-checked', 'false');
    }

    this.addEventListener('click', this);
    this.addEventListener('keydown', this);
  }

  disable() {
    this.removeAttribute('tabindex');

    this.removeEventListener('click', this);
    this.removeEventListener('keydown', this);
    this.removeEventListener('keyup', this);
  }

  handleEvent(event) {
    switch (event.type) {
      case 'slotchange':
        this.#handleSlotChange(event);
        break;
      case 'click':
        this.handleClick(event);
        break;
      case 'keydown':
        this.#handleKeyDown(event);
        break;
      case 'keyup':
        this.#handleKeyUp(event);
        break;
    }
  }

  attributeChangedCallback(attrName, oldValue, newValue) {
    if (attrName === Attributes.CHECKED && isCheckable(this) && !this.#dirty) {
      this.setAttribute('aria-checked', newValue != null ? 'true' : 'false');
    } else if (attrName === Attributes.TYPE && newValue !== oldValue) {
      this.setAttribute('role', 'menuitem' + newValue);
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

    this.setAttribute('role', 'menuitem' + this.type);

    this.#ownerElement = closestMenuItemsContainer(this, this.parentNode);
    this.#reset();
  }

  disconnectedCallback() {
    this.disable();

    this.#reset();
    this.#ownerElement = null;
  }

  /**
   * Returns the slotted element with the `slot="submenu"` attribute.
   * @return {HTMLElement | null}
   */
  get invokeTargetElement() {
    return this.querySelector('[slot="submenu"]');
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
    if (!isCheckable(this)) return undefined;
    return this.getAttribute('aria-checked') === 'true';
  }

  set checked(value) {
    if (!isCheckable(this)) return;

    this.#dirty = true;
    // Firefox doesn't support the property .ariaChecked.
    this.setAttribute('aria-checked', value ? 'true' : 'false');

    if (value) {
      this.part.add('checked');
    } else {
      this.part.remove('checked');
    }
  }

  #handleSlotChange(event) {
    const slot = event.target;
    const isDefaultSlot = !slot?.name;

    if (isDefaultSlot) {
      for (let node of slot.assignedNodes({ flatten: true })) {
        // Remove all whitespace text nodes so the unnamed slot shows its fallback content.
        if (node instanceof Text && node.textContent.trim() === '') {
          node.remove();
        }
      }

      // Add an empty class to the default slot if there are no nodes left.
      slot.classList.toggle('empty', !slot.assignedNodes({ flatten: true }).length);
      return;
    }

    if (slot.name === 'submenu' && this.invokeTargetElement) {
      this.setAttribute('aria-haspopup', 'menu');
      this.setAttribute('aria-expanded', `${!this.invokeTargetElement.hidden}`);
    }
  }

  handleClick(event) {
    // Checkable menu items are handled in media-chrome-menu.
    if (isCheckable(this)) return;

    if (this.invokeTargetElement && event.target === this) {
      this.invokeTargetElement.dispatchEvent(
        new InvokeEvent({ relatedTarget: this })
      );
    }
  }

  get keysUsed() {
    return ['Enter', ' '];
  }

  #handleKeyUp(event) {
    const { key } = event;

    if (!this.keysUsed.includes(key)) {
      this.removeEventListener('keyup', this.#handleKeyUp);
      return;
    }

    this.handleClick(event);
  }

  #handleKeyDown(event) {
    const { metaKey, altKey, key } = event;

    if (metaKey || altKey || !this.keysUsed.includes(key)) {
      this.removeEventListener('keyup', this.#handleKeyUp);
      return;
    }

    this.addEventListener('keyup', this.#handleKeyUp, { once: true });
  }

  #reset() {
    const items = this.#ownerElement?.radioGroupItems;
    if (!items) return;

    // Default to the last aria-checked element if there isn't an active element already.
    let checkedItem = items
      .filter((item) => item.getAttribute('aria-checked') === 'true')
      .pop();

    // If there isn't an active element or a checked element, default to the first element.
    if (!checkedItem) checkedItem = items[0];

    for (const item of items) {
      item.setAttribute('tabindex', '-1');
      item.setAttribute('aria-checked', 'false');
    }

    checkedItem?.setAttribute('tabindex', '0');
    checkedItem?.setAttribute('aria-checked', 'true');
  }
}

function isCheckable(item) {
  return item.type === 'radio' || item.type === 'checkbox';
}

function closestMenuItemsContainer(childNode, parentNode) {
  if (!childNode) return null;

  const { host } = childNode.getRootNode();
  if (!parentNode && host) return closestMenuItemsContainer(childNode, host);

  if (parentNode?.items) return parentNode;

  return closestMenuItemsContainer(parentNode, parentNode?.parentNode);
}

if (!globalThis.customElements.get('media-chrome-menu-item')) {
  globalThis.customElements.define(
    'media-chrome-menu-item',
    MediaChromeMenuItem
  );
}

export { MediaChromeMenuItem };
export default MediaChromeMenuItem;
