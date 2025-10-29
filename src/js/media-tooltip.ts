import {
  closestComposedNode,
  getMediaController,
  getStringAttr,
  isElementVisible,
  namedNodeMapToObject,
  setStringAttr,
} from './utils/element-utils.js';
import { globalThis } from './utils/server-safe-globals.js';

export const Attributes = {
  PLACEMENT: 'placement',
  BOUNDS: 'bounds',
};

export type TooltipPlacement = 'top' | 'right' | 'bottom' | 'left' | 'none';

function getTemplateHTML(_attrs: Record<string, string>) {
  return /*html*/ `
    <style>
      :host {
        --_tooltip-background-color: var(--media-tooltip-background-color, var(--media-secondary-color, rgba(20, 20, 30, .7)));
        --_tooltip-background: var(--media-tooltip-background, var(--_tooltip-background-color));
        --_tooltip-arrow-half-width: calc(var(--media-tooltip-arrow-width, 12px) / 2);
        --_tooltip-arrow-height: var(--media-tooltip-arrow-height, 5px);
        --_tooltip-arrow-background: var(--media-tooltip-arrow-color, var(--_tooltip-background-color));
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

      :host([hidden]) {
        display: none;
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

      :host(:not([placement])),
      :host([placement="top"]) {
        position: absolute;
        bottom: calc(100% + var(--media-tooltip-distance, 12px));
        left: 50%;
        transform: translate(calc(-50% - var(--media-tooltip-offset-x, 0px)), 0);
      }
      :host(:not([placement])) #arrow,
      :host([placement="top"]) #arrow {
        top: 100%;
        left: 50%;
        border-width: var(--_tooltip-arrow-height) var(--_tooltip-arrow-half-width) 0 var(--_tooltip-arrow-half-width);
        border-color: var(--_tooltip-arrow-background) transparent transparent transparent;
        transform: translate(calc(-50% + var(--media-tooltip-offset-x, 0px)), 0);
      }

      :host([placement="right"]) {
        position: absolute;
        left: calc(100% + var(--media-tooltip-distance, 12px));
        top: 50%;
        transform: translate(0, -50%);
      }
      :host([placement="right"]) #arrow {
        top: 50%;
        right: 100%;
        border-width: var(--_tooltip-arrow-half-width) var(--_tooltip-arrow-height) var(--_tooltip-arrow-half-width) 0;
        border-color: transparent var(--_tooltip-arrow-background) transparent transparent;
        transform: translate(0, -50%);
      }

      :host([placement="bottom"]) {
        position: absolute;
        top: calc(100% + var(--media-tooltip-distance, 12px));
        left: 50%;
        transform: translate(calc(-50% - var(--media-tooltip-offset-x, 0px)), 0);
      }
      :host([placement="bottom"]) #arrow {
        bottom: 100%;
        left: 50%;
        border-width: 0 var(--_tooltip-arrow-half-width) var(--_tooltip-arrow-height) var(--_tooltip-arrow-half-width);
        border-color: transparent transparent var(--_tooltip-arrow-background) transparent;
        transform: translate(calc(-50% + var(--media-tooltip-offset-x, 0px)), 0);
      }

      :host([placement="left"]) {
        position: absolute;
        right: calc(100% + var(--media-tooltip-distance, 12px));
        top: 50%;
        transform: translate(0, -50%);
      }
      :host([placement="left"]) #arrow {
        top: 50%;
        left: 100%;
        border-width: var(--_tooltip-arrow-half-width) 0 var(--_tooltip-arrow-half-width) var(--_tooltip-arrow-height);
        border-color: transparent transparent transparent var(--_tooltip-arrow-background);
        transform: translate(0, -50%);
      }
      
      :host([placement="none"]) #arrow {
        display: none;
      }
    </style>
    <slot></slot>
    <div id="arrow"></div>
  `;
}

/**
 * @extends {HTMLElement}
 *
 * @attr {('top'|'right'|'bottom'|'left'|'none')} placement - The placement of the tooltip, defaults to "top"
 * @attr {string} bounds - ID for the containing element (one of it's parents) that should constrain the tooltips horizontal position.
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
 * @cssproperty --media-tooltip-arrow-color - Arrow color
 * @cssproperty --media-tooltip-distance - `distance` between tooltip and target.
 * @cssproperty --media-tooltip-offset-x - `translateX` offset of tooltip.
 */
