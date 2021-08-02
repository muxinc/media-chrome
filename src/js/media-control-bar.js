/*
  <media-control-bar>

  Auto position contorls in a line and set some base colors
*/
import { defineCustomElement } from './utils/defineCustomElement.js';
import { Document as document } from './utils/server-safe-globals.js';

const template = document.createElement('template');

template.innerHTML = `
  <style>
    :host {
      /* Need position to display above video for some reason */
      position: relative;
      box-sizing: border-box;
      display: inline-flex;

      /* Allows putting the progress range at full width on other lines */
      flex-wrap: wrap;

      color: var(--media-icon-color, #eee);
    }

    ::slotted(*), :host > * {
      /* position: relative; */
    }

    media-time-range,
    ::slotted(media-time-range),
    ::slotted(media-progress-range),
    ::slotted(media-clip-selector) {
      flex-grow: 1;
    }
  </style>

  <slot></slot>
`;

class MediaControlBar extends HTMLElement {
  constructor() {
    super();

    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }

  connectedCallback() { }
}

defineCustomElement('media-control-bar', MediaControlBar);

export default MediaControlBar;
