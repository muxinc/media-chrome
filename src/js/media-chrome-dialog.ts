import { globalThis, document } from './utils/server-safe-globals.js';
import {
  containsComposedNode,
  getActiveElement,
} from './utils/element-utils.js';
import { InvokeEvent } from './utils/events.js';

const template: HTMLTemplateElement = document.createElement('template');
template.innerHTML = /*html*/ `
  <style>
    :host {
      font: var(--media-font,
        var(--media-font-weight, normal)
        var(--media-font-size, 14px) /
        var(--media-text-content-height, var(--media-control-height, 24px))
        var(--media-font-family, helvetica neue, segoe ui, roboto, arial, sans-serif));
      color: var(--media-text-color, var(--media-primary-color, rgb(238 238 238)));
      background: var(--media-dialog-background, var(--media-control-background, var(--media-secondary-color, rgb(20 20 30 / .8))));
      border-radius: var(--media-dialog-border-radius);
      border: var(--media-dialog-border, none);
      display: var(--media-dialog-display, inline-flex);
      transition: var(--media-dialog-transition-in,
        visibility 0s,
        opacity .2s ease-out,
        transform .15s ease-out
      ) !important;
      ${/* ^^Prevent transition override by media-container */ ''}
      visibility: var(--media-dialog-visibility, visible);
      opacity: var(--media-dialog-opacity, 1);
      transform: var(--media-dialog-transform-in, translateY(0) scale(1));
    }

    :host([hidden]) {
      transition: var(--media-dialog-transition-out,
        visibility .15s ease-in,
        opacity .15s ease-in,
        transform .15s ease-in
      ) !important;
      visibility: var(--media-dialog-hidden-visibility, hidden);
      opacity: var(--media-dialog-hidden-opacity, 0);
      transform: var(--media-dialog-transform-out, translateY(2px) scale(.99));
      pointer-events: none;
    }
  </style>
  <slot></slot>
`;

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
 * @cssproperty --media-dialog-background - `background` of dialog.
 * @cssproperty --media-dialog-border-radius - `border-radius` of dialog.
 * @cssproperty --media-dialog-border - `border` of dialog.
 * @cssproperty --media-dialog-transition-in - `transition` of dialog when showing.
 * @cssproperty --media-dialog-transition-out - `transition` of dialog when hiding.
 * @cssproperty --media-dialog-visibility - `visibility` of dialog when showing.
 * @cssproperty --media-dialog-hidden-visibility - `visibility` of dialog when hiding.
 * @cssproperty --media-dialog-opacity - `opacity` of dialog when showing.
 * @cssproperty --media-dialog-hidden-opacity - `opacity` of dialog when hiding.
 * @cssproperty --media-dialog-transform-in - `transform` of dialog when showing.
 * @cssproperty --media-dialog-transform-out - `transform` of dialog when hiding.
 *
 * @cssproperty --media-font - `font` shorthand property.
 * @cssproperty --media-font-weight - `font-weight` property.
 * @cssproperty --media-font-family - `font-family` property.
 * @cssproperty --media-font-size - `font-size` property.
 * @cssproperty --media-text-content-height - `line-height` of text.
 */
class MediaChromeDialog extends globalThis.HTMLElement {
  static template: HTMLTemplateElement = template;

  static get observedAttributes() {
    return [Attributes.HIDDEN, Attributes.ANCHOR];
  }

  #previouslyFocused: HTMLElement | null = null;
  #invokerElement: HTMLElement | null = null;

  nativeEl: HTMLElement;

  constructor() {
    super();

    if (!this.shadowRoot) {
      // Set up the Shadow DOM if not using Declarative Shadow DOM.
      this.attachShadow({ mode: 'open' });

      this.nativeEl = (
        this.constructor as typeof MediaChromeDialog
      ).template.content.cloneNode(true) as HTMLElement;
      this.shadowRoot.append(this.nativeEl);
    }

    this.addEventListener('invoke', this);
    this.addEventListener('focusout', this);
    this.addEventListener('keydown', this);
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
    if (!this.role) {
      this.role = 'dialog';
    }
  }

  attributeChangedCallback(
    attrName: string,
    oldValue: string | null,
    newValue: string | null
  ) {
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
