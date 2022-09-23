import { MediaUIAttributes } from './constants.js';
import { defineCustomElement } from './utils/defineCustomElement.js';
import {
  Window as window,
  Document as document,
} from './utils/server-safe-globals.js';
import { getOrInsertCSSRule } from './utils/element-utils.js';

const template = document.createElement('template');

// Can't comma-separate selectors like ::-webkit-slider-thumb, ::-moz-range-thumb
// Browsers ignore the whole rule if you do. So using templates for those.
const thumbStyles = `
  height: var(--thumb-height);
  width: var(--media-range-thumb-width, 10px);
  border: var(--media-range-thumb-border, none);
  border-radius: var(--media-range-thumb-border-radius, 10px);
  background: var(--media-range-thumb-background, #fff);
  box-shadow: var(--media-range-thumb-box-shadow, 1px 1px 1px transparent);
  cursor: pointer;
  transition: var(--media-range-thumb-transition, none);
  transform: var(--media-range-thumb-transform, none);
  opacity: var(--media-range-thumb-opacity, 1);
`;

const trackStyles = `
  width: var(--media-range-track-width, 100%);
  min-width: 40px;
  height: var(--track-height);
  border: var(--media-range-track-border, none);
  border-radius: var(--media-range-track-border-radius, 0);
  background: var(--media-range-track-progress-internal, var(--media-range-track-background, #eee));
  box-shadow: var(--media-range-track-box-shadow, none);
  transition: var(--media-range-track-transition, none);
  transform: translate(var(--media-range-track-translate-x, 0), var(--media-range-track-translate-y, 0));
  cursor: pointer;
`;

template.innerHTML = `
  <style>
    :host {
      --thumb-height: var(--media-range-thumb-height, 10px);
      --track-height: var(--media-range-track-height, 4px);
      --media-range-padding: var(--media-control-padding, 10px);
      --_media-range-padding: var(--media-range-padding, 10px);

      position: relative;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      vertical-align: middle;
      box-sizing: border-box;
      background: var(--media-control-background, rgba(20,20,30, 0.7));
      transition: background 0.15s linear;
      width: 100px;
      height: calc(var(--media-control-height, 24px) + 2 * var(--_media-range-padding));
      padding-left: var(--media-range-padding-left, var(--_media-range-padding));
      padding-right: var(--media-range-padding-right, var(--_media-range-padding));
      pointer-events: auto;
      /* needed for vertical align issue 1px off */
      font-size: 0;
    }

    :host(:hover) {
      background: var(--media-control-hover-background, rgba(50,50,60, 0.7));
    }

    input[type=range] {
      /* Reset */
      -webkit-appearance: none; /* Hides the slider so that custom slider can be made */
      background: transparent; /* Otherwise white in Chrome */

      /* Fill host with the range */
      min-height: 100%;
      width: var(--media-range-track-width, 100%); /* Specific width is required for Firefox. */

      box-sizing: border-box;
      padding: 0;
      margin: 0;
    }

    /* Special styling for WebKit/Blink */
    input[type=range]::-webkit-slider-thumb {
      -webkit-appearance: none;
      ${thumbStyles}
      /* You need to specify a margin in Chrome, but in Firefox and IE it is automatic */
      margin-top: calc(calc(0px - var(--thumb-height) + var(--track-height)) / 2);
    }

    /* The thumb is not positioned relative to the track in Firefox */
    input[type=range]::-moz-range-thumb {
      ${thumbStyles}
      translate: var(--media-range-track-translate-x, 0) var(--media-range-track-translate-y, 0);
    }

    input[type=range]::-webkit-slider-runnable-track { ${trackStyles} }
    input[type=range]::-moz-range-track { ${trackStyles} }
    input[type=range]::-ms-track {
      /* Reset */
      width: 100%;
      cursor: pointer;
      /* Hides the slider so custom styles can be added */
      background: transparent;
      border-color: transparent;
      color: transparent;

      ${trackStyles}
    }

    #background,
    #pointer {
      ${trackStyles}
      width: auto;
      position: absolute;
      top: 50%;
      transform: translate(var(--media-range-track-translate-x, 0px), calc(var(--media-range-track-translate-y, 0px) - 50%));
      left: var(--media-range-padding-left, var(--_media-range-padding));
      right: var(--media-range-padding-right, var(--_media-range-padding));
      background: var(--media-range-track-background, #333);
    }

    #pointer {
      min-width: auto;
      right: auto;
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
      /* Add z-index so it overlaps the top of the control buttons if they are right under. */
      z-index: 1;
      display: var(--media-time-range-hover-display, none);
      box-sizing: border-box;
      position: absolute;
      left: var(--media-range-padding-left, var(--_media-range-padding));
      right: var(--media-range-padding-right, var(--_media-range-padding));
      bottom: var(--media-time-range-hover-bottom, -5px);
      height: var(--media-time-range-hover-height, max(calc(100% + 5px), 20px));
    }

    #range {
      z-index: 2;
      position: relative;
      height: var(--media-range-track-height, 4px);
    }

    /*
     * set input to focus-visible, unless host-context is available (in chrome)
     * in which case we can have the focus ring be on the host itself
     */
    :host-context([media-keyboard-control]):host(:focus),
    :host-context([media-keyboard-control]):host(:focus-within) {
      box-shadow: inset 0 0 0 2px rgba(27, 127, 204, 0.9);
    }
    :host-context([media-keyboard-control]) input[type=range]:focus-visible {
      box-shadow: none;
    }
    input[type=range]:focus-visible {
      box-shadow: inset 0 0 0 2px rgba(27, 127, 204, 0.9);
    }
    input[type=range]:focus {
      outline: 0;
    }
    input[type=range]:focus::-webkit-slider-runnable-track {
      outline: 0;
    }

    input[type=range]:disabled::-webkit-slider-thumb {
      background-color: #777;
    }

    input[type=range]:disabled::-webkit-slider-runnable-track {
      background-color: #777;
    }
  </style>
  <div id="background"></div>
  <div id="pointer"></div>
  <div id="hoverzone"></div>
  <input id="range" type="range" min="0" max="1000" step="any" value="0">
`;

