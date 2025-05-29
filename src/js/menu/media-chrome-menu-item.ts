import { globalThis, document } from '../utils/server-safe-globals.js';
import { InvokeEvent } from '../utils/events.js';
import {
  getDocumentOrShadowRoot,
  containsComposedNode,
  namedNodeMapToObject,
} from '../utils/element-utils.js';
import type MediaChromeMenu from './media-chrome-menu.js';

function getTemplateHTML(_attrs: Record<string, string>) {
  return /*html*/ `
    <style>
      :host {
        transition: var(--media-menu-item-transition,
          background .15s linear,
          opacity .2s ease-in-out
        );
        outline: var(--media-menu-item-outline, 0);
        outline-offset: var(--media-menu-item-outline-offset, -1px);
        cursor: var(--media-cursor, pointer);
        display: flex;
        align-items: center;
        align-self: stretch;
        justify-self: stretch;
        white-space: nowrap;
        white-space-collapse: collapse;
        text-wrap: nowrap;
        padding: .4em .8em .4em 1em;
      }

      :host(:focus-visible) {
        box-shadow: var(--media-menu-item-focus-shadow, inset 0 0 0 2px rgb(27 127 204 / .9));
        outline: var(--media-menu-item-hover-outline, 0);
        outline-offset: var(--media-menu-item-hover-outline-offset,  var(--media-menu-item-outline-offset, -1px));
      }

      :host(:hover) {
        cursor: var(--media-cursor, pointer);
        background: var(--media-menu-item-hover-background, rgb(92 92 102 / .5));
        outline: var(--media-menu-item-hover-outline);
        outline-offset: var(--media-menu-item-hover-outline-offset,  var(--media-menu-item-outline-offset, -1px));
      }

      :host([aria-checked="true"]) {
        background: var(--media-menu-item-checked-background);
      }

      :host([hidden]) {
        display: none;
      }

      :host([disabled]) {
        pointer-events: none;
        color: rgba(255, 255, 255, .3);
      }

      slot:not([name]) {
        width: 100%;
      }

      slot:not([name="submenu"]) {
        display: inline-flex;
        align-items: center;
        transition: inherit;
        opacity: var(--media-menu-item-opacity, 1);
      }

      slot[name="description"] {
        justify-content: end;
      }

      slot[name="description"] > span {
        display: inline-block;
        margin-inline: 1em .2em;
        max-width: var(--media-menu-item-description-max-width, 100px);
        text-overflow: ellipsis;
        overflow: hidden;
        font-size: .8em;
        font-weight: 400;
        text-align: right;
        position: relative;
        top: .04em;
      }

      slot[name="checked-indicator"] {
        display: none;
      }

      :host(:is([role="menuitemradio"],[role="menuitemcheckbox"])) slot[name="checked-indicator"] {
        display: var(--media-menu-item-checked-indicator-display, inline-block);
      }

      ${/* For all slotted icons in prefix and suffix. */ ''}
      svg, img, ::slotted(svg), ::slotted(img) {
        height: var(--media-menu-item-icon-height, var(--media-control-height, 24px));
        fill: var(--media-icon-color, var(--media-primary-color, rgb(238 238 238)));
        display: block;
      }

      ${
        /* Only for indicator icons like checked-indicator or captions-indicator. */ ''
      }
      [part~="indicator"],
      ::slotted([part~="indicator"]) {
        fill: var(--media-menu-item-indicator-fill,
          var(--media-icon-color, var(--media-primary-color, rgb(238 238 238))));
        height: var(--media-menu-item-indicator-height, 1.25em);
        margin-right: .5ch;
      }

      [part~="checked-indicator"] {
        visibility: hidden;
      }

      :host([aria-checked="true"]) [part~="checked-indicator"] {
        visibility: visible;
      }
    </style>
    <slot name="checked-indicator">
      <svg aria-hidden="true" viewBox="0 1 24 24" part="checked-indicator indicator">
        <path d="m10 15.17 9.193-9.191 1.414 1.414-10.606 10.606-6.364-6.364 1.414-1.414 4.95 4.95Z"/>
      </svg>
    </slot>
    <slot name="prefix"></slot>
    <slot></slot>
    <slot name="description"></slot>
    <slot name="suffix">
      ${this.getSuffixSlotInnerHTML(_attrs)}
    </slot>
    <slot name="submenu"></slot>
  `;
}

function getSuffixSlotInnerHTML(_attrs: Record<string, string>) {
  return '';
}

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
 * @cssproperty --media-menu-item-opacity - `opacity` of menu-item content.
 * @cssproperty --media-menu-item-transition - `transition` of menu-item.
 * @cssproperty --media-menu-item-checked-background - `background` of checked menu-item.
 * @cssproperty --media-menu-item-outline - `outline` menu-item.
 * @cssproperty --media-menu-item-outline-offset - `outline-offset` of menu-item.
 * @cssproperty --media-menu-item-hover-background - `background` of hovered menu-item.
 * @cssproperty --media-menu-item-hover-outline - `outline` of hovered menu-item.
 * @cssproperty --media-menu-item-hover-outline-offset - `outline-offset` of hovered menu-item.
 * @cssproperty --media-menu-item-focus-shadow - `box-shadow` of the :focus-visible state.
 * @cssproperty --media-menu-item-icon-height - `height` of icon.
 * @cssproperty --media-menu-item-description-max-width - `max-width` of description.
 * @cssproperty --media-menu-item-checked-indicator-display - `display` of checked indicator.
 *
 * @cssproperty --media-icon-color - `fill` color of icon.
 * @cssproperty --media-menu-icon-height - `height` of icon.
 *
 * @cssproperty --media-menu-item-indicator-fill - `fill` color of indicator icon.
 * @cssproperty --media-menu-item-indicator-height - `height` of menu-item indicator.
 */
