/*
  <media-control-bar>

  Auto position contorls in a line and set some base colors
*/
import MediaChromeHTMLElement from './media-chrome-html-element.js';
import { defineCustomElement } from './utils/defineCustomElement.js';
import { Document as document } from './utils/server-safe-globals.js';

const template = document.createElement('template');

template.innerHTML = `
  <style>
    :host {
      /* Need position to display above video for some reason */
      position: relative;
      box-sizing: border-box;
      display: flex;

      /* All putting the progress range at full width on other lines */
      flex-wrap: wrap;

      width: 100%;
      color: var(--media-icon-color, #eee);

      background-color: var(--media-control-bar-background, rgba(20,20,30, 0.7));
    }

    ::slotted(*), :host > * {
      /* position: relative; */
    }

    media-progress-range,
    ::slotted(media-progress-range),
    ::slotted(media-range-selector) {
      flex-grow: 1;
    }
  </style>

  <slot></slot>
`;

class MediaControlBar extends MediaChromeHTMLElement {
  constructor() {
    super();

    var shadow = this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }

  connectedCallback() { }
}

defineCustomElement('media-control-bar', MediaControlBar);

export default MediaControlBar;
