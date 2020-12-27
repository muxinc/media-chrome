import MediaChromeElement from './media-chrome-element.js';
import { createTemplateElement, defineCustomElement } from './utils/document.js';

const template = createTemplateElement();

template.innerHTML = `
<style>
  :host {
    position: relative;
    display: inline-block;
    vertical-align: middle;
    box-sizing: border-box;
    background-color: transparent;

    /* Default width and height can be overridden externally */
    height: 44px;
    width: 44px;

    /* Vertically center any text */
    font-size: 16px;
    line-height: 24px;

    /* Min icon size is 24x24 */
    min-height: 24px;
    min-width: 24px;
  }

  :host(:focus, :focus-within) {
    outline: 2px solid rgba(0,150,255, 0.33);
    outline-offset: -2px;
  }

  :host(:hover) {
    background: rgba(255,255,255, 0.10);
  }

  button {
    width: 100%;
    height: 100%;
    vertical-align: middle;
    border: none;
    margin: 0;
    padding: 0;
    text-decoration: none;
    background: transparent;
    color: #ffffff;
    font-family: sans-serif;
    font-size: 16px;
    line-height: 24px;
    cursor: pointer;
    text-align: center;
    -webkit-appearance: none;
    -moz-appearance: none;
  }

  button:hover {}
  button:focus {
    outline: 0;
  }
  button:active {}

  svg {
    width: var(--media-button-icon-width);
    height: var(--media-button-icon-height);
    transform: var(--media-button-icon-transform);
    transition: var(--media-button-icon-transition);
  }

  svg .icon {
    fill: var(--media-icon-color, #eee);
  }
</style>
<button id="icon-container">
  <slot></slot>
</button>
`;

class MediaChromeButton extends MediaChromeElement {
  constructor() {
    super();

    var shadow = this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
    this.iconContainer = this.shadowRoot.querySelector('#icon-container');

    this.addEventListener('click', e => {
      this.onClick(e);
    });
  }

  onClick() { }

  set icon(svg) {
    this.iconContainer.innerHTML = svg;
  }
}

defineCustomElement('media-chrome-button', MediaChromeButton);

export default MediaChromeButton;
