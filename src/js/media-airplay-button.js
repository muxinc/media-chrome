import MediaChromeButton from './media-chrome-button.js';
import { window, document } from './utils/server-safe-globals.js';
import { MediaUIEvents, MediaUIAttributes } from './constants.js';
import { verbs } from './labels/labels.js';

const airplayIcon = `<svg aria-hidden="true" viewBox="0 0 26 24">
  <path d="M22.13 3H3.87a.87.87 0 0 0-.87.87v13.26a.87.87 0 0 0 .87.87h3.4L9 16H5V5h16v11h-4l1.72 2h3.4a.87.87 0 0 0 .87-.87V3.87a.87.87 0 0 0-.86-.87Zm-8.75 11.44a.5.5 0 0 0-.76 0l-4.91 5.73a.5.5 0 0 0 .38.83h9.82a.501.501 0 0 0 .38-.83l-4.91-5.73Z"/>
</svg>
`;

const slotTemplate = document.createElement('template');
slotTemplate.innerHTML = `
  <slot name="airplay">${airplayIcon}</slot>
`;

/**
 * @slot airplay
 *
 * @attr {(unavailable|unsupported)} mediaairplayunavailable
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

  handleClick() {
    const evt = new window.CustomEvent(MediaUIEvents.MEDIA_AIRPLAY_REQUEST, {
      composed: true,
      bubbles: true,
    });
    this.dispatchEvent(evt);
  }
}

if (!window.customElements.get('media-airplay-button')) {
  window.customElements.define('media-airplay-button', MediaAirplayButton);
}

export default MediaAirplayButton;
