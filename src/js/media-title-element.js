import MediaChromeHTMLElement from './media-chrome-html-element.js';
import { defineCustomElement } from './utils/defineCustomElement.js';
import { createTemplate } from './utils/createTemplate.js';

const template = createTemplate();

template.innerHTML = `
  <style>
    :host {

    }
  </style>

  <slot></slot>
`;

class MediaTitleBar extends MediaChromeHTMLElement {
  constructor() {
    super();

    var shadow = this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }
}

defineCustomElement('media-title-bar', MediaTitleBar);

export default MediaTitleBar;
