import {
  closestComposedNode,
  getStringAttr,
  setStringAttr,
} from './utils/element-utils.js';
import { globalThis, document } from './utils/server-safe-globals.js';

export const Attributes = {
  POSITION: 'position',
  CONTAINER: 'container',
};

const template: HTMLTemplateElement = document.createElement('template');

template.innerHTML = /*html*/ `
  <style>
    :host {
      pointer-events: none;
      z-index: 1;
    }

    /* TODO: remove hardcoded values / replace with CSS vars where appro */
    :host {
      position: relative;
      display: var(--media-tooltip-display, inline-flex);
      justify-content: center;
      align-items: center;
      box-sizing: border-box;
      background: var(--media-tooltip-background, #fff);
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

    img, svg {
      display: inline-block;
    }

    #arrow {
      position: absolute;
      width: 0px;
      height: 0px;
      border-style: solid;
      display: var(--media-tooltip-arrow-display, block);
    }

    :host(:not([position])),
    :host([position="top"]) {
      position: absolute;
      bottom: calc(100% + var(--media-tooltip-distance, 12px));
      left: 50%;
      transform: translate(calc(-50% - var(--media-tooltip-offset-x, 0px)), 0);
    }
    :host(:not([position])) #arrow,
    :host([position="top"]) #arrow {
      top: 100%;
      left: 50%;
      border-width: 5px 6px 0 6px;
      border-color: var(--media-tooltip-background, #fff) transparent transparent transparent;
      transform: translate(calc(-50% + var(--media-tooltip-offset-x, 0px)), 0);
    }

    :host([position="right"]) {
      position: absolute;
      left: calc(100% + var(--media-tooltip-distance, 12px));
      top: 50%;
      transform: translate(0, -50%);
    }
    :host([position="right"]) #arrow {
      top: 50%;
      right: 100%;
      border-width: 6px 5px 6px 0;
      border-color: transparent var(--media-tooltip-background, #fff) transparent transparent;
      transform: translate(0, -50%);
    }

    :host([position="bottom"]) {
      position: absolute;
      top: calc(100% + var(--media-tooltip-distance, 12px));
      left: 50%;
      transform: translate(-50%, 0);
    }
    :host([position="bottom"]) #arrow {
      bottom: 100%;
      left: 50%;
      border-width: 0 6px 5px 6px;
      border-color: transparent transparent var(--media-tooltip-background, #fff) transparent;
      transform: translate(calc(-50% + var(--media-tooltip-offset-x, 0px)), 0);
    }

    :host([position="left"]) {
      position: absolute;
      right: calc(100% + var(--media-tooltip-distance, 12px));
      top: 50%;
      transform: translate(0, -50%);
    }
    :host([position="left"]) #arrow {
      top: 50%;
      left: 100%;
      border-width: 6px 0 6px 5px;
      border-color: transparent transparent transparent var(--media-tooltip-background, #fff);
      transform: translate(0, -50%);
    }
    
    :host([position="none"]) #arrow {
      display: none;
    }

  </style>
  <slot></slot>
  <div id="arrow"></div>
`;

/**
 * @extends {HTMLElement}
 *
 * @attr {('top'|'right'|'bottom'|'left'|'none')} position - The position of the tooltip, defaults to "top"
 * @attr {string} container - The containing element (one of it's parents) that should constrain the tooltips left and right position. Defaults to 'media-control-bar'.
 */
class MediaTooltip extends globalThis.HTMLElement {
  static get observedAttributes(): string[] {
    return [Attributes.POSITION, Attributes.CONTAINER];
  }

  arrowEl: HTMLElement;

  constructor() {
    super();

    if (!this.shadowRoot) {
      // Set up the Shadow DOM if not using Declarative Shadow DOM.
      this.attachShadow({ mode: 'open' });
      this.shadowRoot.appendChild(template.content.cloneNode(true));
    }

    this.arrowEl = this.shadowRoot.querySelector('#arrow');
  }

  // Adjust tooltip position relative to the closest containing element
  // such that it doesn't spill out of the left or right sides
  updateXOffset = () => {
    const containingSelector =
      this.getAttribute('container') ?? 'media-control-bar';
    const containingEl = closestComposedNode(this, containingSelector);
    if (!containingEl) return;
    const { x: containerX, width: containerWidth } =
      containingEl.getBoundingClientRect();
    const { x: tooltipX, width: tooltipWidth } = this.getBoundingClientRect();
    const tooltipRight = tooltipX + tooltipWidth;
    const containerRight = containerX + containerWidth;
    const offsetXVal = this.style.getPropertyValue('--media-tooltip-offset-x');
    const currOffsetX = offsetXVal
      ? parseFloat(offsetXVal.replace('px', ''))
      : 0;

    // we might have already offset the tooltip previously so we remove it's
    // current offset from our calculations
    const leftDiff = tooltipX - containerX + currOffsetX;
    const rightDiff = tooltipRight - containerRight + currOffsetX;

    // out of left bounds
    if (leftDiff < 0) {
      this.style.setProperty('--media-tooltip-offset-x', `${leftDiff}px`);
      return;
    }

    // out of right bounds
    if (rightDiff > 0) {
      this.style.setProperty('--media-tooltip-offset-x', `${rightDiff}px`);
      return;
    }

    // no spilling out
    this.style.removeProperty('--media-tooltip-offset-x');
  };

  /**
   * Get or set tooltip position
   */
  get position(): string | undefined {
    return getStringAttr(this, Attributes.POSITION);
  }

  set position(value: string | undefined) {
    setStringAttr(this, Attributes.POSITION, value);
  }
}

if (!globalThis.customElements.get('media-tooltip')) {
  globalThis.customElements.define('media-tooltip', MediaTooltip);
}

export default MediaTooltip;