class MediaTooltip extends globalThis.HTMLElement {
  static shadowRootOptions = { mode: 'open' as ShadowRootMode };
  static getTemplateHTML = getTemplateHTML;

  static get observedAttributes(): string[] {
    return [Attributes.PLACEMENT, Attributes.BOUNDS];
  }

  arrowEl: HTMLElement;

  constructor() {
    super();

    if (!this.shadowRoot) {
      // Set up the Shadow DOM if not using Declarative Shadow DOM.
      this.attachShadow((this.constructor as typeof MediaTooltip).shadowRootOptions);

      const attrs = namedNodeMapToObject(this.attributes);
      this.shadowRoot.innerHTML = (this.constructor as typeof MediaTooltip).getTemplateHTML(attrs);
    }

    this.arrowEl = this.shadowRoot.querySelector('#arrow');

    // Check if the placement prop has been set before the element was
    // defined / upgraded. Without this, placement might be permanently overriden
    // on the target element.
    // see: https://nolanlawson.com/2021/08/03/handling-properties-in-custom-element-upgrades/
    if (Object.prototype.hasOwnProperty.call(this, 'placement')) {
      const placement = this.placement;
      delete this.placement;
      this.placement = placement;
    }
  }

  // Adjusts tooltip position relative to the closest specified container
  // such that it doesn't spill out of the left or right sides. Only applies
  // to 'top' and 'bottom' placed tooltips.
  updateXOffset = () => {
    // If the tooltip is hidden don't offset the tooltip because it could be
    // positioned offscreen causing scrollbars to appear.
    if (!isElementVisible(this, { checkOpacity: false, checkVisibilityCSS: false })) return;

    const placement = this.placement;

    // we don't offset against tooltips coming out of left and right sides
    if (placement === 'left' || placement === 'right') {
      // could have been offset before switching to a new position
      this.style.removeProperty('--media-tooltip-offset-x');
      return;
    }

    // We need to calculate the difference (diff) between the left edge of the
    // tooltip compared to the left edge of the container element, to see if it
    // bleeds out (and the same for the right edges).
    // If they do, then we apply the diff as an offset to get it back within bounds
    // + any extra margin specified to create some buffer space, so it looks better.
    // e.g. it's 20px out of bounds, we nudge it 20px back in + margin
    const tooltipStyle = getComputedStyle(this);
    const containingEl =
      closestComposedNode(this, '#' + this.bounds) ?? getMediaController(this);
    if (!containingEl) return;
    const { x: containerX, width: containerWidth } =
      containingEl.getBoundingClientRect();
    const { x: tooltipX, width: tooltipWidth } = this.getBoundingClientRect();
    const tooltipRight = tooltipX + tooltipWidth;
    const containerRight = containerX + containerWidth;
    const offsetXVal = tooltipStyle.getPropertyValue(
      '--media-tooltip-offset-x'
    );
    const currOffsetX = offsetXVal
      ? parseFloat(offsetXVal.replace('px', ''))
      : 0;
    const marginVal = tooltipStyle.getPropertyValue(
      '--media-tooltip-container-margin'
    );
    const currMargin = marginVal ? parseFloat(marginVal.replace('px', '')) : 0;

    // We might have already offset the tooltip previously so we remove it's
    // current offset from our calculations, because we need to know if it goes
    // outside the boundary if we weren't already offsetting it
    // We also add on any additional container margin specified. Depending on
    // if we're adjusting the element leftwards or rightwards, we need either a
    // positive or negative offset
    const leftDiff = tooltipX - containerX + currOffsetX - currMargin;
    const rightDiff = tooltipRight - containerRight + currOffsetX + currMargin;

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
   * Get or set tooltip placement
   */
  get placement(): TooltipPlacement | undefined {
    return getStringAttr(this, Attributes.PLACEMENT);
  }

  set placement(value: TooltipPlacement | undefined) {
    setStringAttr(this, Attributes.PLACEMENT, value);
  }

  /**
   * Get or set tooltip container ID selector that will constrain the tooltips
   * horizontal position.
   */
  get bounds(): string | undefined {
    return getStringAttr(this, Attributes.BOUNDS);
  }

  set bounds(value: string | undefined) {
    setStringAttr(this, Attributes.BOUNDS, value);
  }
}

if (!globalThis.customElements.get('media-tooltip')) {
  globalThis.customElements.define('media-tooltip', MediaTooltip);
}

export default MediaTooltip;
