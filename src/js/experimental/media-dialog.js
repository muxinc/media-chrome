import { window, document } from '../utils/server-safe-globals.js';

/* Inspired by HTMLDialogElement &
   https://github.com/GoogleChrome/dialog-polyfill/blob/master/index.js */

const styles = `
  :host {
    z-index: 100;
    display: var(--media-dialog-display, flex);
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    color: var(--media-dialog-color, #fff);
    padding: var(--media-dialog-backdrop-padding, 0);
    background: var(--media-dialog-backdrop-background,
      linear-gradient(to bottom, rgba(20, 20, 30, 0.5) 50%, rgba(20, 20, 30, 0.7))
    );
    transition: var(--media-dialog-transition-open, visibility .2s, opacity .2s) !important;
    transform: var(--media-dialog-transform-open, none) !important;
    visibility: visible !important;
    opacity: 1 !important;
    pointer-events: auto !important;
  }

  :host(:not([open])) {
    transition: var(--media-dialog-transition-close, visibility .1s, opacity .1s) !important;
    transform: var(--media-dialog-transform-close, none) !important;
    visibility: hidden !important;
    opacity: 0 !important;
    pointer-events: none !important;
  }

  :focus-visible {
    box-shadow: 0 0 0 2px rgba(27, 127, 204, 0.9);
  }

  .dialog {
    position: relative;
    box-sizing: border-box;
    background: var(--media-dialog-background, none);
    padding: var(--media-dialog-padding, 10px);
    width: min(320px, 100%);
    word-wrap: break-word;
    max-height: 100%;
    overflow: auto;
    text-align: center;
    line-height: 1.4;
  }
`;

const template = document.createElement('template');
template.innerHTML = `
  <style>
    ${styles}
  </style>
  <div class="dialog">
    <slot></slot>
  </div>
`;

class MediaDialog extends window.HTMLElement {
  static styles= styles;
  static template = template;
  static observedAttributes = ['open'];

  #previouslyFocused;

  constructor() {
    super();

    this.attachShadow({ mode: 'open' });
    // @ts-ignore
    this.shadowRoot?.appendChild(this.constructor.template.content.cloneNode(true));
  }

  show() {
    this.setAttribute('open', '');
    this.dispatchEvent(new CustomEvent('open', { composed: true, bubbles: true }));
    this.#focus();
  }

  close() {
    if (!this.hasAttribute('open')) return;

    this.removeAttribute('open');
    this.dispatchEvent(new CustomEvent('close', { composed: true, bubbles: true }));
    this.#previouslyFocused?.focus?.();
  }

  attributeChangedCallback(attrName, oldValue, newValue) {
    if (attrName === 'open' && oldValue !== newValue) {
      newValue != null ? this.show() : this.close();
    }
  }

  connectedCallback() {
    if (!this.hasAttribute('role')) {
      this.setAttribute('role', 'dialog');
    }

    if (this.hasAttribute('open')) {
      this.#focus();
    }
  }

  #focus() {
    const initFocus = new CustomEvent('initfocus', { composed: true, bubbles: true, cancelable: true });
    this.dispatchEvent(initFocus);

    // If `event.preventDefault()` was called in a listener prevent focusing.
    if (initFocus.defaultPrevented) return;

    // Find element with `autofocus` attribute, or fall back to the first form/tabindex control.
    let target = this.querySelector('[autofocus]:not([disabled])');

    if (!target && this.tabIndex >= 0) {
      target = this;
    }

    if (!target) {
      target = findFocusableElementWithin(this.shadowRoot);
    }

    this.#previouslyFocused = getActiveElement();
    this.#previouslyFocused?.blur?.();

    this.addEventListener(
      'transitionend',
      () => {
        if (target instanceof HTMLElement) {
          target.focus({ preventScroll: true });
        }
      },
      { once: true }
    );
  }
}

function findFocusableElementWithin(hostElement) {
  // Note that this is 'any focusable area'. This list is probably not exhaustive, but the
  // alternative involves stepping through and trying to focus everything.
  const opts = ['button', 'input', 'keygen', 'select', 'textarea'];
  const query = opts.map(function (el) {
    return el + ':not([disabled])';
  });
  // TODO(samthor): tabindex values that are not numeric are not focusable.
  query.push('[tabindex]:not([disabled]):not([tabindex=""])'); // tabindex != "", not disabled
  let target = hostElement?.querySelector(query.join(', '));

  if (!target && 'attachShadow' in Element.prototype) {
    // If we haven't found a focusable target, see if the host element contains an element
    // which has a shadowRoot.
    // Recursively search for the first focusable item in shadow roots.
    const elems = hostElement?.querySelectorAll('*') || [];
    for (let i = 0; i < elems.length; i++) {
      if (elems[i].tagName && elems[i].shadowRoot) {
        target = findFocusableElementWithin(elems[i].shadowRoot);
        if (target) {
          break;
        }
      }
    }
  }

  return target;
}

/**
 * Get the active element, accounting for Shadow DOM subtrees.
 * @author Cory LaViska
 * @see https://www.abeautifulsite.net/posts/finding-the-active-element-in-a-shadow-root/
 */
export function getActiveElement(root = document) {
  // @ts-ignore
  const activeEl = root.activeElement;

  if (!activeEl) return null;

  // If there’s a shadow root, recursively find the active element within it.
  // If the recursive call returns null, return the active element
  // of the top-level Document.
  if (activeEl.shadowRoot) {
    // @ts-ignore
    return getActiveElement(activeEl.shadowRoot) || document.activeElement;
  }

  // If not, we can just return the active element
  return activeEl;
}

if (!window.customElements.get('media-dialog')) {
  window.customElements.define('media-dialog', MediaDialog);
}

export default MediaDialog;
