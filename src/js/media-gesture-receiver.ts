import {
  MediaStateReceiverAttributes,
  MediaUIAttributes,
  MediaUIEvents,
  PointerTypes,
} from './constants.js';
import { CustomElement } from './utils/CustomElement.js';
import {
  closestComposedNode,
  getBooleanAttr,
  setBooleanAttr,
} from './utils/element-utils.js';
import { document, globalThis } from './utils/server-safe-globals.js';

const template: HTMLTemplateElement = document.createElement('template');

template.innerHTML = /*html*/ `
<style>
  :host {
    display: var(--media-control-display, var(--media-gesture-receiver-display, inline-block));
    box-sizing: border-box;
  }
</style>
`;

/**
 * @extends {HTMLElement}
 *
 * @attr {boolean} mediapaused - (read-only) Present if the media is paused.
 * @attr {string} mediacontroller - The element `id` of the media controller to connect to (if not nested within).
 *
 * @cssproperty --media-gesture-receiver-display - `display` property of gesture receiver.
 * @cssproperty --media-control-display - `display` property of control.
 */
class MediaGestureReceiver extends CustomElement {
  #mediaController;

  // NOTE: Currently "baking in" actions + attrs until we come up with
  // a more robust architecture (CJP)
  static get observedAttributes(): string[] {
    return [
      MediaStateReceiverAttributes.MEDIA_CONTROLLER,
      MediaUIAttributes.MEDIA_PAUSED,
    ];
  }

  nativeEl: HTMLElement;
  _pointerType: string;

  constructor(
    options: {
      slotTemplate?: HTMLTemplateElement;
      defaultContent?: string;
    } = {}
  ) {
    super();

    if (!this.shadowRoot) {
      // Set up the Shadow DOM if not using Declarative Shadow DOM.
      const shadow = this.attachShadow({ mode: 'open' });

      const buttonHTML = template.content.cloneNode(true);
      this.nativeEl = buttonHTML as HTMLElement;

      // Slots
      let slotTemplate = options.slotTemplate;

      if (!slotTemplate) {
        slotTemplate = document.createElement('template');
        slotTemplate.innerHTML = `<slot>${options.defaultContent || ''}</slot>`;
      }

      this.nativeEl.appendChild(slotTemplate.content.cloneNode(true));
      shadow.appendChild(buttonHTML);
    }
  }

  attributeChangedCallback(
    attrName: string,
    oldValue: string | null,
    newValue: string | null
  ): void {
    if (attrName === MediaStateReceiverAttributes.MEDIA_CONTROLLER) {
      if (oldValue) {
        this.#mediaController?.unassociateElement?.(this);
        this.#mediaController = null;
      }
      if (newValue && this.isConnected) {
        // @ts-ignore
        this.#mediaController = this.getRootNode()?.getElementById(newValue);
        this.#mediaController?.associateElement?.(this);
      }
    }
  }

  connectedCallback(): void {
    this.tabIndex = -1;
    this.setAttribute('aria-hidden', 'true');

    this.#mediaController = getMediaControllerEl(this);
    if (this.getAttribute(MediaStateReceiverAttributes.MEDIA_CONTROLLER)) {
      this.#mediaController?.associateElement?.(this);
    }

    this.#mediaController?.addEventListener('pointerdown', this);
    this.#mediaController?.addEventListener('click', this);
  }

  disconnectedCallback(): void {
    // Use cached mediaController, getRootNode() doesn't work if disconnected.
    if (this.getAttribute(MediaStateReceiverAttributes.MEDIA_CONTROLLER)) {
      this.#mediaController?.unassociateElement?.(this);
    }

    this.#mediaController?.removeEventListener('pointerdown', this);
    this.#mediaController?.removeEventListener('click', this);
    this.#mediaController = null;
  }

  handleEvent(event): void {
    const composedTarget = event.composedPath()?.[0];
    const allowList = ['video', 'media-controller'];
    if (!allowList.includes(composedTarget?.localName)) return;

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
      if (
        x < 0 ||
        y < 0 ||
        x > width ||
        y > height ||
        // In case this element has no dimensions (or display: none) return.
        (width === 0 && height === 0)
      ) {
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

  /**
   * @type {boolean} Is the media paused
   */
  get mediaPaused() {
    return getBooleanAttr(this, MediaUIAttributes.MEDIA_PAUSED);
  }

  set mediaPaused(value) {
    setBooleanAttr(this, MediaUIAttributes.MEDIA_PAUSED, value);
  }

  // NOTE: Currently "baking in" actions + attrs until we come up with
  // a more robust architecture (CJP)
  /**
   * @abstract
   * @argument {Event} e
   */
  handleTap(e) {} // eslint-disable-line

  // eslint-disable-next-line
  handleMouseClick(e) {
    const eventName = this.mediaPaused
      ? MediaUIEvents.MEDIA_PLAY_REQUEST
      : MediaUIEvents.MEDIA_PAUSE_REQUEST;
    this.dispatchEvent(
      new globalThis.CustomEvent(eventName, { composed: true, bubbles: true })
    );
  }
}

function getMediaControllerEl(controlEl) {
  const mediaControllerId = controlEl.getAttribute(
    MediaStateReceiverAttributes.MEDIA_CONTROLLER
  );
  if (mediaControllerId) {
    return controlEl.getRootNode()?.getElementById(mediaControllerId);
  }
  return closestComposedNode(controlEl, 'media-controller');
}

if (!globalThis.customElements.get('media-gesture-receiver')) {
  globalThis.customElements.define(
    'media-gesture-receiver',
    MediaGestureReceiver
  );
}

export default MediaGestureReceiver;
