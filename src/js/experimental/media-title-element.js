import { window, document } from '../utils/server-safe-globals.js';

const template = document.createElement('template');

template.innerHTML = `
  <style>
    :host {
    }
  </style>
  <slot></slot>
`;

class MediaTitleBar extends window.HTMLElement {
  constructor() {
    super();

    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }
}

if (!window.customElements.get('media-title-bar')) {
  window.customElements.define('media-title-bar', MediaTitleBar);
}

export default MediaTitleBar;
