import '../media-chrome-button.js';
import './media-chrome-listbox.js';
import { window, document } from '../utils/server-safe-globals.js';
import { closestComposedNode, getOrInsertCSSRule } from '../utils/element-utils.js';
import { MediaStateReceiverAttributes } from '../constants.js';

const template = document.createElement('template');
template.innerHTML = `
  <style>
  :host {
    display: inline-flex;
    position: relative;
    flex-shrink: .5;
  }

  [name="listbox"]::slotted(*),
  [part=listbox] {
    position: absolute;
    left: 0;
    bottom: 100%;
    max-height: 300px;
    overflow: hidden auto;
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

class MediaChromeSelectMenu extends window.HTMLElement {
  #handleClick;
  #handleChange;
  #enabledState = true;
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

    if (!this.shadowRoot) {
      // Set up the Shadow DOM if not using Declarative Shadow DOM.
      const shadow = this.attachShadow({ mode: 'open' });

      const buttonHTML = template.content.cloneNode(true);
      this.nativeEl = buttonHTML;

      shadow.appendChild(buttonHTML);
    }

    const { style } = getOrInsertCSSRule(this.shadowRoot, ':host');
    style.setProperty('display', `var(--media-control-display, var(--${this.localName}-display, inline-flex))`);

    this.#handleClick = this.#handleClick_.bind(this);
    this.#handleChange = this.#handleChange_.bind(this);

    this.init?.();

    this.#button = this.shadowRoot.querySelector('[part=button]');
    this.#listbox = this.shadowRoot.querySelector('[part=listbox]');

    this.#buttonSlot = this.shadowRoot.querySelector('slot[name=button]');
    this.#buttonSlot.addEventListener('slotchange', () => {
      const newButton = this.#buttonSlot.assignedElements()[0];

      // if the slotted button is the built-in, nothing to do
      if (!newButton) return;

      // disconnect previous button
      this.disable();

      // update button reference if necessary
      this.#button = newButton;

      // if it's a media-chrome-button, ask it to not handle the click event
      this.#button.preventClick = true;

      if (this.#button.hasAttribute('disabled')) {
        this.#enabledState = false;
      }

      // reconnect new button
      if (this.#enabledState) {
        this.enable();
        this.#button.setAttribute('aria-haspopup', 'listbox');
      } else {
        this.disable();
      }
    });

    this.#listboxSlot = this.shadowRoot.querySelector('slot[name=listbox]');
    this.#listboxSlot.addEventListener('slotchange', () => {
      this.disable();
      // update listbox reference if necessary
      this.#listbox = this.#listboxSlot.assignedElements()[0] || this.#listbox;
      this.enable();
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
      this.#handleClick();
    } else if (key === 'Escape' && !this.#listboxSlot.hidden) {
      this.#toggle();
    }
  }

  #keydownListener = (e) => {
    const { metaKey, altKey, key } = e;
    if (metaKey || altKey || !this.keysUsed.includes(key)) {
      this.removeEventListener('keyup', this.#keyupListener);
      return;
    }
    e.preventDefault();
    this.addEventListener('keyup', this.#keyupListener, {once: true});
  }

  #documentClickHandler = (e) => {
    // if we clicked inside the selectmenu, don't handle it here
    if (e.composedPath().includes(this)) return;

    if (!this.#listboxSlot.hidden) {
      this.#toggle();
    }
  }

  #handleClick_() {
    this.#toggle();
  }

  #handleChange_() {
    this.#toggle(true);
  }

  #toggle(closeOnly) {
    this.#listboxSlot.hidden = !this.#listboxSlot.hidden || closeOnly;
    this.#toggleExpanded(closeOnly);

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

    const buttonRect = this.#button.getBoundingClientRect();

    // if we're outside of the controller,
    // one of the components should have a media-controller attribute.
    // There isn't a good way now to differentiate between default buttons or
    // or a slotted button but outside of the media-controller.
    // So, a regular declarative selectmenu may default to open up rather than down.
    if (
      this.hasAttribute('media-controller') ||
      this.#button.hasAttribute('media-controller') ||
      this.#listbox.hasAttribute('media-controller')
    ) {
      this.#listbox.style.zIndex = '1';
      this.#listbox.style.bottom = 'unset';
      this.#listbox.style.top = buttonRect.height + 'px'
      return;
    }

    // Get the element that enforces the bounds for the list boxes.
    const bounds =
      (this.getAttribute('bounds')
        ? closestComposedNode(this, `#${this.getAttribute('bounds')}`)
        : this.parentElement) ?? this;

    const boundsRect = bounds.getBoundingClientRect();
    const listboxRect = this.#listbox.getBoundingClientRect();
    let position = -Math.max(buttonRect.x + listboxRect.width - boundsRect.right, 0);


    this.#listbox.style.transform = `translateX(${position}px)`;
  }

  #toggleExpanded(closeOnly) {
    this.#expanded = !this.#expanded || closeOnly;
    this.#button.setAttribute('aria-expanded', this.#expanded);
  }

  enable() {
    this.#button.removeAttribute('disabled');
    this.#button.addEventListener('click', this.#handleClick);
    this.#button.addEventListener('keydown', this.#keydownListener);
    this.#listbox.addEventListener('keydown', this.#keydownListener);
    this.#toggleExpanded();
    this.#listbox.addEventListener('change', this.#handleChange);
    document.addEventListener('click', this.#documentClickHandler);
  }

  disable() {
    this.#button.setAttribute('disabled', '');
    this.#button.removeEventListener('click', this.#handleClick);
    this.#button.removeEventListener('keydown', this.#keydownListener);
    this.#button.removeEventListener('keyup', this.#keyupListener);
    this.#listbox.removeEventListener('keydown', this.#keydownListener);
    this.#listbox.removeEventListener('keyup', this.#keyupListener);
    this.#listbox.addEventListener('change', this.#handleChange);
    document.removeEventListener('click', this.#documentClickHandler);
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
    return ['Enter', 'Escape', ' ', 'ArrowUp', 'ArrowDown', 'f', 'c', 'k', 'm'];
  }

}

if (!window.customElements.get('media-chrome-selectmenu')) {
  window.customElements.define('media-chrome-selectmenu', MediaChromeSelectMenu);
}

export default MediaChromeSelectMenu;
