import MediaChromeButton from './media-chrome-button.js';
import { defineCustomElement } from './utils/defineCustomElement.js';
import {
  Window as window,
  Document as document,
} from './utils/server-safe-globals.js';
import { MediaUIEvents, MediaUIAttributes } from './constants.js';
import { nouns } from './labels/labels.js';
import { splitTextTracksStr } from './utils/captions.js';

const ccIconOn = `<svg id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 18"><title>Mux Player SVG Icons_v3</title><path d="M19.83,2.68a2.58,2.58,0,0,0-2.3-2.5C13.91-.06,6.09-.06,2.47.18a2.58,2.58,0,0,0-2.3,2.5,115.86,115.86,0,0,0,0,12.64,2.58,2.58,0,0,0,2.3,2.5c3.62.24,11.44.24,15.06,0a2.58,2.58,0,0,0,2.3-2.5A115.86,115.86,0,0,0,19.83,2.68ZM8.44,12.13a3.07,3.07,0,0,1-1.91.57,3.06,3.06,0,0,1-2.34-1,3.75,3.75,0,0,1-.92-2.67,3.92,3.92,0,0,1,.92-2.77,3.18,3.18,0,0,1,2.43-1,2.94,2.94,0,0,1,2.13.78,2.73,2.73,0,0,1,.74,1.31l-1.43.35A1.49,1.49,0,0,0,6.55,6.53a1.61,1.61,0,0,0-1.29.58A2.79,2.79,0,0,0,4.76,9a3,3,0,0,0,.49,1.93,1.61,1.61,0,0,0,1.27.58,1.48,1.48,0,0,0,1-.37A2.1,2.1,0,0,0,8.11,10l1.4.44A3.23,3.23,0,0,1,8.44,12.13Zm7.22,0a3.07,3.07,0,0,1-1.91.57,3.06,3.06,0,0,1-2.34-1,3.75,3.75,0,0,1-.92-2.67,3.88,3.88,0,0,1,.93-2.77,3.14,3.14,0,0,1,2.42-1A3,3,0,0,1,16,6.08a2.8,2.8,0,0,1,.73,1.31l-1.43.35a1.49,1.49,0,0,0-1.51-1.21,1.61,1.61,0,0,0-1.29.58A2.79,2.79,0,0,0,12,9a3,3,0,0,0,.49,1.93,1.61,1.61,0,0,0,1.27.58,1.44,1.44,0,0,0,1-.37,2.1,2.1,0,0,0,.6-1.15l1.4.44A3.17,3.17,0,0,1,15.66,12.13Z"/></svg>`;

const ccIconOff = `<svg id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 18"><title>Mux Player SVG Icons_v3</title><path d="M14.73,11.09a1.4,1.4,0,0,1-1,.37,1.58,1.58,0,0,1-1.27-.58A3,3,0,0,1,12,9a2.8,2.8,0,0,1,.5-1.85,1.63,1.63,0,0,1,1.29-.57,1.47,1.47,0,0,1,1.51,1.2l1.43-.34A2.89,2.89,0,0,0,16,6.07a3,3,0,0,0-2.14-.78,3.14,3.14,0,0,0-2.42,1,3.91,3.91,0,0,0-.93,2.78,3.74,3.74,0,0,0,.92,2.66,3.07,3.07,0,0,0,2.34,1,3.07,3.07,0,0,0,1.91-.57,3.17,3.17,0,0,0,1.07-1.74l-1.4-.45A2.06,2.06,0,0,1,14.73,11.09Zm-7.22,0a1.43,1.43,0,0,1-1,.37,1.58,1.58,0,0,1-1.27-.58A3,3,0,0,1,4.76,9a2.8,2.8,0,0,1,.5-1.85,1.63,1.63,0,0,1,1.29-.57,1.47,1.47,0,0,1,1.51,1.2l1.43-.34a2.81,2.81,0,0,0-.74-1.32,2.94,2.94,0,0,0-2.13-.78,3.18,3.18,0,0,0-2.43,1,4,4,0,0,0-.92,2.78,3.74,3.74,0,0,0,.92,2.66,3.07,3.07,0,0,0,2.34,1,3.07,3.07,0,0,0,1.91-.57,3.23,3.23,0,0,0,1.07-1.74l-1.4-.45A2.06,2.06,0,0,1,7.51,11.09ZM19.83,2.68A2.59,2.59,0,0,0,17.53.17C15.72.05,12.86,0,10,0S4.28.05,2.47.17A2.59,2.59,0,0,0,.17,2.68a115.68,115.68,0,0,0,0,12.63,2.57,2.57,0,0,0,2.3,2.5c1.81.13,4.67.19,7.53.19s5.72-.06,7.53-.19a2.57,2.57,0,0,0,2.3-2.5A115.68,115.68,0,0,0,19.83,2.68ZM18.34,15.21a1.11,1.11,0,0,1-.91,1.11c-1.67.11-4.45.18-7.43.18s-5.76-.07-7.43-.18a1.11,1.11,0,0,1-.91-1.11,122.7,122.7,0,0,1,0-12.43,1.11,1.11,0,0,1,.91-1.11C4.24,1.56,7,1.49,10,1.49s5.76.07,7.43.18a1.11,1.11,0,0,1,.91,1.11A122.7,122.7,0,0,1,18.34,15.21Z"/></svg>`;

