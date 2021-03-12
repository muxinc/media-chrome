import MediaChromeHTMLElement from './media-chrome-html-element.js';
import './media-chrome-menuitem.js';
import './media-chrome-submenu-menuitem.js';
import { defineCustomElement } from './utils/defineCustomElement.js';
import { createTemplate } from './utils/createTemplate.js';

const template = createTemplate();

template.innerHTML = `
  <style>
    :host {
      display: block;
      position: relative;
      width: 100%;
      border: 1px solid #f00;
      background-color: #000;
    }
  </style>
  <slot></slot>
`;

class MediaChromeMenu extends MediaChromeHTMLElement {
  constructor() {
    super();
    const shadow = this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }

  mediaSetCallback(media) { }
}

defineCustomElement('media-chrome-menu', MediaChromeMenu);

export default MediaChromeMenu;
