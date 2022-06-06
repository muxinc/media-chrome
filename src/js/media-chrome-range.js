import { MediaUIAttributes } from './constants.js';
import { defineCustomElement } from './utils/defineCustomElement.js';
import {
  Window as window,
  Document as document,
} from './utils/server-safe-globals.js';

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
  background: var(--media-range-track-background-internal, var(--media-range-track-background, #eee));

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

      position: relative;
      display: inline-block;
      vertical-align: middle;
      box-sizing: border-box;
      background: var(--media-control-background, rgba(20,20,30, 0.7));
      transition: background 0.15s linear;
      height: 44px;
      width: 100px;
      padding: 0 10px;

      pointer-events: auto;
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

    /* Eventually want to move towards different styles for focus-visible
       https://github.com/WICG/focus-visible/blob/master/src/focus-visible.js
       Youtube appears to do this by de-focusing a button after a button click */
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
  <input id="range" type="range" min="0" max="1000" step="1" value="0">
`;

class MediaChromeRange extends window.HTMLElement {
  static get observedAttributes() {
    return [MediaUIAttributes.MEDIA_CONTROLLER];
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
    const mediaControllerSelector = this.getAttribute(
      MediaUIAttributes.MEDIA_CONTROLLER
    );
    if (mediaControllerSelector) {
      const mediaControllerEl = document.getElementById(mediaControllerId);
      mediaControllerEl?.unassociateElement?.(this);
    }
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

    this.style.setProperty(
      '--media-range-track-background-internal',
      gradientStr
    );
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

    let colorArray = [
      ['var(--media-range-bar-color, #fff)', rangePercent],
      ['var(--media-range-track-background, #333)', 100],
    ];

    return colorArray;
  }
}

defineCustomElement('media-chrome-range', MediaChromeRange);

export default MediaChromeRange;
