/*
  <media-control-bar>

  Auto position contorls in a line and set some base colors
*/
import { MediaStateReceiverAttributes } from './constants.js';
import { getOrInsertCSSRule } from './utils/element-utils.js';
import { globalThis, document } from './utils/server-safe-globals.js';

const template = document.createElement('template');

template.innerHTML = /*html*/`
  <style>
    :host {
      ${/* Need position to display above video for some reason */''}
      box-sizing: border-box;
      display: var(--media-control-display, var(--media-control-bar-display, inline-flex));
      color: var(--media-text-color, var(--media-primary-color, rgb(238 238 238)));
      --media-loading-indicator-icon-height: 44px;
    }

    media-time-range,
    ::slotted(media-time-range),
    ::slotted(media-clip-selector) {
      flex-grow: 1;
    }

    media-time-range,
    ::slotted(media-time-range),
    ::slotted(media-clip-selector),
    media-volume-range,
    ::slotted(media-volume-range) {
      height: var(--_range-auto-size, calc(var(--media-control-height, 24px) + 2 * var(--_media-range-padding)));
    }
  </style>

  <slot></slot>
`;

/**
 * @attr {string} mediacontroller - The element `id` of the media controller to connect to (if not nested within).
 *
 * @cssproperty --media-primary-color - Default color of text and icon.
 * @cssproperty --media-secondary-color - Default color of button background.
 * @cssproperty --media-text-color - `color` of button text.
 *
 * @cssproperty --media-control-bar-display - `display` property of control bar.
 * @cssproperty --media-control-display - `display` property of control.
 */
class MediaControlBar extends globalThis.HTMLElement {
  #mediaController;

  static get observedAttributes() {
    return [MediaStateReceiverAttributes.MEDIA_CONTROLLER];
  }

  constructor() {
    super();

    if (!this.shadowRoot) {
      // Set up the Shadow DOM if not using Declarative Shadow DOM.
      this.attachShadow({ mode: 'open' });
      this.shadowRoot.appendChild(template.content.cloneNode(true));
    }

    this.shadowRoot.querySelector('slot').addEventListener('slotchange', ({ target }) => {
      const onlyRanges = target.assignedElements({flatten: true})
        .every(el => ['media-time-range', 'media-volume-range'].includes(el.nodeName.toLowerCase()));
      const { style } = getOrInsertCSSRule(this.shadowRoot, ':host');
      const autoSizeHeight = onlyRanges ? 'unset' : 'initial';
      style.setProperty('--_range-auto-size', autoSizeHeight);
    });
  }

  attributeChangedCallback(attrName, oldValue, newValue) {
    if (attrName === MediaStateReceiverAttributes.MEDIA_CONTROLLER) {
      if (oldValue) {
        this.#mediaController?.unassociateElement?.(this);
        this.#mediaController = null;
      }
      if (newValue && this.isConnected) {
        // @ts-ignore
        this.#mediaController = this.getRootNode()?.getElementById(newValue);
        this.#mediaController?.associateElement?.(this);
      }
    }
  }

  connectedCallback() {
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
    // Use cached mediaController, getRootNode() doesn't work if disconnected.
    this.#mediaController?.unassociateElement?.(this);
    this.#mediaController = null;
  }
}

if (!globalThis.customElements.get('media-control-bar')) {
  globalThis.customElements.define('media-control-bar', MediaControlBar);
}

export default MediaControlBar;
