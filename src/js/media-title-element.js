import MediaChromeElement from './media-chrome-element.js';

const template = document.createElement('template');

template.innerHTML = `
  <style>
    :host {

    }
  </style>

  <slot></slot>
`;


class MediaTitleBar extends MediaChromeElement {
  constructor() {
    super();

    var shadow = this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }
}

if (!window.customElements.get('media-title-bar')) {
  window.customElements.define('media-title-bar', MediaTitleBar);
  window.MediaChrome = MediaTitleBar;
}

export default MediaTitleBar;
