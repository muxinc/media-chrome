import { MediaChromeButton } from './media-chrome-button.js';
import { globalThis, document } from './utils/server-safe-globals.js';
import { MediaUIEvents, MediaUIAttributes } from './constants.js';
import { verbs } from './labels/labels.js';
import { getStringAttr, setStringAttr } from './utils/element-utils.js';

const airplayIcon = `<svg aria-hidden="true" viewBox="0 0 26 24">
  <path d="M22.13 3H3.87a.87.87 0 0 0-.87.87v13.26a.87.87 0 0 0 .87.87h3.4L9 16H5V5h16v11h-4l1.72 2h3.4a.87.87 0 0 0 .87-.87V3.87a.87.87 0 0 0-.86-.87Zm-8.75 11.44a.5.5 0 0 0-.76 0l-4.91 5.73a.5.5 0 0 0 .38.83h9.82a.501.501 0 0 0 .38-.83l-4.91-5.73Z"/>
</svg>
`;

const slotTemplate = document.createElement('template');
slotTemplate.innerHTML = `
  <slot name="icon">${airplayIcon}</slot>
`;

/**
 * @slot icon - The element shown for the AirPlay button’s display.
 *
 * @attr {(unavailable|unsupported)} mediaairplayunavailable - (read-only) Set if airplay is unavailable.
 *
 * @cssproperty [--media-airplay-button-display = inline-flex] - `display` property of button.
 *
 * @event {CustomEvent} mediaairplayrequest
 */
class MediaAirplayButton extends MediaChromeButton {
  static get observedAttributes() {
    return [
      ...super.observedAttributes,
      MediaUIAttributes.MEDIA_AIRPLAY_UNAVAILABLE,
    ];
  }

  constructor(options = {}) {
    super({ slotTemplate, ...options });
  }

  connectedCallback() {
    this.setAttribute('aria-label', verbs.AIRPLAY());
    super.connectedCallback();
  }

  /**
   * @type {string | undefined} Airplay unavailability state
   */
  get mediaAirplayUnavailable() {
    return getStringAttr(this, MediaUIAttributes.MEDIA_AIRPLAY_UNAVAILABLE);
  }

  set mediaAirplayUnavailable(value) {
    setStringAttr(this, MediaUIAttributes.MEDIA_AIRPLAY_UNAVAILABLE, value);
  }

  handleClick() {
    const evt = new globalThis.CustomEvent(MediaUIEvents.MEDIA_AIRPLAY_REQUEST, {
      composed: true,
      bubbles: true,
    });
    this.dispatchEvent(evt);
  }
}

if (!globalThis.customElements.get('media-airplay-button')) {
  globalThis.customElements.define('media-airplay-button', MediaAirplayButton);
}

export default MediaAirplayButton;
