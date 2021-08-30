import { MediaUIAttributes } from './constants.js';
import { defineCustomElement } from './utils/defineCustomElement.js';
import { Window as window, Document as document } from './utils/server-safe-globals.js';

const template = document.createElement('template');

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

const ButtonPressedKeys = ['Enter', ' '];

class MediaChromeButton extends window.HTMLElement {
  
  static get observedAttributes() {
    return [MediaUIAttributes.MEDIA_CONTROLLER];
  }

  constructor(options={}) {
    super();

    const shadow = this.attachShadow({ mode: 'open' });

    const buttonHTML = template.content.cloneNode(true);
    this.nativeEl = buttonHTML.querySelector('div');
    
    this.setAttribute('role', "button");
    this.setAttribute('tabindex', 0);

    // Slots
    let slotTemplate = options.slotTemplate;

    if (!slotTemplate) {
      slotTemplate = document.createElement('template');
      slotTemplate.innerHTML = `<slot>${options.defaultContent || ''}</slot>`;
    }

    this.nativeEl.appendChild(slotTemplate.content.cloneNode(true));

    shadow.appendChild(buttonHTML);

    this.addEventListener('click', e => {
      this.handleClick(e);
    });

    // NOTE: There are definitely some "false positive" cases with multi-key pressing,
    // but this should be good enough for most use cases.
    const keyUpHandler = e => {
      const { key } = e;
      if (!ButtonPressedKeys.includes(key)) {
        this.removeEventListener('keyup', keyUpHandler);
        return;
      }

      this.handleClick(e);
    };

    this.addEventListener('keydown', e => {
      const { metaKey, altKey, key } = e;
      if (metaKey || altKey || !ButtonPressedKeys.includes(key)) {
        this.removeEventListener('keyup', keyUpHandler);
        return;
      }
      this.addEventListener('keyup', keyUpHandler);
    });
  }

  attributeChangedCallback(attrName, oldValue, newValue) {
    if (attrName === MediaUIAttributes.MEDIA_CONTROLLER) {
      if (oldValue) {
        const mediaControllerEl = document.getElementById(oldValue);
        mediaControllerEl?.unassociateDescendantsOf?.(this);
      }
      if (newValue) {
        const mediaControllerEl = document.getElementById(newValue);
        mediaControllerEl?.associateDescendantsOf?.(this);
      }
    }
  }

  connectedCallback() {
    const mediaControllerId = this.getAttribute(MediaUIAttributes.MEDIA_CONTROLLER);
    if (mediaControllerId) {
      const mediaControllerEl = document.getElementById(mediaControllerId);
      mediaControllerEl?.associateDescendantsOf?.(this);
    }
  }

  disconnectedCallback() {
    const mediaControllerSelector = this.getAttribute(MediaUIAttributes.MEDIA_CONTROLLER);
    if (mediaControllerSelector) {
      const mediaControllerEl = document.getElementById(mediaControllerId);
      mediaControllerEl?.unassociateDescendantsOf?.(this);
    }
  }

  handleClick() {}
}

defineCustomElement('media-chrome-button', MediaChromeButton);

export default MediaChromeButton;
