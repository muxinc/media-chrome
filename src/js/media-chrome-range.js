import { MediaStateReceiverAttributes } from './constants.js';
import { window, document } from './utils/server-safe-globals.js';
import { getOrInsertCSSRule } from './utils/element-utils.js';

const template = document.createElement('template');

// Can't comma-separate selectors like ::-webkit-slider-thumb, ::-moz-range-thumb
// Browsers ignore the whole rule if you do. So using templates for those.
const thumbStyles = `
  height: var(--thumb-height);
  width: var(--media-range-thumb-width, 10px);
  border: var(--media-range-thumb-border, none);
  border-radius: var(--media-range-thumb-border-radius, 10px);
  background: var(--media-range-thumb-background, var(--media-primary-color, rgb(238 238 238)));
  box-shadow: var(--media-range-thumb-box-shadow, 1px 1px 1px transparent);
  cursor: pointer;
  transition: var(--media-range-thumb-transition, none);
  transform: var(--media-range-thumb-transform, none);
  opacity: var(--media-range-thumb-opacity, 1);
`;

const trackStyles = `
  min-width: 40px;
  height: var(--track-height);
  border: var(--media-range-track-border, none);
  outline: var(--media-range-track-outline);
  outline-offset: var(--media-range-track-outline-offset);
  border-radius: var(--media-range-track-border-radius, 1px);
  background: var(--media-range-track-progress-internal, var(--media-range-track-background, rgb(255 255 255 / .2)));
  box-shadow: var(--media-range-track-box-shadow, none);
  transition: var(--media-range-track-transition, none);
  transform: translate(var(--media-range-track-translate-x, 0), var(--media-range-track-translate-y, 0));
  cursor: pointer;
`;

template.innerHTML = /*html*/`
  <style>
    :host {
      --thumb-height: var(--media-range-thumb-height, 10px);
      --track-height: var(--media-range-track-height, 4px);
      --_focus-box-shadow: var(--media-focus-box-shadow, inset 0 0 0 2px rgb(27 127 204 / .9));
      --_media-range-padding: var(--media-range-padding, var(--media-control-padding, 10px));

      vertical-align: middle;
      box-sizing: border-box;
      display: inline-block;
      position: relative;
      background: var(--media-control-background, var(--media-secondary-color, rgb(20 20 30 / .7)));
      transition: background .15s linear;
      width: 100px;
      height: calc(var(--media-control-height, 24px) + 2 * var(--_media-range-padding));
      padding-left: var(--media-range-padding-left, var(--_media-range-padding));
      padding-right: var(--media-range-padding-right, var(--_media-range-padding));
      pointer-events: auto;
      ${/* needed for vertical align issue 1px off */''}
      font-size: 0;
      box-shadow: var(--_focus-visible-box-shadow, none);
    }

    ${/* Reset before `outline` on track could be set by a CSS var */''}
    input[type=range]:focus {
      outline: 0;
    }
    input[type=range]:focus::-webkit-slider-runnable-track {
      outline: 0;
    }

    :host(:hover) {
      background: var(--media-control-hover-background, rgb(50 50 70 / .7));
    }

    #container {
      position: relative;
      height: 100%;
    }

    input[type=range] {
      ${/* Reset */''}
      -webkit-appearance: none; ${/* Hides the slider so that custom slider can be made */''}
      background: transparent; ${/* Otherwise white in Chrome */''}

      ${/* Fill host with the range */''}
      min-height: 100%;
      width: var(--media-range-track-width, 100%); ${/* Specific width is required for Firefox. */''}

      box-sizing: border-box;
      padding: 0;
      margin: 0;
    }

    ${/* Special styling for WebKit/Blink */''}
    input[type=range]::-webkit-slider-thumb {
      -webkit-appearance: none;
      ${thumbStyles}
      ${/* You need to specify a margin in Chrome, but in Firefox and IE it is automatic */''}
      margin-top: calc(calc(0px - var(--thumb-height) + var(--track-height)) / 2);
    }

    ${/* The thumb is not positioned relative to the track in Firefox */''}
    input[type=range]::-moz-range-thumb {
      ${thumbStyles}
      translate: var(--media-range-track-translate-x, 0) var(--media-range-track-translate-y, 0);
    }

    input[type=range]::-webkit-slider-runnable-track { ${trackStyles} }
    input[type=range]::-moz-range-track { ${trackStyles} }
    input[type=range]::-ms-track {
      ${/* Reset */''}
      width: 100%;
      cursor: pointer;
      ${/* Hides the slider so custom styles can be added */''}
      background: transparent;
      border-color: transparent;
      color: transparent;

      ${trackStyles}
    }

    #background,
    #pointer {
      min-width: 40px;
      width: var(--media-range-track-width, 100%);
      height: var(--track-height);
      border-radius: var(--media-range-track-border-radius, 1px);
      position: absolute;
      top: 50%;
      transform: translate(var(--media-range-track-translate-x, 0px), calc(var(--media-range-track-translate-y, 0px) - 50%));
      background: var(--media-range-track-background, rgb(255 255 255 / .2));
    }

    #pointer {
      min-width: auto;
      background: var(--media-range-track-pointer-background);
      border-right: var(--media-range-track-pointer-border-right);
      transition: visibility .25s, opacity .25s;
      visibility: hidden;
      opacity: 0;
    }

    :host(:hover) #pointer {
      transition: visibility .5s, opacity .5s;
      visibility: visible;
      opacity: 1;
    }

    #hoverzone {
      ${/* Add z-index so it overlaps the top of the control buttons if they are right under. */''}
      z-index: 1;
      display: var(--media-time-range-hover-display, none);
      position: absolute;
      width: 100%;
      bottom: var(--media-time-range-hover-bottom, -5px);
      height: var(--media-time-range-hover-height, max(calc(100% + 5px), 20px));
    }

    #range {
      z-index: 2;
      position: relative;
      height: var(--media-range-track-height, 4px);
    }

    input[type=range]:disabled::-webkit-slider-thumb {
      background-color: #777;
    }

    input[type=range]:disabled::-webkit-slider-runnable-track {
      background-color: #777;
    }
  </style>
  <div id="container">
    <div id="background"></div>
    <div id="pointer"></div>
    <div id="hoverzone"></div>
    <input id="range" type="range" min="0" max="1000" step="any" value="0">
  </div>
`;

