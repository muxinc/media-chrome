import MediaChromeElement from './media-chrome-element.js';
import { createTemplateElement, defineCustomElement } from './utils/document.js';

const template = createTemplateElement();

template.innerHTML = `
<style>
  :host {
    position: relative;
    display: block;
    vertical-align: middle;
    box-sizing: border-box;
    background-color: #333;

    /* Default width and height can be overridden externally */
    height: 30px;

    /* Vertically center any text */
    font-size: 14px;
    line-height: 24px;

    /* Min icon size is 24x24 */
    min-height: 24px;
    min-width: 100px;

    padding: 3px 10px 3px 30px;
  }

  :host(:focus, :focus-within) {
    outline: 2px solid rgba(0,150,255, 0.33);
    outline-offset: -2px;
  }

  :host(:hover) {
    background: rgba(255,255,255, 0.10);
  }
</style>

<div id="labelContainer">
  <slot></slot>
</div>
<div id="contentContainer">
  <slot name="content"></slot>
</div>
`;

class MediaChromeMenuitem extends MediaChromeElement {
  constructor() {
    super();

    var shadow = this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
    this.contentConatiner = this.shadowRoot.querySelector('#contentContainer');

    this.addEventListener('click', e => {
      this.onClick(e);
    });
  }

  onClick() { }
}

defineCustomElement('media-chrome-menuitem', MediaChromeMenuitem);

export default MediaChromeMenuitem;
