import MediaChromeButton from './media-chrome-button.js';
import { defineCustomElement } from './utils/defineCustomElement.js';
import {
  Window as window,
  Document as document,
} from './utils/server-safe-globals.js';
import { MediaUIEvents, MediaUIAttributes } from './constants.js';
import { verbs } from './labels/labels.js';

const { MEDIA_TIME_IS_LIVE, MEDIA_PAUSED } = MediaUIAttributes;
const { MEDIA_SEEK_TO_LIVE_REQUEST, MEDIA_PLAY_REQUEST } = MediaUIEvents;

const indicatorSVG = '<svg viewBox="0 0 4 16"><circle cx="2" cy="8" r="2"></circle></svg>';

const slotTemplate = document.createElement('template');
slotTemplate.innerHTML = `
  <style>

  slot[name=indicator] > *,
  :host ::slotted([slot=indicator]) {
    /* Override styles for icon-only buttons */
    min-width: auto;

    /* svgs */
    fill: var(--media-live-indicator-off-icon-color, rgb(118, 118, 118));
    
    /* font icons */
    color: var(--media-live-indicator-off-icon-color, rgb(118, 118, 118));
  }

  :host(:not([${MEDIA_PAUSED}])[${MEDIA_TIME_IS_LIVE}]) slot[name=indicator] > *,
  :host(:not([${MEDIA_PAUSED}])[${MEDIA_TIME_IS_LIVE}]) ::slotted([slot=indicator]) {
    fill: var(--media-live-indicator-icon-color, rgb(255, 0, 0));
    color: rgb(255, 0, 0);
  }

  </style>

  <slot name="indicator">${indicatorSVG}</slot>
  <slot name="spacer">&nbsp;</slot>
  <slot name="text">LIVE</slot>
`;

class MediaLiveButton extends MediaChromeButton {
  static get observedAttributes() {
    return [
      ...super.observedAttributes,
      MEDIA_PAUSED,
      MEDIA_TIME_IS_LIVE
    ];
  }

  constructor(options = {}) {
    super({ slotTemplate, ...options });
    this.setAttribute('aria-label', 'Seek to Live');
  }

  attributeChangedCallback(attrName, oldValue, newValue) {
    super.attributeChangedCallback(attrName, oldValue, newValue);
  }

  handleClick(e) {
    // Don't seek if already live
    if (this.getAttribute(MEDIA_TIME_IS_LIVE) !== null) return;

    this.dispatchEvent(
      new window.CustomEvent(MEDIA_SEEK_TO_LIVE_REQUEST, { composed: true, bubbles: true })
    );

    if (this.getAttribute(MEDIA_PAUSED) !== null) {
      this.dispatchEvent(
        new window.CustomEvent(MEDIA_PLAY_REQUEST, { composed: true, bubbles: true })
      );
    }
  }
}

defineCustomElement('media-live-button', MediaLiveButton);

export default MediaLiveButton;