class MediaChromeMenuItem extends globalThis.HTMLElement {
  static shadowRootOptions = { mode: 'open' as ShadowRootMode };
  static getTemplateHTML = getTemplateHTML;
  static getSuffixSlotInnerHTML = getSuffixSlotInnerHTML;

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
      this.attachShadow((this.constructor as typeof MediaChromeMenuItem).shadowRootOptions);

      const attrs = namedNodeMapToObject(this.attributes);
      this.shadowRoot.innerHTML = (this.constructor as typeof MediaChromeMenuItem).getTemplateHTML(attrs);
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

  attributeChangedCallback(
    attrName: string,
    oldValue: string | null,
    newValue: string | null
  ): void {
    if (attrName === Attributes.CHECKED && isCheckable(this) && !this.#dirty) {
      this.setAttribute('aria-checked', newValue != null ? 'true' : 'false');
    } else if (attrName === Attributes.TYPE && newValue !== oldValue) {
      this.role = 'menuitem' + newValue;
    } else if (attrName === Attributes.DISABLED && newValue !== oldValue) {
      if (newValue == null) {
        this.enable();
      } else {
        this.disable();
      }
    }
  }

  connectedCallback(): void {
    if (!this.hasAttribute(Attributes.DISABLED)) {
      this.enable();
    }

    this.role = 'menuitem' + this.type;

    this.#ownerElement = closestMenuItemsContainer(this, this.parentNode);
    this.#reset();
  }

  disconnectedCallback(): void {
    this.disable();

    this.#reset();
    this.#ownerElement = null;
  }

  get invokeTarget() {
    return this.getAttribute('invoketarget');
  }

  set invokeTarget(value) {
    this.setAttribute('invoketarget', `${value}`);
  }

  /**
   * Returns the element with the id specified by the `invoketarget` attribute
   * or the slotted submenu element.
   */
  get invokeTargetElement(): MediaChromeMenu | null {
    if (this.invokeTarget) {
      return getDocumentOrShadowRoot(this)?.querySelector(
        `#${this.invokeTarget}`
      );
    }
    return this.submenuElement;
  }

  /**
   * Returns the slotted submenu element.
   */
  get submenuElement(): MediaChromeMenu | null {
    /** @type {HTMLSlotElement} */
    const submenuSlot: HTMLSlotElement = this.shadowRoot.querySelector(
      'slot[name="submenu"]'
    );
    return submenuSlot.assignedElements({
      flatten: true,
    })[0] as MediaChromeMenu;
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
      for (const node of slot.assignedNodes({ flatten: true })) {
        // Remove all whitespace text nodes so the unnamed slot shows its fallback content.
        if (node instanceof Text && node.textContent.trim() === '') {
          node.remove();
        }
      }
    }

    if (slot.name === 'submenu') {
      if (this.submenuElement) {
        this.#submenuConnected();
      } else {
        this.#submenuDisconnected();
      }
    }
  }

  async #submenuConnected() {
    this.setAttribute('aria-haspopup', 'menu');
    this.setAttribute('aria-expanded', `${!this.submenuElement.hidden}`);

    this.submenuElement.addEventListener('change', this.#handleMenuItem);
    this.submenuElement.addEventListener('addmenuitem', this.#handleMenuItem);
    this.submenuElement.addEventListener(
      'removemenuitem',
      this.#handleMenuItem
    );

    this.#handleMenuItem();
  }

  #submenuDisconnected() {
    this.removeAttribute('aria-haspopup');
    this.removeAttribute('aria-expanded');

    this.submenuElement.removeEventListener('change', this.#handleMenuItem);
    this.submenuElement.removeEventListener(
      'addmenuitem',
      this.#handleMenuItem
    );
    this.submenuElement.removeEventListener(
      'removemenuitem',
      this.#handleMenuItem
    );

    this.#handleMenuItem();
  }

  /**
   * If there is a slotted submenu the fallback content of the description slot
   * is populated with the text of the first checked item.
   */
  #handleMenuItem = () => {
    this.setAttribute('submenusize', `${this.submenuElement.items.length}`);

    const descriptionSlot = this.shadowRoot.querySelector(
      'slot[name="description"]'
    );
    const checkedItem = this.submenuElement.checkedItems?.[0];
    const description = checkedItem?.dataset.description ?? checkedItem?.text;

    const span = document.createElement('span');
    span.textContent = description ?? '';

    descriptionSlot.replaceChildren(span);
  };

  handleClick(event) {
    // Checkable menu items are handled in media-chrome-menu.
    if (isCheckable(this)) return;

    if (this.invokeTargetElement && containsComposedNode(this, event.target)) {
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
      item.setAttribute('aria-checked', 'false');
    }

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
