import MediaChromeElement from './media-chrome-element.js';
import { createTemplateElement, defineCustomElement } from './utils/document.js';

const template = createTemplateElement();

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

defineCustomElement('media-title-bar', MediaTitleBar);

export default MediaTitleBar;
