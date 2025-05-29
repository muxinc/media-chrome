/*
  <media-control-bar>

  Auto position contorls in a line and set some base colors
*/
import { MediaStateReceiverAttributes } from './constants.js';
import type MediaController from './media-controller.js';
import { namedNodeMapToObject } from './utils/element-utils.js';
import { globalThis } from './utils/server-safe-globals.js';

function getTemplateHTML(_attrs: Record<string, string>) {
  return /*html*/ `
    <style>
      :host {
        ${/* Need position to display above video for some reason */ ''}
        box-sizing: border-box;
        display: var(--media-control-display, var(--media-control-bar-display, inline-flex));
        color: var(--media-text-color, var(--media-primary-color, rgb(238 238 238)));
        --media-loading-indicator-icon-height: 44px;
      }

      ::slotted(media-time-range),
      ::slotted(media-volume-range) {
        min-height: 100%;
      }

      ::slotted(media-time-range),
      ::slotted(media-clip-selector) {
        flex-grow: 1;
      }

      ::slotted([role="menu"]) {
        position: absolute;
      }
    </style>

    <slot></slot>
  `;
}

/**
 * @attr {string} mediacontroller - The element `id` of the media controller to connect to (if not nested within).
 *
 * @cssproperty --media-primary-color - Default color of text and icon.
 * @cssproperty --media-secondary-color - Default color of button background.
 * @cssproperty --media-text-color - `color` of button text.
 *
 * @cssproperty --media-control-bar-display - `display` property of control bar.
 * @cssproperty --media-control-display - `display` property of control.
 */
class MediaControlBar extends globalThis.HTMLElement {
  static shadowRootOptions = { mode: 'open' as ShadowRootMode };
  static getTemplateHTML = getTemplateHTML;

  #mediaController: MediaController | null;

  static get observedAttributes(): string[] {
    return [MediaStateReceiverAttributes.MEDIA_CONTROLLER];
  }

  constructor() {
    super();

    if (!this.shadowRoot) {
      // Set up the Shadow DOM if not using Declarative Shadow DOM.
      this.attachShadow((this.constructor as typeof MediaControlBar).shadowRootOptions);

      const attrs = namedNodeMapToObject(this.attributes);
      this.shadowRoot.innerHTML = (this.constructor as typeof MediaControlBar).getTemplateHTML(attrs);
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
    const mediaControllerId = this.getAttribute(
      MediaStateReceiverAttributes.MEDIA_CONTROLLER
    );
    if (mediaControllerId) {
      // @ts-ignore
      this.#mediaController = (this.getRootNode() as Document)?.getElementById(
        mediaControllerId
      );
      this.#mediaController?.associateElement?.(this);
    }
  }

  disconnectedCallback(): void {
    // Use cached mediaController, getRootNode() doesn't work if disconnected.
    this.#mediaController?.unassociateElement?.(this);
    this.#mediaController = null;
  }
}

if (!globalThis.customElements.get('media-control-bar')) {
  globalThis.customElements.define('media-control-bar', MediaControlBar);
}

export default MediaControlBar;
