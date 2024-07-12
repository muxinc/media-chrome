import { getNumericAttr, setNumericAttr } from './utils/element-utils.js';
import { globalThis, document } from './utils/server-safe-globals.js';

export const Attributes = {
  OFFSET_X: 'offsetx',
};

const template: HTMLTemplateElement = document.createElement('template');

template.innerHTML = /*html*/ `
  <style>
    :host {
      pointer-events: none;
    }

    /* TODO: remove hardcoded values / replace with CSS vars where appro */
    #container {
      position: relative;
      display: var(--media-control-display, var(--media-tooltip-display, inline-flex));
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
      white-space: nowrap;
    }

    #container img, #container svg {
      display: inline-block;
    }

    #arrow {
      position: absolute;
      top: 100%;
      left: 50%;
      width: 0px;
      height: 0px;
      border-style: solid;
      border-width: 5px 6px 0 6px;
      border-color: #fff transparent transparent transparent;
      transform: rotate(0deg);
      transform: translate(-50%, 0);
    }
  </style>
  <div id="container" role="tooltip">
    <slot></slot>
    <div id="arrow"></div>
  </div>
`;

class MediaTooltip extends globalThis.HTMLElement {
  static get observedAttributes(): string[] {
    return [Attributes.OFFSET_X];
  }

  containerEl: HTMLElement;
  arrowEl: HTMLElement;

  constructor() {
    super();

    if (!this.shadowRoot) {
      // Set up the Shadow DOM if not using Declarative Shadow DOM.
      this.attachShadow({ mode: 'open' });
      this.shadowRoot.appendChild(template.content.cloneNode(true));
    }

    this.containerEl = this.shadowRoot.querySelector('#container');
    this.arrowEl = this.shadowRoot.querySelector('#arrow');
  }

  attributeChangedCallback(
    attrName: string,
    oldValue: string | null,
    newValue: string | null
  ): void {
    if (attrName === Attributes.OFFSET_X) {
      if (newValue == null) {
        this.containerEl.style.removeProperty('right');
        this.arrowEl.style.removeProperty('left');
      } else {
        this.containerEl.style.right = `${newValue}px`;
        this.arrowEl.style.left = `calc(50% + ${newValue}px)`;
      }
    }
  }

  /**
   * Get or set offset X value
   */
  get offsetX(): number | undefined {
    return getNumericAttr(this, Attributes.OFFSET_X);
  }

  set offsetX(value: number | undefined) {
    setNumericAttr(this, Attributes.OFFSET_X, value);
  }
}

if (!globalThis.customElements.get('media-tooltip')) {
  globalThis.customElements.define('media-tooltip', MediaTooltip);
}

export default MediaTooltip;
