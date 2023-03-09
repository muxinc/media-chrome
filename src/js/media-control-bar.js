/*
  <media-control-bar>

  Auto position contorls in a line and set some base colors
*/
import { MediaStateReceiverAttributes } from './constants.js';
import { window, document } from './utils/server-safe-globals.js';

const template = document.createElement('template');

template.innerHTML = `
  <style>
    :host {
      ${/* Need position to display above video for some reason */''}
      box-sizing: border-box;
      display: var(--media-control-bar-display, inline-flex);
      color: var(--media-icon-color, #eee);
      --media-loading-icon-width: 44px;
    }

    media-time-range,
    ::slotted(media-time-range),
    ::slotted(media-progress-range),
    ::slotted(media-clip-selector) {
      flex-grow: 1;
    }
  </style>

  <slot></slot>
`;

class MediaControlBar extends window.HTMLElement {
  #mediaController;

  static get observedAttributes() {
    return [MediaStateReceiverAttributes.MEDIA_CONTROLLER];
  }

  constructor() {
    super();

    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
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

if (!window.customElements.get('media-control-bar')) {
  window.customElements.define('media-control-bar', MediaControlBar);
}

export default MediaControlBar;
