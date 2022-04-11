import { MediaUIAttributes } from './constants.js';
import { defineCustomElement } from './utils/defineCustomElement.js';
import {
  Window as window,
  Document as document,
} from './utils/server-safe-globals.js';
// Todo: Use data locals: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toLocaleTimeString

const template = document.createElement('template');

template.innerHTML = `
<style>
  :host {
    /* Supposed to reset styles. Need to understand the specific effects more */
    all: initial;

    /* display:inline (like the native el) makes it so you can't fill
      the container with the native el */
    display: inline-block;
    box-sizing: border-box;

    width: auto;
    height: auto;
  }

</style>
<div><slot><video src="https://stream.mux.com/DS00Spx1CV902MCtPj5WknGlR102V5HFkDe/high.mp4"></video></slot></div>
`;

class MediaSized extends window.HTMLElement {
  static get observedAttributes() {
    return [MediaUIAttributes.MEDIA_CONTROLLER];
  }

  constructor() {
    super();

    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
    // this.container = this.shadowRoot.querySelector('#container');
  }

  // attributeChangedCallback(attrName, oldValue, newValue) {
  //   if (attrName === MediaUIAttributes.MEDIA_CONTROLLER) {
  //     if (oldValue) {
  //       const mediaControllerEl = document.getElementById(oldValue);
  //       mediaControllerEl?.unassociateElement?.(this);
  //     }
  //     if (newValue) {
  //       const mediaControllerEl = document.getElementById(newValue);
  //       mediaControllerEl?.associateElement?.(this);
  //     }
  //   }
  // }

  // connectedCallback() {
  //   const mediaControllerId = this.getAttribute(
  //     MediaUIAttributes.MEDIA_CONTROLLER
  //   );
  //   if (mediaControllerId) {
  //     const mediaControllerEl = document.getElementById(mediaControllerId);
  //     mediaControllerEl?.associateElement?.(this);
  //   }
  // }

  // disconnectedCallback() {
  //   const mediaControllerSelector = this.getAttribute(
  //     MediaUIAttributes.MEDIA_CONTROLLER
  //   );
  //   if (mediaControllerSelector) {
  //     const mediaControllerEl = document.getElementById(mediaControllerId);
  //     mediaControllerEl?.unassociateElement?.(this);
  //   }
  // }
}

defineCustomElement('media-sized', MediaSized);

export default MediaSized;
