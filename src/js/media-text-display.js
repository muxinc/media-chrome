import { MediaUIAttributes } from './constants.js';
import { defineCustomElement } from './utils/defineCustomElement.js';
import { Window as window, Document as document } from './utils/server-safe-globals.js';
// Todo: Use data locals: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toLocaleTimeString

const template = document.createElement('template');

template.innerHTML = `
  <style>
    :host {
      display: inline-flex;
      justify-content: center;
      align-items: center;
      box-sizing: border-box;
      background-color: var(--media-control-background, rgba(20,20,30, 0.7));
  
      padding: 10px;

      font-size: 14px;
      line-height: 24px;
      font-family: Arial, sans-serif;
      text-align: center;
      color: #ffffff;
      pointer-events: auto;
    }

    #container {
      /* NOTE: We don't currently have more generic sizing vars */
      height: var(--media-text-content-height, auto);
    }
  </style>
  <span id="container">
  <slot></slot>
  </span>
`;

class MediaTextDisplay extends window.HTMLElement {
  
  static get observedAttributes() {
    return [MediaUIAttributes.MEDIA_CONTROLLER];
  }
  
  constructor() {
    super();

    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
    this.container = this.shadowRoot.querySelector('#container');
  }
  
  attributeChangedCallback(attrName, oldValue, newValue) {
    if (attrName === MediaUIAttributes.MEDIA_CONTROLLER) {
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
    const mediaControllerId = this.getAttribute(MediaUIAttributes.MEDIA_CONTROLLER);
    if (mediaControllerId) {
      const mediaControllerEl = document.getElementById(mediaControllerId);
      mediaControllerEl?.associateElement?.(this);
    }
  }

  disconnectedCallback() {
    const mediaControllerSelector = this.getAttribute(MediaUIAttributes.MEDIA_CONTROLLER);
    if (mediaControllerSelector) {
      const mediaControllerEl = document.getElementById(mediaControllerId);
      mediaControllerEl?.unassociateElement?.(this);
    }
  }
}

defineCustomElement('media-text-display', MediaTextDisplay);

export default MediaTextDisplay;
