import '../media-chrome-button.js';
import './media-chrome-listbox.js';
import { window, document } from '../utils/server-safe-globals.js';
import { closestComposedNode } from '../utils/element-utils.js';
import { MediaStateReceiverAttributes } from '../constants.js';

const template = document.createElement('template');
template.innerHTML = `
  <style>
  :host {
    display: inline-flex;
    position: relative;
    padding: var(--media-control-padding, 10px);
    background: var(--media-control-background, rgba(20,20,30, 0.7));
  }

  :host(:hover:not([disabled])) {
    background: var(--media-control-hover-background, rgba(50,50,70, 0.7));
  }

  .wrapper {
    position: relative;
  }

  media-chrome-button,
  ::slotted(media-chrome-button),
  ::slotted(media-captions-button) {
    padding: 0;
    background: transparent;
  }

  [name="listbox"]::slotted(*),
  media-chrome-listbox {
    position: absolute;
    bottom: 44px;
    max-height: 300px;
    overflow: hidden auto;
  }

  media-chrome-button:not(:focus-visible) {
    outline: none;
  }
  </style>

  <slot name="button">
    <media-chrome-button aria-haspopup="listbox">
      <slot name="button-content"></slot>
    </media-chrome-button>
  </slot>
  <slot name="listbox" hidden>
    <media-chrome-listbox id="listbox" part="listbox">
      <slot></slot>
    </media-chrome-listbox>
  </slot>
`;

class MediaChromeMenuButton extends window.HTMLElement {
  #handleClick;
  #handleChange;
  #enabledState = true;
  #button;
  #buttonSlot;
  #buttonSlotted = false;
  #listbox;
  #listboxSlot;
  #expanded = false;

  static get observedAttributes() {
    return [
      'disabled', MediaStateReceiverAttributes.MEDIA_CONTROLLER,
    ];
  }

