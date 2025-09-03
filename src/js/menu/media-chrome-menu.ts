import { MediaStateReceiverAttributes } from '../constants.js';
import { globalThis, document } from '../utils/server-safe-globals.js';
import { computePosition } from '../utils/anchor-utils.js';
import { observeResize, unobserveResize } from '../utils/resize-observer.js';
import { ToggleEvent, InvokeEvent } from '../utils/events.js';
import {
  getActiveElement,
  containsComposedNode,
  closestComposedNode,
  insertCSSRule,
  getMediaController,
  getAttributeMediaController,
  getDocumentOrShadowRoot,
  namedNodeMapToObject,
} from '../utils/element-utils.js';
import MediaChromeMenuItem from './media-chrome-menu-item.js';
import MediaController from '../media-controller.js';

export function createMenuItem({
  type,
  text,
  value,
  checked,
}: {
  type?: string;
  text: string;
  value: string;
  checked: boolean;
}) {
  const item = document.createElement(
    'media-chrome-menu-item'
  ) as MediaChromeMenuItem;

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

export function createIndicator(el: HTMLElement, name: string) {
  let customIndicator = el.querySelector(`:scope > [slot="${name}"]`);

  // Chaining slots
  if (customIndicator?.nodeName == 'SLOT')
    // @ts-ignore
    customIndicator = customIndicator.assignedElements({ flatten: true })[0];

  if (customIndicator) {
    // @ts-ignore
    customIndicator = customIndicator.cloneNode(true);
    return customIndicator;
  }

  const fallbackIndicator = el.shadowRoot.querySelector(
    `[name="${name}"] > svg`
  );
  if (fallbackIndicator) {
    return fallbackIndicator.cloneNode(true);
  }

  // Return an empty string if no indicator is found to use the slot fallback.
  return '';
}

function getTemplateHTML(_attrs: Record<string, string>) {
  return /*html*/ `
    <style>
      :host {
        font: var(--media-font,
          var(--media-font-weight, normal)
          var(--media-font-size, 14px) /
          var(--media-text-content-height, var(--media-control-height, 24px))
          var(--media-font-family, helvetica neue, segoe ui, roboto, arial, sans-serif));
        color: var(--media-text-color, var(--media-primary-color, rgb(238 238 238)));
        --_menu-bg: rgb(20 20 30 / .8);
        background: var(--media-menu-background, var(--media-control-background, var(--media-secondary-color, var(--_menu-bg))));
        border-radius: var(--media-menu-border-radius);
        border: var(--media-menu-border, none);
        display: var(--media-menu-display, inline-flex) !important;
        ${/* ^^Prevent override by Tailwind CSS causing the menu to not hide properly. */ ''}
        transition: var(--media-menu-transition-in,
          visibility 0s,
          opacity .2s ease-out,
          transform .15s ease-out,
          left .2s ease-in-out,
          min-width .2s ease-in-out,
          min-height .2s ease-in-out
        ) !important;
        ${/* ^^Prevent transition override by media-container */ ''}
        visibility: var(--media-menu-visibility, visible);
        opacity: var(--media-menu-opacity, 1);
        max-height: var(--media-menu-max-height, var(--_menu-max-height, 300px));
        transform: var(--media-menu-transform-in, translateY(0) scale(1));
        flex-direction: column;
        ${/* Prevent overflowing a flex container */ ''}
        min-height: 0;
        position: relative;
        bottom: var(--_menu-bottom);
        box-sizing: border-box;
      } 

      @-moz-document url-prefix() {
        :host{
          --_menu-bg: rgb(20 20 30);
        }
      }

      :host([hidden]) {
        transition: var(--media-menu-transition-out,
          visibility .15s ease-in,
          opacity .15s ease-in,
          transform .15s ease-in
        ) !important;
        visibility: var(--media-menu-hidden-visibility, hidden);
        opacity: var(--media-menu-hidden-opacity, 0);
        max-height: var(--media-menu-hidden-max-height,
          var(--media-menu-max-height, var(--_menu-max-height, 300px)));
        transform: var(--media-menu-transform-out, translateY(2px) scale(.99));
        pointer-events: none;
      }

      :host([slot="submenu"]) {
        background: none;
        width: 100%;
        min-height: 100%;
        position: absolute;
        bottom: 0;
        right: -100%;
      }

      #container {
        display: flex;
        flex-direction: column;
        min-height: 0;
        transition: transform .2s ease-out;
        transform: translate(0, 0);
      }

      #container.has-expanded {
        transition: transform .2s ease-in;
        transform: translate(-100%, 0);
      }

      button {
        background: none;
        color: inherit;
        border: none;
        padding: 0;
        font: inherit;
        outline: inherit;
        display: inline-flex;
        align-items: center;
      }

      slot[name="header"][hidden] {
        display: none;
      }

      slot[name="header"] > *,
      slot[name="header"]::slotted(*) {
        padding: .4em .7em;
        border-bottom: 1px solid rgb(255 255 255 / .25);
        cursor: var(--media-cursor, default);
      }

      slot[name="header"] > button[part~="back"],
      slot[name="header"]::slotted(button[part~="back"]) {
        cursor: var(--media-cursor, pointer);
      }

      svg[part~="back"] {
        height: var(--media-menu-icon-height, var(--media-control-height, 24px));
        fill: var(--media-icon-color, var(--media-primary-color, rgb(238 238 238)));
        display: block;
        margin-right: .5ch;
      }

      slot:not([name]) {
        gap: var(--media-menu-gap);
        flex-direction: var(--media-menu-flex-direction, column);
        overflow: var(--media-menu-overflow, hidden auto);
        display: flex;
        min-height: 0;
      }

      :host([role="menu"]) slot:not([name]) {
        padding-block: .4em;
      }

      slot:not([name])::slotted([role="menu"]) {
        background: none;
      }

      media-chrome-menu-item > span {
        margin-right: .5ch;
        max-width: var(--media-menu-item-max-width);
        text-overflow: ellipsis;
        overflow: hidden;
      }
    </style>
    <style id="layout-row" media="width:0">

      slot[name="header"] > *,
      slot[name="header"]::slotted(*) {
        padding: .4em .5em;
      }

      slot:not([name]) {
        gap: var(--media-menu-gap, .25em);
        flex-direction: var(--media-menu-flex-direction, row);
        padding-inline: .5em;
      }

      media-chrome-menu-item {
        padding: .3em .5em;
      }

      media-chrome-menu-item[aria-checked="true"] {
        background: var(--media-menu-item-checked-background, rgb(255 255 255 / .2));
      }

      ${/* In row layout hide the checked indicator completely. */ ''}
      media-chrome-menu-item::part(checked-indicator) {
        display: var(--media-menu-item-checked-indicator-display, none);
      }
    </style>
    <div id="container" part="container">
      <slot name="header" hidden>
        <button part="back button" aria-label="Back to previous menu">
          <slot name="back-icon">
            <svg aria-hidden="true" viewBox="0 0 20 24" part="back indicator">
              <path d="m11.88 17.585.742-.669-4.2-4.665 4.2-4.666-.743-.669-4.803 5.335 4.803 5.334Z"/>
            </svg>
          </slot>
          <slot name="title"></slot>
        </button>
      </slot>
      <slot></slot>
    </div>
    <slot name="checked-indicator" hidden></slot>
  `;
}

export const Attributes = {
  STYLE: 'style',
  HIDDEN: 'hidden',
  DISABLED: 'disabled',
  ANCHOR: 'anchor',
} as const;

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
 * @cssproperty --media-menu-display - `display` of menu.
 * @cssproperty --media-menu-layout - Set to `row` for a horizontal menu design.
 * @cssproperty --media-menu-flex-direction - `flex-direction` of menu.
 * @cssproperty --media-menu-gap - `gap` between menu items.
 * @cssproperty --media-menu-background - `background` of menu.
 * @cssproperty --media-menu-border-radius - `border-radius` of menu.
 * @cssproperty --media-menu-border - `border` of menu.
 * @cssproperty --media-menu-transition-in - `transition` of menu when showing.
 * @cssproperty --media-menu-transition-out - `transition` of menu when hiding.
 * @cssproperty --media-menu-visibility - `visibility` of menu when showing.
 * @cssproperty --media-menu-hidden-visibility - `visibility` of menu when hiding.
 * @cssproperty --media-menu-max-height - `max-height` of menu.
 * @cssproperty --media-menu-hidden-max-height - `max-height` of menu when hiding.
 * @cssproperty --media-menu-opacity - `opacity` of menu when showing.
 * @cssproperty --media-menu-hidden-opacity - `opacity` of menu when hiding.
 * @cssproperty --media-menu-transform-in - `transform` of menu when showing.
 * @cssproperty --media-menu-transform-out - `transform` of menu when hiding.
 *
 * @cssproperty --media-font - `font` shorthand property.
 * @cssproperty --media-font-weight - `font-weight` property.
 * @cssproperty --media-font-family - `font-family` property.
 * @cssproperty --media-font-size - `font-size` property.
 * @cssproperty --media-text-content-height - `line-height` of text.
 *
 * @cssproperty --media-icon-color - `fill` color of icon.
 * @cssproperty --media-menu-icon-height - `height` of icon.
 * @cssproperty --media-menu-item-checked-indicator-display - `display` of check indicator.
 * @cssproperty --media-menu-item-checked-background - `background` of checked menu item.
 * @cssproperty --media-menu-item-max-width - `max-width` of menu item text.
 */
class MediaChromeMenu extends globalThis.HTMLElement {
  static shadowRootOptions = { mode: 'open' as ShadowRootMode };
  static getTemplateHTML = getTemplateHTML;

  static get observedAttributes(): string[] {
    return [
      Attributes.DISABLED,
      Attributes.HIDDEN,
      Attributes.STYLE,
      Attributes.ANCHOR,
      MediaStateReceiverAttributes.MEDIA_CONTROLLER,
    ];
  }

  static formatMenuItemText(text: string, _data?: any): string {
    return text;
  }

  #mediaController: MediaController | null = null;
  #previouslyFocused: HTMLElement | null = null;
  #invokerElement: HTMLElement | null = null;
  #previousItems = new Set<MediaChromeMenuItem>();
  #mutationObserver: MutationObserver;
  #isPopover = false;
  #cssRule: CSSStyleRule | null = null;

  container: HTMLElement;
  defaultSlot: HTMLSlotElement;

  constructor() {
    super();

    if (!this.shadowRoot) {
      // Set up the Shadow DOM if not using Declarative Shadow DOM.
      this.attachShadow((this.constructor as typeof MediaChromeMenu).shadowRootOptions);

      const attrs = namedNodeMapToObject(this.attributes);
      this.shadowRoot.innerHTML = (this.constructor as typeof MediaChromeMenu).getTemplateHTML(attrs);
    }

    this.container = this.shadowRoot.querySelector('#container') as HTMLElement;
    this.defaultSlot = this.shadowRoot.querySelector(
      'slot:not([name])'
    ) as HTMLSlotElement;

    this.shadowRoot.addEventListener('slotchange', this);

    this.#mutationObserver = new MutationObserver(this.#handleMenuItems);
    this.#mutationObserver.observe(this.defaultSlot, { childList: true });
  }

  enable(): void {
    this.addEventListener('click', this);
    this.addEventListener('focusout', this);
    this.addEventListener('keydown', this);
    this.addEventListener('invoke', this);
    this.addEventListener('toggle', this);
  }

  disable(): void {
    this.removeEventListener('click', this);
    this.removeEventListener('focusout', this);
    this.removeEventListener('keyup', this);
    this.removeEventListener('invoke', this);
    this.removeEventListener('toggle', this);
  }

  handleEvent(event: Event): void {
    switch (event.type) {
      case 'slotchange':
        this.#handleSlotChange(event as Event);
        break;
      case 'invoke':
        this.#handleInvoke(event as InvokeEvent);
        break;
      case 'click':
        this.#handleClick(event as MouseEvent);
        break;
      case 'toggle':
        this.#handleToggle(event as ToggleEvent);
        break;
      case 'focusout':
        this.#handleFocusOut(event as FocusEvent);
        break;
      case 'keydown':
        this.#handleKeyDown(event as KeyboardEvent);
        break;
    }
  }

  connectedCallback(): void {
    this.#cssRule = insertCSSRule(this.shadowRoot, ':host');

    this.#updateLayoutStyle();

    if (!this.hasAttribute('disabled')) {
      this.enable();
    }

    if (!this.role) {
      // set menu role on the media-chrome-menu element itself
      // this is to make sure that SRs announce items as being part
      // of a menu when focused
      this.role = 'menu';
    }

    this.#mediaController = getAttributeMediaController(this);
    this.#mediaController?.associateElement?.(this);

    if (!this.hidden) {
      observeResize(getBoundsElement(this), this.#handleBoundsResize);
      observeResize(this, this.#handleMenuResize);
    }

    // Required when using declarative shadow DOM.
    this.#toggleHeader();
  }

  disconnectedCallback(): void {
    unobserveResize(getBoundsElement(this), this.#handleBoundsResize);
    unobserveResize(this, this.#handleMenuResize);

    this.disable();

    // Use cached mediaController, getRootNode() doesn't work if disconnected.
    this.#mediaController?.unassociateElement?.(this);
    this.#mediaController = null;
  }

  attributeChangedCallback(
    attrName: string,
    oldValue: string | null,
    newValue: string | null
  ): void {
    if (attrName === Attributes.HIDDEN && newValue !== oldValue) {
      if (!this.#isPopover) this.#isPopover = true;

      if (this.hidden) {
        this.#handleClosed();
      } else {
        this.#handleOpen();
      }

      // Fire a toggle event from a submenu which can be used in a parent menu.
      this.dispatchEvent(
        new ToggleEvent({
          oldState: this.hidden ? 'open' : 'closed',
          newState: this.hidden ? 'closed' : 'open',
          bubbles: true,
        })
      );
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

  formatMenuItemText(text: string, data?: any) {
    return (this.constructor as typeof MediaChromeMenu).formatMenuItemText(
      text,
      data
    );
  }

  get anchor() {
    return this.getAttribute('anchor');
  }

  set anchor(value: string) {
    this.setAttribute('anchor', `${value}`);
  }

  /**
   * Returns the anchor element when it is a floating menu.
   */
  get anchorElement() {
    if (this.anchor) {
      return getDocumentOrShadowRoot(this)?.querySelector<HTMLElement>(
        `#${this.anchor}`
      );
    }
    return null;
  }

  /**
   * Returns the menu items.
   */
  get items(): MediaChromeMenuItem[] {
    return this.defaultSlot
      .assignedElements({ flatten: true })
      .filter(isMenuItem);
  }

  get radioGroupItems(): MediaChromeMenuItem[] {
    return this.items.filter((item) => item.role === 'menuitemradio');
  }

  get checkedItems(): MediaChromeMenuItem[] {
    return this.items.filter((item) => item.checked);
  }

  get value(): string {
    return this.checkedItems[0]?.value ?? '';
  }

  set value(newValue: string) {
    const item = this.items.find((item) => item.value === newValue);

    if (!item) return;

    this.#selectItem(item);
  }

  #handleSlotChange(event: Event) {
    const slot = event.target as HTMLSlotElement;

    // @ts-ignore
    for (const node of slot.assignedNodes({ flatten: true }) as HTMLElement[]) {
      // Remove all whitespace text nodes so the unnamed slot shows its fallback content.
      if (node.nodeType === 3 && node.textContent.trim() === '') {
        node.remove();
      }
    }

    if (['header', 'title'].includes(slot.name)) {
      this.#toggleHeader();
    }

    if (!slot.name) {
      this.#handleMenuItems();
    }
  }

  #toggleHeader() {
    const header = this.shadowRoot.querySelector(
      'slot[name="header"]'
    ) as HTMLSlotElement;
    const title = this.shadowRoot.querySelector(
      'slot[name="title"]'
    ) as HTMLSlotElement;

    header.hidden =
      title.assignedNodes().length === 0 && header.assignedNodes().length === 0;
  }

  /**
   * Fires an event when a menu item is added or removed.
   * This is needed to update the description slot of an ancestor menu item.
   */
  #handleMenuItems = () => {
    const previousItems = this.#previousItems;
    const currentItems = new Set(this.items);

    for (const item of previousItems) {
      if (!currentItems.has(item)) {
        this.dispatchEvent(new CustomEvent('removemenuitem', { detail: item }));
      }
    }

    for (const item of currentItems) {
      if (!previousItems.has(item)) {
        this.dispatchEvent(new CustomEvent('addmenuitem', { detail: item }));
      }
    }

    this.#previousItems = currentItems;
  };

  /**
   * Sets the layout style for the menu.
   * It can be a row or column layout. e.g. playback-rate-menu
   */
  #updateLayoutStyle() {
    const layoutRowStyle = this.shadowRoot.querySelector('#layout-row');
    const menuLayout = getComputedStyle(this)
      .getPropertyValue('--media-menu-layout')
      ?.trim();

    layoutRowStyle.setAttribute('media', menuLayout === 'row' ? '' : 'width:0');
  }

  #handleInvoke(event: InvokeEvent) {
    this.#invokerElement = event.relatedTarget as HTMLElement;

    if (!containsComposedNode(this, event.relatedTarget)) {
      this.hidden = !this.hidden;
    }
  }

  #handleOpen() {
    this.#invokerElement?.setAttribute('aria-expanded', 'true');

    // Focus when the transition ends.
    this.addEventListener('transitionend', () => this.focus(), { once: true });

    // A resize callback is also fired when the menu is opened.
    observeResize(getBoundsElement(this), this.#handleBoundsResize);
    observeResize(this, this.#handleMenuResize);
  }

  #handleClosed() {
    this.#invokerElement?.setAttribute('aria-expanded', 'false');

    unobserveResize(getBoundsElement(this), this.#handleBoundsResize);
    unobserveResize(this, this.#handleMenuResize);
  }

  #handleBoundsResize = () => {
    this.#positionMenu();
    this.#resizeMenu(false);
  };

  #handleMenuResize = () => {
    this.#positionMenu();
  };

  /**
   * Updates the popover menu position based on the anchor element.
   * @param  {number} [menuWidth]
   */
  #positionMenu(menuWidth?: number) {
    // Can't position if the menu doesn't have an anchor and isn't a child of a media controller.
    if (this.hasAttribute('mediacontroller') && !this.anchor) return;

    // If the menu is hidden or there is no anchor, skip updating the menu position.
    if (this.hidden || !this.anchorElement) return;

    const { x, y } = computePosition({
      anchor: this.anchorElement,
      floating: this,
      placement: 'top-start',
    });

    menuWidth ??= this.offsetWidth;

    const bounds = getBoundsElement(this);
    const boundsRect = bounds.getBoundingClientRect();

    const right = boundsRect.width - x - menuWidth;
    const bottom = boundsRect.height - y - this.offsetHeight;

    const { style } = this.#cssRule;
    style.setProperty('position', 'absolute');
    style.setProperty('right', `${Math.max(0, right)}px`);
    style.setProperty('--_menu-bottom', `${bottom}px`);

    // Determine the real bottom value that is used for the max-height calculation.
    // `bottom` could have been overridden externally.
    const computedStyle = getComputedStyle(this);
    const isBottomCalc =
      style.getPropertyValue('--_menu-bottom') === computedStyle.bottom;
    const realBottom = isBottomCalc ? bottom : parseFloat(computedStyle.bottom);
    const maxHeight =
      boundsRect.height - realBottom - parseFloat(computedStyle.marginBottom);

    // Safari required directly setting the element style property instead of
    // updating the style node for the styles to be refreshed.
    this.style.setProperty('--_menu-max-height', `${maxHeight}px`);
  }

  /**
   * Resize this menu to fit the submenu.
   * @param  {boolean} animate
   */
  #resizeMenu(animate: boolean) {
    const expandedMenuItem = this.querySelector(
      '[role="menuitem"][aria-haspopup][aria-expanded="true"]'
    ) as MediaChromeMenuItem;

    const expandedSubmenu = expandedMenuItem?.querySelector(
      '[role="menu"]'
    ) as MediaChromeMenu;

    const { style } = this.#cssRule;

    if (!animate) {
      style.setProperty('--media-menu-transition-in', 'none');
    }

    if (expandedSubmenu) {
      const height = expandedSubmenu.offsetHeight;
      const width = Math.max(
        expandedSubmenu.offsetWidth,
        expandedMenuItem.offsetWidth
      );

      // Safari required directly setting the style property instead of
      // updating the style node for the min-width or min-height to work.
      this.style.setProperty('min-width', `${width}px`);
      this.style.setProperty('min-height', `${height}px`);

      this.#positionMenu(width);
    } else {
      this.style.removeProperty('min-width');
      this.style.removeProperty('min-height');

      this.#positionMenu();
    }

    style.removeProperty('--media-menu-transition-in');
  }

  focus() {
    this.#previouslyFocused = getActiveElement();

    if (this.items.length) {
      this.#setTabItem(this.items[0]);
      this.items[0].focus();
      return;
    }

    // If there are no menu items, focus on the first focusable child.
    const focusable = this.querySelector(
      '[autofocus], [tabindex]:not([tabindex="-1"]), [role="menu"]'
    ) as HTMLElement;
    focusable?.focus();
  }

  #handleClick(event: MouseEvent) {
    // Prevent running this in a parent menu if the event target is a sub menu.
    event.stopPropagation();

    if (event.composedPath().includes(this.#backButtonElement)) {
      this.#previouslyFocused?.focus();
      this.hidden = true;
      return;
    }

    const item = this.#getItem(event);

    if (!item || item.hasAttribute('disabled')) return;

    this.#setTabItem(item);
    this.handleSelect(event);
  }

  get #backButtonElement() {
    const headerSlot = this.shadowRoot.querySelector(
      'slot[name="header"]'
    ) as HTMLSlotElement;
    return headerSlot
      .assignedElements({ flatten: true })
      ?.find((el) => el.matches('button[part~="back"]')) as HTMLElement;
  }

  handleSelect(event: MouseEvent | KeyboardEvent): void {
    const item = this.#getItem(event);
    if (!item) return;

    this.#selectItem(item, item.type === 'checkbox');

    // If the menu was opened by a click, close it when selecting an item.
    if (this.#invokerElement && !this.hidden) {
      this.#previouslyFocused?.focus();
      this.hidden = true;
    }
  }

  /**
   * Handle the toggle event of submenus.
   * Closes all other open submenus when opening a submenu.
   * Resizes this menu to fit the submenu.
   *
   * @param  {ToggleEvent} event
   */
  #handleToggle(event: ToggleEvent): void {
    // Only handle events of submenus.
    if (event.target === this) return;

    this.#checkSubmenuHasExpanded();

    const menuItemsWithSubmenu = Array.from(
      this.querySelectorAll('[role="menuitem"][aria-haspopup]')
    ) as MediaChromeMenuItem[];

    // Close all other open submenus.
    for (const item of menuItemsWithSubmenu) {
      if (item.invokeTargetElement == event.target) continue;

      if (
        event.newState == 'open' &&
        item.getAttribute('aria-expanded') == 'true' &&
        !item.invokeTargetElement.hidden
      ) {
        item.invokeTargetElement.dispatchEvent(
          new InvokeEvent({ relatedTarget: item })
        );
      }
    }

    // Keep the aria-expanded attribute in sync with the hidden state of the submenu.
    // This is needed when loading media-chrome with an unhidden submenu.
    for (const item of menuItemsWithSubmenu) {
      item.setAttribute('aria-expanded', `${!item.submenuElement.hidden}`);
    }

    this.#resizeMenu(true);
  }

  /**
   * Check if any submenu is expanded and update the container class accordingly.
   * When the CSS :has() selector is supported, this can be done with CSS only.
   */
  #checkSubmenuHasExpanded() {
    const selector = '[role="menuitem"] > [role="menu"]:not([hidden])';
    const expandedMenuItem = this.querySelector(selector);
    this.container.classList.toggle('has-expanded', !!expandedMenuItem);
  }

  #handleFocusOut(event: FocusEvent) {
    if (!containsComposedNode(this, event.relatedTarget as Node)) {
      if (this.#isPopover) {
        this.#previouslyFocused?.focus();
      }

      // If the menu was opened by a click, close it when selecting an item.
      if (
        this.#invokerElement &&
        this.#invokerElement !== event.relatedTarget &&
        !this.hidden
      ) {
        this.hidden = true;
      }
    }
  }

  get keysUsed() {
    return [
      'Enter',
      'Escape',
      'Tab',
      ' ',
      'ArrowDown',
      'ArrowUp',
      'Home',
      'End',
    ];
  }

  #handleKeyDown(event: KeyboardEvent) {
    const { key, ctrlKey, altKey, metaKey } = event;

    if (ctrlKey || altKey || metaKey) {
      return;
    }

    if (!this.keysUsed.includes(key)) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();

    if (key === 'Tab') {
      if (this.#isPopover) {
        // Close all menus when tabbing out.
        this.hidden = true;
        return;
      }

      // Move focus to the previous focusable element.
      if (event.shiftKey) {
        (this.previousElementSibling as HTMLElement)?.focus?.();
      } else {
        // Move focus to the next focusable element.
        (this.nextElementSibling as HTMLElement)?.focus?.();
      }

      // Go back to the previous focused element.
      this.blur();
    } else if (key === 'Escape') {
      // Go back to the previous menu or close the menu.
      this.#previouslyFocused?.focus();

      if (this.#isPopover) {
        this.hidden = true;
      }
    } else if (key === 'Enter' || key === ' ') {
      this.handleSelect(event);
    } else {
      this.handleMove(event);
    }
  }

  #getItem(event: MouseEvent | KeyboardEvent) {
    return event.composedPath().find((el) => {
      return ['menuitemradio', 'menuitemcheckbox'].includes(
        (el as HTMLElement).role
      );
    }) as MediaChromeMenuItem | undefined;
  }

  #getTabItem() {
    return this.items.find((item) => item.tabIndex === 0);
  }

  #setTabItem(tabItem: MediaChromeMenuItem) {
    for (const item of this.items) {
      item.tabIndex = item === tabItem ? 0 : -1;
    }
  }

  #selectItem(item: MediaChromeMenuItem, toggle?: boolean) {
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

  handleMove(event: KeyboardEvent) {
    const { key } = event;
    const items = this.items;

    const currentItem = this.#getItem(event) ?? this.#getTabItem() ?? items[0];
    const currentIndex = items.indexOf(currentItem);
    let index = Math.max(0, currentIndex);

    if (key === 'ArrowDown') {
      index++;
    } else if (key === 'ArrowUp') {
      index--;
    } else if (event.key === 'Home') {
      index = 0;
    } else if (event.key === 'End') {
      index = items.length - 1;
    }

    if (index < 0) {
      index = items.length - 1;
    }

    if (index > items.length - 1) {
      index = 0;
    }

    this.#setTabItem(items[index]);
    items[index].focus();
  }
}

function isMenuItem(element: any): element is MediaChromeMenuItem {
  return ['menuitem', 'menuitemradio', 'menuitemcheckbox'].includes(
    element?.role
  );
}

function getBoundsElement(host: HTMLElement) {
  return ((host.getAttribute('bounds')
    ? closestComposedNode(host, `#${host.getAttribute('bounds')}`)
    : getMediaController(host) || host.parentElement) ?? host) as HTMLElement;
}

if (!globalThis.customElements.get('media-chrome-menu')) {
  globalThis.customElements.define('media-chrome-menu', MediaChromeMenu);
}

export { MediaChromeMenu };
export default MediaChromeMenu;
