import { globalThis, document } from './utils/server-safe-globals.js';

export const Attributes = {};

const template: HTMLTemplateElement = document.createElement('template');

template.innerHTML = /*html*/ `
  <style>
    :host {
      pointer-events: none;
    }

    /* TODO: remove hardcoded values / replace with CSS vars where appro */
    #container {
      position: relative;
      display: inline-flex;
      justify-content: center;
      align-items: center;
      box-sizing: border-box;
      background: #fff;
      color: #000;
      font-weight: 400;
      font-family: var(--media-font-family, helvetica neue, segoe ui, roboto, arial, sans-serif);
      padding: .35em .7em;
      font-size: 13px;
      text-align: center;
      border-radius: 5px;
      pointer-events: none;
      filter: drop-shadow(0 0 4px rgba(0, 0, 0, .2));
    }

    #container::after {
      content: '';
      width: 0px;
      height: 0px;
      border-style: solid;
      border-width: 5px 6px 0 6px;
      border-color: #fff transparent transparent transparent;
      transform: rotate(0deg);
      position: absolute;
      top: 100%;
      left: 50%;
      transform: translate(-50%, 0);
    }
  </style>
  <div id="container" role="tooltip"><slot></slot></div>
`;

class MediaTooltip extends globalThis.HTMLElement {
  static get observedAttributes(): string[] {
    return [];
  }

  containerEl: HTMLElement;

  constructor() {
    super();

    if (!this.shadowRoot) {
      // Set up the Shadow DOM if not using Declarative Shadow DOM.
      this.attachShadow({ mode: 'open' });
      this.shadowRoot.appendChild(template.content.cloneNode(true));
    }

    this.containerEl = this.shadowRoot.querySelector('#container');
  }
}

if (!globalThis.customElements.get('media-tooltip')) {
  globalThis.customElements.define('media-tooltip', MediaTooltip);
}

export default MediaTooltip;
