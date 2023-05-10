import { MediaUIAttributes, MediaStateReceiverAttributes } from './constants.js';
import { nouns } from './labels/labels.js';
import { window, document } from './utils/server-safe-globals.js';
import { getOrInsertCSSRule } from './utils/element-utils.js';

export const Attributes = {
  LOADING_DELAY: 'loadingdelay',
  IS_LOADING: 'isloading',
};

const DEFAULT_LOADING_DELAY = 500;

const template = document.createElement('template');

const loadingIndicatorIcon = `
<svg aria-hidden="true" viewBox="0 0 100 100">
  <path d="M73,50c0-12.7-10.3-23-23-23S27,37.3,27,50 M30.9,50c0-10.5,8.5-19.1,19.1-19.1S69.1,39.5,69.1,50">
    <animateTransform
       attributeName="transform"
       attributeType="XML"
       type="rotate"
       dur="1s"
       from="0 50 50"
       to="360 50 50"
       repeatCount="indefinite" />
  </path>
</svg>
`;

template.innerHTML = /*html*/`
<style>
:host {
  display: var(--media-control-display, var(--media-loading-indicator-display, inline-block));
  vertical-align: middle;
  box-sizing: border-box;
  --_loading-indicator-delay: var(--media-loading-indicator-delay, ${DEFAULT_LOADING_DELAY}ms);
}

#status {
  color: rgba(0,0,0,0);
  width: 0px;
  height: 0px;
}

:host slot[name=loading] > *,
:host ::slotted([slot=loading]) {
  opacity: 0;
  transition: opacity 0.15s;
}

:host([${MediaUIAttributes.MEDIA_LOADING}]:not([${MediaUIAttributes.MEDIA_PAUSED}])) slot[name=loading] > *,
:host([${MediaUIAttributes.MEDIA_LOADING}]:not([${MediaUIAttributes.MEDIA_PAUSED}])) ::slotted([slot=loading]) {
  opacity: 1;
  transition: opacity 0.15s var(--_loading-indicator-delay);
}

:host(:not([${MediaUIAttributes.MEDIA_LOADING}])) #status {
  display: none;
}

svg, img, ::slotted(svg), ::slotted(img) {
  width: var(--media-loading-icon-width, 100px);
  height: var(--media-loading-icon-height);
  fill: var(--media-icon-color, var(--media-primary-color, rgb(238 238 238)));
  vertical-align: middle;
}
</style>

<slot name="loading">${loadingIndicatorIcon}</slot>
<div id="status" role="status" aria-live="polite">${nouns.MEDIA_LOADING()}</div>
`;

/**
 * @slot loading - The element shown for when the media is in a buffering state.
 *
 * @attr {string} loadingdelay - Set the delay in ms before the loading animation is shown.
 * @attr {boolean} isloading - For the element to display the contents of the loading slot.
 * @attr {string} mediacontroller - The element `id` of the media controller to connect to (if not nested within).
 * @attr {boolean} mediapaused - (read-only) Present if the media is paused.
 * @attr {boolean} medialoading - (read-only) Present if the media is loading.
 *
 * @cssproperty --media-primary-color - Default color of text and icon.
 * @cssproperty --media-icon-color - `fill` color of button icon.
 *
 * @cssproperty --media-control-display - `display` property of control.
 *
 * @cssproperty --media-loading-indicator-display - `display` property of loading indicator.
 * @cssproperty --media-loading-icon-width - `width` of loading icon.
 * @cssproperty --media-loading-icon-height - `height` of loading icon.
 */
class MediaLoadingIndicator extends window.HTMLElement {
  #mediaController;
  #delay = DEFAULT_LOADING_DELAY;
  #style;

  static get observedAttributes() {
    return [
      MediaStateReceiverAttributes.MEDIA_CONTROLLER,
      MediaUIAttributes.MEDIA_PAUSED,
      MediaUIAttributes.MEDIA_LOADING,
      Attributes.LOADING_DELAY,
    ];
  }

  constructor() {
    super();

    if (!this.shadowRoot) {
      // Set up the Shadow DOM if not using Declarative Shadow DOM.
      const shadow = this.attachShadow({ mode: 'open' });
      const indicatorHTML = template.content.cloneNode(true);
      shadow.appendChild(indicatorHTML);
    }

    const { style } = getOrInsertCSSRule(this.shadowRoot, ':host');
    this.#style = style;
  }

  get delay() {
    return this.#delay;
  }

  set delay(delay) {
    this.#delay = delay;

    this.
    style.setProperty(
      '--_loading-indicator-delay',
      `var(--media-loading-indicator-delay, ${delay}ms)`
    );
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
  }

  disconnectedCallback() {
    // Use cached mediaController, getRootNode() doesn't work if disconnected.
    this.#mediaController?.unassociateElement?.(this);
    this.#mediaController = null;
  }
}

if (!window.customElements.get('media-loading-indicator')) {
  window.customElements.define('media-loading-indicator', MediaLoadingIndicator);
}

export default MediaLoadingIndicator;
