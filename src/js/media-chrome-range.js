import { MediaStateReceiverAttributes } from './constants.js';
import { globalThis, document } from './utils/server-safe-globals.js';
import { getOrInsertCSSRule, getPointProgressOnLine } from './utils/element-utils.js';

const template = document.createElement('template');
template.innerHTML = /*html*/`
  <style>
    :host {
      --_focus-box-shadow: var(--media-focus-box-shadow, inset 0 0 0 2px rgb(27 127 204 / .9));
      --_media-range-padding: var(--media-range-padding, var(--media-control-padding, 10px));

      box-shadow: var(--_focus-visible-box-shadow, none);
      background: var(--media-control-background, var(--media-secondary-color, rgb(20 20 30 / .7)));
      height: calc(var(--media-control-height, 24px) + 2 * var(--_media-range-padding));
      display: inline-flex;
      align-items: center;
      ${/* Don't horizontal align w/ justify-content! #container can go negative on the x-axis w/ small width. */''}
      vertical-align: middle;
      box-sizing: border-box;
      position: relative;
      width: 100px;
      transition: background .15s linear;
      cursor: pointer;
      pointer-events: auto;
      touch-action: none; ${/* Prevent scrolling when dragging on mobile. */''}
      z-index: 1; ${/* Apply z-index to overlap buttons below. */''}
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

    #leftgap {
      padding-left: var(--media-range-padding-left, var(--_media-range-padding));
    }

    #rightgap {
      padding-right: var(--media-range-padding-right, var(--_media-range-padding));
    }

    #startpoint,
    #endpoint {
      position: absolute;
    }

    #endpoint {
      right: 0;
    }

    #container {
      ${/* Not using the CSS `padding` prop makes it easier for slide open volume ranges so the width can be zero. */''}
      width: var(--media-range-track-width, 100%);
      transform: translate(var(--media-range-track-translate-x, 0px), var(--media-range-track-translate-y, 0px));
      position: relative;
      height: 100%;
      display: flex;
      align-items: center;
      min-width: 40px;
    }

    #range {
      ${/* The input range acts as a hover and hit zone for input events. */''}
      display: var(--media-time-range-hover-display, block);
      bottom: var(--media-time-range-hover-bottom, -7px);
      height: var(--media-time-range-hover-height, max(100% + 7px, 25px));
      width: 100%;
      position: absolute;
      cursor: pointer;

      -webkit-appearance: none; ${/* Hides the slider so that custom slider can be made */''}
      -webkit-tap-highlight-color: transparent;
      background: transparent; ${/* Otherwise white in Chrome */''}
      margin: 0;
      z-index: 1;
    }

    @media (hover: hover) {
      #range {
        bottom: var(--media-time-range-hover-bottom, -5px);
        height: var(--media-time-range-hover-height, max(100% + 5px, 20px));
      }
    }

    ${/* Special styling for WebKit/Blink */''}
    ${/* Make thumb width/height small so it has no effect on range click position. */''}
    #range::-webkit-slider-thumb {
      -webkit-appearance: none;
      background: transparent;
      width: .1px;
      height: .1px;
    }

    ${/* The thumb is not positioned relative to the track in Firefox */''}
    #range::-moz-range-thumb {
      background: transparent;
      border: transparent;
      width: .1px;
      height: .1px;
    }

    #appearance {
      height: var(--media-range-track-height, 4px);
      display: flex;
      flex-direction: column;
      justify-content: center;
      width: 100%;
      position: absolute;
    }

    #background,
    #track {
      border-radius: var(--media-range-track-border-radius, 1px);
      position: absolute;
      width: 100%;
      height: 100%;
    }

    #background {
      background: var(--media-range-track-background, rgb(255 255 255 / .2));
      backdrop-filter: var(--media-range-track-background-backdrop-filter);
      -webkit-backdrop-filter: var(--media-range-track-background-backdrop-filter);
    }

    #track {
      border: var(--media-range-track-border, none);
      outline: var(--media-range-track-outline);
      outline-offset: var(--media-range-track-outline-offset);
      backdrop-filter: var(--media-range-track-backdrop-filter);
      -webkit-backdrop-filter: var(--media-range-track-backdrop-filter);
      box-shadow: var(--media-range-track-box-shadow, none);
      overflow: hidden;
    }

    #progress {
      background: var(--media-range-bar-color, var(--media-primary-color, rgb(238 238 238)));
      border-radius: var(--media-range-track-border-radius, 1px);
      transition: var(--media-range-track-transition);
      position: absolute;
      height: 100%;
    }

    #highlight {
      border-radius: var(--media-range-track-border-radius, 1px);
      position: absolute;
      height: 100%;
    }

    #pointer {
      background: var(--media-range-track-pointer-background);
      border-right: var(--media-range-track-pointer-border-right);
      border-radius: var(--media-range-track-border-radius, 1px);
      transition: visibility .25s, opacity .25s;
      visibility: hidden;
      opacity: 0;
      position: absolute;
      height: 100%;
    }

    :host(:hover) #pointer {
      transition: visibility .5s, opacity .5s;
      visibility: visible;
      opacity: 1;
    }

    #thumb {
      width: var(--media-range-thumb-width, 10px);
      height: var(--media-range-thumb-height, 10px);
      margin-left: calc(var(--media-range-thumb-width, 10px) / -2);
      border: var(--media-range-thumb-border, none);
      border-radius: var(--media-range-thumb-border-radius, 10px);
      background: var(--media-range-thumb-background, var(--media-primary-color, rgb(238 238 238)));
      box-shadow: var(--media-range-thumb-box-shadow, 1px 1px 1px transparent);
      transition: var(--media-range-thumb-transition);
      transform: var(--media-range-thumb-transform, none);
      opacity: var(--media-range-thumb-opacity, 1);
      position: absolute;
      left: 0;
      cursor: pointer;
    }

    :host([disabled]) #thumb {
      background-color: #777;
    }
  </style>
  <div id="leftgap"></div>
  <div id="container">
    <div id="startpoint"></div>
    <div id="endpoint"></div>
    <div id="appearance">
      <div id="background"></div>
      <div id="track">
        <div id="highlight"></div>
        <div id="pointer"></div>
        <div id="progress"></div>
      </div>
      <div id="thumb"></div>
    </div>
    <input id="range" type="range" min="0" max="1" step="any" value="0">
  </div>
  <div id="rightgap"></div>
`;

