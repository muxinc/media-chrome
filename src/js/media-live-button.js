import MediaChromeButton from './media-chrome-button.js';
import {
  Window as window,
  Document as document,
} from './utils/server-safe-globals.js';
import { MediaUIEvents, MediaUIAttributes } from './constants.js';
import { verbs } from './labels/labels.js';

const { MEDIA_TIME_IS_LIVE, MEDIA_PAUSED } = MediaUIAttributes;
const { MEDIA_SEEK_TO_LIVE_REQUEST, MEDIA_PLAY_REQUEST } = MediaUIEvents;

const indicatorSVG = '<svg viewBox="0 0 6 12"><circle cx="3" cy="6" r="2"></circle></svg>';

const slotTemplate = document.createElement('template');
slotTemplate.innerHTML = /*html*/`
  <style>

  slot[name=indicator] > *,
  :host ::slotted([slot=indicator]) {
    ${/* Override styles for icon-only buttons */''}
    min-width: auto;
    fill: var(--media-live-button-icon-color, rgb(140, 140, 140));
    color: var(--media-live-button-icon-color, rgb(140, 140, 140));
  }

  :host([${MEDIA_TIME_IS_LIVE}]:not([${MEDIA_PAUSED}])) slot[name=indicator] > *,
  :host([${MEDIA_TIME_IS_LIVE}]:not([${MEDIA_PAUSED}])) ::slotted([slot=indicator]) {
    fill: var(--media-live-indicator-color, rgb(255, 0, 0));
    color: var(--media-live-indicator-color, rgb(255, 0, 0));
  }

  :host([${MEDIA_TIME_IS_LIVE}]:not([${MEDIA_PAUSED}])) {
    cursor: not-allowed;
  }

  </style>

  <slot name="indicator">${indicatorSVG}</slot>
  ${/*
    A new line between spacer and text creates inconsistent spacing
    between slotted items and default slots.
  */''}
  <slot name="spacer">&nbsp;</slot><slot name="text">LIVE</slot>
`;

/**
 * @preserve
 *
 * @slot indicator
 * @slot spacer
 * @slot text
 *
 * @cssproperty [--media-live-button-display = inline-flex]
 */
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
    this.setAttribute('aria-label', verbs.SEEK_LIVE());
  }

  attributeChangedCallback(attrName, oldValue, newValue) {
    super.attributeChangedCallback(attrName, oldValue, newValue);

    if (this.hasAttribute(MEDIA_PAUSED) || !this.hasAttribute(MEDIA_TIME_IS_LIVE)) {
      this.setAttribute('aria-label', verbs.SEEK_LIVE());
      this.removeAttribute('aria-disabled');
    } else {
      this.setAttribute('aria-label', verbs.PLAYING_LIVE());
      this.setAttribute('aria-disabled', 'true');
    }
  }

  handleClick() {
    // If we're live and not paused, don't allow seek to live
    if (!this.hasAttribute(MEDIA_PAUSED) && this.hasAttribute(MEDIA_TIME_IS_LIVE)) return;

    this.dispatchEvent(
      new window.CustomEvent(MEDIA_SEEK_TO_LIVE_REQUEST, { composed: true, bubbles: true })
    );

    // If we're paused, also automatically play
    if (this.hasAttribute(MEDIA_PAUSED)) {
      this.dispatchEvent(
        new window.CustomEvent(MEDIA_PLAY_REQUEST, { composed: true, bubbles: true })
      );
    }
  }
}

if (!window.customElements.get('media-live-button')) {
  window.customElements.define('media-live-button', MediaLiveButton);
}

export default MediaLiveButton;
