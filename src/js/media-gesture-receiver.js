import { MediaUIAttributes, MediaUIEvents, PointerTypes } from './constants.js';
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
    box-sizing: border-box;
  }
</style>
`;

class MediaGestureReceiver extends window.HTMLElement {
  // NOTE: Currently "baking in" actions + attrs until we come up with
  // a more robust architecture (CJP)
  static get observedAttributes() {
    return [MediaUIAttributes.MEDIA_CONTROLLER, MediaUIAttributes.MEDIA_PAUSED, MediaUIAttributes.MEDIA_CLICK];
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

    if (attrName === MediaUIAttributes.MEDIA_CLICK && newValue) {
      const [pointerType, offsets] = newValue.split(' ');
      const [offsetX, offsetY] = offsets.split(':');
      const { x, y, width, height } = this.getBoundingClientRect();
      if (offsetX >= x && offsetY >= y && offsetX <= width && offsetY <= height) {
        // NOTE: Longer term, we'll likely want to delay this to support double click/double tap (CJP)
        if (pointerType === PointerTypes.TOUCH) {
          this.handleTap();
          return;
        } else if (pointerType === PointerTypes.MOUSE) {
          this.handleMouseClick();
          return;
        }
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
    const mediaControllerId = this.getAttribute(
      MediaUIAttributes.MEDIA_CONTROLLER
    );
    if (mediaControllerId) {
      const mediaControllerEl = document.getElementById(mediaControllerId);
      mediaControllerEl?.unassociateElement?.(this);
    }
  }

  // NOTE: Currently "baking in" actions + attrs until we come up with
  // a more robust architecture (CJP)
  handleTap() {}

  handleMouseClick() {
    const eventName =
      this.getAttribute(MediaUIAttributes.MEDIA_PAUSED) != null
        ? MediaUIEvents.MEDIA_PLAY_REQUEST
        : MediaUIEvents.MEDIA_PAUSE_REQUEST;
    this.dispatchEvent(
      new window.CustomEvent(eventName, { composed: true, bubbles: true })
    );
  }
}

defineCustomElement(
  'media-gesture-receiver',
  MediaGestureReceiver
);

export default MediaGestureReceiver;