const slotTemplate = document.createElement('template');
slotTemplate.innerHTML = `
  <style>
  :host([aria-checked="true"]) slot:not([name=on]) > *, 
  :host([aria-checked="true"]) ::slotted(:not([slot=on])) {
    display: none;
  }

  /* Double negative, but safer if display doesn't equal 'block' */
  :host(:not([aria-checked="true"])) slot:not([name=off]) > *, 
  :host(:not([aria-checked="true"])) ::slotted(:not([slot=off])) {
    display: none;
  }
  </style>

  <slot name="on">${ccIconOn}</slot>
  <slot name="off">${ccIconOff}</slot>
`;

const updateAriaChecked = (el) => {
  el.setAttribute('aria-checked', isCCOn(el));
};

const isCCOn = (el) => {
  const showingCaptions = !!el.getAttribute(
    MediaUIAttributes.MEDIA_CAPTIONS_SHOWING
  );
  const showingSubtitlesAsCaptions =
    !el.hasAttribute('no-subtitles-fallback') &&
    !!el.getAttribute(MediaUIAttributes.MEDIA_SUBTITLES_SHOWING);
  return showingCaptions || showingSubtitlesAsCaptions;
};

class MediaCaptionsButton extends MediaChromeButton {
  static get observedAttributes() {
    return [
      ...super.observedAttributes,
      'no-subtitles-fallback',
      MediaUIAttributes.MEDIA_CAPTIONS_LIST,
      MediaUIAttributes.MEDIA_CAPTIONS_SHOWING,
      MediaUIAttributes.MEDIA_SUBTITLES_LIST,
      MediaUIAttributes.MEDIA_SUBTITLES_SHOWING,
    ];
  }

  constructor(options = {}) {
    super({ slotTemplate, ...options });
  }

  connectedCallback() {
    super.connectedCallback();
    this.setAttribute('role', 'switch');
    this.setAttribute('aria-label', nouns.CLOSED_CAPTIONS());
    updateAriaChecked(this);
  }

  attributeChangedCallback(attrName, oldValue, newValue) {
    if (
      [
        MediaUIAttributes.MEDIA_CAPTIONS_SHOWING,
        MediaUIAttributes.MEDIA_SUBTITLES_SHOWING,
      ].includes(attrName)
    ) {
      updateAriaChecked(this);
    }
    super.attributeChangedCallback(attrName, oldValue, newValue);
  }

  handleClick(_e) {
    const ccIsOn = isCCOn(this);
    if (ccIsOn) {
      // Closed Captions is on. Clicking should disable any currently showing captions (and subtitles, if relevant)
      // For why we are requesting tracks to `mode="disabled"` and not `mode="hidden"`, see: https://github.com/muxinc/media-chrome/issues/60
      const captionsShowingStr = this.getAttribute(
        MediaUIAttributes.MEDIA_CAPTIONS_SHOWING
      );
      // If we have currently showing captions track(s), request for them to be disabled.
      if (captionsShowingStr) {
        const evt = new window.CustomEvent(
          MediaUIEvents.MEDIA_DISABLE_CAPTIONS_REQUEST,
          { composed: true, bubbles: true, detail: captionsShowingStr }
        );
        this.dispatchEvent(evt);
      }
      const subtitlesShowingStr = this.getAttribute(
        MediaUIAttributes.MEDIA_SUBTITLES_SHOWING
      );
      // If we have currently showing subtitles track(s) and we're using subtitle fallback (true/"on" by default), request for them to be disabled.
      if (subtitlesShowingStr && !this.hasAttribute('no-subtitles-fallback')) {
        const evt = new window.CustomEvent(
          MediaUIEvents.MEDIA_DISABLE_SUBTITLES_REQUEST,
          { composed: true, bubbles: true, detail: subtitlesShowingStr }
        );
        this.dispatchEvent(evt);
      }
    } else {
      // Closed Captions is off. Clicking should show the first relevant captions track or subtitles track if we're using subtitle fallback (true/"on" by default)
      const [ccTrackStr] =
        splitTextTracksStr(
          this.getAttribute(MediaUIAttributes.MEDIA_CAPTIONS_LIST) ?? ''
        ) ?? [];
      if (ccTrackStr) {
        // If we have at least one captions track, request for the first one to be showing.
        const evt = new window.CustomEvent(
          MediaUIEvents.MEDIA_SHOW_CAPTIONS_REQUEST,
          { composed: true, bubbles: true, detail: ccTrackStr }
        );
        this.dispatchEvent(evt);
      } else if (!this.hasAttribute('no-subtitles-fallback')) {
        // If we don't have a captions track and we're using subtitles fallback (true/"on" by default), check if we have any subtitles available.
        const [subTrackStr] =
          splitTextTracksStr(
            this.getAttribute(MediaUIAttributes.MEDIA_SUBTITLES_LIST) ?? ''
          ) ?? [];
        if (subTrackStr) {
          // If we have at least one subtitles track (and didn't have any captions tracks), request for the first one to be showing as a fallback for captions.
          const evt = new window.CustomEvent(
            MediaUIEvents.MEDIA_SHOW_SUBTITLES_REQUEST,
            { composed: true, bubbles: true, detail: subTrackStr }
          );
          this.dispatchEvent(evt);
        }
      } else {
        // If we end up here, it means we have an enabled CC-button that a user has clicked on but there are no captions and no subtitles (or we've disabled subtitles fallback).
        console.error(
          'Attempting to enable closed captions but none are available! Please verify your media content if this is unexpected.'
        );
      }
    }
  }
}

defineCustomElement('media-captions-button', MediaCaptionsButton);

export default MediaCaptionsButton;