  constructor() {
    super();

    const shadow = this.attachShadow({ mode: 'open' });

    const buttonHTML = template.content.cloneNode(true);
    this.nativeEl = buttonHTML;

    shadow.appendChild(buttonHTML);

    this.#handleClick = this.#handleClick_.bind(this);
    this.#handleChange = this.#handleChange_.bind(this);

    this.#button = this.shadowRoot.querySelector('media-chrome-button');
    this.#listbox = this.shadowRoot.querySelector('media-chrome-listbox');

    this.#buttonSlot = this.shadowRoot.querySelector('slot[name=button]');
    this.#buttonSlot.addEventListener('slotchange', () => {
      const newButton = this.#buttonSlot.assignedElements()[0];

      // if the slotted button is the built-in, nothing to do
      if (!newButton) return;

      this.#buttonSlotted = true;

      // disconnect previous button
      this.disable();

      // update button reference if necessary
      this.#button = newButton;

      if (this.#button.hasAttribute('disabled')) {
        this.#enabledState = false;
      }

      // reconnect new button
      if (this.#enabledState) {
        this.enable();
      } else {
        this.disable();
      }
    });

    this.#listboxSlot = this.shadowRoot.querySelector('slot[name=listbox]');
    this.#listboxSlot.addEventListener('slotchange', () => {
      this.#listbox.removeEventListener('change', this.#handleChange);
      // update listbox reference if necessary
      this.#listbox = this.#listboxSlot.assignedElements()[0] || this.#listbox;
      this.#listbox.addEventListener('change', this.#handleChange);
    });
  }

  #handleClick_() {
    this.#toggle();
  }

  #handleChange_() {
    this.#toggle();
  }

  #toggle() {
    this.#listboxSlot.hidden = !this.#listboxSlot.hidden;
    this.#toggleExpanded();

    if (!this.#listboxSlot.hidden) {
      this.#listbox.focus();
      this.#updateMenuPosition();
    } else {
      this.#button.focus();
    }
  }

  #updateMenuPosition() {
    // if the menu is hidden, skip updating the menu position
    if (this.#listbox.offsetWidth === 0) return;

    const padding = window.getComputedStyle(this).getPropertyValue('--media-control-padding') || 10;

    const buttonRect = this.#button.getBoundingClientRect();


    // if we're outside of the controller,
    // one of the components should have a media-controller attribute
    // or the button wasn't slotted
    if (
      this.hasAttribute('media-controller') ||
      this.#button.hasAttribute('media-controller') ||
      this.#listbox.hasAttribute('media-controller') ||
      !this.#buttonSlotted) {
      this.#listbox.style.zIndex = '1';
      this.#listbox.style.bottom = 'unset';
      this.#listbox.style.top = (padding * 2 + buttonRect.height) + 'px'
      this.#listbox.style.translate = `-${padding}px`;
      return;
    }

    const leftOffset = buttonRect.x;

    // Get the element that enforces the bounds for the time range boxes.
    const bounds =
      (this.getAttribute('bounds')
        ? closestComposedNode(this, `#${this.getAttribute('bounds')}`)
        : this.parentElement) ?? this;
    let parentOffset = bounds.getBoundingClientRect().x;

    if (this.#listbox.offsetWidth + leftOffset - parentOffset > bounds.offsetWidth) {
      const offset = this.#listbox.offsetWidth + leftOffset + buttonRect.width;
      const overflow = bounds.offsetWidth + parentOffset + (padding * 2) - offset;
      this.#listbox.style.translate = overflow + 'px';
    } else {
      this.#listbox.style.translate = `-${buttonRect.width}px`;
    }
  }

  #toggleExpanded() {
    this.#button.setAttribute('aria-expanded', this.#expanded);
    this.#expanded = !this.#expanded;
  }

  enable() {
    this.#button.removeAttribute('disabled');
    this.#button.handleClick = this.#handleClick;
    this.#toggleExpanded()
    this.#listbox.addEventListener('change', this.#handleChange);
  }

  disable() {
    this.#button.setAttribute('disabled', '');
    this.#button.handleClick = () => {};
    this.#listbox.addEventListener('change', this.#handleChange);
  }

  attributeChangedCallback(attrName, oldValue, newValue) {
    if (attrName === MediaStateReceiverAttributes.MEDIA_CONTROLLER) {
      if (oldValue) {
        const mediaControllerEl = document.getElementById(oldValue);
        mediaControllerEl?.unassociateElement?.(this);
        this.#listbox.removeAttribute(MediaStateReceiverAttributes.MEDIA_CONTROLLER);
      }
      if (newValue) {
        const mediaControllerEl = document.getElementById(newValue);
        mediaControllerEl?.associateElement?.(this);
        this.#listbox.setAttribute(MediaStateReceiverAttributes.MEDIA_CONTROLLER, newValue);
      }
    } else if (attrName === 'disabled' && newValue !== oldValue) {
      if (newValue == null) {
        this.#enabledState = true;
        this.enable();
      } else {
        this.#enabledState = false;
        this.disable();
      }
    }
  }

  connectedCallback() {
    if (!this.hasAttribute('disabled')) {
      this.enable();
    }

    const mediaControllerId = this.getAttribute(
      MediaStateReceiverAttributes.MEDIA_CONTROLLER
    );
    if (mediaControllerId) {
      const mediaControllerEl = document.getElementById(mediaControllerId);
      mediaControllerEl?.associateElement?.(this);
      this.#listbox.setAttribute(MediaStateReceiverAttributes.MEDIA_CONTROLLER, mediaControllerId);
    }
  }

  disconnectedCallback() {
    this.disable();

    const mediaControllerId = this.getAttribute(
      MediaStateReceiverAttributes.MEDIA_CONTROLLER
    );
    if (mediaControllerId) {
      const mediaControllerEl = document.getElementById(mediaControllerId);
      mediaControllerEl?.unassociateElement?.(this);
      this.#listbox.removeAttribute(MediaStateReceiverAttributes.MEDIA_CONTROLLER);
    }
  }

  get keysUsed() {
    return ['Enter', ' ', 'ArrowUp', 'ArrowDown', 'f', 'c', 'k', 'm'];
  }

}

if (!window.customElements.get('media-chrome-menu-button')) {
  window.customElements.define('media-chrome-menu-button', MediaChromeMenuButton);
}

export default MediaChromeMenuButton;
