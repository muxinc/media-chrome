import './media-chrome-menu-item.js';
import { MediaStateReceiverAttributes } from '../../constants.js';
import { globalThis, document } from '../../utils/server-safe-globals.js';
import { computePosition } from '../../utils/anchor-utils.js';
import { observeResize, unobserveResize } from '../../utils/resize-observer.js';
import { ToggleEvent } from '../../utils/events.js';
import {
  getActiveElement,
  containsComposedNode,
  closestComposedNode,
  getOrInsertCSSRule,
  getMediaController,
  getAttributeMediaController,
  getDocumentOrShadowRoot,
} from '../../utils/element-utils.js';

const checkIcon = /*html*/`
<svg aria-hidden="true" viewBox="0 1 24 24" part="checked-indicator indicator">
  <path d="m10 15.17 9.193-9.191 1.414 1.414-10.606 10.606-6.364-6.364 1.414-1.414 4.95 4.95Z"/>
</svg>`;

export function createMenuItem({ type, text, value, checked }) {
  const item = document.createElement('media-chrome-menu-item');

  item.type = type ?? '';

  item.part.add('menu-item');
  if (type) item.part.add(type);

  item.value = value;
  item.checked = checked;

  const label = document.createElement('span');
  label.textContent = text;
  item.append(label);

  return item;
}

export function createIndicator(el, name) {
  let customIndicator = el.querySelector(`:scope > [slot="${name}"]`);

  // Chaining slots
  if (customIndicator?.nodeName == 'SLOT')
    // @ts-ignore
    customIndicator = customIndicator.assignedElements({ flatten: true })[0];

  if (customIndicator) {
    // @ts-ignore
    customIndicator = customIndicator.cloneNode(true);
    customIndicator.removeAttribute('slot');
    return customIndicator;
  }

  let fallbackIndicator = el.shadowRoot.querySelector(`[name="${name}"] > svg`);
  return fallbackIndicator.cloneNode(true);
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
      background: var(--media-menu-background, var(--media-control-background, var(--media-secondary-color, rgb(20 20 30 / .8))));
      border-radius: var(--media-menu-border-radius);
      border: var(--media-menu-border, none);
      display: var(--media-menu-display, inline-flex);
      opacity: var(--media-menu-opacity, 1);
      max-height: var(--media-menu-max-height, var(--_menu-max-height, 300px));
      visibility: var(--media-menu-visibility, visible);
      transition: var(--media-menu-transition-in,
        visibility 0s, transform .15s ease-out, opacity .15s ease-out);
      transform: var(--media-menu-transform-in, translateY(0) scale(1));
      flex-direction: column;
      ${/* Prevent overflowing a flex container */ ''}
      min-height: 0;
      position: relative;
      box-sizing: border-box;
    }

    :host([hidden]) {
      opacity: var(--media-menu-hidden-opacity, 0);
      max-height: var(--media-menu-hidden-max-height, var(--media-menu-max-height, var(--_menu-max-height, 300px)));
      visibility: var(--media-menu-hidden-visibility, hidden);
      transition: var(--media-menu-transition-out,
        visibility .15s ease-out, transform .15s ease-out, opacity .15s ease-out);
      transform: var(--media-menu-transform-out, translateY(2px) scale(.99));
      pointer-events: none;
    }

    :host([slot="submenu"]) {
      overflow: hidden;
      transition: var(--media-submenu-transition-in, visibility 0s, max-height .2s ease-in-out);
      max-height: var(--media-submenu-max-height, var(--media-submenu-max-height, var(--_submenu-max-height, 190px)));
    }

    :host([slot="submenu"][hidden]) {
      opacity: var(--media-submenu-hidden-opacity, 1);
      max-height: var(--media-submenu-hidden-max-height, var(--media-submenu-max-height, var(--_submenu-max-height, 0)));
      transform: var(--media-submenu-transform-out, visibility .2s ease-in-out, max-height .2s ease-in-out);
    }

    ::slotted([slot="header"]) {
      padding: .4em 1.4em;
      border-bottom: 1px solid rgb(255 255 255 / .25);
    }

    #container {
      gap: var(--media-menu-gap);
      flex-direction: var(--media-menu-flex-direction, column);
      overflow: var(--media-menu-overflow, hidden auto);
      display: flex;
      padding-block: .5em;
    }

    media-chrome-menu-item {
      padding-inline: .7em 1.4em;
    }

    media-chrome-menu-item > span {
      margin-inline: .5ch;
    }

    [part~="indicator"] {
      fill: var(--media-menu-item-indicator-fill, var(--media-icon-color, var(--media-primary-color, rgb(238 238 238))));
      height: var(--media-menu-item-indicator-height, 1.25em);
      vertical-align: var(--media-menu-item-indicator-vertical-align, text-top);
    }

    [part~="checked-indicator"] {
      display: var(--media-menu-item-checked-indicator-display);
      visibility: hidden;
    }

    [aria-checked="true"] > [part~="checked-indicator"] {
      visibility: visible;
    }
  </style>
  <style id="layout-row" media="width:0">

    ::slotted([slot="header"]) {
      padding: .4em .5em;
    }

    #container {
      gap: var(--media-menu-gap, .25em);
      flex-direction: var(--media-menu-flex-direction, row);
      padding-inline: .5em;
    }

    media-chrome-menu-item {
      padding: .3em .24em;
    }

    media-chrome-menu-item[aria-checked="true"] {
      background: var(--media-menu-item-checked-background, rgb(255 255 255 / .2));
    }

    [part~="checked-indicator"] {
      display: var(--media-menu-item-checked-indicator-display, none);
    }
  </style>
  <slot name="header"></slot>
  <slot id="container"></slot>
  <slot name="checked-indicator" hidden>${checkIcon}</slot>
