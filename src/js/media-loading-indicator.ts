import {
  MediaUIAttributes,
  MediaStateReceiverAttributes,
} from './constants.js';
import { nouns } from './labels/labels.js';
import { globalThis, document } from './utils/server-safe-globals.js';
import {
  getBooleanAttr,
  setBooleanAttr,
  getOrInsertCSSRule,
} from './utils/element-utils.js';
import MediaController from './media-controller.js';
export const Attributes = {
  LOADING_DELAY: 'loadingdelay',
};

const DEFAULT_LOADING_DELAY = 500;

const template: HTMLTemplateElement = document.createElement('template');

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

template.innerHTML = /*html*/ `
<style>
:host {
  display: var(--media-control-display, var(--media-loading-indicator-display, inline-block));
  vertical-align: middle;
  box-sizing: border-box;
  --_loading-indicator-delay: var(--media-loading-indicator-transition-delay, ${DEFAULT_LOADING_DELAY}ms);
}

#status {
  color: rgba(0,0,0,0);
  width: 0px;
  height: 0px;
}

:host slot[name=icon] > *,
:host ::slotted([slot=icon]) {
  opacity: var(--media-loading-indicator-opacity, 0);
  transition: opacity 0.15s;
}

:host([${MediaUIAttributes.MEDIA_LOADING}]:not([${
  MediaUIAttributes.MEDIA_PAUSED
}])) slot[name=icon] > *,
:host([${MediaUIAttributes.MEDIA_LOADING}]:not([${
  MediaUIAttributes.MEDIA_PAUSED
}])) ::slotted([slot=icon]) {
  opacity: var(--media-loading-indicator-opacity, 1);
  transition: opacity 0.15s var(--_loading-indicator-delay);
}

:host #status {
  visibility: var(--media-loading-indicator-opacity, hidden);
  transition: visibility 0.15s;
}

:host([${MediaUIAttributes.MEDIA_LOADING}]:not([${
  MediaUIAttributes.MEDIA_PAUSED
}])) #status {
  visibility: var(--media-loading-indicator-opacity, visible);
  transition: visibility 0.15s var(--_loading-indicator-delay);
}

svg, img, ::slotted(svg), ::slotted(img) {
  width: var(--media-loading-indicator-icon-width);
  height: var(--media-loading-indicator-icon-height, 100px);
  fill: var(--media-icon-color, var(--media-primary-color, rgb(238 238 238)));
  vertical-align: middle;
}
</style>

<slot name="icon">${loadingIndicatorIcon}</slot>
<div id="status" role="status" aria-live="polite">${nouns.MEDIA_LOADING()}</div>
`;

/**
 * @slot icon - The element shown for when the media is in a buffering state.
 *
 * @attr {string} loadingdelay - Set the delay in ms before the loading animation is shown.
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
 * @cssproperty [ --media-loading-indicator-opacity = 0 ] - `opacity` property of loading indicator. Set to 1 to force it to be visible.
 * @cssproperty [ --media-loading-indicator-transition-delay = 500ms ] - `transition-delay` property of loading indicator. Make sure to include units.
 * @cssproperty --media-loading-indicator-icon-width - `width` of loading icon.
 * @cssproperty [ --media-loading-indicator-icon-height = 100px ] - `height` of loading icon.
 */
class MediaLoadingIndicator extends globalThis.HTMLElement {
  #mediaController: MediaController;
  #delay = DEFAULT_LOADING_DELAY;

  static get observedAttributes(): string[] {
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
  }

  attributeChangedCallback(
    attrName: string,
    oldValue: string | null,
    newValue: string | null
  ): void {
    if (attrName === Attributes.LOADING_DELAY && oldValue !== newValue) {
      this.loadingDelay = Number(newValue);
    } else if (attrName === MediaStateReceiverAttributes.MEDIA_CONTROLLER) {
      if (oldValue) {
        this.#mediaController?.unassociateElement?.(this);
        this.#mediaController = null;
      }
      if (newValue && this.isConnected) {
        // @ts-ignore
        this.#mediaController = this.getRootNode()?.getElementById(newValue);
        this.#mediaController?.associateElement?.(this);
      }
    }
  }

  connectedCallback(): void {
    const mediaControllerId = this.getAttribute(
      MediaStateReceiverAttributes.MEDIA_CONTROLLER
    );
    if (mediaControllerId) {
      // @ts-ignore
      this.#mediaController = (this.getRootNode() as Document)?.getElementById(
        mediaControllerId
      );
      this.#mediaController?.associateElement?.(this);
    }
  }

  disconnectedCallback(): void {
    // Use cached mediaController, getRootNode() doesn't work if disconnected.
    this.#mediaController?.unassociateElement?.(this);
    this.#mediaController = null;
  }

  /**
   * Delay in ms
   */
  get loadingDelay(): number {
    return this.#delay;
  }

  set loadingDelay(delay: number) {
    this.#delay = delay;

    const { style } = getOrInsertCSSRule(this.shadowRoot, ':host');
    style.setProperty(
      '--_loading-indicator-delay',
      `var(--media-loading-indicator-transition-delay, ${delay}ms)`
    );
  }

  /**
   * Is the media paused
   */
  get mediaPaused(): boolean {
    return getBooleanAttr(this, MediaUIAttributes.MEDIA_PAUSED);
  }

  set mediaPaused(value: boolean) {
    setBooleanAttr(this, MediaUIAttributes.MEDIA_PAUSED, value);
  }
  /**
   * Is the media loading
   */
  get mediaLoading(): boolean {
    return getBooleanAttr(this, MediaUIAttributes.MEDIA_LOADING);
  }

  set mediaLoading(value: boolean) {
    setBooleanAttr(this, MediaUIAttributes.MEDIA_LOADING, value);
  }
}

if (!globalThis.customElements.get('media-loading-indicator')) {
  globalThis.customElements.define(
    'media-loading-indicator',
    MediaLoadingIndicator
  );
}

export default MediaLoadingIndicator;
