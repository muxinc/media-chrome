import '../media-chrome-button.js';
import './media-chrome-listbox.js';
import { globalThis, document } from '../utils/server-safe-globals.js';
import {
  containsComposedNode,
  closestComposedNode,
  getOrInsertCSSRule,
  getActiveElement,
} from '../utils/element-utils.js';
import { observeResize, unobserveResize } from '../utils/resize-observer.js';
import { MediaStateReceiverAttributes } from '../constants.js';

const template = document.createElement('template');
template.innerHTML = /*html*/ `
  <style>
  :host {
    font: var(--media-font,
      var(--media-font-weight, normal)
      var(--media-font-size, 15px) /
      var(--media-text-content-height, var(--media-control-height, 24px))
      var(--media-font-family, helvetica neue, segoe ui, roboto, arial, sans-serif));
    color: var(--media-text-color, var(--media-primary-color, rgb(238 238 238)));
    display: inline-flex;
    position: relative;
    flex-shrink: .5;
  }

  [name=listbox]::slotted(*),
  [part=listbox] {
    position: absolute;
    bottom: 100%;
    max-height: 300px;
    transition: var(--media-selectmenu-transition-in,
      visibility 0s, transform .15s ease-out, opacity .15s ease-out);
    transform: var(--media-listbox-transform-in, translateY(0) scale(1));
    visibility: visible;
    opacity: 1;
  }

  [name=listbox][hidden]::slotted(*),
  [hidden] [part=listbox] {
    transition: var(--media-selectmenu-transition-out,
      visibility .15s ease-out, transform .15s ease-out, opacity .15s ease-out);
    transform: var(--media-listbox-transform-out, translateY(2px) scale(.99));
    visibility: hidden;
    opacity: 0;
    pointer-events: none;
  }

  slot[name=listbox][hidden] {
    display: block;
  }
  </style>

  <slot name="button">
    <media-chrome-button aria-haspopup="listbox" part="button">
      <slot name="button-content"></slot>
    </media-chrome-button>
  </slot>
  <slot name="listbox" hidden>
    <media-chrome-listbox id="listbox" part="listbox">
      <slot></slot>
    </media-chrome-listbox>
  </slot>
`;

/**
 * @slot button - A button element that reflects the current state of captions and subtitles selection.
 * @slot listbox - An element that displays the associated captions for the media.
 *
 * @attr {boolean} disabled - The Boolean disabled attribute makes the element not mutable or focusable.
 * @attr {string} mediacontroller - The element `id` of the media controller to connect to (if not nested within).
 *
 * @csspart button - The default button that's in the shadow DOM.
 * @csspart listbox - The default listbox that's in the shadow DOM.
 */
class MediaChromeSelectMenu extends globalThis.HTMLElement {
  #mediaController;
  #button;
  #buttonSlot;
  #listbox;
  #listboxSlot;

  static get observedAttributes() {
    return ['disabled', MediaStateReceiverAttributes.MEDIA_CONTROLLER];
  }