/**
 * @extends {HTMLElement}
 *
 * @cssproperty --media-chrome-range-display
 * @cssproperty --media-control-display
 *
 * @cssproperty --media-range-padding
 * @cssproperty --media-range-padding-left
 * @cssproperty --media-range-padding-right
 *
 * @cssproperty --media-range-thumb-width
 * @cssproperty --media-range-thumb-height
 * @cssproperty --media-range-thumb-border
 * @cssproperty --media-range-thumb-border-radius
 * @cssproperty --media-range-thumb-background
 * @cssproperty --media-range-thumb-box-shadow
 * @cssproperty --media-range-thumb-transition
 * @cssproperty --media-range-thumb-transform
 * @cssproperty --media-range-thumb-opacity
 *
 * @cssproperty --media-range-track-background
 * @cssproperty --media-range-track-width
 * @cssproperty --media-range-track-height
 * @cssproperty --media-range-track-border
 * @cssproperty --media-range-track-outline
 * @cssproperty --media-range-track-outline-offset
 * @cssproperty --media-range-track-border-radius
 * @cssproperty --media-range-track-box-shadow
 * @cssproperty --media-range-track-transition
 * @cssproperty --media-range-track-translate-x
 * @cssproperty --media-range-track-translate-y
 *
 * @cssproperty --media-time-range-hover-display
 * @cssproperty --media-time-range-hover-bottom
 * @cssproperty --media-time-range-hover-bottom
 *
 * @cssproperty --media-range-track-pointer-background
 * @cssproperty --media-range-track-pointer-border-right
 *
 * @cssproperty --media-control-padding
 * @cssproperty --media-control-background
 * @cssproperty --media-control-hover-background
 *
 * @cssproperty --media-primary-color
 * @cssproperty --media-secondary-color
 * @cssproperty --media-focus-box-shadow
 * @cssproperty --media-control-height
 */
class MediaChromeRange extends window.HTMLElement {
  #thumbWidth;
  #mediaController;

  static get observedAttributes() {
    return [
      'disabled',
      'aria-disabled',
      MediaStateReceiverAttributes.MEDIA_CONTROLLER];
  }

  constructor() {
    super();

    if (!this.shadowRoot) {
      // Set up the Shadow DOM if not using Declarative Shadow DOM.
      this.attachShadow({ mode: 'open' });
      this.shadowRoot.appendChild(template.content.cloneNode(true));
    }

    const { style } = getOrInsertCSSRule(this.shadowRoot, ':host');
    style.setProperty('display', `var(--media-control-display, var(--${this.localName}-display, inline-block))`);

    this.container = this.shadowRoot.querySelector('#container');
    /** @type {Omit<HTMLInputElement, "value" | "min" | "max"> &
      * {value: number, min: number, max: number}} */
    this.range = this.shadowRoot.querySelector('#range');
    this.range.addEventListener('input', this.updateBar.bind(this));

    this.#thumbWidth = parseInt(getComputedStyle(this).getPropertyValue('--media-range-thumb-width') || '10', 10);
  }

