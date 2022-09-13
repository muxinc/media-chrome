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
    return [MediaUIAttributes.MEDIA_CONTROLLER, MediaUIAttributes.MEDIA_PAUSED];
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

    window.addEventListener('pointerdown', this);
    window.addEventListener('click', this);
  }

  disconnectedCallback() {
    const mediaControllerId = this.getAttribute(
      MediaUIAttributes.MEDIA_CONTROLLER
    );
    if (mediaControllerId) {
      const mediaControllerEl = document.getElementById(mediaControllerId);
      mediaControllerEl?.unassociateElement?.(this);
    }

    window.removeEventListener('pointerdown', this);
    window.removeEventListener('click', this);
  }

  handleEvent(event) {
    if (event.type === 'pointerdown') {
      // Since not all browsers have updated to be spec compliant, where 'click' events should be PointerEvents,
      // we can use use 'pointerdown' to reliably determine the pointer type. (CJP).
      this._pointerType = event.pointerType;
    } else if (event.type === 'click') {
      // Cannot use composedPath or target because this is a layer on top and pointer events are disabled.
      // Attach to window and check if click is in this element's bounding box to keep <video> right-click menu.
      const { clientX, clientY } = event;
      const { left, top, width, height } = this.getBoundingClientRect();
      const x = clientX - left;
      const y = clientY - top;
      // In case this element has no dimensions (or display: none) return.
      if (x < 0 || y < 0 || x > width || y > height || (width === 0 && height === 0)) {
        return;
      }

      const { pointerType = this._pointerType } = event;
      // NOTE: While there are cases where we may have a stale this._pointerType,
      // we're guaranteed that the most recent this._pointerType will correspond
      // to the current click event definitionally. As such, this clearing is technically
      // unnecessary (CJP)
      this._pointerType = undefined;

      // NOTE: Longer term, we'll likely want to delay this to support double click/double tap (CJP)
      if (pointerType === PointerTypes.TOUCH) {
        this.handleTap(event);
        return;
      } else if (pointerType === PointerTypes.MOUSE) {
        this.handleMouseClick(event);
        return;
      }
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
