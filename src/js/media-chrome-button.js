import { MediaStateReceiverAttributes } from './constants.js';
import { getOrInsertCSSRule } from './utils/element-utils.js';
import { window, document } from './utils/server-safe-globals.js';

const template = document.createElement('template');

template.innerHTML = `
<style>
  :host {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    vertical-align: middle;
    box-sizing: border-box;
    background: var(--media-control-background, rgba(20,20,30, 0.7));

    padding: var(--media-control-padding, 10px);

    ${/* Vertically center any text */''}
    font-size: 14px;
    line-height: var(--media-text-content-height, var(--media-control-height, 24px));
    font-weight: bold;
    color: #fff;

    transition: background 0.15s linear;

    pointer-events: auto;
    cursor: pointer;
    font-family: Arial, sans-serif;
  }

  ${/*
    Only show outline when keyboard focusing.
    https://drafts.csswg.org/selectors-4/#the-focus-visible-pseudo
  */''}
  :host(:focus-visible) {
    box-shadow: inset 0 0 0 2px rgba(27, 127, 204, 0.9);
    outline: 0;
  }
  ${/*
   * hide default focus ring, particularly when using mouse
   */''}
  :host(:where(:focus)) {
    box-shadow: none;
    outline: 0;
  }

  :host(:hover) {
    background: var(--media-control-hover-background, rgba(50,50,70, 0.7));
  }

  svg, img, ::slotted(svg), ::slotted(img) {
    width: var(--media-button-icon-width);
    height: var(--media-button-icon-height, var(--media-control-height, 24px));
    transform: var(--media-button-icon-transform);
    transition: var(--media-button-icon-transition);
    fill: var(--media-icon-color, #eee);
    vertical-align: middle;
    max-width: 100%;
    max-height: 100%;
    min-width: 100%;
  }
</style>
`;

/**
 * @extends {HTMLElement}
 */
class MediaChromeButton extends window.HTMLElement {
  #mediaController;
  preventClick = false;

  static get observedAttributes() {
    return ['disabled', MediaStateReceiverAttributes.MEDIA_CONTROLLER];
  }

  constructor(options = {}) {
    super();

    this.attachShadow({ mode: 'open' });

    const buttonHTML = template.content.cloneNode(true);
    this.nativeEl = buttonHTML;

    // Slots
    let slotTemplate = options.slotTemplate;

    if (!slotTemplate) {
      slotTemplate = document.createElement('template');
      slotTemplate.innerHTML = `<slot>${options.defaultContent || ''}</slot>`;
    }

    this.nativeEl.appendChild(slotTemplate.content.cloneNode(true));

    this.shadowRoot.appendChild(buttonHTML);

    const { style } = getOrInsertCSSRule(this.shadowRoot, ':host');
    style.setProperty('display', `var(--${this.localName}-display, inline-flex)`);
  }

  #clickListener = (e) => {
    if (!this.preventClick) {
      this.handleClick(e);
    }
  }

  // NOTE: There are definitely some "false positive" cases with multi-key pressing,
  // but this should be good enough for most use cases.
  #keyupListener = (e) => {
    const { key } = e;
    if (!this.keysUsed.includes(key)) {
      this.removeEventListener('keyup', this.#keyupListener);
      return;
    }

    this.handleClick(e);
  }

  #keydownListener = (e) => {
    const { metaKey, altKey, key } = e;
    if (metaKey || altKey || !this.keysUsed.includes(key)) {
      this.removeEventListener('keyup', this.#keyupListener);
      return;
    }
    this.addEventListener('keyup', this.#keyupListener, {once: true});
  }

  enable() {
    this.addEventListener('click', this.#clickListener);
    this.addEventListener('keydown', this.#keydownListener);
    this.setAttribute('tabindex', '0');
  }

  disable() {
    this.removeEventListener('click', this.#clickListener);
    this.removeEventListener('keyup', this.#keyupListener);
    this.removeAttribute('tabindex');
  }

  attributeChangedCallback(attrName, oldValue, newValue) {
    if (attrName === MediaStateReceiverAttributes.MEDIA_CONTROLLER) {
      if (oldValue) {
        this.#mediaController?.unassociateElement?.(this);
        this.#mediaController = null;
      }
      if (newValue) {
        // @ts-ignore
        this.#mediaController = this.getRootNode()?.getElementById(newValue);
        this.#mediaController?.associateElement?.(this);
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

    this.setAttribute('role', 'button');

    const mediaControllerId = this.getAttribute(
      MediaStateReceiverAttributes.MEDIA_CONTROLLER
    );
    if (mediaControllerId) {
      // @ts-ignore
      this.#mediaController = this.getRootNode()?.getElementById(mediaControllerId);
      this.#mediaController?.associateElement?.(this);
    }
  }

  disconnectedCallback() {
    this.disable();
    // Use cached mediaController, getRootNode() doesn't work if disconnected.
    this.#mediaController?.unassociateElement?.(this);
    this.#mediaController = null;
  }

  get keysUsed() {
    return ['Enter', ' '];
  }

  /**
   * @abstract
   * @argument {Event} e
   */
  handleClick(e) {} // eslint-disable-line
}

if (!window.customElements.get('media-chrome-button')) {
  window.customElements.define('media-chrome-button', MediaChromeButton);
}

export default MediaChromeButton;
