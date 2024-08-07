import { MediaChromeButton } from './media-chrome-button.js';
import { globalThis, document } from './utils/server-safe-globals.js';
import { MediaUIEvents, MediaUIAttributes } from './constants.js';
import { tooltipLabels, verbs } from './labels/labels.js';
import {
  getBooleanAttr,
  setBooleanAttr,
  getStringAttr,
  setStringAttr,
} from './utils/element-utils.js';

const enterIcon = `<svg aria-hidden="true" viewBox="0 0 24 24"><g><path class="cast_caf_icon_arch0" d="M1,18 L1,21 L4,21 C4,19.3 2.66,18 1,18 L1,18 Z"/><path class="cast_caf_icon_arch1" d="M1,14 L1,16 C3.76,16 6,18.2 6,21 L8,21 C8,17.13 4.87,14 1,14 L1,14 Z"/><path class="cast_caf_icon_arch2" d="M1,10 L1,12 C5.97,12 10,16.0 10,21 L12,21 C12,14.92 7.07,10 1,10 L1,10 Z"/><path class="cast_caf_icon_box" d="M21,3 L3,3 C1.9,3 1,3.9 1,5 L1,8 L3,8 L3,5 L21,5 L21,19 L14,19 L14,21 L21,21 C22.1,21 23,20.1 23,19 L23,5 C23,3.9 22.1,3 21,3 L21,3 Z"/></g></svg>`;

const exitIcon = `<svg aria-hidden="true" viewBox="0 0 24 24"><g><path class="cast_caf_icon_arch0" d="M1,18 L1,21 L4,21 C4,19.3 2.66,18 1,18 L1,18 Z"/><path class="cast_caf_icon_arch1" d="M1,14 L1,16 C3.76,16 6,18.2 6,21 L8,21 C8,17.13 4.87,14 1,14 L1,14 Z"/><path class="cast_caf_icon_arch2" d="M1,10 L1,12 C5.97,12 10,16.0 10,21 L12,21 C12,14.92 7.07,10 1,10 L1,10 Z"/><path class="cast_caf_icon_box" d="M21,3 L3,3 C1.9,3 1,3.9 1,5 L1,8 L3,8 L3,5 L21,5 L21,19 L14,19 L14,21 L21,21 C22.1,21 23,20.1 23,19 L23,5 C23,3.9 22.1,3 21,3 L21,3 Z"/><path class="cast_caf_icon_boxfill" d="M5,7 L5,8.63 C8,8.6 13.37,14 13.37,17 L19,17 L19,7 Z"/></g></svg>`;

const slotTemplate: HTMLTemplateElement = document.createElement('template');
slotTemplate.innerHTML = /*html*/ `
  <style>
  :host([${
    MediaUIAttributes.MEDIA_IS_CASTING
  }]) slot[name=icon] slot:not([name=exit]) {
    display: none !important;
  }

  ${/* Double negative, but safer if display doesn't equal 'block' */ ''}
  :host(:not([${
    MediaUIAttributes.MEDIA_IS_CASTING
  }])) slot[name=icon] slot:not([name=enter]) {
    display: none !important;
  }

  :host([${MediaUIAttributes.MEDIA_IS_CASTING}]) slot[name=tooltip-enter],
    :host(:not([${
      MediaUIAttributes.MEDIA_IS_CASTING
    }])) slot[name=tooltip-exit] {
      display: none;
    }
  </style>

  <slot name="icon">
    <slot name="enter">${enterIcon}</slot>
    <slot name="exit">${exitIcon}</slot>
  </slot>
`;

const tooltipContent = /*html*/ `
  <slot name="tooltip-enter">${tooltipLabels.START_CAST}</slot>
  <slot name="tooltip-exit">${tooltipLabels.STOP_CAST}</slot>
`;

const updateAriaLabel = (el: MediaCastButton) => {
  const label = el.mediaIsCasting ? verbs.EXIT_CAST() : verbs.ENTER_CAST();
  el.setAttribute('aria-label', label);
};

/**
 * @slot enter - An element shown when the media is not in casting mode and pressing the button will open the Cast menu.
 * @slot exit - An element shown when the media is in casting mode and pressing the button will open the Cast menu.
 * @slot icon - An element for representing enter and exit states in a single icon
 *
 * @attr {(unavailable|unsupported)} mediacastunavailable - (read-only) Set if casting is unavailable.
 * @attr {boolean} mediaiscasting - (read-only) Present if the media is casting.
 *
 * @cssproperty [--media-cast-button-display = inline-flex] - `display` property of button.
 */
class MediaCastButton extends MediaChromeButton {
  static get observedAttributes() {
    return [
      ...super.observedAttributes,
      MediaUIAttributes.MEDIA_IS_CASTING,
      MediaUIAttributes.MEDIA_CAST_UNAVAILABLE,
    ];
  }

  constructor(options = {}) {
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
  ) {
    super.attributeChangedCallback(attrName, oldValue, newValue);

    if (attrName === MediaUIAttributes.MEDIA_IS_CASTING) {
      updateAriaLabel(this);
    }
  }

  /**
   * @type {boolean} Are we currently casting
   */
  get mediaIsCasting(): boolean {
    return getBooleanAttr(this, MediaUIAttributes.MEDIA_IS_CASTING);
  }

  set mediaIsCasting(value: boolean) {
    setBooleanAttr(this, MediaUIAttributes.MEDIA_IS_CASTING, value);
  }

  /**
   * @type {string | undefined} Cast unavailability state
   */
  get mediaCastUnavailable(): string | undefined {
    return getStringAttr(this, MediaUIAttributes.MEDIA_CAST_UNAVAILABLE);
  }

  set mediaCastUnavailable(value: string | undefined) {
    setStringAttr(this, MediaUIAttributes.MEDIA_CAST_UNAVAILABLE, value);
  }

  handleClick() {
    const eventName = this.mediaIsCasting
      ? MediaUIEvents.MEDIA_EXIT_CAST_REQUEST
      : MediaUIEvents.MEDIA_ENTER_CAST_REQUEST;
    this.dispatchEvent(
      new globalThis.CustomEvent(eventName, { composed: true, bubbles: true })
    );
  }
}

if (!globalThis.customElements.get('media-cast-button')) {
  globalThis.customElements.define('media-cast-button', MediaCastButton);
}

export default MediaCastButton;
