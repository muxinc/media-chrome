import MediaChromeButton from './media-chrome-button.js';
import { defineCustomElement } from './utils/defineCustomElement.js';
import {
  Window as window,
  Document as document,
} from './utils/server-safe-globals.js';
import { MediaUIEvents, MediaUIAttributes } from './constants.js';
import { verbs } from './labels/labels.js';

const pipIcon =
  '<svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path class="icon" d="M19 7h-8v6h8V7zm2-4H3c-1.1 0-2 .9-2 2v14c0 1.1.9 1.98 2 1.98h18c1.1 0 2-.88 2-1.98V5c0-1.1-.9-2-2-2zm0 16.01H3V4.98h18v14.03z"/><path d="M0 0h24v24H0z" fill="none"/></svg>';

const slotTemplate = document.createElement('template');
slotTemplate.innerHTML = `
  <style>
  :host([${MediaUIAttributes.MEDIA_IS_PIP}]) slot:not([name=exit]) > *, 
  :host([${MediaUIAttributes.MEDIA_IS_PIP}]) ::slotted(:not([slot=exit])) {
    display: none;
  }

  /* Double negative, but safer if display doesn't equal 'block' */
  :host(:not([${MediaUIAttributes.MEDIA_IS_PIP}])) slot:not([name=enter]) > *, 
  :host(:not([${MediaUIAttributes.MEDIA_IS_PIP}])) ::slotted(:not([slot=enter])) {
    display: none;
  }
  </style>

  <slot name="enter">${pipIcon}</slot>
  <slot name="exit">${pipIcon}</slot>
`;

const updateAriaLabel = (el) => {
  const isPip = el.getAttribute(MediaUIAttributes.MEDIA_IS_PIP) != null;
  const label = isPip ? verbs.EXIT_PIP() : verbs.ENTER_PIP();
  el.setAttribute('aria-label', label);
};

class MediaPipButton extends MediaChromeButton {
  static get observedAttributes() {
    return [...super.observedAttributes, MediaUIAttributes.MEDIA_IS_PIP, MediaUIAttributes.MEDIA_PIP_UNAVAILABLE];
  }

  constructor(options = {}) {
    super({ slotTemplate, ...options });
  }

  connectedCallback() {
    updateAriaLabel(this);
    super.connectedCallback();
  }

  attributeChangedCallback(attrName, oldValue, newValue) {
    if (attrName === MediaUIAttributes.MEDIA_IS_PIP) {
      updateAriaLabel(this);
    }
    super.attributeChangedCallback(attrName, oldValue, newValue);
  }

  handleClick(_e) {
    const eventName =
      this.getAttribute(MediaUIAttributes.MEDIA_IS_PIP) != null
        ? MediaUIEvents.MEDIA_EXIT_PIP_REQUEST
        : MediaUIEvents.MEDIA_ENTER_PIP_REQUEST;
    this.dispatchEvent(
      new window.CustomEvent(eventName, { composed: true, bubbles: true })
    );
  }
}

defineCustomElement('media-pip-button', MediaPipButton);

export default MediaPipButton;
