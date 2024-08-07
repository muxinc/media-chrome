/*
  <media-fullscreen-button media="#myVideo" fullscreenelement="#myContainer">

  The fullscreenelement attribute can be used to say which element
  to make fullscreen.
  If none, the button will look for the closest media-container element to the media.
  If none, the button will make the media fullscreen.
*/
import { MediaChromeButton } from './media-chrome-button.js';
import { globalThis, document } from './utils/server-safe-globals.js';
import { MediaUIEvents, MediaUIAttributes } from './constants.js';
import { tooltipLabels, verbs } from './labels/labels.js';
import {
  getBooleanAttr,
  getStringAttr,
  setBooleanAttr,
  setStringAttr,
} from './utils/element-utils.js';

const enterFullscreenIcon = `<svg aria-hidden="true" viewBox="0 0 26 24">
  <path d="M16 3v2.5h3.5V9H22V3h-6ZM4 9h2.5V5.5H10V3H4v6Zm15.5 9.5H16V21h6v-6h-2.5v3.5ZM6.5 15H4v6h6v-2.5H6.5V15Z"/>
</svg>`;

const exitFullscreenIcon = `<svg aria-hidden="true" viewBox="0 0 26 24">
  <path d="M18.5 6.5V3H16v6h6V6.5h-3.5ZM16 21h2.5v-3.5H22V15h-6v6ZM4 17.5h3.5V21H10v-6H4v2.5Zm3.5-11H4V9h6V3H7.5v3.5Z"/>
</svg>`;

const slotTemplate = document.createElement('template');
slotTemplate.innerHTML = /*html*/ `
  <style>
    :host([${
      MediaUIAttributes.MEDIA_IS_FULLSCREEN
    }]) slot[name=icon] slot:not([name=exit]) {
      display: none !important;
    }

    ${/* Double negative, but safer if display doesn't equal 'block' */ ''}
    :host(:not([${
      MediaUIAttributes.MEDIA_IS_FULLSCREEN
    }])) slot[name=icon] slot:not([name=enter]) {
      display: none !important;
    }

    :host([${MediaUIAttributes.MEDIA_IS_FULLSCREEN}]) slot[name=tooltip-enter],
    :host(:not([${
      MediaUIAttributes.MEDIA_IS_FULLSCREEN
    }])) slot[name=tooltip-exit] {
      display: none;
    }
  </style>

  <slot name="icon">
    <slot name="enter">${enterFullscreenIcon}</slot>
    <slot name="exit">${exitFullscreenIcon}</slot>
  </slot>
`;

const tooltipContent = /*html*/ `
  <slot name="tooltip-enter">${tooltipLabels.ENTER_FULLSCREEN}</slot>
  <slot name="tooltip-exit">${tooltipLabels.EXIT_FULLSCREEN}</slot>
`;

const updateAriaLabel = (el: MediaFullscreenButton) => {
  const label = el.mediaIsFullscreen
    ? verbs.EXIT_FULLSCREEN()
    : verbs.ENTER_FULLSCREEN();
  el.setAttribute('aria-label', label);
};

/**
 * @slot enter - An element shown when the media is not in fullscreen and pressing the button will trigger entering fullscreen.
 * @slot exit - An element shown when the media is in fullscreen and pressing the button will trigger exiting fullscreen.
 * @slot icon - An element for representing enter and exit states in a single icon
 *
 * @attr {(unavailable|unsupported)} mediafullscreenunavailable - (read-only) Set if fullscreen is unavailable.
 * @attr {boolean} mediaisfullscreen - (read-only) Present if the media is fullscreen.
 *
 * @cssproperty [--media-fullscreen-button-display = inline-flex] - `display` property of button.
 */
class MediaFullscreenButton extends MediaChromeButton {
  static get observedAttributes(): string[] {
    return [
      ...super.observedAttributes,
      MediaUIAttributes.MEDIA_IS_FULLSCREEN,
      MediaUIAttributes.MEDIA_FULLSCREEN_UNAVAILABLE,
    ];
  }

  constructor(options: object = {}) {
    super({ slotTemplate, tooltipContent, ...options });
  }

  connectedCallback(): void {
    super.connectedCallback();
    updateAriaLabel(this);
  }

  attributeChangedCallback(
    attrName: string,
    oldValue: string | null,
    newValue: string | null
  ): void {
    super.attributeChangedCallback(attrName, oldValue, newValue);

    if (attrName === MediaUIAttributes.MEDIA_IS_FULLSCREEN) {
      updateAriaLabel(this);
    }
  }

  /**
   * @type {string | undefined} Fullscreen unavailability state
   */
  get mediaFullscreenUnavailable(): string | undefined {
    return getStringAttr(this, MediaUIAttributes.MEDIA_FULLSCREEN_UNAVAILABLE);
  }

  set mediaFullscreenUnavailable(value: string | undefined) {
    setStringAttr(this, MediaUIAttributes.MEDIA_FULLSCREEN_UNAVAILABLE, value);
  }

  /**
   * @type {boolean} Whether fullscreen is available
   */
  get mediaIsFullscreen(): boolean {
    return getBooleanAttr(this, MediaUIAttributes.MEDIA_IS_FULLSCREEN);
  }

  set mediaIsFullscreen(value: boolean) {
    setBooleanAttr(this, MediaUIAttributes.MEDIA_IS_FULLSCREEN, value);
  }

  handleClick(): void {
    const eventName = this.mediaIsFullscreen
      ? MediaUIEvents.MEDIA_EXIT_FULLSCREEN_REQUEST
      : MediaUIEvents.MEDIA_ENTER_FULLSCREEN_REQUEST;
    this.dispatchEvent(
      new globalThis.CustomEvent(eventName, { composed: true, bubbles: true })
    );
  }
}

if (!globalThis.customElements.get('media-fullscreen-button')) {
  globalThis.customElements.define(
    'media-fullscreen-button',
    MediaFullscreenButton
  );
}

export default MediaFullscreenButton;