/**
 * @extends {HTMLElement}
 *
 * @attr {boolean} disabled - The Boolean disabled attribute makes the element not mutable or focusable.
 * @attr {string} mediacontroller - The element `id` of the media controller to connect to (if not nested within).
 *
 * @cssproperty --media-primary-color - Default color of range bar.
 * @cssproperty --media-secondary-color - Default color of range background.
 *
 * @cssproperty [--media-control-display = inline-block] - `display` property of control.
 * @cssproperty --media-control-padding - `padding` of control.
 * @cssproperty --media-control-background - `background` of control.
 * @cssproperty --media-control-hover-background - `background` of control hover state.
 * @cssproperty --media-control-height - `height` of control.
 *
 * @cssproperty --media-range-padding - `padding` of range.
 * @cssproperty --media-range-padding-left - `padding-left` of range.
 * @cssproperty --media-range-padding-right - `padding-right` of range.
 *
 * @cssproperty --media-range-thumb-width - `width` of range thumb.
 * @cssproperty --media-range-thumb-height - `height` of range thumb.
 * @cssproperty --media-range-thumb-border - `border` of range thumb.
 * @cssproperty --media-range-thumb-border-radius - `border-radius` of range thumb.
 * @cssproperty --media-range-thumb-background - `background` of range thumb.
 * @cssproperty --media-range-thumb-box-shadow - `box-shadow` of range thumb.
 * @cssproperty --media-range-thumb-transition - `transition` of range thumb.
 * @cssproperty --media-range-thumb-transform - `transform` of range thumb.
 * @cssproperty --media-range-thumb-opacity - `opacity` of range thumb.
 *
 * @cssproperty [--media-range-bar-color = var(--media-primary-color, rgb(238 238 238))] - `color_value` of range bar (elapsed progress).
 * @cssproperty [--media-range-track-color = transparent] - `color_value` of range track (remaining progress).
 * @cssproperty --media-range-track-backdrop-filter - `backdrop-filter` of range track.
 * @cssproperty --media-range-track-width - `width` of range track.
 * @cssproperty --media-range-track-height - `height` of range track.
 * @cssproperty --media-range-track-border - `border` of range track.
 * @cssproperty --media-range-track-outline - `outline` of range track.
 * @cssproperty --media-range-track-outline-offset - `outline-offset` of range track.
 * @cssproperty --media-range-track-border-radius - `border-radius` of range track.
 * @cssproperty --media-range-track-box-shadow - `box-shadow` of range track.
 * @cssproperty --media-range-track-transition - `transition` of range track.
 * @cssproperty --media-range-track-translate-x - `translate` x-coordinate of range track.
 * @cssproperty --media-range-track-translate-y - `translate` y-coordinate of range track.
 *
 * @cssproperty --media-range-track-background - `background` of range track background.
 * @cssproperty --media-range-track-background-backdrop-filter - `backdrop-filter` of range track background.
 *
 * @cssproperty --media-time-range-hover-display - `display` of range hover zone.
 * @cssproperty --media-time-range-hover-bottom - `bottom` of range hover zone.
 * @cssproperty --media-time-range-hover-height - `height` of range hover zone.
 *
 * @cssproperty --media-range-track-pointer-background - `background` of range track pointer.
 * @cssproperty --media-range-track-pointer-border-right - `border-right` of range track pointer.
 */
