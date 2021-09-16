import { MediaUIAttributes } from './constants.js';
import { nouns } from './labels/labels.js';
import { defineCustomElement } from './utils/defineCustomElement.js';
import { Window as window, Document as document } from './utils/server-safe-globals.js';
// Todo: Use data locals: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toLocaleTimeString

const template = document.createElement('template');

const loadingIndicatorIcon = `
<svg version="1.1" id="L9" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
  viewBox="0 0 100 100" enable-background="new 0 0 0 0" xml:space="preserve">
    <path fill="#fff" d="M73,50c0-12.7-10.3-23-23-23S27,37.3,27,50 M30.9,50c0-10.5,8.5-19.1,19.1-19.1S69.1,39.5,69.1,50">
      <animateTransform 
         attributeName="transform" 
         attributeType="XML" 
         type="rotate"
         dur="1s" 
         from="0 50 50"
         to="360 50 50" 
         repeatCount="indefinite" />
  </path>
</svg>
`

template.innerHTML = `
<style>
:host {
  position: relative;
  display: inline-block;
  vertical-align: middle;
  box-sizing: border-box;
  background-color: var(--media-control-background, rgba(20,20,30, 0.7));

  /* Default width and height can be overridden externally */
  padding: 10px;
  

  /* Vertically center any text */
  font-size: 14px;
  line-height: 1;
  font-weight: bold;

  /* Min icon size is 24x24 */
  min-height: 24px;
  min-width: 24px;

  transition: background-color 0.15s linear;
}

/*
  Only show outline when keyboard focusing.
  https://drafts.csswg.org/selectors-4/#the-focus-visible-pseudo
*/
:host-context([media-keyboard-control]):host(:focus),
:host-context([media-keyboard-control]):host(:focus-within) {
  box-shadow: inset 0 0 0 2px rgba(27, 127, 204, 0.9);
}

:host(:hover) {
  background-color: var(--media-control-hover-background, rgba(50,50,70, 0.7));
}

/* Undo the default button styles and fill the parent element */
.button {
  width: 100%;
  vertical-align: middle;
  border: none;
  margin: 0;
  padding: 0;
  text-decoration: none;
  background: transparent;
  color: #ffffff;
  font-family: sans-serif;
  font-size: 14px;
  line-height: 24px;
  font-weight: bold;
  font-family: Arial, sans-serif;
  cursor: pointer;
  text-align: center;
  -webkit-appearance: none;
  -moz-appearance: none;
}

.button:hover {}
.button:focus {
  outline: 0;
}
.button:active {}

svg, img, ::slotted(svg), ::slotted(img) {
  width: var(--media-button-icon-width, 24px);
  height: var(--media-button-icon-height);
  transform: var(--media-button-icon-transform);
  transition: var(--media-button-icon-transition);
  fill: var(--media-icon-color, #eee);
  vertical-align: middle;
}
</style>

<div class="button"></div>
`;


const slotTemplate = document.createElement('template');
slotTemplate.innerHTML = `
  <style>
  #status {
    color: rgba(0,0,0,0);
    width: 0px;
    height: 0px;
  }
  :host(:not([${MediaUIAttributes.MEDIA_LOADING}])) slot[name=loading] > *, 
  :host(:not([${MediaUIAttributes.MEDIA_LOADING}])) ::slotted([slot=loading]),
  :host(:not([${MediaUIAttributes.MEDIA_LOADING}])) #status {
    display: none;
  }
  </style>

  <slot name="loading">${loadingIndicatorIcon}</slot>
  <div id="status" role="status" aria-live="polite">${nouns.MEDIA_LOADING()}</div>
`;

class MediaLoadingIndicator extends window.HTMLElement {
  
  static get observedAttributes() {
    return [MediaUIAttributes.MEDIA_CONTROLLER, MediaUIAttributes.MEDIA_PAUSED, MediaUIAttributes.MEDIA_LOADING, 'loading-delay'];
  }
  
  constructor(options={}) {
    super();

    const shadow = this.attachShadow({ mode: 'open' });

    const indicatorHTML = template.content.cloneNode(true);
    this.nativeEl = indicatorHTML.querySelector('div');

    // Slots
    const indicatorSlotTemplate = options.slotTemplate ?? slotTemplate;
    this.nativeEl.appendChild(indicatorSlotTemplate.content.cloneNode(true));

    shadow.appendChild(indicatorHTML);
  }
  
  attributeChangedCallback(attrName, oldValue, newValue) {
    if (attrName === MediaUIAttributes.MEDIA_CONTROLLER) {
      if (oldValue) {
        const mediaControllerEl = document.getElementById(oldValue);
        mediaControllerEl?.unassociateElement?.(this);
      }
      if (newValue) {
        const mediaControllerEl = document.getElementById(newValue);
        mediaControllerEl?.associateElement?.(this);
      }
    }
  }

  connectedCallback() {
    const mediaControllerId = this.getAttribute(MediaUIAttributes.MEDIA_CONTROLLER);
    if (mediaControllerId) {
      const mediaControllerEl = document.getElementById(mediaControllerId);
      mediaControllerEl?.associateElement?.(this);
    }
  }

  disconnectedCallback() {
    const mediaControllerSelector = this.getAttribute(MediaUIAttributes.MEDIA_CONTROLLER);
    if (mediaControllerSelector) {
      const mediaControllerEl = document.getElementById(mediaControllerId);
      mediaControllerEl?.unassociateElement?.(this);
    }
  }
}

defineCustomElement('media-loading-indicator', MediaLoadingIndicator);

export default MediaLoadingIndicator;
