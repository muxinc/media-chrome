import MediaChromeHTMLElement from './media-chrome-html-element.js';
import { defineCustomElement } from './utils/defineCustomElement.js';
import { createTemplate } from './utils/createTemplate.js';

const template = createTemplate();

template.innerHTML = `
  <style>
    :host {
      display: block;
      position: absolute;
      width: 300px;
      height: 200px;
      padding: 10px;
      border: 1px solid #333;
      color: #fff;
      background-color: #000;
    }
  </style>
  <slot></slot>
`;

class MediaChromePopup extends MediaChromeHTMLElement {
  constructor() {
    super();

    const shadow = this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }

  mediaSetCallback(media) {

  }

  mediaUnsetCallback() {

  }
}

defineCustomElement('media-chrome-popup', MediaChromePopup);

export default MediaChromePopup;