class MediaChromeRange extends globalThis.HTMLElement {
  #mediaController;
  #isInputTarget;
  #startpoint;
  #endpoint;

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
    style.setProperty('display', `var(--media-control-display, var(--${this.localName}-display, inline-flex))`);

    this.container = this.shadowRoot.querySelector('#container');
    this.#startpoint = this.shadowRoot.querySelector('#startpoint');
    this.#endpoint = this.shadowRoot.querySelector('#endpoint');

    /** @type {Omit<HTMLInputElement, "value" | "min" | "max"> &
      * {value: number, min: number, max: number}} */
    this.range = this.shadowRoot.querySelector('#range');
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
      if (newValue && this.isConnected) {
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
        this.#enableUserEvents();
      } else {
        this.range.setAttribute(attrName, newValue);
        this.#disableUserEvents();
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

    this.#enableUserEvents();
  }

  disconnectedCallback() {
    this.#disableUserEvents();

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
    mousePercent = Math.max(0, Math.min(1, mousePercent)) * 100;

    const { style } = getOrInsertCSSRule(this.shadowRoot, '#pointer');
    style.setProperty('width', `${mousePercent}%`);
  }

  updateBar() {
    const rangePercent = this.range.valueAsNumber * 100;

    const progressRule = getOrInsertCSSRule(this.shadowRoot, '#progress');
    const thumbRule = getOrInsertCSSRule(this.shadowRoot, '#thumb');

    progressRule.style.setProperty('width', `${rangePercent}%`);
    thumbRule.style.setProperty('left', `${rangePercent}%`);
  }

  get dragging() {
    return this.hasAttribute('dragging');
  }

  #enableUserEvents() {
    if (this.hasAttribute('disabled')) return;

    this.addEventListener('input', this);
    this.addEventListener('pointerdown', this);
    this.addEventListener('pointerenter', this);
  }

  #disableUserEvents() {
    this.removeEventListener('input', this);
    this.removeEventListener('pointerdown', this);
    this.removeEventListener('pointerenter', this);
    globalThis.window?.removeEventListener('pointerup', this);
    globalThis.window?.removeEventListener('pointermove', this);
  }

  handleEvent(evt) {
    switch (evt.type) {
      case 'input':
        this.updateBar();
        break;
      case 'pointerenter':
        this.#handlePointerEnter(evt);
        break;
      case 'pointerdown':
        this.#handlePointerDown(evt);
        break;
      case 'pointermove':
        this.#handlePointerMove(evt);
        break;
      case 'pointerup':
        this.#handlePointerUp();
        break;
      case 'pointerleave':
        this.#handlePointerLeave();
        break;
    }
  }

  #handlePointerDown(evt) {
    // Events outside the range element are handled manually below.
    this.#isInputTarget = evt.composedPath().includes(this.range);

    globalThis.window?.addEventListener('pointerup', this);
  }

  #handlePointerEnter(evt) {
    // On mobile a pointerdown is not required to drag the range.
    if (evt.pointerType !== 'mouse') this.#handlePointerDown(evt);

    this.addEventListener('pointerleave', this);
    globalThis.window?.addEventListener('pointermove', this);
  }

  #handlePointerUp() {
    globalThis.window?.removeEventListener('pointerup', this);
    this.toggleAttribute('dragging', false);
    this.range.disabled = this.hasAttribute('disabled');
  }

  #handlePointerLeave() {
    this.removeEventListener('pointerleave', this);
    globalThis.window?.removeEventListener('pointermove', this);
    this.toggleAttribute('dragging', false);
    this.range.disabled = this.hasAttribute('disabled');
  }

  #handlePointerMove(evt) {
    this.toggleAttribute('dragging', evt.buttons === 1 || evt.pointerType !== 'mouse');
    this.updatePointerBar(evt);

    // If the native input target & events are used don't fire manual input events.
    if (this.dragging && (evt.pointerType !== 'mouse' || !this.#isInputTarget)) {
      // Disable native input events if manual events are fired.
      this.range.disabled = true;

      let pointerRatio = getPointProgressOnLine(
        evt.clientX,
        evt.clientY,
        this.#startpoint.getBoundingClientRect(),
        this.#endpoint.getBoundingClientRect(),
      );
      pointerRatio = Math.max(0, Math.min(1, pointerRatio));

      this.range.valueAsNumber = pointerRatio;
      this.range.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
    }
  }

  get keysUsed() {
    return ['ArrowUp', 'ArrowRight', 'ArrowDown', 'ArrowLeft'];
  }
}

if (!globalThis.customElements.get('media-chrome-range')) {
  globalThis.customElements.define('media-chrome-range', MediaChromeRange);
}

export { MediaChromeRange };
export default MediaChromeRange;