  constructor() {
    super();

    if (!this.shadowRoot) {
      // Set up the Shadow DOM if not using Declarative Shadow DOM.
      this.attachShadow({ mode: 'open' });
      this.shadowRoot.appendChild(template.content.cloneNode(true));
    }

    this.init?.();

    this.#button = this.shadowRoot.querySelector('[part=button]');
    this.#listbox = this.shadowRoot.querySelector('[part=listbox]');

    this.#buttonSlot = this.shadowRoot.querySelector('slot[name=button]');
    this.#buttonSlot.addEventListener('slotchange', () => {
      const newButton = this.#buttonSlot.assignedElements()[0];

      // if the slotted button is the built-in, nothing to do
      if (!newButton) return;

      this.#button = newButton;
      this.#button.preventClick = true;

      const disabled =
        this.hasAttribute('disabled') || this.#button.hasAttribute('disabled');

      if (disabled) {
        this.disable();
      } else {
        this.enable();
        this.#button.setAttribute('aria-haspopup', 'listbox');
      }
    });

    this.#listboxSlot = this.shadowRoot.querySelector('slot[name=listbox]');
    this.#listboxSlot.addEventListener('slotchange', () => {
      this.#listbox = this.#listboxSlot.assignedElements()[0] || this.#listbox;
    });
  }

  // NOTE: There are definitely some "false positive" cases with multi-key pressing,
  // but this should be good enough for most use cases.
  #keyupListener = (e) => {
    const { key } = e;

    if (!this.keysUsed.includes(key)) {
      this.removeEventListener('keyup', this.#keyupListener);
      return;
    }

    const isButton = e.composedPath().includes(this.#button);

    // only allow Enter/Space on the button itself and not on the listbox
    // and allow hiding the menu when pressing Escape when focused on the listbox
    if (isButton && (key === 'Enter' || key === ' ')) {
      this.#toggle();
    } else if (key === 'Escape') {
      this.#hide();
    }
  };

  #keydownListener = (e) => {
    const { metaKey, altKey, key } = e;
    if (metaKey || altKey || !this.keysUsed.includes(key)) {
      this.removeEventListener('keyup', this.#keyupListener);
      return;
    }
    e.preventDefault();
    this.addEventListener('keyup', this.#keyupListener, { once: true });
  };

  #documentClickHandler = (e) => {
    // if we clicked inside the selectmenu, don't handle it here
    if (e.composedPath().includes(this)) return;

    this.#hide();
  };

  #clickHandler = (e) => {
    if (e.composedPath().includes(this.#button)) {
      this.#toggle();
    }
  };

  #handleOptionChange = () => {
    this.#hide();
  };

  #toggle() {
    if (this.#listboxSlot.hidden) {
      this.#show();
    } else {
      this.#hide();
    }
  }

  #show() {
    if (!this.#listboxSlot.hidden) return;

    this.#listboxSlot.hidden = false;
    this.#button.setAttribute('aria-expanded', 'true');

    this.#updateMenuPosition();
    this.#listbox.focus();

    observeResize(getBoundsElement(this), this.#updateMenuPosition);
  }

  #hide() {
    if (this.#listboxSlot.hidden) return;

    unobserveResize(getBoundsElement(this), this.#updateMenuPosition);

    const activeElement = getActiveElement();

    this.#listboxSlot.hidden = true;
    this.#button.setAttribute('aria-expanded', 'false');

    if (containsComposedNode(this.#listbox, activeElement)) {
      this.#button.focus();
    }
  }

  #updateMenuPosition = () => {
    // if the menu is hidden, skip updating the menu position
    if (this.#listbox.offsetWidth === 0) return;

    // Choose .offsetWidth which is not affected by CSS transforms.
    const listboxWidth = this.#listbox.offsetWidth;
    const buttonRect = this.#button.getBoundingClientRect();

    // If this select element is outside of the controller open downward.
    if (
      this.hasAttribute('mediacontroller') ||
      this.#button.hasAttribute('mediacontroller') ||
      this.#listbox.hasAttribute('mediacontroller')
    ) {
      this.#listbox.style.zIndex = '1';
      this.#listbox.style.bottom = 'unset';
      this.#listbox.style.right = null;
      this.#listbox.style.left = '0';
      this.#listbox.style.top = `${buttonRect.height}px`;
      return;
    }

    // Get the element that enforces the bounds for the list boxes.
    const bounds = getBoundsElement(this);
    const boundsRect = bounds.getBoundingClientRect();
    const listboxRight = buttonRect.x + listboxWidth;
    const position = Math.max(
      buttonRect.right - listboxRight,
      buttonRect.right - boundsRect.right
    );
    this.#listbox.style.left = null;
    this.#listbox.style.right = `${position}px`;
    this.#listbox.style.maxHeight = `${
      boundsRect.height - buttonRect.height
    }px`;
  };

  enable() {
    this.#button.toggleAttribute('disabled', false);
    this.addEventListener('change', this.#handleOptionChange);
    this.addEventListener('keydown', this.#keydownListener);
    this.addEventListener('click', this.#clickHandler);
    document.addEventListener('click', this.#documentClickHandler);
  }

  disable() {
    this.#button.toggleAttribute('disabled', true);
    this.removeEventListener('change', this.#handleOptionChange);
    this.removeEventListener('keydown', this.#keydownListener);
    this.removeEventListener('keyup', this.#keyupListener);
    this.removeEventListener('click', this.#clickHandler);
    document.removeEventListener('click', this.#documentClickHandler);
  }

  attributeChangedCallback(attrName, oldValue, newValue) {
    if (attrName === MediaStateReceiverAttributes.MEDIA_CONTROLLER) {
      if (oldValue) {
        this.#mediaController?.unassociateElement?.(this);
        this.#mediaController = null;
        this.#listbox.removeAttribute(
          MediaStateReceiverAttributes.MEDIA_CONTROLLER
        );
      }
      if (newValue && this.isConnected) {
        // @ts-ignore
        this.#mediaController = this.getRootNode()?.getElementById(newValue);
        this.#mediaController?.associateElement?.(this);
        this.#listbox.setAttribute(
          MediaStateReceiverAttributes.MEDIA_CONTROLLER,
          newValue
        );
      }
    } else if (attrName === 'disabled' && newValue !== oldValue) {
      if (newValue == null) {
        this.enable();
      } else {
        this.disable();
      }
    }
  }

  connectedCallback() {
    const { style } = getOrInsertCSSRule(this.shadowRoot, ':host');
    style.setProperty(
      'display',
      `var(--media-control-display, var(--${this.localName}-display, inline-flex))`
    );

    const mediaControllerId = this.getAttribute(
      MediaStateReceiverAttributes.MEDIA_CONTROLLER
    );
    if (mediaControllerId) {
      // @ts-ignore
      this.#mediaController =
        this.getRootNode()?.getElementById(mediaControllerId);
      this.#mediaController?.associateElement?.(this);
      this.#listbox.setAttribute(
        MediaStateReceiverAttributes.MEDIA_CONTROLLER,
        mediaControllerId
      );
    }

    if (!this.hasAttribute('disabled')) {
      this.enable();
    }

    if (!this.#listboxSlot.hidden) {
      observeResize(getBoundsElement(this), this.#updateMenuPosition);
    }
  }

  disconnectedCallback() {
    unobserveResize(getBoundsElement(this), this.#updateMenuPosition);
    this.disable();

    // Use cached mediaController, getRootNode() doesn't work if disconnected.
    this.#mediaController?.unassociateElement?.(this);
    this.#mediaController = null;
    this.#listbox.removeAttribute(
      MediaStateReceiverAttributes.MEDIA_CONTROLLER
    );
  }

  get keysUsed() {
    return ['Enter', 'Escape', ' ', 'ArrowUp', 'ArrowDown', 'f', 'c', 'k', 'm'];
  }
}

function getBoundsElement(host) {
  return (
    (host.getAttribute('bounds')
      ? closestComposedNode(host, `#${host.getAttribute('bounds')}`)
      : getMediaControllerElement(host) || host.parentElement) ?? host
  );
}

function getMediaControllerElement(host) {
  const mediaControllerId = host.getAttribute(
    MediaStateReceiverAttributes.MEDIA_CONTROLLER
  );
  if (mediaControllerId) {
    return host.getRootNode()?.getElementById(mediaControllerId);
  }
  return closestComposedNode(host, 'media-controller');
}

if (!globalThis.customElements.get('media-chrome-selectmenu')) {
  globalThis.customElements.define(
    'media-chrome-selectmenu',
    MediaChromeSelectMenu
  );
}

export { MediaChromeSelectMenu };
export default MediaChromeSelectMenu;