  #onFocusIn = () => {
    if (this.range.matches(':focus-visible')) {
      const { style } = getOrInsertCSSRule(this.shadowRoot, ':host');
      style.setProperty('--_focus-visible-box-shadow', 'var(--_focus-box-shadow)');
    }
  }

  #onFocusOut = () => {
    const { style } = getOrInsertCSSRule(this.shadowRoot, ':host');
    style.removeProperty('--_focus-visible-box-shadow');
  }

  attributeChangedCallback(attrName, oldValue, newValue) {
    if (attrName === MediaStateReceiverAttributes.MEDIA_CONTROLLER) {
      if (oldValue) {
        this.#mediaController?.unassociateElement?.(this);
        this.#mediaController = null;
      }
      if (newValue) {
        // @ts-ignore
        this.#mediaController = this.getRootNode()?.getElementById(newValue);
        this.#mediaController?.associateElement?.(this);
      }
    } else if (
      attrName === 'disabled' ||
      attrName === 'aria-disabled' &&
      oldValue !== newValue
    ) {
      if (newValue == null) {
        this.range.removeAttribute(attrName);
      } else {
        this.range.setAttribute(attrName, newValue);
      }
    }
  }

  connectedCallback() {
    const mediaControllerId = this.getAttribute(
      MediaStateReceiverAttributes.MEDIA_CONTROLLER
    );
    if (mediaControllerId) {
      // @ts-ignore
      this.#mediaController = this.getRootNode()?.getElementById(mediaControllerId);
      this.#mediaController?.associateElement?.(this);
    }

    this.updateBar();

    this.shadowRoot.addEventListener('focusin', this.#onFocusIn);
    this.shadowRoot.addEventListener('focusout', this.#onFocusOut);
  }

  disconnectedCallback() {
    // Use cached mediaController, getRootNode() doesn't work if disconnected.
    this.#mediaController?.unassociateElement?.(this);
    this.#mediaController = null;

    this.shadowRoot.removeEventListener('focusin', this.#onFocusIn);
    this.shadowRoot.removeEventListener('focusout', this.#onFocusOut);
  }

  updatePointerBar(evt) {
    // Get mouse position percent
    const rangeRect = this.range.getBoundingClientRect();
    let mousePercent = (evt.clientX - rangeRect.left) / rangeRect.width;
    // Lock between 0 and 1
    mousePercent = Math.max(0, Math.min(1, mousePercent));

    const { style } = getOrInsertCSSRule(this.shadowRoot, '#pointer');
    style.setProperty('width', `${mousePercent * rangeRect.width}px`);
  }

  /*
    Native ranges have a single color for the whole track, which is different
    from most video players that have a colored "bar" to the left of the handle
    showing playback progress or volume level. Here we're building that bar
    by using a background gradient that moves with the range value.
  */
  updateBar() {
    const colorArray = this.getBarColors();

    let gradientStr = 'linear-gradient(to right, ';
    /** @type {number|string} */
    let prevPercent = 0;
    colorArray.forEach((color) => {
      if (color[1] < prevPercent) return;
      gradientStr =
        gradientStr + `${color[0]} ${prevPercent}%, ${color[0]} ${color[1]}%,`;
      prevPercent = color[1];
    });
    gradientStr = gradientStr.slice(0, gradientStr.length - 1) + ')';

    const { style } = getOrInsertCSSRule(this.shadowRoot, '#range');
    style.setProperty('--media-range-track-progress-internal', gradientStr);
  }

  /*
    Build the color gradient for the range bar.
    Creating an array so progress-bar can insert the buffered bar.
  */
  getBarColors() {
    const range = this.range;
    const relativeValue = range.value - range.min;
    const relativeMax = range.max - range.min;
    const rangePercent = (relativeValue / relativeMax) * 100;

    let thumbPercent = 0;
    // If the range thumb is at min or max don't correct the time range.
    // Ideally the thumb center would go all the way to min and max values
    // but input[type=range] doesn't play like that.
    if (range.value > range.min && range.value < range.max) {
      const thumbOffset = this.#thumbWidth * (0.5 - rangePercent / 100);
      thumbPercent = (thumbOffset / range.offsetWidth) * 100;
    }

    let colorArray = [
      ['var(--media-range-bar-color, var(--media-primary-color, rgb(238 238 238)))', rangePercent + thumbPercent],
      ['var(--media-range-track-color, transparent)', 100],
    ];

    return colorArray;
  }

  get keysUsed() {
    return ['ArrowUp', 'ArrowRight', 'ArrowDown', 'ArrowLeft'];
  }
}

if (!window.customElements.get('media-chrome-range')) {
  window.customElements.define('media-chrome-range', MediaChromeRange);
}

export default MediaChromeRange;
