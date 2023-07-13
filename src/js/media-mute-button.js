import { MediaChromeButton } from './media-chrome-button.js';
import { globalThis, document } from './utils/server-safe-globals.js';
import { MediaUIEvents, MediaUIAttributes } from './constants.js';
import { verbs } from './labels/labels.js';
import { getStringAttr, setStringAttr } from './utils/element-utils.js';

const { MEDIA_VOLUME_LEVEL } = MediaUIAttributes;

const offIcon = `<svg aria-hidden="true" viewBox="0 0 24 24">
  <path d="M16.5 12A4.5 4.5 0 0 0 14 8v2.18l2.45 2.45a4.22 4.22 0 0 0 .05-.63Zm2.5 0a6.84 6.84 0 0 1-.54 2.64L20 16.15A8.8 8.8 0 0 0 21 12a9 9 0 0 0-7-8.77v2.06A7 7 0 0 1 19 12ZM4.27 3 3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25A6.92 6.92 0 0 1 14 18.7v2.06A9 9 0 0 0 17.69 19l2 2.05L21 19.73l-9-9L4.27 3ZM12 4 9.91 6.09 12 8.18V4Z"/>
</svg>`;

const lowIcon = `<svg aria-hidden="true" viewBox="0 0 24 24">
  <path d="M3 9v6h4l5 5V4L7 9H3Zm13.5 3A4.5 4.5 0 0 0 14 8v8a4.47 4.47 0 0 0 2.5-4Z"/>
</svg>`;

const highIcon = `<svg aria-hidden="true" viewBox="0 0 24 24">
  <path d="M3 9v6h4l5 5V4L7 9H3Zm13.5 3A4.5 4.5 0 0 0 14 8v8a4.47 4.47 0 0 0 2.5-4ZM14 3.23v2.06a7 7 0 0 1 0 13.42v2.06a9 9 0 0 0 0-17.54Z"/>
</svg>`;

const slotTemplate = document.createElement('template');
slotTemplate.innerHTML = /*html*/`
  <style>
  ${/* Default to High slot/icon. */''}
  :host(:not([${MEDIA_VOLUME_LEVEL}])) slot:not([name=high]):not([name=icon]), 
  :host([${MEDIA_VOLUME_LEVEL}=high]) slot:not([name=high]):not([name=icon]) {
    display: none !important;
  }

  :host([${MEDIA_VOLUME_LEVEL}=off]) slot:not([name=off]):not([name=icon]) {
    display: none !important;
  }

  :host([${MEDIA_VOLUME_LEVEL}=low]) slot:not([name=low]):not([name=icon]) {
    display: none !important;
  }

  :host([${MEDIA_VOLUME_LEVEL}=medium]) slot:not([name=medium]):not([name=icon]) {
    display: none !important;
  }
  </style>

  <slot name="icon">
    <slot name="off">${offIcon}</slot>
    <slot name="low">${lowIcon}</slot>
    <slot name="medium">${lowIcon}</slot>
    <slot name="high">${highIcon}</slot>
  </slot>
`;

const updateAriaLabel = (el) => {
  const muted = el.mediaVolumeLevel === 'off';
  const label = muted ? verbs.UNMUTE() : verbs.MUTE();
  el.setAttribute('aria-label', label);
};

/**
 * @slot off - An element shown when the media is muted or the media’s volume is 0.
 * @slot low - An element shown when the media’s volume is “low” (less than 50% / 0.5).
 * @slot medium - An element shown when the media’s volume is “medium” (between 50% / 0.5 and 75% / 0.75).
 * @slot high - An element shown when the media’s volume is “high” (75% / 0.75 or greater).
 * @slot icon - An element for representing all states in a single icon
 *
 * @attr {string} mediavolumelevel - (read-only) Set to the media volume level.
 *
 * @cssproperty [--media-mute-button-display = inline-flex] - `display` property of button.
 */
class MediaMuteButton extends MediaChromeButton {
  static get observedAttributes() {
    return [...super.observedAttributes, MediaUIAttributes.MEDIA_VOLUME_LEVEL];
  }

  constructor(options = {}) {
    super({ slotTemplate, ...options });
  }

  connectedCallback() {
    updateAriaLabel(this);
    super.connectedCallback();
  }

  attributeChangedCallback(attrName, oldValue, newValue) {
    if (attrName === MediaUIAttributes.MEDIA_VOLUME_LEVEL) {
      updateAriaLabel(this);
    }
    super.attributeChangedCallback(attrName, oldValue, newValue);
  }

  /**
   * @type {string | undefined}
   */
  get mediaVolumeLevel() {
    return getStringAttr(this, MediaUIAttributes.MEDIA_VOLUME_LEVEL);
  }

  set mediaVolumeLevel(value) {
    setStringAttr(this, MediaUIAttributes.MEDIA_VOLUME_LEVEL, value);
  }

  handleClick() {
    const eventName =
      this.mediaVolumeLevel === 'off'
        ? MediaUIEvents.MEDIA_UNMUTE_REQUEST
        : MediaUIEvents.MEDIA_MUTE_REQUEST;
    this.dispatchEvent(
      new globalThis.CustomEvent(eventName, { composed: true, bubbles: true })
    );
  }
}

if (!globalThis.customElements.get('media-mute-button')) {
  globalThis.customElements.define('media-mute-button', MediaMuteButton);
}

export default MediaMuteButton;