`;

export const Attributes = {
  STYLE: 'style',
  HIDDEN: 'hidden',
  DISABLED: 'disabled',
  ANCHOR: 'anchor',
};

/**
 * @extends {HTMLElement}
 *
 * @slot - Default slotted elements.
 * @slot header - An element shown at the top of the menu.
 * @slot checked-indicator - An icon element indicating a checked menu-item.
 *
 * @attr {boolean} disabled - The Boolean disabled attribute makes the element not mutable or focusable.
 * @attr {string} mediacontroller - The element `id` of the media controller to connect to (if not nested within).
 *
 * @cssproperty --media-primary-color - Default color of text / icon.
 * @cssproperty --media-secondary-color - Default color of background.
 * @cssproperty --media-text-color - `color` of text.
 *
 * @cssproperty --media-control-background - `background` of control.
 * @cssproperty --media-menu-layout - Set to `row` for a horizontal menu design.
 * @cssproperty --media-menu-flex-direction - `flex-direction` of menu.
 * @cssproperty --media-menu-gap - `gap` between menu items.
 * @cssproperty --media-menu-background - `background` of menu.
 * @cssproperty --media-menu-border-radius - `border-radius` of menu.
 *
 * @cssproperty --media-font - `font` shorthand property.
 * @cssproperty --media-font-weight - `font-weight` property.
 * @cssproperty --media-font-family - `font-family` property.
 * @cssproperty --media-font-size - `font-size` property.
 * @cssproperty --media-text-content-height - `line-height` of text.
 *
 * @cssproperty --media-icon-color - `fill` color of icon.
 * @cssproperty --media-menu-item-indicator-fill - `fill` color of indicator icon.
 * @cssproperty --media-menu-item-indicator-height - `height` of menu-item indicator.
 * @cssproperty --media-menu-item-indicator-vertical-align - `vertical-align` of menu-item indicator.
 * @cssproperty --media-menu-item-checked-indicator-display - `display` of check indicator.
 */
class MediaChromeMenu extends globalThis.HTMLElement {
  static template = template;

  static get observedAttributes() {
    return [
      Attributes.DISABLED,
      Attributes.HIDDEN,
      Attributes.STYLE,
      Attributes.ANCHOR,
      MediaStateReceiverAttributes.MEDIA_CONTROLLER,
    ];
  }

  static formatMenuItemText(text) {
    return text;
  }

  #mediaController;
  #previouslyFocused;
  #invokerElement;
  #keysSoFar = '';
  #clearKeysTimeout = null;

  constructor() {
    super();

    if (!this.shadowRoot) {
      // Set up the Shadow DOM if not using Declarative Shadow DOM.
      this.attachShadow({ mode: 'open' });

      // @ts-ignore
      this.nativeEl = this.constructor.template.content.cloneNode(true);
      this.shadowRoot.append(this.nativeEl);
    }

    this.container = this.shadowRoot.querySelector('#container');

    this.container.addEventListener('slotchange', (event) => {
      // @ts-ignore
      for (let node of event.target.assignedNodes({ flatten: true })) {
        // Remove all whitespace text nodes so the unnamed slot shows its fallback content.
        if (node.nodeType === 3 && node.textContent.trim() === '') {
          node.remove();
        }
      }
    });
  }

  enable() {
    this.addEventListener('click', this);
    this.addEventListener('focusout', this);
    this.addEventListener('keydown', this);
    this.addEventListener('invoke', this);
  }

  disable() {
    this.removeEventListener('click', this);
    this.removeEventListener('focusout', this);
    this.removeEventListener('keyup', this);
    this.removeEventListener('invoke', this);
  }

  handleEvent(event) {
    switch (event.type) {
      case 'invoke':
        this.#handleInvoke(event);
        break;
      case 'click':
        this.#handleClick(event);
        break;
      case 'focusout':
        this.#handleFocusOut(event);
        break;
      case 'keydown':
        this.#handleKeyDown(event);
        break;
    }
  }

  connectedCallback() {
    this.#updateLayoutStyle();

    if (!this.hasAttribute('disabled')) {
      this.enable();
    }

    if (!this.hasAttribute('role')) {
      // set menu role on the media-chrome-menu element itself
      // this is to make sure that SRs announce items as being part
      // of a menu when focused
      this.setAttribute('role', 'menu');
    }

    this.#mediaController = getAttributeMediaController(this);
    this.#mediaController?.associateElement?.(this);

    if (!this.hidden) {
      observeResize(getBoundsElement(this), this.#updateMenuPosition);
    }
  }

  disconnectedCallback() {
    unobserveResize(getBoundsElement(this), this.#updateMenuPosition);
    this.disable();

    // Use cached mediaController, getRootNode() doesn't work if disconnected.
    this.#mediaController?.unassociateElement?.(this);
    this.#mediaController = null;
  }

  attributeChangedCallback(attrName, oldValue, newValue) {
    if (attrName === Attributes.HIDDEN && newValue !== oldValue) {
        if (this.hidden) {
          this.#handleClosed();
        } else {
          this.#handleOpen();
        }
    } else if (attrName === MediaStateReceiverAttributes.MEDIA_CONTROLLER) {
      if (oldValue) {
        this.#mediaController?.unassociateElement?.(this);
        this.#mediaController = null;
      }
      if (newValue && this.isConnected) {
        this.#mediaController = getAttributeMediaController(this);
        this.#mediaController?.associateElement?.(this);
      }
    } else if (attrName === Attributes.DISABLED && newValue !== oldValue) {
      if (newValue == null) {
        this.enable();
      } else {
        this.disable();
      }
    } else if (attrName === Attributes.STYLE && newValue !== oldValue) {
      this.#updateLayoutStyle();
    }
  }

  formatMenuItemText(text, data) {
    // @ts-ignore
    return this.constructor.formatMenuItemText(text, data);
  }

  get hidden() {
    return super.hidden;
  }

  set hidden(value) {
    const hidden = !!value;
    super.hidden = hidden;

    this.dispatchEvent(
      new ToggleEvent({
        oldState: hidden ? 'open' : 'closed',
        newState: hidden ? 'closed' : 'open',
        bubbles: true,
      })
    );
  }

  get anchor() {
    return this.getAttribute('anchor');
  }

  set anchor(value) {
    this.setAttribute('anchor', `${value}`);
  }

  /**
   * Returns the anchor element when it is a floating menu.
   * @return {HTMLElement}
   */
  get anchorElement() {
    if (this.anchor) {
      return getDocumentOrShadowRoot(this)?.querySelector(`#${this.anchor}`);
    }
    return null;
  }

  get items() {
    // First query the light dom children for any items.

    /** @type NodeListOf<HTMLInputElement> */
    let items = this.querySelectorAll('[role^="menuitem"]');

    if (!items.length) {
      // Fallback to the items in the shadow dom.
      items = this.container?.querySelectorAll('[role^="menuitem"]');
    }

    return Array.from(items);
  }

  get radioGroupItems() {
    return this.items.filter(
      (item) => item.getAttribute('role') === 'menuitemradio'
    );
  }

  get checkedItems() {
    return this.items.filter((item) => item.checked);
  }

  get value() {
    return this.checkedItems[0]?.value ?? '';
  }

  set value(newValue) {
    const item = this.items.find((item) => item.value === newValue);

    if (!item) return;

    this.#selectItem(item);
  }

  #updateLayoutStyle() {
    const layoutRowStyle = this.shadowRoot.querySelector('#layout-row');
    const menuLayout = getComputedStyle(this)
      .getPropertyValue('--media-menu-layout')
      ?.trim();

    layoutRowStyle.setAttribute('media', menuLayout === 'row' ? '' : 'width:0');
  }

  #handleInvoke(event) {
    this.#invokerElement = event.relatedTarget;

    if (!containsComposedNode(this, event.relatedTarget)) {
      this.hidden = !this.hidden;
    }
  }

  #handleOpen() {
    this.#invokerElement?.setAttribute('aria-expanded', 'true');

    // Wait one animation frame so the element dimensions are updated.
    requestAnimationFrame(() => this.#updateMenuPosition());
    this.focus();

    observeResize(getBoundsElement(this), this.#updateMenuPosition);
  }

  #handleClosed() {
    this.#invokerElement?.setAttribute('aria-expanded', 'false');
    unobserveResize(getBoundsElement(this), this.#updateMenuPosition);
  }

  #updateMenuPosition = () => {
    // Can't position if the menu doesn't have an anchor and isn't a child of a media controller.
    if (this.hasAttribute('mediacontroller') && !this.anchor) return;

    // If the menu is hidden or there is no anchor, skip updating the menu position.
    if (this.hidden || !this.anchorElement) return;

    const { x, y } = computePosition({
      anchor: this.anchorElement,
      floating: this,
      placement: 'top-start',
    });

    const bounds = getBoundsElement(this);
    const boundsRect = bounds.getBoundingClientRect();
    const anchorRect = this.anchorElement.getBoundingClientRect();

    const right = boundsRect.width - x - this.offsetWidth;
    const bottom = boundsRect.height - y - this.offsetHeight;
    const maxHeight = boundsRect.height - anchorRect.height;

    const { style } = getOrInsertCSSRule(this.shadowRoot, ':host');
    style.setProperty('position', 'absolute');
    style.setProperty('right', `${Math.max(0, right)}px`);
    style.setProperty('bottom', `${bottom}px`);
    style.setProperty('--_menu-max-height', `${maxHeight}px`);
  };

  focus() {
    this.#previouslyFocused = getActiveElement();

    if (this.checkedItems.length) {
      this.checkedItems[0]?.focus();
      return;
    }

    if (this.items.length) {
      this.items[0]?.focus();
    }
  }

  #handleClick(event) {
    const item = this.#getItem(event);

    if (!item || item.hasAttribute('disabled')) return;

    this.items.forEach((el) => el.setAttribute('tabindex', '-1'));
    item.setAttribute('tabindex', '0');

    this.handleSelect(event);
  }

  #handleFocusOut(event) {
    if (!containsComposedNode(this, event.relatedTarget)) {
      this.#previouslyFocused?.focus();

      // If the menu was opened by a click, close it when selecting an item.
      if (this.#invokerElement && this.#invokerElement !== event.relatedTarget && !this.hidden) {
        this.hidden = true;
      }
    }
  }

  get keysUsed() {
    return ['Enter', 'Escape', ' ', 'ArrowDown', 'ArrowUp', 'Home', 'End'];
  }

  #handleKeyDown(event) {
    const { key, ctrlKey, altKey, metaKey } = event;

    if (ctrlKey || altKey || metaKey) {
      return;
    }

    if (!this.keysUsed.includes(key)) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();

    if (key === 'Escape') {
      this.hidden = true;
    } else if (key === 'Enter' || key === ' ') {
      this.handleSelect(event);
    } else {
      this.handleMove(event);
    }
  }

  handleSelect(event) {
    const item = this.#getItem(event);

    if (!item) return;

    this.#selectItem(item, item.type === 'checkbox');

    // If the menu was opened by a click, close it when selecting an item.
    if (this.#invokerElement && !this.hidden) {
      this.#previouslyFocused?.focus();
      this.hidden = true;
    }
  }

  #getItem(event) {
    // Prevent running this in a parent menu if the event target is a sub menu.
    if (event.target !== this) return;

    return event.composedPath().find((el) => {
      return ['menuitemradio', 'menuitemcheckbox'].includes(
        el.getAttribute?.('role')
      );
    });
  }

  #selectItem(item, toggle) {
    const oldCheckedItems = [...this.checkedItems];

    if (item.type === 'radio') {
      this.radioGroupItems.forEach((el) => (el.checked = false));
    }

    if (toggle) {
      item.checked = !item.checked;
    } else {
      item.checked = true;
    }

    if (this.checkedItems.some((opt, i) => opt != oldCheckedItems[i])) {
      this.dispatchEvent(
        new Event('change', { bubbles: true, composed: true })
      );
    }
  }

  handleMove(event) {
    const { key } = event;
    const activeItems = this.items.filter(opt => !opt.disabled);

    let currentItem = this.#getItem(event);

    if (!currentItem) {
      currentItem = activeItems.find((el) => el.tabIndex === 0) ?? activeItems[0];
    }

    const currentIndex = activeItems.indexOf(currentItem);
    let newIndex = Math.max(0, currentIndex);

    if (key === 'ArrowDown') {
      newIndex = Math.min(currentIndex + 1, activeItems.length - 1);
    } else if (key === 'ArrowUp') {
      newIndex = Math.max(0, currentIndex - 1);
    } else if (event.key === 'Home') {
      newIndex = 0;
    } else if (event.key === 'End') {
      newIndex = activeItems.length - 1;
    }

    this.items.forEach(item => (item.tabIndex = -1));

    currentItem = activeItems[newIndex];
    currentItem.tabIndex = 0;
    currentItem.focus();
  }
}

function getBoundsElement(host) {
  return (
    (host.getAttribute('bounds')
      ? closestComposedNode(host, `#${host.getAttribute('bounds')}`)
      : getMediaController(host) || host.parentElement) ?? host
  );
}

if (!globalThis.customElements.get('media-chrome-menu')) {
  globalThis.customElements.define('media-chrome-menu', MediaChromeMenu);
}

export { MediaChromeMenu };
export default MediaChromeMenu;
