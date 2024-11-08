import { globalThis } from './utils/server-safe-globals.js';
import {
  containsComposedNode,
  getActiveElement,
  namedNodeMapToObject,
} from './utils/element-utils.js';
import { InvokeEvent } from './utils/events.js';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
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
        display: var(--media-dialog-display, inline-flex);
        width: 100%;
        height: 100%;
        justify-content: center;
        align-items: center;
        transition: visibility 0s, opacity .2s ease-out, transform .15s ease-out !important;
        ${/* ^^Prevent transition override by media-container */ ''}
        transform: translateY(0) scale(1);
      }

      :host([hidden]) {
        transition: visibility .15s ease-in, opacity .15s ease-in, transform .15s ease-in !important;
        visibility: hidden;
        opacity: 0;
        transform: translateY(2px) scale(.99);
        pointer-events: none;
      }

      #content {
        display: flex;
        position: relative;
        box-sizing: border-box;
        width: min(320px, 100%);
        word-wrap: break-word;
        max-height: 100%;
        overflow: auto;
        text-align: center;
        line-height: 1.4;
      }
    </style>
  `;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function getSlotTemplateHTML(_attrs: Record<string, string>) {
  return /*html*/ `
    <slot id="content"></slot>
  `;
}

export const Attributes = {
  HIDDEN: 'hidden',
  ANCHOR: 'anchor',
};

/**
 * @extends {HTMLElement}
 *
 * @slot - Default slotted elements.
 *
 * @cssproperty --media-primary-color - Default color of text / icon.
 * @cssproperty --media-secondary-color - Default color of background.
 * @cssproperty --media-text-color - `color` of text.
 *
 * @cssproperty --media-control-background - `background` of control.
 * @cssproperty --media-dialog-display - `display` of dialog.
 *
 * @cssproperty --media-font - `font` shorthand property.
 * @cssproperty --media-font-weight - `font-weight` property.
 * @cssproperty --media-font-family - `font-family` property.
 * @cssproperty --media-font-size - `font-size` property.
 * @cssproperty --media-text-content-height - `line-height` of text.
 */
class MediaChromeDialog extends globalThis.HTMLElement {
  static getTemplateHTML = getTemplateHTML;
  static getSlotTemplateHTML = getSlotTemplateHTML;

  static get observedAttributes() {
    return [Attributes.HIDDEN, Attributes.ANCHOR];
  }

  #isInit = false;
  #previouslyFocused: HTMLElement | null = null;
  #invokerElement: HTMLElement | null = null;

  nativeEl: HTMLElement;

  constructor() {
    super();

    this.addEventListener('invoke', this);
    this.addEventListener('focusout', this);
    this.addEventListener('keydown', this);
  }

  #init() {
    if (this.#isInit) return;
    this.#isInit = true;

    if (!this.shadowRoot) {
      // Set up the Shadow DOM if not using Declarative Shadow DOM.
      this.attachShadow({ mode: 'open' });

      const attrs = namedNodeMapToObject(this.attributes);

      this.shadowRoot.innerHTML = /*html*/ `
        ${(this.constructor as typeof MediaChromeDialog).getTemplateHTML(attrs)}
        ${(this.constructor as typeof MediaChromeDialog).getSlotTemplateHTML(attrs)}
      `;
    }
  }

  handleEvent(event: Event) {
    switch (event.type) {
      case 'invoke':
        this.#handleInvoke(event as InvokeEvent);
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
    this.#init();

    if (!this.role) {
      this.role = 'dialog';
    }
  }

  attributeChangedCallback(attrName: string, oldValue: string | null, newValue: string | null) {
    this.#init();

    if (attrName === Attributes.HIDDEN && newValue !== oldValue) {
      if (this.hidden) {
        this.#handleClosed();
      } else {
        this.#handleOpen();
      }
    }
  }

  #handleOpen() {
    this.#invokerElement?.setAttribute('aria-expanded', 'true');
    // Focus when the transition ends.
    this.addEventListener('transitionend', () => this.focus(), { once: true });
  }

  #handleClosed() {
    this.#invokerElement?.setAttribute('aria-expanded', 'false');
  }

  focus() {
    this.#previouslyFocused = getActiveElement();

    const focusable: HTMLElement | null = this.querySelector(
      '[autofocus], [tabindex]:not([tabindex="-1"]), [role="menu"]'
    );
    focusable?.focus();
  }

  #handleInvoke(event: InvokeEvent) {
    this.#invokerElement = event.relatedTarget as HTMLElement;

    if (!containsComposedNode(this, event.relatedTarget as Node)) {
      this.hidden = !this.hidden;
    }
  }

  #handleFocusOut(event: FocusEvent) {
    if (!containsComposedNode(this, event.relatedTarget as Node)) {
      this.#previouslyFocused?.focus();

      // If the menu was opened by a click, close it when selecting an item.
      if (this.#invokerElement && this.#invokerElement !== event.relatedTarget && !this.hidden) {
        this.hidden = true;
      }
    }
  }

  get keysUsed() {
    return ['Escape', 'Tab'];
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
      this.hidden = true;
    }
  }
}

if (!globalThis.customElements.get('media-chrome-dialog')) {
  globalThis.customElements.define('media-chrome-dialog', MediaChromeDialog);
}

export { MediaChromeDialog };
export default MediaChromeDialog;
