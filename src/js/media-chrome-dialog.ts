import { globalThis } from './utils/server-safe-globals.js';
import {
  containsComposedNode,
  getActiveElement,
  getBooleanAttr,
  namedNodeMapToObject,
  setBooleanAttr,
  getOrInsertCSSRule,
} from './utils/element-utils.js';
import { InvokeEvent } from './utils/events.js';

/**
 * Get the template HTML for the dialog with the given attributes.
 *
 * This is a static method that can be called on the class and can be
 * overridden by subclasses to customize the template.
 *
 * Another static method, `getSlotTemplateHTML`, is called by this method
 * which can be separately overridden to customize the slot template.
 */
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
        justify-content: center;
        align-items: center;
        ${
          /** The hide transition is defined below after a short delay. */ ''
        }
        transition-behavior: allow-discrete;
        visibility: hidden;
        opacity: 0;
        transform: translateY(2px) scale(.99);
        pointer-events: none;
      }

      :host([open]) {
        transition: display .2s, visibility 0s, opacity .2s ease-out, transform .15s ease-out;
        visibility: visible;
        opacity: 1;
        transform: translateY(0) scale(1);
        pointer-events: auto;
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
    ${this.getSlotTemplateHTML(_attrs)}
  `;
}

/**
 * Get the slot template HTML for the dialog with the given attributes.
 *
 * This is a static method that can be called on the class and can be
 * overridden by subclasses to customize the slot template.
 */
function getSlotTemplateHTML(_attrs: Record<string, string>) {
  return /*html*/ `
    <slot id="content"></slot>
  `;
}

export const Attributes = {
  OPEN: 'open',
  ANCHOR: 'anchor',
};

/**
 * @extends {HTMLElement}
 *
 * @slot - Default slotted elements.
 *
 * @attr {boolean} open - The open state of the dialog.
 *
 * @cssproperty --media-primary-color - Default color of text / icon.
 * @cssproperty --media-secondary-color - Default color of background.
 * @cssproperty --media-text-color - `color` of text.
 *
 * @cssproperty --media-dialog-display - `display` of dialog.
 *
 * @cssproperty --media-font - `font` shorthand property.
 * @cssproperty --media-font-weight - `font-weight` property.
 * @cssproperty --media-font-family - `font-family` property.
 * @cssproperty --media-font-size - `font-size` property.
 * @cssproperty --media-text-content-height - `line-height` of text.
 *
 * @event {Event} open - Dispatched when the dialog is opened.
 * @event {Event} close - Dispatched when the dialog is closed.
 * @event {Event} focus - Dispatched when the dialog is focused.
 * @event {Event} focusin - Dispatched when the dialog is focused in.
 */
class MediaChromeDialog extends globalThis.HTMLElement {
  static shadowRootOptions = { mode: 'open' as ShadowRootMode };
  static getTemplateHTML = getTemplateHTML;
  static getSlotTemplateHTML = getSlotTemplateHTML;

  static get observedAttributes() {
    return [Attributes.OPEN, Attributes.ANCHOR];
  }

  #isInit = false;
  #previouslyFocused: HTMLElement | null = null;
  #invokerElement: HTMLElement | null = null;

  constructor() {
    super();

    this.addEventListener('invoke', this);
    this.addEventListener('focusout', this);
    this.addEventListener('keydown', this);
  }

  get open() {
    return getBooleanAttr(this, Attributes.OPEN);
  }

  set open(value) {
    setBooleanAttr(this, Attributes.OPEN, value);
  }

  #init() {
    if (this.#isInit) return;
    this.#isInit = true;

    if (!this.shadowRoot) {
      // Set up the Shadow DOM if not using Declarative Shadow DOM.
      this.attachShadow((this.constructor as typeof MediaChromeDialog).shadowRootOptions);

      const attrs = namedNodeMapToObject(this.attributes);
      this.shadowRoot.innerHTML = (this.constructor as typeof MediaChromeDialog).getTemplateHTML(attrs);

      // Delay setting the transition to prevent seeing the transition from default start styles.
      queueMicrotask(() => {
        const { style } = getOrInsertCSSRule(this.shadowRoot, ':host');
        style.setProperty(
          'transition',
          `display .15s, visibility .15s, opacity .15s ease-in, transform .15s ease-in`
        );
      });
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

    if (attrName === Attributes.OPEN && newValue !== oldValue) {
      if (this.open) {
        this.#handleOpen();
      } else {
        this.#handleClosed();
      }
    }
  }

  #handleOpen() {
    this.#invokerElement?.setAttribute('aria-expanded', 'true');
    this.dispatchEvent(new Event('open', { composed: true, bubbles: true }));
    // Focus when the transition ends.
    this.addEventListener('transitionend', () => this.focus(), { once: true });
  }

  #handleClosed() {
    this.#invokerElement?.setAttribute('aria-expanded', 'false');
    this.dispatchEvent(new Event('close', { composed: true, bubbles: true }));
  }

  focus() {
    this.#previouslyFocused = getActiveElement();

    // https://w3c.github.io/uievents/#event-type-focus
    const focusCancelled = !this.dispatchEvent(new Event('focus', { composed: true, cancelable: true }));
    // https://w3c.github.io/uievents/#event-type-focusin
    const focusInCancelled = !this.dispatchEvent(new Event('focusin', { composed: true, bubbles: true, cancelable: true }));

    // If `event.preventDefault()` was called in a listener prevent focusing.
    if (focusCancelled || focusInCancelled) return;

    const focusable: HTMLElement | null = this.querySelector(
      '[autofocus], [tabindex]:not([tabindex="-1"]), [role="menu"]'
    );
    focusable?.focus();
  }

  #handleInvoke(event: InvokeEvent) {
    this.#invokerElement = event.relatedTarget as HTMLElement;

    if (!containsComposedNode(this, event.relatedTarget as Node)) {
      this.open = !this.open;
    }
  }

  #handleFocusOut(event: FocusEvent) {
    if (!containsComposedNode(this, event.relatedTarget as Node)) {
      this.#previouslyFocused?.focus();

      // If the dialog was opened by a click, close it when selecting an item.
      if (this.#invokerElement && this.#invokerElement !== event.relatedTarget && this.open) {
        this.open = false;
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
      this.open = false;
    }
  }
}

if (!globalThis.customElements.get('media-chrome-dialog')) {
  globalThis.customElements.define('media-chrome-dialog', MediaChromeDialog);
}

export { MediaChromeDialog };
export default MediaChromeDialog;
