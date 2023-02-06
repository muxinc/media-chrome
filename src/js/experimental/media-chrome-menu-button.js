import '../media-chrome-button.js';
import './media-chrome-listbox.js';
import { window, document } from '../utils/server-safe-globals.js';
import { closestComposedNode } from '../utils/element-utils.js';
import { MediaStateReceiverAttributes } from '../constants.js';

const template = document.createElement('template');
template.innerHTML = `
  <style>
  :host {
    display: contents;
  }

  [name="listbox"]::slotted(*),
  media-chrome-listbox {
    position: absolute;
    bottom: 44px;
    max-height: 300px;
    overflow: auto;
  }

  :host([media-controller]) [name="listbox"]::slotted(*) {
    z-index: 1;
    bottom: unset;
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
  #enabledState = false;
  #button;
  #buttonSlot;
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
      // disconnect previous button
      this.disable();

      // update button reference if necessary
      this.#button = this.#buttonSlot.assignedElements()[0] || this.#button;

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

    const svgs = this.shadowRoot.querySelectorAll('svg');
    const onSvgRect = this.#button.getBoundingClientRect(); // (this.#enabledSlot.assignedElements()[0] ?? svgs[0]).getBoundingClientRect();
    const offSvgRect = this.#button.getBoundingClientRect(); // (this.#disabledSlot.assignedElements()[0] ?? svgs[1]).getBoundingClientRect();

    if (this.hasAttribute('media-controller')) {
      const widthOn = onSvgRect.width;
      const widthOff = offSvgRect.width;
      const width = widthOn > 0 ? widthOn : widthOff > 0 ? widthOff : 0;
      const heightOn = onSvgRect.height;
      const heightOff = offSvgRect.height;
      const height = heightOn > 0 ? heightOn : heightOff > 0 ? heightOff : 0;

      this.#listbox.style.marginLeft = `calc(-${width}px - 10px * 2)`;
      this.#listbox.style.marginTop = `calc(${height}px + 10px * 2)`;

    } else {
      const xOn = onSvgRect.x;
      const xOff = offSvgRect.x;
      const leftOffset = xOn > 0 ? xOn : xOff > 0 ? xOff : 0;

      // Get the element that enforces the bounds for the time range boxes.
      const bounds =
        (this.getAttribute('bounds')
          ? closestComposedNode(this, `#${this.getAttribute('bounds')}`)
          : this.parentElement) ?? this;
      let parentOffset = bounds.getBoundingClientRect().x;

      if (this.#listbox.offsetWidth + leftOffset - parentOffset > bounds.offsetWidth) {
        this.#listbox.style.translate = (bounds.offsetWidth - this.#listbox.offsetWidth) + 'px';
      } else {
        this.#listbox.style.translate = `calc(${leftOffset}px - ${parentOffset}px)`;
      }
    }
  }

  #toggleExpanded() {
    this.#button.setAttribute('aria-expanded', this.#expanded);
    this.#expanded = !this.#expanded;
  }

  enable() {
    this.#enabledState = true;
    this.#button.removeAttribute('disabled');
    this.#button.handleClick = this.#handleClick;
    this.#toggleExpanded()
    this.#listbox.addEventListener('change', this.#handleChange);
  }

  disable() {
    this.#enabledState = false;
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
        this.enable();
      } else {
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