class MediaChromeRange extends window.HTMLElement {
  static get observedAttributes() {
    return [
      'disabled',
      'aria-disabled',
      MediaUIAttributes.MEDIA_CONTROLLER];
  }

  constructor() {
    super();

    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));

    this.range = this.shadowRoot.querySelector('#range');
    this.range.addEventListener('input', this.updateBar.bind(this));
  }

  attributeChangedCallback(attrName, oldValue, newValue) {
    if (attrName === MediaUIAttributes.MEDIA_CONTROLLER) {
      if (oldValue) {
        const mediaControllerEl = document.getElementById(oldValue);
        mediaControllerEl?.unassociateElement?.(this);
      }
      if (newValue) {
        const mediaControllerEl = document.getElementById(newValue);
        mediaControllerEl?.associateElement?.(this);
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
      MediaUIAttributes.MEDIA_CONTROLLER
    );
    if (mediaControllerId) {
      const mediaControllerEl = document.getElementById(mediaControllerId);
      mediaControllerEl?.associateElement?.(this);
    }
    this.updateBar();
  }

  disconnectedCallback() {
    const mediaControllerId = this.getAttribute(
      MediaUIAttributes.MEDIA_CONTROLLER
    );
    if (mediaControllerId) {
      const mediaControllerEl = document.getElementById(mediaControllerId);
      mediaControllerEl?.unassociateElement?.(this);
    }
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
    let prevPercent = 0;
    colorArray.forEach((color) => {
      if (color[1] < prevPercent) return;
      gradientStr =
        gradientStr + `${color[0]} ${prevPercent}%, ${color[0]} ${color[1]}%,`;
      prevPercent = color[1];
    });
    gradientStr = gradientStr.slice(0, gradientStr.length - 1) + ')';

    const { style } = getOrInsertCSSRule(this.shadowRoot, ':host');
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
      const thumbWidth =
        getComputedStyle(this).getPropertyValue('--media-range-thumb-width') ||
        '10px';
      const thumbOffset = parseInt(thumbWidth) * (0.5 - rangePercent / 100);
      thumbPercent = (thumbOffset / range.offsetWidth) * 100;
    }

    let colorArray = [
      ['var(--media-range-bar-color, #fff)', rangePercent + thumbPercent],
      ['transparent', 100],
    ];

    return colorArray;
  }

  get keysUsed() {
    return ['ArrowUp', 'ArrowRight', 'ArrowDown', 'ArrowLeft'];
  }
}

defineCustomElement('media-chrome-range', MediaChromeRange);

export default MediaChromeRange;
