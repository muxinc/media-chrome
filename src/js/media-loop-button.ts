import { MediaChromeButton } from './media-chrome-button.js';
import { globalThis } from './utils/server-safe-globals.js';
import { MediaUIEvents, MediaUIAttributes } from './constants.js';
import { getBooleanAttr, setBooleanAttr } from './utils/element-utils.js';
import { t } from './utils/i18n.js';

/**
 * @attr {boolean} medialoop - (read-only) Indicates whether looping is currently enabled.
 */

function getSlotTemplateHTML(_attrs: Record<string, string>) {
  return /*html*/ `
      <style>
        :host {
          min-width: 4ch;
          padding: var(--media-button-padding, var(--media-control-padding, 10px 5px));
          width: 100%;
          display: grid;
          grid-template-columns: 1fr auto;
          gap: 1rem;
          font-weight: var(--media-button-font-weight, normal);
        }

        #checked-indicator {
          display: none;
        }

        :host([${MediaUIAttributes.MEDIA_LOOP}]) #checked-indicator {
          display: block;
        }
      </style>
      
      <span id="icon">
     </span>

      <div id="checked-indicator">
        <svg aria-hidden="true" viewBox="0 1 24 24" part="checked-indicator indicator">
          <path d="m10 15.17 9.193-9.191 1.414 1.414-10.606 10.606-6.364-6.364 1.414-1.414 4.95 4.95Z"/>
        </svg>
      </div>
    `;
}

function getTooltipContentHTML() {
  return t('Loop');
}

class MediaLoopButton extends MediaChromeButton {
  static getSlotTemplateHTML = getSlotTemplateHTML;
  static getTooltipContentHTML = getTooltipContentHTML;

  static get observedAttributes() {
    return [...super.observedAttributes, MediaUIAttributes.MEDIA_LOOP];
  }

  container: HTMLElement | null = null;

  connectedCallback() {
    super.connectedCallback();
    this.container = this.shadowRoot?.querySelector('#icon') || null;
    if (this.container) {
      this.container.textContent = t('Loop');
    }
  }

  attributeChangedCallback(
    attrName: string,
    oldValue: string | null,
    newValue: string | null
  ): void {
    super.attributeChangedCallback(attrName, oldValue, newValue);
    if (attrName === MediaUIAttributes.MEDIA_LOOP && this.container) {
      this.setAttribute(
        'aria-checked',
        this.mediaLoop ? 'true' : 'false'
      );
    }
  }

  get mediaLoop() {
    return getBooleanAttr(this, MediaUIAttributes.MEDIA_LOOP);
  }

  set mediaLoop(value: boolean) {
    setBooleanAttr(this, MediaUIAttributes.MEDIA_LOOP, value);
  }

  handleClick() {
    const looping = !this.mediaLoop;
    const evt = new globalThis.CustomEvent(MediaUIEvents.MEDIA_LOOP_REQUEST, {
      composed: true,
      bubbles: true,
      detail: looping,
    });
    this.dispatchEvent(evt);
  }
}

if (!globalThis.customElements.get('media-loop-button')) {
  globalThis.customElements.define('media-loop-button', MediaLoopButton);
}

export default MediaLoopButton;
