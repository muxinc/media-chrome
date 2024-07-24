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

export type TooltipPosition = 'top' | 'right' | 'bottom' | 'left' | 'none';

const template: HTMLTemplateElement = document.createElement('template');

template.innerHTML = /*html*/ `
  <style>
    :host {
      --_tooltip-background-color: var(--media-tooltip-background-color, var(--media-secondary-color, rgba(20, 20, 30, .7)));
      --_tooltip-background: var(--media-tooltip-background, var(--_tooltip-background-color));
      --_tooltip-arrow-half-width: calc(var(--media-tooltip-arrow-width, 12px) / 2);
      --_tooltip-arrow-height: var(--media-tooltip-arrow-height, 5px);
      --_tooltip-arrow-background: var(--media-tooltip-arrow-background-color, var(--_tooltip-background-color));
      position: relative;
      pointer-events: none;
      display: var(--media-tooltip-display, inline-flex);
      justify-content: center;
      align-items: center;
      box-sizing: border-box;
      z-index: var(--media-tooltip-z-index, 1);
      background: var(--_tooltip-background);
      color: var(--media-text-color, var(--media-primary-color, rgb(238 238 238)));
      font: var(--media-font,
        var(--media-font-weight, 400)
        var(--media-font-size, 13px) /
        var(--media-text-content-height, var(--media-control-height, 18px))
        var(--media-font-family, helvetica neue, segoe ui, roboto, arial, sans-serif));
      padding: var(--media-tooltip-padding, .35em .7em);
      border: var(--media-tooltip-border, none);
      border-radius: var(--media-tooltip-border-radius, 5px);
      filter: var(--media-tooltip-filter, drop-shadow(0 0 4px rgba(0, 0, 0, .2)));
      white-space: var(--media-tooltip-white-space, nowrap);
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
      border-width: var(--_tooltip-arrow-height) var(--_tooltip-arrow-half-width) 0 var(--_tooltip-arrow-half-width);
      border-color: var(--_tooltip-arrow-background) transparent transparent transparent;
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
      border-width: var(--_tooltip-arrow-half-width) var(--_tooltip-arrow-height) var(--_tooltip-arrow-half-width) 0;
      border-color: transparent var(--_tooltip-arrow-background) transparent transparent;
      transform: translate(0, -50%);
    }

    :host([position="bottom"]) {
      position: absolute;
      top: calc(100% + var(--media-tooltip-distance, 12px));
      left: 50%;
      transform: translate(calc(-50% - var(--media-tooltip-offset-x, 0px)), 0);
    }
    :host([position="bottom"]) #arrow {
      bottom: 100%;
      left: 50%;
      border-width: 0 var(--_tooltip-arrow-half-width) var(--_tooltip-arrow-height) var(--_tooltip-arrow-half-width);
      border-color: transparent transparent var(--_tooltip-arrow-background) transparent;
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
      border-width: var(--_tooltip-arrow-half-width) 0 var(--_tooltip-arrow-half-width) var(--_tooltip-arrow-height);
      border-color: transparent transparent transparent var(--_tooltip-arrow-background);
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
 * @attr {string} container - CSS selector for the containing element (one of it's parents) that should constrain the tooltips horizontal position.
 *
 * @cssproperty --media-primary-color - Default color of text.
 * @cssproperty --media-secondary-color - Default color of tooltip background.
 * @cssproperty --media-text-color - `color` of tooltip text.
 *
 * @cssproperty --media-font - `font` shorthand property.
 * @cssproperty --media-font-weight - `font-weight` property.
 * @cssproperty --media-font-family - `font-family` property.
 * @cssproperty --media-font-size - `font-size` property.
 * @cssproperty --media-text-content-height - `line-height` of button text.
 *
 * @cssproperty --media-tooltip-border - 'border' of tooltip
 * @cssproperty --media-tooltip-background-color - Background color of tooltip and arrow, unless individually overidden
 * @cssproperty --media-tooltip-background - `background` of tooltip, ignoring the arrow
 * @cssproperty --media-tooltip-display - `display` of tooltip
 * @cssproperty --media-tooltip-z-index - `z-index` of tooltip
 * @cssproperty --media-tooltip-padding - `padding` of tooltip
 * @cssproperty --media-tooltip-border-radius - `border-radius` of tooltip
 * @cssproperty --media-tooltip-filter - `filter` property of tooltip, for drop-shadow
 * @cssproperty --media-tooltip-white-space - `white-space` property of tooltip
 * @cssproperty --media-tooltip-arrow-display - `display` property of tooltip arrow
 * @cssproperty --media-tooltip-arrow-width - Arrow width
 * @cssproperty --media-tooltip-arrow-height - Arrow height
 * @cssproperty --media-tooltip-arrow-background-color - Arrow background color
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

  // Adjusts tooltip position relative to the closest specified container
  // such that it doesn't spill out of the left or right sides. Only applies
  // to 'top' and 'bottom' positioned tooltips.
  updateXOffset = () => {
    const position = this.position;

    // we don't offset against tooltips coming out of left and right sides
    if (position === 'left' || position === 'right') {
      // could have been offset before switching to a new position
      this.style.removeProperty('--media-tooltip-offset-x');
      return;
    }

    const containingSelector = this.container;
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
  get position(): TooltipPosition | undefined {
    return getStringAttr(this, Attributes.POSITION);
  }

  set position(value: TooltipPosition | undefined) {
    setStringAttr(this, Attributes.POSITION, value);
  }

  /**
   * Get or set tooltip container selector that will constrain the tooltips horizontal
   * position. A css selector that matches one of the tooltips parents.
   */
  get container(): string | undefined {
    return getStringAttr(this, Attributes.CONTAINER);
  }

  set container(value: string | undefined) {
    setStringAttr(this, Attributes.CONTAINER, value);
  }
}

if (!globalThis.customElements.get('media-tooltip')) {
  globalThis.customElements.define('media-tooltip', MediaTooltip);
}

export default MediaTooltip;
