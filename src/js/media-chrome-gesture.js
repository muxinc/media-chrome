import { MediaUIAttributes, PointerTypes } from './constants.js';
import { defineCustomElement } from './utils/defineCustomElement.js';
import {
  Window as window,
  Document as document,
} from './utils/server-safe-globals.js';

const template = document.createElement('template');

template.innerHTML = `
<style>
  :host {
    display: inline-block;
    width: auto;
    height: auto;
    box-sizing: border-box;

    pointer-events: auto;
  }
</style>
`;

const allPointerTypes = Object.values(PointerTypes);

class MediaChromeGesture extends window.HTMLElement {
  static get observedAttributes() {
    return [MediaUIAttributes.MEDIA_CONTROLLER, 'pointer-types'];
  }

  constructor(options = {}) {
    super();

    const shadow = this.attachShadow({ mode: 'open' });

    const buttonHTML = template.content.cloneNode(true);
    this.nativeEl = buttonHTML;

    // Slots
    let slotTemplate = options.slotTemplate;

    if (!slotTemplate) {
      slotTemplate = document.createElement('template');
      slotTemplate.innerHTML = `<slot>${options.defaultContent || ''}</slot>`;
    }

    this.nativeEl.appendChild(slotTemplate.content.cloneNode(true));

    shadow.appendChild(buttonHTML);

    this._pointerType = undefined;
    const pointerDownHandler = (e) => {
      // Since not all browsers have updated to be spec compliant, where 'click' events should be PointerEvents,
      // we can use use 'pointerdown' to reliably determine the pointer type. (CJP).
      this._pointerType = e.pointerType;
    };

    this.addEventListener('pointerdown', pointerDownHandler);

    this.addEventListener('click', (event) => {
      if (!event.pointerType) {
        event.pointerType = this._pointerType;
      }
      const { pointerType } = event;
      // NOTE: While there are cases where we may have a stale this._pointerType,
      // we're guaranteed that the most recent this._pointerType will correspond
      // to the current click event definitionally. As such, this clearing is technically
      // unnecessary (CJP)
      this._pointerType = undefined;
      const { pointerTypes } = this;
      if (!pointerTypes.includes(pointerType)) return;
      this.handleClick(event);
    });
  }

  get pointerTypes() {
    const pointerTypesAttrVal = this.getAttribute('pointer-types');
    if (!pointerTypesAttrVal) return allPointerTypes;
    return pointerTypesAttrVal.split(' ');
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
    this.setAttribute('tabindex', -1);
    this.setAttribute('aria-hidden', true);

    const mediaControllerId = this.getAttribute(
      MediaUIAttributes.MEDIA_CONTROLLER
    );
    if (mediaControllerId) {
      const mediaControllerEl = document.getElementById(mediaControllerId);
      mediaControllerEl?.associateElement?.(this);
    }
  }

  disconnectedCallback() {
    const mediaControllerSelector = this.getAttribute(
      MediaUIAttributes.MEDIA_CONTROLLER
    );
    if (mediaControllerSelector) {
      const mediaControllerEl = document.getElementById(mediaControllerId);
      mediaControllerEl?.unassociateElement?.(this);
    }
  }

  handleClick(_event) {
    console.log(_event);
  }
}

defineCustomElement('media-chrome-gesture', MediaChromeGesture);

export default MediaChromeGesture;
