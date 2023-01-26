import { MediaStateReceiverAttributes } from './constants.js';
import { window, document } from './utils/server-safe-globals.js';
// Todo: Use data locals: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toLocaleTimeString

const template = document.createElement('template');

template.innerHTML = `
  <style>
    :host {
      display: inline-flex;
      justify-content: center;
      align-items: center;
      vertical-align: middle;
      box-sizing: border-box;
      background: var(--media-control-background, rgba(20,20,30, 0.7));
  
      padding: var(--media-control-padding, 10px);

      font-size: 14px;
      line-height: var(--media-text-content-height, var(--media-control-height, 24px));
      font-family: Arial, sans-serif;
      text-align: center;
      color: #ffffff;
      pointer-events: auto;
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
  </style>
  <span id="container">
  <p>jsmith</p>
  <slot></slot>
  </span>
`;

class MediaTextDisplay extends window.HTMLElement {
  static get observedAttributes() {
    return [MediaStateReceiverAttributes.MEDIA_CONTROLLER];
  }

  constructor() {
    super();
    console.log('Dylan was here');

    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
    this.container = this.shadowRoot.querySelector('#container');
  }

  attributeChangedCallback(attrName, oldValue, newValue) {
    if (attrName === MediaStateReceiverAttributes.MEDIA_CONTROLLER) {
      if (oldValue) {
        const mediaControllerEl = document.getElementById(oldValue);
        mediaControllerEl?.unassociateElement?.(this);
      }
      if (newValue) {
        const mediaControllerEl = document.getElementById(newValue);
        mediaControllerEl?.associateElement?.(this);
      }
    }
  }

  connectedCallback() {
    this.template.innerHTML = '<p>15</p>';
    const mediaControllerId = this.getAttribute(
      MediaStateReceiverAttributes.MEDIA_CONTROLLER
    );
    if (mediaControllerId) {
      const mediaControllerEl = document.getElementById(mediaControllerId);
      mediaControllerEl?.associateElement?.(this);
    }
  }

  disconnectedCallback() {
    const mediaControllerId = this.getAttribute(
      MediaStateReceiverAttributes.MEDIA_CONTROLLER
    );
    if (mediaControllerId) {
      const mediaControllerEl = document.getElementById(mediaControllerId);
      mediaControllerEl?.unassociateElement?.(this);
    }
  }
}

if (!window.customElements.get('media-text-display')) {
  window.customElements.define('media-text-display', MediaTextDisplay);
}

export default MediaTextDisplay;
