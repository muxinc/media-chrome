import MediaChromeButton from './media-chrome-button.js';
import { window, document } from './utils/server-safe-globals.js';
import { MediaUIEvents, MediaUIAttributes } from './constants.js';
import { verbs } from './labels/labels.js';

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
slotTemplate.innerHTML = `
  <style>
  ${/* Default to High slot/icon. */''}
  :host(:not([${MediaUIAttributes.MEDIA_VOLUME_LEVEL}])) slot:not([name=high]) > *, 
  :host(:not([${MediaUIAttributes.MEDIA_VOLUME_LEVEL}])) ::slotted(:not([slot=high])),
  :host([${MediaUIAttributes.MEDIA_VOLUME_LEVEL}=high]) slot:not([name=high]) > *, 
  :host([${MediaUIAttributes.MEDIA_VOLUME_LEVEL}=high]) ::slotted(:not([slot=high])) {
    display: none !important;
  }

  :host([${MediaUIAttributes.MEDIA_VOLUME_LEVEL}=off]) slot:not([name=off]) > *, 
  :host([${MediaUIAttributes.MEDIA_VOLUME_LEVEL}=off]) ::slotted(:not([slot=off])) {
    display: none !important;
  }

  :host([${MediaUIAttributes.MEDIA_VOLUME_LEVEL}=low]) slot:not([name=low]) > *, 
  :host([${MediaUIAttributes.MEDIA_VOLUME_LEVEL}=low]) ::slotted(:not([slot=low])) {
    display: none !important;
  }

  :host([${MediaUIAttributes.MEDIA_VOLUME_LEVEL}=medium]) slot:not([name=medium]) > *, 
  :host([${MediaUIAttributes.MEDIA_VOLUME_LEVEL}=medium]) ::slotted(:not([slot=medium])) {
    display: none !important;
  }
  </style>

  <slot name="off">${offIcon}</slot>
  <slot name="low">${lowIcon}</slot>
  <slot name="medium">${lowIcon}</slot>
  <slot name="high">${highIcon}</slot>
`;

const updateAriaLabel = (el) => {
  const muted = el.getAttribute(MediaUIAttributes.MEDIA_VOLUME_LEVEL) === 'off';
  const label = muted ? verbs.UNMUTE() : verbs.MUTE();
  el.setAttribute('aria-label', label);
};

/**
 * @extends {MediaChromeButton}
 *
 * @slot off
 * @slot low
 * @slot medium
 * @slot high
 *
 * @cssproperty --media-mute-button-display
 * @cssproperty --media-control-display
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

  handleClick() {
    const eventName =
      this.getAttribute(MediaUIAttributes.MEDIA_VOLUME_LEVEL) === 'off'
        ? MediaUIEvents.MEDIA_UNMUTE_REQUEST
        : MediaUIEvents.MEDIA_MUTE_REQUEST;
    this.dispatchEvent(
      new window.CustomEvent(eventName, { composed: true, bubbles: true })
    );
  }
}

if (!window.customElements.get('media-mute-button')) {
  window.customElements.define('media-mute-button', MediaMuteButton);
}

export default MediaMuteButton;
