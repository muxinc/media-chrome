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

      background-color: var(--media-control-background, rgba(20,20,30, 0.7));

      /* Default width and height can be overridden externally */
      height: 44px;

      box-sizing: border-box;
      padding: 0 5px;

      /* Min icon size is 24x24 */
      min-height: 24px;
      min-width: 24px;

      /* Vertically center any text */
      font-size: 16px;
      line-height: 24px;
      font-family: sans-serif;
      text-align: center;
      color: #ffffff;
    }

    #container {}
  </style>
  <div id="container"></div>
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
