import MediaChromeButton from './media-chrome-button.js';
import { defineCustomElement } from './utils/defineCustomElement.js';
import {
  Window as window,
  Document as document,
} from './utils/server-safe-globals.js';
import { MediaUIEvents, MediaUIAttributes } from './constants.js';
import { verbs } from './labels/labels.js';

const { MEDIA_TIME_IS_LIVE, MEDIA_PAUSED, MEDIA_STREAM_TYPE } = MediaUIAttributes;
const { MEDIA_SEEK_TO_LIVE_REQUEST, MEDIA_PLAY_REQUEST } = MediaUIEvents;

const indicatorSVG = '<svg viewBox="0 0 4 4"><circle cx="2" cy="2" r="2"></circle></svg>';

const slotTemplate = document.createElement('template');
slotTemplate.innerHTML = `
  <style>

  :host {
    text-transform: uppercase;
  }

  slot[name=indicator] > *,
  :host ::slotted([slot=indicator]) {
    padding: var(--media-live-indicator-icon-padding, 0 5px 0 0);

    /* Override styles for icon-only buttons */
    min-width: auto;

    /* svgs */
    fill: var(--media-live-indicator-icon-color-off, rgb(118, 118, 118));
    height: var(--media-live-indicator-icon-height, 5px);
    width: var(--media-live-indicator-icon-width, 5px);
    
    /* font icons */
    color: var(--media-live-indicator-icon-color-off, rgb(118, 118, 118));
    font-size: 5px;
    line-height: 5px;
  }

  :host([${MEDIA_TIME_IS_LIVE}]) slot[name=indicator] > *,
  :host([${MEDIA_TIME_IS_LIVE}]) ::slotted([slot=indicator]) {
    fill: var(--media-live-indicator-icon-color, rgb(255, 0, 0));
    color: rgb(255, 0, 0);
  }
  
  </style>

  <slot name="indicator">${indicatorSVG}</slot>
  <slot name="text">Live</slot>
`;

class MediaLiveButton extends MediaChromeButton {
  static get observedAttributes() {
    return [
      ...super.observedAttributes,
      MEDIA_PAUSED,
      MEDIA_TIME_IS_LIVE,
      MEDIA_STREAM_TYPE
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
